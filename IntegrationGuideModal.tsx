import React, { useState } from 'react';
import { X, Code2, Copy, Check, ExternalLink, Globe, ShieldCheck, Sparkles } from 'lucide-react';

interface IntegrationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomKey: string;
}

export const IntegrationGuideModal: React.FC<IntegrationGuideModalProps> = ({
  isOpen,
  onClose,
  roomKey,
}) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const host = window.location.origin;

  if (!isOpen) return null;

  const copyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(key);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  const iframeSnippet = `<!-- 1. Embed HeartSync directly in any page of your existing website -->
<iframe 
  src="${host}?embed=true&room=COUPLE_PAIR_KEY&username=USER_NAME&role=boy"
  width="100%" 
  height="720" 
  frameborder="0" 
  allow="autoplay; sound"
  style="border-radius: 20px; box-shadow: 0 12px 35px rgba(0,0,0,0.12); border: none;"
></iframe>`;

  const postMessageSnippet = `// 2. Seamless Single-Sign-On (SSO) with your existing user session
// Run this on your parent website when the user logs in:
const heartSyncFrame = document.querySelector('#heartSyncIframe');

heartSyncFrame.addEventListener('load', () => {
  heartSyncFrame.contentWindow.postMessage({
    type: 'HEARTSYNC_AUTH',
    payload: {
      userId: currentUser.id,               // Your existing database user ID
      username: currentUser.displayName,    // e.g. "Alex" or "Emily"
      role: currentUser.gender === 'male' ? 'boy' : 'girl',
      roomKey: currentUser.coupleRoomId || 'couple-room-1',
      token: currentUser.sessionToken       // Optional auth token
    }
  }, '*');
});`;

  const urlParamSnippet = `<!-- 3. Direct Full-Screen Link or Redirection -->
<a href="${host}?userId=\${user.id}&username=\${encodeURIComponent(user.name)}&role=\${user.role}&room=\${user.coupleRoomKey}" target="_blank">
  Launch Couple Game
</a>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/30 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h2 className="text-base font-black">Website Integration & Auth Bridge</h2>
              <p className="text-[11px] text-slate-300">
                Easily embed into your existing website and sync your user credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Instructions Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Overview */}
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <span className="font-bold">Zero-Friction Authentication:</span> This game supports URL
              parameters, <code className="bg-emerald-200/60 px-1 py-0.5 rounded font-mono">postMessage</code>, and
              REST tokens. Your existing platform users do not need to register again—they jump straight
              into the daily routine and chibi arena from phone, tablet, or PC!
            </div>
          </div>

          {/* Method 1: Iframe */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-500" />
                Method 1: Embed as Responsive iFrame
              </span>
              <button
                onClick={() => copyCode('iframe', iframeSnippet)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                {copiedTab === 'iframe' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedTab === 'iframe' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl text-[11px] font-mono overflow-x-auto">
              {iframeSnippet}
            </pre>
          </div>

          {/* Method 2: PostMessage SSO */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-purple-500" />
                Method 2: JavaScript postMessage SSO (Seamless User Credentials Sync)
              </span>
              <button
                onClick={() => copyCode('postMessage', postMessageSnippet)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                {copiedTab === 'postMessage' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedTab === 'postMessage' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl text-[11px] font-mono overflow-x-auto">
              {postMessageSnippet}
            </pre>
          </div>

          {/* Method 3: Direct Link */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-rose-500" />
                Method 3: Direct URL with Query Parameters
              </span>
              <button
                onClick={() => copyCode('url', urlParamSnippet)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                {copiedTab === 'url' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedTab === 'url' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl text-[11px] font-mono overflow-x-auto">
              {urlParamSnippet}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
