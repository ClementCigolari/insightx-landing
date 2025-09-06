"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCheckout } from "@/context/CheckoutContext";

/* ------- prix dynamiques ------- */
const getPriceText = (formule: string, options: string[] = []) => {
  let base = 0, total = 0, desc = "";
  switch (formule) {
    case "decouverte": base = 4.99; desc = "formule Découverte"; total = base; break;
    case "passion":   base = 9.99; desc = "formule Passion";   total = base + (options.includes("europe") ? 5 : 0); if (options.includes("europe")) desc += " + Europe"; break;
    case "premium":   base = 19.99; desc = "formule Premium";  total = base + (options.includes("europe") ? 5 : 0); if (options.includes("europe")) desc += " + Europe"; {const rest = options.filter(o=>o!=="europe"); if(rest.length){ total += rest.length*5; desc += ` + ${rest.length} championnat${rest.length>1?"s":""}`;}} break;
    case "ultra":     base = 49.99; desc = "formule Ultra";    total = base + options.length*5; if(options.length) desc += ` + ${options.length} championnat${options.length>1?"s":""}`; break;
    default: return "Formule inconnue";
  }
  return `${total.toFixed(2)}€ / mois (${desc})`;
};

export default function InscriptionPage() {
  const router = useRouter();
  const { setDonneesClient, setPriceIds } = useCheckout();

  /* champs */
  const [nom, setNom] = useState("");            const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");        const [emailConfirm, setEmailConfirm] = useState("");
  const [dateNaissance, setDateNaissance] = useState<Date|null>(null);
  const [adresse, setAdresse] = useState("");
  const [motDePasse, setMotDePasse] = useState(""); const [mdpConfirm, setMdpConfirm] = useState("");

  /* ui */
  const [erreurEmail, setErreurEmail] = useState(""); const [erreurMdp, setErreurMdp] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  /* recap / formule */
  const [recapTexte, setRecapTexte] = useState<string | null>("Chargement du récapitulatif…");
  const [championnatsSupp, setChampionnatsSupp] = useState<string[]>([]);
  const [formule, setFormule] = useState<string>(""); const [options, setOptions] = useState<string[]>([]);

  /* mapping ligues */
  const leagueIdToName = useMemo(() => ({
    "FR-L1":"Ligue 1","FR-CDF":"Coupe de France","UK-PL":"Premier League","UK-CH":"Championship",
    "UK-FAC":"FA Cup","UK-CC":"Carabao Cup","ES-L1":"La Liga","ES-L2":"La Liga 2","ES-CDR":"Copa del Rey",
    "IT-A":"Serie A","IT-B":"Serie B","IT-CI":"Coppa Italia","DE-BUN":"Bundesliga","NL-ERE":"Eredivisie",
    "PT-LP":"Liga Portugal","BE-PL":"Pro League","AT-ADM":"Admiral Bundesliga","SE-ALL":"Allsvenskan",
    "CH-SL":"Super League","DK-SUP":"Superliga","NO-ELI":"Eliteserien","SCO-PRE":"Premiership",
    "PL-EKS":"Ekstraklasa","RU-PL":"Premier League (Russie)","UA-PL":"Premier League (Ukraine)","HR-HNL":"1. HNL",
  }), []);
  const getLeagueName = useCallback((id?: string) => {
    if (!id) return "non spécifié";
    if (id === "europe") return "Europe";
    return leagueIdToName[id as keyof typeof leagueIdToName] ?? id;
  }, [leagueIdToName]);

  /* charger recap */
  useEffect(() => {
    const raw = localStorage.getItem("insightx_recap");
    if (!raw) { setRecapTexte("Aucun récapitulatif disponible."); return; }
    try {
      const recap = JSON.parse(raw) as { formule: string; league?: string; options?: string[]; };
      const f = recap.formule; const opts = recap.options ?? [];
      setFormule(f); setOptions(opts);

      const noms: Record<string,string> = { decouverte:"Découverte", passion:"Passion", premium:"Premium", ultra:"Ultra" };
      const champ =
        f==="ultra"   ? "Ligue 1, Premier League, Serie A, Liga, Bundesliga, Coupes d'Europe, Compétitions internationales" :
        f==="premium" ? "Ligue 1, Premier League, Serie A, Liga, Bundesliga" :
        getLeagueName(recap.league);
      const optTxt = opts.length ? opts.map(getLeagueName).join(", ") : "Sans engagement";

      setRecapTexte(`✅ ${noms[f]||"Formule inconnue"}\n📌 Championnat : ${champ}\n📦 Option : ${optTxt}\n💰 Prix : ${getPriceText(f, opts)}`);
      if (f==="premium" || f==="ultra") setChampionnatsSupp(opts.filter(o=>o!=="europe"));
    } catch { setRecapTexte("Erreur lors du chargement du récapitulatif."); }
  }, [getLeagueName]);

  /* helpers */
  const inputClass = "w-full rounded-xl border border-white/10 bg-white/10 text-white placeholder-white/50 px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent";
  const formatDateToYMD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

  const formIsValid =
    nom && prenom && email && emailConfirm && email===emailConfirm &&
    motDePasse && mdpConfirm && motDePasse===mdpConfirm &&
    dateNaissance && adresse && termsAccepted;

  /* submit */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErreurEmail(""); setErreurMdp("");

    if (email !== emailConfirm) setErreurEmail("❌ Les adresses e-mail ne correspondent pas.");
    if (motDePasse !== mdpConfirm) setErreurMdp("❌ Les mots de passe ne correspondent pas.");
    if (!formIsValid) return;

    const dNaiss = dateNaissance ? formatDateToYMD(dateNaissance) : null;

    // 1) Contexte
    setDonneesClient({ nom, prenom, email, dateNaissance: dNaiss, adresse, motDePasse });
    localStorage.setItem("insightx_prenom", prenom);

    // 2) Stripe price IDs
    const priceIds: string[] = [];
    if (formule==="decouverte") priceIds.push("price_1Resk4BuNwbO8kuzId3iSlyO");
    else if (formule==="passion") priceIds.push("price_1ResneBuNwbO8kuznLw6dCoj");
    else if (formule==="premium") priceIds.push("price_1ResuEBuNwbO8kuzv8lDsMvx");
    else if (formule==="ultra") priceIds.push("price_1RevGqBuNwbO8kuz5REGa1Rk");
    if (options.includes("europe")) priceIds.push("price_1ResqUBuNwbO8kuzLmIpzGRq");
    const extras = options.filter(o=>o!=="europe");
    for (let i=0;i<extras.length;i++) priceIds.push("price_1RevBnBuNwbO8kuz5pfMyrw9");
    setPriceIds(priceIds);

    // 3) mémorisation client
    const recap = JSON.parse(localStorage.getItem("insightx_recap") || "{}");
    localStorage.setItem("insightx_client", JSON.stringify({
      nom, prenom, email, dateNaissance: dNaiss, adresse, mot_de_passe: motDePasse,
      formule: recap.formule || null,
      ligues_choisies: recap.league ? [recap.league] : [],
      options_supplementaires: recap.options || [],
    }));

    router.push("/paiement");
  };

  return (
    <section className="min-h-screen bg-black text-white py-16 px-4">
      <div className="mx-auto max-w-2xl">
        {/* halo en haut */}
        <div aria-hidden className="mx-auto mb-6 h-16 w-64 rounded-full bg-gradient-to-r from-emerald-400/20 via-white/10 to-emerald-400/20 blur-2xl" />
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,.35)] backdrop-blur">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs tracking-wide uppercase">
              Étape 1/2 — Création du compte
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold">Création de votre espace Insight-X</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom / Prénom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-white/80">Nom</label>
                <input className={inputClass} value={nom} onChange={(e)=>setNom(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1 block text-sm text-white/80">Prénom</label>
                <input className={inputClass} value={prenom} onChange={(e)=>setPrenom(e.target.value)} required />
              </div>
            </div>

            {/* Emails */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-white/80">Adresse e-mail</label>
                <input type="email" className={inputClass} value={email} onChange={(e)=>setEmail(e.target.value)} required />
                {erreurEmail && <p className="mt-1 text-sm text-red-400">{erreurEmail}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm text-white/80">Confirmer e-mail</label>
                <input type="email" className={inputClass} value={emailConfirm} onChange={(e)=>setEmailConfirm(e.target.value)} required />
              </div>
            </div>

            {/* Date de naissance */}
            <div>
              <label className="mb-1 block text-sm text-white/80">Date de naissance</label>
              <div className="relative">
                <DatePicker
                  selected={dateNaissance}
                  onChange={(d: Date | null) => setDateNaissance(d)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="JJ/MM/AAAA"
                  className={`${inputClass} !pr-10 datepicker-input`} /* hook pour nos styles */
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
                <FaRegCalendarAlt className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50" />
              </div>
            </div>

            {/* Adresse */}
            <div>
              <label className="mb-1 block text-sm text-white/80">Adresse complète</label>
              <input className={inputClass} value={adresse} onChange={(e)=>setAdresse(e.target.value)} required />
            </div>

            {/* MDP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-white/80">Mot de passe</label>
                <input type="password" className={inputClass} value={motDePasse} onChange={(e)=>setMotDePasse(e.target.value)} required />
                {erreurMdp && <p className="mt-1 text-sm text-red-400">{erreurMdp}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm text-white/80">Confirmer mot de passe</label>
                <input type="password" className={inputClass} value={mdpConfirm} onChange={(e)=>setMdpConfirm(e.target.value)} required />
              </div>
            </div>

            {/* Récap */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h2 className="text-lg font-semibold mb-2">Récapitulatif</h2>
              {recapTexte ? (
                <>
                  {recapTexte.split("\n").map((line, i) => (
                    <p key={i} className="text-sm text-white/80">{line}</p>
                  ))}
                  {championnatsSupp.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-white/85">📚 Championnats supplémentaires :</p>
                      <ul className="list-disc list-inside text-sm text-white/80">
                        {championnatsSupp.map((c, i) => <li key={i}>{getLeagueName(c)}</li>)}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="italic text-white/60">Chargement du récapitulatif…</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 text-sm text-white/80">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e)=>setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 text-emerald-400 focus:ring-emerald-400"
              />
              <span>
                J’accepte les <a href="/mentions-legales" className="underline">Mentions légales</a> et les{" "}
                <a href="/cgv" className="underline">CGV</a>.
              </span>
            </label>

            {/* CTA */}
            <button
              type="submit"
              disabled={!formIsValid}
              className={`w-full rounded-xl px-4 py-3 font-semibold transition
                ${formIsValid ? "bg-emerald-400 text-black hover:bg-emerald-300" : "bg-white/10 text-white/40 cursor-not-allowed"}`}
            >
              Procéder au paiement
            </button>
            <p className="text-center text-xs text-white/60">
              Paiement 100% sécurisé via Stripe • Annulable à tout moment • Données protégées (RGPD)
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}