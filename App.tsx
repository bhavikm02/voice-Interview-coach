import React, { useState, useCallback, useEffect } from 'react';
// FIX: Import `Type` for use in `responseSchema`.
import { GoogleGenAI, Type } from '@google/genai';
import type { InterviewConfig, InterviewState, Transcript, InterviewResult, AverageScores } from './types';
import InterviewSetup from './components/InterviewSetup';
import InterviewScreen from './components/InterviewScreen';
import Dashboard from './components/Dashboard';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [interviewState, setInterviewState] = useState<InterviewState>('setup');
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<InterviewResult[]>([]);
  const [missedConcepts, setMissedConcepts] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('interviewHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  const startInterview = useCallback(async (config: InterviewConfig) => {
    setIsLoading(true);
    setInterviewConfig(config);
    
    if (config.questionSource === 'manual') {
      const manualQuestions = config.manualQuestions.split('\n').filter(q => q.trim() !== '');
      if (manualQuestions.length > 0) {
        setQuestions(manualQuestions);
        setInterviewState('interviewing');
      } else {
        alert("Please provide at least one manual question.");
      }
    } else {
      try {
        // FIX: Removed `as string` from `process.env.API_KEY` as per coding guidelines.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Generate 10 common DevOps and SRE interview questions specifically tailored for a company like ${config.company || 'Google'}. Focus on their known emphasis on distributed systems, scalability, and SRE principles. Include a mix of behavioral and technical questions. Return only a numbered list of questions, nothing else.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        const generatedQuestions = response.text
          .split('\n')
          .map(q => q.replace(/^\d+\.\s*/, ''))
          .filter(q => q.trim() !== '');
        
        if (generatedQuestions.length > 0) {
          setQuestions(generatedQuestions);
          setInterviewState('interviewing');
        } else {
          throw new Error("AI did not generate questions.");
        }
      } catch (error) {
        console.error("Failed to generate questions:", error);
        alert("Sorry, I couldn't generate questions. Please try again or use manual questions.");
      }
    }
    setIsLoading(false);
  }, []);

  const endInterview = useCallback(async (finalTranscripts: Transcript[]) => {
    setIsLoading(true);
    setInterviewState('finished'); // Move to finished state to show loader

    const userResponses = finalTranscripts.filter(t => t.speaker === 'user' && t.feedback);
    const avgScores: AverageScores = { overall: 0, communication: 0, answering: 0, flow: 0, technical: 0 };

    if (userResponses.length > 0) {
      userResponses.forEach(({ feedback }) => {
        avgScores.overall += feedback!.overall.score;
        avgScores.communication += feedback!.communication.score;
        avgScores.answering += feedback!.answering.score;
        avgScores.flow += feedback!.flow.score;
        avgScores.technical += feedback!.technical.score;
      });
      avgScores.overall = parseFloat((avgScores.overall / userResponses.length).toFixed(1));
      avgScores.communication = parseFloat((avgScores.communication / userResponses.length).toFixed(1));
      avgScores.answering = parseFloat((avgScores.answering / userResponses.length).toFixed(1));
      avgScores.flow = parseFloat((avgScores.flow / userResponses.length).toFixed(1));
      avgScores.technical = parseFloat((avgScores.technical / userResponses.length).toFixed(1));
    }

    const result: InterviewResult = {
      date: new Date().toISOString(),
      config: interviewConfig!,
      transcripts: finalTranscripts,
      averageScores: avgScores,
    };

    const newHistory = [...history, result];
    setHistory(newHistory);
    try {
      localStorage.setItem('interviewHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }

    try {
      const feedbackAnalyses = userResponses.map(t => {
        const fb = t.feedback;
        if (!fb) return null;
        return `Technical Accuracy: ${fb.technical.comment}\nAnswer Quality: ${fb.answering.comment}\nResponse Structure: ${fb.flow.comment}`;
      }).filter(Boolean).join('\n---\n');

      if (feedbackAnalyses) {
        // FIX: Removed `as string` from `process.env.API_KEY` as per coding guidelines.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Based on the following feedback from an interview, identify the top 3 most frequently missed technical concepts. Respond ONLY with a JSON array of strings. For example: ["Kubernetes Networking", "CI/CD Pipeline Security", "Chaos Engineering Principles"]. If you can't find any, return an empty array.
        Feedback:\n- ${feedbackAnalyses}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            // FIX: Added `responseSchema` to ensure the model returns valid JSON, as recommended by the guidelines.
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                    },
                },
            }
        });
        setMissedConcepts(JSON.parse(response.text));
      } else {
        setMissedConcepts([]);
      }
    } catch (error) {
      console.error("Failed to get missed concepts:", error);
      setMissedConcepts([]);
    }
    
    setIsLoading(false);
  }, [interviewConfig, history]);
  
  const restart = useCallback(() => {
    setInterviewConfig(null);
    setQuestions([]);
    setMissedConcepts([]);
    setInterviewState('setup');
  }, []);

  const renderContent = () => {
    switch (interviewState) {
      case 'interviewing':
        return interviewConfig && questions.length > 0 ? (
          <InterviewScreen config={interviewConfig} questions={questions} onEndInterview={endInterview} />
        ) : (
          <InterviewSetup onStart={startInterview} isLoading={isLoading} />
        );
      case 'finished':
        return isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <Loader text="Compiling your results..." />
          </div>
        ) : (
          <Dashboard history={history} missedConcepts={missedConcepts} onRestart={restart} />
        );
      case 'setup':
      default:
        return <InterviewSetup onStart={startInterview} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      {renderContent()}
    </div>
  );
};

export default App;
