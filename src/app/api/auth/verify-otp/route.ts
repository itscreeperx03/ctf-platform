import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { setTeamSession } from '@/lib/auth';
import { Team, Participant } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and OTP code are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const validOtp = db.findValidOtp(cleanEmail, code);

    if (!validOtp) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP. Please check the code or request a new one.' },
        { status: 400 }
      );
    }

    // Mark OTP as used
    db.markOtpUsed(validOtp.id);

    let team: Team;

    if (validOtp.type === 'registration') {
      const meta = validOtp.metadata || {};
      const teamName = meta.teamName;
      const leaderName = meta.leaderName || 'Team Leader';
      const password = meta.password || '';
      const rawMembers = meta.members || [];

      // Assemble participants list: Leader + up to 2 teammates
      const participants: Participant[] = [
        { name: leaderName, email: cleanEmail, isLeader: true },
      ];

      if (Array.isArray(rawMembers)) {
        for (const m of rawMembers) {
          if (m.name && m.email && participants.length < 3) {
            participants.push({
              name: m.name.trim(),
              email: m.email.trim().toLowerCase(),
              isLeader: false,
            });
          }
        }
      }

      // Check if team name got registered in meantime
      const existing = db.getTeamByName(teamName);
      if (existing) {
        team = existing;
      } else {
        const newTeam: Team = {
          id: `team-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: teamName,
          leaderName,
          leaderEmail: cleanEmail,
          password,
          members: participants,
          verified: true,
          score: 0,
          createdAt: new Date().toISOString(),
        };
        team = db.createTeam(newTeam);
      }
    } else {
      // Login flow
      const existingTeam = db.getTeamByEmail(cleanEmail);
      if (!existingTeam) {
        return NextResponse.json(
          { error: 'Registered team not found for this email.' },
          { status: 404 }
        );
      }
      team = existingTeam;
    }

    // Set HTTP session cookie
    setTeamSession(team);

    return NextResponse.json({
      success: true,
      message: 'Authentication successful! Welcome to CYBERSTRIKE CTF.',
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
    console.error('Error in /api/auth/verify-otp:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
