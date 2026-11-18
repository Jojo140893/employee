import { NextResponse } from "next/server";
import { DatabaseStore, CallLogRecord } from "@/lib/mock-data";
import { triggerN8nPostCallPipeline } from "@/lib/google-voice";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");
    const status = searchParams.get("status");
    const outcome = searchParams.get("outcome");
    const query = searchParams.get("q");

    let calls = DatabaseStore.getCallLogs();

    if (employeeId && employeeId !== "ALL") {
      calls = calls.filter((c) => c.employeeId === employeeId);
    }
    if (status && status !== "ALL") {
      calls = calls.filter((c) => c.status === status);
    }
    if (outcome && outcome !== "ALL") {
      calls = calls.filter((c) => c.outcomeTag === outcome);
    }
    if (query) {
      const q = query.toLowerCase();
      calls = calls.filter(
        (c) =>
          c.callerNumber.includes(q) ||
          c.calleeNumber.includes(q) ||
          (c.contactName && c.contactName.toLowerCase().includes(q)) ||
          c.employeeName.toLowerCase().includes(q) ||
          c.notes.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, count: calls.length, data: calls });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCall: CallLogRecord = {
      id: `call-${Date.now()}`,
      callSid: body.callSid || `CA_GV_${Date.now()}`,
      direction: body.direction || "OUTBOUND",
      callerNumber: body.callerNumber,
      calleeNumber: body.calleeNumber,
      status: body.status || "COMPLETED",
      startTime: body.startTime || new Date().toISOString(),
      durationSeconds: Number(body.durationSeconds) || 60,
      outcomeTag: body.outcomeTag || "INTERESTED",
      employeeId: body.employeeId || "emp-01",
      employeeName: body.employeeName || "Agent",
      employeeAvatar: body.employeeAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      employeeVoiceNumber: body.employeeVoiceNumber || "+1 (202) 555-0198",
      contactId: body.contactId,
      contactName: body.contactName,
      notes: body.notes || "Live call logged via Google Voice softphone dialer.",
      recording: body.recordingUrl
        ? {
            id: `rec-${Date.now()}`,
            audioUrl: body.recordingUrl,
            durationSeconds: Number(body.durationSeconds) || 60,
            channelCount: 2,
            fileSizeBytes: 1048576,
            transcriptText: body.transcriptText || "Call recording processed. Transcription pending AI pipeline.",
            diarizedTranscript: [
              { speaker: "Agent", time: "00:02", text: "Thank you for calling DigitalX Solutions." },
              { speaker: "Client", time: "00:08", text: "Hello, following up on our integration project." },
            ],
            summaryBullets: [
              "Automated dual-channel recording synced from WebRTC/SIP Link session.",
              "Caller discussed integration roadmap and confirmed schedule.",
              "Follow-up task scheduled."
            ],
            actionItems: ["Review technical integration requirements."],
            sentimentScore: "POSITIVE",
            confidenceScore: 0.95,
          }
        : undefined,
    };

    DatabaseStore.addCallLog(newCall);

    // Auto-trigger n8n AI webhook
    if (newCall.recording) {
      await triggerN8nPostCallPipeline({
        callSid: newCall.callSid,
        recordingUrl: newCall.recording.audioUrl,
        durationSeconds: newCall.durationSeconds,
        caller: newCall.callerNumber,
        agentName: newCall.employeeName,
      });
    }

    return NextResponse.json({ success: true, data: newCall }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
