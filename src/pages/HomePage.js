import "./css/HomePage.css"
import React from 'react';
import { useState, useEffect, useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import { AuthContext } from "../context/authContext"
import axiosInstance from "../api/axiosInstance";
import BanniereMTG from "../assets/banniere.jpg"
import LogoMTG from "../assets/LogoMTG.png"
import BackgroundTopCards from "../assets/mtg_wallpaper.jpg"
import { FaHeart  } from 'react-icons/fa';
import Card from '../model/Card';
import Deck from '../model/Deck';
import Title from "../components/title";
import Section from "../components/section";
import BackgroundPage from "../assets/background_homepage.png"
import cardsImage from "../assets/card_search.jpg"
import deckImage from "../assets/hand_card.jpg"
import 'bootstrap/dist/css/bootstrap.min.css';
import loading from "../assets/loading.gif"
import { getImageUrl } from '../utils/imageUtils';
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
 

const HomePage = function () {
  const [cards, setCards] = React.useState([])
  const [decks, setDecks] = React.useState([])
  const { fetchRoles, isAuthenticated } = useContext(AuthContext);
  const [detailsCard, setDetailsCard] = React.useState(null)
  const [detailsDeck, setDetailsDeck] = React.useState(null);  

  // Méthode pour afficher/masquer le zoom sur un deck (DecksPage.js)
  const hoveredDeck = (id, name, format) => {
    if (id && name && format) {
      setDetailsDeck({ id, name, format });
    } else {
      setDetailsDeck(null);
    }
  };
  const navigate = useNavigate();
  const [displayLoading, setDisplayLoading] = useState(false);

  // --- Couleurs DecksPage.js ---
  const [colors, setColors] = React.useState([]);
  useEffect(() => {
    const getColors = async () => {
      try {
        const request = await axiosInstance.get(`f_all/getColors`);
        setColors(request.data);
      } catch (error) {
        console.log(error);
      }
    };
    getColors();
  }, []);

  const getColorPics = (value) => {
    if(value === "BLANC") return require("../assets/white-mtg.png");
    if(value === "BLEU") return require("../assets/blue-mtg.png");
    if(value === "VERT") return require("../assets/green-mtg.png");
    if(value === "ROUGE") return require("../assets/red-mtg.png");
    if(value === "NOIR") return require("../assets/black-mtg.png");
    if(value === "INCOLORE") return require("../assets/incolore-mtg.png");
  };

  const displayColor = (value) => {
    if(value === "INCOLORE") return "none";
  };

// Récupérer le top 3 cartes 
  const getTopCards = async () => { 
    try {
        setDisplayLoading(true);
        const response = await axiosInstance.get('/f_all/getTop3Cards' );
        
        const listCards = response.data.map(
                card => new Card (card.id, card.name, card.text, card.image, card.manaCost, card.value, card.formats,
                                card.colors, card.type, card.legendary, card.rarity, card.edition,
                                card.deckBuilders, card.decks, card.decksCommander, card.likeNumber,
                                card.deckNumber, card.commanderNumber
        ) )          

        setCards(listCards)
        setDisplayLoading(false);
    }   
    catch (error) {
        setDisplayLoading(false);
        console.log(error);
    }


}
React.useEffect(() => {
  getTopCards();
}, []);

// Zoom sur une carte
        const hoveredCard = (id) => {
         setDetailsCard({ id });

          }

// Naviguer vers une carte
const chooseCard = (id) => {
    const cardsIds = cards.map(card => card.id);
    navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
    };

  // Récupérer le top 3 decks
  const getTopDecks = async () => {
      try {
            setDisplayLoading(true);
          const response = await axiosInstance.get('/f_all/getTop3Decks' );
          
          const listDecks = response.data.map(
            deck => new Deck (deck.id, deck.name, deck.dateCreation, deck.image, deck.format,
                deck.colors, deck.manaCost, deck.value, deck.isPublic, deck.deckBuilder,
                deck.deckBuilderName, deck.likeNumber, deck.cards, deck.commander
    ) )
        setDecks(listDecks)
        console.log("deckbuilder : " + listDecks.deckBuilder.id)
        setDisplayLoading(false);
      }   
      catch (error) {
          setDisplayLoading(false);
          console.log(error);
      }
  
  
  }
  React.useEffect(() => {
    getTopDecks();
  }, []);

// Naviguer vers un deck
const chooseDeck = (id) => {
      const deckIds = decks.map(deck => deck.id);
      navigate(`/deckSelected`, { state: { deckID: id, ListDeck: deckIds }})
      };



// Naviguer vers un user
const chooseUser = async (deckID) => {

  try {
    setDisplayLoading(true);
    const response = await axiosInstance.get(`/f_all/getDeckUser?deckID=${deckID}` );

    navigate(`/userSelected`, { state: { userID: response.data, ListUsers : [1] }})
    setDisplayLoading(false);
    } 
  catch (error) {
    setDisplayLoading(false);
    console.log(error);
  }
}

const navNewDeck = () => {
    if (isAuthenticated) {
        navigate('/addDeck');
    } else {
        navigate('/signPage');
    }
}


  


    return (
      <Section>

      <div className="home-page-container">

      { displayLoading && (
                <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
            )}
      <img src={BackgroundPage} className="background-image" alt="background" />
      
      {/*<img src={BanniereMTG} className="background-home" alt="background" />*/}
      <div className="logo-container">
        <img src={LogoMTG} className="image-logo" alt="logo" />
      </div>
      
      <div className="background-colors" style={{ backgroundImage: `url(${BanniereMTG})`,backgroundSize: "cover",       // l’image recouvre tout le container
        backgroundPosition: "center",  // centrée
        backgroundRepeat: "no-repeat"}}>
       <div className="colors-container">
          <img src={white} className="homepage-color" alt="logo" />
          <img src={blue} className="homepage-color" alt="logo" />
          <img src={black} className="homepage-color" alt="logo" />
          <img src={red} className="homepage-color" alt="logo" />
          <img src={green} className="homepage-color" alt="logo" />
      </div>
    </div>


      <div className="home-nav-container">
        <div className="home-nav-card-container"> 
          <div className="title-section-container-desktop" style={{width:'100%'}}>
            <Title title={"Rechercher une carte"} style={{width:'80%'}}/> 
          </div>
          <div className="title-section-container-mobile" style={{width:'100%'}}>
            <Title title={"Rechercher une carte"} /> 
          </div>
          <img className='home-image' onClick={() =>navigate(`/cards`)} src={cardsImage}  alt="background" />
        </div>

         <div className="home-nav-deck-container"> 
          <div className="title-section-container-desktop" style={{width:'100%'}}>
            <Title title={"Créer votre deck"} style={{width:'80%'}}/> 
          </div>
          <div className="title-section-container-mobile" style={{width:'100%'}}>
            <Title title={"Créer votre deck"} /> 
          </div>
          <img  className='home-image'src={deckImage}  onClick={() => navNewDeck()}  alt="background" />         
        </div>
      </div> 
      
      <div style={{width:'100%'}}>
        <Title title={"Top Cartes"}/> 
        <div className="top-cards" style={{
              backgroundImage: `url(${BackgroundTopCards})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            }}>
            {cards.map(card => (
              <div className="top3-card-details" key={card.id}>
                    <img className="top3_cards-img" src={getImageUrl(card.image)} alt="Card-image" 
                    onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard()} 
                    onClick={() => chooseCard(card.id)}/>
                    <br/>
                    <h2 className="top-card-likeNumber" >{card.likeNumber} 
                      <FaHeart color="red" style={{position:'relative'}}/></h2>
                      {detailsCard && detailsCard.id === card.id && (
                                          <img className="top-card-img-zoom" src={getImageUrl(card.image)} alt="Card-image"/>
                                          )} 
              </div>
                )
              )
            }
        </div>
      </div>  
 
      <div style={{width:'100%'}}>
        <Title title={"Top Decks"}/>
        <div className="top-decks" style={{
            backgroundImage: `url(${BackgroundTopCards})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          }}> 
        {decks.map(deck => ( 
          <div className="top-deck-details" key={deck.id}>

                <img className="deck-img" onClick={() => chooseDeck(deck.id)} src={getImageUrl(deck.image)}
                onMouseEnter={() => hoveredDeck(deck.id, deck.name, deck.format) } onMouseOut={() => hoveredDeck()} alt="Card-image"/>
                <br/>
                <div className="top3-decks-attributs">
                      <h2 className="top3-decks-name">{deck.name}</h2> 
                      <button className="top3-decks-button"><h4 className="top-decks-deckBuilderName" 
                      onClick={() => chooseUser(deck.id)}> de {deck.deckBuilderName}</h4></button>
                </div> 
                <div className="top3-decks-attributs-mobile">
                <strong className="decks-name"> {deck.name} </strong>
                <button className="deck-db-button" onClick={() => chooseUser(deck.id)}><strong className="deck-db"> de {deck.deckBuilderName}</strong></button>
                </div>
                <br/>
                <h2 className="top-deck-likeNumber">{deck.likeNumber} <FaHeart color="red" style={{position:'relative'}}/></h2>

                {detailsDeck && detailsDeck.id === deck.id && 
                (
                  <div className="hover-top3-deck-card">
                      <div className="img-container" style={{marginBottom : '7%'}}>
                        <img className="hover-top-deck-img" src={getImageUrl(deck.image)} alt="Deck mtg"/>
                      </div>
                      <div className="top-deck-hover-body" >
                        <div className='name-line'>
                                                                  <h1 className="hover-top3deck-name"> {deck.name}</h1>
                        </div>
                        <div className='color-line'>                        
                                                                    <h4 className='attribut-topDeck'> Couleurs : </h4> 
                                                                    {deck.colors && deck.colors.length > 0 && Array.isArray(colors) && (
                                                                        <div className='mapping-color'>
                                                                          {deck.colors.map((color)  => (
                                                                        <img src={getColorPics(color)} className="color-img-topDeck" style={{display:(displayColor(color))}} alt={color}/>                                
                                                                    ))}
                                                                        </div>
                                                                    )} 
                        </div>
                        <div className='format-line'>              
                            <h4 className='attribut-topDeck'> Format : </h4> 
                            <h4 className='card-format' style={{ backgroundColor: 'green', position: 'relative', fontSize: '1.5em' }}>{deck.format}</h4>
                        </div>
                                                                
                      </div>                                                
                  </div>
                                                )}
                
          </div>
            )
        )}
        </div>
      </div>

    </div>
    </Section>
  

  )
}

export default HomePage