import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { InterviewConfig, Transcript, Feedback } from '../types';
import { MicrophoneIcon, StopIcon, BotIcon, UserIcon, ChevronLeftIcon, ChevronRightIcon, RetryIcon, SparklesIcon, ClockIcon } from './Icons';
import FeedbackCard from './FeedbackCard';
import Loader from './Loader';

// Helper to convert Blob to Base64
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error('Failed to convert blob to base64.'));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};

const INTERVIEW_STATUS = {
    READY: 'Click the mic to answer.',
    LISTENING: 'Listening... Click stop when done.',
    TRANSCRIBING: 'Transcribing your answer...',
    ANALYZING: 'Analyzing your response...',
    ERROR: 'An error occurred. Please refresh.',
};

const InterviewScreen: React.FC<{ config: InterviewConfig, questions: string[], onEndInterview: (transcripts: Transcript[]) => void }> = ({ config, questions, onEndInterview }) => {
    const [status, setStatus] = useState(INTERVIEW_STATUS.READY);
    const [isRecording, setIsRecording] = useState(false);
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [aiAnswer, setAiAnswer] = useState<string | null>(null);
    const [isAiAnswering, setIsAiAnswering] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const mediaStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(prevTime => prevTime + 1);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);
    
    const evaluateResponse = useCallback(async (question: string, answer: string, answerId: number) => {
        setStatus(INTERVIEW_STATUS.ANALYZING);
        setCurrentFeedback(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const scoreAndCommentSchema = {
                type: Type.OBJECT,
                properties: {
                    score: { type: Type.NUMBER, description: 'Score out of 10 for the category.' },
                    comment: { type: Type.STRING, description: 'Detailed, constructive comment on the performance in this category.' },
                    tip: { type: Type.STRING, description: 'A specific, actionable tip to achieve a perfect 10 in this category.' },
                },
                required: ['score', 'comment', 'tip']
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are an expert DevOps and SRE interview evaluator. Analyze the user's answer to the given interview question. For each of the five categories (Overall, Technical Depth & Accuracy, Communication, Answering, Flow), provide: 1. A score from 1 to 10. 2. A detailed, constructive comment. 3. A specific, actionable tip to get a perfect 10.

                Evaluation Criteria:
                - Technical Depth & Accuracy: Assess the factual correctness and depth of the technical knowledge. A score of 1 means the answer is fundamentally incorrect (e.g., "A Pod runs on multiple nodes"). A score of 10 means the answer is 100% accurate, specific, and nuanced (e.g., "A Pod can't span nodes, but a Service can span Pods...").
                - Communication: Evaluate the clarity and structure of the explanation, not English grammar. Focus on the ability to explain complex technical concepts in simple, direct language.
                - Answering: Did the user directly answer the question that was asked?
                - Flow: Was the answer well-structured and easy to follow?
                - Overall: An overall assessment of the complete answer.

                Interview Question: "${question}"
                User's Answer: "${answer}"

                Respond ONLY with a JSON object. Do not add any other text or markdown formatting.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            overall: scoreAndCommentSchema,
                            communication: scoreAndCommentSchema,
                            answering: scoreAndCommentSchema,
                            flow: scoreAndCommentSchema,
                            technical: scoreAndCommentSchema,
                        },
                        required: ['overall', 'communication', 'answering', 'flow', 'technical']
                    }
                }
            });
            const feedback = JSON.parse(response.text) as Feedback;
            setCurrentFeedback(feedback);
            
            setTranscripts(prev => prev.map(t => t.id === answerId ? { ...t, feedback, isProcessing: false } : t));
        } catch (error) {
            console.error('Evaluation error:', error);
            setTranscripts(prev => prev.map(t => t.id === answerId ? { ...t, isProcessing: false, text: `${t.text} (Evaluation failed)` } : t));
        } finally {
            setStatus(INTERVIEW_STATUS.READY);
        }
    }, []);

    const transcribeAndEvaluate = async (audioBlob: Blob) => {
        setStatus(INTERVIEW_STATUS.TRANSCRIBING);
        try {
            const base64Audio = await blobToBase64(audioBlob);

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const audioPart = {
                inlineData: {
                    mimeType: audioBlob.type,
                    data: base64Audio,
                },
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [audioPart, { text: "Transcribe this audio recording of an interview answer accurately." }] },
            });

            const answer = response.text.trim();
            if (answer) {
                const question = questions[currentQuestionIndex];
                const questionId = Date.now();
                const answerId = questionId + 1;

                setTranscripts(prev => [
                    ...prev.filter(t => t.questionIndex !== currentQuestionIndex),
                    { id: questionId, speaker: 'interviewer', text: question, questionIndex: currentQuestionIndex },
                    { id: answerId, speaker: 'user', text: answer, isProcessing: true, questionIndex: currentQuestionIndex }
                ]);
                await evaluateResponse(question, answer, answerId);
            } else {
                setStatus(INTERVIEW_STATUS.READY);
                alert("Could not transcribe audio. Please try speaking more clearly or check your microphone.");
            }
        } catch (error) {
            console.error('Transcription error:', error);
            setStatus(INTERVIEW_STATUS.ERROR);
        }
    };


    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
         if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        setIsRecording(false);
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                if (audioChunksRef.current.length > 0) {
                    const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
                    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                    transcribeAndEvaluate(audioBlob);
                } else {
                    setStatus(INTERVIEW_STATUS.READY);
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setStatus(INTERVIEW_STATUS.LISTENING);
            setCurrentFeedback(null);
            setAiAnswer(null);
        } catch (error) {
            console.error('Microphone access denied:', error);
            setStatus(INTERVIEW_STATUS.ERROR);
            alert("Microphone access is required. Please allow microphone access and refresh the page.");
        }
    };

    const toggleRecording = () => isRecording ? stopRecording() : startRecording();

    const handleRetry = () => {
        setCurrentFeedback(null);
        setAiAnswer(null);
        setStatus(INTERVIEW_STATUS.READY);
        setTranscripts(prev => prev.filter(t => t.questionIndex !== currentQuestionIndex));
    };

    const handleAnswerByAi = async () => {
        setIsAiAnswering(true);
        setAiAnswer(null);
        setCurrentFeedback(null);
        setStatus('AI is generating an answer...');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const question = questions[currentQuestionIndex];
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: `You are a world-class expert in DevOps and Site Reliability Engineering, interviewing for a role at ${config.company || 'a top tech company'}. Provide an ideal, comprehensive, and well-structured answer to the following interview question: "${question}"`,
            });
            const generatedAnswer = response.text;
            setAiAnswer(generatedAnswer);
            
            const questionId = Date.now();
            const answerId = questionId + 1;
             setTranscripts(prev => [
                ...prev.filter(t => t.questionIndex !== currentQuestionIndex),
                { id: questionId, speaker: 'interviewer', text: question, questionIndex: currentQuestionIndex },
                { id: answerId, speaker: 'system', text: generatedAnswer, questionIndex: currentQuestionIndex }
            ]);

        } catch (error) {
            console.error('AI answering error:', error);
            setAiAnswer('Sorry, I was unable to generate an answer.');
        } finally {
            setIsAiAnswering(false);
            setStatus('Ready for the next question.');
        }
    };
    
    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentFeedback(null);
            setAiAnswer(null);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setCurrentFeedback(null);
            setAiAnswer(null);
        }
    };

    useEffect(() => {
        return () => {
            if (isRecording) stopRecording();
        };
    }, [isRecording, stopRecording]);

    const transcriptListRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (transcriptListRef.current) {
            transcriptListRef.current.scrollTop = transcriptListRef.current.scrollHeight;
        }
    }, [transcripts]);
    
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white font-sans overflow-hidden">
            <div className="flex flex-col w-full md:w-1/2 lg:w-3/5 p-6 border-r border-gray-700">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-cyan-400">Interview Transcript</h2>
                    <div className="flex items-center gap-2 text-lg font-mono bg-gray-800 px-3 py-1 rounded-md">
                        <ClockIcon className="w-5 h-5 text-gray-400" />
                        <span>{formatTime(elapsedTime)}</span>
                    </div>
                </div>
                <div ref={transcriptListRef} className="flex-grow space-y-6 overflow-y-auto pr-4">
                   {transcripts.map((t) => (
                       <div key={t.id} className={`flex items-start gap-4 ${t.speaker === 'user' ? 'justify-end' : ''}`}>
                           {t.speaker === 'interviewer' && <div className="p-2 bg-gray-700 rounded-full"><BotIcon className="w-6 h-6 text-cyan-400" /></div>}
                           {t.speaker === 'system' && <div className="p-2 bg-gray-700 rounded-full"><SparklesIcon className="w-6 h-6 text-purple-400" /></div>}
                           <div className={`max-w-xl p-4 rounded-xl ${t.speaker === 'user' ? 'bg-blue-600 rounded-br-none' : t.speaker === 'system' ? 'bg-purple-800 rounded-bl-none' : 'bg-gray-800 rounded-bl-none'}`}>
                               <p className="whitespace-pre-wrap">{t.text}</p>
                           </div>
                           {t.speaker === 'user' && <div className="p-2 bg-gray-700 rounded-full"><UserIcon className="w-6 h-6 text-blue-400" /></div>}
                       </div>
                   ))}
                </div>
            </div>

            <div className="flex flex-col w-full md:w-1/2 lg:w-2/5 p-6 justify-between">
                <div className="flex-grow overflow-y-auto pr-2">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-cyan-400 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</h2>
                        <p className="bg-gray-800 p-4 rounded-lg text-lg min-h-[6rem]">{questions[currentQuestionIndex]}</p>
                    </div>
                    
                    <h2 className="text-xl font-bold text-cyan-400 mb-2">Feedback & Analysis</h2>
                    {status === INTERVIEW_STATUS.TRANSCRIBING && (
                        <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center min-h-[18rem]">
                            <Loader text="Transcribing your answer..." />
                        </div>
                    )}
                    {status === INTERVIEW_STATUS.ANALYZING && <FeedbackCard isLoading={true} />}
                    {currentFeedback && !aiAnswer && <FeedbackCard feedback={currentFeedback} />}
                    {isAiAnswering && (
                        <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center min-h-[18rem]">
                            <Loader text="Generating ideal answer..." />
                        </div>
                    )}
                    {aiAnswer && (
                        <div className="bg-gray-800 rounded-lg p-6 min-h-[18rem] text-gray-300">
                            <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2"><SparklesIcon className="w-5 h-5"/> AI Generated Answer:</h4>
                            <p className="whitespace-pre-wrap">{aiAnswer}</p>
                        </div>
                    )}
                    {!currentFeedback && status !== INTERVIEW_STATUS.ANALYZING && status !== INTERVIEW_STATUS.TRANSCRIBING && !aiAnswer && !isAiAnswering && (
                         <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center min-h-[18rem] text-gray-500">
                            <p>{isRecording ? '...' : 'Your feedback will appear here.'}</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center space-y-4 pt-6 border-t border-gray-700 flex-shrink-0">
                    <p className="text-gray-400 h-6">{status}</p>
                    <div className="flex items-center justify-between w-full max-w-sm">
                        <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0 || isRecording || isAiAnswering} className="p-4 bg-gray-700 rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"><ChevronLeftIcon className="w-6 h-6"/></button>
                        
                        <div className="flex items-center justify-center gap-4">
                           {/* Ready to Answer */}
                           {!isRecording && !currentFeedback && !aiAnswer && (
                                <>
                                    <button onClick={handleAnswerByAi} disabled={isAiAnswering} className="p-4 bg-purple-600 rounded-full hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition" title="Answer with AI">
                                        <SparklesIcon className="w-6 h-6"/>
                                    </button>
                                    <button
                                        onClick={toggleRecording}
                                        disabled={status === INTERVIEW_STATUS.ERROR || status === INTERVIEW_STATUS.ANALYZING || status === INTERVIEW_STATUS.TRANSCRIBING || isAiAnswering}
                                        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed`}>
                                        <MicrophoneIcon className="w-8 h-8 text-white" />
                                    </button>
                                </>
                           )}

                           {/* Recording */}
                           {isRecording && (
                                <button onClick={toggleRecording} className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 bg-red-600 hover:bg-red-700`}>
                                    <StopIcon className="w-8 h-8 text-white" />
                                    <span className="absolute w-full h-full rounded-full bg-red-500 animate-ping opacity-75"></span>
                                </button>
                           )}

                           {/* Feedback Shown */}
                           {currentFeedback && !isRecording && (
                                <button onClick={handleRetry} className="flex items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
                                    <RetryIcon className="w-5 h-5"/> Retry
                                </button>
                           )}

                           {/* AI Answer Shown */}
                           {aiAnswer && !isAiAnswering && (
                                <div className="text-center h-20 flex items-center justify-center">
                                    <p className="text-green-400 font-semibold px-4">AI Answered</p>
                                </div>
                           )}
                        </div>

                         <button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1 || isRecording || isAiAnswering} className="p-4 bg-gray-700 rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"><ChevronRightIcon className="w-6 h-6"/></button>
                    </div>
                     <button
                        onClick={() => onEndInterview(transcripts)}
                        className="text-gray-400 hover:text-white transition-colors text-sm pt-2"
                    >
                        End Interview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewScreen;
