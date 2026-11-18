# DigitalX Solutions — Employee CRM & Google Voice Operations Platform

A production-ready, enterprise-grade Employee Directory, CRM, and Google Voice Telephony Operations Platform built for **DigitalX Solutions** (`digitalx-solutions.com`).

---

## 🌟 Key Architecture & Capabilities

### 1. Role-Based Access Control (RBAC)
- **Super Admin (Founder - Jazib Shahid):** Full access to employee directory, encrypted sensitive vaults, telephony line provisioning, all call recordings, system settings, and audit logs.
- **Manager (Sofia):** Access to team call logs, call recordings, QA scoring, shift schedules, and CRM pipelines (restricted from viewing private personal/financial vaults).
- **Employee / Agent (Ahsan Masood, Aneeqa Nadeem, and staff):** Access to their own embedded softphone, assigned Google Voice line, personal profile, assigned leads, and personal call logs.
- **Instant Persona Switcher:** Built into the top navigation header for live RBAC demonstration.

### 2. Employee Directory & Encrypted Personal Vault
- **Core Identity:** Employee ID (`DX-1001`..`DX-1016`), Full Name, Avatar, Department, Status (`Active`, `Probation`, `On Leave`, `Inactive`), Work Email, Personal Email, Phone, Address.
- **Personal & Emergency:** Date of Birth, Blood Group, Emergency Contact Name, Relationship, Emergency Phone Number.
- **Restricted Admin Vault (AES-256-GCM Encrypted at Rest):**
  - National ID / CNIC (encrypted ciphertext + masked preview `***-****-5431`).
  - Payroll & Bank Account Details (encrypted ciphertext + masked preview).
  - Signed Employment Agreement PDF and ID Document front/back uploads.
  - **Click-to-Reveal Mechanism:** Generates immutable Security Audit Log records on every decryption attempt.
- **CSV Bulk Importer:** One-click CSV template download, row validation, and bulk employee onboarding.

### 3. Dual-Mode Google Voice Telephony Engine
- **Mode A — Google Workspace Voice & BigQuery Sync:**
  - Ingests Google Workspace Voice call logs, timestamps, durations, caller IDs, voicemail audio, and SMS notifications via BigQuery export and Gmail webhook listeners.
- **Mode B — Google Voice SIP Link / WebRTC Browser Softphone:**
  - Direct browser calling via SIP trunking and WebRTC.
  - **100% Dual-Channel Recording:** Automatically records inbound and outbound audio in `.mp3`/`.wav` format.
  - **In-Call Controls:** Mute, Hold, Transfer to employee extensions (`102` Sofia, `103` Ahsan, `104` Aneeqa), DTMF Keypad, Live Timer, and recording consent disclaimer toggle.

### 4. Call Center, Audio Waveform Player & AI Pipeline
- **Interactive Audio Waveform Player:** Play/pause, visual scrubbing across 54 normalized audio frequency bars, playback speeds (`1x`, `1.25x`, `1.5x`, `2x`), volume control, and audio download.
- **Post-Call n8n AI Automation Webhook (`/api/webhooks/call-completed`):**
  - Emits event payload upon call completion.
  - Attaches speaker-diarized transcript (Agent vs Caller), 3-bullet executive AI summary, extracted action items, and sentiment score (`Positive`, `Neutral`, `Negative`).
- **Unified Two-Way SMS & Voicemail Inbox:** Synchronized SMS messaging per contact via assigned Google Voice lines with quick reply templates.

### 5. CRM Leads & Contact Activity Timeline
- **Auto-Screen Pop:** Displays caller CRM history and past notes when a Google Voice call arrives.
- **Auto-Lead Creation:** Automatically provisions a new Lead in the CRM when an unknown number rings.
- **Chronological Timeline:** Unified feed of all calls, transcripts, SMS messages, and employee notes.

### 6. Executive & Manager Analytics Dashboard
- **Live Team Presence Board:** Real-time shift status (`Available`, `On Call`, `In Wrap-Up`, `Break`, `Offline`).
- **Operational KPIs:** Total Calls, Inbound/Outbound split, Answer Rate %, Missed Calls, Average Duration, and Total Talk Time.
- **Security Audit Logs:** Real-time log table of every vault decryption and recording playback.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router, TypeScript), Tailwind CSS, Lucide Icons.
- **Backend & APIs:** Next.js API Routes, Prisma ORM (`@prisma/client`), Node.js native crypto (`AES-256-GCM`).
- **Database:** PostgreSQL (Supabase / Neon) with Prisma Schema (`prisma/schema.prisma`).
- **Storage:** S3-compatible object storage (AWS S3 / Cloudflare R2 / Supabase Storage).
- **Automation:** n8n Webhook Integration (`POST /api/webhooks/call-completed`).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node v22)
- npm or pnpm

### 2. Installation & Setup
```bash
# Clone the repository
git clone https://github.com/Jojo140893/employee.git
cd employee

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Generate Prisma Client
npx prisma generate
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Repository Structure

```text
├── prisma/
│   ├── schema.prisma                  # Full relational model (User, EmployeeProfile, Vault, Line, CallLog, Recording, Audit)
│   └── seed.ts                        # Initial team seed (Jazib Shahid, Sofia, Ahsan Masood, Aneeqa, Employees 5-16)
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with Sidebar, Header, AppProvider & Softphone
│   │   ├── page.tsx                   # Executive & Manager Analytics Dashboard
│   │   ├── employees/page.tsx         # Employee Directory & Personal Data Management
│   │   ├── telephony/page.tsx         # Call Center & Automated Recordings Hub
│   │   ├── crm/page.tsx               # CRM Leads & Activity Timelines
│   │   ├── inbox/page.tsx             # Unified Two-Way SMS & Voicemail Inbox
│   │   ├── audit/page.tsx             # Enterprise Security Audit Logs
│   │   ├── settings/page.tsx          # Dual-Mode Google Voice & n8n Webhook Settings
│   │   └── api/                       # 13 REST API & Webhook routes
│   ├── components/
│   │   ├── layout/                    # Header (with RBAC Persona Switcher) & Sidebar
│   │   ├── dialer/                    # Floating WebRTC Google Voice Dialer & ScreenPopModal
│   │   ├── employees/                 # EncryptedVaultViewer, ProfileModal, CsvBulkImporter
│   │   ├── telephony/                 # WaveformPlayer, CallLogsTable, AiSummaryDrawer
│   │   ├── crm/                       # ContactTimeline
│   │   └── analytics/                 # KpiCards, LivePresenceBoard
│   ├── context/
│   │   └── AppContext.tsx             # Global application state and dialer trigger
│   └── lib/
│       ├── crypto.ts                  # AES-256-GCM encryption/decryption at rest
│       ├── rbac.ts                    # Permission checks for Super Admin, Manager, Agent
│       ├── google-voice.ts            # Dual-Mode Google Voice helper
│       ├── storage.ts                 # S3 / R2 signed URL generator
│       └── mock-data.ts               # In-memory store with 16 employees and realistic records
├── search.py                          # Local CLI to search skills and design intelligence
├── skills.json                        # Metadata catalog of bundled developer skills
├── .env.example                       # Full environment variable configuration guide
└── README.md
```

---

## 🔒 Security & Privacy

1. **Vault Encryption:** AES-256-GCM authenticated encryption with unique initialization vectors (IV) and authentication tags.
2. **Access Control:** Super Admin permission is strictly enforced on `/api/employees/[id]/vault/reveal`.
3. **Audit Trails:** Every decryption event generates an immutable entry in the `AuditLog` table containing user ID, IP address, target employee code, and timestamp.

---

## 📄 License

Licensed under the MIT License. Built for **DigitalX Solutions** (`digitalx-solutions.com`).
