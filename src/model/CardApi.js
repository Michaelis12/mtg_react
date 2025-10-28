class Card {
  constructor({
    id,
    name,
    oracle_text,
    image_uris,
    mana_cost,
    cmc,
    color_identity,
    type_line,
    rarity,
    set,
    legalities
  }) {
    this.id = id;
    this.name = name;
    this.text = oracle_text || ""; 
    this.image = image_uris?.normal || null; // image_uris contient plusieurs tailles
    this.manaCost = mana_cost || null;
    this.cmc = cmc || 0;
    this.colors = color_identity || [];

    // Extraire les types depuis type_line (ex: "Legendary Creature — Elf Warrior")
    const [typesPart] = type_line?.split('—') || [""];
    const typeWords = typesPart.trim().split(" ");

    this.types = typeWords.filter(t => t !== "Legendary"); // les types sans supertype
    this.legendary = typeWords.includes("Legendary");

    this.rarity = rarity || "";
    this.edition = set || "";
    this.formats = this.extractFormats(legalities);
  }

  // Méthode pour extraire les formats légaux
  extractFormats(legalities) {
    if (!legalities) return [];
    return Object.entries(legalities)
      .filter(([format, status]) => status === "legal")
      .map(([format]) => format);
  }

  // Crée une carte depuis les données brutes de Scryfall
  static fromApi(cardData) {
    return new Card(cardData);
  }
}

export default Card;
