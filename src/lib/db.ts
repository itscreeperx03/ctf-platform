import fs from 'fs';
import path from 'path';
import {
  Team,
  Challenge,
  Solve,
  OTPRecord,
  EventSettings,
  CertificateRecord,
  LeaderboardEntry,
} from '@/types';

interface DatabaseSchema {
  settings: EventSettings;
  teams: Team[];
  challenges: Challenge[];
  solves: Solve[];
  otps: OTPRecord[];
  certificates: CertificateRecord[];
}

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

const DEFAULT_SETTINGS: EventSettings = {
  eventTitle: 'CYBERSTRIKE CTF 2026',
  college: 'Pandit Deendayal Upadhyaya Adarsha Mahavidyalaya (PDUAM), Amjonga',
  department: 'Department of Computer Science',
  organizer: 'CSSA (Computer Science Students Association)',
  eventDate: '2026-10-28',
  wave1StartTime: '10:00:00',
  wave2StartTime: '13:00:00',
  eventEndTime: '18:00:00',
  timezone: 'Asia/Kolkata',
  simulationMode: false,
  simulatedWave: 1,
  allowLateRegistration: true,
};

const DEFAULT_DB: DatabaseSchema = {
  settings: DEFAULT_SETTINGS,
  teams: [],
  // Keeping space empty for problems as requested by user
  challenges: [],
  solves: [],
  otps: [],
  certificates: [],
};

// Ensure data folder and db.json exist
function ensureDb(): DatabaseSchema {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
    return DEFAULT_DB;
  }

  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return {
      settings: { ...DEFAULT_SETTINGS, ...(data.settings || {}) },
      teams: data.teams || [],
      challenges: data.challenges || [],
      solves: data.solves || [],
      otps: data.otps || [],
      certificates: data.certificates || [],
    };
  } catch (err) {
    console.error('Error reading db.json, recovering with default:', err);
    return DEFAULT_DB;
  }
}

function saveDb(data: DatabaseSchema): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tempPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_PATH);
}

export const db = {
  getSettings(): EventSettings {
    const data = ensureDb();
    return data.settings;
  },

  updateSettings(partial: Partial<EventSettings>): EventSettings {
    const data = ensureDb();
    data.settings = { ...data.settings, ...partial };
    saveDb(data);
    return data.settings;
  },

  // Teams
  getTeams(): Team[] {
    const data = ensureDb();
    return data.teams;
  },

  getTeamById(id: string): Team | undefined {
    const data = ensureDb();
    return data.teams.find((t) => t.id === id);
  },

  getTeamByEmail(email: string): Team | undefined {
    const data = ensureDb();
    const cleanEmail = email.trim().toLowerCase();
    return data.teams.find(
      (t) =>
        t.leaderEmail.toLowerCase() === cleanEmail ||
        t.members.some((m) => m.email.toLowerCase() === cleanEmail)
    );
  },

  getTeamByName(name: string): Team | undefined {
    const data = ensureDb();
    const cleanName = name.trim().toLowerCase();
    return data.teams.find((t) => t.name.trim().toLowerCase() === cleanName);
  },

  createTeam(team: Team): Team {
    const data = ensureDb();
    data.teams.push(team);
    saveDb(data);
    return team;
  },

  updateTeam(id: string, updates: Partial<Team>): Team | null {
    const data = ensureDb();
    const index = data.teams.findIndex((t) => t.id === id);
    if (index === -1) return null;
    data.teams[index] = { ...data.teams[index], ...updates };
    saveDb(data);
    return data.teams[index];
  },

  // OTPs
  saveOtp(record: OTPRecord): OTPRecord {
    const data = ensureDb();
    // Invalidate old OTPs for this email
    data.otps = data.otps.map((o) =>
      o.email.toLowerCase() === record.email.toLowerCase()
        ? { ...o, used: true }
        : o
    );
    data.otps.push(record);
    saveDb(data);
    return record;
  },

  findValidOtp(email: string, code: string): OTPRecord | undefined {
    const data = ensureDb();
    const now = Date.now();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();
    return data.otps.find(
      (o) =>
        o.email.toLowerCase() === cleanEmail &&
        o.code === cleanCode &&
        !o.used &&
        o.expiresAt > now
    );
  },

  markOtpUsed(id: string): void {
    const data = ensureDb();
    const record = data.otps.find((o) => o.id === id);
    if (record) {
      record.used = true;
      saveDb(data);
    }
  },

  getRecentOtps(): OTPRecord[] {
    const data = ensureDb();
    return [...data.otps].reverse().slice(0, 20);
  },

  // Challenges
  getChallenges(): Challenge[] {
    const data = ensureDb();
    return data.challenges;
  },

  getChallengeById(id: string): Challenge | undefined {
    const data = ensureDb();
    return data.challenges.find((c) => c.id === id);
  },

  createChallenge(challenge: Challenge): Challenge {
    const data = ensureDb();
    data.challenges.push(challenge);
    saveDb(data);
    return challenge;
  },

  updateChallenge(id: string, updates: Partial<Challenge>): Challenge | null {
    const data = ensureDb();
    const index = data.challenges.findIndex((c) => c.id === id);
    if (index === -1) return null;
    data.challenges[index] = { ...data.challenges[index], ...updates };
    saveDb(data);
    return data.challenges[index];
  },

  deleteChallenge(id: string): boolean {
    const data = ensureDb();
    const initLen = data.challenges.length;
    data.challenges = data.challenges.filter((c) => c.id !== id);
    if (data.challenges.length !== initLen) {
      saveDb(data);
      return true;
    }
    return false;
  },

  // Solves
  getSolves(): Solve[] {
    const data = ensureDb();
    return data.solves;
  },

  getSolvesByTeam(teamId: string): Solve[] {
    const data = ensureDb();
    return data.solves.filter((s) => s.teamId === teamId);
  },

  hasTeamSolved(teamId: string, challengeId: string): boolean {
    const data = ensureDb();
    return data.solves.some((s) => s.teamId === teamId && s.challengeId === challengeId);
  },

  recordSolve(solve: Solve): Solve {
    const data = ensureDb();
    data.solves.push(solve);

    // Update challenge solves count
    const ch = data.challenges.find((c) => c.id === solve.challengeId);
    if (ch) {
      ch.solvesCount = (ch.solvesCount || 0) + 1;
    }

    // Update team score
    const tm = data.teams.find((t) => t.id === solve.teamId);
    if (tm) {
      tm.score = (tm.score || 0) + solve.pointsAwarded;
      tm.lastSolveAt = solve.solvedAt;
    }

    saveDb(data);
    return solve;
  },

  // Leaderboard
  getLeaderboard(): LeaderboardEntry[] {
    const data = ensureDb();
    const entries: LeaderboardEntry[] = data.teams.map((team) => {
      const solves = data.solves.filter((s) => s.teamId === team.id);
      const score = solves.reduce((sum, s) => sum + s.pointsAwarded, 0);
      return {
        rank: 0,
        teamId: team.id,
        teamName: team.name,
        leaderName: team.leaderName,
        memberCount: team.members.length,
        score,
        solvesCount: solves.length,
        lastSolveAt: team.lastSolveAt || null,
      };
    });

    // Sort by score descending, then by last solve time ascending (earlier solve ranks higher)
    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (!a.lastSolveAt) return 1;
      if (!b.lastSolveAt) return -1;
      return new Date(a.lastSolveAt).getTime() - new Date(b.lastSolveAt).getTime();
    });

    entries.forEach((e, idx) => {
      e.rank = idx + 1;
    });

    return entries;
  },

  // Certificates
  saveCertificate(cert: CertificateRecord): CertificateRecord {
    const data = ensureDb();
    const existing = data.certificates.find((c) => c.certId === cert.certId);
    if (!existing) {
      data.certificates.push(cert);
      saveDb(data);
    }
    return cert;
  },

  getCertificateById(certId: string): CertificateRecord | undefined {
    const data = ensureDb();
    return data.certificates.find(
      (c) => c.certId.toUpperCase() === certId.trim().toUpperCase()
    );
  },

  // Reset or seed sample challenges for testing
  seedSampleChallenges(): Challenge[] {
    const data = ensureDb();
    const samples: Challenge[] = [
      {
        id: 'chal-web-1',
        title: 'Inspect The Matrix',
        wave: 1,
        category: 'Web',
        description:
          'Our reconnaissance drones intercepted an unauthorized portal. Can you bypass client-side perimeter verification to acquire the secret token?',
        flag: 'CTF{c1i3nt_s1d3_byp4ss_s3cur1ty}',
        initialPoints: 500,
        minPoints: 100,
        decayMinutes: 180,
        hints: ['Right click -> View Page Source or Inspect Element', 'Look for comments hidden in JS'],
        solvesCount: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'chal-crypto-1',
        title: 'Caesar of the Cyber Bunker',
        wave: 1,
        category: 'Crypto',
        description:
          'We intercepted a cipher message from the subterranean bunker: `FUB{q3frq3_wkh_f1sk3u_f7i}`. Shift frequency indicates standard Roman rotary encryption.',
        flag: 'CTF{d3cd3_the_c1ph3r_c7f}',
        initialPoints: 500,
        minPoints: 100,
        decayMinutes: 180,
        hints: ['ROT13 or Caesar cipher with shift 3'],
        solvesCount: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'chal-forensics-1',
        title: 'Ghost In The Packets',
        wave: 1,
        category: 'Forensics',
        description:
          'Suspicious pcap captures detected in our DMZ network. Extract the hidden payload sent over DNS queries.',
        flag: 'CTF{dns_3xf1ltr4t10n_d3t3ct3d}',
        initialPoints: 500,
        minPoints: 100,
        decayMinutes: 180,
        hints: ['Check DNS query subdomains for base64 encoded chunks'],
        solvesCount: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'chal-rev-1',
        title: 'Quantum Key Derivation',
        wave: 2,
        category: 'Reverse',
        description:
          'Wave 2 Classified: A binary was recovered from a compromised satellite. Disassemble the validation subroutine to recover the master flag.',
        flag: 'CTF{r3v3rs1ng_b1n4r13s_l1k3_4_pr0}',
        initialPoints: 500,
        minPoints: 100,
        decayMinutes: 180,
        hints: ['Look for string comparisons and XOR keys'],
        solvesCount: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'chal-pwn-1',
        title: 'Buffer Overlord',
        wave: 2,
        category: 'Pwn',
        description:
          'Wave 2 Classified: The control daemon does not enforce boundary checks on `gets()`. Overwrite the instruction pointer and invoke `print_flag()`!',
        flag: 'CTF{st4ck_sm4sh1ng_c0mpl3t3d}',
        initialPoints: 500,
        minPoints: 100,
        decayMinutes: 180,
        hints: ['64-byte buffer followed by 8 bytes saved RBP'],
        solvesCount: 0,
        createdAt: new Date().toISOString(),
      },
    ];

    data.challenges = samples;
    saveDb(data);
    return samples;
  },

  clearChallenges(): void {
    const data = ensureDb();
    data.challenges = [];
    data.solves = [];
    saveDb(data);
  },
};

/**
 * Calculate dynamic decaying points:
 * Points start at initialPoints at waveStartTime and slowly decrease
 * linearly over decayMinutes down to minPoints.
 * If all problems in the wave or challenge set have been solved, or time expired,
 * it holds at minPoints.
 */
export function calculateCurrentPoints(
  challenge: Challenge,
  waveStartTime: Date,
  currentTime: Date = new Date()
): number {
  const elapsedMs = currentTime.getTime() - waveStartTime.getTime();
  if (elapsedMs <= 0) {
    return challenge.initialPoints;
  }

  const elapsedMinutes = elapsedMs / (1000 * 60);
  const totalDecayMinutes = challenge.decayMinutes || 180; // 3 hours default

  if (elapsedMinutes >= totalDecayMinutes) {
    return challenge.minPoints;
  }

  const pointRange = challenge.initialPoints - challenge.minPoints;
  const decayed = Math.floor(pointRange * (elapsedMinutes / totalDecayMinutes));
  return Math.max(challenge.minPoints, challenge.initialPoints - decayed);
}

/**
 * Determine Wave status based on settings and current time
 */
export function getWaveStatus(settings: EventSettings, now: Date = new Date()): {
  currentWave: 0 | 1 | 2; // 0 = Not started, 1 = Wave 1, 2 = Wave 2
  wave1Unlocked: boolean;
  wave2Unlocked: boolean;
  wave1StartTime: Date;
  wave2StartTime: Date;
  eventEndTime: Date;
  isEnded: boolean;
  activeStatusText: string;
} {
  if (settings.simulationMode) {
    const simWave = settings.simulatedWave ?? 1;
    // In simulation mode, treat wave start as 30 minutes ago for wave 1 and 15 mins for wave 2
    const w1Start = new Date(now.getTime() - 45 * 60 * 1000);
    const w2Start = new Date(now.getTime() - 15 * 60 * 1000);
    const end = new Date(now.getTime() + 4 * 60 * 60 * 1000);

    return {
      currentWave: simWave,
      wave1Unlocked: simWave >= 1,
      wave2Unlocked: simWave >= 2,
      wave1StartTime: w1Start,
      wave2StartTime: w2Start,
      eventEndTime: end,
      isEnded: false,
      activeStatusText:
        simWave === 0
          ? 'Simulation: Pre-Event'
          : simWave === 1
          ? 'Simulation: Wave 1 Active'
          : 'Simulation: Wave 2 Active (All Waves Live)',
    };
  }

  // Parse event date and wave times
  // Event: Oct 28, 2026. Wave 1: 10:00:00. Wave 2: 13:00:00
  const dateStr = settings.eventDate; // "2026-10-28"
  const [w1Hour, w1Min] = settings.wave1StartTime.split(':').map(Number);
  const [w2Hour, w2Min] = settings.wave2StartTime.split(':').map(Number);
  const [endHour, endMin] = settings.eventEndTime.split(':').map(Number);

  const [year, month, day] = dateStr.split('-').map(Number);

  const wave1StartTime = new Date(year, month - 1, day, w1Hour, w1Min, 0);
  const wave2StartTime = new Date(year, month - 1, day, w2Hour, w2Min, 0);
  const eventEndTime = new Date(year, month - 1, day, endHour, endMin, 0);

  const nowMs = now.getTime();
  const isEnded = nowMs >= eventEndTime.getTime();

  let currentWave: 0 | 1 | 2 = 0;
  if (nowMs >= wave2StartTime.getTime()) {
    currentWave = 2;
  } else if (nowMs >= wave1StartTime.getTime()) {
    currentWave = 1;
  }

  let activeStatusText = 'Registration Open — Wave 1 starts Oct 28 at 10:00 AM';
  if (isEnded) {
    activeStatusText = 'Event Concluded — Certificates Ready';
  } else if (currentWave === 2) {
    activeStatusText = 'Wave 2 Live — Final Sprint!';
  } else if (currentWave === 1) {
    activeStatusText = 'Wave 1 Live — Wave 2 unlocks at 1:00 PM';
  }

  return {
    currentWave,
    wave1Unlocked: currentWave >= 1,
    wave2Unlocked: currentWave >= 2,
    wave1StartTime,
    wave2StartTime,
    eventEndTime,
    isEnded,
    activeStatusText,
  };
}
