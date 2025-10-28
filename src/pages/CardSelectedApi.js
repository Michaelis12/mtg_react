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



        // Affichage des symboles de mana en image
        const getManaImages = (manaCost) => {
                if (!manaCost) return [];

                const symbols = manaCost.match(/\{(.*?)\}/g); // ["{1}", "{R}", "{R}"]
                if (!symbols) return [];

                return symbols.map((symbol, index) => {
                    const value = symbol.replace(/\{|\}/g, "");

                    // Si c'est une couleur connue → image
                    if (["W","U","B","R","G"].includes(value.toUpperCase())) {
                    return (
                        <img
                        key={index}
                        src={getColor(value.toUpperCase())}
                        className="card-mana-devotion-img"
                        style={{margin: '0px'}}
                        alt={value}
                        />
                    );
                    }

                    // Sinon c'est un coût générique (chiffre) → afficher le texte
                    return (
                    <span key={index} className="card-mana-generic">
                        {value}
                    </span>
                    );
                });
                };
        
        
        const cardTypeSize = (type) => {
                if (!type) return '2em'; 
                return type.length > 25 ? '1.5em' : '2em';
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
                                            <h4 className='card-selected-rarity' style={{ background : "linear-gradient(135deg, #D4AF37 0%, #F7C83D 100%)" }}>
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

                                    <div className='card-line-attribut'>
                                            <h4 className='card-line-title'> Type : </h4>
                                            <h3 style={{ fontSize: cardTypeSize(card.type_line), textAlign:"center" }}>
                                            <strong>{card.type_line}</strong>
                                            </h3>
                                    </div>

                                    <div className='card-line-attribut'>
                                            <h4 className='card-line-title'> Rareté : </h4>
                                            <h4 className='card-selected-rarity' 
                                            style={{ background: getBackgroundColor(card.rarity) }}>{card.rarity} </h4>
                                    </div>

                                    <div className='card-line-attribut'>
                                            <h4 className='card-line-title'> Texte : </h4>
                                            <h6 style={{textAlign: 'center'}}><strong>{card.oracle_text}
                                            </strong>
                                            </h6>
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
                                        {card.colors && card.colors.length > 0 && (
                                        <div className='map-colors-container' style={{marginTop: "-5px"}} >
                                            {card.colors.map((color, index)  => (
                                            <img key={index} src={getColor(color)} className="card-colors-img" alt={color}/>                                
                                            ))}
                                        </div>
                                        )}
                                    </div>     
                                     )}                                                        
                                   </div>
                                </div>
                                
                    </div>

                </div> 
                                        
                {/*

                <h2 className='card-selected-tablet-name'>{card.name}</h2>
                <div className="card-selected-tablet" style={{ backgroundImage: `url(${backgroundPopup})`}}>
                    <div className="img-container">
                                          <img className="card-image-mobile" src={getImageUrl(card.image)} alt="Deck mtg"/>
                    </div>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>                           
                            <div className='card-line-attribut'>
                                <h4 style={{marginTop: '-10px'}} className='deck-medium-line-title'> Valeur : </h4>
                                <h3 className='card-mobile-value' style={{color: 'black', marginTop: '0px'}} ><strong>{card.value} €</strong></h3>
                            </div>


                              <div className='card-line-attribut'>
                                    <h4 className='deck-medium-line-title' style={{marginTop: '-10px'}}> Type : </h4>
                                    <h3 style={{color: 'black'}} className='card-mobile-type'><strong>{card.type}</strong></h3>
                              </div>
                                    
                               <div className='card-line-attribut'>
                                    <h4 className='deck-medium-line-title' style={{marginTop: '0px'}}> Rareté : </h4>
                                    <h4 className='card-selected-rarity' 
                                        style={{ background: getBackgroundColor(card.rarity) }}>{card.rarity} </h4>
                              </div>
                               

                                
                                <div className='card-line-attribut-format'>
                                        <h4 className='deck-medium-line-title' >Formats : </h4> 
                                        {card.formats && card.formats.length > 0 && (
                                        <div  className='card-selected-format-map'>
                                            {formats.map((format, index)  => (
                                            <li key={index} className='card-selected-format' style={{ background: getBackgroundFormats(format) }}>{format}</li>                               
                                            ))}
                                        </div>
                                        )}
                                    </div> 

                                <div className='card-line-attribut'>
                                    <h4 className='deck-medium-line-title' style={{marginTop: '5px'}} > Couleurs : </h4> 
                                    {card.colors && card.colors.length > 0 && (
                                      <div className='card-selected-colors' >
                                        {card.colors.map((color, index)  => (
                                        <img key={index} src={getColor(color)} className="card-colors-imgs" alt={color}/>                                
                                        ))}
                                      </div>
                                    )}
                                </div> 


                                <div className='card-line-edition'>
                                                        <h4 className='deck-medium-line-title' > Edition : </h4> 
                                                        <img  src={getEditions(card.edition)} className="card-edition-img" alt={card.edition}/>                                
                                    </div>

                            </div> 
                </div>



                <div className="card-selected-mobile"> 
                                        <div className="header-card" style={{backgroundImage:`url(${backgroundPopup})`}}>
                                            <img src={getImageUrl(card.image)}  onClick={()=> setDisplayPopup(true)}
                                            className="card-image-mobile" alt="user-pp"/>
                                                <h1 className="user-pseudo">{card.name}</h1>   
                                        </div>  

                    

                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>                           
                            <div className='card-line-attribut'>
                                <h4 className='user-date-line-title'> Valeur : </h4>
                                <h4 className='card-mobile-value'><strong>{card.value} € </strong></h4>
                            </div>


                              <div className='card-line-attribut'>
                                    <h4 className='user-date-line-title'> Type : </h4>
                                    <h4 className='card-mobile-type'><strong>{card.type}</strong></h4>
                              </div>
                                    
                               <div className='card-line-attribut'>
                                    <h4 className='user-date-line-title' style={{marginTop: '5px'}}> Rareté : </h4>
                                    <h4 className='card-selected-rarity' 
                                        style={{ background: getBackgroundColor(card.rarity) }}>{card.rarity} </h4>
                              </div>
                               

                                
                                <div className='card-line-attribut-format'>
                                        <h4 className='user-date-line-title' >Formats : </h4> 
                                        {card.formats && card.formats.length > 0 && (
                                        <div  className='card-selected-format-map'>
                                            {formats.map((format, index)  => (
                                            <li key={index} className='card-selected-format' style={{ background: getBackgroundFormats(format) }}>{format}</li>                               
                                            ))}
                                        </div>
                                        )}
                                    </div> 

                                <div className='card-line-attribut'>
                                    <h4 className='user-date-line-title' style={{marginTop: '5px'}} > Couleurs : </h4> 
                                    {card.colors && card.colors.length > 0 && (
                                      <div className='card-selected-colors' >
                                        {card.colors.map((color, index)  => (
                                        <img key={index} src={getColor(color)} className="card-colors-imgs" alt={color}/>                                
                                        ))}
                                      </div>
                                    )}
                                </div> 

                                <div className='card-line-edition'>
                                                        <h4 className='user-date-line-title' > Edition : </h4> 
                                                        <img  src={getEditions(card.edition)} className="card-edition-img" alt={card.edition}/>                                
                                    </div>

                            </div>    

                            </div>
                */}


                 {/* Affiche la carte zoomée */} 
                {displayPopup && ( 
                    <div className='popup-bckg'>
                        <img className="card-selected-image-zoom" src={getImageUrl(card.image)} alt="Card mtg"/>
                        <CgCloseO className='icon-close-popup' color='white' size={'5em'}  onClick={()=> setDisplayPopup(!displayPopup)}/>
                    </div>  
                )} 

                             
            </Section>
        )
}

export default CardSelectedApi;
