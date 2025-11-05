import React, { useState } from 'react';
import type { InterviewConfig, QuestionSource, Difficulty } from '../types';
import Loader from './Loader';
import { ChevronRightIcon } from './Icons';

interface Props {
  onStart: (config: InterviewConfig) => void;
  isLoading: boolean;
}

const InterviewSetup: React.FC<Props> = ({ onStart, isLoading }) => {
  const [company, setCompany] = useState('FIS Global FinTech');
  const [role, setRole] = useState('Senior SRE');
  const [questionSource, setQuestionSource] = useState<QuestionSource>('ai');
  const [manualQuestions, setManualQuestions] = useState('');
  const [topics, setTopics] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onStart({ company, role, questionSource, manualQuestions, topics, difficulty });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 transform hover:scale-105 transition-transform duration-300">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Interview<span className="text-cyan-400">.ai</span></h1>
          <p className="text-gray-400 mt-2">Your AI-Powered DevOps & SRE Interview Coach</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">Company (Optional)</label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Google, Netflix, etc."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Senior DevOps Engineer"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>

          <div className="flex rounded-lg bg-gray-700 p-1">
            <button
              type="button"
              onClick={() => setQuestionSource('ai')}
              className={`w-1/2 py-2.5 rounded-md text-sm font-medium transition ${questionSource === 'ai' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
              AI Generated Questions
            </button>
            <button
              type="button"
              onClick={() => setQuestionSource('manual')}
              className={`w-1/2 py-2.5 rounded-md text-sm font-medium transition ${questionSource === 'manual' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
              Manual Questions
            </button>
          </div>

          {questionSource === 'ai' && (
            <div className="animate-fade-in space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level</label>
                <div className="flex rounded-lg bg-gray-700 p-1">
                  {(['Easy', 'Intermediate', 'Advanced'] as Difficulty[]).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`w-1/3 py-2.5 rounded-md text-sm font-medium transition ${difficulty === d ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="topics" className="block text-sm font-medium text-gray-300 mb-2">Key Topics (Optional)</label>
                <textarea
                  id="topics"
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  placeholder="e.g., Kubernetes, CI/CD, Terraform, Observability..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
                <p className="text-xs text-gray-500 mt-1">Provide comma-separated topics to tailor the AI questions.</p>
              </div>
            </div>
          )}

          {questionSource === 'manual' && (
            <div className="animate-fade-in">
              <label htmlFor="manualQuestions" className="block text-sm font-medium text-gray-300 mb-2">Your Questions</label>
              <textarea
                id="manualQuestions"
                value={manualQuestions}
                onChange={(e) => setManualQuestions(e.target.value)}
                placeholder="Enter one question per line..."
                rows={5}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 text-white font-bold rounded-lg transition-all duration-300 text-lg group"
            >
              {isLoading ? <Loader text="Preparing..." /> : 'Start Interview'}
              {!isLoading && <ChevronRightIcon className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewSetup;