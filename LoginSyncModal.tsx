import React, { useState } from 'react';
import { X, Key, Share2, Copy, Check, Users, Sparkles, Smartphone, Laptop, Link } from 'lucide-react';
import { CharacterRole, UserCredentials } from '../types';

interface LoginSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: UserCredentials;
  onSaveCredentials: (newCreds: UserCredentials) => void;
}

export const LoginSyncModal: React.FC<LoginSyncModalProps> = ({
  isOpen,
  onClose,
  credentials,
  onSaveCredentials,
}) => {
  const [username, setUsername] = useState(credentials.username);
  const [role, setRole] = useState<CharacterRole>(credentials.role);
  const [roomKey, setRoomKey] = useState(credentials.roomKey);
  const [userId, setUserId] = useState(credentials.userId || '');
  const [token, setToken] = useState(credentials.token || '');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const partnerRole = role === 'boy' ? 'girl' : 'boy';
  const partnerJoinUrl = `${window.location.origin}?room=${encodeURIComponent(
    roomKey
  )}&role=${partnerRole}`;

  const handleCopyPartnerLink = () => {
    navigator.clipboard.writeText(partnerJoinUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCredentials({
      userId: userId.trim() || `user_${Math.random().toString(36).substring(7)}`,
      username: username.trim() || (role === 'boy' ? 'Boy' : 'Girl'),
      role,
      roomKey: roomKey.trim().toLowerCase() || 'couple-nest-1',
      outfit: credentials.outfit,
      token: token.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-pink-200 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-4 text-white flex justify-between items-center shadow">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Key className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black">Sync Login Credentials & Devices</h2>
              <p className="text-[11px] text-pink-100">
                Link existing website user credentials & play across all devices
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Character Role Selection */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1.5">
              1. Choose Your Character Role:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('boy')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition cursor-pointer ${
                  role === 'boy'
                    ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-300'
                    : 'border-slate-200 hover:border-blue-200 bg-white'
                }`}
              >
                <span className="text-3xl">👦🏻</span>
                <div className="text-left">
                  <span className="block text-xs font-black text-slate-800">Boy Character</span>
                  <span className="text-[10px] text-blue-600 font-bold">Player 1 (Boy)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('girl')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition cursor-pointer ${
                  role === 'girl'
                    ? 'border-pink-500 bg-pink-50 shadow-md ring-2 ring-pink-300'
                    : 'border-slate-200 hover:border-pink-200 bg-white'
                }`}
              >
                <span className="text-3xl">👧🏻</span>
                <div className="text-left">
                  <span className="block text-xs font-black text-slate-800">Girl Character</span>
                  <span className="text-[10px] text-pink-600 font-bold">Player 2 (Girl)</span>
                </div>
              </button>
            </div>
          </div>

          {/* Existing Website Username */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              2. Your Platform / Website Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Alex"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Couple Room / Sync Key */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1 flex justify-between">
              <span>3. Couple Room / Pairing Key:</span>
              <span className="text-[10px] text-slate-400 font-normal">Share this with partner</span>
            </label>
            <input
              type="text"
              value={roomKey}
              onChange={(e) => setRoomKey(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              placeholder="e.g. our-sweet-room"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Optional External Website User ID / Token */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
              <Key className="w-3.5 h-3.5 text-slate-500" />
              <span>External Website Auth Bridge (Optional)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Existing User ID / Auth ID"
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-[11px] font-mono"
              />
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Auth Token / JWT"
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-[11px] font-mono"
              />
            </div>
          </div>

          {/* 1-Click Invite Link for Partner on Mobile / Laptop */}
          <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-rose-800 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-rose-500" />
                1-Click Invite Link for Your Partner:
              </span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                Pre-configures as {partnerRole.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-rose-700/80">
              Send this link to your partner via WhatsApp, SMS, or Telegram so they can join from their phone or laptop instantly!
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={partnerJoinUrl}
                className="flex-1 px-3 py-1.5 bg-white rounded-xl border border-rose-300 text-[11px] font-mono text-slate-600 truncate"
              />
              <button
                type="button"
                onClick={handleCopyPartnerLink}
                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition flex items-center gap-1 shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-xs rounded-2xl shadow-lg transition cursor-pointer"
          >
            Save & Connect Worldwide 💕
          </button>
        </form>
      </div>
    </div>
  );
};
