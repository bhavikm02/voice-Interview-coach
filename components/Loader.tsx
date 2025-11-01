
import React from 'react';

const Loader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      <p className="text-cyan-400">{text}</p>
    </div>
  );
};

export default Loader;
