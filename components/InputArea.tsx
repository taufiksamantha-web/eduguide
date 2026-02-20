
import React, { useState, useRef } from 'react';
import { Attachment } from '../types';

interface InputAreaProps {
  onSendMessage: (text: string, attachments: Attachment[]) => void;
  disabled: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, disabled }) => {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Fix: Explicitly cast to File[] to avoid 'unknown' type errors during iteration
    const fileArray = Array.from(files) as File[];

    for (const file of fileArray) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        const newAttachment: Attachment = {
          type: file.type.startsWith('image/') ? 'image' : 'document',
          url: URL.createObjectURL(file),
          base64: base64,
          mimeType: file.type,
          name: file.name
        };
        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if ((!inputText.trim() && attachments.length === 0) || disabled) return;
    onSendMessage(inputText, attachments);
    setInputText('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl focus-within:border-sky-400/50 focus-within:bg-white/80 transition-all shadow-sm">
      {attachments.length > 0 && (
        <div className="px-4 py-3 flex flex-wrap gap-2 border-b border-slate-100">
          {attachments.map((att, idx) => (
            <div key={idx} className="relative group">
              {att.type === 'image' ? (
                <img src={att.url} alt="preview" className="w-12 h-12 object-cover rounded-lg border border-slate-100" />
              ) : (
                <div className="w-12 h-12 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-lg p-1 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span className="text-[7px] truncate w-full mt-0.5">{att.name}</span>
                </div>
              )}
              <button 
                onClick={() => removeAttachment(idx)}
                className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end p-1.5 gap-1.5">
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-50"
          title="Unggah"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,application/pdf,text/plain" 
            multiple
          />
        </button>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis pesan..."
          disabled={disabled}
          rows={1}
          className="flex-1 max-h-48 min-h-[40px] py-2.5 px-1 resize-none bg-transparent focus:outline-none text-slate-700 text-sm"
        />

        <button 
          onClick={handleSend}
          disabled={disabled || (!inputText.trim() && attachments.length === 0)}
          className={`p-2 rounded-xl transition-all flex items-center justify-center
            ${(disabled || (!inputText.trim() && attachments.length === 0))
              ? 'text-slate-200' 
              : 'text-sky-500 hover:bg-sky-50 active:scale-95'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </div>
    </div>
  );
};
