import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { setTeamSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const team = db.getTeamByEmail(cleanEmail);

    if (!team) {
      return NextResponse.json(
        { error: 'No team registered with this email.' },
        { status: 404 }
      );
    }

    // Check password if provided and configured
    if (team.password && password) {
      if (team.password !== password) {
        return NextResponse.json(
          { error: 'Incorrect team password.' },
          { status: 401 }
        );
      }
    }

    setTeamSession(team);

    return NextResponse.json({
      success: true,
      team: {
        id: team.id,
        name: team.name,
        leaderName: team.leaderName,
        leaderEmail: team.leaderEmail,
        members: team.members,
        score: team.score,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Login error' },
      { status: 500 }
    );
  }
}
