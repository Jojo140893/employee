import { NextResponse } from "next/server";
import { DatabaseStore } from "@/lib/mock-data";

export async function GET() {
  const employees = DatabaseStore.getEmployees();
  const calls = DatabaseStore.getCallLogs();
  const contacts = DatabaseStore.getContacts();

  const totalCalls = calls.length;
  const inboundCalls = calls.filter((c) => c.direction === "INBOUND").length;
  const outboundCalls = calls.filter((c) => c.direction === "OUTBOUND").length;
  const completedCalls = calls.filter((c) => c.status === "COMPLETED").length;
  const missedCalls = calls.filter((c) => c.status === "MISSED").length;

  const totalDurationSeconds = calls.reduce((acc, c) => acc + c.durationSeconds, 0);
  const avgDurationSeconds = completedCalls > 0 ? Math.round(totalDurationSeconds / completedCalls) : 0;
  const answerRate = totalCalls > 0 ? Math.round(((totalCalls - missedCalls) / totalCalls) * 100) : 100;

  const outcomes = {
    interested: calls.filter((c) => c.outcomeTag === "INTERESTED").length,
    followUp: calls.filter((c) => c.outcomeTag === "FOLLOW_UP").length,
    closed: calls.filter((c) => c.outcomeTag === "CLOSED").length,
    support: calls.filter((c) => c.outcomeTag === "SUPPORT").length,
    notInterested: calls.filter((c) => c.outcomeTag === "NOT_INTERESTED").length,
  };

  const agentPerformance = employees.slice(0, 4).map((emp) => {
    const empCalls = calls.filter((c) => c.employeeId === emp.id);
    const empTalkTime = empCalls.reduce((sum, c) => sum + c.durationSeconds, 0);
    return {
      id: emp.id,
      name: emp.fullName,
      role: emp.jobTitle,
      avatar: emp.avatarUrl,
      status: emp.liveStatus,
      totalCalls: empCalls.length,
      talkTimeMinutes: Math.round(empTalkTime / 60),
      dealsClosed: empCalls.filter((c) => c.outcomeTag === "CLOSED").length,
    };
  });

  return NextResponse.json({
    success: true,
    kpis: {
      totalCalls,
      inboundCalls,
      outboundCalls,
      completedCalls,
      missedCalls,
      answerRate,
      avgDurationSeconds,
      totalTalkTimeMinutes: Math.round(totalDurationSeconds / 60),
      totalContacts: contacts.length,
      activeAgents: employees.filter((e) => e.liveStatus !== "OFFLINE").length,
    },
    outcomes,
    agentPerformance,
  });
}
