import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'CYBERSTRIKE CTF 2026 | 2-Wave Dynamic Decay Capture The Flag',
  description:
    'Annual Capture The Flag competition on October 28. Featuring 2-wave deployment (10 AM & 1 PM), dynamic point decay, max 3-member teams with email & OTP verification, and verifiable digital certificates.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080b12] text-slate-100 antialiased min-h-screen flex flex-col selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        
        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-[#06080e] py-8 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <span className="font-bold text-slate-200">CYBERSTRIKE CTF 2026</span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="text-cyan-300">CSSA &bull; Dept. of CS, PDUAM Amjonga</span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="text-emerald-400">Oct 28 (10 AM &amp; 1 PM Waves)</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span className="text-amber-400/90 font-mono text-[11px]">
                Winners: Physical Certificates &bull; Participants: Digital Certificates
              </span>
              <a href="/rules" className="hover:text-emerald-400 transition">
                Rules
              </a>
              <a href="/admin" className="hover:text-cyan-400 transition">
                Admin
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
