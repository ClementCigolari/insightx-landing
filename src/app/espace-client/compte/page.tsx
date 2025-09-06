"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatDateFR, formatDateTimeFR } from "@/lib/dateUtils";
import { Mail, CalendarDays, User2, MapPin, CreditCard, Shield, PauseCircle } from "lucide-react";

type DonneesCompte = {
  nom: string;
  prenom: string;
  email: string;
  date_naissance: string;
  adresse: string;
  formule_active: string;          // decouverte | passion | premium | ultra
  ligues_choisies: string[];
  options_supplementaires: string[];
  date_inscription: string;
  prochain_paiement: string;
};

export default function ComptePage() {
  const [donnees, setDonnees] = useState<DonneesCompte | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem("insightx_user");
        if (!userStr) throw new Error("Aucun utilisateur en session.");
        const { email } = JSON.parse(userStr);
        if (!email) throw new Error("Email non trouvé.");

        const res = await fetch(`/api/mon-compte?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (!data?.success) throw new Error("Réponse invalide.");

        setDonnees(data.data as DonneesCompte);
      } catch {
        setErr("Impossible de charger votre compte.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const planLabel = useMemo(() => {
    if (!donnees) return "";
    switch ((donnees.formule_active || "").toLowerCase()) {
      case "decouverte": return "Découverte";
      case "passion":    return "Passion";
      case "premium":    return "Premium";
      case "ultra":      return "Ultra";
      default:           return donnees.formule_active || "—";
    }
  }, [donnees]);

  const handleSuspendAccount = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("insightx_user") || "{}");
      const response = await fetch("/api/suspendre-compte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      if (response.ok) {
        alert(
          "✅ Votre demande de suspension est enregistrée.\nElle prendra effet à la date anniversaire de votre abonnement mensuel."
        );
      } else {
        alert("❌ Une erreur est survenue. Merci de réessayer ou de nous contacter.");
      }
    } catch {
      alert("❌ Une erreur est survenue. Merci de réessayer.");
    }
  };

  /* ---------- UI states ---------- */

  if (loading) {
    return (
      <section className="px-6 py-10 text-white">
        <Header />
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse">
          <div className="h-6 w-48 bg-white/10 rounded mb-4" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="h-24 bg-white/10 rounded" />
            <div className="h-24 bg-white/10 rounded" />
          </div>
          <div className="h-10 w-56 bg-white/10 rounded mt-6" />
        </div>
      </section>
    );
  }

  if (err || !donnees) {
    return (
      <section className="px-6 py-10 text-white">
        <Header />
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-6 text-red-200">
          {err || "Erreur inconnue."}
        </div>
      </section>
    );
  }

  /* ---------- Main ---------- */

  return (
    <section className="px-6 py-10 text-white">
      <Header />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Col 1 : Infos personnelles */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
            <User2 size={18} className="opacity-80" />
            Informations personnelles
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <InfoRow icon={<User2 size={16} />} label="Nom" value={`${donnees.nom}`} />
            <InfoRow icon={<User2 size={16} />} label="Prénom" value={`${donnees.prenom}`} />
            <InfoRow icon={<Mail size={16} />} label="E-mail" value={donnees.email} copyable />
            <InfoRow icon={<CalendarDays size={16} />} label="Date de naissance" value={formatDateFR(donnees.date_naissance)} />
            <InfoRow icon={<MapPin size={16} />} label="Adresse" value={donnees.adresse} className="sm:col-span-2" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/espace-client/compte/modifier-infos"
              className="inline-flex items-center justify-center rounded-xl bg-white text-black px-4 py-3 font-semibold hover:opacity-90"
            >
              Modifier mes informations
            </Link>
          </div>
        </div>

        {/* Col 2 : Abonnement */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
            <CreditCard size={18} className="opacity-80" />
            Mon abonnement
          </h2>

          <div className="space-y-3 text-sm">
            <p>
              <span className="text-white/70">Formule :</span>{" "}
              <span className="font-semibold">{planLabel}</span>
            </p>
            <p>
              <span className="text-white/70">Inscription :</span>{" "}
              <span className="font-semibold">{formatDateTimeFR(donnees.date_inscription)}</span>
            </p>
            <p>
              <span className="text-white/70">Prochain paiement :</span>{" "}
              <span className="font-semibold">{formatDateFR(donnees.prochain_paiement)}</span>
            </p>
          </div>

          {/* Ligues & options */}
          <div className="mt-5">
            {donnees.ligues_choisies?.length > 0 && (
              <>
                <p className="text-white/70 text-sm mb-2">Ligues choisies</p>
                <div className="flex flex-wrap gap-2">
                  {donnees.ligues_choisies.map((l) => (
                    <span key={l} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs">
                      {l}
                    </span>
                  ))}
                </div>
              </>
            )}

            {donnees.options_supplementaires?.length > 0 && (
              <>
                <p className="text-white/70 text-sm mt-4 mb-2">Options</p>
                <div className="flex flex-wrap gap-2">
                  {donnees.options_supplementaires.map((o) => (
                    <span key={o} className="rounded-full border border-emerald-400/20 bg-emerald-500/10 text-emerald-200 px-3 py-1 text-xs">
                      {o}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/espace-client/compte/modifier-formule"
              className="inline-flex items-center justify-center rounded-xl bg-white text-black px-4 py-3 font-semibold hover:opacity-90"
            >
              Changer de formule
            </Link>

            <button
              type="button"
              onClick={handleSuspendAccount}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/90 text-white px-4 py-3 font-semibold hover:bg-red-500"
            >
              <PauseCircle size={18} />
              Suspendre mon compte
            </button>

            <p className="mt-1 text-[12px] text-white/60 inline-flex items-center gap-2">
              <Shield size={14} className="opacity-70" />
              Paiements sécurisés via Stripe · Données protégées (RGPD)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- UI bits ---------- */

function Header() {
  return (
    <div className="mb-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
        Mon compte
      </div>
      <h1 className="mt-2 text-3xl font-extrabold">Paramètres & Abonnement</h1>
      <div
        aria-hidden
        className="mt-3 h-10 w-full rounded-full bg-gradient-to-r from-emerald-400/10 via-white/5 to-emerald-400/10 blur-xl"
      />
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  copyable,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  copyable?: boolean;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/5 p-3 ${className}`}>
      <p className="text-[11px] uppercase tracking-wide text-white/60 flex items-center gap-2">
        {icon} {label}
      </p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <p className="font-medium">{value || "—"}</p>
        {copyable && (
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(value)}
            className="text-xs rounded-lg border border-white/10 bg-white/10 px-2 py-1 hover:bg-white/15"
            title="Copier"
          >
            Copier
          </button>
        )}
      </div>
    </div>
  );
}