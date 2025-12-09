// Province codes mapping
export const PROVINCE_CODES: Record<string, string> = {
  Kinshasa: "KN",
  "Kongo Central": "KC",
  Kwango: "KW",
  Kwilu: "KL",
  "Mai-Ndombe": "MN",
  Équateur: "EQ",
  Mongala: "MG",
  "Nord-Ubangi": "NU",
  "Sud-Ubangi": "SU",
  Tshuapa: "TS",
  Tshopo: "TO",
  "Bas-Uele": "BU",
  "Haut-Uele": "HU",
  Ituri: "IT",
  "Nord-Kivu": "NK",
  "Sud-Kivu": "SK",
  Maniema: "MA",
  "Haut-Lomami": "HL",
  Lomami: "LO",
  Kasaï: "KS",
  "Kasaï Central": "KCEN",
  "Kasaï Oriental": "KO",
  Tanganyika: "TG",
  "Haut-Katanga": "HK",
  Lualaba: "LU",
  Sankuru: "SA",
};

// Category codes mapping
export const CATEGORY_CODES: Record<string, string> = {
  "Activités maritimes": "AM",
  "Agriculture / Agroalimentaire": "AG",
  "Alimentation & Boissons": "AB",
  "Animaux domestiques": "AD",
  "Application / Site Web": "ASW",
  Artisanat: "AR",
  Art: "AT",
  "Articles Ménagers / Design d'Intérieur": "MDI",
  "Automobile / Transport": "ATN",
  Beauté: "BE",
  "Bricolage / Bâtiment": "BB",
  Construction: "CO",
  "Divertissement / Expérience": "DE",
  "Écologie / Environnement": "EE",
  Éducation: "ED",
  Enfants: "ENF",
  "Événementiel / Organisation d'événements": "EV",
  Fêtes: "FE",
  "Finance / Investissement": "FI",
  Fitness: "FT",
  Immobilier: "IM",
  "Industries créatives": "IC",
  "Jouets / Jeux": "JJ",
  "Médias / Communication": "MC",
  "Mode de vie durable": "MV",
  Musique: "MU",
  Pêche: "PE",
  "Restauration / Hôtellerie": "RH",
  "Santé / Bien-être / Nutrition": "SB",
  "Services de santé": "SS",
  "Services en ligne": "SL",
  "Services professionnels": "SP",
  "Services sociaux / Communautaires": "SC",
  Sports: "SO",
  Technologie: "TE",
  "Technologie de pointe": "TP",
  Télécommunications: "TC",
  "Vêtements / Mode": "VM",
  "Voyage / Tourisme": "VT",
};

/**
 * Generate a unique project ID in the format: IFL-{PROVINCE}-{CATEGORY}-{RANDOM}
 * Example: IFL-KN-AG-9447
 *
 * @param province - Selected province name
 * @param categories - Array of selected categories (uses first one)
 * @returns Generated project ID
 */
export function generateProjectId(
  province: string,
  categories: string[]
): string {
  // Get province code
  const provinceCode = PROVINCE_CODES[province] || "XX";

  // Get first category code
  const firstCategory = categories[0] || "";
  const categoryCode = CATEGORY_CODES[firstCategory] || "XX";

  // Generate 4 random digits
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // Generates 1000-9999

  // Combine all parts
  const projectId = `IFL-${provinceCode}-${categoryCode}-${randomDigits}`;

  return projectId;
}
