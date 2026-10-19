import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = getCurrentSession();
    if (!session?.teamId) {
      return NextResponse.json({ authenticated: false, team: null });
    }

    const team = db.getTeamById(session.teamId);
    if (!team) {
      return NextResponse.json({ authenticated: false, team: null });
    }

    const leaderboard = db.getLeaderboard();
    const rankInfo = leaderboard.find((l) => l.teamId === team.id);
    const solves = db.getSolvesByTeam(team.id);

    return NextResponse.json({
      authenticated: true,
      team: {
        id: team.id,
        name: team.name,
        leaderName: team.leaderName,
        leaderEmail: team.leaderEmail,
        members: team.members,
        score: team.score,
        rank: rankInfo ? rankInfo.rank : leaderboard.length + 1,
        solves: solves.map((s) => ({
          challengeId: s.challengeId,
          challengeTitle: s.challengeTitle,
          pointsAwarded: s.pointsAwarded,
          solvedAt: s.solvedAt,
        })),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, team: null });
  }
}
