export type CharacterRole = 'boy' | 'girl';
export type RoomArea = 'bedroom' | 'kitchen' | 'living' | 'garden' | 'arena';

export interface CharacterState {
  userId: string;
  username: string;
  role: CharacterRole;
  x: number;
  y: number;
  facing: 'left' | 'right';
  area: RoomArea;
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
  author: CharacterRole;
  authorName: string;
  text: string;
  timestamp: string;
  emoji: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  sender: CharacterRole;
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

export interface UserCredentials {
  userId: string;
  username: string;
  role: CharacterRole;
  roomKey: string;
  outfit: string;
  token?: string;
}
