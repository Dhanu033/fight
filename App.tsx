import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Sun,
  Moon,
  Sparkles,
  Volume2,
  VolumeX,
  Music,
  Share2,
  Key,
  Code2,
  MessageCircle,
  CheckCircle2,
  Shirt,
  MapPin,
  Flame,
  Swords,
  Coffee,
  Flower2,
  Home,
  Info,
} from 'lucide-react';

import {
  CharacterRole,
  RoomArea,
  CharacterState,
  DailyTask,
  LoveNote,
  ChatMessage,
  RoomState,
  UserCredentials,
} from './types';
import { sounds } from"./sound";
import { ChibiAvatar } from "./ChibiAvatar";
import { BedroomArea } from './BedroomArea';
import { KitchenArea } from './KitchenArea';
import { LivingArea } from './LivingArea';
import { GardenArea } from './GardenArea';
import { ArenaArea } from './ArenaArea';
import { ControlsPad } from './ControlsPad';
import { CoupleActionsBar } from './CoupleActionsBar';
import { DailyTasksModal } from './DailyTasksModal';
import { LoveNotesModal } from './LoveNotesModal';
import { LoginSyncModal } from './LoginSyncModal';
import { IntegrationGuideModal } from './IntegrationGuideModal';
import { OutfitModal } from './OutfitModal';
import { ChatDrawer } from './ChatDrawer';

export default function App() {
  // Load initial credentials from URL or localStorage
  const [credentials, setCredentials] = useState<UserCredentials>(() => {
    const params = new URLSearchParams(window.location.search);
    const saved = localStorage.getItem('heartsync_creds');
    let parsedSaved: Partial<UserCredentials> = {};
    if (saved) {
      try {
        parsedSaved = JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }

    const urlRole = params.get('role');
    const validRole: CharacterRole =
      urlRole === 'girl' || urlRole === 'boy'
        ? (urlRole as CharacterRole)
        : (parsedSaved.role as CharacterRole) || 'boy';

    const urlRoom = params.get('room') || params.get('pairKey');
    const finalRoom = (urlRoom || parsedSaved.roomKey || 'couple-nest-1')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '');

    const urlUsername = params.get('username') || params.get('user');
    const finalUsername = urlUsername || parsedSaved.username || (validRole === 'boy' ? 'Boy' : 'Girl');

    const creds: UserCredentials = {
      userId: params.get('userId') || parsedSaved.userId || `user_${Math.random().toString(36).substring(7)}`,
      username: finalUsername,
      role: validRole,
      roomKey: finalRoom || 'couple-nest-1',
      outfit: parsedSaved.outfit || 'classic_gi',
      token: params.get('token') || parsedSaved.token || '',
    };
    return creds;
  });

  // Current active viewing area
  const [currentArea, setCurrentArea] = useState<RoomArea>('bedroom');

  // Server-synced room state
  const [roomState, setRoomState] = useState<RoomState>({
    roomId: credentials.roomKey,
    loveMeter: 70,
    streakDays: 7,
    characters: {
      boy: {
        userId: 'boy_init',
        username: 'Boy',
        role: 'boy',
        x: 280,
        y: 360,
        facing: 'right',
        area: 'bedroom',
        currentAction: null,
        hp: 100,
        maxHp: 100,
        vibe: 90,
        isOnline: false,
        outfit: 'classic_gi',
        lastActive: Date.now(),
      },
      girl: {
        userId: 'girl_init',
        username: 'Girl',
        role: 'girl',
        x: 480,
        y: 360,
        facing: 'left',
        area: 'bedroom',
        currentAction: null,
        hp: 100,
        maxHp: 100,
        vibe: 90,
        isOnline: false,
        outfit: 'classic_gi',
        lastActive: Date.now(),
      },
    },
    tasks: [],
    loveNotes: [],
    chatHistory: [],
    sparringRound: 1,
    lastInteraction: 'Welcome to HeartSync!',
  });

  // Local movement & animation states
  const [speechBubble, setSpeechBubble] = useState<{ text: string; role: CharacterRole } | null>(null);
  const [hitEffect, setHitEffect] = useState<CharacterRole | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [isMusicPlaying, setIsMusicPlaying] = useState(sounds.getMusicPlaying());

  // Modal open states
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isLoginSyncOpen, setIsLoginSyncOpen] = useState(false);
  const [isIntegrationOpen, setIsIntegrationOpen] = useState(false);
  const [isOutfitOpen, setIsOutfitOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Movement loop refs
  const wsRef = useRef<WebSocket | null>(null);
  const moveDirectionRef = useRef<'up' | 'down' | 'left' | 'right' | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastSendTimeRef = useRef<number>(0);
  const stageRef = useRef<HTMLDivElement>(null);

  // Save credentials to localStorage
  useEffect(() => {
    localStorage.setItem('heartsync_creds', JSON.stringify(credentials));
  }, [credentials]);

  // Listen to postMessage from parent website (if embedded via iframe)
  useEffect(() => {
    const handlePostMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'HEARTSYNC_AUTH') {
        const payload = event.data.payload;
        if (payload) {
          setCredentials((prev) => ({
            ...prev,
            userId: payload.userId || prev.userId,
            username: payload.username || prev.username,
            role: payload.role === 'girl' ? 'girl' : 'boy',
            roomKey: payload.roomKey || prev.roomKey,
            token: payload.token || prev.token,
          }));
        }
      }
    };
    window.addEventListener('message', handlePostMessage);
    return () => window.removeEventListener('message', handlePostMessage);
  }, []);

  // Connect WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    let ws: WebSocket;
    let reconnectTimeout: any;

    function connect() {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        // Send join event
        ws.send(
          JSON.stringify({
            type: 'join',
            roomId: credentials.roomKey,
            role: credentials.role,
            username: credentials.username,
            userId: credentials.userId,
            outfit: credentials.outfit,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'init_state') {
            setRoomState(data.room);
            if (data.room.characters[credentials.role]) {
              setCurrentArea(data.room.characters[credentials.role].area);
            }
          } else if (data.type === 'presence') {
            setRoomState((prev) => ({
              ...prev,
              characters: data.characters,
            }));
          } else if (data.type === 'move') {
            setRoomState((prev) => {
              const role = data.role as CharacterRole;
              const updated = { ...prev.characters };
              if (updated[role]) {
                updated[role] = {
                  ...updated[role],
                  x: data.x,
                  y: data.y,
                  facing: data.facing,
                  area: data.area,
                };
              }
              return { ...prev, characters: updated };
            });
          } else if (data.type === 'action') {
            setRoomState((prev) => {
              const role = data.role as CharacterRole;
              const updated = { ...prev.characters };
              if (updated[role]) {
                updated[role] = {
                  ...updated[role],
                  currentAction: data.actionType,
                };
              }
              return {
                ...prev,
                characters: updated,
                loveMeter: data.loveMeter ?? prev.loveMeter,
                lastInteraction: data.lastInteraction ?? prev.lastInteraction,
              };
            });

            // Trigger action sounds & speech bubble
            if (data.actionType === 'kiss') sounds.playKiss();
            else if (data.actionType === 'hug' || data.actionType === 'cuddle') sounds.playHug();
            else if (data.actionType === 'punch') sounds.playPunch();
            else if (data.actionType === 'kick') sounds.playKick();
            else if (data.actionType === 'block') sounds.playBlock();
            else if (data.actionType === 'wakeup') sounds.playMorningAlarm();
            else sounds.playPop();

            const actionLabels: Record<string, string> = {
              hug: 'Hugging you tight! 💕',
              kiss: 'Sweet morning kiss! 💋',
              cuddle: 'Cuddling softly... 🥰',
              feed: 'Feeding you breakfast! 🥞',
              high_five: 'High five! ✋',
              dance: 'Dancing together! 💃',
              wakeup: 'Good morning sleepyhead! ☀️',
              sleep: 'Sweet dreams... 💤',
              brush_teeth: 'Sparkling clean! ✨',
              brew_coffee: 'Fresh coffee is ready! ☕',
              cook_pancakes: 'Hot pancakes flipped! 🍳',
              water_plants: 'Watered with love! 🌸',
            };

            setSpeechBubble({
              text: data.customText || actionLabels[data.actionType] || 'HeartSync! 💕',
              role: data.role as CharacterRole,
            });
            setTimeout(() => setSpeechBubble(null), 3000);
          } else if (data.type === 'spar_hit') {
            setHitEffect(data.target as CharacterRole);
            setTimeout(() => setHitEffect(null), 400);

            if (data.attackType === 'punch') sounds.playPunch();
            else sounds.playKick();

            setRoomState((prev) => ({
              ...prev,
              characters: {
                ...prev.characters,
                boy: { ...prev.characters.boy, hp: data.boyHp },
                girl: { ...prev.characters.girl, hp: data.girlHp },
              },
            }));
          } else if (data.type === 'spar_round_end') {
            sounds.playTaskComplete();
            confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
            setRoomState((prev) => ({
              ...prev,
              characters: {
                ...prev.characters,
                boy: { ...prev.characters.boy, hp: 100 },
                girl: { ...prev.characters.girl, hp: 100 },
              },
              sparringRound: data.sparringRound,
              loveMeter: data.loveMeter,
              lastInteraction: data.lastInteraction,
            }));
          } else if (data.type === 'spar_reset') {
            setRoomState((prev) => ({
              ...prev,
              characters: {
                ...prev.characters,
                boy: { ...prev.characters.boy, hp: data.boyHp },
                girl: { ...prev.characters.girl, hp: data.girlHp },
              },
            }));
          } else if (data.type === 'task_update') {
            if (data.task.completed) {
              sounds.playTaskComplete();
              confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
            } else {
              sounds.playPop();
            }
            setRoomState((prev) => ({
              ...prev,
              tasks: data.tasks,
              loveMeter: data.loveMeter,
              lastInteraction: data.lastInteraction,
            }));
          } else if (data.type === 'love_note') {
            sounds.playPop();
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
            setRoomState((prev) => ({
              ...prev,
              loveNotes: data.notes,
              tasks: data.tasks,
              loveMeter: data.loveMeter,
              lastInteraction: data.lastInteraction,
            }));
          } else if (data.type === 'chat') {
            sounds.playPop();
            setRoomState((prev) => ({
              ...prev,
              chatHistory: [...prev.chatHistory, data.message],
            }));
            setSpeechBubble({ text: data.message.text, role: data.message.sender });
            setTimeout(() => setSpeechBubble(null), 3500);
          } else if (data.type === 'teleport') {
            setRoomState((prev) => ({
              ...prev,
              characters: data.characters,
            }));
            if (data.role === credentials.role) {
              setCurrentArea(data.area);
            }
          } else if (data.type === 'tasks_reset') {
            sounds.playPop();
            setRoomState((prev) => ({
              ...prev,
              tasks: data.tasks,
            }));
          }
        } catch (err) {
          console.error('Error parsing ws packet', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        reconnectTimeout = setTimeout(connect, 2000);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, [credentials.roomKey, credentials.role, credentials.username, credentials.userId, credentials.outfit]);

  // Send movement to server
  const sendMove = useCallback(
    (x: number, y: number, facing: 'left' | 'right', area: RoomArea, isMoving: boolean) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
      const now = performance.now();
      if (now - lastSendTimeRef.current < 35 && isMoving) return;
      lastSendTimeRef.current = now;

      wsRef.current.send(
        JSON.stringify({
          type: 'move',
          x,
          y,
          facing,
          area,
          isMoving,
        })
      );
    },
    []
  );

  // Send Action to server
  const sendAction = useCallback(
    (actionType: string, customText?: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
      wsRef.current.send(
        JSON.stringify({
          type: 'action',
          actionType,
          customText,
        })
      );
    },
    []
  );

  // Movement loop
  useEffect(() => {
    const SPEED = 4.2;

    const loop = () => {
      const dir = moveDirectionRef.current;
      if (dir) {
        setRoomState((prev) => {
          const myChar = prev.characters[credentials.role];
          let nextX = myChar.x;
          let nextY = myChar.y;
          let facing = myChar.facing;

          if (dir === 'left') {
            nextX = Math.max(60, myChar.x - SPEED);
            facing = 'left';
          } else if (dir === 'right') {
            nextX = Math.min(840, myChar.x + SPEED);
            facing = 'right';
          } else if (dir === 'up') {
            nextY = Math.max(160, myChar.y - SPEED);
          } else if (dir === 'down') {
            nextY = Math.min(460, myChar.y + SPEED);
          }

          sendMove(nextX, nextY, facing, currentArea, true);

          return {
            ...prev,
            characters: {
              ...prev.characters,
              [credentials.role]: {
                ...myChar,
                x: nextX,
                y: nextY,
                facing,
                area: currentArea,
              },
            },
          };
        });
      }
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [credentials.role, currentArea, sendMove]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveDirectionRef.current = 'left';
        sounds.playFootstep();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveDirectionRef.current = 'right';
        sounds.playFootstep();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        moveDirectionRef.current = 'up';
        sounds.playFootstep();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        moveDirectionRef.current = 'down';
        sounds.playFootstep();
      } else if (e.key === 'j' || e.key === 'J') {
        handlePunch();
      } else if (e.key === 'k' || e.key === 'K') {
        handleKick();
      } else if (e.key === 'l' || e.key === 'L') {
        handleBlock();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleJump();
      } else if (e.key === '1') {
        sendAction('hug');
      } else if (e.key === '2') {
        sendAction('kiss');
      } else if (e.key === '3') {
        sendAction('cuddle');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (
        ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', 'w', 's', 'A', 'D', 'W', 'S'].includes(
          e.key
        )
      ) {
        moveDirectionRef.current = null;
        const myChar = roomState.characters[credentials.role];
        sendMove(myChar.x, myChar.y, myChar.facing, currentArea, false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [credentials.role, currentArea, roomState.characters, sendMove, sendAction]);

  // Click on stage floor to walk
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (clickY < 120 || clickY > 480) return; // avoid clicking top bar or off stage

    const myChar = roomState.characters[credentials.role];
    const facing = clickX < myChar.x ? 'left' : 'right';

    sounds.playFootstep();
    setRoomState((prev) => ({
      ...prev,
      characters: {
        ...prev.characters,
        [credentials.role]: {
          ...myChar,
          x: clickX,
          y: clickY,
          facing,
          area: currentArea,
        },
      },
    }));
    sendMove(clickX, clickY, facing, currentArea, false);
  };

  // Change Area
  const handleSelectArea = (area: RoomArea) => {
    setCurrentArea(area);
    sounds.playPop();
    const myChar = roomState.characters[credentials.role];
    setRoomState((prev) => ({
      ...prev,
      characters: {
        ...prev.characters,
        [credentials.role]: {
          ...myChar,
          area,
        },
      },
    }));
    sendMove(myChar.x, myChar.y, myChar.facing, area, false);
  };

  // Combat actions in Arena
  const handlePunch = () => {
    sendAction('punch');
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'spar_attack',
          attackType: 'punch',
          damage: 12,
        })
      );
    }
  };

  const handleKick = () => {
    sendAction('kick');
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'spar_attack',
          attackType: 'kick',
          damage: 18,
        })
      );
    }
  };

  const handleBlock = () => {
    sendAction('block');
  };

  const handleJump = () => {
    sendAction('jump');
    setTimeout(() => {
      sendAction('idle');
    }, 450);
  };

  const handleTruce = () => {
    sendAction('hug', 'Truce & Kiss! We love each other! ❤️');
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'spar_reset' }));
    }
    sounds.playHug();
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  const handleResetHp = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'spar_reset' }));
    }
  };

  // Teleport to partner
  const handleTeleportToPartner = () => {
    sounds.playPop();
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'teleport_to_partner' }));
    }
  };

  // Toggle tasks
  const handleToggleTask = (taskId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'task_toggle', taskId }));
    }
  };

  // Reset tasks
  const handleResetTasks = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'reset_all_tasks' }));
    }
  };

  // Post love note
  const handlePostNote = (text: string, emoji: string, color: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'post_note', text, emoji, color }));
    }
  };

  // Send chat
  const handleSendMessage = (text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'chat', text }));
    }
  };

  // Audio toggles
  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleMusic = () => {
    const playing = sounds.toggleMusic();
    setIsMusicPlaying(playing);
  };

  // Check proximity between Boy and Girl
  const boyChar = roomState.characters.boy;
  const girlChar = roomState.characters.girl;
  const partnerRole: CharacterRole = credentials.role === 'boy' ? 'girl' : 'boy';
  const partnerChar = roomState.characters[partnerRole];

  const sameArea = boyChar.area === girlChar.area;
  const distance = Math.hypot(boyChar.x - girlChar.x, boyChar.y - girlChar.y);

  const pendingTasksCount = roomState.tasks.filter((t) => !t.completed).length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans select-none text-slate-800">
      {/* Top Navbar */}
      <header className="h-14 bg-white/95 backdrop-blur-md border-b border-rose-200 px-3 sm:px-5 flex items-center justify-between shrink-0 shadow-xs z-40">
        {/* Brand & Connection Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl animate-pulse">💖</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-slate-900 tracking-tight">HeartSync</span>
                <span className="text-[10px] font-extrabold bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-md">
                  Couples Daily
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span>Room: <strong className="font-mono text-slate-700">{roomState.roomId}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Love Meter Center */}
        <div className="hidden md:flex items-center gap-3 bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full shadow-inner">
          <span className="text-xs font-black text-rose-700 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            Love Meter: {roomState.loveMeter}%
          </span>
          <div className="w-24 h-2.5 bg-rose-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${roomState.loveMeter}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
            🔥 {roomState.streakDays} Day Streak
          </span>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Daily Tasks Button */}
          <button
            onClick={() => setIsTasksOpen(true)}
            className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sun className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Daily Tasks</span>
            {pendingTasksCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-rose-600 text-[10px] font-black flex items-center justify-center">
                {pendingTasksCount}
              </span>
            )}
          </button>

          {/* Secret Love Board */}
          <button
            onClick={() => setIsNotesOpen(true)}
            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
            title="Open Secret Love Board"
          >
            <span>💌</span>
            <span className="hidden md:inline">Love Board</span>
          </button>

          {/* Sound / Music Controls */}
          <button
            onClick={handleToggleMusic}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isMusicPlaying
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
            title="Toggle Cozy Lofi Melodies"
          >
            <Music className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 transition cursor-pointer"
            title="Toggle Sound Effects"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Chat Drawer Toggle */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition cursor-pointer relative"
            title="Whisper Chat"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white" />
          </button>

          {/* Website Embed / Auth Bridge Modal */}
          <button
            onClick={() => setIsIntegrationOpen(true)}
            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1 transition cursor-pointer"
            title="Embed onto Your Existing Website"
          >
            <Code2 className="w-4 h-4 text-rose-400" />
            <span className="hidden lg:inline">Website Embed</span>
          </button>

          {/* Login Credentials & Device Sync */}
          <button
            onClick={() => setIsLoginSyncOpen(true)}
            className="px-2.5 py-1.5 bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border border-pink-300 rounded-xl text-xs font-black text-rose-800 flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <span>{credentials.role === 'boy' ? '👦🏻' : '👧🏻'}</span>
            <span className="hidden sm:inline">{credentials.username}</span>
            <Key className="w-3.5 h-3.5 text-rose-500" />
          </button>
        </div>
      </header>

      {/* Area Selector Tabs (Home Bedroom, Kitchen, Living, Romance Garden, Chibi Arena) */}
      <nav className="h-10 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between overflow-x-auto no-scrollbar shrink-0 z-30">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => handleSelectArea('bedroom')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              currentArea === 'bedroom'
                ? 'bg-rose-500 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>🛏️</span>
            <span>Sweet Bedroom</span>
          </button>

          <button
            onClick={() => handleSelectArea('kitchen')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              currentArea === 'kitchen'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>🍳</span>
            <span>Kitchen & Dining</span>
          </button>

          <button
            onClick={() => handleSelectArea('living')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              currentArea === 'living'
                ? 'bg-pink-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>🛋️</span>
            <span>Living & Hearth</span>
          </button>

          <button
            onClick={() => handleSelectArea('garden')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              currentArea === 'garden'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>🌸</span>
            <span>Romance Garden</span>
          </button>

          <button
            onClick={() => handleSelectArea('arena')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer ${
              currentArea === 'arena'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg ring-1 ring-white/50 animate-pulse'
                : 'text-rose-400 hover:bg-slate-800'
            }`}
          >
            <span>🥋</span>
            <span>Chibi Arena</span>
          </button>
        </div>

        {/* Partner Position Pill */}
        <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium pl-3 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>
            {partnerChar.username}: <strong className="text-white capitalize">{partnerChar.area}</strong>
          </span>
          {partnerChar.area !== currentArea && (
            <button
              onClick={() => handleSelectArea(partnerChar.area)}
              className="ml-1 text-[10px] text-pink-400 hover:text-pink-300 font-bold underline cursor-pointer"
            >
              Go there
            </button>
          )}
        </div>
      </nav>

      {/* Main Interactive Stage Canvas */}
      <main
        ref={stageRef}
        onClick={handleStageClick}
        className="relative flex-1 w-full overflow-hidden bg-slate-900 cursor-crosshair"
      >
        {/* Render Selected Area Backdrop */}
        {currentArea === 'bedroom' && (
          <BedroomArea
            onInteract={(action) => {
              if (action === 'alarm_ring') {
                sounds.playMorningAlarm();
                sendAction('wakeup', 'Alarm ringing! Time to rise! ☀️');
              } else {
                sendAction(action);
              }
            }}
            onOpenTasks={() => setIsTasksOpen(true)}
            onOpenOutfits={() => setIsOutfitOpen(true)}
            characters={roomState.characters}
          />
        )}

        {currentArea === 'kitchen' && (
          <KitchenArea
            onInteract={(action) => sendAction(action)}
            characters={roomState.characters}
          />
        )}

        {currentArea === 'living' && (
          <LivingArea
            onInteract={(action) => sendAction(action)}
            onOpenNotes={() => setIsNotesOpen(true)}
            isMusicPlaying={isMusicPlaying}
            onToggleMusic={handleToggleMusic}
            characters={roomState.characters}
            notesCount={roomState.loveNotes.length}
          />
        )}

        {currentArea === 'garden' && (
          <GardenArea
            onInteract={(action) => sendAction(action)}
            characters={roomState.characters}
          />
        )}

        {currentArea === 'arena' && (
          <ArenaArea
            characters={roomState.characters}
            myRole={credentials.role}
            sparringRound={roomState.sparringRound}
            onAttack={handlePunch}
            onBlock={handleBlock}
            onJump={handleJump}
            onTruce={handleTruce}
            onResetHp={handleResetHp}
          />
        )}

        {/* Render Chibi Characters if they are in this area */}
        {boyChar.area === currentArea && (
          <ChibiAvatar
            character={boyChar}
            isSelf={credentials.role === 'boy'}
            speechBubble={speechBubble?.role === 'boy' ? speechBubble.text : null}
            showHitEffect={hitEffect === 'boy'}
          />
        )}

        {girlChar.area === currentArea && (
          <ChibiAvatar
            character={girlChar}
            isSelf={credentials.role === 'girl'}
            speechBubble={speechBubble?.role === 'girl' ? speechBubble.text : null}
            showHitEffect={hitEffect === 'girl'}
          />
        )}

        {/* Quick Couple Actions Float Bar */}
        <CoupleActionsBar
          onAction={(act) => sendAction(act)}
          onTeleport={handleTeleportToPartner}
          sameArea={sameArea}
          distance={distance}
          partnerArea={partnerChar.area}
          partnerName={partnerChar.username}
        />

        {/* Controls Pad (Touch D-pad and Action buttons on mobile/tablet) */}
        <ControlsPad
          onMoveStart={(dir) => {
            moveDirectionRef.current = dir;
            sounds.playFootstep();
          }}
          onMoveEnd={() => {
            moveDirectionRef.current = null;
            const myChar = roomState.characters[credentials.role];
            sendMove(myChar.x, myChar.y, myChar.facing, currentArea, false);
          }}
          onPunch={handlePunch}
          onKick={handleKick}
          onBlock={handleBlock}
          onJump={handleJump}
          onHug={() => sendAction('hug')}
          onKiss={() => sendAction('kiss')}
          isArena={currentArea === 'arena'}
        />

        {/* Keyboard Help Watermark (Desktop) */}
        <div className="hidden lg:flex absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/60 backdrop-blur-xs text-white/70 text-[10px] px-3 py-1 rounded-full pointer-events-none items-center gap-3 border border-white/10">
          <span>Move: <strong className="text-white">WASD / Arrows</strong></span>
          <span>Jump: <strong className="text-white">Space</strong></span>
          <span>Punch: <strong className="text-white">J</strong></span>
          <span>Kick: <strong className="text-white">K</strong></span>
          <span>Block: <strong className="text-white">L</strong></span>
          <span>Couple Actions: <strong className="text-white">1, 2, 3</strong></span>
        </div>
      </main>

      {/* Floating Notification of Last Couple Interaction */}
      {roomState.lastInteraction && (
        <div className="absolute top-26 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg border border-pink-200 text-xs text-slate-800 font-bold animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span>{roomState.lastInteraction}</span>
        </div>
      )}

      {/* Modals & Drawers */}
      <DailyTasksModal
        isOpen={isTasksOpen}
        onClose={() => setIsTasksOpen(false)}
        tasks={roomState.tasks}
        onToggleTask={handleToggleTask}
        onResetTasks={handleResetTasks}
        myRole={credentials.role}
        boyName={boyChar.username}
        girlName={girlChar.username}
        loveMeter={roomState.loveMeter}
      />

      <LoveNotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        notes={roomState.loveNotes}
        onPostNote={handlePostNote}
        myRole={credentials.role}
      />

      <LoginSyncModal
        isOpen={isLoginSyncOpen}
        onClose={() => setIsLoginSyncOpen(false)}
        credentials={credentials}
        onSaveCredentials={(newCreds) => {
          setCredentials(newCreds);
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({
                type: 'join',
                roomId: newCreds.roomKey,
                role: newCreds.role,
                username: newCreds.username,
                userId: newCreds.userId,
                outfit: newCreds.outfit,
              })
            );
          }
        }}
      />

      <IntegrationGuideModal
        isOpen={isIntegrationOpen}
        onClose={() => setIsIntegrationOpen(false)}
        roomKey={credentials.roomKey}
      />

      <OutfitModal
        isOpen={isOutfitOpen}
        onClose={() => setIsOutfitOpen(false)}
        currentOutfit={credentials.outfit}
        onSelectOutfit={(outfitId) => {
          setCredentials((prev) => ({ ...prev, outfit: outfitId }));
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({
                type: 'join',
                roomId: credentials.roomKey,
                role: credentials.role,
                username: credentials.username,
                userId: credentials.userId,
                outfit: outfitId,
              })
            );
          }
        }}
        role={credentials.role}
      />

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={roomState.chatHistory}
        onSendMessage={handleSendMessage}
        myRole={credentials.role}
        boyName={boyChar.username}
        girlName={girlChar.username}
      />
    </div>
  );
}
