import Hero from "@/components/Hero";
import StatsStrip from "@/components/StatsStrip";
import Method from "@/components/Method";
import Formules from "@/components/Formules";
import CTASection from "@/components/CTASection";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Hero />               {/* Promesse + CTA direct */}
      <StatsStrip />         {/* Preuve sociale / chiffres clés */}
      <Method />             {/* Montre la méthode V7 */}
      <Formules />           {/* Mets les offres assez tôt */}
      <CTASection />         {/* Relance CTA après les formules */}
      <Contact />            {/* Finition / rassurance */}
    </main>
  );
}