import React from 'react';
import CertificateGenerator from '@/components/CertificateGenerator';
import { Award, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function CertificatePage() {
  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Award className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            CREDENTIAL VERIFICATION &bull; OFFICIAL CERTIFICATION
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight mt-1">
          Digital Certificate Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Generate official high-resolution, cryptographically verifiable certificates of participation and technical merit for your team members.
        </p>
      </div>

      {/* Generator Component */}
      <CertificateGenerator />
    </div>
  );
}
