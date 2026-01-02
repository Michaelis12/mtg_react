import "./css/HomePage.css"
import React from 'react';
import { useState, useEffect, useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import { AuthContext } from "../context/authContext"
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import logo from "../assets/logo_site.png"
import banniere from "../assets/background-forest.gif"
import img1 from "../assets/card_search.jpg"
import img2 from "../assets/hand_card.jpg"
import img3 from "../assets/caroussel_img3.avif"
import img4 from "../assets/caroussel_img2.jpg"
import img5 from "../assets/ninja_turtle_mtg.avif"
import img6 from "../assets/avatar-mtg.jpg"
import BackgroundDeckAttributs from "../assets/old-paper.jpg"
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import colorless from "../assets/incolore-mtg.webp"
import BackgroundPage from "../assets/background_homepage.png"
import loading from "../assets/loading.gif"
import BackgroundTopCards from "../assets/background_purple.jpg"
import { FaHeart  } from 'react-icons/fa';
import { MdOutlinePlayArrow } from "react-icons/md";
import Card from '../model/CardApiSave';
import Deck from '../model/Deck';
import Title from "../components/title";
import CardLink from "../components/cardLink";
import Section from "../components/section";
import { getImageUrl } from '../utils/imageUtils';
import BackgroundDeck from "../assets/background_deck_scelled.png"
 

const HomePage = function () {

  const [cards, setCards] = React.useState([])
  const [cedh, setCedh] = React.useState([])
  const [decks, setDecks] = React.useState([])
  const { isAuthenticated } = useContext(AuthContext);
  const [detailsCard, setDetailsCard] = React.useState(null)
  const [detailsDeck, setDetailsDeck] = React.useState(null);
  const [index, setIndex] = useState(0);  
  const [displayText, setDisplayText] = useState(false); 
  const navigate = useNavigate();
  const [displayLoading, setDisplayLoading] = useState(false); 

  const slides = [
  {
    image: img1,
    caption: "Découvrez la magie du Multivers — Collectionnez, combattez et triomphez.",
    link: '/addDeck'
  },
  {
    image: img2,
    caption: "Découvrir les cartes de la dernière édition",
    link: '/cards',
    onClick: () => {
      sessionStorage.setItem("cpFilterEditions",  JSON.stringify(["tmc"]));
    }
  },
  {
    image: img3,
    caption: "Quels sont les commandants les plus joués du moment ?",
    link: ('/cardsSave', { state: { order: "cedh" }})
    
  },
];

   const handleClick = () => {
    //navigate(slides[index].link); // navigation uniquement au clic

     const slide = slides[index];

    // Si la slide a une fonction spécifique, on l'exécute
    if (slide.onClick) {
      slide.onClick();
    }

    // Puis navigation si un lien est défini
    if (slide.link) {
      navigate(slide.link);
    }
  };

  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  // Défilement automatique toutes les 5 secondes
  useEffect(() => {
    const timer = setInterval(next, 10000);
    return () => clearInterval(timer);
  }, []);

  // Méthode pour afficher/masquer le zoom sur un deck (DecksPage.js)
  const hoveredDeck = (id, name, format) => {
    if (id && name && format) {
      setDetailsDeck({ id, name, format });
    } else {
      setDetailsDeck(null);
    }
  };

/*Récupérer les images pour les cards */

const data = [
    {
      image: img1,
      caption: "Rechercher une carte",
      link: '/cards'
    },
    {
      image: img2,
      caption: "Construire un deck",
      link: '/addDeck'
    },
    {
      image: img3,
      caption: "Commandants les plus joués",
      link: { path: '/cardsSave', options: { state: { order: "cedh" } } }
    },
    {
      image: img4,
      caption: "Magic x Spider-man",
      link: "/cards",
      onClick: () => {
        sessionStorage.setItem("cpFilterEditions", JSON.stringify(["spm", "spe", "tspm", "pspm"]));
      }
    },
    {
      image: img5,
      caption: "Magic x Ninja Turtles",
      link: "/cards",
      onClick: () => {
        sessionStorage.setItem("cpFilterEditions", JSON.stringify(["pza", "ttmc", "tmc", "tmt", "ttmt"]));
      }
    },
    {
      image: img6,
      caption: "Magic x Avatar the last airbender",
      link: "/cards",
      onClick: () => {
        sessionStorage.setItem("cpFilterEditions", JSON.stringify(["tla", "tle", "ftla"]));
      }
    }
  ];




  const displayColor = (value) => {
    if(value === "INCOLORE") return "none";
  };

// Récupérer le top 3 cartes 
const getTopCards = async () => { 
    try {
        setDisplayLoading(true);
        const response = await axiosInstance.get('/f_all/getTop3Cards' );
        
         const listCards = response.data.map(cardData => Card.fromApi(cardData));
         
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


const getTopCedh = async () => { 
    try {
        setDisplayLoading(true);
        const response = await axiosInstance.get('/f_all/getTop3Commandants' );
        
         const listCards = response.data.map(cardData => Card.fromApi(cardData));         

        setCedh(listCards)
        setDisplayLoading(false);
    }   
    catch (error) {
        setDisplayLoading(false);
        console.log(error);
    }


}
React.useEffect(() => {
  getTopCedh();
}, []);

// Zoom sur une carte
const hoveredCard = (id) => {
         setDetailsCard({ id });

}

// Naviguer vers une carte
const chooseCard = (id) => {
    const cardsIds = cards.map(card => card.apiID);
    navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
    };

// Naviguer vers une carte
const chooseCedh = (id) => {
    const cardsIds = cedh.map(cedh => cedh.apiID);
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


 // Récupère l'image de chaque couleur
  const getColorPics = (value) => {
                                        if(value === "W") {
                                            return white
                                        }
                                        if(value === "U") {
                                            return blue
                                        }
                                        if(value === "G") {
                                            return green
                                        }
                                        if(value === "R") {
                                            return red
                                        }
                                        if(value === "B") {
                                            return black
                                        }
                                        if(value === "colorless") {
                                            return colorless
                                        }
                                       
  }; 

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
        navigate('/sign');
    }
}


  


    return (
    <Section>

      <div className="home-page-container">

      
        {displayLoading && (
          <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
        )}

        {/* Background de la page */}
        <img src={BackgroundPage} className="background-image" alt="background" />

        <div className="banniere-container" onMouseEnter={()=>setDisplayText(true)} onMouseOut={()=>setDisplayText(false)}>
        <img src={banniere} className="banniere-img" alt="background" />
         <h1 className="banniere-title" style={{ backgroundImage: `url(${BackgroundDeckAttributs})`}} ><strong>Les batisseurs du Turlupin</strong></h1>
        <img src={logo} className="logo-img" alt="background" />
        <h3 className="banniere-para">Découvrez la magie du Multivers — Collectionnez, combattez et triomphez</h3>
        </div>

        {/*        
          <div
            className="caroussel" style={{position:'relative'}}
            onMouseEnter={() => setDisplaySlideDetails(true)}
            onMouseLeave={() => setDisplaySlideDetails(false)}
          > 
            {displaySlideDetails && (
              <div className='caroussel-navig'>
                <button className="button-direction-caroussel"
                   onClick={prev}>
                  <MdOutlinePlayArrow className='icon-nav-caroussel' style={{ transform: 'scaleX(-1)'}} />
                </button>
                 <button className="button-direction-caroussel"
                   onClick={next}>
                  <MdOutlinePlayArrow className='icon-nav-caroussel' />
                </button>
                
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.img
                key={slides[index].image}
                src={slides[index].image}
                alt={`Slide ${index + 1}`}
                className="img-caroussel"
                onClick={handleClick}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              />
            </AnimatePresence>

            {displaySlideDetails && (
              <div className="legend-carroussel-container">
                <h3 className="legend-carroussel">{slides[index].caption}</h3>
              </div>
            )}

           
          </div>
        */}
        </div>
      

      <div className="elements-container" style={{position: 'relative'}}>

          {/* Sections avec liens */}
          <CardLink cards={data} />
        
          {/*Mapping des top cartes*/}
          <div className="top-objets-container">
            <Title title={"Top Cartes"} style={{marginTop: "0px"}}/> 
            <div className="top-cards" style={{
                  backgroundImage: `url(${BackgroundTopCards})`, 
                  backgroundSize: 'cover',
                  backgroundPosition: 'top',
                  opacity: 0.9,
                  borderRadius: '10px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                }}>
                {cards.map(card => (
                  <div className="top3-card-details" key={card.id}>
                    <div className="top3_cards-img-container">
                        <img className="top3_cards-img" src={getImageUrl(card.image)} alt="Card-image" 
                        onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard()} 
                         onClick={() => chooseCard(card.apiID)}/>
                    </div>
                        <br/>
                        <h2 className="top-card-likeNumber" >dans {card.decksNumber} decks</h2>
                          {detailsCard && detailsCard.id === card.id && (
                                              <img className="top-card-img-zoom" src={getImageUrl(card.image)} alt="Card-image"/>
                                              )} 
                  </div>
                    )
                  )}
                <MdOutlinePlayArrow className='icon-nav-mapping' onClick={()=>navigate('/cardsSave', { state: { order: "deck" }})}/>
                
            </div>
          </div>  

          {/*Mapping des top commandants*/}
          <div className="top-objets-container" >
            <Title title={"Top Commandants"} style={{marginTop: "0px"}}/> 
            <div className="top-cards" style={{
                  backgroundImage: `url(${BackgroundTopCards})`, 
                  backgroundSize: 'cover',
                  backgroundPosition: 'top',
                  borderRadius: '10px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                }}>
                {cedh.map(card => (
                  <div className="top3-card-details" key={card.id}>
                     <div className="top3_cards-img-container">
                        <img className="top3_cards-img" src={getImageUrl(card.image)} alt="Card-image" 
                        onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard()} 
                        onClick={() => chooseCedh(card.apiID)}/>
                      </div>
                      <br/>
                      <h2 className="top-card-likeNumber" >dans {card.cedhNumber} decks</h2>
                          {detailsCard && detailsCard.id === card.id && (
                                              <img className="top-card-img-zoom" src={getImageUrl(card.image)} alt="Card-image"/>
                                              )} 
                  </div>
                    )
                  )
                }
                <MdOutlinePlayArrow className='icon-nav-mapping' onClick={()=>navigate('/cardsSave', { state: { order: "cedh" }})}/>
            </div>
          </div>  

          {/*Mapping des top decks*/}
          <div className="top-objets-container">
            <Title title={"Top Decks"} style={{marginTop: "0px"}}/> 
            <div className="top-cards" style={{
                  backgroundImage: `url(${BackgroundTopCards})`, 
                  backgroundSize: 'cover',
                  backgroundPosition: 'top',
                  borderRadius: '10px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                }}>
                {decks.map(deck => (
                  <div className="top3-card-details" key={deck.id}>
                    <div className="top3_cards-img-container">
                        <div className="top-deck-details" id='decks-user'  key={deck.id} style={{ backgroundImage: `url(${BackgroundDeck})`,backgroundSize: 'cover',      // L'image couvre tout le div
                                        backgroundPosition: 'center', 
                                        backgroundRepeat: 'no-repeat',
                                        marginTop: '0px'}}> 
                                        <div className='deck-attributs' style={{ backgroundImage: `url(${BackgroundDeckAttributs})`}}>
                                            <img className="top-deck-pp" src={getImageUrl(deck.image)} alt="Deck avatar" onClick={() => chooseDeck(deck.id)}
                                             onMouseEnter={() => hoveredDeck(deck.id, deck.name, deck.format) } onMouseOut={() => hoveredDeck()}/>
                                            
                                            <h3 className="top-deck-name" style={{padding:'2%'}}><strong> {deck.name} </strong></h3>
                                            <h6 className="top-deck-db" onClick={()=>chooseUser(deck.id)}>{deck.deckBuilderName}</h6>

                                            {detailsDeck && detailsDeck.id === deck.id && (
                                                <div className="hover-top-deck-card" style={{ backgroundImage: `url(${BackgroundDeckAttributs})`, zIndex: '1'}}>
                                                    <div className="img-container">
                                                        <img className="hover-top-deck-card-img" src={getImageUrl(deck.image)} alt="Deck mtg"/>
                                                    </div>
                                                    <div className="deck-hover-body" >
                                                                <div className='name-line'>
                                                                <h1 className="hover-top-deck-name"><strong>{deck.name}</strong></h1>
                                                                </div>
                                                                <div className='color-line'>                        
                                                                    <h4 className='color'> Couleurs : </h4>                                                                    
                                                                   {deck.colors && deck.colors.length > 0 && (
                                                                            <div className='mapping-color'>
                                                                              {deck.colors.map((color)  => (
                                                                            <img src={getColorPics(color)} className="color-img-topDeck" style={{display:(displayColor(color))}} alt={color}/>                                
                                                                        ))}
                                                                        </div>
                                                                    )} 
                                                                </div>
                                                                <div className='format-line'>               
                                                                    <h4 className='format'> Format : </h4> 
                                                                    <h4 className='card-format' style={{ backgroundColor: 'green', position: 'relative', fontSize: '1.2em' }}>{deck.format}</h4>
                                                                </div>
                                                                
                                                    </div>                                                
                                                </div>
                                            )}
                                        </div>                                    
                        </div>                          
                    </div>
                    <br/>
                    <h2 className="top-deck-likeNumber">{deck.likeNumber} <FaHeart color="red" style={{position:'relative'}}/></h2>
                  </div>
                    )
                  )
                }
                <MdOutlinePlayArrow className='icon-nav-mapping' onClick={()=>navigate('/decks', { state: { order: "like" }})}/>
            </div>
          </div> 

  
      </div>

    </Section>
  

  )
}

export default HomePage
