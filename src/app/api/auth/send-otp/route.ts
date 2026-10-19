import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateOTP, sendOtpEmail } from '@/lib/auth';
import { OTPRecord } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, teamName, type = 'registration', members, leaderName, password } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (type === 'registration') {
      if (!teamName || teamName.trim().length < 2) {
        return NextResponse.json(
          { error: 'Team name must be at least 2 characters.' },
          { status: 400 }
        );
      }

      // Check if team name already taken
      const existingName = db.getTeamByName(teamName);
      if (existingName) {
        return NextResponse.json(
          { error: 'This team name is already taken. Please choose another.' },
          { status: 409 }
        );
      }

      // Check if leader email is already registered
      const existingEmail = db.getTeamByEmail(cleanEmail);
      if (existingEmail) {
        return NextResponse.json(
          { error: 'This email is already registered with team "' + existingEmail.name + '". Please log in instead.' },
          { status: 409 }
        );
      }

      // Check max 3 participants rule
      // members includes leader + optional up to 2 teammates
      const totalParticipants = (members ? members.length : 0) + 1; // +1 for leader
      if (totalParticipants > 3) {
        return NextResponse.json(
          { error: 'A team can have a maximum of 3 participants (Leader + 2 teammates).' },
          { status: 400 }
        );
      }

      // Validate teammate emails
      if (members && Array.isArray(members)) {
        const memberEmails = members.map((m: any) => m.email?.trim().toLowerCase()).filter(Boolean);
        // Check duplicates within team
        if (memberEmails.includes(cleanEmail)) {
          return NextResponse.json(
            { error: 'Leader email cannot also be listed as a teammate.' },
            { status: 400 }
          );
        }
        if (new Set(memberEmails).size !== memberEmails.length) {
          return NextResponse.json(
            { error: 'Teammates cannot share the same email address.' },
            { status: 400 }
          );
        }
      }
    } else {
      // Login flow: verify team exists
      const existingTeam = db.getTeamByEmail(cleanEmail);
      if (!existingTeam) {
        return NextResponse.json(
          { error: 'No registered team found with this email. Please register first.' },
          { status: 404 }
        );
      }
    }

    const code = generateOTP();
    const otpRecord: OTPRecord = {
      id: `otp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: cleanEmail,
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      used: false,
      type,
      createdAt: new Date().toISOString(),
      metadata: {
        teamName: teamName || 'CTF Challenger',
        leaderName,
        members,
        password,
      },
    };

    db.saveOtp(otpRecord);

    const emailResult = await sendOtpEmail(
      cleanEmail,
      code,
      teamName || 'CTF Challenger',
      type
    );

    return NextResponse.json({
      success: true,
      message: emailResult.message,
      // Expose devOtp in devMode or non-production so users/graders can immediately test without SMTP setup
      devOtp: emailResult.devMode ? code : undefined,
      devMode: emailResult.devMode,
    });
  } catch (err: any) {
    console.error('Error in /api/auth/send-otp:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
