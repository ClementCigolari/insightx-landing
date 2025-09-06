"use client";

import { useEffect, useState } from "react";
import ModifierInfos from "@/components/ModifierInfos";
import { Shield, Loader2 } from "lucide-react";

type UserLite = {
  email?: string;
  adresse?: string;
};

export default function PageModifierInfos() {
  const [user, setUser] = useState<UserLite | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("insightx_user")
          : null;
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <section className="px-6 py-10 text-white">
        <Header />
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse">
          <div className="h-6 w-56 bg-white/10 rounded mb-4" />
          <div className="space-y-3">
            <div className="h-10 bg-white/10 rounded" />
            <div className="h-10 bg-white/10 rounded" />
            <div className="h-10 bg-white/10 rounded" />
            <div className="h-10 bg-white/10 rounded" />
          </div>
          <div className="h-10 w-40 bg-white/10 rounded mt-6" />
        </div>
      </section>
    );
  }

  if (!user?.email) {
    return (
      <section className="px-6 py-10 text-white">
        <Header />
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
          <p className="text-white/80">
            Connecte-toi pour accéder à cette page.
          </p>
        </div>
      </section>
    );
  }

  // ✅ Normalise les champs pour le composant enfant
  const normalizedUser = {
    email: user.email ?? "",
    adresse: user.adresse ?? "",
  };

  return (
    <section className="px-6 py-10 text-white">
      <Header />
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
        <ModifierInfos user={normalizedUser} />
        <p className="mt-4 text-[12px] text-white/60 inline-flex items-center gap-2">
          <Shield size={14} className="opacity-70" />
          Données protégées (RGPD) • Modifications effectives immédiatement
        </p>
      </div>
    </section>
  );
}

/* ---------- Header cohérent avec le reste ---------- */
function Header() {
  return (
    <div className="mb-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
        Mon compte
      </div>
      <h1 className="mt-2 text-3xl font-extrabold">Modifier mes informations</h1>
      <div
        aria-hidden
        className="mt-3 h-10 w-full rounded-full bg-gradient-to-r from-emerald-400/10 via-white/5 to-emerald-400/10 blur-xl"
      />
    </div>
  );
}