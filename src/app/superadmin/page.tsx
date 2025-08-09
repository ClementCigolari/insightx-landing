// src/app/superadmin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, AlertTriangle, BarChart3 } from "lucide-react";

const cards = [
  {
    icon: <FileText size={32} />,
    title: "Nouvelle analyse",
    description: "Publie une nouvelle lecture de match.",
    color: "border-blue-500",
    onClick: "/superadmin/analyses/nouvelle",
  },
  {
    icon: <AlertTriangle size={32} />,
    title: "Lecture manquée",
    description: "Analyse les lectures non publiées.",
    color: "border-yellow-500",
    onClick: "/superadmin/analyses/manquees",
  },
  {
    icon: <BarChart3 size={32} />,
    title: "Bilan Insight-X",
    description: "Visualise un récapitulatif chiffré.",
    color: "border-indigo-500",
    onClick: "/superadmin/analyses/bilan",
  },
];

export default function SuperAdminPage() {
  const [prenom, setPrenom] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("insightx_user");
    if (!storedUser) return router.push("/connexion");

    const userData = JSON.parse(storedUser);
    if (!userData || userData.niveau_acces !== "superadmin")
      return router.push("/connexion");

    setPrenom(userData.prenom);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-2">🎛️ SuperAdmin – Cockpit Central</h1>
      <p className="text-center text-gray-400 mb-12">Contrôle total des opérations Insight-X</p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {cards.map(({ icon, title, description, color, onClick }, i) => (
          <div
            key={i}
            onClick={() => router.push(onClick)}
            className={`relative bg-zinc-900 hover:bg-zinc-800 border-l-4 ${color} p-6 rounded-2xl cursor-pointer shadow-lg hover:scale-[1.02] transition-all duration-200`}
          >
            <div className="absolute top-4 right-4 text-zinc-700 text-7xl opacity-10 pointer-events-none">
              {icon}
            </div>
            <div className="text-blue-400 mb-4">{icon}</div>
            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
            <p className="text-gray-400">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}