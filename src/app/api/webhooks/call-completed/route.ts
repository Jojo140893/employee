import { NextResponse } from "next/server";
import { DatabaseStore } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { callSid, transcriptText, diarizedTranscript, summaryBullets, actionItems, sentimentScore, confidenceScore } = payload;

    if (!callSid) {
      return NextResponse.json({ success: false, error: "Missing required callSid" }, { status: 400 });
    }

    const callLogs = DatabaseStore.getCallLogs();
    const call = callLogs.find((c) => c.callSid === callSid);

    if (!call) {
      return NextResponse.json({ success: false, error: `Call with SID ${callSid} not found` }, { status: 404 });
    }

    // Attach or update AI recording insights
    if (!call.recording) {
      call.recording = {
        id: `rec-${Date.now()}`,
        audioUrl: payload.audioUrl || "https://actions.google.com/sounds/v1/ambiences/office_voices.ogg",
        durationSeconds: call.durationSeconds || 120,
        channelCount: 2,
        fileSizeBytes: 2048576,
        transcriptText: transcriptText || "Automated AI transcription generated from Google Voice audio stream.",
        diarizedTranscript: diarizedTranscript || [
          { speaker: "Agent", time: "00:02", text: "DigitalX Solutions, how can I assist you today?" },
          { speaker: "Caller", time: "00:09", text: "Hi, following up on our integration project." },
        ],
        summaryBullets: summaryBullets || [
          "Call completed with positive rapport.",
          "Confirmed Google Voice SIP Link operational status.",
          "Follow-up scheduled."
        ],
        actionItems: actionItems || ["Review call notes."],
        sentimentScore: sentimentScore || "POSITIVE",
        confidenceScore: confidenceScore || 0.95,
      };
    } else {
      if (transcriptText) call.recording.transcriptText = transcriptText;
      if (diarizedTranscript) call.recording.diarizedTranscript = diarizedTranscript;
      if (summaryBullets) call.recording.summaryBullets = summaryBullets;
      if (actionItems) call.recording.actionItems = actionItems;
      if (sentimentScore) call.recording.sentimentScore = sentimentScore;
      if (confidenceScore) call.recording.confidenceScore = confidenceScore;
    }

    DatabaseStore.logAudit({
      userId: "n8n-system-bot",
      userEmail: "automation@digitalx-solutions.com",
      userRole: "SUPER_ADMIN",
      action: "AI_TRANSCRIPTION_PROCESSED",
      targetType: "CallRecording",
      targetId: call.recording.id,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
      metadata: { callSid, sentiment: call.recording.sentimentScore },
    });

    return NextResponse.json({
      success: true,
      message: "AI transcription and summary attached successfully to call record",
      callSid,
      recordingId: call.recording.id,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
