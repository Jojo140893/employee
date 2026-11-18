import { encryptVaultData } from "./crypto";

export interface EmployeeRecord {
  id: string;
  employeeCode: string;
  fullName: string;
  avatarUrl: string;
  jobTitle: string;
  department: string;
  employmentStatus: "ACTIVE" | "PROBATION" | "ON_LEAVE" | "INACTIVE";
  joiningDate: string;
  workEmail: string;
  personalEmail: string;
  personalPhone: string;
  residentialAddress: string;

  // Personal & Emergency
  dateOfBirth: string;
  bloodGroup: string;
  emergencyContactName: string;
  emergencyRelationship: string;
  emergencyPhone: string;

  // Telephony
  googleVoiceNumber: string;
  sipExtension: string;
  shiftHours: string;
  timezone: string;
  liveStatus: "AVAILABLE" | "ON_CALL" | "IN_WRAPUP" | "BREAK" | "OFFLINE";
  lastStatusChange: string;

  // Encrypted Sensitive Vault
  vault: {
    encryptedCnic: string;
    cnicMasked: string;
    encryptedBankDetails: string;
    bankAccountMasked: string;
    idFrontDocumentUrl: string;
    idBackDocumentUrl: string;
    employmentAgreementPdfUrl: string;
  };
}

export interface ContactRecord {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  company: string;
  status: "LEAD" | "PROSPECT" | "CUSTOMER" | "CHURNED";
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  lastContactedAt: string;
  notes: string;
  tags: string[];
}

export interface CallLogRecord {
  id: string;
  callSid: string;
  direction: "INBOUND" | "OUTBOUND";
  callerNumber: string;
  calleeNumber: string;
  status: "COMPLETED" | "MISSED" | "VOICEMAIL" | "NO_ANSWER" | "BUSY";
  startTime: string;
  durationSeconds: number;
  outcomeTag: "INTERESTED" | "FOLLOW_UP" | "CLOSED" | "NOT_INTERESTED" | "SUPPORT";
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  employeeVoiceNumber: string;
  contactId?: string;
  contactName?: string;
  notes: string;

  recording?: {
    id: string;
    audioUrl: string;
    durationSeconds: number;
    channelCount: number;
    fileSizeBytes: number;
    transcriptText: string;
    diarizedTranscript: Array<{ speaker: string; time: string; text: string }>;
    summaryBullets: [string, string, string];
    actionItems: string[];
    sentimentScore: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
    confidenceScore: number;
  };
}

export interface SmsMessageRecord {
  id: string;
  employeeId: string;
  contactId: string;
  contactName: string;
  direction: "INBOUND" | "OUTBOUND";
  fromNumber: string;
  toNumber: string;
  body: string;
  status: "SENT" | "DELIVERED" | "RECEIVED";
  timestamp: string;
}

export interface AuditLogRecord {
  id: string;
  userId: string;
  userEmail: string;
  userRole: "SUPER_ADMIN" | "MANAGER" | "AGENT";
  action: string;
  targetType: string;
  targetId: string;
  ipAddress: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// ------------------------------------------------------------------------------
// Appointment Setter Records
// ------------------------------------------------------------------------------
export interface AppointmentRecord {
  id: string;
  prospectName: string;
  company: string;
  prospectPhone: string;
  prospectEmail: string;
  scheduledTime: string;
  status: "BOOKED" | "CONFIRMED" | "COMPLETED" | "NO_SHOW" | "CANCELLED";
  setterId: string;
  setterName: string;
  closerId: string;
  closerName: string;
  source: string;
  notes: string;
  createdAt: string;
}

// ------------------------------------------------------------------------------
// Closures & Deals Pipeline Records
// ------------------------------------------------------------------------------
export interface ClosureDealRecord {
  id: string;
  dealName: string;
  clientName: string;
  company: string;
  dealValue: number;
  cashCollected: number;
  stage: "QUALIFIED" | "PROPOSAL_SENT" | "NEGOTIATION" | "CONTRACT_SIGNED" | "CLOSED_WON" | "CLOSED_LOST";
  closerId: string;
  closerName: string;
  setterId: string;
  setterName: string;
  closeDate: string;
  contractUrl?: string;
  notes: string;
}

// ------------------------------------------------------------------------------
// Project Delivery & Milestones Records
// ------------------------------------------------------------------------------
export interface DeliveryMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface ProjectDeliveryRecord {
  id: string;
  projectName: string;
  clientName: string;
  company: string;
  status: "ONBOARDING" | "IN_PROGRESS" | "QA_REVIEW" | "DELIVERED" | "BLOCKED";
  health: "ON_TRACK" | "AT_RISK" | "DELAYED";
  progressPercent: number; // 0 - 100
  startDate: string;
  targetDeliveryDate: string;
  deliveryLeadId: string;
  deliveryLeadName: string;
  milestones: DeliveryMilestone[];
  csatScore?: number;
  notes: string;
}

// ------------------------------------------------------------------------------
// Employee Progress Tracking Records
// ------------------------------------------------------------------------------
export interface EmployeeProgressRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  department: string;
  avatarUrl: string;
  weeklyTarget: number;
  weeklyAchieved: number;
  monthlyTarget: number;
  monthlyAchieved: number;
  metricLabel: string;
  unit: string;
  status: "EXCEEDING" | "ON_TRACK" | "NEEDS_ATTENTION";
  completionRate: number;
  recentActivity: string;
}

// ------------------------------------------------------------------------------
// Initial Seed Data: DigitalX Solutions Roster
// ------------------------------------------------------------------------------
const initialEmployees: EmployeeRecord[] = [
  {
    id: "emp-01",
    employeeCode: "DX-1001",
    fullName: "Jazib Shahid",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    jobTitle: "Founder & Super Admin",
    department: "Executive Leadership",
    employmentStatus: "ACTIVE",
    joiningDate: "2023-01-15",
    workEmail: "jazib@digitalx-solutions.com",
    personalEmail: "jazib.personal@gmail.com",
    personalPhone: "+1 (202) 555-0101",
    residentialAddress: "Suite 400, Tech Heights, Innovation Way, CA",
    dateOfBirth: "1993-08-14",
    bloodGroup: "O+",
    emergencyContactName: "Ayesha Shahid",
    emergencyRelationship: "Spouse",
    emergencyPhone: "+1 (202) 555-0199",
    googleVoiceNumber: "+1 (202) 555-0198",
    sipExtension: "101",
    shiftHours: "08:00 - 17:00 EST",
    timezone: "America/New_York",
    liveStatus: "AVAILABLE",
    lastStatusChange: new Date(Date.now() - 15 * 60000).toISOString(),
    vault: {
      encryptedCnic: encryptVaultData("42101-9876543-1"),
      cnicMasked: "***-****-5431",
      encryptedBankDetails: encryptVaultData(JSON.stringify({
        bankName: "JPMorgan Chase",
        accountNumber: "987654321098",
        iban: "US98CHAS12345678901234",
        routingNumber: "021000021"
      })),
      bankAccountMasked: "JPMorgan Chase •••• •••• 1098",
      idFrontDocumentUrl: "/docs/dx1001_id_front.pdf",
      idBackDocumentUrl: "/docs/dx1001_id_back.pdf",
      employmentAgreementPdfUrl: "/docs/dx1001_founder_charter.pdf",
    },
  },
  {
    id: "emp-02",
    employeeCode: "DX-1002",
    fullName: "Sofia",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    jobTitle: "Operations Manager",
    department: "Operations & QA",
    employmentStatus: "ACTIVE",
    joiningDate: "2023-04-10",
    workEmail: "sofia@digitalx-solutions.com",
    personalEmail: "sofia.ops@gmail.com",
    personalPhone: "+1 (202) 555-0102",
    residentialAddress: "Apt 12B, Maple Street, Brooklyn, NY",
    dateOfBirth: "1995-11-20",
    bloodGroup: "A+",
    emergencyContactName: "Tariq Malik",
    emergencyRelationship: "Brother",
    emergencyPhone: "+1 (202) 555-0188",
    googleVoiceNumber: "+1 (202) 555-0142",
    sipExtension: "102",
    shiftHours: "09:00 - 18:00 EST",
    timezone: "America/New_York",
    liveStatus: "ON_CALL",
    lastStatusChange: new Date(Date.now() - 8 * 60000).toISOString(),
    vault: {
      encryptedCnic: encryptVaultData("35202-1234567-2"),
      cnicMasked: "***-****-4567",
      encryptedBankDetails: encryptVaultData(JSON.stringify({
        bankName: "Bank of America",
        accountNumber: "456789012345",
        iban: "US45BOFA98765432109876",
        routingNumber: "026009593"
      })),
      bankAccountMasked: "Bank of America •••• •••• 2345",
      idFrontDocumentUrl: "/docs/dx1002_id_front.pdf",
      idBackDocumentUrl: "/docs/dx1002_id_back.pdf",
      employmentAgreementPdfUrl: "/docs/dx1002_employment_agreement.pdf",
    },
  },
  {
    id: "emp-03",
    employeeCode: "DX-1003",
    fullName: "Ahsan Masood",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    jobTitle: "Automation & SIP Engineer",
    department: "Telephony Infrastructure",
    employmentStatus: "ACTIVE",
    joiningDate: "2023-08-01",
    workEmail: "ahsan@digitalx-solutions.com",
    personalEmail: "ahsan.sip@outlook.com",
    personalPhone: "+1 (202) 555-0103",
    residentialAddress: "Flat 4, Silicon Avenue, Austin, TX",
    dateOfBirth: "1994-03-12",
    bloodGroup: "B+",
    emergencyContactName: "Bilal Masood",
    emergencyRelationship: "Father",
    emergencyPhone: "+1 (202) 555-0177",
    googleVoiceNumber: "+1 (202) 555-0155",
    sipExtension: "103",
    shiftHours: "10:00 - 19:00 EST",
    timezone: "America/Chicago",
    liveStatus: "AVAILABLE",
    lastStatusChange: new Date(Date.now() - 45 * 60000).toISOString(),
    vault: {
      encryptedCnic: encryptVaultData("61101-7654321-3"),
      cnicMasked: "***-****-4321",
      encryptedBankDetails: encryptVaultData(JSON.stringify({
        bankName: "Wells Fargo",
        accountNumber: "321098765432",
        iban: "US32WFAR11223344556677",
        routingNumber: "121000248"
      })),
      bankAccountMasked: "Wells Fargo •••• •••• 5432",
      idFrontDocumentUrl: "/docs/dx1003_id_front.pdf",
      idBackDocumentUrl: "/docs/dx1003_id_back.pdf",
      employmentAgreementPdfUrl: "/docs/dx1003_engineer_agreement.pdf",
    },
  },
  {
    id: "emp-04",
    employeeCode: "DX-1004",
    fullName: "Aneeqa Nadeem",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    jobTitle: "Sales Executive",
    department: "Sales & Client Success",
    employmentStatus: "ACTIVE",
    joiningDate: "2023-09-15",
    workEmail: "aneeqa@digitalx-solutions.com",
    personalEmail: "aneeqa.sales@gmail.com",
    personalPhone: "+1 (202) 555-0104",
    residentialAddress: "77 Park Crest Boulevard, Chicago, IL",
    dateOfBirth: "1996-07-25",
    bloodGroup: "AB+",
    emergencyContactName: "Farhan Nadeem",
    emergencyRelationship: "Spouse",
    emergencyPhone: "+1 (202) 555-0166",
    googleVoiceNumber: "+1 (202) 555-0170",
    sipExtension: "104",
    shiftHours: "09:00 - 18:00 EST",
    timezone: "America/Chicago",
    liveStatus: "IN_WRAPUP",
    lastStatusChange: new Date(Date.now() - 3 * 60000).toISOString(),
    vault: {
      encryptedCnic: encryptVaultData("37405-3344556-4"),
      cnicMasked: "***-****-4556",
      encryptedBankDetails: encryptVaultData(JSON.stringify({
        bankName: "Citibank N.A.",
        accountNumber: "789012345678",
        iban: "US78CITI00112233445566",
        routingNumber: "021000089"
      })),
      bankAccountMasked: "Citibank N.A. •••• •••• 5678",
      idFrontDocumentUrl: "/docs/dx1004_id_front.pdf",
      idBackDocumentUrl: "/docs/dx1004_id_back.pdf",
      employmentAgreementPdfUrl: "/docs/dx1004_sales_contract.pdf",
    },
  },
];

// Generate [Employee 5] through [Employee 16] placeholders
const placeholderRoles = [
  { role: "Outbound SDR", dept: "Sales & Client Success", shift: "09:00 - 18:00" },
  { role: "Senior Account Executive", dept: "Sales & Client Success", shift: "10:00 - 19:00" },
  { role: "Customer Support Specialist", dept: "Support & Operations", shift: "08:00 - 17:00" },
  { role: "Technical Support Lead", dept: "Support & Operations", shift: "11:00 - 20:00" },
  { role: "Telephony DevOps Engineer", dept: "Telephony Infrastructure", shift: "09:00 - 18:00" },
  { role: "Full-Stack Developer", dept: "Engineering", shift: "09:00 - 18:00" },
  { role: "QA Test Specialist", dept: "Engineering", shift: "10:00 - 19:00" },
  { role: "Inbound Lead Qualifier", dept: "Sales & Client Success", shift: "08:30 - 17:30" },
  { role: "Retention Specialist", dept: "Support & Operations", shift: "09:30 - 18:30" },
  { role: "Client Onboarding Manager", dept: "Operations & QA", shift: "09:00 - 18:00" },
  { role: "AI Workflow Specialist", dept: "Telephony Infrastructure", shift: "10:00 - 19:00" },
  { role: "Executive Assistant", dept: "Executive Leadership", shift: "08:00 - 17:00" },
];

for (let i = 5; i <= 16; i++) {
  const meta = placeholderRoles[i - 5];
  const numPad = i < 10 ? `0${i}` : `${i}`;
  const ext = `${100 + i}`;
  const gvNum = `+1 (202) 555-01${numPad}`;
  
  initialEmployees.push({
    id: `emp-${i}`,
    employeeCode: `DX-10${numPad}`,
    fullName: `[Employee ${i}]`,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Employee${i}`,
    jobTitle: meta.role,
    department: meta.dept,
    employmentStatus: i === 15 ? "PROBATION" : i === 16 ? "ON_LEAVE" : "ACTIVE",
    joiningDate: `2024-0${Math.min(i - 4, 9)}-01`,
    workEmail: `employee${i}@digitalx-solutions.com`,
    personalEmail: `emp${i}.personal@gmail.com`,
    personalPhone: `+1 (202) 555-02${numPad}`,
    residentialAddress: `Address for Employee ${i}, Tech City, CA`,
    dateOfBirth: "1997-04-15",
    bloodGroup: i % 2 === 0 ? "B+" : "O+",
    emergencyContactName: `Emergency Contact ${i}`,
    emergencyRelationship: "Parent",
    emergencyPhone: `+1 (202) 555-03${numPad}`,
    googleVoiceNumber: gvNum,
    sipExtension: ext,
    shiftHours: `${meta.shift} EST`,
    timezone: "America/New_York",
    liveStatus: i % 4 === 0 ? "OFFLINE" : i % 3 === 0 ? "BREAK" : "AVAILABLE",
    lastStatusChange: new Date(Date.now() - (i * 7) * 60000).toISOString(),
    vault: {
      encryptedCnic: encryptVaultData(`10000-${i}000000-${i % 9}`),
      cnicMasked: `***-****-${i}00${i % 9}`,
      encryptedBankDetails: encryptVaultData(JSON.stringify({
        bankName: "Partner Bank NA",
        accountNumber: `550011223344${numPad}`,
        iban: `US55PARTNER00112233${numPad}`,
        routingNumber: "122000049"
      })),
      bankAccountMasked: `Partner Bank NA •••• •••• 33${numPad}`,
      idFrontDocumentUrl: `/docs/dx10${numPad}_id_front.pdf`,
      idBackDocumentUrl: `/docs/dx10${numPad}_id_back.pdf`,
      employmentAgreementPdfUrl: `/docs/dx10${numPad}_agreement.pdf`,
    },
  });
}

// ------------------------------------------------------------------------------
// Sample Contacts & CRM Leads
// ------------------------------------------------------------------------------
const initialContacts: ContactRecord[] = [
  {
    id: "cnt-01",
    name: "Marcus Vance",
    phoneNumber: "+1 (415) 890-1234",
    email: "marcus.vance@apexcapital.io",
    company: "Apex Capital Partners",
    status: "PROSPECT",
    assignedEmployeeId: "emp-04",
    assignedEmployeeName: "Aneeqa Nadeem",
    lastContactedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    notes: "Interested in enterprise SIP integration for 45 agents. Requested security audit compliance docs.",
    tags: ["Enterprise", "Google Voice SIP", "High Priority"],
  },
  {
    id: "cnt-02",
    name: "Elena Rostova",
    phoneNumber: "+1 (312) 445-9876",
    email: "elena@novatech-logistics.com",
    company: "NovaTech Global Logistics",
    status: "CUSTOMER",
    assignedEmployeeId: "emp-02",
    assignedEmployeeName: "Sofia",
    lastContactedAt: new Date(Date.now() - 120 * 60000).toISOString(),
    notes: "Active customer using Google Voice sync pipeline. Needs custom n8n transcript webhook.",
    tags: ["Customer", "API Webhook", "Renewal Q4"],
  },
  {
    id: "cnt-03",
    name: "David Sterling",
    phoneNumber: "+1 (646) 332-1190",
    email: "david@sterlingwealth.com",
    company: "Sterling Private Wealth",
    status: "LEAD",
    assignedEmployeeId: "emp-04",
    assignedEmployeeName: "Aneeqa Nadeem",
    lastContactedAt: new Date(Date.now() - 360 * 60000).toISOString(),
    notes: "Incoming inquiry from website contact form. Demanded encrypted vault guarantees.",
    tags: ["Inbound Lead", "Wealth Mgmt"],
  },
  {
    id: "cnt-04",
    name: "Samantha Reed",
    phoneNumber: "+1 (512) 789-4321",
    email: "sreed@cloudscale-saas.com",
    company: "CloudScale Software",
    status: "CUSTOMER",
    assignedEmployeeId: "emp-01",
    assignedEmployeeName: "Jazib Shahid",
    lastContactedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    notes: "Key enterprise sponsor. Bi-weekly sync on telephony scaling.",
    tags: ["Strategic", "VIP"],
  },
];

// ------------------------------------------------------------------------------
// Sample Call Logs with Dual-Channel Audio & AI Summaries
// ------------------------------------------------------------------------------
const initialCallLogs: CallLogRecord[] = [
  {
    id: "call-101",
    callSid: "CA_GV_20261118_982310",
    direction: "OUTBOUND",
    callerNumber: "+1 (202) 555-0170", // Aneeqa
    calleeNumber: "+1 (415) 890-1234", // Marcus Vance
    status: "COMPLETED",
    startTime: new Date(Date.now() - 32 * 60000).toISOString(),
    durationSeconds: 385,
    outcomeTag: "INTERESTED",
    employeeId: "emp-04",
    employeeName: "Aneeqa Nadeem",
    employeeAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    employeeVoiceNumber: "+1 (202) 555-0170",
    contactId: "cnt-01",
    contactName: "Marcus Vance",
    notes: "Demoed Google Voice softphone dialer and automated audio recording sync. Lead showed high intent.",
    recording: {
      id: "rec-101",
      audioUrl: "https://actions.google.com/sounds/v1/ambiences/office_voices.ogg",
      durationSeconds: 385,
      channelCount: 2,
      fileSizeBytes: 4920400,
      transcriptText: "Agent: Hi Marcus, thank you for taking the time to test DigitalX Solutions. Caller: Hey Aneeqa, absolutely. We've been looking for a unified Google Voice setup where our agents don't have to keep switching between the browser dialer and CRM tabs. Agent: Exactly. Our SIP Link bridge allows two-way browser calling with 100% automated call recording and instant speaker-diarized AI transcription. Caller: That's our exact requirement. Can you send over the security architecture and pricing for 45 seats? Agent: Sending that right away. Let's schedule the technical walkthrough for Thursday.",
      diarizedTranscript: [
        { speaker: "Aneeqa (Agent)", time: "00:04", text: "Hi Marcus, thank you for taking the time to test DigitalX Solutions." },
        { speaker: "Marcus Vance", time: "00:15", text: "Hey Aneeqa, absolutely. We've been looking for a unified Google Voice setup where our agents don't have to switch tabs." },
        { speaker: "Aneeqa (Agent)", time: "00:32", text: "Exactly. Our SIP Link bridge allows browser calling with automated dual-channel call recording and AI summaries." },
        { speaker: "Marcus Vance", time: "01:10", text: "That is our exact requirement. Can you send over the security architecture and pricing for 45 seats?" },
        { speaker: "Aneeqa (Agent)", time: "01:35", text: "Sending that right away. Let's schedule the technical walkthrough for Thursday." },
      ],
      summaryBullets: [
        "Prospect tested browser WebRTC softphone & confirmed high interest in Google Voice SIP Link for 45 agents.",
        "Verified requirement for automatic dual-channel call recording and encrypted document vaults.",
        "Scheduled follow-up technical architecture review for Thursday at 2 PM EST."
      ],
      actionItems: [
        "Send 45-seat pricing proposal and SOC-2 / AES-256 compliance summary to Marcus Vance.",
        "Reserve calendar slot with Ahsan Masood for Thursday technical SIP demonstration."
      ],
      sentimentScore: "POSITIVE",
      confidenceScore: 0.98,
    },
  },
  {
    id: "call-102",
    callSid: "CA_GV_20261118_847192",
    direction: "INBOUND",
    callerNumber: "+1 (312) 445-9876", // Elena Rostova
    calleeNumber: "+1 (202) 555-0142", // Sofia
    status: "COMPLETED",
    startTime: new Date(Date.now() - 110 * 60000).toISOString(),
    durationSeconds: 240,
    outcomeTag: "SUPPORT",
    employeeId: "emp-02",
    employeeName: "Sofia",
    employeeAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    employeeVoiceNumber: "+1 (202) 555-0142",
    contactId: "cnt-02",
    contactName: "Elena Rostova",
    notes: "Support call regarding n8n webhook payload formatting for post-call AI summaries.",
    recording: {
      id: "rec-102",
      audioUrl: "https://actions.google.com/sounds/v1/telephones/ringback_tone.ogg",
      durationSeconds: 240,
      channelCount: 2,
      fileSizeBytes: 3120100,
      transcriptText: "Caller: Hi Sofia, we noticed our custom n8n webhook received the audio recording URL but needed the diarized speaker segments. Agent: Hi Elena! In your n8n workflow, parse the 'diarizedTranscript' array inside the JSON payload. It contains speaker names, timestamps, and confidence scores. Caller: Ah, perfect, that resolved it immediately. Thank you!",
      diarizedTranscript: [
        { speaker: "Elena Rostova", time: "00:03", text: "Hi Sofia, we noticed our custom n8n webhook received the audio recording URL but needed the diarized speaker segments." },
        { speaker: "Sofia (Manager)", time: "00:25", text: "Hi Elena! In your n8n workflow, parse the 'diarizedTranscript' array inside the JSON payload." },
        { speaker: "Elena Rostova", time: "01:02", text: "Ah, perfect, that resolved it immediately. Thank you!" },
      ],
      summaryBullets: [
        "Client contacted operations regarding post-call n8n webhook payload mapping.",
        "Demonstrated JSON structure containing speaker diarization and sentiment score.",
        "Ticket resolved on first contact with 100% satisfaction."
      ],
      actionItems: [
        "Update n8n documentation webhook sample schema in Settings tab."
      ],
      sentimentScore: "POSITIVE",
      confidenceScore: 0.96,
    },
  },
  {
    id: "call-103",
    callSid: "CA_GV_20261118_120491",
    direction: "INBOUND",
    callerNumber: "+1 (646) 332-1190", // David Sterling
    calleeNumber: "+1 (202) 555-0198", // Jazib Shahid
    status: "MISSED",
    startTime: new Date(Date.now() - 210 * 60000).toISOString(),
    durationSeconds: 0,
    outcomeTag: "FOLLOW_UP",
    employeeId: "emp-01",
    employeeName: "Jazib Shahid",
    employeeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    employeeVoiceNumber: "+1 (202) 555-0198",
    contactId: "cnt-03",
    contactName: "David Sterling",
    notes: "Missed incoming call during board meeting. Sent auto-SMS template.",
  },
];

// ------------------------------------------------------------------------------
// Sample SMS Messages
// ------------------------------------------------------------------------------
const initialSms: SmsMessageRecord[] = [
  {
    id: "sms-01",
    employeeId: "emp-04",
    contactId: "cnt-01",
    contactName: "Marcus Vance",
    direction: "OUTBOUND",
    fromNumber: "+1 (202) 555-0170",
    toNumber: "+1 (415) 890-1234",
    body: "Hi Marcus, Aneeqa from DigitalX here. As discussed on our call, here is the direct link to our Google Voice operations architecture: https://digitalx-solutions.com/architecture",
    status: "DELIVERED",
    timestamp: new Date(Date.now() - 28 * 60000).toISOString(),
  },
  {
    id: "sms-02",
    employeeId: "emp-04",
    contactId: "cnt-01",
    contactName: "Marcus Vance",
    direction: "INBOUND",
    fromNumber: "+1 (415) 890-1234",
    toNumber: "+1 (202) 555-0170",
    body: "Received! Looking over it now. Looks very solid. Talk to you Thursday at 2 PM.",
    status: "RECEIVED",
    timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: "sms-03",
    employeeId: "emp-01",
    contactId: "cnt-03",
    contactName: "David Sterling",
    direction: "OUTBOUND",
    fromNumber: "+1 (202) 555-0198",
    toNumber: "+1 (646) 332-1190",
    body: "Hi David, sorry I missed your call. I am currently in a meeting. How can DigitalX Solutions assist you today?",
    status: "DELIVERED",
    timestamp: new Date(Date.now() - 205 * 60000).toISOString(),
  },
];

// ------------------------------------------------------------------------------
// Sample Security Audit Logs
// ------------------------------------------------------------------------------
const initialAuditLogs: AuditLogRecord[] = [
  {
    id: "aud-01",
    userId: "usr-jazib-01",
    userEmail: "jazib@digitalx-solutions.com",
    userRole: "SUPER_ADMIN",
    action: "SYSTEM_INITIALIZED",
    targetType: "SystemConfiguration",
    targetId: "digitalx-telephony-prod",
    ipAddress: "192.168.1.10",
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    metadata: { version: "2.5.0", gvLinesProvisioned: 16 },
  },
  {
    id: "aud-02",
    userId: "usr-jazib-01",
    userEmail: "jazib@digitalx-solutions.com",
    userRole: "SUPER_ADMIN",
    action: "VAULT_REVEAL",
    targetType: "EmployeeSensitiveVault",
    targetId: "emp-02",
    ipAddress: "192.168.1.10",
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    metadata: { employeeCode: "DX-1002", fieldsRevealed: ["cnic", "bankAccount"] },
  },
  {
    id: "aud-03",
    userId: "usr-sofia-02",
    userEmail: "sofia@digitalx-solutions.com",
    userRole: "MANAGER",
    action: "RECORDING_PLAYED",
    targetType: "CallRecording",
    targetId: "rec-101",
    ipAddress: "192.168.1.42",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    metadata: { callSid: "CA_GV_20261118_982310", durationSeconds: 385 },
  },
];

// ------------------------------------------------------------------------------
// Initial Appointments Data (Appointment Setters)
// ------------------------------------------------------------------------------
const initialAppointments: AppointmentRecord[] = [
  {
    id: "apt-01",
    prospectName: "Marcus Vance",
    company: "Apex Capital Partners",
    prospectPhone: "+1 (415) 890-1234",
    prospectEmail: "marcus.vance@apexcapital.io",
    scheduledTime: new Date(Date.now() + 2 * 24 * 3600000).toISOString(),
    status: "CONFIRMED",
    setterId: "emp-05",
    setterName: "Zainab Tariq (Setter)",
    closerId: "emp-04",
    closerName: "Aneeqa Nadeem (Closer)",
    source: "Outbound Cold Call",
    notes: "Lead has 45 seats requiring immediate Google Voice SIP Link. Budget approved.",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "apt-02",
    prospectName: "Elena Rostova",
    company: "NovaTech Global Logistics",
    prospectPhone: "+1 (312) 445-9876",
    prospectEmail: "elena@novatech-logistics.com",
    scheduledTime: new Date(Date.now() + 3 * 24 * 3600000).toISOString(),
    status: "BOOKED",
    setterId: "emp-06",
    setterName: "Marcus Kane (Setter)",
    closerId: "emp-04",
    closerName: "Aneeqa Nadeem (Closer)",
    source: "Website Inbound",
    notes: "Needs automated n8n AI transcription and dual-channel call recording.",
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: "apt-03",
    prospectName: "David Sterling",
    company: "Sterling Private Wealth",
    prospectPhone: "+1 (646) 332-1190",
    prospectEmail: "david@sterlingwealth.com",
    scheduledTime: new Date(Date.now() + 4 * 24 * 3600000).toISOString(),
    status: "CONFIRMED",
    setterId: "emp-05",
    setterName: "Zainab Tariq (Setter)",
    closerId: "emp-07",
    closerName: "Liam Vance (Closer)",
    source: "LinkedIn Outreach",
    notes: "Requires SOC-2 compliant AES-256 encrypted vaults for employee document management.",
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
  },
  {
    id: "apt-04",
    prospectName: "Sarah Jenkins",
    company: "CloudScale Software",
    prospectPhone: "+1 (512) 789-4321",
    prospectEmail: "sjenkins@cloudscale.io",
    scheduledTime: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    status: "COMPLETED",
    setterId: "emp-06",
    setterName: "Marcus Kane (Setter)",
    closerId: "emp-04",
    closerName: "Aneeqa Nadeem (Closer)",
    source: "Partner Referral",
    notes: "Pitched Enterprise Tier. Closer initiated contract generation.",
    createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
  },
  {
    id: "apt-05",
    prospectName: "Robert Chen",
    company: "Vanguard Health Tech",
    prospectPhone: "+1 (415) 332-8877",
    prospectEmail: "rchen@vanguardhealth.com",
    scheduledTime: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
    status: "NO_SHOW",
    setterId: "emp-05",
    setterName: "Zainab Tariq (Setter)",
    closerId: "emp-07",
    closerName: "Liam Vance (Closer)",
    source: "Outbound Cold Call",
    notes: "Rescheduled SMS template sent. Waiting for calendar update.",
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

// ------------------------------------------------------------------------------
// Initial Closure Deals Data (Sales Closers)
// ------------------------------------------------------------------------------
const initialClosureDeals: ClosureDealRecord[] = [
  {
    id: "deal-01",
    dealName: "Apex Capital Enterprise Telephony Rollout",
    clientName: "Marcus Vance",
    company: "Apex Capital Partners",
    dealValue: 48000,
    cashCollected: 24000,
    stage: "CONTRACT_SIGNED",
    closerId: "emp-04",
    closerName: "Aneeqa Nadeem (Closer)",
    setterId: "emp-05",
    setterName: "Zainab Tariq (Setter)",
    closeDate: new Date(Date.now() + 1 * 24 * 3600000).toISOString(),
    contractUrl: "/contracts/apex_capital_signed.pdf",
    notes: "Signed 12-month contract for 45 Google Voice SIP lines + dual-channel recording.",
  },
  {
    id: "deal-02",
    dealName: "CloudScale Full Telephony Core & Vault",
    clientName: "Sarah Jenkins",
    company: "CloudScale Software",
    dealValue: 62000,
    cashCollected: 62000,
    stage: "CLOSED_WON",
    closerId: "emp-04",
    closerName: "Aneeqa Nadeem (Closer)",
    setterId: "emp-06",
    setterName: "Marcus Kane (Setter)",
    closeDate: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
    contractUrl: "/contracts/cloudscale_won.pdf",
    notes: "Paid in full. Handed over to Ahsan Masood for project delivery.",
  },
  {
    id: "deal-03",
    dealName: "NovaTech Automated n8n AI Pipelines",
    clientName: "Elena Rostova",
    company: "NovaTech Global Logistics",
    dealValue: 34500,
    cashCollected: 17250,
    stage: "NEGOTIATION",
    closerId: "emp-07",
    closerName: "Liam Vance (Closer)",
    setterId: "emp-06",
    setterName: "Marcus Kane (Setter)",
    closeDate: new Date(Date.now() + 5 * 24 * 3600000).toISOString(),
    notes: "Custom SLA requested. Reviewing security terms.",
  },
  {
    id: "deal-04",
    dealName: "Sterling Private Wealth Dedicated SIP Trunk",
    clientName: "David Sterling",
    company: "Sterling Private Wealth",
    dealValue: 22000,
    cashCollected: 0,
    stage: "PROPOSAL_SENT",
    closerId: "emp-07",
    closerName: "Liam Vance (Closer)",
    setterId: "emp-05",
    setterName: "Zainab Tariq (Setter)",
    closeDate: new Date(Date.now() + 10 * 24 * 3600000).toISOString(),
    notes: "Proposal delivered. Follow-up demo call booked.",
  },
  {
    id: "deal-05",
    dealName: "Quantum Logistics Global Mesh Telephony",
    clientName: "Tariq B.",
    company: "Quantum Logistics",
    dealValue: 85000,
    cashCollected: 85000,
    stage: "CLOSED_WON",
    closerId: "emp-01",
    closerName: "Jazib Shahid (Founder)",
    setterId: "emp-05",
    setterName: "Zainab Tariq (Setter)",
    closeDate: new Date(Date.now() - 14 * 24 * 3600000).toISOString(),
    contractUrl: "/contracts/quantum_won.pdf",
    notes: "Enterprise flagship closure. Project fully delivered.",
  },
];

// ------------------------------------------------------------------------------
// Initial Project Deliveries Data (Project Delivery)
// ------------------------------------------------------------------------------
const initialProjectDeliveries: ProjectDeliveryRecord[] = [
  {
    id: "proj-01",
    projectName: "CloudScale Software Telephony & AI Rollout",
    clientName: "Sarah Jenkins",
    company: "CloudScale Software",
    status: "IN_PROGRESS",
    health: "ON_TRACK",
    progressPercent: 75,
    startDate: new Date(Date.now() - 14 * 24 * 3600000).toISOString(),
    targetDeliveryDate: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
    deliveryLeadId: "emp-03",
    deliveryLeadName: "Ahsan Masood (Automation Engineer)",
    milestones: [
      { id: "m1", title: "Kickoff & Architecture Review", completed: true, dueDate: "2026-11-05" },
      { id: "m2", title: "Google Voice SIP Link Trunk Configuration", completed: true, dueDate: "2026-11-10" },
      { id: "m3", title: "Dual-Channel Audio S3 Bucket Setup", completed: true, dueDate: "2026-11-14" },
      { id: "m4", title: "n8n AI Transcription Webhook Testing", completed: true, dueDate: "2026-11-18" },
      { id: "m5", title: "Client Handover & Agent Training", completed: false, dueDate: "2026-11-25" },
    ],
    notes: "System passed latency tests. Final agent training session scheduled for Tuesday.",
  },
  {
    id: "proj-02",
    projectName: "Apex Capital Softphone & Encrypted Vault",
    clientName: "Marcus Vance",
    company: "Apex Capital Partners",
    status: "ONBOARDING",
    health: "ON_TRACK",
    progressPercent: 25,
    startDate: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    targetDeliveryDate: new Date(Date.now() + 18 * 24 * 3600000).toISOString(),
    deliveryLeadId: "emp-08",
    deliveryLeadName: "Hamza Ali (Delivery Specialist)",
    milestones: [
      { id: "m1", title: "Discovery & Employee Line Allocation", completed: true, dueDate: "2026-11-16" },
      { id: "m2", title: "WebRTC Gateway Provisioning", completed: false, dueDate: "2026-11-22" },
      { id: "m3", title: "AES-256 Vault Cryptographic Audit", completed: false, dueDate: "2026-11-28" },
      { id: "m4", title: "Production Deployment", completed: false, dueDate: "2026-12-05" },
    ],
    notes: "Contract signed. Onboarding kickoff call held with Marcus.",
  },
  {
    id: "proj-03",
    projectName: "NovaTech Logistics Automated Pipelines",
    clientName: "Elena Rostova",
    company: "NovaTech Global Logistics",
    status: "QA_REVIEW",
    health: "AT_RISK",
    progressPercent: 88,
    startDate: new Date(Date.now() - 20 * 24 * 3600000).toISOString(),
    targetDeliveryDate: new Date(Date.now() + 2 * 24 * 3600000).toISOString(),
    deliveryLeadId: "emp-03",
    deliveryLeadName: "Ahsan Masood (Automation Engineer)",
    milestones: [
      { id: "m1", title: "Workflow Mapping & BigQuery Schema", completed: true, dueDate: "2026-11-01" },
      { id: "m2", title: "Webhook Ingestion Logic", completed: true, dueDate: "2026-11-08" },
      { id: "m3", title: "AI Sentiment Pipeline Integration", completed: true, dueDate: "2026-11-15" },
      { id: "m4", title: "User Acceptance Testing (UAT)", completed: false, dueDate: "2026-11-20" },
    ],
    notes: "Awaiting client signoff on UAT test cases. Target delivery at risk.",
  },
  {
    id: "proj-04",
    projectName: "Quantum Logistics Global Mesh Telephony",
    clientName: "Tariq B.",
    company: "Quantum Logistics",
    status: "DELIVERED",
    health: "ON_TRACK",
    progressPercent: 100,
    startDate: new Date(Date.now() - 35 * 24 * 3600000).toISOString(),
    targetDeliveryDate: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    deliveryLeadId: "emp-02",
    deliveryLeadName: "Sofia (Operations Manager)",
    csatScore: 4.9,
    milestones: [
      { id: "m1", title: "Global Trunk Architecture", completed: true, dueDate: "2026-10-20" },
      { id: "m2", title: "Multi-Region Carrier Redundancy", completed: true, dueDate: "2026-10-28" },
      { id: "m3", title: "Security Compliance & Testing", completed: true, dueDate: "2026-11-05" },
      { id: "m4", title: "Full Go-Live & Staff Training", completed: true, dueDate: "2026-11-13" },
    ],
    notes: "Delivered 2 days ahead of schedule. Customer gave 4.9 / 5 CSAT rating.",
  },
];

// ------------------------------------------------------------------------------
// Initial Employee Progress Records (Tracking Progress)
// ------------------------------------------------------------------------------
const initialProgressRecords: EmployeeProgressRecord[] = [
  {
    id: "prog-01",
    employeeId: "emp-05",
    employeeName: "Zainab Tariq",
    employeeRole: "Senior Appointment Setter",
    department: "Appointment Setting",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    weeklyTarget: 5,
    weeklyAchieved: 6,
    monthlyTarget: 20,
    monthlyAchieved: 22,
    metricLabel: "Appointments Booked",
    unit: "calls",
    status: "EXCEEDING",
    completionRate: 110,
    recentActivity: "Booked high-intent meeting with Apex Capital Partners (45 seats)",
  },
  {
    id: "prog-02",
    employeeId: "emp-06",
    employeeName: "Marcus Kane",
    employeeRole: "Outbound Appointment Setter",
    department: "Appointment Setting",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    weeklyTarget: 5,
    weeklyAchieved: 4,
    monthlyTarget: 20,
    monthlyAchieved: 18,
    metricLabel: "Appointments Booked",
    unit: "calls",
    status: "ON_TRACK",
    completionRate: 90,
    recentActivity: "Booked demo for NovaTech Global Logistics via website inbound",
  },
  {
    id: "prog-03",
    employeeId: "emp-04",
    employeeName: "Aneeqa Nadeem",
    employeeRole: "Senior Sales Closer",
    department: "Sales & Closures",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    weeklyTarget: 25000,
    weeklyAchieved: 48000,
    monthlyTarget: 100000,
    monthlyAchieved: 110000,
    metricLabel: "Closed Contract Value",
    unit: "$",
    status: "EXCEEDING",
    completionRate: 110,
    recentActivity: "Closed Apex Capital Partners ($48,000) & CloudScale ($62,000)",
  },
  {
    id: "prog-04",
    employeeId: "emp-07",
    employeeName: "Liam Vance",
    employeeRole: "Account Executive / Closer",
    department: "Sales & Closures",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    weeklyTarget: 20000,
    weeklyAchieved: 15000,
    monthlyTarget: 80000,
    monthlyAchieved: 56500,
    metricLabel: "Closed Contract Value",
    unit: "$",
    status: "ON_TRACK",
    completionRate: 70,
    recentActivity: "Sent proposal to Sterling Private Wealth ($22,000)",
  },
  {
    id: "prog-05",
    employeeId: "emp-03",
    employeeName: "Ahsan Masood",
    employeeRole: "Lead Technical Delivery Engineer",
    department: "Project Delivery",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    weeklyTarget: 1,
    weeklyAchieved: 1,
    monthlyTarget: 4,
    monthlyAchieved: 3,
    metricLabel: "Milestones Delivered",
    unit: "projects",
    status: "ON_TRACK",
    completionRate: 75,
    recentActivity: "Completed n8n AI webhook milestone for CloudScale rollout",
  },
  {
    id: "prog-06",
    employeeId: "emp-02",
    employeeName: "Sofia",
    employeeRole: "Operations & Delivery Manager",
    department: "Project Delivery",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    weeklyTarget: 2,
    weeklyAchieved: 2,
    monthlyTarget: 5,
    monthlyAchieved: 5,
    metricLabel: "Project Deliveries Signed Off",
    unit: "projects",
    status: "EXCEEDING",
    completionRate: 100,
    recentActivity: "Signed off Quantum Logistics delivery with 4.9 CSAT",
  },
];

// In-Memory Data Store (Allows immediate zero-config operations)
export class DatabaseStore {
  private static employees: EmployeeRecord[] = [...initialEmployees];
  private static contacts: ContactRecord[] = [...initialContacts];
  private static callLogs: CallLogRecord[] = [...initialCallLogs];
  private static smsMessages: SmsMessageRecord[] = [...initialSms];
  private static auditLogs: AuditLogRecord[] = [...initialAuditLogs];
  private static appointments: AppointmentRecord[] = [...initialAppointments];
  private static closureDeals: ClosureDealRecord[] = [...initialClosureDeals];
  private static projectDeliveries: ProjectDeliveryRecord[] = [...initialProjectDeliveries];
  private static progressRecords: EmployeeProgressRecord[] = [...initialProgressRecords];

  static getEmployees() {
    return this.employees;
  }

  static getEmployeeById(id: string) {
    return this.employees.find((e) => e.id === id || e.employeeCode === id);
  }

  static updateEmployeeStatus(id: string, status: EmployeeRecord["liveStatus"]) {
    const emp = this.getEmployeeById(id);
    if (emp) {
      emp.liveStatus = status;
      emp.lastStatusChange = new Date().toISOString();
    }
    return emp;
  }

  static addEmployee(emp: EmployeeRecord) {
    this.employees.unshift(emp);
    return emp;
  }

  static getContacts() {
    return this.contacts;
  }

  static getContactById(id: string) {
    return this.contacts.find((c) => c.id === id || c.phoneNumber === id);
  }

  static addContact(c: ContactRecord) {
    this.contacts.unshift(c);
    return c;
  }

  static getCallLogs() {
    return this.callLogs;
  }

  static addCallLog(log: CallLogRecord) {
    this.callLogs.unshift(log);
    return log;
  }

  static getSms() {
    return this.smsMessages;
  }

  static addSms(sms: SmsMessageRecord) {
    this.smsMessages.push(sms);
    return sms;
  }

  static getAuditLogs() {
    return this.auditLogs;
  }

  static logAudit(log: Omit<AuditLogRecord, "id" | "timestamp">) {
    const entry: AuditLogRecord = {
      ...log,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);
    return entry;
  }

  // --- Portal Methods: Appointment Setters ---
  static getAppointments() {
    return this.appointments;
  }

  static addAppointment(apt: AppointmentRecord) {
    this.appointments.unshift(apt);
    return apt;
  }

  static updateAppointmentStatus(id: string, status: AppointmentRecord["status"]) {
    const apt = this.appointments.find((a) => a.id === id);
    if (apt) apt.status = status;
    return apt;
  }

  // --- Portal Methods: Closures ---
  static getClosureDeals() {
    return this.closureDeals;
  }

  static addClosureDeal(deal: ClosureDealRecord) {
    this.closureDeals.unshift(deal);
    return deal;
  }

  static updateClosureDealStage(id: string, stage: ClosureDealRecord["stage"]) {
    const deal = this.closureDeals.find((d) => d.id === id);
    if (deal) deal.stage = stage;
    return deal;
  }

  // --- Portal Methods: Project Delivery ---
  static getProjectDeliveries() {
    return this.projectDeliveries;
  }

  static addProjectDelivery(proj: ProjectDeliveryRecord) {
    this.projectDeliveries.unshift(proj);
    return proj;
  }

  static toggleMilestone(projectId: string, milestoneId: string) {
    const proj = this.projectDeliveries.find((p) => p.id === projectId);
    if (proj) {
      const ms = proj.milestones.find((m) => m.id === milestoneId);
      if (ms) {
        ms.completed = !ms.completed;
        const total = proj.milestones.length;
        const done = proj.milestones.filter((m) => m.completed).length;
        proj.progressPercent = Math.round((done / total) * 100);
        if (proj.progressPercent === 100) proj.status = "DELIVERED";
      }
    }
    return proj;
  }

  // --- Portal Methods: Progress Tracking ---
  static getProgressRecords() {
    return this.progressRecords;
  }
}
