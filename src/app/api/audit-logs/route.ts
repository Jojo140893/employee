import { NextResponse } from "next/server";
import { DatabaseStore } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  let logs = DatabaseStore.getAuditLogs();

  if (action && action !== "ALL") {
    logs = logs.filter((l) => l.action === action);
  }

  return NextResponse.json({
    success: true,
    count: logs.length,
    data: logs,
  });
}
