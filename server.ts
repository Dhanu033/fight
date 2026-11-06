import express, { Request, Response } from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

export interface CharacterState {
  userId: string;
  username: string;
  role: 'boy' | 'girl';
  x: number;
  y: number;
  facing: 'left' | 'right';
  area: 'bedroom' | 'kitchen' | 'living' | 'garden' | 'arena';
  currentAction: string | null;
  hp: number;
  maxHp: number;
  vibe: number;
  isOnline: boolean;
  outfit: string;
  lastActive: number;
}

export interface DailyTask {
  id: string;
  title: string;
  time: string;
  icon: string;
  desc: string;
  category: 'Morning' | 'Meal' | 'Bonding' | 'Activity' | 'Night';
  boyDone: boolean;
  girlDone: boolean;
  completed: boolean;
  completedAt?: string;
  points: number;
}

export interface LoveNote {
  id: string;
  author: 'boy' | 'girl';
  authorName: string;
  text: string;
  timestamp: string;
  emoji: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  sender: 'boy' | 'girl';
  senderName: string;
  text: string;
  timestamp: string;
  isAction?: boolean;
}

export interface RoomState {
  roomId: string;
  loveMeter: number;
  streakDays: number;
  characters: {
    boy: CharacterState;
    girl: CharacterState;
  };
  tasks: DailyTask[];
  loveNotes: LoveNote[];
  chatHistory: ChatMessage[];
  sparringRound: number;
  lastInteraction: string;
}

const DEFAULT_TASKS: DailyTask[] = [
  {
    id: 'wakeup',
    title: 'Early Morning Wakeup & Morning Stretch',
    time: '06:30 AM',
    icon: 'Sunrise',
    desc: 'Rise early together, stretch out and beat the morning snooze!',
    category: 'Morning',
    boyDone: false,
    girlDone: false,
    completed: false,
    points: 15,
  },
  {
    id: 'morning_kiss',
    title: 'Morning Greeting & Sweet Kiss',
    time: '07:00 AM',
    icon: 'Heart',
    desc: 'Meet by the bed or mirror to share a warm morning kiss',
    category: 'Morning',
    boyDone: false,
    girlDone: false,
    completed: false,
    points: 15,
  },
  {
    id: 'brush_teeth',
    title: 'Vanity Mirror Care & Brush Teeth',
    time: '07:15 AM',
    icon: 'Sparkles',
    desc: 'Freshen up, brush teeth and sparkle up for the day',
    category: 'Morning',
    boyDone: false,
    girlDone: false,
    completed: false,
    points: 10,
  },
  {
    id: 'cook_breakfast',
    title: 'Brew Fresh Coffee & Flip Pancakes',
    time: '07:45 AM',
    icon: 'Coffee',
    desc: 'Meet in the kitchen to brew coffee and feed each other breakfast',
    category: 'Meal',
    boyDone: false,
    girlDone: false,
    completed: false,
    points: 20,
  },
  {
    id: 'garden_walk',
    title: 'Romance Garden Walk & Flower Care',
    time: '09:30 AM',
    icon: 'Flower2',
    desc: 'Head to the Sakura Garden, water roses and sit under the heart arch',
    category: 'Activity',
    boyDone: false,
    girlDone: false,
    completed: false,
    points: 15,
  },
  {
    id: 'secret_note',
    title: 'Write Daily Secret Love Note',
    time: '12:30 PM',
    icon: 'Mail',
    desc: 'Pin a loving thought or surprise note on the couple corkboard',
    category: 'Bonding',
    boyDone: false,
    girlDone: false,
    completed: false,
    points: 15,
  },
  {
    id: 'chibi_spar',
    title: 'Chibi Valentine Arena Friendly Spar',
    time: '03:30 PM',
    icon: 'Swords',
    desc: 'Jump into the martial arts arena for a cute punch/kick mini-duel',
    category: 'Activity',
    boyDone: false,
    girlDone: false,
    completed: false,
    points: 20,
  },
  {
    id: 'couch_cuddle',
    title: 'Living Room Fireside Cuddle & Chat',
    time: '08:00 PM',
    icon: 'Flame',
    desc: 'Snuggle together on the living room sofa and share your day',
    category: 'Bonding',
    boyDone: false,
    girlDone: false,
    completed: false,
    points: 15,
  },
  {
    id: 'bedtime_rest',
    title: 'Night Sweet Dreams & Goodnight Hug',
    time: '10:30 PM',
    icon: 'Moon',
    desc: 'Head back to the sweet bedroom and cuddle to sleep',
    category: 'Night',
    boyDone: false,
    girlDone: false,
    completed: false,
    points: 15,
  },
];

// In-memory rooms
const rooms = new Map<string, RoomState>();
const clientRooms = new Map<WebSocket, { roomId: string; role: 'boy' | 'girl'; userId: string }>();

function getOrCreateRoom(roomId: string): RoomState {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      roomId,
      loveMeter: 65,
      streakDays: 7,
      characters: {
        boy: {
          userId: 'boy_' + Math.random().toString(36).substring(7),
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
          userId: 'girl_' + Math.random().toString(36).substring(7),
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
      tasks: JSON.parse(JSON.stringify(DEFAULT_TASKS)),
      loveNotes: [
        {
          id: 'note-1',
          author: 'boy',
          authorName: 'Boy',
          text: 'Good morning sleepyhead! Made you a warm cup of coffee ❤️',
          timestamp: '07:30 AM',
          emoji: '☕',
          color: 'amber',
        },
        {
          id: 'note-2',
          author: 'girl',
          authorName: 'Girl',
          text: 'Meet me at the garden bench after lunch! I have a sweet surprise 🌸',
          timestamp: '11:15 AM',
          emoji: '🌸',
          color: 'pink',
        },
      ],
      chatHistory: [
        {
          id: 'chat-1',
          sender: 'boy',
          senderName: 'Boy',
          text: 'Morning sweetheart! Ready to start our day?',
          timestamp: 'Just now',
        },
        {
          id: 'chat-2',
          sender: 'girl',
          senderName: 'Girl',
          text: 'Waking up now! Lets brush teeth together 💕',
          timestamp: 'Just now',
        },
      ],
      sparringRound: 1,
      lastInteraction: 'Welcome to your cozy world',
    });
  }
  return rooms.get(roomId)!;
}

function broadcastToRoom(roomId: string, message: object, senderWs?: WebSocket) {
  const payload = JSON.stringify(message);
  for (const [ws, info] of clientRooms.entries()) {
    if (info.roomId === roomId && ws.readyState === WebSocket.OPEN) {
      if (!senderWs || ws !== senderWs || (message as any).echoToSender) {
        ws.send(payload);
      }
    }
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes for Website Integration & Auth Bridge
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // Verify external login credentials or token from parent website
  app.post('/api/auth/verify-token', (req: Request, res: Response) => {
    const { token, username, userId, role, pairKey } = req.body;
    // Flexible integration allowing external websites to authenticate their users
    const verifiedRole = (role === 'girl' ? 'girl' : 'boy') as 'boy' | 'girl';
    const roomKey = (pairKey || 'couple-nest-1').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

    res.json({
      success: true,
      user: {
        userId: userId || `ext_${Math.random().toString(36).substring(7)}`,
        username: username || (verifiedRole === 'boy' ? 'Boy' : 'Girl'),
        role: verifiedRole,
        roomKey: roomKey || 'couple-nest-1',
      },
      message: 'Credentials synchronized successfully with HeartSync platform.',
    });
  });

  // Get current room status
  app.get('/api/room/:roomId', (req: Request, res: Response) => {
    const roomId = req.params.roomId.trim().toLowerCase();
    const room = getOrCreateRoom(roomId);
    res.json({
      roomId: room.roomId,
      loveMeter: room.loveMeter,
      boyOnline: room.characters.boy.isOnline,
      girlOnline: room.characters.girl.isOnline,
      streakDays: room.streakDays,
      tasksRemaining: room.tasks.filter((t) => !t.completed).length,
    });
  });

  // Embed Snippet Generator for the user's existing website
  app.get('/api/embed-snippet', (req: Request, res: Response) => {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol || 'http';
    res.json({
      iframeCode: `<iframe src="${protocol}://${host}?embed=true&token=YOUR_USER_TOKEN&room=COUPLE_ROOM_KEY&role=boy" width="100%" height="700" frameborder="0" allow="autoplay; sound" style="border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);"></iframe>`,
      postMessageScript: `// Example script in your existing website to send logged-in user credentials:
const frame = document.querySelector('iframe');
frame.contentWindow.postMessage({
  type: 'HEARTSYNC_AUTH',
  payload: {
    userId: currentUser.id,
    username: currentUser.name,
    role: currentUser.preferredCharacter || 'boy', // or 'girl'
    roomKey: currentUser.partnerRoomId || 'couple-123'
  }
}, '*');`,
    });
  });

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (raw: string) => {
      try {
        const data = JSON.parse(raw.toString());
        const { type } = data;

        if (type === 'join') {
          const { roomId = 'couple-nest-1', role = 'boy', username, userId, outfit } = data;
          const cleanRoomId = (roomId || 'couple-nest-1').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'couple-nest-1';
          const validRole: 'boy' | 'girl' = role === 'girl' ? 'girl' : 'boy';
          const finalUserId = userId || `${validRole}_${Math.random().toString(36).substring(7)}`;

          clientRooms.set(ws, { roomId: cleanRoomId, role: validRole, userId: finalUserId });

          const room = getOrCreateRoom(cleanRoomId);
          const char = room.characters[validRole];
          char.userId = finalUserId;
          if (username) char.username = username;
          if (outfit) char.outfit = outfit;
          char.isOnline = true;
          char.lastActive = Date.now();

          // Send current full state to joining client
          ws.send(
            JSON.stringify({
              type: 'init_state',
              echoToSender: true,
              role: validRole,
              room,
            })
          );

          // Broadcast presence update
          broadcastToRoom(
            cleanRoomId,
            {
              type: 'presence',
              role: validRole,
              isOnline: true,
              username: char.username,
              characters: room.characters,
            },
            ws
          );
        }

        const clientInfo = clientRooms.get(ws);
        if (!clientInfo) return;
        const { roomId, role } = clientInfo;
        const room = getOrCreateRoom(roomId);

        if (type === 'move') {
          const { x, y, facing, area, isMoving } = data;
          const char = room.characters[role];
          if (typeof x === 'number') char.x = Math.max(40, Math.min(840, x));
          if (typeof y === 'number') char.y = Math.max(120, Math.min(460, y));
          if (facing === 'left' || facing === 'right') char.facing = facing;
          if (area) char.area = area;
          char.lastActive = Date.now();

          broadcastToRoom(
            roomId,
            {
              type: 'move',
              role,
              x: char.x,
              y: char.y,
              facing: char.facing,
              area: char.area,
              isMoving: !!isMoving,
            },
            ws
          );
        } else if (type === 'action') {
          const { actionType, customText } = data;
          const char = room.characters[role];
          char.currentAction = actionType;
          char.lastActive = Date.now();

          // Increase love meter for affectionate actions
          if (['hug', 'kiss', 'cuddle', 'hold_hands', 'feed', 'dance'].includes(actionType)) {
            room.loveMeter = Math.min(100, room.loveMeter + 2);
            room.lastInteraction = `${char.username} gave a sweet ${actionType.replace('_', ' ')}!`;
          }

          broadcastToRoom(
            roomId,
            {
              type: 'action',
              role,
              actionType,
              customText,
              loveMeter: room.loveMeter,
              lastInteraction: room.lastInteraction,
              echoToSender: true,
            }
          );

          // Auto-clear action state after duration
          setTimeout(() => {
            if (char.currentAction === actionType) {
              char.currentAction = null;
            }
          }, 3500);
        } else if (type === 'spar_attack') {
          const { attackType, damage = 12 } = data;
          const targetRole: 'boy' | 'girl' = role === 'boy' ? 'girl' : 'boy';
          const target = room.characters[targetRole];
          const attacker = room.characters[role];

          // Calculate new HP
          const actualDamage = target.currentAction === 'block' ? Math.floor(damage * 0.3) : damage;
          target.hp = Math.max(0, target.hp - actualDamage);
          attacker.vibe = Math.min(100, attacker.vibe + 8);

          if (target.hp === 0) {
            // Friendly knockout -> auto truce!
            target.hp = 100;
            attacker.hp = 100;
            room.sparringRound += 1;
            room.loveMeter = Math.min(100, room.loveMeter + 5);
            room.lastInteraction = `Playful duel ended with sweet laughter and hugs! ❤️`;

            broadcastToRoom(
              roomId,
              {
                type: 'spar_round_end',
                winner: role,
                sparringRound: room.sparringRound,
                loveMeter: room.loveMeter,
                lastInteraction: room.lastInteraction,
                echoToSender: true,
              }
            );
          } else {
            broadcastToRoom(
              roomId,
              {
                type: 'spar_hit',
                attacker: role,
                target: targetRole,
                attackType,
                damage: actualDamage,
                boyHp: room.characters.boy.hp,
                girlHp: room.characters.girl.hp,
                isBlocked: target.currentAction === 'block',
                echoToSender: true,
              }
            );
          }
        } else if (type === 'spar_reset') {
          room.characters.boy.hp = 100;
          room.characters.girl.hp = 100;
          broadcastToRoom(
            roomId,
            {
              type: 'spar_reset',
              boyHp: 100,
              girlHp: 100,
              echoToSender: true,
            }
          );
        } else if (type === 'task_toggle') {
          const { taskId } = data;
          const task = room.tasks.find((t) => t.id === taskId);
          if (task) {
            if (role === 'boy') {
              task.boyDone = !task.boyDone;
            } else {
              task.girlDone = !task.girlDone;
            }

            // Both completed
            if (task.boyDone && task.girlDone && !task.completed) {
              task.completed = true;
              task.completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              room.loveMeter = Math.min(100, room.loveMeter + task.points);
              room.lastInteraction = `Completed task: "${task.title}" together! 🎉`;
            } else if (!task.boyDone || !task.girlDone) {
              task.completed = false;
            }

            broadcastToRoom(
              roomId,
              {
                type: 'task_update',
                task,
                tasks: room.tasks,
                loveMeter: room.loveMeter,
                lastInteraction: room.lastInteraction,
                echoToSender: true,
              }
            );
          }
        } else if (type === 'post_note') {
          const { text, emoji = '💌', color = 'pink' } = data;
          if (text && text.trim()) {
            const char = room.characters[role];
            const newNote: LoveNote = {
              id: 'note_' + Date.now(),
              author: role,
              authorName: char.username,
              text: text.trim().slice(0, 200),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              emoji,
              color,
            };
            room.loveNotes.unshift(newNote);
            if (room.loveNotes.length > 30) room.loveNotes.pop();

            room.loveMeter = Math.min(100, room.loveMeter + 5);
            room.lastInteraction = `${char.username} posted a sweet love note!`;

            // Auto complete secret_note task if available
            const noteTask = room.tasks.find((t) => t.id === 'secret_note');
            if (noteTask) {
              if (role === 'boy') noteTask.boyDone = true;
              if (role === 'girl') noteTask.girlDone = true;
              if (noteTask.boyDone && noteTask.girlDone) noteTask.completed = true;
            }

            broadcastToRoom(
              roomId,
              {
                type: 'love_note',
                note: newNote,
                notes: room.loveNotes,
                tasks: room.tasks,
                loveMeter: room.loveMeter,
                lastInteraction: room.lastInteraction,
                echoToSender: true,
              }
            );
          }
        } else if (type === 'chat') {
          const { text, isAction } = data;
          if (text && text.trim()) {
            const char = room.characters[role];
            const chatMsg: ChatMessage = {
              id: 'chat_' + Date.now(),
              sender: role,
              senderName: char.username,
              text: text.trim().slice(0, 150),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isAction: !!isAction,
            };
            room.chatHistory.push(chatMsg);
            if (room.chatHistory.length > 50) room.chatHistory.shift();

            broadcastToRoom(
              roomId,
              {
                type: 'chat',
                message: chatMsg,
                echoToSender: true,
              }
            );
          }
        } else if (type === 'teleport_to_partner') {
          const otherRole: 'boy' | 'girl' = role === 'boy' ? 'girl' : 'boy';
          const partner = room.characters[otherRole];
          const self = room.characters[role];

          self.area = partner.area;
          self.x = partner.facing === 'left' ? partner.x + 80 : partner.x - 80;
          self.y = partner.y;
          self.facing = partner.facing === 'left' ? 'right' : 'left';

          broadcastToRoom(
            roomId,
            {
              type: 'teleport',
              role,
              area: self.area,
              x: self.x,
              y: self.y,
              facing: self.facing,
              characters: room.characters,
              echoToSender: true,
            }
          );
        } else if (type === 'reset_all_tasks') {
          room.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
          broadcastToRoom(
            roomId,
            {
              type: 'tasks_reset',
              tasks: room.tasks,
              echoToSender: true,
            }
          );
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      const clientInfo = clientRooms.get(ws);
      if (clientInfo) {
        const { roomId, role } = clientInfo;
        const room = rooms.get(roomId);
        if (room && room.characters[role]) {
          room.characters[role].isOnline = false;
          broadcastToRoom(roomId, {
            type: 'presence',
            role,
            isOnline: false,
            username: room.characters[role].username,
            characters: room.characters,
          });
        }
        clientRooms.delete(ws);
      }
    });
  });

  // Setup Vite in Dev or Static files in Prod
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`HeartSync Couple Game server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
