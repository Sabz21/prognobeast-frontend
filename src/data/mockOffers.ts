export interface Offer {
  id: number;
  label: string;
  duration: string;
  price: number;
  pricePerMonth: number;
  savings?: string;
  popular: boolean;
  features: string[];
  ctaLabel: string;
  ctaLink: string; // lien Telegram / paiement externe
}

export const offers: Offer[] = [
  {
    id: 1,
    label: "Mensuel",
    duration: "1 mois",
    price: 29,
    pricePerMonth: 29,
    popular: false,
    features: [
      "Accès au canal VIP Telegram",
      "Tous les pronostics premium",
      "Analyses pré-match détaillées",
      "Suivi bankroll & unités",
      "Support réactif",
    ],
    ctaLabel: "Rejoindre — 29€/mois",
    ctaLink: "https://t.me/PrognoBeast", // à remplacer
  },
  {
    id: 2,
    label: "Trimestriel",
    duration: "3 mois",
    price: 69,
    pricePerMonth: 23,
    savings: "Économisez 18€",
    popular: true,
    features: [
      "Accès au canal VIP Telegram",
      "Tous les pronostics premium",
      "Analyses pré-match détaillées",
      "Suivi bankroll & unités",
      "Support réactif",
      "Récapitulatifs mensuels exclusifs",
    ],
    ctaLabel: "Choisir — 69€ / 3 mois",
    ctaLink: "https://t.me/PrognoBeast", // à remplacer
  },
  {
    id: 3,
    label: "Semestriel",
    duration: "6 mois",
    price: 119,
    pricePerMonth: 19.8,
    savings: "Économisez 55€",
    popular: false,
    features: [
      "Accès au canal VIP Telegram",
      "Tous les pronostics premium",
      "Analyses pré-match détaillées",
      "Suivi bankroll & unités",
      "Support réactif",
      "Récapitulatifs mensuels exclusifs",
      "Accès aux bilans trimestriels",
    ],
    ctaLabel: "Choisir — 119€ / 6 mois",
    ctaLink: "https://t.me/PrognoBeast", // à remplacer
  },
  {
    id: 4,
    label: "Annuel",
    duration: "12 mois",
    price: 199,
    pricePerMonth: 16.6,
    savings: "Économisez 149€",
    popular: false,
    features: [
      "Accès au canal VIP Telegram",
      "Tous les pronostics premium",
      "Analyses pré-match détaillées",
      "Suivi bankroll & unités",
      "Support réactif",
      "Récapitulatifs mensuels exclusifs",
      "Accès aux bilans trimestriels",
      "Coaching bankroll personnalisé",
      "Accès prioritaire aux analyses spéciales",
    ],
    ctaLabel: "Meilleur deal — 199€ / an",
    ctaLink: "https://t.me/PrognoBeast", // à remplacer
  },
];

export const faq = [
  {
    question: "Comment rejoindre le VIP après paiement ?",
    answer:
      "Après votre paiement, vous recevrez un lien d'accès au canal Telegram VIP privé dans un délai de quelques heures. En cas de problème, contactez-nous directement via Telegram ou email.",
  },
  {
    question: "Combien de pronostics par semaine en moyenne ?",
    answer:
      "En moyenne 3 à 6 pronostics par semaine. Nous privilégions la qualité sur la quantité. Chaque tip est analysé en profondeur avant d'être publié.",
  },
  {
    question: "Les résultats passés garantissent-ils les gains futurs ?",
    answer:
      "Non. Les paris sportifs comportent un risque inhérent. Nos résultats passés sont publiés à titre informatif et de transparence. Aucun résultat futur ne peut être garanti.",
  },
  {
    question: "Quelle bankroll minimum recommandez-vous ?",
    answer:
      "Nous recommandons une bankroll dédiée aux paris d'au minimum 50 unités. Chaque unité représente entre 1% et 2% de votre bankroll totale selon votre niveau de risque.",
  },
  {
    question: "Puis-je obtenir un remboursement ?",
    answer:
      "Les abonnements ne sont pas remboursables une fois le canal Telegram rejoint. En cas de litige, contactez-nous pour trouver une solution adaptée.",
  },
  {
    question: "Les analyses sont-elles disponibles en dehors du VIP ?",
    answer:
      "Des analyses générales et certains résultats sont partagés sur nos réseaux sociaux publics. Les analyses complètes, value bets et tips précis sont réservés au VIP.",
  },
];
