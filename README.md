# CYBERSTRIKE CTF 2026

**Organised by:**
Computer Science Students Association (CSSA)  
Department of Computer Science  
Pandit Deendayal Upadhyaya Adarsha Mahavidyalaya (PDUAM), Amjonga  

---

## 🌟 Overview & Key Requirements Fulfilled

1. **2-Wave Tactical Deployment:**
   - **Event Date:** October 28, 2026
   - **Wave 1 Launch:** 10:00 AM (Web Exploitation, Cryptography, Forensics)
   - **Wave 2 Launch:** 1:00 PM (13:00) (Reverse Engineering, Binary Exploitation / Pwn, Advanced)
   - Real-time countdown clocks and automatic unlock locks.

2. **Team Registration with Email + OTP:**
   - **Team Size:** Maximum of 3 participants per squad (1 Leader + up to 2 Teammates).
   - **Leader Action:** Leader enters team details and adds teammate emails.
   - **OTP Authentication:** Dispatches a 6-digit one-time passcode to the leader's email.
   - **Dev Mode / Instant Test:** In local test mode without SMTP configured, the OTP is conveniently displayed in the browser and console so organizers and participants can test immediately. Real SMTP (Gmail, SendGrid, etc.) can be activated anytime in `.env.local`.

3. **Dynamic Point Decay Engine:**
   - Challenge bounties begin at maximum value (e.g. 500 pts) at wave start.
   - Points **slowly decrease continuously with time** towards a configured floor (e.g. 100 pts).
   - When a squad submits the correct flag token (`CTF{...}`), their score is locked in at the exact point value at that second. Early solvers capture maximum bounty!

4. **Empty Space Reserved for Problems:**
   - Problem space is currently empty as requested.
   - Intuitive **Organizer CMS (`/admin`)** lets you add, edit, or delete challenges whenever your problems are ready.
   - Includes one-click **"Seed Demo Challenges"** (to test decay & flag solves immediately) and **"Clear to Empty Space"** buttons.

5. **Digital & Physical Certificate Pipeline:**
   - **Winner Notice:** Top 3 Winner Teams will receive **Physical Engraved Certificates & Trophies** at the prize ceremony.
   - **Digital Certificate Generator (`/certificate`):** All participants can generate an official high-resolution 1080p Digital Certificate of Participation bearing:
     - Institution: *Pandit Deendayal Upadhyaya Adarsha Mahavidyalaya (PDUAM), Amjonga*
     - Department & Association: *Dept. of Computer Science & CSSA*
     - Participant Name & Team Name
     - Final Rank & Total Score
     - Unique Verification ID (e.g. `CTF26-4D97-2398`)
     - Official signatures of Head of Department and CSSA President
     - Download as **High-Res PNG** or **Official PDF**
     - Public verification URL at `/verify/[certId]`.

---

## 🚀 How to Run Locally

### 1. Start Development Server
In PowerShell, navigate to `ctf-platform` and run:
```powershell
npm.cmd run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Quick Navigation
- **Home / Arena:** `http://localhost:3000/`
- **Team Registration:** `http://localhost:3000/register`
- **Team Sign In:** `http://localhost:3000/login`
- **Challenges Arena:** `http://localhost:3000/challenges`
- **Leaderboard:** `http://localhost:3000/leaderboard`
- **Rules & Codex:** `http://localhost:3000/rules`
- **Digital Certificate Generator:** `http://localhost:3000/certificate`
- **Public Certificate Verification:** `http://localhost:3000/verify/[certId]`
- **Organizer CMS & Problem Manager:** `http://localhost:3000/admin`

---

## ⚙️ Organizer CMS (`/admin`) Features

- **Add Challenges:** Title, Category, Wave (1 or 2), Description, Flag (`CTF{...}`), Initial Points, Min Points, Hints.
- **Wave Simulation Mode:** Switch between real calendar mode (Oct 28) and instant simulation mode (force test Wave 1 or Wave 2 without waiting for the date).
- **Inspect Registered Squads:** View all teams, leaders, and teammate email addresses.
- **Recent OTP Logs:** Inspect sent OTP codes for testing or troubleshooting.

---

## 📧 SMTP Configuration (Optional)
To send live emails to participants via Gmail or custom SMTP, copy `.env.example` to `.env.local` and add:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM="CYBERSTRIKE CTF 2026 <no-reply@cyberctf.local>"
```
*(If omitted, the platform runs in Dev Mode with instant on-screen OTPs).*
