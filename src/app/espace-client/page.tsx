"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowRight, Trophy, Globe, User, BarChart2 } from "lucide-react";

type InsightUser = {
  prenom: string;
  formule: string;
  options: string[];
  ligue: string;
};

const CHAMPIONNATS_MAP: Record<string, string> = {
  "FR-L1": "Ligue 1",
  "FR-CDF": "Coupe de France",
  "UK-PL": "Premier League",
  "UK-FAC": "FA Cup",
  "ES-L1": "La Liga",
  "ES-CDR": "Copa del Rey",
  "IT-A": "Serie A",
  "IT-CI": "Coppa Italia",
  "DE-BUN": "Bundesliga",
  "NL-ERE": "Eredivisie",
  "PT-LP": "Liga Portugal",
  "BE-PL": "Pro League",
  europe: "Europe",
};

function cn(...cls: Array<string | false | undefined | null>) {
  return cls.filter(Boolean).join(" ");
}

function capitalize(val: unknown): string {
  if (typeof val === "string") return val ? val.charAt(0).toUpperCase() + val.slice(1) : "";
  if (val == null) return "";
  const s = String(val);
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

export default function EspaceClient() {
  const router = useRouter();
  const [prenom, setPrenom] = useState<string>("");
  const [formule, setFormule] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [ligue, setLigue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("insightx_user");
      if (!storedUser) {
        router.push("/connexion");
        return;
      }
      const userData: Partial<InsightUser> = JSON.parse(storedUser);
      if (!userData || !userData.prenom || !userData.formule) {
        router.push("/connexion");
        return;
      }
      setPrenom(userData.prenom);
      setFormule(userData.formule);
      setOptions(Array.isArray(userData.options) ? userData.options : []);
      setLigue(userData.ligue || "Non précisée");
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération du user :", err);
      router.push("/connexion");
    }
  }, [router]);

  const optionsArray = Array.isArray(options) ? options : [];
  const nonEuropeOptions = useMemo(
    () => optionsArray.filter((o) => o !== "europe"),
    [optionsArray]
  );

  const formuleLower = (formule || "").toLowerCase();
  const badge = useMemo(() => {
    switch (formuleLower) {
      case "decouverte":
        return { label: "Découverte", bg: "bg-emerald-400", glow: "shadow-[0_0_20px_rgba(16,185,129,.35)]" };
      case "passion":
        return { label: "Passion", bg: "bg-blue-400", glow: "shadow-[0_0_20px_rgba(59,130,246,.35)]" };
      case "premium":
        return { label: "Premium", bg: "bg-violet-400", glow: "shadow-[0_0_20px_rgba(139,92,246,.40)]" };
      case "ultra":
        return { label: "Ultra", bg: "bg-amber-400", glow: "shadow-[0_0_20px_rgba(245,158,11,.35)]" };
      default:
        return { label: capitalize(formule), bg: "bg-white/20", glow: "" };
    }
  }, [formuleLower, formule]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-white">
        <div className="h-10 w-64 bg-white/10 rounded-lg animate-pulse mb-6" />
        <div className="h-28 w-full bg-white/5 rounded-2xl border border-white/10 animate-pulse" />
      </div>
    );
  }

  return (
    <main className="relative mx-auto max-w-5xl px-4 py-10 text-white">
      {/* halo top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-6 h-24 bg-gradient-to-b from-emerald-400/10 via-white/10 to-transparent blur-2xl"
      />

      {/* Header bienvenue */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
          <Shield size={14} className="opacity-70" />
          Espace client
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold">
          👋 Bienvenue <span className="text-white/90">{prenom}</span>
        </h1>
        <p className="mt-1 text-white/70">Ici, chaque match devient lisible.</p>
      </header>

      {/* Bandeau formule */}
      <section className="mb-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-white/70">Formule actuelle</p>
            <div className="mt-1 flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-black",
                  badge.bg,
                  badge.glow
                )}
              >
                {badge.label}
              </span>
              {["decouverte", "passion"].includes(formuleLower) && ligue && (
                <span className="text-sm text-white/80">
                  Championnat :{" "}
                  <strong className="text-white">
                    {CHAMPIONNATS_MAP[ligue] || capitalize(ligue)}
                  </strong>
                </span>
              )}
              {optionsArray.length > 0 && (
                <span className="text-sm text-white/80">
                  Options :{" "}
                  <strong className="text-white">
                    {optionsArray
                      .map((code) => CHAMPIONNATS_MAP[code] || capitalize(code))
                      .join(", ")}
                  </strong>
                </span>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex flex-wrap items-center gap-2">
            <QuickLink href="/espace-client/championnats" icon={<Trophy size={16} />} label="Mes championnats" />
            {optionsArray.includes("europe") || formuleLower === "ultra" ? (
              <QuickLink href="/espace-client/europe" icon={<Globe size={16} />} label="Europe" />
            ) : null}
            <QuickLink href="/espace-client/compte" icon={<User size={16} />} label="Mon compte" />
            <QuickLink href="/espace-client/rapport" icon={<BarChart2 size={16} />} label="Stats" />
          </div>
        </div>
      </section>

      {/* Cartes contenu selon formule */}
      <div className="grid grid-cols-1 gap-6">
        {/* Découverte */}
        {formuleLower === "decouverte" && (
          <Card title="🎁 Contenu de ta formule Découverte">
            <UL>
              <LI>
                ⚽️ Tu as accès à :{" "}
                <b className="text-emerald-300">{CHAMPIONNATS_MAP[ligue] || capitalize(ligue)}</b>
              </LI>
              <LI>
                📊 <b>1 analyse immersive</b> pour chaque jour clé où des matchs de{" "}
                <b className="text-emerald-300">{CHAMPIONNATS_MAP[ligue] || capitalize(ligue)}</b> sont programmés (ven/sam/dim).
              </LI>
              <LI>⚡️ Fil Rouge inclus uniquement si le match concerne ce championnat.</LI>
            </UL>
            {!ligue || ligue === "Non précisée" ? (
              <div className="mt-4 rounded-md border border-amber-400/30 bg-amber-500/10 p-3 text-amber-200 text-sm">
                ⚠️ Aucun championnat sélectionné.{" "}
                <Link className="underline hover:opacity-90" href="/espace-client/championnats">
                  Choisir maintenant
                </Link>
                .
              </div>
            ) : null}
          </Card>
        )}

        {/* Passion */}
        {formuleLower === "passion" && (
          <Card title="🎯 Contenu de ta formule Passion">
            <UL>
              <LI>
                ⚽️ Championnat suivi :{" "}
                <b className="text-emerald-300">{CHAMPIONNATS_MAP[ligue] || capitalize(ligue)}</b>
              </LI>
              <LI>
                📊 <b>Toutes les analyses immersives</b> pour chaque journée concernée.
              </LI>
              <LI>⚡️ Fil Rouge inclus uniquement si le match concerne ton championnat.</LI>
              {optionsArray.includes("europe") && (
                <LI>
                  🌍 Europe activée : analyses{" "}
                  <b className="text-white">Champions League</b>, <b className="text-white">Europa League</b>,{" "}
                  <b className="text-white">Conférence League</b> (depuis la phase de groupes).
                </LI>
              )}
            </UL>
          </Card>
        )}

        {/* Premium */}
        {formuleLower === "premium" && (
          <Card title="💎 Contenu de ta formule Premium">
            <UL>
              <LI>⚽️ Accès aux 5 grands championnats : L1, PL, Bundesliga, Liga, Serie A.</LI>
              <LI>📊 Toutes les analyses Insight-X pour chaque match.</LI>
              <LI>⚡️ Fil Rouge complet à chaque journée.</LI>
              {optionsArray.includes("europe") && (
                <LI>
                  🌍 Europe activée : analyses UCL / UEL / UECL (depuis la phase de groupes).
                </LI>
              )}
              {nonEuropeOptions.length > 0 && (
                <LI>
                  🏆 Championnats secondaires :{" "}
                  <b className="text-emerald-300">
                    {nonEuropeOptions
                      .map((c) => CHAMPIONNATS_MAP[c] || capitalize(c))
                      .join(", ")}
                  </b>
                </LI>
              )}
            </UL>
          </Card>
        )}

        {/* Ultra */}
        {formuleLower === "ultra" && (
          <Card title="🚀 Contenu de ta formule Ultra">
            <UL>
              <LI>⚽️ 5 grands championnats inclus : L1, PL, Bundesliga, Liga, Serie A.</LI>
              <LI>🌍 Europe incluse : UCL / UEL / UECL (phase de groupes ➜...).</LI>
              <LI>🏆 Internationaux inclus : CDM, Euro, CAN, Copa América, Nations League, CDM des clubs (hors qualifications).</LI>
              <LI>⚡️ Toutes les analyses, lives & Fil Rouge chaque journée.</LI>
              {nonEuropeOptions.length > 0 && (
                <LI>
                  🏆 Championnats secondaires :{" "}
                  <b className="text-emerald-300">
                    {nonEuropeOptions
                      .map((c) => CHAMPIONNATS_MAP[c] || capitalize(c))
                      .join(", ")}
                  </b>
                </LI>
              )}
            </UL>
          </Card>
        )}
      </div>

      {/* CTA bas de page */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/espace-client/championnats"
          className="rounded-xl bg-white text-black px-4 py-3 font-semibold hover:opacity-90 inline-flex items-center gap-2"
        >
          Accéder à mes championnats <ArrowRight size={16} />
        </Link>
        <Link
          href="/espace-client/rapport"
          className="rounded-xl border border-white/20 px-4 py-3 font-semibold text-white hover:bg-white/10 inline-flex items-center gap-2"
        >
          Voir mes stats <BarChart2 size={16} />
        </Link>
      </div>
    </main>
  );
}

/* ---------- UI helpers ---------- */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <div className="text-white/90">{children}</div>
    </section>
  );
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">{children}</ul>;
}
function LI({ children }: { children: React.ReactNode }) {
  return <li className="[&>b]:font-semibold">{children}</li>;
}

function QuickLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 transition"
    >
      {icon}
      {label}
    </Link>
  );
}