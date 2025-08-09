"use client";

import { useEffect, useState } from "react";
import { formatDateFR, formatDateTimeFR } from "@/lib/dateUtils";
import Link from "next/link";

interface DonneesCompte {
  nom: string;
  prenom: string;
  email: string;
  date_naissance: string;
  adresse: string;
  formule_active: string;
  ligues_choisies: string[];
  options_supplementaires: string[];
  date_inscription: string;
  prochain_paiement: string;
}

export default function ComptePage() {
  const [donnees, setDonnees] = useState<DonneesCompte | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = localStorage.getItem("insightx_user");
      if (!user) return;

      const { email } = JSON.parse(user);
      if (!email) return;

      try {
        const res = await fetch(`/api/mon-compte?email=${email}`);
        const data = await res.json();

        if (data.success) {
          setDonnees(data.data);
        }
      } catch (error) {
        console.error("Erreur récupération compte :", error);
      }
    };

    fetchData();
  }, []);

  if (!donnees) {
    return <div className="text-white">Chargement...</div>;
  }

  const getFormattedPlanName = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "decouverte":
        return "Découverte";
      case "ultra":
        return "Ultra";
      case "premium":
        return "Premium";
      case "passion":
        return "Passion";
      default:
        return plan; // ou "Formule inconnue" si tu veux sécuriser
    }
  };

  const handleSuspendAccount = async () => {
    const user = JSON.parse(localStorage.getItem("insightx_user") || "{}");
  
    const response = await fetch("/api/suspendre-compte", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    });
  
    if (response.ok) {
      alert("Votre demande de suspension a bien été envoyée. Elle prendra effet à la date anniversaire de votre abonnement mensuel.");
    } else {
      alert("Une erreur est survenue. Merci de réessayer ou de nous contacter.");
    }
  };

  return (
    <div className="text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Mon compte</h1>

      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-xl">
        <h2 className="text-lg font-semibold mb-2">Informations personnelles</h2>
        <p><strong>Nom :</strong> {donnees.nom}</p>
        <p><strong>Prénom :</strong> {donnees.prenom}</p>
        <p><strong>Email :</strong> {donnees.email}</p>
        <p>Date de naissance : {formatDateFR(donnees.date_naissance)}</p>
        <p><strong>Adresse :</strong> {donnees.adresse}</p>
        <p>Date d'inscription : {formatDateTimeFR(donnees.date_inscription)}</p>
        <p>Prochain paiement : {formatDateFR(donnees.prochain_paiement)}</p>

        <div className="flex gap-4 mt-4">
          <Link
            href="/espace-client/compte/modifier-infos"
            className="bg-blue-600 text-white px-4 py-2 rounded text-center"
          >
            Modifier mes informations
          </Link>
        </div>

        <div className="mt-6">
         <h2 className="text-lg font-semibold mb-2">Formule actuelle</h2>

         <p className="mb-3">🧠 {getFormattedPlanName(donnees.formule_active)}</p>

          <Link
             href="/espace-client/compte/modifier-formule"
             className="bg-white text-black px-4 py-2 rounded inline-block"
          >
             Changer de formule
          </Link>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Compte</h2>
          <button
            type="button"
            onClick={handleSuspendAccount}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition mt-2"
          >
            Suspendre mon compte
          </button>
        </div>
      </div>
    </div>
  );
}