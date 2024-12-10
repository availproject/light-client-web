import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const getLogStyle = (log: string) => {
  const lowercaseLog = log.toLowerCase();
  
  if (lowercaseLog.includes('error')) {
    return { emoji: '❌', textColor: 'text-red-400' };
  }
  if (lowercaseLog.includes('success') || lowercaseLog.includes('✅')) {
    return { emoji: '✅', textColor: 'text-green-400' };
  }
  if (lowercaseLog.includes('warning') || lowercaseLog.includes('‼️')) {
    return { emoji: '⚠️', textColor: 'text-gray-400' };
  }
  if (lowercaseLog.includes('initiating') || lowercaseLog.includes('started')) {
    return { emoji: '🚀', textColor: 'text-blue-400' };
  }
  if (lowercaseLog.includes('processing') || lowercaseLog.includes('querying')) {
    return { emoji: '⚙️', textColor: 'text-gray-100' };
  }
  if (lowercaseLog.includes('generated') || lowercaseLog.includes('fetched')) {
    return { emoji: '📦', textColor: 'text-gray-100' };
  }
  return { emoji: "", textColor: 'text-gray-400' };
};

interface LogDisplayProps {
  logs?: string[];
}

const LogDisplay: React.FC<LogDisplayProps> = ({ logs = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const logsArray = Array.isArray(logs) ? logs : [];

  return (
    <div className="space-y-2 rounded-md mx-4 w-full">
      <div className="bg-[#292E3A] rounded-md overflow-hidden shadow-xl">
        {/* Title bar */}
        <div className="bg-[#292E3A] border-b border-gray-700 px-4 py-2 flex items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-opacity-60 text-white font-light font-mono">terminal.lightclient.avail</span>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {/* Log content */}
        {isExpanded && (
          <div className="p-4 font-mono space-y-2 min-h-[200px] transition-all duration-300">
            {logsArray.map((log, index) => {
              const { emoji, textColor } = getLogStyle(log);
              return (
                <div
                  key={index}
                  className={`${textColor} text-sm lg:text-md flex items-start gap-2`}
                >
                  <span className="text-green-400 select-none">{'>'}</span>
                  {emoji && <span className="select-none w-6">{emoji}</span>}
                  <span className="flex-1">{log}</span>
                </div>
              );
            })}
            {logsArray.length === 0 && (
              <div className="text-gray-400 text-sm flex items-center gap-2">
                <span className="text-green-400">{'>'}</span>
                <span>💤</span>
                <span>No logs to display</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogDisplay;