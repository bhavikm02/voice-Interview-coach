import React from 'react';
import type { InterviewResult, AverageScores, Transcript } from '../types';
import { TrendingUpIcon, StarIcon, BotIcon, UserIcon, SparklesIcon } from './Icons';
import FeedbackCard from './FeedbackCard';

const TrendChart: React.FC<{ history: InterviewResult[] }> = ({ history }) => {
  const scores = history.map(h => h.averageScores.overall);
  if (scores.length < 2) {
    return <p className="text-gray-500 text-center mt-8">Complete at least two interviews to see your trend.</p>;
  }

  const width = 500;
  const height = 200;
  const padding = 40;
  
  const points = scores.map((score, i) => {
    const x = (i / (scores.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((score / 10) * (height - padding * 2));
    return `${x},${y}`;
  }).join(' ');

  const xLabels = history.map((h, i) => ({
    x: (i / (scores.length - 1)) * (width - padding * 2) + padding,
    label: new Date(h.date).toLocaleDateString()
  }));

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {[0, 2, 4, 6, 8, 10].map(score => {
          const y = height - padding - ((score / 10) * (height - padding * 2));
          return (
            <g key={score}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.1)" />
              <text x={padding - 10} y={y + 5} fill="#9ca3af" fontSize="10" textAnchor="end">{score}</text>
            </g>
          )
        })}
        {xLabels.map(({x, label}, i) => (
             <text key={i} x={x} y={height - padding + 20} fill="#9ca3af" fontSize="10" textAnchor="middle">{label}</text>
        ))}
        <polyline fill="none" stroke="#06b6d4" strokeWidth="2" points={points} />
        {points.split(' ').map((p, i) => { const [x, y] = p.split(','); return <circle key={i} cx={x} cy={y} r="3" fill="#06b6d4" />; })}
      </svg>
    </div>
  );
};

const ScoreBreakdown: React.FC<{ scores: AverageScores }> = ({ scores }) => {
  const categories: (keyof Omit<AverageScores, 'overall'>)[] = ['technical', 'communication', 'answering', 'flow'];
  return (
    <div className="space-y-4">
      {categories.map(cat => {
        const score = scores[cat];
        const color = score >= 8 ? 'bg-green-500' : score >= 5 ? 'bg-yellow-500' : 'bg-red-500';
        return (
          <div key={cat}>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="capitalize text-gray-300">{cat === 'technical' ? 'Technical Depth' : cat}</span>
              <span className="font-semibold text-white">{score.toFixed(1)} / 10</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${score * 10}%` }}></div>
            </div>
          </div>
        )
      })}
    </div>
  );
};

const MissedConcepts: React.FC<{ concepts: string[] }> = ({ concepts }) => {
  if (concepts.length === 0) {
    return <p className="text-gray-500">No specific areas for improvement were identified. Great job!</p>;
  }
  return (
    <ul className="space-y-3">
      {concepts.map((concept, i) => (
        <li key={i} className="flex items-start">
          <span className="text-cyan-400 font-bold mr-3">{i + 1}.</span>
          <span className="text-gray-300">{concept}</span>
        </li>
      ))}
    </ul>
  );
};

const InterviewReview: React.FC<{ transcripts: Transcript[] }> = ({ transcripts }) => {
    const qaPairs: { question: Transcript; answer: Transcript | undefined }[] = [];
    for (let i = 0; i < transcripts.length; i++) {
        if (transcripts[i].speaker === 'interviewer') {
            const question = transcripts[i];
            const answer = transcripts.find(t => t.questionIndex === question.questionIndex && (t.speaker === 'user' || t.speaker === 'system'));
            qaPairs.push({ question, answer });
        }
    }
    
    const uniqueQaPairs = qaPairs.filter((pair, index, self) => 
      index === self.findIndex(p => p.question.questionIndex === pair.question.questionIndex)
    );

    if (uniqueQaPairs.length === 0) {
      return <p className="text-gray-500 text-center py-8">You didn't answer any questions in this session.</p>
    }

    return (
        <div className="space-y-8">
            {uniqueQaPairs.map(({ question, answer }) => (
                <div key={question.id}>
                    <div className="flex items-start gap-4 mb-4">
                       <div className="p-2 bg-gray-700 rounded-full mt-1"><BotIcon className="w-6 h-6 text-cyan-400" /></div>
                       <div className="flex-1 bg-gray-900 p-4 rounded-lg">
                           <h3 className="font-semibold text-gray-400">Question:</h3>
                           <p className="text-white">{question.text}</p>
                       </div>
                    </div>
                    {answer && (
                      <div className="flex items-start gap-4 ml-8 pl-6 border-l-2 border-gray-700">
                        <div className="p-2 bg-gray-700 rounded-full mt-1">
                          {answer.speaker === 'user' ? <UserIcon className="w-6 h-6 text-blue-400" /> : <SparklesIcon className="w-6 h-6 text-purple-400" />}
                        </div>
                        <div className="flex-1">
                            <div className="bg-gray-900 p-4 rounded-lg mb-4">
                              <h3 className="font-semibold text-gray-400">{answer.speaker === 'user' ? 'Your Answer:' : 'AI Generated Answer:'}</h3>
                              <p className="text-gray-300 italic">"{answer.text}"</p>
                            </div>
                            {answer.feedback && <FeedbackCard feedback={answer.feedback} />}
                            {answer.isProcessing && <p className="text-yellow-400">Evaluation for this answer is still processing.</p>}
                        </div>
                      </div>
                    )}
                </div>
            ))}
        </div>
    );
};


interface Props {
  history: InterviewResult[];
  missedConcepts: string[];
  onRestart: () => void;
}

const Dashboard: React.FC<Props> = ({ history, missedConcepts, onRestart }) => {
  const latestResult = history[history.length - 1];

  if (!latestResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4">No data available</h1>
        <p className="text-lg text-gray-300 mb-8">Complete an interview to see your performance dashboard.</p>
        <button onClick={onRestart} className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors">Start New Interview</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 md:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Interview Summary</h1>
          <button onClick={onRestart} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors">Start New Interview</button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Question & Answer Review</h2>
                <InterviewReview transcripts={latestResult.transcripts} />
            </section>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <section className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><StarIcon className="w-6 h-6 text-yellow-400"/> Overall Performance</h2>
              <div className="text-center my-6">
                <p className="text-gray-400 text-sm">Average Score</p>
                <p className="text-6xl font-bold text-cyan-400">{latestResult.averageScores.overall.toFixed(1)}</p>
              </div>
              <ScoreBreakdown scores={latestResult.averageScores} />
            </section>
            
            <section className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">AI-Identified Improvement Areas</h2>
              <MissedConcepts concepts={missedConcepts} />
            </section>
          </div>

          <section className="lg:col-span-3 bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><TrendingUpIcon className="w-6 h-6 text-cyan-400"/> Score Trend</h2>
            <TrendChart history={history} />
          </section>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;