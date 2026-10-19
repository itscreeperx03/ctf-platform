'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  ShieldCheck,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { CertificateRecord } from '@/types';

export default function VerifyCertificatePage() {
  const params = useParams();
  const certId = params.certId as string;

  const [cert, setCert] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!certId) return;

    fetch(`/api/certificate?id=${certId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.certificate) {
          setCert(data.certificate);
        } else {
          setError(data.error || 'Certificate record not found in directory.');
        }
      })
      .catch((err) => {
        setError('Error contacting verification authority.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [certId]);

  return (
    <div className="flex-1 py-14 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-mono text-sm">
            Verifying cryptographic serial with CTF authority...
          </div>
        ) : error || !cert ? (
          <div className="p-8 rounded-2xl bg-red-950/30 border border-red-500/50 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-red-200">
              Certificate Not Found or Invalid
            </h2>
            <p className="text-xs text-red-300 font-mono">
              The verification ID &ldquo;{certId}&rdquo; was not recognized in the official registry.
            </p>
            <div className="pt-2">
              <a
                href="/certificate"
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-mono hover:bg-slate-700 transition"
              >
                Go to Certificate Portal
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-[#0b1020] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Validation Seal Badge */}
            <div className="text-center space-y-2 border-b border-slate-800 pb-6">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 mb-2 shadow-lg shadow-emerald-500/10">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                OFFICIALLY AUTHENTICATED &bull; VALID
              </div>
              <h1 className="text-2xl font-black text-slate-100 mt-2">
                Certificate of Participation
              </h1>
              <p className="text-xs font-mono text-slate-400">
                Serial ID: <strong className="text-amber-400">{cert.certId}</strong>
              </p>
            </div>

            {/* Credential Attributes */}
            <div className="space-y-4 text-xs font-sans">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-mono block text-[11px]">
                    Recipient
                  </span>
                  <span className="text-base font-bold text-slate-100">
                    {cert.recipientName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 font-mono block text-[11px]">
                    Team Squad
                  </span>
                  <span className="text-sm font-semibold text-emerald-400">
                    {cert.teamName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 font-mono block text-[11px]">
                    Final Rank
                  </span>
                  <span className="text-lg font-mono font-bold text-cyan-300">
                    Rank #{cert.rank}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 font-mono block text-[11px]">
                    Total Score
                  </span>
                  <span className="text-lg font-mono font-bold text-emerald-400">
                    {cert.score} pts
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Issue Date:</span>
                </div>
                <span className="font-mono text-slate-200">{cert.issueDate}</span>
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-slate-500">
              Verified by CSSA &amp; Dept. of Computer Science, PDUAM Amjonga &bull;{' '}
              <a href="/certificate" className="text-emerald-400 hover:underline">
                Generate another certificate
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
