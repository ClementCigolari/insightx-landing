"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BilanRapportPage() {
  const router = useRouter();
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  // Protection superadmin (locale)
  useEffect(() => {
    const storedUser = localStorage.getItem("insightx_user");
    if (!storedUser) {
      router.push("/connexion");
      return;
    }
    const userData = JSON.parse(storedUser);
    if (!userData || userData.niveau_acces !== "superadmin") {
      router.push("/connexion");
      return;
    }
  }, [router]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      alert("Sélectionne au moins une image PNG.");
      return;
    }

    setUploading(true);
    setLog([]);

    // Optionnel: sous-dossier pour organiser
    const folder = "charts"; // ou "" si tu veux à la racine

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setLog((prev) => [...prev, `❌ Ignoré (pas une image): ${file.name}`]);
        continue;
      }

      // Écrasera s'il existe déjà un fichier avec le même nom
      const path = folder ? `${folder}/${file.name}` : file.name;

      const { error } = await supabase.storage
        .from("rapports")
        .upload(path, file, {
          upsert: true,
          contentType: file.type || "image/png",
        });

      if (error) {
        setLog((prev) => [...prev, `❌ Erreur sur ${file.name}: ${error.message}`]);
      } else {
        setLog((prev) => [...prev, `✅ Upload OK: ${file.name}`]);
      }
    }

    setUploading(false);
    alert("Upload terminé.");
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-2 text-center">📊 Publier / Mettre à jour les rapports</h1>
      <p className="text-center text-sm text-zinc-400 mb-8">
        Astuce: réutilise le même <em>nom de fichier</em> pour écraser/remplacer une image existante.
      </p>

      <form onSubmit={handleUpload} className="max-w-lg mx-auto bg-zinc-900 p-6 rounded space-y-6">
        <div>
          <label className="block mb-2 font-medium">Images (.png, .jpg) — multiples OK</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold"
          >
            {uploading ? "Envoi en cours..." : "Publier les images"}
          </button>
        </div>

        {log.length > 0 && (
          <div className="mt-4 text-sm space-y-1">
            {log.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}