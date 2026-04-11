import type { Metadata } from "next";
export const metadata: Metadata = { title: "Mentions légales" };

export default function LegalPage() {
  return (
    <>
      <section className="w-full pt-36 pb-12 bg-[#080808] border-b border-[#1F1F1F]">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <span className="inline-flex items-center gap-2 text-[#FF5C00] text-xs font-bold tracking-[0.2em] uppercase mb-6">
            <span className="w-4 h-px bg-[#FF5C00]" />Informations légales<span className="w-4 h-px bg-[#FF5C00]" />
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-white uppercase leading-none tracking-wide"
            style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>
            Mentions légales
          </h1>
        </div>
      </section>

      <section className="w-full bg-[#080808] py-16">
        <div className="w-full max-w-3xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col gap-10 text-sm text-[#555] leading-relaxed">

            <div>
              <h2 className="text-white font-bold text-xs tracking-widest uppercase mb-3">Éditeur du site</h2>
              <p>Le site PrognoBeast est édité par PrognoBeast. Contact : <a href="mailto:contact@prognobeast.com" className="text-[#FF5C00] hover:underline">contact@prognobeast.com</a></p>
            </div>

            <div>
              <h2 className="text-white font-bold text-xs tracking-widest uppercase mb-3" id="disclaimer">Disclaimer — Avertissement sur les risques</h2>
              <div className="bg-[#FF5C00]/4 border border-[#FF5C00]/10 rounded-lg p-5 mb-4">
                <p className="text-[#999] font-semibold mb-2">⚠ Avertissement important</p>
                <p>Les paris sportifs comportent un risque de perte financière réelle. Les pronostics publiés sur PrognoBeast sont fournis à titre informatif et éducatif uniquement. Ils ne constituent en aucun cas des conseils financiers ou des garanties de gain.</p>
              </div>
              <p>Les performances passées présentées sur ce site ne garantissent pas les résultats futurs. Tout parieur doit être conscient que les paris sportifs peuvent entraîner une perte totale des sommes misées.</p>
              <p className="mt-3">Nous encourageons vivement une pratique responsable et mesurée des paris sportifs. Ne misez jamais plus que ce que vous pouvez vous permettre de perdre. Si vous pensez souffrir d&apos;addiction aux jeux, contactez Joueurs Info Service au <strong className="text-[#888]">09 74 75 13 13</strong> (gratuit).</p>
            </div>

            <div>
              <h2 className="text-white font-bold text-xs tracking-widest uppercase mb-3">Nature du contenu</h2>
              <p>PrognoBeast est un service de pronostics sportifs à visée informative. Les analyses, statistiques et recommandations publiées reflètent l&apos;opinion de leurs auteurs au moment de leur rédaction. Elles ne constituent pas une incitation directe aux jeux d&apos;argent.</p>
            </div>

            <div>
              <h2 className="text-white font-bold text-xs tracking-widest uppercase mb-3">Propriété intellectuelle</h2>
              <p>L&apos;ensemble du contenu du site PrognoBeast (textes, analyses, visuels, marque, logo) est la propriété exclusive de PrognoBeast et est protégé par le droit de la propriété intellectuelle. Toute reproduction sans autorisation préalable écrite est interdite.</p>
            </div>

            <div>
              <h2 className="text-white font-bold text-xs tracking-widest uppercase mb-3" id="rgpd">Politique de confidentialité — RGPD</h2>
              <p>PrognoBeast collecte uniquement les données strictement nécessaires au fonctionnement du service : nom et adresse email lors de l&apos;utilisation du formulaire de contact.</p>
              <p className="mt-3">Ces données ne sont jamais vendues, partagées ou cédées à des tiers. Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression. Contactez-nous à <a href="mailto:contact@prognobeast.com" className="text-[#FF5C00] hover:underline">contact@prognobeast.com</a>.</p>
            </div>

            <div>
              <h2 className="text-white font-bold text-xs tracking-widest uppercase mb-3">Cookies</h2>
              <p>Ce site utilise uniquement des cookies techniques strictement nécessaires à son fonctionnement. Aucun cookie de tracking publicitaire n&apos;est utilisé.</p>
            </div>

            <div>
              <h2 className="text-white font-bold text-xs tracking-widest uppercase mb-3">Limitation de responsabilité</h2>
              <p>PrognoBeast décline toute responsabilité pour les décisions prises par les utilisateurs sur la base des informations publiées sur ce site.</p>
            </div>

            <p className="text-[#222] text-xs border-t border-[#1F1F1F] pt-6">Dernière mise à jour : Avril 2025 · PrognoBeast</p>
          </div>
        </div>
      </section>
    </>
  );
}
