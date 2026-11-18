"use client";

import React, { createContext, useContext, useState } from "react";
import { CURRENT_SESSIONS, SessionUser } from "@/lib/rbac";

interface AppContextType {
  currentUser: SessionUser;
  setCurrentUser: (user: SessionUser) => void;
  isDialerOpen: boolean;
  setIsDialerOpen: (open: boolean) => void;
  dialTargetNumber: string;
  dialNumber: (num: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SessionUser>(CURRENT_SESSIONS.founder);
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [dialTargetNumber, setDialTargetNumber] = useState("");

  const dialNumber = (num: string) => {
    setDialTargetNumber(num);
    setIsDialerOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isDialerOpen,
        setIsDialerOpen,
        dialTargetNumber,
        dialNumber,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
