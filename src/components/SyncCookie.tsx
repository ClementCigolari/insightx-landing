"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function SyncCookie() {
  const router = useRouter();

  useEffect(() => {
    // Toujours appeler le Hook, et mettre la condition À L’INTÉRIEUR
    const cookie = Cookies.get("ix_user_sig");
    const ls = localStorage.getItem("insightx_user");

    // Si pas de cookie mais un localStorage → on nettoie et force la reconnexion
    if (!cookie && ls) {
      try {
        localStorage.removeItem("insightx_user");
      } catch {}
      router.replace("/connexion");
      return;
    }

    // Si cookie présent : rien à faire ici
  }, [router]);

  return null;
}