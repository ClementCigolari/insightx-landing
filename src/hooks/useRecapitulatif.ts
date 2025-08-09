"use client";

import { useContext } from "react";
import { RecapitulatifContext } from "@/context/RecapitulatifContext";

export function useRecapitulatif() {
  const context = useContext(RecapitulatifContext);

  if (!context) {
    throw new Error("useRecapitulatif doit être utilisé à l'intérieur d’un <RecapitulatifProvider>");
  }

  return context;
}