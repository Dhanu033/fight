import React, { useState } from 'react';
import { X, Heart, Send, Sparkles, Pin } from 'lucide-react';
import { LoveNote, CharacterRole } from '../types';

interface LoveNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: LoveNote[];
  onPostNote: (text: string, emoji: string, color: string) => void;
  myRole: CharacterRole;
}

export const LoveNotesModal: React.FC<LoveNotesModalProps> = ({
  isOpen,
  onClose,
  notes,
  onPostNote,
  myRole,
}) => {
  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState('💌');
  const [color, setColor] = useState('pink');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onPostNote(text.trim(), emoji, color);
    setText('');
  };

  const emojis = ['💌', '❤️', '🌸', '🥞', '☕', '💋', '🧸', '✨', '🥋', '🐱'];
  const colors = [
    { id: 'pink', bg: 'bg-rose-100 border-rose-300 text-rose-950', ring: 'bg-rose-400' },
    { id: 'yellow', bg: 'bg-amber-100 border-amber-300 text-amber-950', ring: 'bg-amber-400' },
    { id: 'blue', bg: 'bg-sky-100 border-sky-300 text-sky-950', ring: 'bg-sky-400' },
    { id: 'purple', bg: 'bg-purple-100 border-purple-300 text-purple-950', ring: 'bg-purple-400' },
    { id: 'green', bg: 'bg-emerald-100 border-emerald-300 text-emerald-950', ring: 'bg-emerald-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#fffbeb] rounded-3xl shadow-2xl border-6 border-[#d97706]/40 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Corkboard Header */}
        <div className="bg-[#b45309] text-amber-50 p-4 flex justify-between items-center shadow">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
              <Pin className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base font-black flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-rose-300 text-rose-300" />
                Couple's Secret Sticky Love Board
              </h2>
              <p className="text-[11px] text-amber-200">
                Pin cute love notes, morning reminders, and sweet thoughts!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* New Note Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-white/80 border-b border-amber-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Leave a sweet note for your love (e.g. Can't wait to cuddle tonight!)..."
              maxLength={150}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-amber-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-inner"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-md transition cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              Pin Note
            </button>
          </div>

          {/* Emoji & Color pickers */}
          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-amber-900 mr-1">Emoji:</span>
              {emojis.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setEmoji(em)}
                  className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition cursor-pointer ${
                    emoji === em ? 'bg-amber-300 scale-110 shadow' : 'hover:bg-amber-100'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-amber-900 mr-1">Paper:</span>
              {colors.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={`w-5 h-5 rounded-full ${c.ring} transition cursor-pointer ${
                    color === c.id ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </form>

        {/* Corkboard Grid with Notes */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#fef3c7] bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {notes.map((n, idx) => {
              const matchedColor = colors.find((c) => c.id === n.color) || colors[0];
              const rotation = (idx % 5) * 2 - 4; // slight whimsical rotation

              return (
                <div
                  key={n.id}
                  className={`relative p-3.5 rounded-2xl border shadow-md flex flex-col justify-between min-h-[110px] transition-transform hover:scale-105 hover:z-10 ${matchedColor.bg}`}
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  {/* Pushpin at top */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 border border-white shadow flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white" />
                  </div>

                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-lg">{n.emoji}</span>
                      <span className="text-[10px] font-extrabold opacity-75">
                        {n.author === 'boy' ? 'Boy 👦🏻' : 'Girl 👧🏻'}
                      </span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed">{n.text}</p>
                  </div>

                  <div className="text-[9px] font-bold opacity-60 text-right mt-2">
                    {n.timestamp}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-100 border-t border-amber-200 flex justify-between items-center text-xs">
          <span className="text-amber-900 font-medium">
            💌 All notes sync in real-time between your phones & computers!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
