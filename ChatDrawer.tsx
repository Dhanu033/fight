import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Heart, Smile, Sparkles, MessageCircle } from 'lucide-react';
import { ChatMessage, CharacterRole } from '../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  myRole: CharacterRole;
  boyName: string;
  girlName: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  myRole,
  boyName,
  girlName,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const quickMessages = [
    'Good morning sunshine! ☀️',
    'Wake up sleepyhead! ⏰',
    'I love you 3000 ❤️',
    'Pancakes are ready! 🥞',
    'Miss you so much! 💕',
    'Ready for a sparring match? 🥋',
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-80 max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col border-l-4 border-pink-200">
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <span className="font-extrabold text-xs">Couple Live Whisper</span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Quick Emote / Message chips */}
      <div className="p-2 bg-pink-50 border-b border-pink-100 flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickMessages.map((msg, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(msg)}
            className="px-2.5 py-1 bg-white hover:bg-rose-100 border border-pink-200 rounded-full text-[10px] font-bold text-rose-700 whitespace-nowrap shadow-xs cursor-pointer transition"
          >
            {msg}
          </button>
        ))}
      </div>

      {/* Message history */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50">
        {messages.map((m) => {
          const isMe = m.sender === myRole;
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-[9px] font-bold text-slate-400 mb-0.5 px-1">
                {m.senderName} • {m.timestamp}
              </span>
              <div
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs font-medium shadow-sm leading-relaxed ${
                  isMe
                    ? 'bg-rose-500 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Whisper sweet words..."
          maxLength={150}
          className="flex-1 px-3 py-2 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-3.5 py-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow cursor-pointer transition flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
