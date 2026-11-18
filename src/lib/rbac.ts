export type UserRole = "SUPER_ADMIN" | "MANAGER" | "AGENT";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeCode?: string;
  avatarUrl?: string;
}

export const CURRENT_SESSIONS: Record<string, SessionUser> = {
  founder: {
    id: "usr-jazib-01",
    name: "Jazib Shahid",
    email: "jazib@digitalx-solutions.com",
    role: "SUPER_ADMIN",
    employeeCode: "DX-1001",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  manager: {
    id: "usr-sofia-02",
    name: "Sofia",
    email: "sofia@digitalx-solutions.com",
    role: "MANAGER",
    employeeCode: "DX-1002",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
  agent_ahsan: {
    id: "usr-ahsan-03",
    name: "Ahsan Masood",
    email: "ahsan@digitalx-solutions.com",
    role: "AGENT",
    employeeCode: "DX-1003",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  agent_aneeqa: {
    id: "usr-aneeqa-04",
    name: "Aneeqa Nadeem",
    email: "aneeqa@digitalx-solutions.com",
    role: "AGENT",
    employeeCode: "DX-1004",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
};

export const PERMISSIONS = {
  // Vault
  CAN_VIEW_ENCRYPTED_VAULT: (role: UserRole) => role === "SUPER_ADMIN",
  CAN_REVEAL_CNIC: (role: UserRole) => role === "SUPER_ADMIN",
  CAN_REVEAL_BANK_DETAILS: (role: UserRole) => role === "SUPER_ADMIN",
  
  // Call Recordings & Logs
  CAN_VIEW_ALL_RECORDINGS: (role: UserRole) => role === "SUPER_ADMIN" || role === "MANAGER",
  CAN_DOWNLOAD_RECORDINGS: (role: UserRole) => role === "SUPER_ADMIN",
  CAN_VIEW_TEAM_CALL_LOGS: (role: UserRole) => role === "SUPER_ADMIN" || role === "MANAGER",

  // Telephony & Lines
  CAN_REASSIGN_LINES: (role: UserRole) => role === "SUPER_ADMIN",
  CAN_CHANGE_SIP_CONFIG: (role: UserRole) => role === "SUPER_ADMIN",
  
  // Employees
  CAN_CREATE_EMPLOYEE: (role: UserRole) => role === "SUPER_ADMIN" || role === "MANAGER",
  CAN_EDIT_EMPLOYEE: (role: UserRole) => role === "SUPER_ADMIN" || role === "MANAGER",
  CAN_DELETE_EMPLOYEE: (role: UserRole) => role === "SUPER_ADMIN",
  CAN_BULK_IMPORT: (role: UserRole) => role === "SUPER_ADMIN" || role === "MANAGER",
  
  // Analytics
  CAN_VIEW_EXECUTIVE_DASHBOARD: (role: UserRole) => role === "SUPER_ADMIN" || role === "MANAGER",
  CAN_VIEW_SECURITY_AUDIT: (role: UserRole) => role === "SUPER_ADMIN",
};
