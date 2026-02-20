
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { InputArea } from './components/InputArea';
import { Message, Attachment } from './types';
import { generateEduResponse } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Halo! Aku Gemini AI Chatbot, asisten cerdasmu. Aku siap membantumu menjawab pertanyaan, menganalisis gambar, atau membedah dokumen dengan penjelasan yang ringkas.\n\nApa yang bisa aku bantu hari ini?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleSendMessage = async (text: string, attachments: Attachment[]) => {
    if (!text.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      attachments: attachments,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await generateEduResponse(text, attachments, history);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || 'Maaf, aku mengalami kendala teknis saat memproses jawaban. Bisa kamu ulangi pertanyaannya?',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Waduh, sepertinya ada gangguan koneksi. Coba lagi sebentar ya!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-transparent text-slate-900 overflow-hidden">
      <Header />
      
      <main className="flex-1 overflow-hidden relative flex flex-col max-w-2xl mx-auto w-full border-x border-white/40 bg-white/40 backdrop-blur-2xl shadow-2xl shadow-slate-200/50">
        <ChatContainer 
          messages={messages} 
          isLoading={isLoading} 
          scrollRef={scrollRef} 
        />
        
        <div className="pb-8 pt-2 px-4">
          <InputArea 
            onSendMessage={handleSendMessage} 
            disabled={isLoading} 
          />
        </div>
      </main>
    </div>
  );
};

export default App;
