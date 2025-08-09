"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCheckout } from "@/context/CheckoutContext";
import { useMemo } from "react";
import { useCallback } from "react";


const getPriceText = (formule: string, options: string[] = []) => {
  let base = 0;
  let total = 0;
  let description = "";

  switch (formule) {
    case "decouverte":
      base = 4.99;
      description = "formule Découverte";
      total = base;
      break;

    case "passion":
      base = 9.99;
      description = "formule Passion";
      total = base;
      if (options.includes("europe")) {
        total += 5;
        description += " + Europe";
      }
      break;

    case "premium":
      base = 19.99;
      description = "formule Premium";
      total = base;
      if (options.includes("europe")) {
        total += 5;
        description += " + Europe";
      }
      const autres = options.filter((opt) => opt !== "europe");
      if (autres.length > 0) {
        total += autres.length * 5;
        description += ` + ${autres.length} championnat${autres.length > 1 ? "s" : ""}`;
      }
      break;

    case "ultra":
      base = 49.99;
      description = "formule Ultra";
      total = base;
      if (options.length > 0) {
        total += options.length * 5;
        description += ` + ${options.length} championnat${options.length > 1 ? "s" : ""}`;
      }
      break;

    default:
      return "Formule inconnue";
  }

  return `${total.toFixed(2)}€ / mois (${description})`;
};

export default function InscriptionPage() {
  const router = useRouter();
  const { setDonneesClient, setPriceIds } = useCheckout();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [dateNaissance, setDateNaissance] = useState<Date | null>(null);
  const [adresse, setAdresse] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [mdpConfirm, setMdpConfirm] = useState("");
  const [erreurEmail, setErreurEmail] = useState("");
  const [erreurMdp, setErreurMdp] = useState("");
  const [recapTexte, setRecapTexte] = useState<string | null>("Chargement du récapitulatif...");
  const [championnatsSupp, setChampionnatsSupp] = useState<string[]>([]);
  const [formule, setFormule] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);

  const leagueIdToName = useMemo(
    () => ({
      "FR-L1": "Ligue 1",
      "FR-CDF": "Coupe de France",
      "UK-PL": "Premier League",
      "UK-CH": "Championship",
      "UK-FAC": "FA Cup",
      "UK-CC": "Carabao Cup",
      "ES-L1": "La Liga",
      "ES-L2": "La Liga 2",
      "ES-CDR": "Copa del Rey",
      "IT-A": "Serie A",
      "IT-B": "Serie B",
      "IT-CI": "Coppa Italia",
      "DE-BUN": "Bundesliga",
      "NL-ERE": "Eredivisie",
      "PT-LP": "Liga Portugal",
      "BE-PL": "Pro League",
      "AT-ADM": "Admiral Bundesliga",
      "SE-ALL": "Allsvenskan",
      "CH-SL": "Super League",
      "DK-SUP": "Superliga",
      "NO-ELI": "Eliteserien",
      "SCO-PRE": "Premiership",
      "PL-EKS": "Ekstraklasa",
      "RU-PL": "Premier League (Russie)",
      "UA-PL": "Premier League (Ukraine)",
      "HR-HNL": "1. HNL",
    }),
    []
  );
  
  const getLeagueName = useCallback(
    (id?: string): string => {
      if (!id) return "non spécifié";
      if (id === "europe") return "Europe";
      return leagueIdToName[id as keyof typeof leagueIdToName] ?? id;
    },
    [leagueIdToName]
  );
  
  useEffect(() => {
    const recapFromStorage = localStorage.getItem("insightx_recap");
    if (!recapFromStorage) {
      setRecapTexte("Aucun récapitulatif disponible.");
      return;
    }
  
    try {
      const recap = JSON.parse(recapFromStorage);
      const { formule, league, options = [] } = recap as {
        formule: string;
        league?: string;
        options?: string[];
      };
  
      setFormule(formule);
      setOptions(options);
  
      const formuleNom: Record<string, string> = {
        decouverte: "Découverte",
        passion: "Passion",
        premium: "Premium",
        ultra: "Ultra",
      };
  
      const championnatTexte =
        formule === "ultra"
          ? "Ligue 1, Premier League, Serie A, Liga, Bundesliga, Coupes d'Europe, Compétitions internationales"
          : formule === "premium"
          ? "Ligue 1, Premier League, Serie A, Liga, Bundesliga"
          : getLeagueName(league);
  
      const optionsTexte =
        options.length > 0
          ? options.map((opt: string) => getLeagueName(opt)).join(", ")
          : "Sans engagement";
  
      const texte =
        `✅ ${formuleNom[formule] || "Formule inconnue"}\n` +
        `📌 Championnat : ${championnatTexte}\n` +
        `📦 Option : ${optionsTexte}\n` +
        `💰 Prix : ${getPriceText(formule, options)}`;
  
      setRecapTexte(texte);
  
      if (formule === "premium" || formule === "ultra") {
        const supp = options.filter((opt: string) => opt !== "europe");
        setChampionnatsSupp(supp);
      }
    } catch (e) {
      console.error("Erreur parsing récapitulatif :", e);
      setRecapTexte("Erreur lors du chargement du récapitulatif.");
    }
  }, [getLeagueName]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErreurEmail("");
    setErreurMdp("");

    let hasError = false;

    if (email !== emailConfirm) {
      setErreurEmail("❌ Les adresses e-mail ne correspondent pas.");
      hasError = true;
    }

    if (motDePasse !== mdpConfirm) {
      setErreurMdp("❌ Les mots de passe ne correspondent pas.");
      hasError = true;
    }

    if (hasError) return;

// ✅ Conversion date au format YYYY-MM-DD
const formatDateToYMD = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formattedDateNaissance = dateNaissance ? formatDateToYMD(dateNaissance) : null;

// ⏺️ Étape 1 : enregistrer les données dans le contexte global
setDonneesClient({
  nom,
  prenom,
  email,
  dateNaissance: formattedDateNaissance,
  adresse,
  motDePasse,
});

localStorage.setItem("insightx_prenom", prenom);

// ⏺️ Étape 2 : debug optionnel
console.log("✅ Données client sauvegardées dans le contexte.");
    
    // 💳 Génération des ID Stripe selon la formule et les options
    const priceIds: string[] = [];
    
    if (formule === "decouverte") {
      priceIds.push("price_1Resk4BuNwbO8kuzId3iSlyO");
    } else if (formule === "passion") {
      priceIds.push("price_1ResneBuNwbO8kuznLw6dCoj");
    } else if (formule === "premium") {
      priceIds.push("price_1ResuEBuNwbO8kuzv8lDsMvx");
    } else if (formule === "ultra") {
      priceIds.push("price_1RevGqBuNwbO8kuz5REGa1Rk");
    }
    
    if (options.includes("europe")) {
      priceIds.push("price_1ResqUBuNwbO8kuzLmIpzGRq");
    }
    
    const autresChampionnat = options.filter((opt) => opt !== "europe");
    for (let i = 0; i < autresChampionnat.length; i++) {
      priceIds.push("price_1RevBnBuNwbO8kuz5pfMyrw9");
    }
    
    console.log("💳 IDs à facturer :", priceIds);
     setPriceIds(priceIds); // ⬅️ Contexte global

     // 🔁 Récupération du recap
     const recap = JSON.parse(localStorage.getItem("insightx_recap") || "{}");
     
     // 🗂️ Enregistrement dans le localStorage avec le mot de passe 
     localStorage.setItem("insightx_client", JSON.stringify({
       nom,
       prenom,
       email,
       dateNaissance: formattedDateNaissance, // ✅ remplace l’ancien "dateNaissance"
       adresse,
       mot_de_passe: motDePasse,
       formule: recap.formule || null,
       ligues_choisies: recap.league ? [recap.league] : [],
       options_supplementaires: recap.options || [],
     }));
     
     router.push("/paiement");
  };

  const champStyle =
    "border rounded-lg px-4 py-2 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700";

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md mt-10 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Création de votre espace Insight-X</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom et Prénom */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium">Nom</label>
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required className={champStyle} />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">Prénom</label>
            <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required className={champStyle} />
          </div>
        </div>

        {/* Email */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium">Adresse e-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={champStyle} />
            {erreurEmail && <p className="text-red-600 text-sm mt-1">{erreurEmail}</p>}
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">Confirmer e-mail</label>
            <input type="email" value={emailConfirm} onChange={(e) => setEmailConfirm(e.target.value)} required className={champStyle} />
          </div>
        </div>

        {/* Date de naissance */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium mb-1 text-white">Date de naissance</label>
          <div className="relative">
            <DatePicker
              selected={dateNaissance}
              onChange={(date: Date | null) => setDateNaissance(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="JJ/MM/AAAA"
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxDate={new Date()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
            <FaRegCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Adresse */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">Adresse complète</label>
          <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} required className={champStyle} />
        </div>

        {/* Mot de passe */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium">Mot de passe</label>
            <input type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required className={champStyle} />
            {erreurMdp && <p className="text-red-600 text-sm mt-1">{erreurMdp}</p>}
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">Confirmer mot de passe</label>
            <input type="password" value={mdpConfirm} onChange={(e) => setMdpConfirm(e.target.value)} required className={champStyle} />
          </div>
        </div>

        {/* Récapitulatif */}
<div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-6">
  <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Récapitulatif</h2>

  {recapTexte ? (
    <>
      {recapTexte.split("\n").map((line, index) => (
        <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
          {line}
        </p>
      ))}

      {championnatsSupp.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">📚 Championnats supplémentaires :</p>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
            {championnatsSupp.map((champ, i) => (
              <li key={i}>{getLeagueName(champ)}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  ) : (
    <p className="italic text-gray-500 dark:text-gray-400">Chargement du récapitulatif...</p>
  )}
</div>

        {/* Bouton */}
        <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-xl hover:bg-gray-800">
          Procéder au paiement
        </button>
      </form>
    </div>
  );
}