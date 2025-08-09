"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// 1. Types pour les données du client
interface DonneesClient {
  nom: string;
  prenom: string;
  email: string;
  dateNaissance: string | null;
  adresse: string;
  motDePasse: string;
}

// 2. Type global pour le contexte
interface CheckoutContextType {
  formule: string;
  setFormule: (value: string) => void;
  options: string[];
  setOptions: (value: string[]) => void;
  donneesClient: DonneesClient;
  setDonneesClient: (value: DonneesClient) => void;
  priceIds: string[];
  setPriceIds: (value: string[]) => void;
}

// 3. Contexte vide au départ
const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

// 4. Provider
export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [formule, setFormule] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [donneesClient, setDonneesClient] = useState<DonneesClient>({
    nom: "",
    prenom: "",
    email: "",
    dateNaissance: null,
    adresse: "",
    motDePasse: "",
  });
  const [priceIds, setPriceIds] = useState<string[]>([]);

  return (
    <CheckoutContext.Provider
      value={{ formule, setFormule, options, setOptions, donneesClient, setDonneesClient, priceIds, setPriceIds }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

// 5. Hook d'accès au contexte
export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error("useCheckout doit être utilisé dans <CheckoutProvider>");
  return context;
}