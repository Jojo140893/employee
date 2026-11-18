"use client";

import React from "react";
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, CheckCircle2, Award, TrendingUp } from "lucide-react";

interface KpiCardsProps {
  kpis: {
    totalCalls: number;
    inboundCalls: number;
    outboundCalls: number;
    completedCalls: number;
    missedCalls: number;
    answerRate: number;
    avgDurationSeconds: number;
    totalTalkTimeMinutes: number;
    totalContacts: number;
    activeAgents: number;
  };
}

export default function KpiCards({ kpis }: KpiCardsProps) {
  const cards = [
    {
      title: "Total Calls (Google Voice)",
      value: kpis.totalCalls,
      sub: `${kpis.inboundCalls} Inbound • ${kpis.outboundCalls} Outbound`,
      icon: Phone,
      color: "bg-blue-600",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      title: "Call Answer Rate",
      value: `${kpis.answerRate}%`,
      sub: `${kpis.missedCalls} Missed Calls Logged`,
      icon: CheckCircle2,
      color: "bg-emerald-600",
      textColor: "text-emerald-600",
      bgLight: "bg-emerald-50",
    },
    {
      title: "Average Call Duration",
      value: `${Math.floor(kpis.avgDurationSeconds / 60)}m ${kpis.avgDurationSeconds % 60}s`,
      sub: `${kpis.totalTalkTimeMinutes} mins Total Talk Time`,
      icon: Clock,
      color: "bg-purple-600",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
    },
    {
      title: "CRM Leads & Contacts",
      value: kpis.totalContacts,
      sub: `${kpis.activeAgents} Agents Online Today`,
      icon: TrendingUp,
      color: "bg-amber-600",
      textColor: "text-amber-600",
      bgLight: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`w-9 h-9 rounded-xl ${card.bgLight} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</div>
              <div className="text-xs text-slate-400 font-medium mt-1">{card.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
