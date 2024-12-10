import React from 'react';

interface LogDisplayProps {
  logs?: string[];
}

const LogDisplay: React.FC<LogDisplayProps> = ({ logs = [] }) => {
  const logsArray = Array.isArray(logs) ? logs : [];

  return (
    <>
    
    <div className="space-y-2 p-4 bg-[#292E3A] rounded-md mx-4">
    <h1 className='text-opacity-60 text-white font-light font-mono'>LOGS</h1>
      {logsArray.map((log, index) => (
        <div 
          key={index} 
          className="text-white text-sm lg:text-md font-mono"
        >
          <span className="text-green-400">{`>`}</span> {log}
        </div>
      ))}
      {logsArray.length === 0 && (
        <div className="text-gray-400 text-sm">No logs to display</div>
      )}
    </div>
    </>
  );
};

export default LogDisplay;