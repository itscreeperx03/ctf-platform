'use client';

import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import {
  Award,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  User,
  Users,
  Sparkles,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { CertificateRecord, Participant } from '@/types';

interface CertificateGeneratorProps {
  initialTeam?: any;
}

export default function CertificateGenerator({ initialTeam }: CertificateGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [recipientName, setRecipientName] = useState<string>('');
  const [selectedMemberEmail, setSelectedMemberEmail] = useState<string>('');
  const [team, setTeam] = useState<any>(initialTeam || null);
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!initialTeam) {
      // Fetch session if not provided
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            setTeam(data.team);
            setRecipientName(data.team.leaderName);
            setSelectedMemberEmail(data.team.leaderEmail);
          }
        })
        .catch(console.error);
    } else {
      setRecipientName(initialTeam.leaderName);
      setSelectedMemberEmail(initialTeam.leaderEmail);
    }
  }, [initialTeam]);

  // Generate certificate record on server
  const handleGenerateCertificate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!recipientName.trim()) {
      setError('Please provide a participant name.');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: team?.id,
          recipientName: recipientName.trim(),
          recipientEmail: selectedMemberEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate certificate');
      }

      setCertificate(data.certificate);

      // Trigger victory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ff9d', '#00e5ff', '#a855f7', '#fbbf24'],
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  // Draw certificate on HTML5 Canvas with ultra high resolution (1920x1080)
  useEffect(() => {
    if (!certificate || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1920;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. Background - Deep obsidian & cyber gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#05070d');
    bgGrad.addColorStop(0.5, '#0b1120');
    bgGrad.addColorStop(1, '#05070d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Guilloche Cyber Border
    // Outer border
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, width - 120, height - 120);

    // Inner thin border
    ctx.strokeStyle = '#00ff9d';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(75, 75, width - 150, height - 150);

    // Corner cyber brackets
    const drawBracket = (x: number, y: number, dirX: number, dirY: number) => {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x, y + dirY * 40);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dirX * 40, y);
      ctx.stroke();
    };

    drawBracket(95, 95, 1, 1);
    drawBracket(width - 95, 95, -1, 1);
    drawBracket(95, height - 95, 1, -1);
    drawBracket(width - 95, height - 95, -1, -1);

    // 3. Header & Institutional Authority
    ctx.textAlign = 'center';

    // College Name
    ctx.font = 'bold 22px monospace';
    ctx.fillStyle = '#00ff9d';
    ctx.letterSpacing = '5px';
    ctx.fillText('PANDIT DEENDAYAL UPADHYAYA ADARSHA MAHAVIDYALAYA (PDUAM), AMJONGA', width / 2, 145);

    // Department & Association Name
    ctx.font = '600 18px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.letterSpacing = '3px';
    ctx.fillText('DEPARTMENT OF COMPUTER SCIENCE & COMPUTER SCIENCE STUDENTS ASSOCIATION (CSSA)', width / 2, 180);

    // Event Title
    ctx.font = '900 58px sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.letterSpacing = '4px';
    ctx.fillText('CYBERSTRIKE CTF 2026', width / 2, 255);

    // Subtitle
    ctx.font = '600 22px sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.letterSpacing = '6px';
    ctx.fillText('OFFICIAL CERTIFICATE OF PARTICIPATION', width / 2, 305);

    // Horizontal Accent Line with Diamond
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 400, 335);
    ctx.lineTo(width / 2 + 400, 335);
    ctx.stroke();

    ctx.fillStyle = '#00ff9d';
    ctx.beginPath();
    ctx.arc(width / 2, 335, 5, 0, Math.PI * 2);
    ctx.fill();

    // 4. Body Content
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.letterSpacing = '2px';
    ctx.fillText('THIS IS TO OFFICIALLY CERTIFY THAT', width / 2, 400);

    // Recipient Name
    ctx.font = 'bold 54px serif';
    ctx.fillStyle = '#34d399';
    ctx.letterSpacing = '2px';
    ctx.fillText(certificate.recipientName, width / 2, 475);

    // Team and Participation text
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.letterSpacing = '1px';
    ctx.fillText(
      `representing Team "${certificate.teamName}"`,
      width / 2,
      535
    );

    ctx.font = '19px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(
      'has actively participated and demonstrated exceptional cybersecurity & problem-solving skills',
      width / 2,
      585
    );
    ctx.fillText(
      'in the 2-Wave Dynamic Decay CTF organised by CSSA, Dept. of Computer Science, PDUAM Amjonga on October 28, 2026.',
      width / 2,
      620
    );

    // 5. Performance Badges (Rank & Score)
    const boxWidth = 320;
    const boxHeight = 85;
    const boxY = 680;

    // Rank Box
    const rankX = width / 2 - boxWidth - 30;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.fillRect(rankX, boxY, boxWidth, boxHeight);
    ctx.strokeRect(rankX, boxY, boxWidth, boxHeight);

    ctx.font = '13px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('FINAL OFFICIAL RANK', rankX + boxWidth / 2, boxY + 28);
    ctx.font = 'bold 30px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`RANK #${certificate.rank}`, rankX + boxWidth / 2, boxY + 66);

    // Score Box
    const scoreX = width / 2 + 30;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#00ff9d';
    ctx.lineWidth = 1.5;
    ctx.fillRect(scoreX, boxY, boxWidth, boxHeight);
    ctx.strokeRect(scoreX, boxY, boxWidth, boxHeight);

    ctx.font = '13px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('TOTAL SCORE EARNED', scoreX + boxWidth / 2, boxY + 28);
    ctx.font = 'bold 30px monospace';
    ctx.fillStyle = '#00ff9d';
    ctx.fillText(`${certificate.score} PTS`, scoreX + boxWidth / 2, boxY + 66);

    // 6. Footer (Signatures, Issue Date, QR / Cert ID)
    const footerY = 890;

    // Left Signature: Head / Faculty In-Charge, Dept of CS
    ctx.textAlign = 'center';
    ctx.font = 'italic 26px serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('Faculty Coordinator', 320, footerY);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(170, footerY + 12);
    ctx.lineTo(470, footerY + 12);
    ctx.stroke();

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Head / Faculty In-Charge, Dept. of Computer Science', 320, footerY + 35);
    ctx.fillText('PDUAM, Amjonga', 320, footerY + 55);

    // Right Signature: CSSA President
    ctx.font = 'italic 26px serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('President / General Secretary', width - 320, footerY);

    ctx.beginPath();
    ctx.moveTo(width - 470, footerY + 12);
    ctx.lineTo(width - 170, footerY + 12);
    ctx.stroke();

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Computer Science Students Association (CSSA)', width - 320, footerY + 35);
    ctx.fillText('PDUAM, Amjonga', width - 320, footerY + 55);

    // Center Official Holographic Shield & ID
    ctx.textAlign = 'center';
    ctx.font = '13px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`DATE OF ISSUANCE: ${certificate.issueDate.toUpperCase()}`, width / 2, footerY + 10);

    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`VERIFICATION ID: ${certificate.certId}`, width / 2, footerY + 38);

    ctx.font = '12px monospace';
    ctx.fillStyle = '#00ff9d';
    ctx.fillText('VERIFIED BY CSSA & DEPT OF CS &bull; PDUAM AMJONGA', width / 2, footerY + 60);
  }, [certificate]);

  // Download High-Resolution PNG
  const downloadPNG = () => {
    if (!canvasRef.current || !certificate) return;
    const link = document.createElement('a');
    link.download = `${certificate.recipientName.replace(/\s+/g, '_')}_CTF2026_Certificate.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  // Download Official PDF
  const downloadPDF = () => {
    if (!canvasRef.current || !certificate) return;
    const imgData = canvasRef.current.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1920, 1080],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, 1920, 1080);
    pdf.save(`${certificate.recipientName.replace(/\s+/g, '_')}_CTF2026_Certificate.pdf`);
  };

  // Copy Verification Link
  const copyVerificationLink = () => {
    if (!certificate) return;
    const url = `${window.location.origin}/verify/${certificate.certId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full space-y-8">
      {/* Physical Certificate Winner Notice */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-purple-950/60 border border-amber-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm sm:text-base">
                Winner & Participant Certificate Policy
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                OFFICIAL
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              <strong className="text-amber-400">Winner Certificates will be PHYSICAL:</strong> Top 3 teams will receive handcrafted, framed physical certificates, medals, and championship trophies at the offline prize distribution ceremony.
              All other verified teams and participants can generate and download their official <strong>Digital Certificate of Participation & Merit</strong> below!
            </p>
          </div>
        </div>
      </div>

      {/* Generator Configuration Form */}
      <div className="bg-[#0b1020] border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Digital Certificate Generator
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Generate credentials for team leader or individual teammates (up to 3 participants per team).
            </p>
          </div>

          {team && (
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-400 font-mono">Team:</span>
              <span className="block text-sm font-bold text-emerald-400 font-mono">
                {team.name}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleGenerateCertificate} className="space-y-5">
          {/* If team members are loaded, allow selecting which participant */}
          {team && team.members && team.members.length > 0 && (
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                Select Team Participant:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {team.members.map((m: Participant, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRecipientName(m.name);
                      setSelectedMemberEmail(m.email);
                    }}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      recipientName === m.name
                        ? 'bg-emerald-500/10 border-emerald-500 text-slate-100 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <User className={`w-4 h-4 ${recipientName === m.name ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{m.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        {m.isLeader ? 'Team Leader' : `Teammate #${idx}`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Participant Full Name (Displayed on Certificate)
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                required
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Team Name
              </label>
              <input
                type="text"
                value={team?.name || 'Your CTF Team'}
                disabled
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-400 font-mono text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/50 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={generating}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm hover:brightness-110 transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              {generating ? (
                <>Generating Certificate...</>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  Render & Sign Certificate
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Canvas Live Preview & Download Action Card */}
      {certificate && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-sm font-bold text-slate-100">
                  Certificate Ready: {certificate.certId}
                </span>
                <span className="text-xs text-slate-400 block font-mono">
                  Recipient: {certificate.recipientName} &bull; Rank #{certificate.rank} ({certificate.score} pts)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={downloadPNG}
                className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-semibold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download PNG (1080p)
              </button>

              <button
                onClick={downloadPDF}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>

              <button
                onClick={copyVerificationLink}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition flex items-center gap-1.5 border border-slate-700"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied URL!' : 'Share / Verify URL'}
              </button>

              <a
                href={`/verify/${certificate.certId}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
                title="Open Public Verification Page"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Responsive Preview Canvas Container */}
          <div className="w-full bg-[#05070d] rounded-2xl border border-slate-800 p-2 sm:p-4 shadow-2xl overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-auto max-w-full rounded-xl shadow-2xl border border-slate-800"
              style={{ aspectRatio: '16/9' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
