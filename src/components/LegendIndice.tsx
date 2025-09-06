"use client";

type Props = {
  className?: string;
};

export default function LegendIndice({ className = "" }: Props) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:p-5 shadow-[0_12px_30px_rgba(0,0,0,.35)] ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-white/70">
            Légende · Indice de confiance
          </p>
          <h3 className="mt-1 text-lg font-bold">Comment lire nos indices</h3>
        </div>
        {/* Halo discret */}
        <div
          aria-hidden
          className="hidden sm:block h-8 w-32 rounded-full bg-gradient-to-r from-emerald-400/20 via-white/10 to-amber-400/20 blur-xl"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* +5 */}
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-3">
          <div className="inline-flex items-center gap-2 rounded-md bg-emerald-400/20 px-2 py-1 text-xs font-semibold text-emerald-200">
            +5 · Très fort
          </div>
          <p className="mt-2 text-sm text-emerald-100/90">
            Convergence max (SAFE + scénarios + stats). Highest confidence.
          </p>
        </div>

        {/* +4 */}
        <div className="rounded-lg border border-lime-400/20 bg-lime-500/10 p-3">
          <div className="inline-flex items-center gap-2 rounded-md bg-lime-400/20 px-2 py-1 text-xs font-semibold text-lime-200">
            +4 · Fort
          </div>
          <p className="mt-2 text-sm text-lime-100/90">
            Signal solide, contexte aligné. Recommandation publiée.
          </p>
        </div>

        {/* +3 */}
        <div className="rounded-lg border border-amber-400/20 bg-amber-500/10 p-3">
          <div className="inline-flex items-center gap-2 rounded-md bg-amber-400/20 px-2 py-1 text-xs font-semibold text-amber-200">
            +3 · Limite
          </div>
          <p className="mt-2 text-sm text-amber-100/90">
            Potentiel présent, mais incertitudes. À considérer avec prudence.
          </p>
        </div>

        {/* ≤ +2 */}
        <div className="rounded-lg border border-red-400/20 bg-red-500/10 p-3">
          <div className="inline-flex items-center gap-2 rounded-md bg-red-400/20 px-2 py-1 text-xs font-semibold text-red-200">
            ≤ +2 · Non conseillé
          </div>
          <p className="mt-2 text-sm text-red-100/90">
            Variance trop élevée / signaux contradictoires. On ne recommande pas.
          </p>
        </div>
      </div>

      <p className="mt-4 text-[12px] text-white/50">
        Note : l’indice agrège notre lecture SAFE, les scénarios, la forme, le H2H et les stats clés. Il ne constitue pas un conseil financier.
      </p>
    </div>
  );
}