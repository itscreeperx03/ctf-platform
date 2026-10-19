import nodemailer from 'nodemailer';
import { cookies } from 'next/headers';
import { db } from './db';
import { OTPRecord, Team } from '@/types';

const SESSION_COOKIE_NAME = 'ctf_team_session';

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP via email using SMTP if configured, or log to console for dev mode.
 */
export async function sendOtpEmail(
  email: string,
  otp: string,
  teamName: string,
  type: 'registration' | 'login' = 'registration'
): Promise<{ success: boolean; devMode: boolean; message: string }> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpFrom = process.env.SMTP_FROM || 'CTF Portal <no-reply@cyberctf.local>';

  const subject =
    type === 'registration'
      ? `[CYBERSTRIKE CTF 2026] Team Registration OTP: ${otp}`
      : `[CYBERSTRIKE CTF 2026] Login Verification Code: ${otp}`;

  const htmlContent = `
    <div style="font-family: monospace, sans-serif; background-color: #0b0f19; color: #f1f5f9; padding: 32px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #00ff9d; letter-spacing: 2px; margin: 0; font-size: 24px;">CYBERSTRIKE CTF 2026</h1>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">SECURE ACCESS GATEWAY</p>
      </div>
      
      <p style="font-size: 15px; color: #cbd5e1;">Hello <strong>${teamName}</strong>,</p>
      <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
        You requested a verification code for the CYBERSTRIKE CTF. Use the one-time passcode below to complete your authentication.
      </p>

      <div style="background-color: #030712; border: 2px dashed #00e5ff; border-radius: 6px; padding: 20px; text-align: center; margin: 28px 0;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #00ff9d; display: inline-block;">${otp}</span>
        <p style="font-size: 12px; color: #64748b; margin-top: 8px; margin-bottom: 0;">Code expires in 10 minutes. Do not share this with other teams.</p>
      </div>

      <div style="font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 16px;">
        <p style="margin: 0;">Event Date: October 28, 2026</p>
        <p style="margin: 4px 0;">Wave 1 Launch: 10:00 AM | Wave 2 Launch: 1:00 PM</p>
        <p style="margin: 4px 0;">Points dynamic decay starts at wave release.</p>
      </div>
    </div>
  `;

  // If SMTP is provided, send real email
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: email,
        subject,
        html: htmlContent,
      });

      console.log(`[SMTP] Verification email sent to ${email} (OTP: ${otp})`);
      return {
        success: true,
        devMode: false,
        message: 'OTP sent to your email successfully.',
      };
    } catch (err: any) {
      console.error('[SMTP ERROR] Failed to send email:', err.message);
      // Fallback to dev mode so registration is never broken
      return {
        success: true,
        devMode: true,
        message: `Dev Fallback (SMTP error): Your verification OTP is: ${otp}`,
      };
    }
  }

  // Dev mode: log to console
  console.log('====================================================');
  console.log(`[DEV MODE OTP] Email: ${email} | Team: ${teamName}`);
  console.log(`[DEV MODE OTP] VERIFICATION CODE: ${otp}`);
  console.log('====================================================');

  return {
    success: true,
    devMode: true,
    message: `Dev Mode: OTP sent to ${email}. Code: ${otp}`,
  };
}

/**
 * Set session cookie
 */
export function setTeamSession(team: Team): void {
  const cookieStore = cookies();
  const sessionData = {
    teamId: team.id,
    teamName: team.name,
    leaderEmail: team.leaderEmail,
    role: 'team',
  };
  const token = Buffer.from(JSON.stringify(sessionData)).toString('base64');
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Get current session
 */
export function getCurrentSession(): {
  teamId: string;
  teamName: string;
  leaderEmail: string;
  role: string;
} | null {
  const cookieStore = cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie?.value) return null;

  try {
    const raw = Buffer.from(cookie.value, 'base64').toString('utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

/**
 * Clear session cookie
 */
export function clearTeamSession(): void {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
