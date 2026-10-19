'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  Users,
  Mail,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
  UserPlus,
  Trash2,
} from 'lucide-react';

interface TeammateInput {
  name: string;
  email: string;
}

export default function RegisterPage() {
  const router = useRouter();

  // Step 1: Details, Step 2: OTP Verification
  const [step, setStep] = useState<1 | 2>(1);

  // Form fields
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');

  // Teammates: max 2 additional teammates (Leader + 2 = 3 max)
  const [teammates, setTeammates] = useState<TeammateInput[]>([
    { name: '', email: '' },
  ]);

  // OTP Verification state
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Add teammate slot (up to 2 teammates)
  const handleAddTeammate = () => {
    if (teammates.length < 2) {
      setTeammates([...teammates, { name: '', email: '' }]);
    }
  };

  // Remove teammate slot
  const handleRemoveTeammate = (index: number) => {
    setTeammates(teammates.filter((_, i) => i !== index));
  };

  // Update teammate field
  const handleTeammateChange = (
    index: number,
    field: 'name' | 'email',
    val: string
  ) => {
    const updated = [...teammates];
    updated[index][field] = val;
    setTeammates(updated);
  };

  // Step 1: Submit Details & Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!teamName.trim()) {
      setError('Team name is required.');
      return;
    }
    if (!leaderName.trim() || !leaderEmail.trim()) {
      setError('Leader name and email are required.');
      return;
    }

    // Filter valid teammates
    const validTeammates = teammates.filter(
      (t) => t.name.trim() !== '' && t.email.trim() !== ''
    );

    // Check duplicate emails
    const allEmails = [
      leaderEmail.trim().toLowerCase(),
      ...validTeammates.map((t) => t.email.trim().toLowerCase()),
    ];
    if (new Set(allEmails).size !== allEmails.length) {
      setError('All participant email addresses must be unique.');
      return;
    }

    // Enforce max 3 participants
    if (1 + validTeammates.length > 3) {
      setError('A team can have a maximum of 3 participants.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'registration',
          teamName: teamName.trim(),
          password,
          leaderName: leaderName.trim(),
          email: leaderEmail.trim(),
          members: validTeammates,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      // If dev mode, save the devOtp to show helper box
      if (data.devOtp) {
        setDevOtp(data.devOtp);
      }

      setStep(2);
      startCooldown();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 2: Verify OTP & Activate Team
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: leaderEmail.trim(),
          code: otpCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00ff9d', '#00e5ff', '#a855f7'],
      });

      // Redirect to challenges arena
      setTimeout(() => {
        router.push('/challenges');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-xl">
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Team Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Teams can have a <strong>maximum of 3 participants</strong>. Team leader registers and adds teammate emails. Verification code sent via OTP.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#0b1020] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                step === 1
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <span>1</span> Team Details
            </div>
            <div className="w-8 h-px bg-slate-800" />
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                step === 2
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <span>2</span> Email OTP Verification
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs font-mono flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Registration Form */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              {/* Team Basics */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Team Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Binary Bandits"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Team Access Password <span className="text-slate-500 text-[10px] lowercase">(optional for fast direct login)</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium text-sm transition"
                  />
                </div>
              </div>

              {/* Leader Details */}
              <div className="pt-2 border-t border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded">
                    LEADER
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    Team Leader Info (Receives OTP)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Leader Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      placeholder="e.g. Sarah Connor"
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs font-medium transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Leader Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      placeholder="sarah@example.com"
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs font-medium transition"
                    />
                  </div>
                </div>
              </div>

              {/* Teammates Section (Max 2 additional members) */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-200">
                      Teammates ({1 + teammates.filter((t) => t.name.trim()).length} / 3 Max)
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Add up to 2 other teammates. Leave blank if competing solo or with 2.
                    </p>
                  </div>

                  {teammates.length < 2 && (
                    <button
                      type="button"
                      onClick={handleAddTeammate}
                      className="px-2.5 py-1 text-xs font-mono font-medium text-cyan-400 bg-cyan-950/40 border border-cyan-800/80 rounded-md hover:bg-cyan-900/40 transition flex items-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Add Member
                    </button>
                  )}
                </div>

                {teammates.map((teammate, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 relative space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-cyan-400 font-semibold text-[11px]">
                        Teammate #{idx + 2} (Optional)
                      </span>
                      {teammates.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTeammate(idx)}
                          className="text-slate-500 hover:text-red-400 transition"
                          title="Remove teammate slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={teammate.name}
                          onChange={(e) =>
                            handleTeammateChange(idx, 'name', e.target.value)
                          }
                          placeholder={`Teammate #${idx + 2} Name`}
                          className="w-full px-3 py-1.5 bg-[#080b12] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          value={teammate.email}
                          onChange={(e) =>
                            handleTeammateChange(idx, 'email', e.target.value)
                          }
                          placeholder={`Teammate #${idx + 2} Email`}
                          className="w-full px-3 py-1.5 bg-[#080b12] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm hover:brightness-110 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 font-mono disabled:opacity-50"
              >
                {loading ? (
                  <span>Sending Verification Code...</span>
                ) : (
                  <>
                    <span>Proceed to Email OTP Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP Verification Screen */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* Dev Test Mode OTP Banner */}
              {devOtp && (
                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs font-mono space-y-1">
                  <div className="flex items-center gap-2 font-bold text-cyan-300">
                    <Sparkles className="w-4 h-4" />
                    <span>Instant Local Dev Mode OTP:</span>
                  </div>
                  <p className="text-slate-300">
                    Use code <strong className="text-emerald-400 font-mono text-base tracking-widest">{devOtp}</strong> for immediate verification!
                  </p>
                </div>
              )}

              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-100">
                  Enter 6-Digit Passcode
                </h3>
                <p className="text-xs text-slate-400">
                  A verification code has been dispatched to{' '}
                  <strong className="text-slate-200">{leaderEmail}</strong>
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center tracking-[12px] text-2xl sm:text-3xl font-mono font-black py-3 bg-slate-900 border-2 border-emerald-500/60 rounded-xl text-emerald-400 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-slate-200 transition"
                >
                  &larr; Edit Team Info
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleRequestOtp}
                  className="text-cyan-400 hover:text-cyan-300 disabled:text-slate-600 transition"
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend Code'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm hover:brightness-110 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 font-mono disabled:opacity-50"
              >
                {loading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Complete Verification &amp; Enter</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
            Already have a verified team?{' '}
            <a href="/login" className="text-emerald-400 hover:underline">
              Sign In here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
