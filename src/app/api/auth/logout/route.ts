import { NextResponse } from 'next/server';
import { clearTeamSession } from '@/lib/auth';

export async function POST() {
  clearTeamSession();
  return NextResponse.json({ success: true, message: 'Logged out successfully.' });
}
