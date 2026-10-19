import { NextResponse } from 'next/server';
import { db, getWaveStatus } from '@/lib/db';
import { Challenge } from '@/types';

export async function GET() {
  try {
    const settings = db.getSettings();
    const challenges = db.getChallenges();
    const teams = db.getTeams();
    const solves = db.getSolves();
    const recentOtps = db.getRecentOtps();
    const waveStatus = getWaveStatus(settings);

    return NextResponse.json({
      success: true,
      settings,
      waveStatus,
      challenges,
      teams,
      solves,
      recentOtps,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Admin data load error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'create_challenge') {
      const {
        title,
        wave = 1,
        category = 'Web',
        description,
        flag,
        initialPoints = 500,
        minPoints = 100,
        decayMinutes = 180,
        hints = [],
      } = body;

      if (!title || !description || !flag) {
        return NextResponse.json(
          { error: 'Title, description, and flag are required.' },
          { status: 400 }
        );
      }

      const newChallenge: Challenge = {
        id: `chal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: title.trim(),
        wave: Number(wave) === 2 ? 2 : 1,
        category,
        description: description.trim(),
        flag: flag.trim(),
        initialPoints: Number(initialPoints) || 500,
        minPoints: Number(minPoints) || 100,
        decayMinutes: Number(decayMinutes) || 180,
        hints: Array.isArray(hints) ? hints : hints ? [hints] : [],
        solvesCount: 0,
        createdAt: new Date().toISOString(),
      };

      const created = db.createChallenge(newChallenge);
      return NextResponse.json({ success: true, challenge: created });
    }

    if (action === 'delete_challenge') {
      const { id } = body;
      const ok = db.deleteChallenge(id);
      return NextResponse.json({ success: ok });
    }

    if (action === 'update_challenge') {
      const { id, updates } = body;
      const updated = db.updateChallenge(id, updates);
      return NextResponse.json({ success: !!updated, challenge: updated });
    }

    if (action === 'seed_samples') {
      const seeded = db.seedSampleChallenges();
      return NextResponse.json({
        success: true,
        message: 'Sample challenges loaded for testing dynamic decay and solves.',
        challenges: seeded,
      });
    }

    if (action === 'clear_challenges') {
      db.clearChallenges();
      return NextResponse.json({
        success: true,
        message: 'All challenges cleared. Problem space is now empty as requested.',
      });
    }

    if (action === 'toggle_simulation') {
      const current = db.getSettings();
      const newSimMode = body.simulationMode !== undefined ? body.simulationMode : !current.simulationMode;
      const newWave = body.simulatedWave !== undefined ? body.simulatedWave : current.simulatedWave;

      const updated = db.updateSettings({
        simulationMode: newSimMode,
        simulatedWave: newWave,
      });

      return NextResponse.json({
        success: true,
        settings: updated,
        waveStatus: getWaveStatus(updated),
      });
    }

    if (action === 'update_settings') {
      const { settings } = body;
      const updated = db.updateSettings(settings);
      return NextResponse.json({ success: true, settings: updated });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Admin action error' },
      { status: 500 }
    );
  }
}
