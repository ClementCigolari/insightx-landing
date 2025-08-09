"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

export default function SyncCookie() {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Liste des routes où on ne vérifie pas la sécurité
  const BYPASS = ["/reset-password", "/connexion", "/deconnexion", "/inscription"];
  if (BYPASS.some((p) => pathname.startsWith(p))) {
    return null; // On ne fait aucun contrôle ici
  }

  useEffect(() => {
    try {
      const localUserRaw = localStorage.getItem("insightx_user");
      const cookieUserRaw = Cookies.get("insightx_user");

      if (!localUserRaw || !cookieUserRaw) return;

      const localUser = JSON.parse(localUserRaw);
      const cookieUser = JSON.parse(cookieUserRaw);

      const fields = ["formule", "niveau_acces", "options", "ligue"];
      for (const f of fields) {
        const a = JSON.stringify(localUser?.[f] ?? "");
        const b = JSON.stringify(cookieUser?.[f] ?? "");
        if (a !== b) {
          router.push("/connexion");
          return;
        }
      }
    } catch (e) {
      console.error("Erreur SyncCookie :", e);
    }
  }, [router, pathname]);

  return null;
}