"use client";

import { useEffect, useState } from "react";
import ModifierInfos from "@/components/ModifierInfos";

type UserLite = {
  email?: string;
  adresse?: string;
};

export default function PageModifierInfos() {
  const [user, setUser] = useState<UserLite | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("insightx_user") : null;
    try {
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  }, []);

  if (user === null) {
    return <div className="max-w-xl mx-auto px-4 py-6 text-white">Chargement…</div>;
  }

  if (!user.email) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 text-white">
        <h1 className="text-2xl font-semibold mb-2">Modifier mes informations</h1>
        <p className="text-zinc-300">Connecte-toi pour accéder à cette page.</p>
      </div>
    );
  }

  // ✅ Normalise les champs pour matcher le type attendu par ModifierInfos
  const normalizedUser = {
    email: user.email ?? "",
    adresse: user.adresse ?? "",
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4 text-white">Modifier mes informations</h1>
      <ModifierInfos user={normalizedUser} />
    </div>
  );
}