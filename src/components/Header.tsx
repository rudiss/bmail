import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-yellow-400 rounded-sm flex items-center justify-center">
            <span className="text-white font-bold text-sm">✉</span>
          </div>
          <h1 className="text-xl font-normal text-gray-800">BMail</h1>
        </div>
      </div>
    </header>
  );
};

export default Header; 