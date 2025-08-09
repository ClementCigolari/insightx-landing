"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";


export default function EspaceClient() {
  const [prenom, setPrenom] = useState("");
  const [formule, setFormule] = useState("");
  const [options, setOptions] = useState("");
  const [ligue, setLigue] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const optionsArray = Array.isArray(options) ? options : [options];

  const capitalize = (str: any) => {
    const value = String(str);
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("insightx_user");

      if (!storedUser) {
        router.push("/connexion");
        return;
      }

      const userData = JSON.parse(storedUser);
      if (!userData || !userData.prenom || !userData.formule) {
        router.push("/connexion");
        return;
      }

      setPrenom(userData.prenom);
      setFormule(userData.formule);
      setOptions(userData.options || []);
      setLigue(userData.ligue || "Non précisée");
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération du user :", err);
      router.push("/connexion");
    }
  }, []);

  if (loading) return <p className="text-center text-white py-10">Chargement de ton espace...</p>;

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

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      {/* Bloc de bienvenue */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Bienvenue {prenom} dans ton espace</h1>
        <p className="text-[18px] font-semibold text-gray-300 mt-1">Là où le jeu devient lisible.</p>
      </div>

      {/* Formule et options */}
      <div className="mb-6 border p-4 rounded-2xl bg-gray-900 border-gray-700">
        <h2 className="text-lg font-semibold mb-2">Formule actuelle</h2>
        <p className="mb-1">
          Formule : <span className="font-medium">{capitalize(formule)}</span>
        </p>

        {["decouverte", "passion"].includes(formule.toLowerCase()) && ligue && (
          <p className="mb-1">
            Ligue choisie :{" "}
            <span className="font-medium">
              {CHAMPIONNATS_MAP[ligue] || capitalize(ligue)}
            </span>
          </p>
        )}

        {Array.isArray(options) && options.length > 0 && (
          <p className="mb-1">
            Options activées :{" "}
            <span className="font-medium">
              {options
                .map((code: string) =>
                  capitalize(CHAMPIONNATS_MAP[code] || code)
                )
                .join(", ")}
            </span>
          </p>
        )}
      </div>

      {/* Bloc spécifique pour la formule Decouverte */}
      {formule.toLowerCase() === "decouverte" && (
  <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-700 shadow-md">
    <h2 className="text-xl font-bold text-white mb-3">🎁 Ce que contient ta formule <span className="text-blue-300">Découverte</span></h2>
    <ul className="list-disc list-inside text-white/90 space-y-2 text-base leading-relaxed">
      <li>
        ⚽️ <span className="ml-1">
          Tu as accès à : <span className="font-semibold text-blue-200">{CHAMPIONNATS_MAP[ligue] || capitalize(ligue)}</span>
        </span>
      </li>
      <li>
        📊 <span className="ml-1">
          Tu reçois <strong>1 analyse immersive</strong> pour chaque jour où des matchs de <span className="font-semibold text-blue-200">{CHAMPIONNATS_MAP[ligue] || capitalize(ligue)}</span> sont programmés.
        </span>
      </li>
      <li>
        ⚡️ <span className="ml-1">
          Accès au match Fil Rouge uniquement si celui-ci est dans le championnat choisi.
        </span>
      </li>
    </ul>
  </div>
)}

      {/* Bloc spécifique pour la formule Passion */}
{formule.toLowerCase() === "passion" && (
  <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-700 shadow-md">
    <h2 className="text-xl font-bold text-white mb-3">
      🎯 Ce que contient ta formule <span className="text-blue-300">Passion</span>
    </h2>
    <ul className="list-disc list-inside text-white/90 space-y-2 text-base leading-relaxed">
      <li>
        ⚽️ <span className="ml-1">
          Tu as accès à : <span className="font-semibold text-blue-200">{CHAMPIONNATS_MAP[ligue] || capitalize(ligue)}</span>
        </span>
      </li>
      <li>
        📊 <span className="ml-1">
          Tu reçois <strong>toutes les analyses immersives</strong> pour chaque jour où des matchs de <span className="font-semibold text-blue-200">{CHAMPIONNATS_MAP[ligue] || capitalize(ligue)}</span> sont programmés.
        </span>
      </li>
      <li>
        ⚡️ <span className="ml-1">Accès au match Fil Rouge uniquement si celui-ci est dans le championnat choisi.</span>
      </li>

      {/* Option Europe, seulement si activée */}
      {options.includes("europe") && (
        <li>
          🌍 <span className="ml-1">
            Accès à <strong>toutes les analyses</strong> de la <span className="font-semibold text-blue-200">Champions League</span>, <span className="font-semibold text-blue-200">Europa League</span> et <span className="font-semibold text-blue-200">Conférence League</span> (à partir de la phase de groupes).
          </span>
        </li>
      )}
    </ul>
  </div>
)}

      {/* Bloc spécifique pour la formule Premium */}
      {formule.toLowerCase() === "premium" && (
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-700 shadow-md">
          <h2 className="text-xl font-bold text-white mb-3">
            🎯 Ce que contient ta formule <span className="text-blue-300">Premium</span>
          </h2>
          <ul className="list-disc list-inside text-white/90 space-y-2 text-base leading-relaxed">
            <li>⚽️ <span className="ml-1">Accès aux 5 grands championnats européens (Ligue 1, Premier League, Bundesliga, Liga, Serie A)</span></li>
            <li>📊 <span className="ml-1">Toutes les analyses Insight-X pour chaque match.</span></li>
            <li>⚡️ <span className="ml-1">Accès complet au match Fil Rouge chaque journée.</span></li>
            
            {/* Option Europe, seulement si activée */}
      {options.includes("europe") && (
        <li>
          🌍 <span className="ml-1">
            Accès à <strong>toutes les analyses</strong> de la <span className="font-semibold text-blue-200">Champions League</span>, <span className="font-semibold text-blue-200">Europa League</span> et <span className="font-semibold text-blue-200">Conférence League</span> (à partir de la phase de groupes).
          </span>
        </li>
      )}

      {/* Option championnat supplémentaire, seulement si activée */}
{optionsArray.some(opt => opt !== "europe") && (
  <li>
    🏆 <span className="ml-1">
      Accès complémentaire à :{" "}
      <span className="font-semibold text-blue-200">
        {CHAMPIONNATS_MAP[optionsArray.find(opt => opt !== "europe")!] ??
          capitalize(optionsArray.find(opt => opt !== "europe")!)}
      </span>
    </span>
  </li>
)}
          </ul>
        </div>
      )}

      {/* Bloc spécifique pour la formule Ultra */}
      {formule.toLowerCase() === "ultra" && (
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-700 shadow-md">
          <h2 className="text-xl font-bold text-white mb-3">
            🎯 Ce que contient ta formule <span className="text-blue-300">Ultra</span>
          </h2>
          <ul className="list-disc list-inside text-white/90 space-y-2 text-base leading-relaxed">
            <li>⚽️ <span className="ml-1">Accès aux 5 grands championnats européens (Ligue 1, Premier League, Bundesliga, Liga, Serie A)</span></li>
            <li>🌍 <span className="ml-1">Europe incluses : Champions League, Europa League, Conférence League (A partir des phases de groupes).</span></li>
            <li>🏆 <span className="ml-1">Compétitions internationales incluses : Coupe du Monde, Euro, CAN, Copa América, Ligue des Nations, Coupe du Monde des Clubs (Hors phases de qualifications).</span></li>
            <li>⚡️ <span className="ml-1">Toutes les analyses, lives Insight-X et matchs Fil Rouge chaque journée.</span></li>

            {/* Option championnat supplémentaire, seulement si activée */}
{optionsArray.some(opt => opt !== "europe") && (
  <li>
    🏆 <span className="ml-1">
      Accès complémentaire à :{" "}
      <span className="font-semibold text-blue-200">
        {CHAMPIONNATS_MAP[optionsArray.find(opt => opt !== "europe")!] ??
          capitalize(optionsArray.find(opt => opt !== "europe")!)}
      </span>
    </span>
  </li>
)}
          </ul>
        </div>
      )}
    </div>
  );
}