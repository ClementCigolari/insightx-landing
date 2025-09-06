"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Trophy,
  Globe,
  Flag,
  XCircle,
  User,
  BarChart2,
  type LucideIcon,
} from "lucide-react";

// petit util pour les classes
function cn(...cls: Array<string | false | undefined | null>) {
  return cls.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const pathname = usePathname();
  const [userFormule, setUserFormule] = useState("");
  const [userOptions, setUserOptions] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("insightx_user");
    if (!raw) return;
    try {
      const u = JSON.parse(raw);
      setUserFormule((u.formule || "").toString());
      setUserOptions(Array.isArray(u.options) ? u.options : []);
    } catch (e) {
      console.error("Parse insightx_user:", e);
    }
  }, []);

  const shouldShowEurope = useMemo(
    () =>
      userFormule.toLowerCase() === "ultra" ||
      userOptions.map((o) => o?.toLowerCase?.()).includes("europe"),
    [userFormule, userOptions]
  );

  const shouldShowInternational = useMemo(
    () => userFormule.toLowerCase() === "ultra",
    [userFormule]
  );

  return (
    <aside
      className={cn(
        "hidden md:flex",
        "sticky top-0 h-screen w-64 flex-col",
        // style
        "px-4 py-6",
        "bg-white/5 backdrop-blur-md",
        "border-r border-white/10",
        "shadow-[0_10px_50px_rgba(0,0,0,.45)]"
      )}
    >
      {/* Glow subtil derrière le logo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-0 h-16 -translate-y-8 bg-gradient-to-b from-emerald-400/10 via-white/10 to-transparent blur-2xl"
      />

      {/* Logo */}
      <div className="mb-6 flex items-center justify-center px-2">
        <Image
          src="/logo-insight-x.png"
          alt="Insight-X"
          width={160}
          height={40}
          priority
          className="opacity-90"
        />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        <LinkItem
          href="/espace-client"
          icon={LayoutDashboard}
          label="Tableau de bord"
          pathname={pathname}
        />
        <LinkItem
          href="/espace-client/championnats"
          icon={Trophy}
          label="Mes championnats"
          pathname={pathname}
        />
        {shouldShowEurope && (
          <LinkItem
            href="/espace-client/europe"
            icon={Globe}
            label="Europe"
            pathname={pathname}
          />
        )}
        {shouldShowInternational && (
          <LinkItem
            href="/espace-client/internationale"
            icon={Flag}
            label="Compétitions internationales"
            pathname={pathname}
          />
        )}
        <LinkItem
          href="/espace-client/echoues"
          icon={XCircle}
          label="Analyses non confirmées"
          pathname={pathname}
        />
        <LinkItem
          href="/espace-client/compte"
          icon={User}
          label="Mon compte"
          pathname={pathname}
        />
        <LinkItem
          href="/espace-client/rapport"
          icon={BarChart2}
          label="Statistiques"
          pathname={pathname}
        />
      </nav>

      {/* Contact */}
      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3 text-center">
        <h2 className="text-sm font-semibold text-white">Besoin d’aide ?</h2>
        <p className="mt-1 text-xs text-white/70">
          Écris-nous :{" "}
          <span className="font-mono text-white">contact@insight-x.fr</span>
        </p>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText("contact@insight-x.fr")}
          className="mt-2 rounded-md border border-white/10 bg-white/10 px-2 py-1 text-[11px] text-white/90 hover:bg-white/15"
        >
          Copier l’adresse
        </button>
      </div>

      {/* Footer (optionnel) */}
      <div className="mt-auto select-none p-2 text-center text-[10px] text-white/40">
        v1.0 • Insight-X
      </div>
    </aside>
  );
}

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
  // actif si on est sur la route exacte ou une sous-route
  const isActive =
    pathname === href ||
    (href !== "/espace-client" && pathname.startsWith(href + "/"));

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2",
        "text-sm font-medium transition-colors",
        isActive
          ? "bg-emerald-400/15 text-white"
          : "text-white/75 hover:bg-white/8 hover:text-white"
      )}
    >
      {/* barre active à gauche */}
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-r",
          "transition-all",
          isActive
            ? "w-1.5 bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,.6)]"
            : "w-0 bg-transparent"
        )}
      />
      <Icon
        size={18}
        className={cn(
          "shrink-0 transition-transform",
          isActive ? "scale-105 text-emerald-300" : "text-white/70 group-hover:text-white"
        )}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}