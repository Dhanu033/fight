import React from 'react';
import { Heart, Sparkles, Coffee, Users, Send, MapPin } from 'lucide-react';
import { RoomArea } from '../types';

interface CoupleActionsBarProps {
  onAction: (actionType: string) => void;
  onTeleport: () => void;
  sameArea: boolean;
  distance: number;
  partnerArea: RoomArea;
  partnerName: string;
}

export const CoupleActionsBar: React.FC<CoupleActionsBarProps> = ({
  onAction,
  onTeleport,
  sameArea,
  distance,
  partnerArea,
  partnerName,
}) => {
  const areaLabels: Record<RoomArea, string> = {
    bedroom: 'Bedroom 🛏️',
    kitchen: 'Kitchen 🍳',
    living: 'Living Room 🛋️',
    garden: 'Garden 🌸',
    arena: 'Chibi Arena 🥋',
  };

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-auto">
      {/* Distance / Partner Status Indicator */}
      <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md text-white text-xs px-3.5 py-1 rounded-full shadow-lg border border-pink-400/40">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        {sameArea ? (
          <span className="font-bold flex items-center gap-1 text-pink-200">
            <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
            Together in {areaLabels[partnerArea]}!
          </span>
        ) : (
          <span className="font-medium text-slate-300 flex items-center gap-1.5">
            <span>{partnerName} is in {areaLabels[partnerArea]}</span>
            <button
              onClick={onTeleport}
              className="ml-1 px-2 py-0.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] rounded-full shadow transition cursor-pointer flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              Join Partner
            </button>
          </span>
        )}
      </div>

      {/* Quick Couple Actions */}
      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-2xl shadow-xl border border-pink-200">
        <button
          onClick={() => onAction('hug')}
          className="px-2.5 py-1.5 rounded-xl hover:bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center gap-1 transition cursor-pointer"
          title="Hug Tight"
        >
          <span>🤗</span>
          <span className="hidden sm:inline">Hug</span>
        </button>

        <button
          onClick={() => onAction('kiss')}
          className="px-2.5 py-1.5 rounded-xl hover:bg-pink-100 text-pink-700 font-extrabold text-xs flex items-center gap-1 transition cursor-pointer"
          title="Sweet Kiss"
        >
          <span>💋</span>
          <span className="hidden sm:inline">Kiss</span>
        </button>

        <button
          onClick={() => onAction('cuddle')}
          className="px-2.5 py-1.5 rounded-xl hover:bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center gap-1 transition cursor-pointer"
          title="Cuddle"
        >
          <span>🛋️</span>
          <span className="hidden sm:inline">Cuddle</span>
        </button>

        <button
          onClick={() => onAction('feed')}
          className="px-2.5 py-1.5 rounded-xl hover:bg-teal-100 text-teal-800 font-extrabold text-xs flex items-center gap-1 transition cursor-pointer"
          title="Feed Breakfast"
        >
          <span>🥞</span>
          <span className="hidden sm:inline">Feed</span>
        </button>

        <button
          onClick={() => onAction('high_five')}
          className="px-2.5 py-1.5 rounded-xl hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center gap-1 transition cursor-pointer"
          title="High Five"
        >
          <span>✋</span>
          <span className="hidden sm:inline">High Five</span>
        </button>

        <button
          onClick={() => onAction('dance')}
          className="px-2.5 py-1.5 rounded-xl hover:bg-purple-100 text-purple-700 font-extrabold text-xs flex items-center gap-1 transition cursor-pointer"
          title="Dance"
        >
          <span>💃</span>
          <span className="hidden sm:inline">Dance</span>
        </button>
      </div>
    </div>
  );
};
