export interface Participant {
  name: string;
  email: string;
  isLeader?: boolean;
}

export interface Team {
  id: string;
  name: string;
  leaderName: string;
  leaderEmail: string;
  password?: string;
  members: Participant[];
  verified: boolean;
  score: number;
  lastSolveAt?: string | null;
  createdAt: string;
}

export type ChallengeCategory =
  | 'Web'
  | 'Crypto'
  | 'Reverse'
  | 'Forensics'
  | 'Pwn'
  | 'OSINT'
  | 'Misc';

export interface Challenge {
  id: string;
  title: string;
  wave: 1 | 2;
  category: ChallengeCategory;
  description: string;
  flag: string;
  initialPoints: number;
  minPoints: number;
  decayMinutes: number; // minutes from wave start to reach minPoints
  hints: string[];
  files?: { name: string; url: string; size?: string }[];
  solvesCount: number;
  createdAt: string;
}

export interface Solve {
  id: string;
  teamId: string;
  teamName: string;
  challengeId: string;
  challengeTitle: string;
  pointsAwarded: number;
  solvedAt: string;
}

export interface OTPRecord {
  id: string;
  email: string;
  code: string;
  expiresAt: number;
  used: boolean;
  type: 'registration' | 'login';
  createdAt: string;
  metadata?: any;
}

export interface EventSettings {
  eventTitle: string;
  college?: string;
  department?: string;
  organizer?: string;
  eventDate: string; // "2026-10-28"
  wave1StartTime: string; // "10:00:00"
  wave2StartTime: string; // "13:00:00"
  eventEndTime: string; // "20:00:00"
  timezone: string; // e.g. "Asia/Kolkata" or local
  simulationMode: boolean; // allow testing waves without waiting for real date
  simulatedWave: 0 | 1 | 2; // 0=Before Wave 1, 1=Wave 1 Active, 2=Wave 2 Active
  allowLateRegistration: boolean;
}

export interface CertificateRecord {
  certId: string;
  recipientName: string;
  recipientEmail: string;
  teamName: string;
  teamId: string;
  rank: number;
  score: number;
  issueDate: string;
  eventTitle: string;
  college?: string;
  department?: string;
  organizer?: string;
}

export interface LeaderboardEntry {
  rank: number;
  teamId: string;
  teamName: string;
  leaderName: string;
  memberCount: number;
  score: number;
  solvesCount: number;
  lastSolveAt: string | null;
}
