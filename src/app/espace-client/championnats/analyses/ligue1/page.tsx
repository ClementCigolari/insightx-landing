import LeagueAnalysesPage from "@/components/LeagueAnalysesPage";
import LegendIndice from "@/components/LegendIndice";

export default function Page() {
  return (
    <div className="px-6 py-10 text-white">
      {/* Titre + légende */}
      <h1 className="text-3xl font-bold mb-4">Ligue 1 — Analyses</h1>
      <LegendIndice className="mb-6" />

      {/* Page réutilisable qui liste les analyses */}
      <LeagueAnalysesPage
        slug="ligue1"
        title="Ligue 1 — Analyses"
      />
    </div>
  );
}