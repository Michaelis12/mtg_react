class User {
    constructor(id, pseudo, email, password, dateSign, avatar, bio,
        activity, roles, decks, cardsLikedNumber, decksLikedNumber, decksNumber){
        this.id = id;
		this.pseudo = pseudo;
		this.email = email;
		this.password = password;
		this.dateSign = dateSign;
		this.avatar = avatar;
		this.bio = bio;
		this.activity = activity;
		this.roles = roles;
		this.decks = decks;
		this.cardsLikedNumber = cardsLikedNumber;
		this.decksLikedNumber = decksLikedNumber;
		this.decksNumber = decksNumber;
        }
}

export default User;
