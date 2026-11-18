"use client";

import React from "react";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import FloatingDialer from "@/components/dialer/FloatingDialer";
import { AppProvider, useAppContext } from "@/context/AppContext";

function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser, setCurrentUser, isDialerOpen, setIsDialerOpen, dialTargetNumber } = useAppContext();

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 antialiased flex flex-col md:flex-row">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Application Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Header
          currentUser={currentUser}
          onUserChange={setCurrentUser}
          onToggleDialer={() => setIsDialerOpen(!isDialerOpen)}
          isDialerOpen={isDialerOpen}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

      {/* Global Floating Google Voice / WebRTC Softphone Dialer */}
      <FloatingDialer
        isOpen={isDialerOpen}
        onClose={() => setIsDialerOpen(false)}
        currentUser={currentUser}
        externalDialNumber={dialTargetNumber}
      />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>DigitalX Solutions | Employee CRM & Google Voice Operations Platform</title>
        <meta
          name="description"
          content="Production-ready Employee CRM and Google Voice Telephony Operations Platform for DigitalX Solutions."
        />
      </head>
      <body>
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
