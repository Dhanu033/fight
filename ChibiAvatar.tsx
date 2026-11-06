import React from 'react';
import { CharacterState } from '../types';

interface ChibiAvatarProps {
  character: CharacterState;
  isSelf: boolean;
  speechBubble?: string | null;
  showHitEffect?: boolean;
}

export const ChibiAvatar: React.FC<ChibiAvatarProps> = ({
  character,
  isSelf,
  speechBubble,
  showHitEffect,
}) => {
  const { role, facing, currentAction, username, outfit } = character;
  const isBoy = role === 'boy';

  // Hair colors matching the uploaded artwork
  const hairColor = isBoy ? '#4a2c17' : '#3f2115';
  const hairHighlight = isBoy ? '#754625' : '#693822';
  const skinTone = '#ffdfcb';
  const blushColor = 'rgba(255, 95, 126, 0.45)';

  // Outfit styles
  const isKarateGi = outfit === 'classic_gi' || !outfit;
  const isPajamas = outfit === 'pajamas';
  const isCasual = outfit === 'casual';

  const clothColor = isKarateGi
    ? '#ffffff'
    : isPajamas
    ? isBoy
      ? '#93c5fd'
      : '#fbcfe8'
    : isBoy
    ? '#475569'
    : '#e11d48';

  const accentColor = isKarateGi ? '#1e293b' : '#38bdf8';

  return (
    <div
      className="absolute select-none pointer-events-none transition-transform duration-100 ease-out z-20"
      style={{
        left: `${character.x}px`,
        top: `${character.y}px`,
        transform: `translate(-50%, -85%) ${facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
      }}
    >
      {/* Speech / Action Bubble (re-flipped so text reads correctly) */}
      {speechBubble && (
        <div
          className="absolute -top-16 left-1/2 bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-2xl shadow-lg border border-pink-300 whitespace-nowrap animate-bounce z-40"
          style={{
            transform: `translateX(-50%) ${facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
          }}
        >
          {speechBubble}
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-pink-300 rotate-45" />
        </div>
      )}

      {/* Action FX: Block Shield */}
      {currentAction === 'block' && (
        <div className="absolute inset-0 -m-4 rounded-full border-4 border-amber-300 bg-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-pulse pointer-events-none z-30" />
      )}

      {/* Action FX: Hearts for Kiss / Hug */}
      {(currentAction === 'kiss' || currentAction === 'hug' || currentAction === 'cuddle') && (
        <div
          className="absolute -top-12 left-1/2 text-xl animate-bounce pointer-events-none z-30"
          style={{ transform: `translateX(-50%) ${facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}` }}
        >
          💖✨💕
        </div>
      )}

      {/* Action FX: Hit spark */}
      {showHitEffect && (
        <div className="absolute -top-4 -right-4 text-3xl font-black text-amber-400 animate-ping z-30">
          💥
        </div>
      )}

      {/* Action FX: Sleep Zzz */}
      {currentAction === 'sleep' && (
        <div
          className="absolute -top-14 right-2 text-indigo-400 font-extrabold text-sm animate-pulse z-30"
          style={{ transform: facing === 'left' ? 'scaleX(-1)' : 'none' }}
        >
          Z z z... 💤
        </div>
      )}

      {/* Main SVG Character Render */}
      <svg
        width="110"
        height="130"
        viewBox="0 0 110 130"
        className={`filter drop-shadow-md transition-all ${
          currentAction === 'punch'
            ? 'translate-x-3'
            : currentAction === 'kick'
            ? '-translate-y-2'
            : currentAction === 'jump'
            ? '-translate-y-8'
            : ''
        }`}
      >
        <defs>
          <filter id={`shadow-${role}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Character Base Shadow on Floor */}
        <ellipse cx="55" cy="122" rx="28" ry="7" fill="rgba(0,0,0,0.22)" />

        {/* Legs / Pants */}
        <g id="legs">
          {/* Left Leg */}
          <path
            d="M 40 85 L 34 114 L 26 117 L 27 122 L 44 122 L 48 95 Z"
            fill={clothColor}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          {/* Right Leg (bent in fighting or idle stance) */}
          <path
            d={
              currentAction === 'kick'
                ? 'M 62 85 L 88 88 L 102 78 L 104 88 L 68 100 Z'
                : 'M 60 85 L 66 114 L 74 117 L 73 122 L 56 122 L 52 95 Z'
            }
            fill={clothColor}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          {/* Bare Feet matching the uploaded art */}
          {currentAction !== 'kick' ? (
            <>
              {/* Left foot */}
              <ellipse cx="34" cy="121" rx="9" ry="4" fill={skinTone} />
              {/* Right foot */}
              <ellipse cx="66" cy="121" rx="9" ry="4" fill={skinTone} />
            </>
          ) : (
            <ellipse cx="100" cy="83" rx="7" ry="5" fill={skinTone} />
          )}
        </g>

        {/* Body / Karate Gi Torso */}
        <g id="torso">
          {/* Main Robe */}
          <path
            d="M 33 55 L 77 55 L 72 88 L 38 88 Z"
            fill={clothColor}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          {/* Crossed V-lapels */}
          <path d="M 38 55 L 56 78 L 74 55" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
          <path d="M 48 64 L 62 82" stroke="#cbd5e1" strokeWidth="2" fill="none" />

          {/* Black Belt (Obi) with tied dangling ends */}
          {isKarateGi && (
            <g id="belt">
              <rect x="36" y="78" width="38" height="7" rx="1.5" fill="#1e293b" />
              {/* Knot */}
              <rect x="52" y="77" width="8" height="9" rx="1" fill="#0f172a" />
              {/* Dangling ends */}
              <path d="M 53 85 L 50 102 L 55 101 L 56 86 Z" fill="#1e293b" />
              <path d="M 58 85 L 63 99 L 68 98 L 61 86 Z" fill="#1e293b" />
            </g>
          )}

          {/* Pajamas buttons or pattern */}
          {isPajamas && (
            <g>
              <circle cx="55" cy="65" r="2" fill="#ffffff" />
              <circle cx="55" cy="74" r="2" fill="#ffffff" />
            </g>
          )}
        </g>

        {/* Arms */}
        <g id="arms">
          {currentAction === 'punch' ? (
            <>
              {/* Back arm held to guard */}
              <path d="M 35 60 L 25 74 L 38 78 Z" fill={clothColor} stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="38" cy="78" r="6" fill={skinTone} />
              {/* Forward punching arm thrust */}
              <path d="M 68 62 L 96 62 L 96 74 L 68 70 Z" fill={clothColor} stroke="#cbd5e1" strokeWidth="1.5" />
              <rect x="94" y="58" width="13" height="15" rx="4" fill={skinTone} stroke="#e2b89d" strokeWidth="1" />
            </>
          ) : currentAction === 'block' ? (
            <>
              {/* Cross guard arms */}
              <path d="M 38 60 L 62 70 L 56 80 L 32 68 Z" fill={clothColor} stroke="#cbd5e1" strokeWidth="1.5" />
              <path d="M 72 60 L 48 70 L 54 80 L 78 68 Z" fill={clothColor} stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="60" cy="70" r="6" fill={skinTone} />
              <circle cx="50" cy="70" r="6" fill={skinTone} />
            </>
          ) : currentAction === 'hug' ? (
            <>
              {/* Outstretched loving arms */}
              <path d="M 34 60 L 16 66 L 22 76 L 36 68 Z" fill={clothColor} stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="16" cy="68" r="6" fill={skinTone} />
              <path d="M 76 60 L 94 66 L 88 76 L 74 68 Z" fill={clothColor} stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="94" cy="68" r="6" fill={skinTone} />
            </>
          ) : currentAction === 'coffee' ? (
            <>
              {/* Holding warm mug */}
              <path d="M 68 60 L 75 75 L 60 76 Z" fill={clothColor} stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="62" cy="75" r="5" fill={skinTone} />
              <rect x="66" y="68" width="12" height="14" rx="3" fill="#f43f5e" />
              <path d="M 78 72 C 82 72, 82 78, 78 78" stroke="#f43f5e" strokeWidth="2" fill="none" />
            </>
          ) : (
            <>
              {/* Default martial arts fight guard stance matching image */}
              {/* Left arm */}
              <path d="M 34 58 L 22 72 L 32 75 L 40 64 Z" fill={clothColor} stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="25" cy="74" r="6" fill={skinTone} stroke="#e2b89d" strokeWidth="0.8" />
              {/* Right arm forward fist */}
              <path d="M 72 58 L 86 66 L 80 75 L 68 66 Z" fill={clothColor} stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="85" cy="68" r="6.5" fill={skinTone} stroke="#e2b89d" strokeWidth="0.8" />
            </>
          )}
        </g>

        {/* Head and Face */}
        <g id="head">
          {/* Base head shape */}
          <path
            d="M 30 35 C 30 18, 80 18, 80 35 C 80 48, 74 58, 55 58 C 36 58, 30 48, 30 35 Z"
            fill={skinTone}
          />

          {/* Ears */}
          <ellipse cx="28" cy="38" rx="4" ry="6" fill={skinTone} />
          <ellipse cx="82" cy="38" rx="4" ry="6" fill={skinTone} />

          {/* Rosy blush on cheeks */}
          <ellipse cx="38" cy="44" rx="6" ry="3.5" fill={blushColor} />
          <ellipse cx="72" cy="44" rx="6" ry="3.5" fill={blushColor} />

          {/* Eyes */}
          {isBoy ? (
            /* Boy Eyes - determined and intense chibi eyes like the artwork */
            <g id="boy-eyes">
              {/* Thick dark eyebrows */}
              <path d="M 34 29 L 46 32" stroke="#2c180e" strokeWidth="3" strokeLinecap="round" />
              <path d="M 76 29 L 64 32" stroke="#2c180e" strokeWidth="3" strokeLinecap="round" />
              {/* Left eye */}
              <ellipse cx="41" cy="38" rx="4.5" ry="5.5" fill="#1e1b18" />
              <circle cx="39.5" cy="36" r="1.8" fill="#ffffff" />
              {/* Right eye */}
              <ellipse cx="69" cy="38" rx="4.5" ry="5.5" fill="#1e1b18" />
              <circle cx="67.5" cy="36" r="1.8" fill="#ffffff" />
            </g>
          ) : (
            /* Girl Eyes - sweet big anime eyes with straight bangs like the artwork */
            <g id="girl-eyes">
              {/* Soft graceful eyebrows */}
              <path d="M 35 29 Q 41 27 47 30" stroke="#2c180e" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M 75 29 Q 69 27 63 30" stroke="#2c180e" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              {/* Left eye */}
              <ellipse cx="42" cy="38" rx="5" ry="6" fill="#1c1917" />
              <circle cx="40.5" cy="36" r="2" fill="#ffffff" />
              <circle cx="43" cy="41" r="1" fill="#ffffff" />
              {/* Right eye */}
              <ellipse cx="68" cy="38" rx="5" ry="6" fill="#1c1917" />
              <circle cx="66.5" cy="36" r="2" fill="#ffffff" />
              <circle cx="69" cy="41" r="1" fill="#ffffff" />
            </g>
          )}

          {/* Cute Nose */}
          <circle cx="55" cy="42" r="1" fill="#d97706" opacity="0.6" />

          {/* Mouth */}
          {currentAction === 'kiss' ? (
            <ellipse cx="55" cy="48" rx="3" ry="2" fill="#e11d48" />
          ) : currentAction === 'punch' || currentAction === 'kick' ? (
            /* Determined shout / focus */
            <path d="M 52 47 Q 55 52 58 47 Z" fill="#881337" stroke="#881337" strokeWidth="1" />
          ) : (
            /* Cute smile */
            <path d="M 51 46 Q 55 50 59 46" stroke="#881337" strokeWidth="2" strokeLinecap="round" fill="none" />
          )}

          {/* Hair Styles */}
          {isBoy ? (
            /* Boy Hair: Messy spiky brown hair with dynamic tufts matching uploaded artwork */
            <g id="boy-hair">
              {/* Hair Back / Volume */}
              <path
                d="M 24 35 C 22 18, 42 6, 56 6 C 72 6, 88 16, 86 36 C 85 43, 83 48, 80 47 C 76 34, 73 30, 71 30 C 68 28, 64 30, 60 27 C 56 24, 52 28, 48 27 C 44 26, 40 31, 37 32 C 34 33, 31 46, 27 46 C 24 46, 24 40, 24 35 Z"
                fill={hairColor}
              />
              {/* Spiky Tufts sticking out */}
              <path d="M 28 14 L 18 10 L 25 22 Z" fill={hairColor} />
              <path d="M 38 8 L 36 -1 L 46 8 Z" fill={hairColor} />
              <path d="M 54 6 L 58 -2 L 64 7 Z" fill={hairColor} />
              <path d="M 74 10 L 84 4 L 79 18 Z" fill={hairColor} />
              <path d="M 83 22 L 94 20 L 85 32 Z" fill={hairColor} />
              {/* Front Bangs */}
              <path d="M 30 30 L 36 38 L 40 31 L 48 38 L 52 30 L 60 38 L 65 31 L 72 38 L 78 30 Z" fill={hairHighlight} />
            </g>
          ) : (
            /* Girl Hair: Shiny shoulder-length bob with neat straight bangs and side framing locks */
            <g id="girl-hair">
              {/* Back Hair & Bob curve */}
              <path
                d="M 24 36 C 22 16, 42 8, 55 8 C 70 8, 88 16, 86 36 C 88 56, 85 68, 78 68 C 75 58, 77 44, 76 36 C 75 28, 71 24, 55 24 C 39 24, 35 28, 34 36 C 33 44, 35 58, 32 68 C 25 68, 22 56, 24 36 Z"
                fill={hairColor}
              />
              {/* Glossy highlight streak */}
              <path d="M 34 16 Q 55 12 76 16" stroke={hairHighlight} strokeWidth="3" fill="none" opacity="0.8" />
              {/* Straight bangs across forehead matching the image */}
              <path
                d="M 33 26 C 36 36, 42 36, 46 36 C 50 36, 52 35, 55 35 C 58 35, 60 36, 64 36 C 68 36, 74 36, 77 26 Z"
                fill={hairColor}
              />
              <path d="M 38 36 L 41 33 L 44 36" stroke={hairHighlight} strokeWidth="1.5" fill="none" />
              <path d="M 66 36 L 69 33 L 72 36" stroke={hairHighlight} strokeWidth="1.5" fill="none" />
            </g>
          )}
        </g>
      </svg>

      {/* Name Tag & Status Badge */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm whitespace-nowrap z-20"
        style={{
          transform: `translateX(-50%) ${facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
          backgroundColor: isSelf ? '#f43f5e' : '#475569',
          color: '#ffffff',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>{username}</span>
        {isSelf && <span className="opacity-80 text-[8px]">(You)</span>}
      </div>
    </div>
  );
};
