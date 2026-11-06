import React from 'react';
import { Flower2, Heart, Sparkles, Droplets } from 'lucide-react';
import { CharacterState } from '../types';

interface GardenAreaProps {
  onInteract: (actionType: string) => void;
  characters: {
    boy: CharacterState;
    girl: CharacterState;
  };
}

export const GardenArea: React.FC<GardenAreaProps> = ({ onInteract }) => {
  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-gradient-to-b from-pink-200 via-rose-100 to-amber-50">
      {/* Floating Cherry Blossom Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute text-rose-300 opacity-70 animate-bounce"
            style={{
              left: `${(i * 6.5) % 95}%`,
              top: `${(i * 14) % 85}%`,
              animationDuration: `${3 + (i % 4)}s`,
              transform: `scale(${0.7 + (i % 3) * 0.3}) rotate(${i * 25}deg)`,
            }}
          >
            🌸
          </div>
        ))}
      </div>

      {/* Background Sakura Trees & Hills */}
      <div className="absolute top-0 w-full h-48 flex justify-between px-4 pointer-events-none">
        {/* Left Tree */}
        <div className="w-56 h-48 rounded-full bg-pink-300/60 blur-xs -translate-x-10 -translate-y-6 flex items-center justify-center">
          <div className="w-44 h-40 rounded-full bg-pink-400/50" />
        </div>
        {/* Soft Fairy Lights Garland */}
        <div className="flex-1 flex justify-around items-start pt-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-amber-800/30" />
              <div className="w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.8)] animate-pulse" />
            </div>
          ))}
        </div>
        {/* Right Tree */}
        <div className="w-56 h-48 rounded-full bg-pink-300/60 blur-xs translate-x-10 -translate-y-6 flex items-center justify-center">
          <div className="w-44 h-40 rounded-full bg-pink-400/50" />
        </div>
      </div>

      {/* Stone Paved Ground */}
      <div className="absolute bottom-0 w-full h-64 bg-[#e8d5cc] border-t-4 border-rose-300/40">
        <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(90deg,#9f1239_0,#9f1239_2px,transparent_0,transparent_40px)]" />
      </div>

      {/* Central Floral Heart Arch & Park Bench (Matching the uploaded image!) */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center">
        {/* Giant Floral Arch */}
        <div className="relative w-80 h-52 flex flex-col items-center justify-start">
          {/* Arch vine shape */}
          <div className="w-72 h-44 rounded-t-[140px] border-[12px] border-emerald-700/80 bg-rose-50/20 shadow-2xl relative flex items-center justify-center overflow-hidden">
            {/* Flower Blossoms on Arch */}
            <div className="absolute top-1 left-8 text-xl">🌸</div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl">🌹</div>
            <div className="absolute top-1 right-8 text-xl">🌸</div>
            <div className="absolute top-14 left-1 text-lg">🌺</div>
            <div className="absolute top-14 right-1 text-lg">🌺</div>

            {/* Glowing Double Neon Hearts */}
            <div className="flex items-center -space-x-3 text-4xl text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)] animate-pulse">
              <span>🤍</span>
              <span>💖</span>
            </div>
          </div>

          {/* Hanging Vintage Lanterns on sides */}
          <div className="absolute top-20 left-10 w-6 h-10 bg-amber-800 rounded-lg shadow flex flex-col items-center justify-center">
            <div className="w-3 h-5 bg-amber-300 rounded shadow-[0_0_10px_rgba(252,211,77,0.9)] animate-pulse" />
          </div>
          <div className="absolute top-20 right-10 w-6 h-10 bg-amber-800 rounded-lg shadow flex flex-col items-center justify-center">
            <div className="w-3 h-5 bg-amber-300 rounded shadow-[0_0_10px_rgba(252,211,77,0.9)] animate-pulse" />
          </div>

          {/* Romantic Wooden Park Bench */}
          <div className="w-64 h-16 bg-amber-900/90 rounded-xl shadow-2xl p-1.5 flex flex-col justify-between -mt-6 border-b-4 border-amber-950 z-10">
            {/* Slats */}
            <div className="w-full flex flex-col gap-1">
              <div className="w-full h-2 bg-amber-700 rounded-full" />
              <div className="w-full h-2 bg-amber-700 rounded-full" />
            </div>
            {/* Action Trigger */}
            <button
              onClick={() => onInteract('sit_bench')}
              className="py-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-extrabold text-[11px] rounded-lg shadow-md cursor-pointer transition hover:scale-105 flex items-center justify-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              Sit on Romantic Bench Together
            </button>
          </div>
        </div>
      </div>

      {/* Left Floral Planter Box & Heart Balloons */}
      <div className="absolute bottom-28 left-8 flex flex-col items-center">
        {/* Heart Balloon Bouquet */}
        <div className="flex -space-x-2 mb-2 animate-bounce">
          <span className="text-2xl">🎈</span>
          <span className="text-3xl text-rose-500">❤️</span>
        </div>
        {/* Planter Box */}
        <div className="w-32 h-20 bg-amber-800 rounded-2xl shadow-xl p-2 flex flex-col justify-between border-2 border-amber-900">
          <div className="flex justify-around text-lg">
            <span>🌸</span>
            <span>🌷</span>
            <span>🌹</span>
          </div>
          <button
            onClick={() => onInteract('water_plants')}
            className="w-full py-1 bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold rounded-lg shadow cursor-pointer transition flex items-center justify-center gap-1"
          >
            <Droplets className="w-3 h-3 text-cyan-200" />
            Water Roses
          </button>
        </div>
      </div>

      {/* Right Floral Planter Box & Heart Balloons */}
      <div className="absolute bottom-28 right-8 flex flex-col items-center">
        {/* Heart Balloon Bouquet */}
        <div className="flex -space-x-2 mb-2 animate-bounce">
          <span className="text-3xl text-pink-500">💖</span>
          <span className="text-2xl">🎈</span>
        </div>
        {/* Planter Box */}
        <div className="w-32 h-20 bg-amber-800 rounded-2xl shadow-xl p-2 flex flex-col justify-between border-2 border-amber-900">
          <div className="flex justify-around text-lg">
            <span>🌺</span>
            <span>🌻</span>
            <span>🌸</span>
          </div>
          <button
            onClick={() => onInteract('water_plants')}
            className="w-full py-1 bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold rounded-lg shadow cursor-pointer transition flex items-center justify-center gap-1"
          >
            <Droplets className="w-3 h-3 text-cyan-200" />
            Water Sakura
          </button>
        </div>
      </div>
    </div>
  );
};
