"use client";

import { createContext, useState, ReactNode } from "react";

type RecapitulatifData = {
  formule: string;
  plan: string;
  league: string;
  options?: string[];
  prix?: string; // 👈 AJOUTE cette ligne
};

type RecapitulatifContextType = {
  recapitulatif: RecapitulatifData | null;
  setRecapitulatif: (data: RecapitulatifData) => void;
};

export const RecapitulatifContext = createContext<RecapitulatifContextType | undefined>(undefined);

export const RecapitulatifProvider = ({ children }: { children: ReactNode }) => {
  const [recapitulatif, setRecapitulatif] = useState<RecapitulatifData | null>(null);

  return (
    <RecapitulatifContext.Provider value={{ recapitulatif, setRecapitulatif }}>
      {children}
    </RecapitulatifContext.Provider>
  );
};