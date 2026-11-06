import React from 'react';
import { X, CheckCircle2, Circle, Sparkles, Sun, Moon, Flame, Heart, Coffee, Flower2, Swords, Mail, RefreshCw } from 'lucide-react';
import { DailyTask, CharacterRole } from '../types';

interface DailyTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: DailyTask[];
  onToggleTask: (taskId: string) => void;
  onResetTasks: () => void;
  myRole: CharacterRole;
  boyName: string;
  girlName: string;
  loveMeter: number;
}

export const DailyTasksModal: React.FC<DailyTasksModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onToggleTask,
  onResetTasks,
  myRole,
  boyName,
  girlName,
  loveMeter,
}) => {
  if (!isOpen) return null;

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const getTaskIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sunrise':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-teal-500" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-amber-700" />;
      case 'Flower2':
        return <Flower2 className="w-5 h-5 text-pink-500" />;
      case 'Mail':
        return <Mail className="w-5 h-5 text-indigo-500" />;
      case 'Swords':
        return <Swords className="w-5 h-5 text-violet-500" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      default:
        return <Heart className="w-5 h-5 text-pink-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-rose-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sun className="w-5 h-5 text-yellow-200 animate-spin" style={{ animationDuration: '15s' }} />
            </div>
            <div>
              <h2 className="text-base font-black">Daily Couple Routine & Tasks</h2>
              <p className="text-xs text-rose-100">
                Wakeup early, complete tasks together, and fill your Love Meter!
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

        {/* Progress Overview Bar */}
        <div className="p-4 bg-rose-50 border-b border-rose-100 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
            <span>
              Daily Progress: <span className="text-rose-600 font-black">{completedCount}</span> / {tasks.length} Completed
            </span>
            <span className="text-rose-600 font-black">{progressPercent}%</span>
          </div>

          <div className="w-full h-3 bg-white rounded-full border border-rose-200 overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-600 pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-bold text-blue-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                {boyName} (Boy)
              </span>
              <span className="flex items-center gap-1 font-bold text-pink-700">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" />
                {girlName} (Girl)
              </span>
            </div>
            <button
              onClick={onResetTasks}
              className="text-xs text-slate-500 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer transition"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Daily Routine
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {tasks.map((task) => {
            const isMyDone = myRole === 'boy' ? task.boyDone : task.girlDone;

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  task.completed
                    ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-pink-300 shadow-sm'
                }`}
              >
                {/* Icon & Title */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    {getTaskIcon(task.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-800">{task.title}</span>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
                        +{task.points} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{task.desc}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400 font-medium">Scheduled: {task.time}</span>
                      {task.completed && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Completed at {task.completedAt}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Partner and Self Status Toggles */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Boy Indicator */}
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-blue-700">Boy</span>
                    {task.boyDone ? (
                      <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>

                  {/* Girl Indicator */}
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-pink-700">Girl</span>
                    {task.girlDone ? (
                      <CheckCircle2 className="w-5 h-5 text-pink-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>

                  {/* My Toggle Button */}
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer shadow-sm ${
                      isMyDone
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
                    }`}
                  >
                    {isMyDone ? 'Mark Undone' : 'I Did It! ✨'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-600 font-medium">
            💡 Synchronizes instantly between boy & girl devices worldwide.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
