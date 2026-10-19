import { NextResponse } from 'next/server';
import { db, getWaveStatus } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = db.getSettings();
    const waveStatus = getWaveStatus(settings);
    const leaderboard = db.getLeaderboard();
    const allSolves = db.getSolves();

    // Latest 15 solves across the competition
    const recentSolves = [...allSolves]
      .reverse()
      .slice(0, 15)
      .map((s) => ({
        id: s.id,
        teamName: s.teamName,
        challengeTitle: s.challengeTitle,
        pointsAwarded: s.pointsAwarded,
        solvedAt: s.solvedAt,
      }));

    return NextResponse.json({
      success: true,
      leaderboard,
      recentSolves,
      totalTeams: leaderboard.length,
      waveStatus,
      winnerNotice:
        'Winner Notice: The Top 3 Teams on this scoreboard will receive Official Physical Certificates, Medals, and Trophies at the award ceremony. Digital certificates are available for all participants.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
