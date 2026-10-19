import React from 'react';
import {
  BookOpen,
  Clock,
  Flame,
  Users,
  Award,
  ShieldAlert,
} from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <BookOpen className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            COMPETITION DIRECTIVES &bull; OFFICIAL CODEX
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight mt-1">
          Rules, Waves &amp; Scoring System
        </h1>
        <p className="text-xs sm:text-sm text-cyan-300 font-mono mt-1">
          Organised by Computer Science Students Association (CSSA), Dept. of CS, PDUAM Amjonga
        </p>
      </div>

      {/* Grid of Rule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: 2-Wave Deployment */}
        <div className="p-6 rounded-2xl bg-[#0b1020] border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                2-Wave Challenge Deployment
              </h3>
              <span className="text-xs font-mono text-cyan-400">
                October 28, 2026
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              Challenges are not released all at once. They are deployed across two designated tactical waves:
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold">&bull; Wave 1: 10:00 AM</span>
                <span className="text-slate-400">Web, Crypto, Forensics</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">&bull; Wave 2: 1:00 PM</span>
                <span className="text-slate-400">Reverse, Pwn, Advanced</span>
              </div>
            </div>
            <p className="text-slate-400">
              Wave 2 challenges remain strictly locked until 1:00 PM, creating a mid-event tactical shift!
            </p>
          </div>
        </div>

        {/* Card 2: Dynamic Point Decay */}
        <div className="p-6 rounded-2xl bg-[#0b1020] border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Dynamic Point Decay
              </h3>
              <span className="text-xs font-mono text-amber-400">
                Points slowly decrease with time
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              Each problem begins with a maximum bounty (e.g., 500 points). As time elapses from wave launch:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>Points decay gradually at a linear rate towards minimum floor points (100 pts).</li>
              <li>When a team solves a problem, they lock in the exact points available at that second!</li>
              <li>Early solvers capture maximum points, incentivizing rapid reconnaissance and quick execution.</li>
            </ul>
          </div>
        </div>

        {/* Card 3: Team Limit & OTP Registration */}
        <div className="p-6 rounded-2xl bg-[#0b1020] border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Squad Regulations (Max 3)
              </h3>
              <span className="text-xs font-mono text-purple-400">
                Email + OTP Auth
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              Squads are strictly limited to a <strong>maximum of 3 participants</strong> (1 Leader + up to 2 teammates):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>The squad leader registers the team and inputs teammate email addresses.</li>
              <li>Authentication is secured using a 6-digit OTP code sent to the leader’s email.</li>
              <li>A participant cannot be registered across multiple squads.</li>
            </ul>
          </div>
        </div>

        {/* Card 4: Digital vs Physical Certificates */}
        <div className="p-6 rounded-2xl bg-[#0b1020] border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Certificate Distribution Policy
              </h3>
              <span className="text-xs font-mono text-emerald-400">
                Physical for Winners, Digital for All
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200">
              <strong>🏆 Winners (Rank 1, 2, 3):</strong> Awarded official framed physical certificates, medals, and trophies at the award ceremony.
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
              <strong>🎖️ All Qualified Participants:</strong> Can generate and download a verifiable, high-res 1080p Digital Certificate with unique serial ID and cryptographic verification.
            </div>
          </div>
        </div>
      </div>

      {/* Fair Play & Flag Syntax Section */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          Code of Conduct &amp; Prohibitions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Flag Syntax</h4>
            <p className="text-slate-400">
              Unless explicitly specified otherwise in a challenge briefing, all flags follow the standard format:
            </p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-emerald-400 text-xs">
              CTF&#123;sample_flag_token_here&#125;
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-red-400">Strictly Prohibited</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Attacking or brute-forcing the CTF scoring infrastructure.</li>
              <li>Sharing solutions or flags between competing teams.</li>
              <li>Denial of Service (DoS) attacks on challenge servers.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
