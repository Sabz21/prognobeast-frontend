export interface Testimonial {
  id: number;
  name: string;
  handle: string;
  avatar: string; // initiales
  text: string;
  since: string;
  stars: number;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Karim B.",
    handle: "@karim_bets",
    avatar: "KB",
    text: "Suivi PrognoBeast depuis 6 mois. +34 unités au compteur. La méthode est solide, les analyses sont claires et la gestion de bankroll m'a sauvé plusieurs fois. C'est pas du tout comme les tipsters que j'ai testés avant.",
    since: "Membre depuis 6 mois",
    stars: 5,
  },
  {
    id: 2,
    name: "Thomas R.",
    handle: "@thomas_value",
    avatar: "TR",
    text: "Ce qui m'a convaincu c'est la transparence. Tous les pronostics sont publiés avant le match, les pertes aussi sont affichées. On est loin des tipsters qui cachent leurs loses. Résultat : +21u en 3 mois.",
    since: "Membre depuis 3 mois",
    stars: 5,
  },
  {
    id: 3,
    name: "Sofiane M.",
    handle: "@sofiane_fx",
    avatar: "SM",
    text: "J'avais jamais vraiment appliqué la gestion de bankroll avant. Grâce aux explications de PrognoBeast j'ai structuré mon approche. C'est là que tout change. Le ROI suit naturellement.",
    since: "Membre depuis 4 mois",
    stars: 5,
  },
  {
    id: 4,
    name: "Lucas P.",
    handle: "@lucp_sports",
    avatar: "LP",
    text: "Les analyses pré-match sont vraiment travaillées. On comprend pourquoi il y a une value sur le tip, c'est pas juste 'Paris sur équipe X'. Ça m'a aidé à comprendre les marchés de paris.",
    since: "Membre depuis 8 mois",
    stars: 5,
  },
  {
    id: 5,
    name: "Yassine K.",
    handle: "@yass_bets",
    avatar: "YK",
    text: "Après une mauvaise expérience avec un faux tipster, j'étais méfiant. PrognoBeast m'a convaincu avec le suivi historique complet et accessible. Aujourd'hui +18u depuis 2 mois. Recommande à 100%.",
    since: "Membre depuis 2 mois",
    stars: 5,
  },
  {
    id: 6,
    name: "Mathieu D.",
    handle: "@math_sportbets",
    avatar: "MD",
    text: "Le ratio qualité/prix du VIP est imbattable. Les tips sont sélectifs, y'a pas 10 pronostics par jour. La qualité prime sur la quantité et ça se ressent sur les résultats.",
    since: "Membre depuis 5 mois",
    stars: 5,
  },
];
