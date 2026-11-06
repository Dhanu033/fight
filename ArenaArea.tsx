import React from 'react';
import { Heart, Shield, Swords, Sparkles, RefreshCw } from 'lucide-react';
import { CharacterState } from '../types';

interface ArenaAreaProps {
  characters: {
    boy: CharacterState;
    girl: CharacterState;
  };
  myRole: 'boy' | 'girl';
  sparringRound: number;
  onAttack: (attackType: 'punch' | 'kick', damage: number) => void;
  onBlock: () => void;
  onJump: () => void;
  onTruce: () => void;
  onResetHp: () => void;
}

export const ArenaArea: React.FC<ArenaAreaProps> = ({
  characters,
  myRole,
  sparringRound,
  onAttack,
  onBlock,
  onJump,
  onTruce,
  onResetHp,
}) => {
  const { boy, girl } = characters;

  // Percentage calculations
  const boyHpPercent = Math.max(0, Math.min(100, (boy.hp / boy.maxHp) * 100));
  const girlHpPercent = Math.max(0, Math.min(100, (girl.hp / girl.maxHp) * 100));

  const getHpColor = (percent: number) => {
    if (percent > 50) return 'from-emerald-400 to-green-500';
    if (percent > 25) return 'from-amber-400 to-orange-500';
    return 'from-rose-500 to-red-600';
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Background Arena Image Reference & Styling */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('/public/assets/aistudio/Valentine_s_Chibi_Fight_Arena_dfb136ca.png')`,
          filter: 'brightness(0.98)',
        }}
      >
        {/* Subtle romantic overlay */}
        <div className="absolute inset-0 bg-rose-500/5 mix-blend-overlay" />
      </div>

      {/* Top Combat HUD (Matching the uploaded image layout) */}
      <div className="absolute top-3 left-0 w-full px-6 flex items-center justify-between z-30 pointer-events-none">
        {/* Boy Health Bar & Avatar (Left) */}
        <div className="flex items-center gap-2 max-w-[40%] flex-1">
          {/* Avatar Ring */}
          <div className="relative w-14 h-14 rounded-full border-3 border-rose-300 bg-rose-100 p-0.5 shadow-lg flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-full bg-amber-900/10 flex items-center justify-center overflow-hidden">
              <span className="text-2xl">👦🏻</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow">
              ❤️
            </div>
          </div>

          {/* Bar & Name */}
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 inline" />
                {boy.username} {myRole === 'boy' && '(You)'}
              </span>
              <span className="text-xs font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {Math.round(boyHpPercent)}%
              </span>
            </div>
            {/* Green Health Gauge */}
            <div className="w-full h-5 bg-slate-900/80 rounded-full border-2 border-white/90 p-0.5 shadow-md overflow-hidden relative">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getHpColor(
                  boyHpPercent
                )} transition-all duration-300 shadow-inner`}
                style={{ width: `${boyHpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Central VS Heart with decorative wings */}
        <div className="flex flex-col items-center mx-4 shrink-0">
          <div className="relative w-16 h-14 flex items-center justify-center">
            {/* Pulsing Pink Heart */}
            <div className="w-13 h-13 bg-gradient-to-b from-rose-400 to-pink-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.7)] border-2 border-white">
              <span className="text-white font-black text-sm tracking-wider drop-shadow">VS</span>
            </div>
          </div>
          <div className="bg-white/90 px-2 py-0.5 rounded-full text-[9px] font-black text-rose-600 shadow border border-rose-200 mt-0.5">
            Round {sparringRound}
          </div>
        </div>

        {/* Girl Health Bar & Avatar (Right) */}
        <div className="flex items-center gap-2 max-w-[40%] flex-1 justify-end">
          {/* Bar & Name */}
          <div className="flex-1 flex flex-col gap-0.5 text-right">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {Math.round(girlHpPercent)}%
              </span>
              <span className="text-xs font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center gap-1">
                {girl.username} {myRole === 'girl' && '(You)'}
                <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400 inline" />
              </span>
            </div>
            {/* Green Health Gauge */}
            <div className="w-full h-5 bg-slate-900/80 rounded-full border-2 border-white/90 p-0.5 shadow-md overflow-hidden relative">
              <div
                className={`h-full rounded-full bg-gradient-to-l ${getHpColor(
                  girlHpPercent
                )} transition-all duration-300 shadow-inner ml-auto`}
                style={{ width: `${girlHpPercent}%` }}
              />
            </div>
          </div>

          {/* Avatar Ring */}
          <div className="relative w-14 h-14 rounded-full border-3 border-pink-300 bg-pink-100 p-0.5 shadow-lg flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-full bg-amber-900/10 flex items-center justify-center overflow-hidden">
              <span className="text-2xl">👧🏻</span>
            </div>
            <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow">
              💖
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action / Truce Controls in Arena */}
      <div className="absolute top-22 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
        <button
          onClick={onTruce}
          className="px-4 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-xs rounded-full shadow-xl border-2 border-white flex items-center gap-1.5 cursor-pointer hover:scale-105 transition"
        >
          <Heart className="w-3.5 h-3.5 fill-white animate-pulse" />
          Truce & Hug It Out! 💕
        </button>

        <button
          onClick={onResetHp}
          className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-900 text-slate-200 text-xs font-bold rounded-full shadow-lg border border-slate-600 flex items-center gap-1 cursor-pointer hover:scale-105 transition"
          title="Reset Health Bars"
        >
          <RefreshCw className="w-3 h-3" />
          Reset HP
        </button>
      </div>
    </div>
  );
};
