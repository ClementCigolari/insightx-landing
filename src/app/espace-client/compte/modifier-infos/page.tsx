"use client";

import ModifierInfos from "@/components/ModifierInfos";

export default function PageModifierInfos() {
  const user = JSON.parse(localStorage.getItem("insightx_user") || "{}");

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Modifier mes informations</h1>
      <ModifierInfos user={user} />
    </div>
  );
}