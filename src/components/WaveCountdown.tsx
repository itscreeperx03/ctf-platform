'use client';

import React, { useEffect, useState } from 'react';
import { Clock, Lock, Unlock, Flame, Calendar, Award, Shield } from 'lucide-react';

interface WaveCountdownProps {
  waveStatus?: any;
}

export default function WaveCountdown({ waveStatus }: WaveCountdownProps) {
  const [timeLeftW1, setTimeLeftW1] = useState<string>('--:--:--');
  const [timeLeftW2, setTimeLeftW2] = useState<string>('--:--:--');
  const [nowDate, setNowDate] = useState<Date>(new Date());

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setNowDate(now);

      // Default event times: Oct 28 10:00 AM & 1:00 PM
      const w1Target = waveStatus?.wave1StartTime
        ? new Date(waveStatus.wave1StartTime)
        : new Date(2026, 9, 28, 10, 0, 0);

      const w2Target = waveStatus?.wave2StartTime
        ? new Date(waveStatus.wave2StartTime)
        : new Date(2026, 9, 28, 13, 0, 0);

      const formatDiff = (target: Date, current: Date) => {
        const diffMs = target.getTime() - current.getTime();
        if (diffMs <= 0) return '00:00:00';
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      };

      setTimeLeftW1(formatDiff(w1Target, now));
      setTimeLeftW2(formatDiff(w2Target, now));
    };

    updateTimes();
    const timer = setInterval(updateTimes, 1000);
    return () => clearInterval(timer);
  }, [waveStatus]);

  const isW1Active = waveStatus?.wave1Unlocked;
  const isW2Active = waveStatus?.wave2Unlocked;

  return (
    <div className="w-full bg-[#0a0f1d] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              OFFICIAL CTF TIMELINE &bull; OCTOBER 28
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-1">
            2-Wave Deployment System
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            System Clock: {nowDate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Waves Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WAVE 1 */}
        <div
          className={`relative p-5 rounded-xl border transition-all ${
            isW1Active
              ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">
                WAVE 01
              </span>
              <span className="text-sm font-semibold text-slate-200">
                10:00 AM Launch
              </span>
            </div>
            {isW1Active ? (
              <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <Unlock className="w-3.5 h-3.5" /> UNLOCKED
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                <Lock className="w-3.5 h-3.5" /> LOCKED
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            First set of challenges: Web Exploitation, Cryptography, and Digital Forensics. Points begin decaying immediately upon release.
          </p>

          <div className="bg-[#080b12] rounded-lg p-3 border border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              {isW1Active ? 'Wave 1 Status:' : 'Wave 1 Unlocks In:'}
            </span>
            <span className="font-mono text-base font-bold text-emerald-400">
              {isW1Active ? 'ACTIVE & DECAYING' : timeLeftW1}
            </span>
          </div>
        </div>

        {/* WAVE 2 */}
        <div
          className={`relative p-5 rounded-xl border transition-all ${
            isW2Active
              ? 'bg-cyan-950/20 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-md">
                WAVE 02
              </span>
              <span className="text-sm font-semibold text-slate-200">
                1:00 PM Launch
              </span>
            </div>
            {isW2Active ? (
              <span className="flex items-center gap-1 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
                <Unlock className="w-3.5 h-3.5" /> UNLOCKED
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
                <Lock className="w-3.5 h-3.5" /> LOCKED UNTIL 1 PM
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Advanced problems drop at 1:00 PM: Reverse Engineering, Binary Exploitation (Pwn), and High-Yield Classified puzzles.
          </p>

          <div className="bg-[#080b12] rounded-lg p-3 border border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              {isW2Active ? 'Wave 2 Status:' : 'Wave 2 Unlocks In:'}
            </span>
            <span className="font-mono text-base font-bold text-cyan-400">
              {isW2Active ? 'ACTIVE & DECAYING' : timeLeftW2}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Decay Explainer Strip */}
      <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-amber-500/5 via-slate-900 to-purple-500/5 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 mt-0.5">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-200">Dynamic Point Decay Rule:</span>
            <p className="text-slate-400 mt-0.5 leading-relaxed">
              Every challenge begins at maximum points (e.g., 500 pts) and slowly decreases with time until all problems are solved or floor is reached. Early solvers lock in maximum bounty!
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 font-mono text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-500/30">
          <span>Decay Rate: ~1 pt / 2 mins</span>
        </div>
      </div>
    </div>
  );
}
