
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between bg-sky-500/80 backdrop-blur-xl border-x border-b border-sky-400/30 rounded-b-2xl shadow-lg shadow-sky-500/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-white tracking-tight drop-shadow-sm">Gemini AI Chatbot</h1>
        </div>
      </div>
    </header>
  );
};
