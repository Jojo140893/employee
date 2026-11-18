import { NextResponse } from "next/server";
import { DatabaseStore } from "@/lib/mock-data";

export async function GET() {
  try {
    const progressRecords = DatabaseStore.getProgressRecords();
    const employees = DatabaseStore.getEmployees();

    const summary = {
      totalTracked: progressRecords.length,
      exceeding: progressRecords.filter((p) => p.status === "EXCEEDING").length,
      onTrack: progressRecords.filter((p) => p.status === "ON_TRACK").length,
      needsAttention: progressRecords.filter((p) => p.status === "NEEDS_ATTENTION").length,
      avgCompletionRate: Math.round(
        progressRecords.reduce((acc, p) => acc + p.completionRate, 0) / (progressRecords.length || 1)
      ),
    };

    return NextResponse.json({
      success: true,
      summary,
      data: progressRecords,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
