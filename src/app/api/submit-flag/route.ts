import { NextResponse } from 'next/server';
import { db, getWaveStatus, calculateCurrentPoints } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';
import { Solve } from '@/types';

export async function POST(req: Request) {
  try {
    const session = getCurrentSession();
    if (!session?.teamId) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in with your team to submit flags.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { challengeId, flag } = body;

    if (!challengeId || !flag) {
      return NextResponse.json(
        { error: 'Challenge ID and flag are required.' },
        { status: 400 }
      );
    }

    const team = db.getTeamById(session.teamId);
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found. Please log in again.' },
        { status: 404 }
      );
    }

    const challenge = db.getChallengeById(challengeId);
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge does not exist.' },
        { status: 404 }
      );
    }

    // Check wave status
    const settings = db.getSettings();
    const now = new Date();
    const waveStatus = getWaveStatus(settings, now);

    const isWaveUnlocked =
      challenge.wave === 1 ? waveStatus.wave1Unlocked : waveStatus.wave2Unlocked;

    if (!isWaveUnlocked) {
      return NextResponse.json(
        {
          error: `Wave ${challenge.wave} has not officially started yet. Challenge remains locked.`,
        },
        { status: 403 }
      );
    }

    // Check if team already solved this challenge
    if (db.hasTeamSolved(team.id, challenge.id)) {
      return NextResponse.json(
        { error: 'Your team has already solved this challenge!' },
        { status: 400 }
      );
    }

    // Flag comparison (trimmed)
    const cleanSubmittedFlag = flag.trim();
    const cleanRealFlag = challenge.flag.trim();

    if (cleanSubmittedFlag !== cleanRealFlag) {
      return NextResponse.json(
        { success: false, error: 'Incorrect flag! Verify your exploit or string and try again.' },
        { status: 400 }
      );
    }

    // Calculate dynamic points at this exact solve moment
    const waveStartTime =
      challenge.wave === 1
        ? waveStatus.wave1StartTime
        : waveStatus.wave2StartTime;
    const pointsAwarded = calculateCurrentPoints(challenge, waveStartTime, now);

    // Record the solve
    const solveRecord: Solve = {
      id: `solve-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      teamId: team.id,
      teamName: team.name,
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      pointsAwarded,
      solvedAt: now.toISOString(),
    };

    db.recordSolve(solveRecord);

    const updatedTeam = db.getTeamById(team.id);

    return NextResponse.json({
      success: true,
      message: `FLAG ACCEPTED! You earned ${pointsAwarded} points for ${challenge.title}.`,
      pointsAwarded,
      newScore: updatedTeam?.score || pointsAwarded,
    });
  } catch (err: any) {
    console.error('Error in /api/submit-flag:', err);
    return NextResponse.json(
      { error: err.message || 'Error submitting flag' },
      { status: 500 }
    );
  }
}
