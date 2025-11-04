export type InterviewState = 'setup' | 'interviewing' | 'finished';
export type QuestionSource = 'ai' | 'manual';

export interface InterviewConfig {
  company: string;
  role: string;
  questionSource: QuestionSource;
  manualQuestions: string;
}

export interface ScoreAndComment {
  score: number;
  comment: string;
  tip: string;
}

export interface Feedback {
  overall: ScoreAndComment;
  communication: ScoreAndComment;
  answering: ScoreAndComment;
  flow: ScoreAndComment;
  technical: ScoreAndComment;
}

export interface Transcript {
  id: number;
  speaker: 'interviewer' | 'user' | 'system';
  text: string;
  feedback?: Feedback;
  isProcessing?: boolean;
  questionIndex?: number;
}

export interface AverageScores {
  overall: number;
  communication: number;
  answering: number;
  flow: number;
  technical: number;
}

export interface InterviewResult {
  date: string; // ISO string
  config: InterviewConfig;
  transcripts: Transcript[];
  averageScores: AverageScores;
}
