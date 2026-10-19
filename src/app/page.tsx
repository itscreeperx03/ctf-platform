'use client';

import React, { useEffect, useState } from 'react';
import WaveCountdown from '@/components/WaveCountdown';
import {
  ShieldAlert,
  Flame,
  Users,
  Award,
  Terminal,
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const [waveStatus, setWaveStatus] = useState<any>(null);
  const [stats, setStats] = useState({ teamsCount: 0, solvesCount: 0 });

  useEffect(() => {
    fetch('/api/challenges')
      .then((res) => res.json())
      .then((data) => {
        if (data.waveStatus) setWaveStatus(data.waveStatus);
      })
      .catch(console.error);

    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) {
          // stats fetched
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden pt-10 pb-20 border-b border-slate-800/80">
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* College & Organizer Banner */}
            <div className="mb-4 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-200 shadow-lg shadow-cyan-500/5">
              <span className="font-bold text-emerald-400">PDUAM AMJONGA</span>
              <span className="text-slate-500">&bull;</span>
              <span>Dept. of Computer Science</span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-amber-400 font-semibold">Organised by CSSA</span>
            </div>

            {/* Event Date Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>OCTOBER 28, 2026 &bull; WAVE 1 @ 10:00 AM &bull; WAVE 2 @ 1:00 PM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
              CYBERSTRIKE{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                CTF 2026
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-cyan-300 font-mono">
              Organised by Computer Science Students Association (CSSA), Dept. of CS, Pandit Deendayal Upadhyaya Adarsha Mahavidyalaya (PDUAM), Amjonga
            </p>

            <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
              The premier dynamic-decay cybersecurity combat platform. Deploy in <strong>2 strategic waves</strong>, solve rapidly before point values deplete, and compete for digital &amp; physical awards.
            </p>

            {/* Quick Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/register"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm hover:brightness-110 transition shadow-xl shadow-emerald-500/20 flex items-center gap-2 font-mono group"
              >
                <span>Register Team (Max 3)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="/challenges"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition flex items-center gap-2 font-mono"
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Enter Arena</span>
              </a>

              <a
                href="/certificate"
                className="px-5 py-3.5 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 text-purple-300 border border-purple-500/30 font-medium text-sm transition flex items-center gap-2 font-mono"
              >
                <Award className="w-4 h-4 text-purple-400" />
                <span>Certificate Generator</span>
              </a>
            </div>

            {/* Highlight Badges Bar */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">
              <div className="bg-[#0b1020] border border-slate-800 p-3.5 rounded-xl text-left">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  Wave 1
                </div>
                <div className="text-base font-bold text-slate-100 mt-1">10:00 AM</div>
                <div className="text-[11px] text-slate-400">Launch Oct 28</div>
              </div>

              <div className="bg-[#0b1020] border border-slate-800 p-3.5 rounded-xl text-left">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-mono">
                  <Lock className="w-3.5 h-3.5" />
                  Wave 2
                </div>
                <div className="text-base font-bold text-slate-100 mt-1">1:00 PM</div>
                <div className="text-[11px] text-slate-400">Classified Drop</div>
              </div>

              <div className="bg-[#0b1020] border border-slate-800 p-3.5 rounded-xl text-left">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono">
                  <Flame className="w-3.5 h-3.5" />
                  Point Decay
                </div>
                <div className="text-base font-bold text-slate-100 mt-1">Dynamic</div>
                <div className="text-[11px] text-slate-400">Decreases over time</div>
              </div>

              <div className="bg-[#0b1020] border border-slate-800 p-3.5 rounded-xl text-left">
                <div className="flex items-center gap-1.5 text-purple-400 text-xs font-mono">
                  <Users className="w-3.5 h-3.5" />
                  Team Size
                </div>
                <div className="text-base font-bold text-slate-100 mt-1">Max 3</div>
                <div className="text-[11px] text-slate-400">Email &amp; OTP Auth</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Countdown Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-20">
        <WaveCountdown waveStatus={waveStatus} />
      </section>

      {/* Feature Deep-Dive Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Engineered for High-Stakes Cyber Combat
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Comprehensive platform built to test reconnaissance, binary exploitation, cryptography, and defense evasion under temporal pressure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Dynamic Decay */}
          <div className="p-6 rounded-2xl bg-[#0b1122] border border-slate-800 hover:border-emerald-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">
              Dynamic Point Decay System
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every challenge unlocks at its initial bounty (e.g. 500 pts) and continuously decays with time until all problems are solved or floor is hit. Fast teams capture maximum bounty.
            </p>
          </div>

          {/* Feature 2: Email & OTP Team Auth */}
          <div className="p-6 rounded-2xl bg-[#0b1122] border border-slate-800 hover:border-cyan-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">
              Max 3-Member Teams (Email + OTP)
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              The team leader registers the squad, enters up to 2 teammate emails, and authenticates securely via one-time passcodes with instant validation.
            </p>
          </div>

          {/* Feature 3: Digital & Physical Certificates */}
          <div className="p-6 rounded-2xl bg-[#0b1122] border border-slate-800 hover:border-purple-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">
              Digital &amp; Physical Certificate Pipeline
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              All participants generate official 1080p Digital Certificates with QR code verification and rank breakdown. The Top 3 winner teams receive framed physical certificates &amp; trophies!
            </p>
          </div>
        </div>
      </section>

      {/* Two Waves Schedule Breakdown */}
      <section className="w-full bg-[#060912] border-t border-slate-800/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                TACTICAL TIMELINE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mt-2">
                2-Wave Challenge Drop Schedule
              </h2>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                Problems are revealed across 2 waves to keep the competition intense and dynamic. Wave 1 challenges start decaying at 10:00 AM, and Wave 2 brings classified puzzles at 1:00 PM.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>10:00 AM (Oct 28):</strong> Wave 1 unlock &mdash; Web, Crypto, Forensics</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span><strong>1:00 PM (Oct 28):</strong> Wave 2 unlock &mdash; Reverse Engineering, Pwn, Advanced</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span><strong>6:00 PM (Oct 28):</strong> Final Flag Freeze &amp; Digital Certificate Generation</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-4">
              <a
                href="/register"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 text-slate-950 font-bold text-sm hover:brightness-110 transition shadow-2xl shadow-cyan-500/20 text-center font-mono"
              >
                Register Your Team Today
              </a>
              <span className="text-center text-xs text-slate-500 font-mono">
                No fee required &bull; Maximum 3 members per squad
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
