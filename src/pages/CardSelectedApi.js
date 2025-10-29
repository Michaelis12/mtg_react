import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./css/CardSelected.css";
import axios from "axios";
import defaultImg from "../assets/mtg-card-back.jpg"
import backgroundPage from "../assets/background_cardsPage2.jpg"
import backgroundPopup from "../assets/background_white.png"
import Section from '../components/section';
import IconButtonHover from '../components/buttonIconHover';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { CgCloseO } from "react-icons/cg";
import { MdOutlinePlayArrow } from "react-icons/md";
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import colorless from "../assets/incolore-mtg.webp"
import blackGreen from "../assets/card-selected-img/black&green-mtg.png";
import blackRed from "../assets/card-selected-img/black&red-mtg.png";
import blackWhite from "../assets/card-selected-img/black&white-mtg.png";
import blueBlack from "../assets/card-selected-img/blue&black-mtg.png";
import blueRed from "../assets/card-selected-img/blue&red-mtg.png";
import blueWhite from "../assets/card-selected-img/white&blue-mtg.png"; 
import greenBlue from "../assets/card-selected-img/green&blue-mtg.png";
import greenWhite from "../assets/card-selected-img/green&white-mtg.png";
import redGreen from "../assets/card-selected-img/red&green-mtg.png";
import redWhite from "../assets/card-selected-img/red&white-mtg.png";
import one from "../assets/card-selected-img/1.png";
import two from "../assets/card-selected-img/2.png";
import three from "../assets/card-selected-img/3.png";
import four from "../assets/card-selected-img/4.png";
import five from "../assets/card-selected-img/5.png";
import six from "../assets/card-selected-img/6.png";
import seven from "../assets/card-selected-img/7.png";
import eight from "../assets/card-selected-img/8.png";
import nine from "../assets/card-selected-img/9.png";
import ten from "../assets/card-selected-img/10.png";
import tap from "../assets/card-selected-img/tap.webp";



import { getImageUrl, getDeckImageUrl } from '../utils/imageUtils';


const CardSelectedApi = () => {  
    const [card, setCard] = React.useState([])
    const formats = [
        "standard",
        "future",
        "historic",
        "gladiator", 
        "pioneer", 
        "modern", 
        "legacy", 
        "pauper", 
        "vintage", 
        "commander", 
        "brawl", 
        "alchemy", 
        "duel", 
        "oldschool", 
        "premodern"

        ];
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.cardID;
    const cards = location.state?.ListCard
    const [cardLikedId, setCardLikedId] = React.useState([])
    const [newID, setNewID] = React.useState("")
    const [displayLoading, setDisplayLoading] = useState(false)

   
        // L'appel asynchrone doit obligatoirement etre fait à l'intérieur de useEffect
        useEffect(() => {
        const getCardSelected = async () => {
            try {
                setDisplayLoading(true)
                if(newID === "") {
                    setNewID(id)
                   }

                if (!newID || newID === "") {
                return;
              }

                const request = await axios.get(`https://api.scryfall.com/cards/${newID}`);
                const response = request.data   

                console.log(request.data)
                setCard(response)

            }   
            catch (error) {
                console.log(error);
            }
            finally {
                setDisplayLoading(false)
            }

    
        }
        getCardSelected();
        }, [id, newID, cardLikedId]);

         // Boutons navigation cartes
        const prevCard = async () => {
            try {

                const currentIndex = cards.indexOf(newID);

                const prevIndex = currentIndex - 1; 

                const prevID = cards[prevIndex];

                setNewID(prevID)

            }   
            catch (error) {
                console.log(error);
            }
            }; 

        // Désactive le bouton si il n'y a plus de decks qui suivent     
        const [prevButtonActive, setPrevButtonActive] = useState(true)
        
        useEffect(() => {
        const desacPrevCard = () => {
            const firstCardId = cards[0];
            if (newID === firstCardId) {
                setPrevButtonActive(false)
            }
            else {
                setPrevButtonActive(true)
            }
        }
        desacPrevCard() }, [newID]);
        
        // Navigue vers la carte suivante dans a liste
        const nextCard = async () => {
            try {
                
                const currentIndex = cards.indexOf(newID);

                const nextIndex = currentIndex + 1; 

                const nextID = cards[nextIndex];

                setNewID(nextID)

            }   
            catch (error) {
                console.log(error);
            }
            };


        
        // Désactive le bouton si il n'ya plus de decks qui suivent     
        const [nextButtonActive, setNextButtonActive] = useState(true)
        
        // Navigue vers la carte précédente dans a liste
        useEffect(() => {
                const desacNextCard = () => {
                    const lastCardId = cards[cards.length - 1];
                    if (newID === lastCardId) {
                        setNextButtonActive(false)
                    }
                    else {
                        setNextButtonActive(true)
                    }
                }
                desacNextCard() }, [newID]);

        
         // Affichage de couleur d'arrière-plan en fonction de la rareté
            const getBackgroundColor = (rarity) => {
            switch (rarity) {
                case "mythic":
                return "linear-gradient(135deg, #D94F4F 0%, #FF8A5C 100%)";  
                case "rare":
                return "linear-gradient(135deg, #D4AF37 0%, #F7C83D 100%)";  
                case "uncommon":
                return "linear-gradient(135deg, #5A6E7F 0%, #A1B2C1 100%)";  
                case "common":
                return "linear-gradient(135deg, #5C5C5C 0%, #9B9B9B 100%)";  
                default:
                return "grey"; 
            }
            };

         // Récupère l'image de chaque couleur
        const getColor = (value) => {
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

      // Désactive le bouton si il n'y a plus de cartes qui suivent     
        const [displayPopup, setDisplayPopup] = useState(false)


        // Affichage de couleur d'arrière-plan en fonction de la légalité dans les formats
        const getBackgroundFormats = (statut) => {


                if (statut === "not_legal" || statut === "not_banned" ) {
                    // Si le format n'existe pas dans l'API -> rouge/rose
                    return 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)';
                }

                // Retourne vert si Legal, jaune si autre
                if (statut === "legal") {
                    return 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                } else {
                    return 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)';
                }
        };



        const getManaImages = (manaCost) => {
        if (!manaCost) return [];

        const symbols = manaCost.match(/\{(.*?)\}/g); // ex: ["{1}", "{R}", "{R}", "{W/U}"]
        if (!symbols) return [];

        // Dictionnaire des coûts numériques
        const numberImages = {
            "1": one,
            "2": two,
            "3": three,
            "4": four,
            "5": five,
            "6": six,
            "7": seven,
            "8": eight,
            "9": nine,
            "10": ten,
        };

        // Dictionnaire des manas hybrides
        const hybridImages = {
            "B/G": blackGreen,
            "B/R": blackRed,
            "B/W": blackWhite,
            "U/B": blueBlack,
            "U/R": blueRed,
            "W/U": blueWhite,
            "G/U": greenBlue,
            "G/W": greenWhite,
            "R/G": redGreen,
            "R/W": redWhite,
        };

        return symbols.map((symbol, index) => {
            const value = symbol.replace(/\{|\}/g, "").toUpperCase();

            // Si c'est une couleur simple → image couleur
            if (["W", "U", "B", "R", "G"].includes(value)) {
            return (
                <img
                key={index}
                src={getColor(value)}
                className="card-mana-devotion-img"
                alt={value}
                />
            );
            }

            // Si c'est un chiffre → image numérique
            if (numberImages[value]) {
            return (
                <img
                key={index}
                src={numberImages[value]}
                className="card-mana-devotion-img"
                alt={value}
                />
            );
            }

            // Si c'est un symbole hybride → image correspondante
            if (hybridImages[value]) {
            return (
                <img
                key={index}
                src={hybridImages[value]}
                className="card-mana-devotion-img"
                alt={value}
                />
            );
            }

            // Sinon : symbole inconnu → rien affiché
            return null;
        });
        };

                const getTextImages = (text) => {
                if (!text) return [];

                // On découpe le texte pour garder les séquences {T}, {1}, etc.
                const parts = text.split(/(\{[^\}]+\})/g);

                return parts.map((part, index) => {
                    // On ne remplace que si c’est un symbole complet, ex: "{T}"
                    const match = part.match(/^\{([^\}]+)\}$/);
                    if (match) {
                    const value = match[1].toUpperCase(); // ex: "T", "1"

                    const symbolImages = {
                        "1": one,
                        "2": two,
                        "3": three,
                        "4": four,
                        "5": five,
                        "6": six,
                        "7": seven,
                        "8": eight,
                        "9": nine,
                        "10": ten,
                        "T": tap,
                        "W": white,
                        "U": blue,
                        "B": black,
                        "R": red,
                        "G": green,
                        "C": colorless,
                        "B/G": blackGreen,
                        "B/R": blackRed,
                        "B/W": blackWhite,
                        "U/B": blueBlack,
                        "U/R": blueRed,
                        "W/U": blueWhite,
                        "G/U": greenBlue,
                        "G/W": greenWhite,
                        "R/G": redGreen,
                        "R/W": redWhite
                    };

                    if (symbolImages[value]) {
                        return (
                        <img
                            key={index}
                            src={symbolImages[value]}
                            alt={value}
                            className="card-text-icon"
                            style={{
                            verticalAlign: "middle",
                            marginLeft: "2px",
                            marginRight: "2px"
                            }}
                        />
                        );
                    }
                    }

                    // Sinon on laisse le texte tel quel
                    return <span key={index}>{part}</span>;
                });
                };

        
        
        const cardTypeSize = (type) => {
                if (!type) return '2em'; 
                return type.length > 25 ? '1.5em' : '1.8em';
            };

        const cardTypeSizeMedium = (type) => {
                if (!type) return '1.5em'; 
                return type.length > 25 ? '1em' : '1.5em';
            };

        const cardTypeSizeMobile = (type) => {
                if (!type) return '1em'; 
                return type.length > 25 ? '0.8em' : '1em';
            };

        const cardTypeMarginMobile = (type) => {
                if (!type) return '0px';
                console.log(type) 
                console.log(type.length)
                //return type.length > 25 ? '5px' : '5px';
                if(type.length > 25 ) {
                  console.log(type.length + " > 35")
                  return  '-10px'
                }
                else {
                    return  '5px'
                }
            };
                         
 
        return ( 
            <Section>  
                <img src={backgroundPage} className="background-image" alt="deck-background" />
                      
                <div className='button-nav-mobile'>   
                    <IconButtonHover onClick={() => prevCard()} disabled={!prevButtonActive}
                     icon={<MdOutlinePlayArrow className='icon-nav' style={{ transform: 'scaleX(-1)' }} />} />
                    <IconButtonHover onClick={() => nextCard()}  disabled={!nextButtonActive}
                     icon={<MdOutlinePlayArrow className='icon-nav' />} />                   
                 </div>

                <div className='card-selected-container'>

                    <div className='button-navig'>  
                        <IconButtonHover onClick={() => prevCard()} disabled={!prevButtonActive}
                        icon={<MdOutlinePlayArrow className='icon-nav' style={{ transform: 'scaleX(-1)' }} />} />
                        <IconButtonHover onClick={() => nextCard()}  disabled={!nextButtonActive}
                        icon={<MdOutlinePlayArrow className='icon-nav' />} />
                    </div>
                                    
                    {/* Carte format desktop */}
                    <div className='card-selected-desktop' style={{ backgroundImage: `url(${backgroundPopup})`, marginTop: '2%'}}>
                                <div className='title-card-container'>
                                  <h1  className='card-selected-name'>{card.name}</h1>
                                </div>
                                <div className='card-selected-content'>
                                  <div className='setAttributs-card-img'>
                                    {card?.image_uris?.normal ? (
                                        <img
                                            className="card-selected-image"
                                            src={card.image_uris.normal}
                                            alt={card.name}
                                            onClick={() => setDisplayPopup(true)}
                                        />                                       
                                        ) : (
                                        <img
                                            className="card-selected-image"
                                            src={defaultImg}
                                            alt={card.name}
                                        />
                                    )}
                                  </div>
                              
                                  <div className="card-selected-attributs" >

                                    {card.game_changer && (
                                      <div className='card-line-attribut'>
                                            <h4 className='card-selected-game-changer' style={{ background : "linear-gradient(135deg, #D4AF37 0%, #F7C83D 100%)" }}>
                                            <strong>Game Changer</strong>
                                            </h4>
                                    </div>  
                                    )}  

                                    {card?.type_line && !card.type_line.includes("Land") && (  
                                    <div className='card-line-attribut'>
                                                <h4 className='card-line-title'> Cout en mana : </h4>
                                                <div className='card-line-devotion'>
                                                    {getManaImages(card.mana_cost)}
                                                </div>
                                    </div>
                                    )}

                                    <div className='card-line-attribut-large-content'>
                                            <h4 className='card-line-title'> Type : </h4>
                                            <h3 className='card-selected-type' 
                                            style={{ fontSize: cardTypeSize(card.type_line), textAlign:"center", marginTop: "5px" }}>
                                            <strong>{card.type_line}</strong>
                                            </h3>

                                            <h3 className='card-selected-type-medium' 
                                            style={{ fontSize: cardTypeSizeMedium(card.type_line), textAlign:"center", marginTop: cardTypeMarginMobile(card.type_line) }}>
                                            <strong>{card.type_line}</strong>
                                            </h3>

                                            <h3 className='card-selected-type-mobile' 
                                            style={{ fontSize: cardTypeSizeMobile(card.type_line), textAlign:"center", marginTop: '-5px' }}>
                                            <strong>{card.type_line}</strong>
                                            </h3>

                                           
                                    </div>

                                    <div className='card-line-attribut'>
                                            <h4 className='card-line-title-rarity'> Rareté : </h4>
                                            <h4 className='card-selected-rarity' 
                                            style={{ background: getBackgroundColor(card.rarity) }}>{card.rarity} </h4>
                                    </div>

                                    <div className='card-line-attribut-large-content'>
                                            <h4 className='card-line-title' style={{marginLeft: '5px'}}> Texte : </h4>
                                            <div className='card-selected-text' style={{textAlign: 'center'}}><strong>{getTextImages(card.oracle_text)}
                                            </strong>
                                            </div>
                                    </div>

                                    
                                    <div className='card-line-attribut-format'>
                                    <h4 className='card-line-title'>Formats :</h4>
                                        {card.legalities && typeof card.legalities === 'object' && Object.keys(card.legalities).length > 0 ? (
                                            <div className='card-selected-format-map'>
                                            {Object.entries(card.legalities).map(([format, status], index) => (
                                                <li
                                                key={index}
                                                className='card-selected-format'
                                                style={{ background: getBackgroundFormats(status) }}
                                                >
                                                {format}
                                                </li>
                                            ))}
                                            </div>
                                        ) : (
                                            <div className='card-selected-format-map'></div>
                                        )}
                                    </div>
 
                                     {card?.type_line && !card.type_line.includes("Land") && (  
                                    <div className='card-line-attribut'>
                                        <h4 className='card-line-title' > Couleurs : </h4> 
                                        {card.colors && (
                                            card.colors.length > 0 ? (
                                                <div className='map-colors-container' style={{ marginTop: "-5px" }}>
                                                {card.colors.map((color, index) => (
                                                    <img
                                                    key={index}
                                                    src={getColor(color)}
                                                    className="card-colors-img"
                                                    alt={color}
                                                    />
                                                ))}
                                                </div>
                                            ) : (
                                                <div className='map-colors-container' style={{ marginTop: "-5px" }}>
                                                <img
                                                    src={getColor("colorless")}
                                                    className="card-colors-img"
                                                    alt="colorless"
                                                />
                                                </div>
                                            )
                                            )}
                                        </div>     
                                     )}                                                        
                                  </div>
                                </div>
                                
                    </div>

                </div> 
                                        
               



                 {/* Affiche la carte zoomée */} 
                {displayPopup && ( 
                    <div className='popup-bckg'>
                        <img className="card-selected-image-zoom" src={getImageUrl(card.image_uris.normal)} alt="Card mtg"/>
                        <CgCloseO className='icon-close-popup' color='white' size={'5em'}  onClick={()=> setDisplayPopup(!displayPopup)}/>
                    </div>  
                )} 

                             
            </Section>
        )
}

export default CardSelectedApi;
