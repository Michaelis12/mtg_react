class Card {
    constructor ( id, name, text, image, manaCost, value, formats,
        colors, type, legendary, rarity, edition, deckBuilders, decks,
         decksCommander, likeNumber, deckNumber, commanderNumber) {
        this.id = id;
		this.name = name; 
		this.text = text;
		this.image = image;
		this.manaCost = manaCost;
		this.value = value;
		this.formats = formats;
		this.colors = colors;
		this.type = type;
		this.legendary = legendary;
		this.rarity = rarity;
		this.edition = edition;
		this.deckBuilders = deckBuilders
		this.decks = decks;
		this.decksCommander = decksCommander;
		this.likeNumber = likeNumber;
		this.deckNumber = deckNumber;
		this.commanderNumber = commanderNumber;
    }

}
 
export default Card;
