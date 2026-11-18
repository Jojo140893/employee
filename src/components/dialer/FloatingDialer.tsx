"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Pause,
  Play,
  Share2,
  Delete,
  X,
  Radio,
  Clock,
  ShieldAlert,
  UserCheck
} from "lucide-react";
import { SessionUser } from "@/lib/rbac";
import ScreenPopModal from "./ScreenPopModal";

interface FloatingDialerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: SessionUser;
  externalDialNumber?: string;
}

export default function FloatingDialer({ isOpen, onClose, currentUser, externalDialNumber }: FloatingDialerProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callState, setCallState] = useState<"IDLE" | "DIALING" | "ACTIVE" | "ON_HOLD">("IDLE");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isHeld, setIsHeld] = useState(false);
  const [consentDisclaimer, setConsentDisclaimer] = useState(true);
  const [activeCallSid, setActiveCallSid] = useState("");
  const [matchedContact, setMatchedContact] = useState<any>(null);
  const [showScreenPop, setShowScreenPop] = useState(false);
  const [transferTarget, setTransferTarget] = useState("");

  useEffect(() => {
    if (externalDialNumber) {
      setPhoneNumber(externalDialNumber);
    }
  }, [externalDialNumber]);

  // Timer loop when active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === "ACTIVE") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleDigit = (digit: string) => {
    if (callState === "IDLE") {
      setPhoneNumber((prev) => prev + digit);
    }
  };

  const handleInitiateCall = async () => {
    if (!phoneNumber) return;
    setCallState("DIALING");

    try {
      const res = await fetch("/api/telephony/dial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationNumber: phoneNumber,
          employeeId: currentUser.employeeCode === "DX-1002" ? "emp-02" : currentUser.employeeCode === "DX-1004" ? "emp-04" : "emp-01",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveCallSid(data.callSid);
        setMatchedContact(data.matchedContact);
        setShowScreenPop(true);
        setTimeout(() => {
          setCallState("ACTIVE");
        }, 1200);
      }
    } catch (e) {
      console.error(e);
      setCallState("IDLE");
    }
  };

  const handleEndCall = async () => {
    const duration = callDuration;
    setCallState("IDLE");
    setCallDuration(0);

    // Save call to database
    try {
      await fetch("/api/telephony/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callSid: activeCallSid || `CA_GV_${Date.now()}`,
          direction: "OUTBOUND",
          callerNumber: "+1 (202) 555-0198",
          calleeNumber: phoneNumber,
          status: "COMPLETED",
          durationSeconds: duration || 30,
          outcomeTag: "INTERESTED",
          employeeId: "emp-01",
          employeeName: currentUser.name,
          employeeVoiceNumber: "+1 (202) 555-0198",
          contactId: matchedContact?.id,
          contactName: matchedContact?.name,
          recordingUrl: "https://actions.google.com/sounds/v1/ambiences/office_voices.ogg",
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden text-white transition-all animate-in slide-in-from-bottom-5">
        {/* Header Bar */}
        <div className="bg-slate-800/90 px-4 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Radio className={`w-4 h-4 ${callState === "ACTIVE" ? "text-red-500 animate-pulse" : "text-emerald-400"}`} />
            <div>
              <div className="text-xs font-bold text-white flex items-center space-x-1">
                <span>Google Voice Softphone</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">SIP Link: Active (Ext {currentUser.employeeCode || "101"})</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Call Status & Timer Banner */}
        {callState !== "IDLE" && (
          <div className="bg-blue-950/70 border-b border-blue-900/50 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${callState === "ACTIVE" ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`}></span>
              <span className="font-semibold text-blue-200">
                {callState === "DIALING" ? "Connecting Google Voice..." : isHeld ? "Call On Hold" : "Live Call"}
              </span>
            </div>
            <div className="font-mono text-xs font-bold text-emerald-400 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(callDuration)}</span>
            </div>
          </div>
        )}

        {/* Number Input / Display */}
        <div className="p-4 bg-slate-950/50">
          <div className="flex items-center justify-between bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2.5">
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              disabled={callState !== "IDLE"}
              className="bg-transparent text-white font-mono text-base font-bold w-full outline-hidden tracking-wider"
            />
            {phoneNumber && callState === "IDLE" && (
              <button onClick={() => setPhoneNumber(phoneNumber.slice(0, -1))} className="text-slate-400 hover:text-white">
                <Delete className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Recording & Consent Indicator */}
          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>100% Dual-Ch Recording</span>
            </span>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                checked={consentDisclaimer}
                onChange={(e) => setConsentDisclaimer(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-blue-500 text-xs"
              />
              <span className="text-[10px] text-slate-400">Consent Disclaimer</span>
            </label>
          </div>
        </div>

        {/* DTMF Keypad (when IDLE or for IVR) */}
        {callState === "IDLE" ? (
          <div className="grid grid-cols-3 gap-2 px-4 pb-4">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
              <button
                key={key}
                onClick={() => handleDigit(key)}
                className="h-11 bg-slate-800/60 hover:bg-slate-700/80 text-white font-mono text-base font-bold rounded-xl border border-slate-700/60 transition-all active:scale-95 flex items-center justify-center shadow-xs"
              >
                {key}
              </button>
            ))}
          </div>
        ) : (
          /* Active Call In-Call Controls */
          <div className="px-4 py-4 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`flex flex-col items-center justify-center py-3 rounded-xl border text-xs font-semibold transition-all ${
                  isMuted ? "bg-amber-600 border-amber-500 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5 mb-1" /> : <Mic className="w-5 h-5 mb-1" />}
                <span>{isMuted ? "Unmute" : "Mute"}</span>
              </button>

              <button
                onClick={() => setIsHeld(!isHeld)}
                className={`flex flex-col items-center justify-center py-3 rounded-xl border text-xs font-semibold transition-all ${
                  isHeld ? "bg-amber-600 border-amber-500 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {isHeld ? <Play className="w-5 h-5 mb-1" /> : <Pause className="w-5 h-5 mb-1" />}
                <span>{isHeld ? "Resume" : "Hold"}</span>
              </button>

              <button
                onClick={() => {
                  const ext = prompt("Enter employee extension to transfer to (e.g. 102 Sofia, 103 Ahsan, 104 Aneeqa):");
                  if (ext) alert(`Call transferring to Extension ${ext}...`);
                }}
                className="flex flex-col items-center justify-center py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition-all"
              >
                <Share2 className="w-5 h-5 mb-1 text-blue-400" />
                <span>Transfer</span>
              </button>
            </div>

            {/* Quick Screen Pop Viewer button */}
            {matchedContact && (
              <button
                onClick={() => setShowScreenPop(true)}
                className="w-full py-2 bg-blue-900/40 hover:bg-blue-900/60 border border-blue-700/60 rounded-xl text-blue-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span>View Screen Pop: {matchedContact.name}</span>
              </button>
            )}
          </div>
        )}

        {/* Action Button: Call / Hangup */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800">
          {callState === "IDLE" ? (
            <button
              onClick={handleInitiateCall}
              disabled={!phoneNumber}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-2 transition-all active:scale-98"
            >
              <Phone className="w-5 h-5" />
              <span>Place Google Voice Call</span>
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/30 flex items-center justify-center space-x-2 transition-all active:scale-98"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Call</span>
            </button>
          )}
        </div>
      </div>

      {/* Screen Pop Modal for Inbound/Outbound Caller */}
      {showScreenPop && matchedContact && (
        <ScreenPopModal contact={matchedContact} onClose={() => setShowScreenPop(false)} />
      )}
    </>
  );
}
