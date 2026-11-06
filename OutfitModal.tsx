import React from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { CharacterRole } from '../types';

interface OutfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOutfit: string;
  onSelectOutfit: (outfitId: string) => void;
  role: CharacterRole;
}

export const OutfitModal: React.FC<OutfitModalProps> = ({
  isOpen,
  onClose,
  currentOutfit,
  onSelectOutfit,
  role,
}) => {
  if (!isOpen) return null;

  const outfits = [
    {
      id: 'classic_gi',
      name: 'Classic Martial Arts Dogi & Black Belt',
      desc: 'Authentic white karate uniform with crisp black belt from the Valentine Arena.',
      badge: 'Arena Favorite 🥋',
      preview: role === 'boy' ? '🥋👦🏻' : '🥋👧🏻',
    },
    {
      id: 'pajamas',
      name: 'Cozy Morning Bedtime Pajamas',
      desc: 'Soft plush sleepwear perfect for early morning wakeups, stretches, and bedtime cuddles.',
      badge: 'Cozy Sleep 💤',
      preview: role === 'boy' ? '🛌👦🏻' : '🛌👧🏻',
    },
    {
      id: 'casual',
      name: 'Sweet Couple Streetwear',
      desc: 'Chic everyday couple outfit for walks in the romance garden and kitchen breakfast.',
      badge: 'Casual Chic ✨',
      preview: role === 'boy' ? '👕👦🏻' : '👗👧🏻',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-200 w-full max-w-md flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-amber-800 text-amber-50 p-4 flex justify-between items-center shadow">
          <div className="flex items-center gap-2">
            <span className="text-xl">👘</span>
            <div>
              <h2 className="text-base font-black">Couple Wardrobe & Outfits</h2>
              <p className="text-[11px] text-amber-200">
                Dress up your chibi character for the day
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

        {/* Outfit Selection */}
        <div className="p-4 space-y-3">
          {outfits.map((outfit) => {
            const isSelected = currentOutfit === outfit.id || (!currentOutfit && outfit.id === 'classic_gi');

            return (
              <div
                key={outfit.id}
                onClick={() => {
                  onSelectOutfit(outfit.id);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-300'
                    : 'border-slate-200 hover:border-amber-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl">
                    {outfit.preview}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-800">{outfit.name}</span>
                    </div>
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.2 rounded-full inline-block mt-0.5">
                      {outfit.badge}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">{outfit.desc}</p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-50 border-t border-amber-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
