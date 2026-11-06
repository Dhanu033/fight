import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Shield, Heart } from 'lucide-react';

interface ControlsPadProps {
  onMoveStart: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onMoveEnd: () => void;
  onPunch: () => void;
  onKick: () => void;
  onBlock: () => void;
  onJump: () => void;
  onHug: () => void;
  onKiss: () => void;
  isArena: boolean;
}

export const ControlsPad: React.FC<ControlsPadProps> = ({
  onMoveStart,
  onMoveEnd,
  onPunch,
  onKick,
  onBlock,
  onJump,
  onHug,
  onKiss,
  isArena,
}) => {
  return (
    <div className="absolute inset-x-0 bottom-3 px-4 flex justify-between items-end pointer-events-none z-30">
      {/* Directional D-Pad (Matching bottom-left in the artwork) */}
      <div className="relative w-36 h-36 pointer-events-auto">
        {/* Center circle */}
        <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs pointer-events-none" />

        {/* Up Button */}
        <button
          onPointerDown={() => onMoveStart('up')}
          onPointerUp={onMoveEnd}
          onPointerLeave={onMoveEnd}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-11 h-11 rounded-2xl bg-white/80 active:bg-pink-400 hover:bg-white text-slate-700 active:text-white shadow-lg border-2 border-white/90 flex items-center justify-center transition-all cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 fill-current" />
        </button>

        {/* Down Button */}
        <button
          onPointerDown={() => onMoveStart('down')}
          onPointerUp={onMoveEnd}
          onPointerLeave={onMoveEnd}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-11 h-11 rounded-2xl bg-white/80 active:bg-pink-400 hover:bg-white text-slate-700 active:text-white shadow-lg border-2 border-white/90 flex items-center justify-center transition-all cursor-pointer"
        >
          <ArrowDown className="w-5 h-5 fill-current" />
        </button>

        {/* Left Button */}
        <button
          onPointerDown={() => onMoveStart('left')}
          onPointerUp={onMoveEnd}
          onPointerLeave={onMoveEnd}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-white/80 active:bg-pink-400 hover:bg-white text-slate-700 active:text-white shadow-lg border-2 border-white/90 flex items-center justify-center transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 fill-current" />
        </button>

        {/* Right Button */}
        <button
          onPointerDown={() => onMoveStart('right')}
          onPointerUp={onMoveEnd}
          onPointerLeave={onMoveEnd}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-white/80 active:bg-pink-400 hover:bg-white text-slate-700 active:text-white shadow-lg border-2 border-white/90 flex items-center justify-center transition-all cursor-pointer"
        >
          <ArrowRight className="w-5 h-5 fill-current" />
        </button>
      </div>

      {/* Action Buttons (Matching bottom-right in the artwork) */}
      <div className="relative w-44 h-40 pointer-events-auto flex flex-col justify-end items-end">
        {/* Top Button: Jump (Lavender circle with Arrow Up) */}
        <div className="flex justify-end w-full pr-4 mb-2">
          <button
            onClick={onJump}
            className="w-13 h-13 rounded-full bg-gradient-to-b from-purple-400 to-indigo-500 active:from-purple-600 active:to-indigo-700 text-white shadow-xl border-3 border-white/90 flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
            title="Jump / Dodge (Space)"
          >
            <ArrowUp className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Mid-Row: Punch & Special/Kick */}
        <div className="flex items-center gap-3 pr-2">
          {/* Punch Button: Pink Ruby circle with Fist */}
          <button
            onClick={onPunch}
            className="w-14 h-14 rounded-full bg-gradient-to-b from-rose-500 to-pink-600 active:from-rose-700 active:to-pink-800 text-white shadow-xl border-3 border-white/90 flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
            title="Punch / Heart Jab (J)"
          >
            <span className="text-2xl drop-shadow">👊</span>
          </button>

          {/* Kick / Special Strike: Pastel Cyan circle with Kick/Heart icon */}
          <button
            onClick={onKick}
            className="w-14 h-14 rounded-full bg-gradient-to-b from-cyan-400 to-teal-500 active:from-cyan-600 active:to-teal-700 text-white shadow-xl border-3 border-white/90 flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
            title="Kick / Special Strike (K)"
          >
            <span className="text-2xl drop-shadow">🥋</span>
          </button>
        </div>

        {/* Bottom Button: Shield / Block (Golden Amber circle with Shield) */}
        <div className="flex justify-end w-full pr-5 mt-2">
          <button
            onClick={onBlock}
            className="w-12 h-12 rounded-full bg-gradient-to-b from-amber-400 to-yellow-600 active:from-amber-600 active:to-yellow-800 text-white shadow-xl border-3 border-white/90 flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
            title="Shield Block (L)"
          >
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
