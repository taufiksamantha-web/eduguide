
import React from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading, scrollRef }) => {
  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto pt-6 px-2 space-y-6 scroll-smooth"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex justify-start animate-message">
          <div className="bg-white/70 backdrop-blur-sm border border-white/40 px-4 py-3 rounded-2xl flex items-center gap-1.5 shadow-sm">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      )}
      <div className="h-10" />
    </div>
  );
};
