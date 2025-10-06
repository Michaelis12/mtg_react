class Card {
  constructor({
    id,
    name,
    text,
    imageUrl,
    manaCost,
    colors,
    type,
    supertypes,
    rarity,
    set,
    legalities
  }) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.image = imageUrl || null;      
    this.manaCost = manaCost || null;
    this.colors = colors || [];
    this.type = type || "";
    this.legendary = supertypes?.includes("Legendary") || false;
    this.rarity = rarity || "";
    this.edition = set || "";             // set de l'API
    this.formats = this.extractFormats(legalities); // formats légaux
  }

  // Méthode pour extraire les formats légaux
  extractFormats(legalities) {
    if (!legalities) return [];
    return legalities
      .filter(l => l.legality === "Legal")
      .map(l => l.format);
  }

  // Méthode statique pour créer une Card depuis la réponse de l'API
  static fromApi(cardData) {
    return new Card({
      id: cardData.id,
      name: cardData.name,
      text: cardData.text,
      imageUrl: cardData.imageUrl,
      manaCost: cardData.manaCost,
      colors: cardData.colors,
      type: cardData.type,
      supertypes: cardData.supertypes,
      rarity: cardData.rarity,
      set: cardData.set,
      legalities: cardData.legalities
    });
  }
}

export default Card;
