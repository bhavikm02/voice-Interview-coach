import React from 'react';
import type { Feedback, ScoreAndComment } from '../types';
import { StarIcon } from './Icons';
import Loader from './Loader';

interface ScoreCircleProps {
  label: string;
  score: number;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ label, score }) => {
    const circumference = 2 * Math.PI * 28; // 2 * pi * r
    const offset = circumference - (score / 10) * circumference;
    const colorClass = score >= 8 ? 'text-green-400' : score >= 5 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="flex flex-col items-center flex-shrink-0">
            <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
                    <circle
                        className="text-gray-700"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r="28"
                        cx="30"
                        cy="30"
                    />
                    <circle
                        className={colorClass}
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="28"
                        cx="30"
                        cy="30"
                        style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                    />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${colorClass}`}>
                    {score.toFixed(1)}
                </span>
            </div>
            <p className="mt-2 text-xs text-gray-400 uppercase tracking-wider">{label}</p>
        </div>
    );
};

const FeedbackCategory: React.FC<{ label: string; data: ScoreAndComment }> = ({ label, data }) => {
  return (
    <div className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-4">
        <ScoreCircle score={data.score} label={label} />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-300">Comment:</h4>
          <p className="text-gray-400 text-sm mb-2">{data.comment}</p>
          <h4 className="font-semibold text-cyan-300">Tip for a 10/10:</h4>
          <p className="text-cyan-400 text-sm">{data.tip}</p>
        </div>
      </div>
    </div>
  );
};

interface Props {
  feedback?: Feedback;
  isLoading?: boolean;
}

const FeedbackCard: React.FC<Props> = ({ feedback, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center min-h-[18rem]">
        <Loader text="Analyzing response..."/>
      </div>
    )
  }

  if (!feedback) {
    return (
        <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center min-h-[18rem] text-gray-500">
            <p>Your feedback will appear here after you answer.</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <StarIcon className="w-6 h-6 text-yellow-400 mr-2" />
            Performance Analysis
        </h3>
        <div className="space-y-4">
            <FeedbackCategory label="Overall" data={feedback.overall} />
            <FeedbackCategory label="Communication" data={feedback.communication} />
            <FeedbackCategory label="Answering" data={feedback.answering} />
            <FeedbackCategory label="Flow" data={feedback.flow} />
        </div>
    </div>
  );
};

export default FeedbackCard;
