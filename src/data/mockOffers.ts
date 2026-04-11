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
  ctaLink: string;
}

export const offers: Offer[] = [
  { id: 1, label: "Mensuel", duration: "1 mois", price: 29, pricePerMonth: 29, popular: false, features: ["Accès au canal VIP Telegram", "Tous les pronostics premium", "Analyses pré-match détaillées", "Suivi bankroll & unités", "Support réactif"], ctaLabel: "Rejoindre — 29€/mois", ctaLink: "https://t.me/PrognoBeast" },
  { id: 2, label: "Trimestriel", duration: "3 mois", price: 69, pricePerMonth: 23, savings: "Économisez 18€", popular: true, features: ["Accès au canal VIP Telegram", "Tous les pronostics premium", "Analyses pré-match détaillées", "Suivi bankroll & unités", "Support réactif", "Récapitulatifs mensuels exclusifs"], ctaLabel: "Choisir — 69€ / 3 mois", ctaLink: "https://t.me/PrognoBeast" },
  { id: 3, label: "Semestriel", duration: "6 mois", price: 119, pricePerMonth: 19.8, savings: "Économisez 55€", popular: false, features: ["Accès au canal VIP Telegram", "Tous les pronostics premium", "Analyses pré-match détaillées", "Suivi bankroll & unités", "Support réactif", "Récapitulatifs mensuels exclusifs", "Accès aux bilans trimestriels"], ctaLabel: "Choisir — 119€ / 6 mois", ctaLink: "https://t.me/PrognoBeast" },
  { id: 4, label: "Annuel", duration: "12 mois", price: 199, pricePerMonth: 16.6, savings: "Économisez 149€", popular: false, features: ["Accès au canal VIP Telegram", "Tous les pronostics premium", "Analyses pré-match détaillées", "Suivi bankroll & unités", "Support réactif", "Récapitulatifs mensuels exclusifs", "Accès aux bilans trimestriels", "Coaching bankroll personnalisé", "Accès prioritaire aux analyses spéciales"], ctaLabel: "Meilleur deal — 199€ / an", ctaLink: "https://t.me/PrognoBeast" },
];

export const faq = [
  { question: "Comment rejoindre le VIP après paiement ?", answer: "Après votre paiement, vous recevrez un lien d'accès au canal Telegram VIP privé dans un délai de quelques heures." },
  { question: "Combien de pronostics par semaine en moyenne ?", answer: "En moyenne 3 à 6 pronostics par semaine. Nous privilégions la qualité sur la quantité." },
  { question: "Les résultats passés garantissent-ils les gains futurs ?", answer: "Non. Les paris sportifs comportent un risque inhérent. Nos résultats passés sont publiés à titre informatif uniquement." },
  { question: "Quelle bankroll minimum recommandez-vous ?", answer: "Nous recommandons une bankroll dédiée d'au minimum 50 unités. Chaque unité représente entre 1% et 2% de votre bankroll totale." },
  { question: "Puis-je obtenir un remboursement ?", answer: "Les abonnements ne sont pas remboursables une fois le canal Telegram rejoint. Contactez-nous en cas de litige." },
  { question: "Les analyses sont-elles disponibles en dehors du VIP ?", answer: "Des analyses générales sont partagées sur nos réseaux publics. Les analyses complètes et tips précis sont réservés au VIP." },
];
