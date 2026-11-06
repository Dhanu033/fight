import React from 'react';
import { Coffee, Utensils, Flame, Sparkles, Heart } from 'lucide-react';
import { CharacterState } from '../types';

interface KitchenAreaProps {
  onInteract: (actionType: string) => void;
  characters: {
    boy: CharacterState;
    girl: CharacterState;
  };
}

export const KitchenArea: React.FC<KitchenAreaProps> = ({ onInteract }) => {
  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      {/* Wall Cabinets & Tile Pattern */}
      <div className="absolute top-0 w-full h-44 bg-gradient-to-b from-stone-200 to-amber-100/60 border-b-4 border-amber-900/10">
        <div className="w-full h-full opacity-15 bg-[repeating-linear-gradient(0deg,#78350f_0,#78350f_1px,transparent_0,transparent_20px)]" />
        {/* Hanging Kitchen Shelves */}
        <div className="absolute top-8 left-16 flex gap-4">
          <div className="bg-white/80 p-2 rounded-xl shadow-md border border-amber-200 flex items-center gap-3">
            <span className="text-xl" title="Spices">
              🧂
            </span>
            <span className="text-xl" title="Teapot">
              🫖
            </span>
            <span className="text-xl" title="Honey jar">
              🍯
            </span>
            <span className="text-xs font-bold text-amber-900">Sweet Pantry</span>
          </div>
        </div>
      </div>

      {/* Tiled Floor */}
      <div className="absolute bottom-0 w-full h-64 bg-[#f8fafc] border-t-4 border-slate-200">
        <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,#cbd5e1_0,#cbd5e1_2px,transparent_0,transparent_40px)]" />
      </div>

      {/* Retro Pastel Refrigerator */}
      <div className="absolute bottom-28 left-10 w-28 h-56 bg-gradient-to-b from-teal-200 to-teal-300 rounded-2xl shadow-xl border-4 border-white p-2 flex flex-col justify-between">
        <div className="w-full flex justify-end pr-2 pt-2">
          <div className="w-2 h-10 bg-slate-100 rounded-full shadow" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl cursor-pointer hover:scale-125 transition" onClick={() => onInteract('feed')}>
            🍓
          </span>
          <span className="text-[10px] font-black text-teal-800">Fresh Treats</span>
        </div>
        <div className="w-full flex justify-end pr-2 pb-4">
          <div className="w-2 h-14 bg-slate-100 rounded-full shadow" />
        </div>
      </div>

      {/* Stove & Cooking Counter */}
      <div className="absolute bottom-28 left-44 w-60 h-44 bg-slate-700 rounded-2xl shadow-2xl p-3 border-t-4 border-slate-500 flex flex-col justify-between">
        <div className="flex justify-between items-center bg-slate-800 p-2 rounded-xl border border-slate-600">
          {/* Pan & Food */}
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="text-xl animate-bounce">🍳</span>
            <span className="text-xs font-bold text-amber-200">Pancakes Sizzling</span>
          </div>
        </div>

        {/* Coffee Brewer */}
        <div className="flex items-center justify-between bg-slate-800/80 p-2 rounded-xl border border-slate-600">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-amber-500 animate-bounce" />
            <span className="text-xs font-bold text-white">Espresso Machine</span>
          </div>
          <span className="text-lg">☕</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onInteract('brew_coffee')}
            className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] rounded-lg shadow cursor-pointer transition flex items-center justify-center gap-1"
          >
            <Coffee className="w-3 h-3" />
            Brew Coffee
          </button>
          <button
            onClick={() => onInteract('cook_pancakes')}
            className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] rounded-lg shadow cursor-pointer transition flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Cook Breakfast
          </button>
        </div>
      </div>

      {/* Romantic Dining Table for Two */}
      <div className="absolute bottom-24 right-20 w-80 h-48 flex flex-col items-center">
        {/* Table Top */}
        <div className="relative w-full h-32 bg-white rounded-3xl shadow-xl border-4 border-amber-100 p-3 flex flex-col justify-between items-center">
          {/* Table Centerpieces */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-xl">🥞</span>
              <span className="text-[9px] font-bold text-slate-500">Boy's Plate</span>
            </div>

            {/* Glowing Candle */}
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-amber-400 blur-xs animate-ping" />
              <span className="text-xl">🕯️</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xl">🥞</span>
              <span className="text-[9px] font-bold text-slate-500">Girl's Plate</span>
            </div>
          </div>

          {/* Feed Breakfast Interaction */}
          <button
            onClick={() => onInteract('feed')}
            className="px-4 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs rounded-full shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            Feed Each Other Breakfast
          </button>
        </div>

        {/* Table Legs */}
        <div className="w-64 flex justify-between px-6">
          <div className="w-4 h-16 bg-amber-800 rounded-b shadow" />
          <div className="w-4 h-16 bg-amber-800 rounded-b shadow" />
        </div>
      </div>
    </div>
  );
};
