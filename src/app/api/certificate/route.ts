import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';
import { CertificateRecord } from '@/types';

export async function POST(req: Request) {
  try {
    const session = getCurrentSession();
    const body = await req.json();
    const { teamId, recipientName, recipientEmail } = body;

    const targetTeamId = teamId || session?.teamId;
    if (!targetTeamId) {
      return NextResponse.json(
        { error: 'Team ID or authenticated session is required.' },
        { status: 400 }
      );
    }

    const team = db.getTeamById(targetTeamId);
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found.' },
        { status: 404 }
      );
    }

    if (!recipientName) {
      return NextResponse.json(
        { error: 'Participant name is required for certificate generation.' },
        { status: 400 }
      );
    }

    // Determine current team rank
    const leaderboard = db.getLeaderboard();
    const rankInfo = leaderboard.find((l) => l.teamId === team.id);
    const rank = rankInfo ? rankInfo.rank : leaderboard.length + 1;
    const score = team.score || 0;

    // Generate deterministic or unique ID based on team and member name
    const hashSeed = `${team.id}-${recipientName.toLowerCase().trim()}`;
    let hash = 0;
    for (let i = 0; i < hashSeed.length; i++) {
      hash = (hash << 5) - hash + hashSeed.charCodeAt(i);
      hash |= 0;
    }
    const hexPart = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    const certId = `CTF26-${hexPart.substring(0, 4)}-${hexPart.substring(4, 8)}`;

    const certRecord: CertificateRecord = {
      certId,
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail?.trim() || team.leaderEmail,
      teamName: team.name,
      teamId: team.id,
      rank,
      score,
      issueDate: 'October 28, 2026',
      eventTitle: 'CYBERSTRIKE CTF 2026',
      college: 'Pandit Deendayal Upadhyaya Adarsha Mahavidyalaya (PDUAM), Amjonga',
      department: 'Department of Computer Science',
      organizer: 'Computer Science Students Association (CSSA)',
    };

    db.saveCertificate(certRecord);

    return NextResponse.json({
      success: true,
      certificate: certRecord,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const certId = searchParams.get('id');

    if (!certId) {
      return NextResponse.json(
        { error: 'Certificate ID parameter "id" is required.' },
        { status: 400 }
      );
    }

    const cert = db.getCertificateById(certId);
    if (!cert) {
      return NextResponse.json(
        { error: 'Certificate not found. Please verify the ID.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate: cert,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error looking up certificate' },
      { status: 500 }
    );
  }
}
