class Notification {
    constructor ( id, deckID, issuerID, receivorID, date, deckName, issuerPseudo, receivorPseudo) {
        this.id = id;
		this.deckID = deckID;
		this.issuerID = issuerID;
		this.receivorID = receivorID;
		this.date = date;
		this.deckName = deckName;
		this.issuerPseudo = issuerPseudo;
		this.receivorPseudo = receivorPseudo;
    }
}

export default Notification;