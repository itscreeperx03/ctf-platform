'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  PlusCircle,
  Trash2,
  Edit,
  Terminal,
  Flame,
  Clock,
  Users,
  Shield,
  KeyRound,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Lock,
  Unlock,
} from 'lucide-react';
import { Challenge, ChallengeCategory, Team } from '@/types';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // New challenge form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [wave, setWave] = useState<1 | 2>(1);
  const [category, setCategory] = useState<ChallengeCategory>('Web');
  const [description, setDescription] = useState('');
  const [flag, setFlag] = useState('');
  const [initialPoints, setInitialPoints] = useState(500);
  const [minPoints, setMinPoints] = useState(100);
  const [decayMinutes, setDecayMinutes] = useState(180);
  const [hints, setHints] = useState('');

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin');
      const resData = await res.json();
      if (res.ok) {
        setData(resData);
      }
    } catch (err: any) {
      setError('Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Create Challenge
  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_challenge',
          title,
          wave,
          category,
          description,
          flag,
          initialPoints,
          minPoints,
          decayMinutes,
          hints: hints ? hints.split('\n').filter(Boolean) : [],
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to create challenge');
      }

      setMessage(`Challenge "${title}" added successfully!`);
      setShowAddForm(false);
      // Reset form
      setTitle('');
      setDescription('');
      setFlag('');
      setHints('');
      fetchAdminData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete Challenge
  const handleDeleteChallenge = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_challenge', id }),
      });
      if (res.ok) {
        setMessage(`Challenge "${name}" removed.`);
        fetchAdminData();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Seed sample demo challenges
  const handleSeedSamples = async () => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed_samples' }),
      });
      const resData = await res.json();
      setMessage(resData.message || 'Sample challenges seeded!');
      fetchAdminData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Clear challenges back to empty space
  const handleClearChallenges = async () => {
    if (!confirm('This will wipe all challenges and leave the problem space empty as requested. Proceed?')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_challenges' }),
      });
      const resData = await res.json();
      setMessage(resData.message || 'All challenges cleared.');
      fetchAdminData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Toggle Wave Simulation Mode
  const handleToggleSimulation = async (simMode: boolean, simWave?: 0 | 1 | 2) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_simulation',
          simulationMode: simMode,
          simulatedWave: simWave,
        }),
      });
      const resData = await res.json();
      setMessage(
        simMode
          ? `Simulation Mode Active: Wave ${simWave} is now simulated as active and decaying!`
          : 'Normal Event Timeline Active (Oct 28 10:00 AM & 1:00 PM).'
      );
      fetchAdminData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-12 text-center text-slate-400 font-mono">
        Loading Organizer CMS...
      </div>
    );
  }

  const { settings, challenges, teams, solves, recentOtps, waveStatus } = data || {};

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* CMS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Settings className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              SYSTEM CONTROLLER &bull; ORGANIZER CMS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight mt-1">
            CTF Administration Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage problems, 2-wave deployment schedule, dynamic point decay, and registered squads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            Add Challenge
          </button>
          <button
            onClick={fetchAdminData}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* QUICK TESTING & SIMULATION CONTROLS */}
      <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-cyan-500/30 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                Wave Deployment &amp; Live Time Controls
              </h3>
              <p className="text-[11px] text-slate-400">
                Official Event: <strong>October 28, 2026</strong> &bull; Wave 1: 10:00 AM &bull; Wave 2: 1:00 PM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${
                settings?.simulationMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {settings?.simulationMode ? 'SIMULATION ACTIVE' : 'LIVE CALENDAR MODE'}
            </span>
          </div>
        </div>

        {/* Simulation Buttons */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="text-slate-400 text-[11px]">Instant Testing Actions:</span>

          <button
            onClick={() => handleToggleSimulation(false)}
            className={`px-3 py-1.5 rounded-lg border transition ${
              !settings?.simulationMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Real Calendar (Oct 28)
          </button>

          <button
            onClick={() => handleToggleSimulation(true, 1)}
            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
              settings?.simulationMode && settings?.simulatedWave === 1
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Unlock className="w-3 h-3 text-emerald-400" />
            Simulate Wave 1 Active (10 AM)
          </button>

          <button
            onClick={() => handleToggleSimulation(true, 2)}
            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
              settings?.simulationMode && settings?.simulatedWave === 2
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Unlock className="w-3 h-3 text-cyan-400" />
            Simulate Wave 2 Active (1 PM)
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleSeedSamples}
              className="px-3 py-1.5 rounded-lg bg-purple-950/40 text-purple-300 border border-purple-500/40 hover:bg-purple-900/40 transition"
              title="Populate demo challenges for immediate solve & decay testing"
            >
              Seed Demo Challenges
            </button>

            <button
              onClick={handleClearChallenges}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 text-red-300 border border-red-500/40 hover:bg-red-900/40 transition"
              title="Empty the problem space as requested"
            >
              Clear to Empty Space
            </button>
          </div>
        </div>
      </div>

      {/* CREATE NEW CHALLENGE MODAL / FORM */}
      {showAddForm && (
        <div className="bg-[#0b1020] border-2 border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              Add New Challenge
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-white font-mono text-sm"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateChallenge} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Broken Token Bypass"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Wave Assignment *
                </label>
                <select
                  value={wave}
                  onChange={(e) => setWave(Number(e.target.value) as 1 | 2)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                >
                  <option value={1}>Wave 1 (Starts 10:00 AM)</option>
                  <option value={2}>Wave 2 (Starts 1:00 PM)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ChallengeCategory)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                >
                  <option value="Web">Web</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Forensics">Forensics</option>
                  <option value="Reverse">Reverse</option>
                  <option value="Pwn">Pwn</option>
                  <option value="OSINT">OSINT</option>
                  <option value="Misc">Misc</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Initial Points (Max)
                </label>
                <input
                  type="number"
                  value={initialPoints}
                  onChange={(e) => setInitialPoints(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Minimum Floor Points
                </label>
                <input
                  type="number"
                  value={minPoints}
                  onChange={(e) => setMinPoints(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Decay Minutes
                </label>
                <input
                  type="number"
                  value={decayMinutes}
                  onChange={(e) => setDecayMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Challenge Description / Story *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief the challengers on what needs to be solved..."
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs font-sans focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Secret Flag Token *
                </label>
                <input
                  type="text"
                  required
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  placeholder="CTF{example_flag_here}"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Hints (one per line, optional)
                </label>
                <input
                  type="text"
                  value={hints}
                  onChange={(e) => setHints(e.target.value)}
                  placeholder="Check request headers..."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition shadow-lg shadow-emerald-500/20"
              >
                Save Challenge to Arena
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CHALLENGES LIST */}
      <div className="bg-[#0b1020] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Configured Challenges ({challenges?.length || 0})
          </h3>
          <span className="text-xs font-mono text-slate-500">
            {challenges?.length === 0
              ? 'Problem space is currently empty (awaiting organizer upload)'
              : 'Challenges loaded'}
          </span>
        </div>

        {challenges?.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
            Space is currently empty for problems as requested. Click &ldquo;Add Challenge&rdquo; above when you are ready to input your CTF problems, or click &ldquo;Seed Demo Challenges&rdquo; to test dynamic point decay.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {challenges?.map((ch: Challenge) => (
              <div
                key={ch.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
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
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded">
                      {ch.category}
                    </span>
                    <span className="font-bold text-slate-100 text-sm">
                      {ch.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1 max-w-2xl">
                    {ch.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono text-slate-500">
                    <span>
                      Flag: <code className="text-emerald-400">{ch.flag}</code>
                    </span>
                    <span>&bull;</span>
                    <span>
                      Points: {ch.initialPoints} &rarr; {ch.minPoints}
                    </span>
                    <span>&bull;</span>
                    <span>Solves: {ch.solvesCount || 0}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteChallenge(ch.id, ch.title)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition border border-slate-800"
                    title="Delete Challenge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REGISTERED SQUADS & PARTICIPANTS */}
      <div className="bg-[#0b1020] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            Registered Squads ({teams?.length || 0})
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Max 3 Participants Per Squad
          </span>
        </div>

        {teams?.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            No registered squads yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Team Name</th>
                  <th className="py-2.5 px-3">Leader</th>
                  <th className="py-2.5 px-3">Teammates</th>
                  <th className="py-2.5 px-3 text-center">Score</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {teams?.map((t: Team) => (
                  <tr key={t.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-sans font-bold text-slate-100">
                      {t.name}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <div>{t.leaderName}</div>
                      <div className="text-[10px] text-slate-500">{t.leaderEmail}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {t.members.filter((m) => !m.isLeader).length === 0 ? (
                        <span className="text-slate-600">Solo (1/3)</span>
                      ) : (
                        t.members
                          .filter((m) => !m.isLeader)
                          .map((m, idx) => (
                            <div key={idx} className="text-[11px]">
                              {m.name} ({m.email})
                            </div>
                          ))
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-400">
                      {t.score || 0} pts
                    </td>
                    <td className="py-3 px-3 text-right">
                      {t.verified ? (
                        <span className="text-emerald-400 text-[11px]">
                          &bull; Verified
                        </span>
                      ) : (
                        <span className="text-amber-400 text-[11px]">
                          Pending OTP
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RECENT OTP DISPATCH LOG (Dev & Organizer Inspection) */}
      <div className="bg-[#0b1020] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            Recent OTP Activity Logs
          </h3>
          <span className="text-xs font-mono text-slate-500">
            For development &amp; organizer support
          </span>
        </div>

        {recentOtps?.length === 0 ? (
          <div className="p-6 text-center text-slate-500 font-mono text-xs">
            No OTPs generated yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Passcode</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentOtps?.map((o: any) => (
                  <tr key={o.id}>
                    <td className="py-2.5 px-3 text-slate-300">{o.email}</td>
                    <td className="py-2.5 px-3 text-slate-400 capitalize">{o.type}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-400 tracking-wider">
                      {o.code}
                    </td>
                    <td className="py-2.5 px-3">
                      {o.used ? (
                        <span className="text-slate-500">Used</span>
                      ) : (
                        <span className="text-emerald-400">Active</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500 text-[11px]">
                      {new Date(o.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
