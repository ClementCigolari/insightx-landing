import LeagueAnalysesPage from "@/components/LeagueAnalysesPage";
import LegendIndice from "@/components/LegendIndice";

export default function Page() {
  return (
    <div className="px-6 py-10 text-white">
      {/* Titre + légende */}
      <h1 className="text-3xl font-bold mb-4">Premier League — Analyses</h1>
      <LegendIndice className="mb-6" />

      {/* Page réutilisable qui liste les analyses */}
      <LeagueAnalysesPage
        slug="premier-league"
        title="Premier League — Analyses"
      />
    </div>
  );
}