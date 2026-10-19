'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogIn,
  Mail,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'otp' | 'password'>('otp');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Request login OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please provide your registered team email.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'login',
          email: email.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send login code');
      }

      if (data.devOtp) setDevOtp(data.devOtp);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify login OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError('Enter valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          code: otpCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      router.push('/challenges');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/challenges');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Team Authentication
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access your team arena profile, flags, and certificates.
          </p>
        </div>

        <div className="bg-[#0b1020] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Method Selector */}
          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setMethod('otp');
                setError('');
              }}
              className={`flex-1 py-1.5 text-xs font-mono font-medium rounded-md transition ${
                method === 'otp'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Email OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setMethod('password');
                setError('');
              }}
              className={`flex-1 py-1.5 text-xs font-mono font-medium rounded-md transition ${
                method === 'password'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Team Password
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* METHOD 1: EMAIL OTP */}
          {method === 'otp' && (
            <>
              {!otpSent ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                      Registered Leader / Member Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="leader@team.com"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm hover:brightness-110 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 font-mono"
                  >
                    {loading ? 'Sending OTP...' : 'Send Login OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  {devOtp && (
                    <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs font-mono">
                      <span>Dev Mode Login Code: </span>
                      <strong className="text-emerald-400 text-sm">{devOtp}</strong>
                    </div>
                  )}

                  <div className="text-center text-xs text-slate-400">
                    Enter the 6-digit passcode sent to <strong>{email}</strong>
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
                      className="w-full text-center tracking-[10px] text-2xl font-mono font-bold py-2.5 bg-slate-900 border-2 border-emerald-500/60 rounded-xl text-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      &larr; Change Email
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm hover:brightness-110 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 font-mono"
                  >
                    {loading ? 'Verifying...' : 'Sign In'}
                  </button>
                </form>
              )}
            </>
          )}

          {/* METHOD 2: PASSWORD */}
          {method === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                  Registered Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="leader@team.com"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                  Team Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 font-bold text-sm hover:brightness-110 transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 font-mono"
              >
                {loading ? 'Signing in...' : 'Sign In With Password'}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
            Need to register a new team?{' '}
            <a href="/register" className="text-emerald-400 hover:underline">
              Register here (Max 3 members)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
