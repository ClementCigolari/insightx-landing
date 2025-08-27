"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Trophy,
  Globe,
  Flag,
  XCircle,
  User,
  BarChart2,
  type LucideIcon
} from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const [userFormule, setUserFormule] = useState("");
  const [userOptions, setUserOptions] = useState<string[]>([]);

  useEffect(() => {
    const userDataRaw = localStorage.getItem("insightx_user");
    if (!userDataRaw) return;
    try {
      const userData = JSON.parse(userDataRaw);
      setUserFormule(userData.formule || "");
      setUserOptions(userData.options || []);
    } catch (error) {
      console.error("Erreur de parsing des données utilisateur :", error);
    }
  }, []);

  const shouldShowEurope =
    userFormule.toLowerCase() === "ultra" ||
    userOptions.map((o) => o.toLowerCase()).includes("europe");

  const shouldShowInternational =
    userFormule.toLowerCase() === "ultra";

  return (
    <aside
      className="
        hidden md:flex            /* 👈 cachée en mobile, affichée dès md */
        h-screen sticky top-0     /* hauteur pleine + collée en haut */
        w-64 px-4 py-6
        bg-[#0b0e1a] border border-blue-700
        shadow-xl rounded-tr-2xl rounded-br-2xl
        flex-col gap-6
      "
    >
      {/* LOGO EN HAUT */}
      <div className="flex justify-center items-center px-2 mb-4 transition-transform duration-300 hover:scale-105">
        <Image
          src="/logo-insight-x.png"
          alt="Logo Insight-X"
          width={160}
          height={40}
          priority
        />
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-2">
        <LinkItem href="/espace-client" icon={LayoutDashboard} label="Tableau de bord" pathname={pathname} />
        <LinkItem href="/espace-client/championnats" icon={Trophy} label="Mes championnats" pathname={pathname} />
        {shouldShowEurope && (
          <LinkItem href="/espace-client/europe" icon={Globe} label="Europe" pathname={pathname} />
        )}
        {shouldShowInternational && (
          <LinkItem href="/espace-client/internationale" icon={Flag} label="Compétitions internationales" pathname={pathname} />
        )}
        <LinkItem href="/espace-client/echoues" icon={XCircle} label="Analyses non confirmées" pathname={pathname} />
        <LinkItem href="/espace-client/compte" icon={User} label="Mon compte" pathname={pathname} />
        <LinkItem href="/espace-client/rapport" icon={BarChart2} label="Statistiques" pathname={pathname} />
      </nav>

      {/* ENCAR CONTACT */}
      <div className="mt-6 border border-zinc-700 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-lg p-3 text-center">
        <h2 className="text-sm font-semibold text-white">Besoin d’aide ?</h2>
        <p className="text-xs text-gray-400 mt-1">
          Écris-nous :{" "}
          <span className="font-mono text-white">contact@insight-x.fr</span>
        </p>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText("contact@insight-x.fr")}
          className="mt-2 text-[10px] bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 px-2 py-1 rounded"
        >
          Copier l’adresse
        </button>
      </div>

      {/* FOOTER */}
      <div className="mt-auto p-2 text-gray-500 text-xs text-center">
        {/* Optionnel : copyright ou version */}
      </div>
    </aside>
  );
}

// Composant réutilisable pour un lien
function LinkItem({
  href,
  icon: Icon,
  label,
  pathname,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  pathname: string;
}) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors",
        isActive
          ? "bg-blue-700 text-white shadow"
          : "text-gray-300 hover:bg-[#1e293b] hover:text-white"
      )}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}