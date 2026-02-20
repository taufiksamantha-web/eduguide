
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('## ')) {
        return <h2 key={i} className="text-indigo-600 mb-2 mt-4">{trimmedLine.replace('## ', '')}</h2>;
      }
      if (trimmedLine.startsWith('> ')) {
        return <blockquote key={i} className="my-3">{trimmedLine.replace('> ', '')}</blockquote>;
      }
      if (trimmedLine.startsWith('---')) {
        return <hr key={i} className="my-4 border-slate-100" />;
      }
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        return <li key={i} className="ml-5 mb-1 list-disc text-slate-700">{trimmedLine.substring(2)}</li>;
      }
      
      if (trimmedLine === '') {
        return <div key={i} className="h-2" />;
      }

      return (
        <p key={i} className="mb-2 last:mb-0">
          {line}
        </p>
      );
    });
  };

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} animate-message`}>
      <div className={`flex flex-col max-w-[85%] ${isAssistant ? '' : 'items-end'}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isAssistant 
            ? 'bg-white/70 backdrop-blur-sm border border-white/40 text-slate-800 shadow-sm' 
            : 'bg-sky-500/90 backdrop-blur-sm text-white shadow-md shadow-sky-500/20'}`}>
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {message.attachments.map((att, idx) => (
                <div key={idx} className="relative group">
                  {att.type === 'image' ? (
                    <img 
                      src={att.url} 
                      alt={att.name} 
                      className="h-24 w-auto rounded-lg object-cover border border-slate-100 shadow-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span className="text-[10px] font-medium truncate max-w-[100px]">{att.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="prose prose-sm max-w-none">
            {renderContent(message.content)}
          </div>
        </div>
        
        <span className="text-[9px] text-slate-400 mt-1 px-1 uppercase tracking-wider">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};
