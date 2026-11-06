import React from 'react';
import { Sun, AlarmClock, Sparkles, Shirt, Heart, Moon } from 'lucide-react';
import { CharacterState } from '../types';

interface BedroomAreaProps {
  onInteract: (actionType: string) => void;
  onOpenTasks: () => void;
  onOpenOutfits: () => void;
  characters: {
    boy: CharacterState;
    girl: CharacterState;
  };
}

export const BedroomArea: React.FC<BedroomAreaProps> = ({
  onInteract,
  onOpenTasks,
  onOpenOutfits,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-gradient-to-b from-rose-100 via-amber-50 to-orange-100">
      {/* Morning Sunrise Window */}
      <div className="absolute top-6 left-12 w-48 h-56 rounded-t-full bg-gradient-to-b from-amber-200 via-rose-200 to-sky-100 border-4 border-amber-800/20 shadow-inner flex flex-col items-center justify-start overflow-hidden">
        {/* Sun rays */}
        <div className="absolute -top-6 w-24 h-24 rounded-full bg-amber-300/80 blur-md animate-pulse" />
        <div className="relative z-10 mt-6 flex items-center gap-1 text-amber-700/80 text-[11px] font-bold">
          <Sun className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '20s' }} />
          <span>Morning Sunrise</span>
        </div>
        {/* Curtains */}
        <div className="absolute top-0 left-0 w-8 h-full bg-rose-300/60 rounded-r-xl" />
        <div className="absolute top-0 right-0 w-8 h-full bg-rose-300/60 rounded-l-xl" />
        <div className="absolute top-1/2 w-full h-1 bg-amber-800/20" />
        <div className="absolute left-1/2 w-1 h-full bg-amber-800/20" />
      </div>

      {/* Wall Decor: Couple Photo Polaroids */}
      <div className="absolute top-10 left-68 flex items-center gap-3">
        <div className="bg-white p-1.5 pb-4 rounded shadow-md -rotate-6 border border-slate-200 w-18 text-center">
          <div className="w-full h-14 bg-rose-200 rounded flex items-center justify-center text-lg">
            👫
          </div>
          <span className="text-[9px] font-bold text-slate-600">Us in Paris</span>
        </div>
        <div className="bg-white p-1.5 pb-4 rounded shadow-md rotate-3 border border-slate-200 w-18 text-center">
          <div className="w-full h-14 bg-amber-200 rounded flex items-center justify-center text-lg">
            🥋
          </div>
          <span className="text-[9px] font-bold text-slate-600">Sparring Day</span>
        </div>
      </div>

      {/* Cozy Floor & Heart Rug */}
      <div className="absolute bottom-0 w-full h-64 bg-[#f6e5d8] border-t-4 border-amber-900/10">
        {/* Wood floor lines */}
        <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(90deg,#854d0e_0,#854d0e_2px,transparent_0,transparent_60px)]" />
        {/* Giant Plush Heart Rug */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-96 h-48 bg-rose-200/70 rounded-[100px] border-4 border-dashed border-rose-300 flex items-center justify-center shadow-sm">
          <span className="text-rose-400 font-extrabold text-xs tracking-wider uppercase opacity-75">
            Sweet Dreams & Early Mornings
          </span>
        </div>
      </div>

      {/* Cozy King Double Bed */}
      <div className="absolute bottom-28 left-14 w-80 h-52 bg-amber-900/20 rounded-2xl p-2 shadow-xl border-b-8 border-amber-900/30">
        {/* Headboard */}
        <div className="w-full h-14 bg-amber-800/80 rounded-t-xl flex items-center justify-center shadow-md">
          <span className="text-amber-100 font-bold text-xs tracking-widest flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-300" />
            OUR COZY BED
          </span>
        </div>
        {/* Mattresses & Pastel Blanket */}
        <div className="relative w-full h-34 bg-white rounded-b-xl border-t-2 border-slate-200 overflow-hidden shadow-inner">
          {/* Pillows */}
          <div className="absolute top-2 left-6 w-28 h-12 bg-rose-100 rounded-xl border border-rose-200 shadow-sm flex items-center justify-center text-[10px] text-rose-400 font-bold">
            Boy's Pillow
          </div>
          <div className="absolute top-2 right-6 w-28 h-12 bg-pink-100 rounded-xl border border-pink-200 shadow-sm flex items-center justify-center text-[10px] text-pink-400 font-bold">
            Girl's Pillow
          </div>
          {/* Duvet Blanket */}
          <div className="absolute bottom-0 w-full h-22 bg-gradient-to-r from-rose-300 via-pink-200 to-amber-200 rounded-t-2xl border-t-2 border-white shadow-md flex items-center justify-center gap-2">
            <Moon className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold text-rose-700">Warm Snuggle Blanket</span>
          </div>
        </div>

        {/* Action Trigger Over Bed */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-2">
          <button
            onClick={() => onInteract('wakeup')}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 cursor-pointer transition hover:scale-105"
          >
            <AlarmClock className="w-3.5 h-3.5 animate-spin" />
            Wake Up & Stretch
          </button>
          <button
            onClick={() => onInteract('sleep')}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 cursor-pointer transition hover:scale-105"
          >
            <Moon className="w-3.5 h-3.5" />
            Sleep / Nap
          </button>
        </div>
      </div>

      {/* Bedside Nightstand & Alarm Clock */}
      <div className="absolute bottom-28 left-98 w-24 h-28 bg-amber-800/80 rounded-xl shadow-lg p-2 flex flex-col justify-between">
        <div className="w-full flex justify-center">
          <div
            onClick={() => onInteract('alarm_ring')}
            className="cursor-pointer group flex flex-col items-center bg-white/90 p-1.5 rounded-lg border border-amber-200 shadow-sm hover:scale-110 transition"
            title="Click to ring wake-up alarm!"
          >
            <AlarmClock className="w-5 h-5 text-rose-500 group-hover:animate-bounce" />
            <span className="text-[9px] font-black text-rose-600">06:30 AM</span>
          </div>
        </div>
        <div className="w-full h-7 bg-amber-900 rounded flex items-center justify-center">
          <div className="w-4 h-1 bg-amber-700 rounded-full" />
        </div>
      </div>

      {/* Vanity Dresser & Mirror (Brush Teeth, Freshen Up) */}
      <div className="absolute bottom-28 right-36 w-44 h-48 bg-white/90 rounded-2xl shadow-xl border-2 border-rose-200 p-2 flex flex-col items-center">
        {/* Glowing Mirror */}
        <div className="w-32 h-26 rounded-full bg-gradient-to-b from-sky-100 to-rose-50 border-4 border-amber-700/30 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute -top-3 left-3 w-8 h-18 bg-white/40 rotate-12" />
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="text-[10px] font-black text-slate-600 mt-1">Vanity Mirror</span>
        </div>
        {/* Table top items */}
        <div className="w-full mt-2 flex justify-around items-center px-2">
          <span title="Toothbrushes" className="text-base cursor-pointer hover:scale-125 transition">
            🪥
          </span>
          <span title="Perfume" className="text-base cursor-pointer hover:scale-125 transition">
            🧴
          </span>
          <span title="Hairbrush" className="text-base cursor-pointer hover:scale-125 transition">
            🌸
          </span>
        </div>
        {/* Brush Teeth Action Button */}
        <button
          onClick={() => onInteract('brush_teeth')}
          className="mt-2 w-full py-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-[11px] rounded-lg shadow cursor-pointer hover:scale-105 transition flex items-center justify-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Brush Teeth Together
        </button>
      </div>

      {/* Wardrobe (Outfit Change) */}
      <div className="absolute bottom-28 right-8 w-24 h-52 bg-amber-800 rounded-xl shadow-2xl p-2 flex flex-col justify-between border-b-4 border-amber-950">
        <div className="flex justify-between items-center px-1">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Shirt className="w-7 h-7 text-amber-200" />
          <button
            onClick={onOpenOutfits}
            className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold rounded shadow cursor-pointer transition"
          >
            Wardrobe
          </button>
        </div>
        <div className="w-full h-8 bg-amber-900 rounded-lg flex items-center justify-center">
          <div className="w-6 h-1 bg-amber-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
