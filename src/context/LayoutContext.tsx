"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CredentialDraft {
  provider: string;
  accountIdentifier: string;
  accessKey: string;
  category: string;
  notes: string;
}

export interface CredentialRecord extends CredentialDraft {
  id: string;
  createdAt: number;
}

interface LayoutContextType {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isCredentialPanelOpen: boolean;
  openCredentialPanel: () => void;
  closeCredentialPanel: () => void;
  addCredential: (credential: CredentialDraft) => void;
  credentials: CredentialRecord[];
}

const LayoutContext = createContext<LayoutContextType>({
  isSidebarCollapsed: false,
  toggleSidebar: () => {},
  isCredentialPanelOpen: false,
  openCredentialPanel: () => {},
  closeCredentialPanel: () => {},
  addCredential: () => {},
  credentials: [],
});

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCredentialPanelOpen, setIsCredentialPanelOpen] = useState(false);
  const [credentials, setCredentials] = useState<CredentialRecord[]>([]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const openCredentialPanel = () => {
    setIsCredentialPanelOpen(true);
  };

  const closeCredentialPanel = () => {
    setIsCredentialPanelOpen(false);
  };

  const addCredential = (credential: CredentialDraft) => {
    setCredentials((prev) => [
      {
        ...credential,
        id: `cred-${Date.now()}-${prev.length + 1}`,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  };

  return (
    <LayoutContext.Provider
      value={{
        isSidebarCollapsed,
        toggleSidebar,
        isCredentialPanelOpen,
        openCredentialPanel,
        closeCredentialPanel,
        addCredential,
        credentials,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
