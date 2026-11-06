import React from 'react';
import { Flame, Music, Heart, MessageSquare, Disc, Tv } from 'lucide-react';
import { CharacterState } from '../types';

interface LivingAreaProps {
  onInteract: (actionType: string) => void;
  onOpenNotes: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  characters: {
    boy: CharacterState;
    girl: CharacterState;
  };
  notesCount: number;
}

export const LivingArea: React.FC<LivingAreaProps> = ({
  onInteract,
  onOpenNotes,
  isMusicPlaying,
  onToggleMusic,
  notesCount,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-gradient-to-b from-stone-100 via-rose-50 to-orange-50">
      {/* Wall Decor & Windows */}
      <div className="absolute top-0 w-full h-44 bg-gradient-to-b from-amber-100/60 to-rose-100/40 border-b-4 border-amber-900/10">
        {/* Memory Corkboard for Secret Love Notes */}
        <div
          onClick={onOpenNotes}
          className="absolute top-6 left-12 w-64 h-32 bg-amber-700/80 rounded-2xl p-2.5 shadow-xl border-4 border-amber-900 cursor-pointer group hover:scale-105 transition"
        >
          <div className="w-full h-full bg-[#fde68a] rounded-xl p-2 relative shadow-inner flex flex-col justify-between overflow-hidden">
            <div className="flex justify-between items-center border-b border-amber-800/20 pb-1">
              <span className="text-[11px] font-extrabold text-amber-900 flex items-center gap-1">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                SECRET LOVE BOARD ({notesCount})
              </span>
              <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                Open
              </span>
            </div>
            {/* Sticky mini notes preview */}
            <div className="flex gap-2 items-center">
              <div className="bg-rose-200 text-rose-900 p-1.5 rounded shadow text-[9px] -rotate-3 font-medium">
                Love you always 💕
              </div>
              <div className="bg-sky-200 text-sky-900 p-1.5 rounded shadow text-[9px] rotate-2 font-medium">
                Pancakes soon! 🥞
              </div>
            </div>
            <div className="text-[9px] font-bold text-amber-800/80 text-right">
              Tap to pin love note ✏️
            </div>
          </div>
        </div>

        {/* Vintage Record Player */}
        <div className="absolute top-8 right-20 flex items-center gap-3 bg-white/80 p-2 rounded-2xl shadow-md border border-amber-200">
          <div
            onClick={onToggleMusic}
            className={`w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition ${
              isMusicPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
            title="Toggle Cozy Lofi Beats"
          >
            <Disc className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
              <Music className="w-3.5 h-3.5 text-rose-500" />
              <span>Cozy Couple Lofi</span>
            </div>
            <button
              onClick={onToggleMusic}
              className={`mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                isMusicPlaying ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {isMusicPlaying ? 'Playing ♪' : 'Play Music'}
            </button>
          </div>
        </div>
      </div>

      {/* Living Room Parquet Floor & Shag Rug */}
      <div className="absolute bottom-0 w-full h-64 bg-[#ebd2be] border-t-4 border-amber-900/10">
        <div className="w-full h-full opacity-25 bg-[repeating-linear-gradient(90deg,#9a3412_0,#9a3412_2px,transparent_0,transparent_50px)]" />
        {/* Soft Fluffy Rug */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[460px] h-44 bg-rose-100/90 rounded-[80px] border-4 border-rose-200/80 shadow-md flex items-center justify-center" />
      </div>

      {/* Glowing Warm Fireplace */}
      <div className="absolute bottom-28 left-16 w-52 h-52 bg-stone-700 rounded-3xl p-3 shadow-2xl border-4 border-stone-800 flex flex-col justify-between">
        <div className="w-full h-6 bg-stone-800 rounded-lg flex items-center justify-center">
          <span className="text-[10px] font-black text-amber-200">WARM HEARTH</span>
        </div>
        {/* Firebox */}
        <div className="w-full h-32 bg-black rounded-2xl flex flex-col items-center justify-end p-2 relative overflow-hidden border border-stone-600">
          <div className="absolute inset-0 bg-orange-600/20 blur-md animate-pulse" />
          <Flame className="w-12 h-12 text-amber-400 animate-bounce" />
          <div className="flex items-center gap-1 z-10">
            <span className="text-sm">🪵</span>
            <span className="text-sm">🪵</span>
          </div>
        </div>
        <button
          onClick={() => onInteract('warm_hands')}
          className="w-full py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] rounded-lg shadow cursor-pointer transition flex items-center justify-center gap-1"
        >
          <Flame className="w-3 h-3" />
          Warm Up Together
        </button>
      </div>

      {/* Couple Cuddle Sofa */}
      <div className="absolute bottom-28 right-24 w-84 h-48 bg-rose-300 rounded-3xl shadow-2xl p-3 border-4 border-rose-400 flex flex-col justify-between">
        {/* Backrest */}
        <div className="w-full h-18 bg-rose-400 rounded-2xl flex items-center justify-center shadow-inner">
          <span className="text-xs font-black text-white flex items-center gap-1.5">
            <Heart className="w-4 h-4 fill-white" />
            OUR CUDDLE SOFA
          </span>
        </div>
        {/* Cushions */}
        <div className="w-full flex justify-between gap-2">
          <div className="flex-1 h-16 bg-white/70 rounded-xl shadow-sm flex items-center justify-center text-xs font-bold text-rose-600">
            Boy's Seat
          </div>
          <div className="flex-1 h-16 bg-white/70 rounded-xl shadow-sm flex items-center justify-center text-xs font-bold text-rose-600">
            Girl's Seat
          </div>
        </div>
        {/* Action Button */}
        <button
          onClick={() => onInteract('cuddle')}
          className="w-full py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs rounded-xl shadow-lg hover:scale-105 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4 fill-white animate-pulse" />
          Cuddle on the Sofa
        </button>
      </div>
    </div>
  );
};
