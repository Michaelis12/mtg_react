class Card {
  constructor({
    id,
    apiID,
    name,
    text,
    image,
    manaCost,
    cmc,
    colors,
    types,
    supertypes,
    rarity,
    set,
    legalities
  }) {
    this.id = id;
    this.apiID = apiID;
    this.name = name;
    this.text = text;
    this.image = image || null;      
    this.manaCost = manaCost || null;
    this.cmc = cmc || 0;
    this.colors = colors || [];
    this.types = types || [];
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
      apiID: cardData.apiID,
      name: cardData.name,
      text: cardData.text,
      image: cardData.image,
      manaCost: cardData.manaCost,
      cmc: cardData.cmc, 
      colors: cardData.colors,
      types: cardData.types, 
      supertypes: cardData.supertypes,
      rarity: cardData.rarity,
      set: cardData.set,
      legalities: cardData.legalities
    });
  }
}

export default Card;
