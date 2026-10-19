import { NextResponse } from 'next/server';
import { db, getWaveStatus, calculateCurrentPoints } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = db.getSettings();
    const now = new Date();
    const waveStatus = getWaveStatus(settings, now);

    const session = getCurrentSession();
    const teamSolves = session?.teamId ? db.getSolvesByTeam(session.teamId) : [];
    const solvedChallengeIds = new Set(teamSolves.map((s) => s.challengeId));

    const rawChallenges = db.getChallenges();

    // Check if all problems are solved across the competition
    const allSolves = db.getSolves();
    const totalChallengesCount = rawChallenges.length;
    const distinctSolvedChallenges = new Set(allSolves.map((s) => s.challengeId));
    const allProblemsSolved =
      totalChallengesCount > 0 &&
      distinctSolvedChallenges.size === totalChallengesCount;

    const challenges = rawChallenges.map((ch) => {
      const isWaveUnlocked =
        ch.wave === 1 ? waveStatus.wave1Unlocked : waveStatus.wave2Unlocked;
      const waveStartTime =
        ch.wave === 1 ? waveStatus.wave1StartTime : waveStatus.wave2StartTime;

      // Calculate dynamic decaying points
      const currentPoints = isWaveUnlocked
        ? calculateCurrentPoints(ch, waveStartTime, now)
        : ch.initialPoints;

      const decayPercent = Math.round(
        ((ch.initialPoints - currentPoints) /
          Math.max(1, ch.initialPoints - ch.minPoints)) *
          100
      );

      const isSolved = solvedChallengeIds.has(ch.id);
      const teamSolveData = isSolved
        ? teamSolves.find((s) => s.challengeId === ch.id)
        : null;

      return {
        id: ch.id,
        title: ch.title,
        wave: ch.wave,
        category: ch.category,
        // Only reveal full details if wave is unlocked
        description: isWaveUnlocked
          ? ch.description
          : 'Classified: Challenge details unlock automatically when Wave ' +
            ch.wave +
            ' begins.',
        initialPoints: ch.initialPoints,
        minPoints: ch.minPoints,
        currentPoints,
        decayPercent,
        decayMinutes: ch.decayMinutes,
        hints: isWaveUnlocked ? ch.hints : [],
        files: isWaveUnlocked ? ch.files || [] : [],
        solvesCount: ch.solvesCount || 0,
        isUnlocked: isWaveUnlocked,
        isSolved,
        pointsAwarded: teamSolveData ? teamSolveData.pointsAwarded : null,
      };
    });

    return NextResponse.json({
      success: true,
      waveStatus,
      allProblemsSolved,
      serverTime: now.toISOString(),
      challenges,
      isEmpty: challenges.length === 0,
      emptyMessage:
        'The arena is currently preparing. Challenge slots are reserved and will be published by the organizers before/at Wave 1 (Oct 28, 10:00 AM).',
    });
  } catch (err: any) {
    console.error('Error in /api/challenges:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to load challenges' },
      { status: 500 }
    );
  }
}
