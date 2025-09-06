"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";

type State = "idle" | "loading" | "redirecting" | "error";

const getPriceText = (formule: string, options: string[] = []) => {
  let base = 0;
  let total = 0;
  let description = "";

  switch (formule) {
    case "decouverte":
      base = 4.99;
      description = "Découverte";
      total = base;
      break;
    case "passion":
      base = 9.99;
      description = "Passion";
      total = base + (options.includes("europe") ? 5 : 0);
      if (options.includes("europe")) description += " + Europe";
      break;
    case "premium":
      base = 19.99;
      description = "Premium";
      total = base + (options.includes("europe") ? 5 : 0) + options.filter(o => o !== "europe").length * 5;
      if (options.includes("europe")) description += " + Europe";
      if (options.filter(o => o !== "europe").length)
        description += ` + ${options.filter(o => o !== "europe").length} championnat(s)`;
      break;
    case "ultra":
      base = 49.99;
      description = "Ultra";
      total = base + options.length * 5;
      if (options.length) description += ` + ${options.length} championnat(s)`;
      break;
    default:
      return "—";
  }
  return `${total.toFixed(2)}€ / mois (${description})`;
};

export default function PaiementPage() {
  const router = useRouter();
  const { priceIds, donneesClient } = useCheckout();
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string>("Préparation du paiement…");

  // Petit récap depuis localStorage (si présent)
  const recap = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("insightx_recap") || "{}") as {
        formule?: string;
        league?: string;
        options?: string[];
      };
    } catch {
      return {};
    }
  }, []);

  const totalText = useMemo(
    () => (recap.formule ? getPriceText(recap.formule, recap.options || []) : "—"),
    [recap.formule, recap.options]
  );

  const launchCheckout = useCallback(async () => {
    if (!priceIds || priceIds.length === 0) {
      router.push("/inscription");
      return;
    }
    try {
      setState("loading");
      setMessage("Connexion sécurisée à Stripe…");
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceIds, client: donneesClient }),
      });

      const data = await res.json();
      if (data?.url) {
        setState("redirecting");
        setMessage("Redirection vers le paiement sécurisé…");
        window.location.href = data.url; // Stripe Checkout
      } else {
        throw new Error("Aucune URL de redirection retournée.");
      }
    } catch (err) {
      console.error(err);
      setState("error");
      setMessage("Oups, impossible de créer la session de paiement.");
    }
  }, [priceIds, donneesClient, router]);

  useEffect(() => {
    // auto-lancement
    launchCheckout();
  }, [launchCheckout]);

  return (
    <main className="relative min-h-[100dvh] bg-black text-white overflow-hidden">
      {/* halo de fond */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_-50%,rgba(34,197,94,.25),transparent)]"
      />
      <div className="flex items-center justify-center min-h-[100dvh] p-6">
        <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,.45)]">
          {/* header */}
          <div className="px-6 sm:px-8 pt-8 pb-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              Paiement sécurisé • Stripe
            </div>
            <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold">
              Redirection vers le paiement
            </h1>
            <p className="mt-2 text-white/70">
              On prépare ta session de paiement chiffrée. Tu vas être redirigé sur Stripe.
            </p>
          </div>

          {/* contenu */}
          <div className="px-6 sm:px-8 pb-8">
            {/* récap rapide */}
            {(recap.formule || recap.league) && (
              <div className="mb-6 rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                    Formule : <strong className="ml-1">{recap.formule}</strong>
                  </span>
                  {recap.league && (
                    <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                      Championnat : <strong className="ml-1">{recap.league}</strong>
                    </span>
                  )}
                  {totalText !== "—" && (
                    <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      Total : <strong className="ml-1">{totalText}</strong>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* status + spinner */}
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="h-5 w-5 rounded-full border-2 border-white/25 border-t-white animate-spin" />
              <p className="text-white/90">
                {message}
                {state === "redirecting" && " (quelques secondes…)"}
              </p>
            </div>

            {/* actions en cas d’erreur */}
            {state === "error" && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={launchCheckout}
                  className="rounded-xl bg-white px-5 py-3 font-semibold text-black hover:opacity-90"
                >
                  Réessayer le paiement
                </button>
                <div className="text-sm text-white/70">
                  Besoin d’aide ?{" "}
                  <a href="mailto:contact@insight-x.fr" className="underline">
                    contact@insight-x.fr
                  </a>
                </div>
              </div>
            )}

            {/* liens secondaires */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-white/60">
              <Link href="/inscription" className="underline underline-offset-2">
                Modifier mes informations
              </Link>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70">
                    <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4Zm0 2.18l7 3.11v4.71c0 4.64-3.05 8.95-7 10.19c-3.95-1.24-7-5.55-7-10.19V6.29l7-3.11ZM11 7v6h2V7h-2Zm0 8v2h2v-2h-2Z"/>
                  </svg>
                  Données protégées (RGPD)
                </span>
                <span className="inline-flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70">
                    <path fill="currentColor" d="M12 2a5 5 0 0 1 5 5v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5Zm3 8V7a3 3 0 1 0-6 0v3h6Z"/>
                  </svg>
                  Paiement 100% sécurisé via Stripe
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}