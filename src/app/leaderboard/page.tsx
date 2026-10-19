'use client';

import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Users,
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { LeaderboardEntry } from '@/types';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [recentSolves, setRecentSolves] = useState<any[]>([]);
  const [winnerNotice, setWinnerNotice] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchScoreboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      if (res.ok) {
        setLeaderboard(data.leaderboard || []);
        setRecentSolves(data.recentSolves || []);
        setWinnerNotice(data.winnerNotice || '');
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScoreboard();
    const interval = setInterval(fetchScoreboard, 15000);
    return () => clearInterval(interval);
  }, []);

  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Trophy className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              HALL OF FAME &bull; LIVE SCORING
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight mt-1">
            Official CTF Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time rankings based on dynamically decayed challenge captures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500">
            Updated: {lastRefreshed.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchScoreboard}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
            title="Refresh Leaderboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Official Physical Certificate Winner Policy Notice */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-purple-950/40 border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0 mt-0.5">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-100 text-sm">
              Championship Award Policy (Physical vs. Digital)
            </span>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              <strong>Winners will receive Physical Certificates &amp; Trophies:</strong> The Top 3 ranked teams on this leaderboard receive official physical engraved certificates, custom medals, and awards at the ceremony.
              All other verified teams can generate and export their official <strong>Digital Certificate of Participation</strong> via the{' '}
              <a href="/certificate" className="text-emerald-400 underline font-mono">
                Certificate Generator
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-700/80 flex flex-col justify-between order-2 md:order-1 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1">
                  <Medal className="w-3.5 h-3.5 text-slate-300" />
                  RANK #2 &bull; SILVER
                </span>
                <span className="text-[10px] font-mono text-amber-400">
                  Physical Award
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100 truncate">
                  {top3[1].teamName}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Leader: {top3[1].leaderName} &bull; {top3[1].solvesCount} Solves
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">Score</span>
                <span className="text-xl font-mono font-black text-slate-200">
                  {top3[1].score} pts
                </span>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold) */}
          {top3[0] && (
            <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-950/30 via-slate-900 to-amber-950/20 border-2 border-amber-500/60 shadow-xl shadow-amber-500/10 flex flex-col justify-between order-1 md:order-2 relative overflow-hidden md:-mt-3">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 text-xs font-mono font-black bg-amber-500 text-slate-950 rounded-lg flex items-center gap-1 shadow-md shadow-amber-500/20">
                  <Crown className="w-4 h-4 text-slate-950" />
                  RANK #1 &bull; CHAMPION
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  Trophy + Physical Cert
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-amber-300 truncate">
                  {top3[0].teamName}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Leader: {top3[0].leaderName} &bull; {top3[0].solvesCount} Solves
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-amber-500/30 flex items-center justify-between">
                <span className="text-xs font-mono text-amber-300/80">Total Points</span>
                <span className="text-2xl font-mono font-black text-amber-400">
                  {top3[0].score} pts
                </span>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-amber-800/60 flex flex-col justify-between order-3 md:order-3 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-900/50 text-amber-300 rounded-lg flex items-center gap-1">
                  <Medal className="w-3.5 h-3.5 text-amber-400" />
                  RANK #3 &bull; BRONZE
                </span>
                <span className="text-[10px] font-mono text-amber-400">
                  Physical Award
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100 truncate">
                  {top3[2].teamName}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Leader: {top3[2].leaderName} &bull; {top3[2].solvesCount} Solves
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">Score</span>
                <span className="text-xl font-mono font-black text-amber-300">
                  {top3[2].score} pts
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Leaderboard Table & Recent Solves Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rankings Table (2 cols on large screen) */}
        <div className="lg:col-span-2 bg-[#0b1020] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              All Competing Squads ({leaderboard.length})
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Sorted by Points &bull; Earliest Solve Tiebreak
            </span>
          </div>

          {leaderboard.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              No registered teams yet. Be the first squad to register!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Team</th>
                    <th className="py-3 px-4">Leader</th>
                    <th className="py-3 px-4 text-center">Solves</th>
                    <th className="py-3 px-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {leaderboard.map((team) => (
                    <tr
                      key={team.teamId}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-300">
                        {team.rank === 1 && (
                          <span className="text-amber-400">#1 👑</span>
                        )}
                        {team.rank === 2 && (
                          <span className="text-slate-300">#2 🥈</span>
                        )}
                        {team.rank === 3 && (
                          <span className="text-amber-600">#3 🥉</span>
                        )}
                        {team.rank > 3 && `#${team.rank}`}
                      </td>
                      <td className="py-3.5 px-4 font-sans font-bold text-slate-100">
                        {team.teamName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-sans">
                        {team.leaderName}
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-300">
                        {team.solvesCount}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-400 text-sm">
                        {team.score} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Solves Activity Stream (1 col on large screen) */}
        <div className="bg-[#0b1020] border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-slate-200 text-sm">
              Live Solves Activity Feed
            </h3>
          </div>

          {recentSolves.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              Awaiting first challenge capture...
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[480px]">
              {recentSolves.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs font-mono space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 font-sans truncate">
                      {s.teamName}
                    </span>
                    <span className="text-emerald-400 font-bold shrink-0">
                      +{s.pointsAwarded} pts
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    solved &ldquo;{s.challengeTitle}&rdquo;
                  </div>
                  <div className="text-[10px] text-slate-600">
                    {new Date(s.solvedAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
