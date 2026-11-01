import React, { useState } from 'react';
import { CheckSquare, Square, Check, Copy, Download, ShieldCheck, ExternalLink, AlertCircle } from 'lucide-react';
import { VerificationTask } from '../types/gaplens';

interface VerificationChecklistProps {
  tasks: VerificationTask[];
  onToggleTask: (taskId: string) => void;
}

export const VerificationChecklist: React.FC<VerificationChecklistProps> = ({
  tasks,
  onToggleTask,
}) => {
  const [copied, setCopied] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const criticalPending = tasks.filter((t) => t.priority === 'critical' && !t.completed).length;

  const handleCopyMarkdown = () => {
    const md = [
      '# GAPLENS Pre-Decision Verification Checklist',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      ...tasks.map(
        (t) =>
          `- [${t.completed ? 'x' : ' '}] **[${t.priority.toUpperCase()}]** ${t.title}\n  - Detail: ${t.description}\n  - Official Reference: ${t.targetOfficialSource}`
      ),
    ].join('\n');

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-rose-400 bg-rose-950/40 border-rose-800/40';
      case 'high':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
      default:
        return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Prioritized Action Verification Checklist
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Concrete verification directives targeting verified official authorities before you commit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Risk Status */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Completion</span>
            <span className="font-bold font-mono text-cyan-400 text-sm">
              {completedCount} of {tasks.length} Resolved
            </span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Critical Pending</span>
            <span className={`font-bold font-mono text-sm ${criticalPending > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {criticalPending} High-Risk Tasks
            </span>
          </div>
        </div>

        <div className="w-full sm:w-48 bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
            style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task, idx) => {
          return (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                task.completed
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
              >
                {task.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500" />
                )}
              </button>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <span
                    className={`text-xs md:text-sm font-semibold ${
                      task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}
                  >
                    #{idx + 1} · {task.title}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border self-start sm:self-auto ${getPriorityStyle(
                      task.priority
                    )}`}
                  >
                    {task.priority} Priority
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {task.description}
                </p>

                <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span className="text-slate-400">Direct Authority:</span>
                  <span className="text-cyan-300/90 truncate">{task.targetOfficialSource}</span>
                </div>
              </div>
            </div>
          );
        })}

        {tasks.length === 0 && (
          <div className="text-center py-8 bg-slate-900/30 border border-slate-800 rounded-xl text-slate-400 text-xs">
            No verification tasks generated.
          </div>
        )}
      </div>
    </div>
  );
};
