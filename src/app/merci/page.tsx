"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MerciPage() {
  const [prenom, setPrenom] = useState("");

  useEffect(() => {
    const storedClient = localStorage.getItem("insightx_client");

    if (storedClient) {
      const clientData = JSON.parse(storedClient);

      // ✅ Force TOUJOURS le format tableau (robuste à tous les cas)
      clientData.ligues_choisies = Array.isArray(clientData.ligues_choisies)
  ? clientData.ligues_choisies.filter((e: string) => e.trim() !== "")
  : (clientData.ligues_choisies || "")
      .split(",")
      .map((e: string) => e.trim())
      .filter((e: string) => e !== "");

clientData.options_supplementaires = Array.isArray(clientData.options_supplementaires)
  ? clientData.options_supplementaires.filter((e: string) => e.trim() !== "")
  : (clientData.options_supplementaires || "")
      .split(",")
      .map((e: string) => e.trim())
      .filter((e: string) => e !== "");

      // ✅ Envoi des données à l’API
      fetch("/api/enregistrer-client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Échec de l'enregistrement");
          return res.json();
        })
        .then((data) => {
          console.log("✅ Client enregistré avec succès :", data);
          localStorage.removeItem("insightx_client");
        })
        .catch((err) => {
          console.error("❌ Erreur lors de l'enregistrement du client :", err);
        });

      if (clientData.prenom) {
        setPrenom(clientData.prenom);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold mb-4">
          🎉 Merci et bienvenue dans l’univers Insight-X{prenom ? `, ${prenom} !` : " !"}
        </h1>

        <p className="text-lg mb-6 text-gray-300">
          Ton abonnement est désormais <span className="text-green-400 font-semibold">actif</span>.
          <br />
          Connectes toi pour accéder à ton espace perso.
        </p>

        <div className="bg-[#111] border border-gray-700 rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-3 text-white">Et maintenant ?</h2>
          <ul className="text-left text-gray-400 space-y-2">
            <li>🎯 Tu fais désormais partie des initiés d’Insight-X</li>
            <li>📊 Les scénarios immersifs t’attendent, prêts à être décodés</li>
            <li>🧠 Prépare-toi à voir les matchs autrement. Radicalement autrement.</li>
          </ul>
        </div>

        <Link href="/">
          <button
            className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold shadow hover:bg-blue-500 transition duration-300"
          >
            🔙 Retour à l’accueil
          </button>
        </Link>

        <p className="italic text-sm text-gray-500 mt-4">
          “Chez Insight-X, ne pas proposer un scénario, c’est parfois la plus lucide des décisions.”
        </p>

        <footer className="mt-10 text-sm text-gray-600">
          © 2025 Insight-X. Tous droits réservés. |
          <a href="/mentions-legales" className="underline ml-1">Mentions légales</a> |
          <a href="/cgv" className="underline ml-1">Conditions Générales de Vente</a>
        </footer>
      </div>
    </div>
  );
}