import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./css/CardSelected.css";
import Card from '../model/Card';
import Deck from '../model/Deck';
import axiosInstance from "../api/axiosInstance";
import backgroundPage from "../assets/background_cardsPage2.jpg"
import backgroundPopup from "../assets/background_white.png"
import Section from '../components/section';
import Title from '../components/title';
import ButtonSelect from '../components/buttonSelect';
import NavIconsMobile from '../components/navIconsMobile';
import IconButtonHover from '../components/buttonIconHover';
import ParagraphLikeNumber from '../components/paragraphLikeNumber';
import IconButton from '../components/buttonIcon';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { CgCloseO } from "react-icons/cg";
import { MdOutlinePlayArrow } from "react-icons/md";
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import incolore from "../assets/incolore-mtg.png"
import FooterSection from '../components/footerSection';
import { getImageUrl, getDeckImageUrl } from '../utils/imageUtils';
import innistrad from '../assets/innistrad.png';
import ixalan from '../assets/ixalan.png';
import friches_eldraine from '../assets/friches_eldraine.png';
import meutre_manoir from '../assets/meurtre_manoir.png';
import ravinca from '../assets/ravinca.png';
import modernHorizon from '../assets/modern_horizon.png';
import bloomburrow from '../assets/bloomburrow.png';

const CardSelected = () => {  
    const [card, setCard] = React.useState([])
    const [formats, setFormats] = React.useState([])
    const [cardFormats, setCardFormats] = React.useState([])
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.cardID;
    const cards = location.state?.ListCard
    const [cardLikedId, setCardLikedId] = React.useState([])
    const [newID, setNewID] = React.useState("")
    const [deckLikedId, setDeckLikedId] = React.useState([])
    const [displayLoading, setDisplayLoading] = useState(false)

    // États pour la pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
   
        // L'appel asynchrone doit obligatoirement etre fait à l'intérieur de useEffect
        useEffect(() => {
        const getCardSelected = async () => {
            try {

                if(newID === "") {
                    setNewID(id)
                   }

                if (!newID || newID === "") {
                return;
              }
                
                const request = await axiosInstance.get(`/f_all/getCardID?cardID=${newID}`);

                const response = request.data
    
                   setCard(response)
                   setCardFormats(response.formats)


            }   
            catch (error) {
                console.log(error);
            }

    
        }
        getCardSelected();
        }, [id, newID, cardLikedId]);

         // Boutons navigation cartes
        const prevCard = async () => {
            try {
                const request = await axiosInstance.get(`/f_all/getPrevCard?cardID=${newID}&cardsID=${cards}`);

                const response = request.data

                setNewID(response)
                


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
                const request = await axiosInstance.get(`/f_all/getNextCard?cardID=${newID}&cardsID=${cards}`);

                const response = request.data

                setNewID(response)

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
            case "MYTHIQUE":
                return "linear-gradient(135deg, #D94F4F 0%, #FF8A5C 100%)";  
            case "RARE":
                return "linear-gradient(135deg, #D4AF37 0%, #F7C83D 100%)";  
            case "UNCO":
                return "linear-gradient(135deg, #5A6E7F 0%, #A1B2C1 100%)";  
            case "COMMUNE":
                return "linear-gradient(135deg, #5C5C5C 0%, #9B9B9B 100%)";  

                return "transparent"; 
        }
    }; 

        // Affichage d'image correspondant aux couleurs de la carte
        const getColor = (value) => {
            if(value === "BLANC") {
                return white
            }
            if(value === "BLEU") {
                return blue
            }
            if(value === "VERT") {
                return green
            }
            if(value === "ROUGE") {
                return red
            }
            if(value === "NOIR") {
                return black
            }
            if(value === "INCOLORE") {
                return incolore
            }
           
        }; 

        // Affichage de l'image correspondant à l'édition
    const getEditions = (edition) => {
    switch (edition) {
        case "MYSTICAL":
            return innistrad;  
        case "LES_FRICHES_D_ELDRAINE":
            return friches_eldraine;  
        case "LES_CAVERNES_OUBLIÉES_D_IXALAN":
            return ixalan;  
        case "RAVNICA_REMASTERED":
            return ravinca;
        case "MURDERS_AT_KARLOV_MANOR":
            return meutre_manoir;  
        case "MODERN_HORIZONS_3":
            return modernHorizon; 
        case "BLOOMBURROW":
            return bloomburrow;    

    }
};

      
        
      // Renvoie les cartes likés par l'user connecté
      useEffect(() => {
      const getCardsLiked = async () => {
        try {
            const response = await axiosInstance.get(`/f_user/GetCardsLiked`, { withCredentials: true });               
            
            const listId = response.data
            
            setCardLikedId(listId)
           
        }
        catch (error) {
            console.log(error);
            }
         }
        getCardsLiked();
           }, [cards]);
     

        // Like une carte
        const likeCard = async () => {
                    try {
                    await axiosInstance.post(`/f_user/likeCard?cardId=${newID}`, null, { withCredentials: true });          
                    setCardLikedId(prevState => [...prevState, newID]);                   
                    }   
                    catch (error) {
                        navigate('/sign')
                    }
        };

        // Dislike une carte
        const dislikeCard = async () => {
                    try {

                    await axiosInstance.delete(`/f_user/dislikeCard?cardId=${newID}`, { withCredentials: true });          
                    setCardLikedId(prevState => prevState.filter(cardId => cardId !== newID));
                        }   
                    catch (error) {
                        console.log(error);
                    }
        };
        
        // Appelle soit like soit dislike 
        const likeDislike = () => {

                    if (!cardLikedId.some(cardId => cardId === (newID))) {
                        likeCard();
                    }
                    else {
                        dislikeCard();
                    }

        }

        // Affiche une icone de couleur différente selon le statut de la carte            
        const hearthIcon = () => { 
                    if(!cardLikedId.some(cardId => cardId === (newID))) {
                        return (<FaRegHeart  className='icon-like-object-selected' />)
                    }
                    else {
                        return (<FaHeart className='icon-like-object-selected' color="red"/>)
                    }
            }

        // Récupère les formats
            useEffect(() => {
              const getFormats = async () => {
                  try {
                      const request = await axiosInstance.get(`/f_all/getFormats`);
                              
                      const response = request.data.map(format => format.name);

                      setFormats(response) 
        
                  }   
                  catch (error) {
                      console.log(error);
                  }
              }
              getFormats();
              }, []);

        const getBackgroundFormats = (format) => {
            if (cardFormats.includes(format)) {
                return 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
            } else {
                return 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)';
            }
        };
        // Désactive le bouton si il n'y a plus de cartes qui suivent     
        const [displayPopup, setDisplayPopup] = useState(false)
        const [displayNav, setDisplayNav] = useState(false)



        // Affiche les deck qui utilisent la carte sélectionnée

            const [displayDecks, setDisplayDecks] = React.useState("id")

            // Requeter les decks de l'user

                    
                    const [decks, setDecks] = useState([])
                    const [topDecks, setTopDecks] = useState([])
                    const [detailsDeck, setDetailsDeck] = useState(null)
        
                    useEffect(() => {
                        const getDecksByDate = async () => {
                            try {
                                setDisplayLoading(true) 

                                const params = {
                                    cardID: newID,
                                    page: 0,
                                    size: pageSize
                                }

                                const request = await axiosInstance.get(`/f_all/getDecksUsingCard`, {
                                    params,
                                    paramsSerializer: { indexes: null }
                                });
                                
                                const response = request.data.content.map(
                                    deck => new Deck (deck.id, deck.name, deck.dateCreation, deck.image, deck.format,
                                        deck.colors, deck.manaCost, deck.value, deck.isPublic, deck.deckBuilder,
                                        deck.deckBuilderName, deck.likeNumber, deck.cards, deck.commander
                            ) )
                    
                                setDecks(response)
                                setDisplayLoading(false)
                                setHasMore(!request.data.isLast);                               
                                setPage(1)
                                   
                
                            }   
                            catch (error) {
                                setDisplayLoading(false)
                                console.log(error);
                            }    
                             finally {
                                setIsLoading(false);
                            }       
                        }
                    getDecksByDate();
                    }, [newID, deckLikedId, displayDecks]);


                    const displayMoreDecksByDate = async () => {
 
                        try {
                            setIsLoading(true);

                            const params = {
                                page: page,
                                size: pageSize,
                                cardID: newID
                            };

                            const request = await axiosInstance.get(`/f_all/getDecksUsingCard`, {
                                    params,
                                    paramsSerializer: { indexes: null }
                                });

                            const newDecks = request.data.content.map(
                                    deck => new Deck (deck.id, deck.name, deck.dateCreation, deck.image, deck.format,
                                        deck.colors, deck.manaCost, deck.value, deck.isPublic, deck.deckBuilder,
                                        deck.deckBuilderName, deck.likeNumber, deck.cards, deck.commander
                            ) )

                            setDecks(prevDecks => [...prevDecks, ...newDecks]);

                        setHasMore(!request.data.isLast);
                        setPage(page + 1)
                        } catch (error) {
                        console.error('Erreur de chargement des decks :', error);
                        } finally {
                        setIsLoading(false);
                        }
                };

                useEffect(() => {
                        const getDecksByLikes = async () => {
                            try {
                                setDisplayLoading(true)

                                const params = {
                                    cardID: newID,
                                    page: 0,
                                    size: pageSize
                                }


                                const request = await axiosInstance.get(`/f_all/getTopDecksUsingCard`, {
                                    params,
                                    paramsSerializer: { indexes: null }
                                });
                                
                                const response = request.data.content.map(
                                    deck => new Deck (deck.id, deck.name, deck.dateCreation, deck.image, deck.format,
                                        deck.colors, deck.manaCost, deck.value, deck.isPublic, deck.deckBuilder,
                                        deck.deckBuilderName, deck.likeNumber, deck.cards, deck.commander
                            ) )
                    
                                setTopDecks(response)
                                setDisplayLoading(false)
                                setHasMore(!request.data.isLast); 
                                setPage(1) 
                
                            }   
                            catch (error) {
                                setDisplayLoading(false)
                                console.log(error);
                            }           
                        }
                    getDecksByLikes();
                    }, [newID, deckLikedId, displayDecks]);


                    const displayMoreDecksByLikes = async () => {
 
                        try {
                            setIsLoading(true);

                            const params = {
                                page: page,
                                size: pageSize,
                                cardID: newID
                            };

                            const request = await axiosInstance.get(`/f_all/getTopDecksUsingCard`, {
                                    params,
                                    paramsSerializer: { indexes: null }
                                });

                            const newDecks = request.data.content.map(
                                    deck => new Deck (deck.id, deck.name, deck.dateCreation, deck.image, deck.format,
                                        deck.colors, deck.manaCost, deck.value, deck.isPublic, deck.deckBuilder,
                                        deck.deckBuilderName, deck.likeNumber, deck.cards, deck.commander
                            ) )

                            setTopDecks(prevDecks => [...prevDecks, ...newDecks]);

                        setHasMore(!request.data.isLast);
                        setPage(page + 1)
                        } catch (error) {
                        console.error('Erreur de chargement des decks :', error);
                        } finally {
                        setIsLoading(false);
                        }
                };





        // Afficher les decks de l'user
        

        const [decksNumber, setDecksNumber] = useState("")

        // Afficher les decks dans l'ordre des plus likés

            useEffect(() => {
                const displayDecksNumber = async () => {
                
                    try {
                        const params = {
                                cardID: newID
                            };

                        const request = await axiosInstance.get(`/f_all/getNumberDecksUsingCard`, {
                                    params,
                                    paramsSerializer: { indexes: null }
                    });

                        const number = request.data;

                        setDecksNumber(number)
                        
                    } catch (error) {
                        console.log(error);
                        
                    }                   
                }
                displayDecksNumber();
                   }, [newID]);


                // Afficher les decks dans l'ordre des plus likés
                const displayTopDecks = () => {
                setDisplayDecks("popularity");
                }

                // Afficher les decks dans l'ordre des plus récentes
                const displayIdDecks = () => {
                    setDisplayDecks("id");
                }

                const getBgDate = () => {
                if (displayDecks === "id") {
                    return '#5D3B8C';
                } else {
                    return '#D3D3D3';
                }
                }

                const getBgTop = () => {
                if (displayDecks === "popularity") {
                    return '#5D3B8C';
                } else {
                    return '#D3D3D3';
                }
                }

                const getColorDate = () => {
                if (displayDecks === "id") {
                    return 'white';
                } else {
                    return 'black';
                }
                }

                const getColorTop = () => {
                if (displayDecks === "popularity") {
                    return 'white';
                } else {
                    return 'black';
                }
}

       
                    
                // Affiche le pop-up de chaque deck 
                const hoveredDeck = (id, name, format, likeNumber) => {
                    setDetailsDeck({ id,  name, format, likeNumber });
                    }
                
                // Dirige vers la page de chaque deck
                const chooseDeck = (id) => {
                    const deckIds = decks.map(deck => deck.id);
                    navigate(`/deckSelected`, { state: { deckID: id, ListDeck: deckIds }})
                    };


                // Naviguer vers un user
                const chooseUser = async (deckID) => { 

                try {
                    setDisplayLoading(true);

                    const response = await axiosInstance.get(`f_all/getDeckUser?deckID=${deckID}` );

                    navigate(`/userSelected`, { state: { userID: response.data }})
                    setDisplayLoading(false);
                    } 
                catch (error) {
                    setDisplayLoading(false);
                    console.log(error);
                }
                }
        
                
        
                // Méthode pour afficher ou masquer les images de couleurs
                const displayColor = (value) => {
                    if(value === "INCOLORE") {
                        return "none";
                    }
                };
        
        
                // Renvoie les decks likés par l'user connecté
              useEffect(() => {
              const getDecksLiked = async () => {
                try { 
                    setDisplayLoading(true);
                    const response = await axiosInstance.get(`f_user/getDecksLiked`, { withCredentials: true });              
                    
                    const listId = response.data
                    
                    setDeckLikedId(listId)
                    setDisplayLoading(false);
                    
                   
                }
                catch (error) { 
                    setDisplayLoading(false);
                    console.log(error);
                    }
                 }
                getDecksLiked();
                   }, []);
        
        
                // Méthode liker un deck
                const likeDeck = async (id) => {
                        try {
                            setDisplayLoading(true)
                           await axiosInstance.post(`/f_user/likeDeck?deckId=${id}`, null, { withCredentials: true });          
                           setDeckLikedId(prevState => [...prevState, id]); 
                           //setDeckLikesNumber(deckLikesNumber +1)
                           setDisplayLoading(false)
                        }   
                        catch (error) {
                            setDisplayLoading(false)
                            navigate(`/sign`);
                        }
                };
        
                // Méthode disliker un deck
                const dislikeDeck = async (id) => {
                        try {
                            setDisplayLoading(true)
                           await axiosInstance.delete(`/f_user/dislikeDeck?deckId=${id}`, { withCredentials: true });          
                           setDeckLikedId(prevState => prevState.filter(deckId => deckId !== id));
                           //setDeckLikesNumber(deckLikesNumber -1)
                            setDisplayLoading(false)
                            }   
                        catch (error) {
                            setDisplayLoading(false)
                            navigate(`/sign`);
                        }
                };
        
                // Génère un like ou un dislike selon l'état de la carte
                const likeDislikeDeck = (id) => {
        
                            if (!deckLikedId.some(deckId => deckId === (id))) {
                                likeDeck(id);
                            }
                            else {
                                dislikeDeck(id);
                            }
                } 
        
                // Modifie la couleur de l'icone coeur après un like
                const hearthIconDeck = (id) => {
                        if(!deckLikedId.some(deckId => deckId === (id))) {
                            return (<FaRegHeart className='deckspage-like-icon' size="2em" />)
                        }
                        else {
                            return (<FaHeart className='deckspage-like-icon' size="2em" color="red"/>)
                        }
                } 
                
 
 
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
                                    

                    <div className="card-selected-desktop" style={{ backgroundImage: `url(${backgroundPopup})`}} >
                            <h1 className='deck-name'>{card.name}</h1>
    
                            <div className="card-content">
                                <div className="card-selected-imagelikes">
                                    <img className="card-selected-image" src={getImageUrl(card.image)} alt="Card mtg"/>
                                                                                                        
                                </div>

                                <div className="card-selected-attributs" >
                                    <div className='card-line-attribut'>
                                            <h4 className='card-line-title'> Valeur : </h4>
                                            <h3 className='card-line-value'><strong>{card.value} € </strong></h3>
                                    </div>

                                <div className='card-line-attribut'>
                                        <h4 className='card-line-title'> Type : </h4>
                                        <h3 className='card-line-type' ><strong>{card.type}
                                        {card.legendary === "legendary"&& (
                                            " (Légendaire)"
                                        )}</strong>
                                        </h3>
                                </div>

                                <div className='card-line-attribut'>
                                        <h4 className='card-line-title'> Rareté : </h4>
                                        <h4 className='card-selected-rarity' 
                                        style={{ background: getBackgroundColor(card.rarity) }}>{card.rarity} </h4>
                                </div>
                                    
                                    <div className='card-line-attribut-format'>
                                        <h4 className='card-line-title' > Formats : </h4> 
                                        {card.formats && card.formats.length > 0 && (
                                        <div  className='card-selected-format-map'>
                                            {formats.map((format, index)  => (
                                            <li key={index} className='card-selected-format' style={{ background: getBackgroundFormats(format) }}>{format}</li>                               
                                            ))}
                                        </div>
                                        )}
                                    </div> 

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

                                    <div className='card-line-edition'>
                                                        <h4 className='card-line-title' > Edition : </h4> 
                                                        <img  src={getEditions(card.edition)} className="card-edition-img" alt={card.edition}/>                                
                                    </div>

                                    <h2 className='card-like-number' onClick={likeDislike}>{card.likeNumber} {hearthIcon()}                                 
                                    </h2> 


                                    
                                </div>  
                            </div>        
                    </div>  

                </div> 
                
                <div className='card-like-number-container-mobile'>
                    <h2 className='card-like-number' onClick={likeDislike}>{card.likeNumber} {hearthIcon()}                                 
                    </h2>
                </div>

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


             
                {displayPopup && ( 
                    <div className='popup-bckg'>
                        <img className="card-selected-image-zoom" src={getImageUrl(card.image)} alt="Card mtg"/>
                        <CgCloseO className='icon-close-popup' color='white' size={'5em'}  onClick={()=> setDisplayPopup(!displayPopup)}/>
                    </div>  
                )} 

                {/* Mapping des decks*/}  

                <div className='title-cards-container'>
                            <Title title={`Utilisé dans ${decksNumber} Decks`}/>
                        </div>

                <div className='cards-buttons-order-container' style={{zIndex: '1000'}}>
                <ButtonSelect className={"button-date"} onClick={() => displayIdDecks()} text={"Dernières parutions"}
                                        backgroundColor={getBgDate()} color={getColorDate()}/>
                <ButtonSelect className={"button-top"} onClick={() => displayTopDecks()} text={"Les plus populaires"} 
                                        backgroundColor={getBgTop()} color={getColorTop()}/>
                </div>


                    <div className='display-objects-section'>
                        
                    { displayDecks === "id" && decks.length > 0 && (   
                            <div className='display-decks-section'>                       
                                {decks.map(deck => ( 
                                    <div className="deck-details"  key={deck.id}>
                                        <img className="deck-pp" src={getDeckImageUrl(deck.image)} alt="Deck avatar"
                                        onClick={()=>chooseDeck(deck.id)}
                                        onMouseEnter={() => hoveredDeck(deck.id, deck.name, deck.format, deck.likeNumber )} 
                                        onMouseOut={() => hoveredDeck()}/>
                                        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                                        </div>
                                        <strong className="deck-named"> {deck.name} </strong>
                                        <button><strong className="deck-db" onClick={() => chooseUser(deck.id)}> by {deck.deckBuilderName}</strong></button>
                                        <IconButton   
                                            onClick={()=> likeDislikeDeck(deck.id)} 
                                            
                                            style={{ 
                                                background: 'none', 
                                                boxShadow: 'none', 
                                                paddingTop: '5%', 
                                                border: 'none',                                       
                                            }} 
                                                        
                                            icon={hearthIconDeck(deck.id)} 
                                        />

                                        <ParagraphLikeNumber text={deck.likeNumber} iconStyle={{position:'relative', marginBottom: '3px'}}/>

                                        {detailsDeck && detailsDeck.id === deck.id && (
                                        <div className="hover-deck-card">
                                            <div className="img-container">
                                                <img className="hover-deck-card-img" src={getDeckImageUrl(deck.image)} alt="Deck mtg"/>
                                            </div>
                                                    <div className="deck-hover-body" >
                                                        <div className='name-line'>
                                                        <h1 className="hover-deck-name"> {deck.name}</h1>
                                                        </div>
                                                        <div className='color-line'>                        
                                                            <h4 className='color'> Couleurs : </h4> 
                                                            {deck.colors && deck.colors.length > 0 && (
                                                                <div className='mapping-color'>
                                                                {deck.colors.map((color, index)  => (
                                                                <img src={getColor(color)} key={index}
                                                                 className="color-img-select" style={{display:(displayColor(color))}} alt={color}/>                                
                                                            ))}
                                                                </div>
                                                            )} 
                                                        </div>
                                                        <div className='format-line'>              
                                                            <h4 className='format'> Format : </h4> 
                                                            <h4 className='card-format' style={{ backgroundColor: 'green' }}>{deck.format}</h4>
                                                        </div>
                                                        
                                                    </div>                                                
                                                </div>
                                        )}
                                    </div> 
                            
                                ))}
                            </div>
                    )}

                        { displayDecks === "id" && hasMore && (
                            <button className='next-page-button' disabled={!hasMore}
                            onClick={()=>displayMoreDecksByDate()}>Afficher plus</button> 
                        )}

                    { displayDecks === "popularity" && topDecks.length > 0 && (
                        <div className='display-decks-section'>                       
                                {topDecks.map(deck => ( 
                                    <div className="deck-details"  key={deck.id}>
                                        <img className="deck-pp" src={getDeckImageUrl(deck.image)} alt="Deck avatar"
                                        onClick={()=>chooseDeck(deck.id)}
                                        onMouseEnter={() => hoveredDeck(deck.id, deck.name, deck.format, deck.likeNumber )} 
                                        onMouseOut={() => hoveredDeck()}/>
                                        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                                        </div>
                                        <strong className="deck-named"> {deck.name} </strong>
                                        <button><strong className="deck-db" onClick={() => chooseUser(deck.id)}> by {deck.deckBuilderName}</strong></button>

                                        <IconButton   
                                            onClick={()=> likeDislikeDeck(deck.id)} 
                                            
                                            style={{ 
                                                background: 'none', 
                                                boxShadow: 'none', 
                                                paddingTop: '5%', 
                                                border: 'none',                                       
                                            }} 
                                                        
                                            icon={hearthIconDeck(deck.id)} 
                                        />

                                        <ParagraphLikeNumber text={deck.likeNumber} iconStyle={{position:'relative', marginBottom: '3px'}}/>

                                        {detailsDeck && detailsDeck.id === deck.id && (
                                        <div className="hover-deck-card">
                                            <div className="img-container">
                                                <img className="hover-deck-card-img" src={getDeckImageUrl(deck.image)} alt="Deck mtg"/>
                                            </div>
                                                    <div className="deck-hover-body" >
                                                        <div className='name-line'>
                                                        <h1 className="hover-deck-name"> {deck.name}</h1>
                                                        </div>
                                                        <div className='color-line'>                        
                                                            <h4 className='color'> Couleurs : </h4> 
                                                            {deck.colors && deck.colors.length > 0 && (
                                                                <div className='mapping-color'>
                                                                {deck.colors.map((color, index)  => (
                                                                <img src={getColor(color)} key={index}
                                                                 className="color-img-select" style={{display:(displayColor(color))}} alt={color}/>                                
                                                            ))}
                                                                </div>
                                                            )} 
                                                        </div>
                                                        <div className='format-line'>              
                                                            <h4 className='format'> Format : </h4> 
                                                            <h4 className='card-format' style={{ backgroundColor: 'green' }}>{deck.format}</h4>
                                                        </div>
                                                        
                                                    </div>                                                
                                                </div>
                                        )}
                                    </div> 
                            
                                ))}
                            </div>
                     )}

                     { displayDecks === "popularity" && hasMore && (
                        <button className='next-page-button' disabled={!hasMore} 
                            onClick={()=>displayMoreDecksByLikes()}>Afficher plus</button> 
                     )}
                        
                    </div>                     


                { displayDecks === "id" && decks.length < 1 && (
                            <div className='no-deck-text'>
                                <h4 className='no-deck-title'>  Aucun deck disponible</h4>
                            </div>
                        )}

                { displayDecks === "popularity" && topDecks.length < 1 && (
                             <div className='no-deck-text'>
                                <h4 className='no-deck-title'>  Aucun deck disponible</h4>
                            </div>
                        )} 
                <FooterSection/> 
                             
            </Section>
        )
}

export default CardSelected;
