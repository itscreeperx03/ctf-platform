'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Terminal,
  Lock,
  Unlock,
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ExternalLink,
  Shield,
  Send,
  PlusCircle,
} from 'lucide-react';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [waveStatus, setWaveStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeWaveTab, setActiveWaveTab] = useState<'all' | 1 | 2>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalChallenge, setActiveModalChallenge] = useState<any | null>(null);

  // Flag submission state
  const [flagInput, setFlagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const fetchChallenges = async () => {
    try {
      const res = await fetch('/api/challenges');
      const data = await res.json();
      if (res.ok) {
        setChallenges(data.challenges || []);
        setWaveStatus(data.waveStatus);
      }
    } catch (err) {
      console.error('Failed to load challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
    // Poll every 10 seconds to update dynamic decaying points and solve counts
    const interval = setInterval(fetchChallenges, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenModal = (ch: any) => {
    setActiveModalChallenge(ch);
    setFlagInput('');
    setSubmitResult(null);
  };

  const handleCloseModal = () => {
    setActiveModalChallenge(null);
    setFlagInput('');
    setSubmitResult(null);
  };

  const handleSubmitFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagInput.trim() || !activeModalChallenge) return;

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch('/api/submit-flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: activeModalChallenge.id,
          flag: flagInput.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitResult({
          success: false,
          message: data.error || 'Incorrect flag! Try again.',
        });
      } else {
        setSubmitResult({
          success: true,
          message: data.message,
        });

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00ff9d', '#00e5ff', '#a855f7'],
        });

        // Refresh challenges to update points and solved badge
        fetchChallenges();
      }
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: err.message || 'Error submitting flag',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['All', 'Web', 'Crypto', 'Forensics', 'Reverse', 'Pwn', 'OSINT'];

  // Filtered challenges
  const filtered = challenges.filter((ch) => {
    const waveMatch =
      activeWaveTab === 'all' ? true : ch.wave === activeWaveTab;
    const catMatch =
      selectedCategory === 'All' ? true : ch.category === selectedCategory;
    return waveMatch && catMatch;
  });

  const wave1Count = challenges.filter((c) => c.wave === 1).length;
  const wave2Count = challenges.filter((c) => c.wave === 2).length;

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Wave Header Banner */}
      <div className="bg-[#0a0f1d] border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Terminal className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                COMBAT ARENA &bull; 2-WAVE DEPLOYMENT
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight mt-1">
              Active Challenge Grid
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Wave 1 drops on <strong>Oct 28 at 10:00 AM</strong>. Wave 2 unlocks at <strong>1:00 PM</strong>. Points slowly decrease continuously over time until solved.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/admin"
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              Organizer CMS (Add Problems)
            </a>
          </div>
        </div>

        {/* Wave Tab Switcher */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveWaveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                activeWaveTab === 'all'
                  ? 'bg-slate-800 text-slate-100 border border-slate-600'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Problems ({challenges.length})
            </button>

            <button
              onClick={() => setActiveWaveTab(1)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                activeWaveTab === 1
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Wave 1 (10:00 AM) [{wave1Count}]
            </button>

            <button
              onClick={() => setActiveWaveTab(2)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                activeWaveTab === 2
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Wave 2 (1:00 PM) [{wave2Count}]
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Decay Explainer Notice */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-cyan-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Dynamic Decay Engine:</strong> Challenge point values start at maximum and decay gradually with time. When your team solves a problem, your points are permanently locked at that moment!
          </span>
        </div>
      </div>

      {/* EMPTY STATE (Keeping space empty for problems as requested by user) */}
      {challenges.length === 0 ? (
        <div className="space-y-6">
          {/* Wave 1 Empty Grid Placeholders */}
          <div className="p-8 rounded-2xl bg-[#0b1020] border-2 border-dashed border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Terminal className="w-7 h-7" />
            </div>

            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-100">
                Challenge Slots Ready &amp; Reserved
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                As configured, the problem space is currently empty. You can provide and upload problems anytime using the Organizer CMS.
              </p>
            </div>

            {/* Placeholder visual cards for Wave 1 & Wave 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left max-w-4xl mx-auto">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  WAVE 1 SLOT
                </span>
                <div className="text-sm font-semibold text-slate-300 mt-2">
                  [Web Exploitation]
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Space reserved for Wave 1 (10:00 AM)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  WAVE 1 SLOT
                </span>
                <div className="text-sm font-semibold text-slate-300 mt-2">
                  [Cryptography &amp; Ciphers]
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Space reserved for Wave 1 (10:00 AM)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                  WAVE 2 SLOT
                </span>
                <div className="text-sm font-semibold text-slate-300 mt-2">
                  [Reverse &amp; Binary Pwn]
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Space reserved for Wave 2 (1:00 PM)
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/admin"
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs hover:brightness-110 transition shadow-lg shadow-emerald-500/20 font-mono"
              >
                + Add Problems via Organizer CMS
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* POPULATED CHALLENGES GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((ch) => {
            return (
              <div
                key={ch.id}
                onClick={() => handleOpenModal(ch)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  ch.isSolved
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                    : ch.isUnlocked
                    ? 'bg-[#0b1020] border-slate-800 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/5'
                    : 'bg-slate-950/80 border-slate-900 opacity-75'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                          ch.wave === 1
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        WAVE {ch.wave}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300">
                        {ch.category}
                      </span>
                    </div>

                    {ch.isSolved ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> SOLVED
                      </span>
                    ) : ch.isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800">
                        <Unlock className="w-3 h-3" /> ACTIVE
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        <Lock className="w-3 h-3" /> LOCKED (1 PM)
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {ch.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {ch.description}
                  </p>
                </div>

                {/* Bottom Points & Decay Meter */}
                <div className="mt-5 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">
                        Live Bounty Value
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-lg font-bold text-amber-400 animate-decay">
                          {ch.isSolved ? ch.pointsAwarded : ch.currentPoints} pts
                        </span>
                        {ch.decayPercent > 0 && !ch.isSolved && (
                          <span className="text-[10px] font-mono text-red-400">
                            (-{ch.decayPercent}%)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">
                        Solves
                      </span>
                      <span className="font-mono text-xs text-slate-300">
                        {ch.solvesCount} solves
                      </span>
                    </div>
                  </div>

                  {/* Decay Bar */}
                  {ch.isUnlocked && !ch.isSolved && (
                    <div className="mt-2 w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-500"
                        style={{
                          width: `${Math.max(10, 100 - ch.decayPercent)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CHALLENGE MODAL */}
      {activeModalChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#0b1020] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                    WAVE {activeModalChallenge.wave}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded">
                    {activeModalChallenge.category}
                  </span>
                  {activeModalChallenge.isSolved && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Solved ({activeModalChallenge.pointsAwarded} pts)
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                  {activeModalChallenge.title}
                </h2>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-lg font-mono"
              >
                &times;
              </button>
            </div>

            {/* Points & Solves Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 mb-6 font-mono text-xs">
              <div>
                <span className="text-slate-500 block">Initial Points:</span>
                <span className="text-slate-200 font-bold">
                  {activeModalChallenge.initialPoints} pts
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Current Value:</span>
                <span className="text-amber-400 font-bold">
                  {activeModalChallenge.isSolved
                    ? activeModalChallenge.pointsAwarded
                    : activeModalChallenge.currentPoints}{' '}
                  pts
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Floor Points:</span>
                <span className="text-slate-400">
                  {activeModalChallenge.minPoints} pts
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-mono uppercase text-slate-400">
                Mission Briefing
              </h4>
              <div className="p-4 rounded-xl bg-[#080b12] border border-slate-800/80 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                {activeModalChallenge.description}
              </div>
            </div>

            {/* Hints (if any) */}
            {activeModalChallenge.hints &&
              activeModalChallenge.hints.length > 0 && (
                <div className="mb-6 space-y-2">
                  <h4 className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    Available Intel / Hints
                  </h4>
                  <div className="space-y-2">
                    {activeModalChallenge.hints.map((hint: string, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200 font-mono"
                      >
                        &bull; {hint}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Flag Submission Form */}
            {!activeModalChallenge.isSolved ? (
              <form onSubmit={handleSubmitFlag} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                    Submit Flag Token
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={flagInput}
                      onChange={(e) => setFlagInput(e.target.value)}
                      placeholder="CTF{secret_flag_here}"
                      className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono text-sm"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs hover:brightness-110 transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 font-mono disabled:opacity-50"
                    >
                      {submitting ? 'Checking...' : 'Submit Flag'}
                    </button>
                  </div>
                </div>

                {submitResult && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
                      submitResult.success
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-red-950/40 border-red-500/50 text-red-300'
                    }`}
                  >
                    {submitResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <span>{submitResult.message}</span>
                  </div>
                )}
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Challenge Solved! Points captured into your team score.</span>
                </div>
                <span className="font-bold text-sm">{activeModalChallenge.pointsAwarded} pts</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
