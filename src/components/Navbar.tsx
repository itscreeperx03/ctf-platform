'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Terminal,
  Trophy,
  Award,
  BookOpen,
  LogOut,
  Sparkles,
  Settings,
  Flame,
} from 'lucide-react';

interface TeamSession {
  id: string;
  name: string;
  leaderEmail: string;
  score: number;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [team, setTeam] = useState<TeamSession | null>(null);
  const [waveStatus, setWaveStatus] = useState<any>(null);

  const fetchSessionAndStatus = async () => {
    try {
      const [authRes, chalRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/challenges'),
      ]);

      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData.authenticated) {
          setTeam(authData.team);
        } else {
          setTeam(null);
        }
      }

      if (chalRes.ok) {
        const chalData = await chalRes.json();
        setWaveStatus(chalData.waveStatus);
      }
    } catch (err) {
      console.error('Navbar load error:', err);
    }
  };

  useEffect(() => {
    fetchSessionAndStatus();
    const interval = setInterval(fetchSessionAndStatus, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setTeam(null);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { label: 'Challenges', href: '/challenges', icon: Terminal },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { label: 'Rules & Waves', href: '/rules', icon: BookOpen },
    { label: 'Certificate', href: '/certificate', icon: Award },
    { label: 'Organizer CMS', href: '/admin', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#080b12]/90 backdrop-blur-md">
      {/* Wave Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 px-4 py-1.5 text-xs border-b border-emerald-500/20 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-emerald-400 font-semibold tracking-wider">
              {waveStatus?.activeStatusText || 'OCTOBER 28 EVENT SCHEDULE'}
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-cyan-300 hidden sm:inline font-mono">
              CSSA &bull; Dept of CS, PDUAM Amjonga
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-amber-400">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Dynamic Points Decay Active
            </span>
            <span className="hidden md:inline text-purple-400">
              &bull; Top 3 Winners Get Physical Certificates
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <a
            href="/"
            className="flex items-center gap-3 group text-slate-100 hover:text-white transition"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#080b12] rounded-[7px] flex items-center justify-center group-hover:bg-[#0c1220] transition">
                <ShieldAlert className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                  CYBERSTRIKE
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded">
                  CTF &apos;26
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight -mt-0.5">
                CSSA &bull; Dept of CS, PDUAM Amjonga
              </p>
            </div>
          </a>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* User / Auth Status */}
          <div className="flex items-center gap-3">
            {team ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-xs font-semibold text-slate-200">
                      {team.name}
                    </span>
                    <span className="px-1.5 py-0.2 text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                      TEAM
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {team.score || 0} pts
                  </span>
                </div>

                <a
                  href="/challenges"
                  className="px-3 py-1.5 text-xs font-mono font-medium rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition flex items-center gap-1.5"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Arena
                </a>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/login"
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-md transition"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:brightness-110 transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5 font-mono"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Register Team
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
