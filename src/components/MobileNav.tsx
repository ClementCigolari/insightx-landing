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
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
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
      console.error("Erreur parsing données user :", error);
    }
  }, []);

  const shouldShowEurope =
    userFormule.toLowerCase() === "ultra" ||
    userOptions.map((o) => o.toLowerCase()).includes("europe");

  const shouldShowInternational = userFormule.toLowerCase() === "ultra";

  return (
    <>
      {/* BOUTON BURGER */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-white fixed top-4 left-4 z-50 bg-blue-700 rounded"
      >
        <Menu size={24} />
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* MENU SLIDE-IN */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-[#0b0e1a] border-r border-blue-700 z-50 p-6 flex flex-col gap-6 transform transition-transform",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Bouton Fermer */}
        <button
          onClick={() => setOpen(false)}
          className="self-end text-white mb-4"
        >
          <X size={24} />
        </button>

        {/* Liens */}
        <nav className="flex flex-col gap-3">
          <LinkItem href="/espace-client" icon={LayoutDashboard} label="Tableau de bord" pathname={pathname} onClick={() => setOpen(false)} />
          <LinkItem href="/espace-client/championnats" icon={Trophy} label="Mes championnats" pathname={pathname} onClick={() => setOpen(false)} />
          {shouldShowEurope && (
            <LinkItem href="/espace-client/europe" icon={Globe} label="Europe" pathname={pathname} onClick={() => setOpen(false)} />
          )}
          {shouldShowInternational && (
            <LinkItem href="/espace-client/internationale" icon={Flag} label="Compétitions internationales" pathname={pathname} onClick={() => setOpen(false)} />
          )}
          <LinkItem href="/espace-client/echoues" icon={XCircle} label="Analyses non confirmées" pathname={pathname} onClick={() => setOpen(false)} />
          <LinkItem href="/espace-client/compte" icon={User} label="Mon compte" pathname={pathname} onClick={() => setOpen(false)} />
          <LinkItem href="/espace-client/rapport" icon={BarChart2} label="Statistiques" pathname={pathname} onClick={() => setOpen(false)} />
        </nav>
      </div>
    </>
  );
}

// Composant lien réutilisable
function LinkItem({
  href,
  icon: Icon,
  label,
  pathname,
  onClick,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  pathname: string;
  onClick: () => void;
}) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors",
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