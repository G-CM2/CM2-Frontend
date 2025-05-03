import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="w-full bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 hover:text-indigo-200 transition-colors">
          <div className="bg-white p-1.5 rounded-full shadow-sm">
            <img src="/logo.svg" alt="CM2 로고" className="w-10 h-10" />
          </div>
          <h1 className="text-xl font-extrabold tracking-wide text-white drop-shadow-sm">CM2</h1>
        </Link>
      </div>
    </header>
  );
}; 