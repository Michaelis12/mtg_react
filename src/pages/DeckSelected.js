import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation ,  useNavigate} from 'react-router-dom';
import Section from '../components/section';
import Title from '../components/title';
import TitleType from '../components/titleType';
import IconButtonHover from '../components/buttonIconHover';
import axiosInstance from "../api/axiosInstance";
import "./css/DeckSelected.css";
import white from "../assets/white-mtg.png" 
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import colorless from "../assets/incolore-mtg.webp"
import Card from '../model/CardApiSave';
import { GiCardRandom } from "react-icons/gi";
import { FaHeart, FaRegHeart  } from 'react-icons/fa';
import { CgCloseO  } from "react-icons/cg";
import { MdOutlinePlayArrow } from "react-icons/md";
import { IoIosArrowDropleft } from "react-icons/io";
import backgroundPage from "../assets/background_deck_select_page.png"
import backgroundHand from "../assets/background_hand.png"
import backgroundPopup from "../assets/background_white.png"
import loading from "../assets/loading.gif"
import backgroundCedh from "../assets/mtg_wallpaper.jpg"
import { getImageUrl } from '../utils/imageUtils';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
         BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList  } from 'recharts';
import FooterSection from '../components/footerSection';
 


 const DeckSelected = () => { 

       const location = useLocation();
       const navigate = useNavigate();
       const id = location.state?.deckID; 
       const [deck, setDeck] = React.useState([])
       const [deckLikedId, setDeckLikedId] = React.useState([])
       const [deckCards, setDeckCards] = React.useState([])
       const [deckCardsUnit, setDeckCardsUnit] = React.useState([])
       const [deckCardsLength, setDeckCardsLength] = React.useState([])
       const [deckCardsGraphic, setDeckCardsGraphic] = React.useState([])
       const [colors, setColors] = React.useState([])
       const [format, setFormat]= React.useState([])
       const [cmc, setCmc]= React.useState()

       // Contient toutes les cartes du deck d'un type
       const [cardsTypes, setCardsTypes] = React.useState(["Land", "Creature", "Artifact", "Enchantment", "Instant", "Planeswalker", 
                                                    "Sorcery", "Battle", "Conspiracy", "Tribal"])

       
       // Se déclenche à chaque fois qu'une carte est ajoutée ou retirée 
       const [deckSignal, setDeckSignal] = useState(false)
        
        // Renvoie les attributs du deck sélectionné 
        useEffect(() => {
            const getDeckSelected = async () => {
                try {
                    setDisplayLoading(true);
                    const request = await axiosInstance.get(`/f_all/getDeckID?deckID=${id}`);
    
                    const response = request.data
        
                        setDeck(response)
                        setFormat(response.format)
                        setColors(response.colors)

                        setDisplayLoading(false);
  
    
                }   
                catch (error) {
                    setDisplayLoading(false);
                    console.log(error);
                }
    
        
            }
            getDeckSelected();
            }, [id, deckSignal]);


        // N'affiche pas INCOLORE 
        const displayColor = (values, value) => {
            
            if(values.length < 2) {
                return
            }
            
            if(value === "colorless") {
                return "none";
            }
            
        }
 

        // Méthode liker un deck
            const likeDeck = async () => {
                try {
                    console.log(id)
                    setDisplayLoading(true);
                   await axiosInstance.post(`/f_user/likeDeck?deckId=${id}`, null, 
                   { withCredentials: true });          
                   setDeckLikedId(prevState => [...prevState, id]); 
                   setDisplayLoading(false);
                }   
                catch (error) {
                    setDisplayLoading(false);
                    navigate(`/sign`);
                }
            };

            // Méthode disliker un deck
            const dislikeDeck = async () => {
                try {
                    setDisplayLoading(true);
                   await axiosInstance.delete(`/f_user/dislikeDeck?deckId=${id}`, { withCredentials: true });          
                   setDeckLikedId(prevState => prevState.filter(deckId => deckId !== id));
                    setDisplayLoading(false);
                    }   
                catch (error) {
                    setDisplayLoading(false);
                    navigate(`/sign`);
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

            // Génère un like ou un dislike selon l'état de la carte
            const likeDislike = () => {

                    if (!deckLikedId.some(deckId => deckId === (id))) {
                        likeDeck(id);
                    }
                    else {
                        dislikeDeck(id);
                    }
            } 
            // Modifie la couleur de l'icone coeur après un like
            const hearthIcon = () => {
                if(!deckLikedId.some(deckId => deckId === (id))) {
                    return (<FaRegHeart className='deck-like-icon' />)
                }
                else {
                    return (<FaHeart className='deck-like-icon' color="red"/>)
                }}

        // Requete les cartes du deck et les sépare par type
        useEffect(() => {
            const getCardsDeck = async () => {
                try {
                    setDisplayLoading(true);
                    const request = await axiosInstance.get(`/f_all/getCardDeckID?deckID=${id}`);

                    const listCards = request.data.map(cardData => Card.fromApi(cardData));

                    console.log(listCards)

                    setDeckCards(listCards)
                     const uniqueCards = Array.from(
                        new Map(listCards.map(card => [card.id, card])).values()
                    );
                    setDeckCardsUnit(uniqueCards);
                   
                    setDeckCardsLength(listCards.length)

                    setDeckCardsGraphic(listCards)

                
                
                }   
                catch (error) {
                    setDisplayLoading(false);
                    console.log(error);
                }
                finally {
                    setDisplayLoading(false);
                }

        
            }
            getCardsDeck();
            }, [ deckSignal ]);

            
        const [deckCedh, setDeckCedh] = useState([])
        

        // Requete le commandant du deck pour les commanders 
        useEffect(() => {
            const getCedh = async () => { 
                try {
                    
                    if( deck.format === "commander") {

                        setDisplayLoading(true);
                            

                        const params = {
                                deckID : id,
                            }
                        const request = await axiosInstance.get(`/f_all/getCedhDeckID`, {params});
                            
                            
                        setDeckCedh(request.data)
                        setDisplayLoading(false);

                    }
                    
                }   
                catch (error) {
                    setDisplayLoading(false);
                    console.log(error);
                }           
            }
            getCedh();
            }, [deck]);


         useEffect(() => {
        const calculateAverageCmc = () => {
            if (deckCards.length > 0) {

            const validCards = deckCards.filter(card => !card.types.includes("Land"));

            console.log("validCards : " + validCards.length)

            // Calcule la somme des cmc
            const totalCmc = validCards.reduce((sum, card) => sum + card.cmc, 0);

            // Calcule la moyenne
            const averageCmc = totalCmc / validCards.length;

            setCmc(averageCmc.toFixed(2))
            }
        };
        calculateAverageCmc();
        }, [deckCards]);


        
        // Zoom sur la carte sélectionnée
        const [detailsCard, setDetailsCard] = React.useState(null)
        const hoveredCard = (id) => {
         setDetailsCard({ id });

          }

        // Affichage d'image correspondant aux couleurs de la carte
        // Affichage d'image correspondant aux couleurs de la carte
        const getColors = (value) => {
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


        // Consultez les cartes (en masquant les cartes qui seront deja dans le deck si le format est CEDH)
        const navigateCards = () => {
            const data = id
            const deckCardsID = [...deckCards.map(card => card.apiID), deckCedh.apiID];
            navigate(`/cardsDeck`, { state: { deckID: data, cardsDesac: deckCardsID }})
        }


        // Nombre de cartes requises
        const cardsNumber = () => {
            if(deck.format === "commander") {
                return 100
            }
            else {
                return 40
            }
        }

        // Ouvrir un pop-up zoom sur la carte sur la partie mobile

        // Récupérer les cartes sélectionnées dans le storage si l'user a navigué vers une carte
              useEffect(() => {
              const recupStorage = () => {
                  try {
                      const cardsSelected = sessionStorage.getItem('cardsSelected');
                      const cardsUnselected = sessionStorage.getItem('cardsUnselected');
                      
                        
                      if (cardsSelected) {
                          setCardsSelected(JSON.parse(cardsSelected));
                          sessionStorage.removeItem('cardsSelected');
                      }
                      if (cardsUnselected) {
                          setCardsUnselected(JSON.parse(cardsUnselected));
                          sessionStorage.removeItem('cardsUnselected');
                      }
                                                            
                  } catch (error) {
                      console.error("Erreur lors de la récupération du sessionStorage :", error);
                  }
              };
              
            recupStorage();
        }, []);
        


            // Naviguer vers le commandant
            const navCedh = (id) => {
                // On sauvegarde dans le sessionStorage les cartes sélectionnées
                sessionStorage.setItem('cardsSelected', JSON.stringify(cardsSelected));
                sessionStorage.setItem('cardsUnselected', JSON.stringify(cardsUnselected));

                navigate(`/cardSelected`, { state: { cardID: id, ListCard: id  }})
                    }; 
            
            // Naviguer vers une carte du deck
            const navCard = (card) => {
                const cardID = card.apiID;               
                let cardsIds = [];

                // On sauvegarde dans le sessionStorage les cartes sélectionnées
                sessionStorage.setItem('cardsSelected', JSON.stringify(cardsSelected));
                sessionStorage.setItem('cardsUnselected', JSON.stringify(cardsUnselected));


                navigate(`/cardSelected`, { state: { cardID: cardID, ListCard: cardsIds }})
                    };
            
            const [popupHand, setPopupHand]= React.useState(false)
            const [hand, setHand]= React.useState([])

            
            // États pour le popup de zoom et la navigation
            const [displayZoomPopup, setDisplayZoomPopup] = React.useState(false)
            const [currentCardIndex, setCurrentCardIndex] = React.useState(0)
            const [prevButtonActive, setPrevButtonActive] = React.useState(false)
            const [nextButtonActive, setNextButtonActive] = React.useState(false)
            

            // Obtenir une main de 7 cartes
            const getHand = async () => {
                        try { 
                            setDisplayLoading(true);
                            setHand([])
                            
                            const request = await axiosInstance.get(`/f_all/get7CardsDeckID?deckID=${id}`);
                            
                            const listCards = request.data.map(cardData => Card.fromApi(cardData));               
                             
                                setHand(listCards)
                                setDisplayLoading(false);
                        }   
                        catch (error) {
                            setDisplayLoading(false);
                            console.log(error);
                        }
            
                
                    }
            
            // Afficher les 7 cartes
            const displayHand =  () => {
                getHand()

                if(!popupHand) {
                setPopupHand(true)
                }
            }
            
            
            // Gérer l'activation/désactivation des boutons de navigation
            React.useEffect(() => {
                setPrevButtonActive(currentCardIndex > 0);
                setNextButtonActive(currentCardIndex < hand.length - 1);
            }, [currentCardIndex, hand.length]);
            
    // Ajout des états pour le zoom de la main et du land
                const [cardImage, setCardImage] = useState(null);
                const [cardID, setCardID] = useState(null);
                const [cardApiID, setCardApiID] = useState(null);
                const [navigateListID, setNavigateListID] = useState([]);
                const [navigateListApiID, setNavigateListApiID] = useState([]);
                const [listImage, setListImage] = useState([]);
                
                
                // Gérer l'activation/désactivation des boutons de navigation
                React.useEffect(() => {
                    setPrevButtonActive(currentCardIndex > 0);
                    setNextButtonActive(currentCardIndex < hand.length - 1);
                }, [currentCardIndex, hand.length]);
                
                // Ouvre le popup de zoom pour une carte de la main (index) ou un type de carte (objet)
                const openZoomPopup = (cardOrIndex) => {
                    if (cardOrIndex && cardOrIndex.image) {
    
                        
    
                         if(deck.format === "commander") {
                            if(cardOrIndex.id === deckCedh.id) {
                            setNavigateListID([cardOrIndex.id]);
                            setListImage(cardOrIndex.image);
                            setDisplayZoomPopup(true);
                            return
                            }
                        }
    
                        setCardImage(cardOrIndex.image);
                        setCardID(cardOrIndex.id);
                        setCardApiID(cardOrIndex.apiID);
    
                        const uniqueCardIds = new Set(deckCards.map(card => card.id));
                        const deckCardsUnit = Array.from(uniqueCardIds).map(id => 
                            deckCards.find(card => card.id === id)
                        ); 
    
                        const cardTypesIds = deckCardsUnit
                        .filter(card => 
                            card.types && 
                            cardOrIndex.types && 
                            cardOrIndex.types.some(type => card.types.includes(type))
                        )
                        .map(card => card.id);
                        setNavigateListID(cardTypesIds);
                        console.log(cardTypesIds)
    
                        const cardTypesApiIds = deckCardsUnit
                        .filter(card => 
                            card.types && 
                            cardOrIndex.types && 
                            cardOrIndex.types.some(type => card.types.includes(type))
                        )
                        .map(card => card.apiID);
                        setNavigateListApiID(cardTypesApiIds);
                       
                    } else {                    
                        setNavigateListID([]);
                        setNavigateListApiID([]);
                    }
                    setDisplayZoomPopup(true);
                };
        
    
    
                // Boutons navigation cartes
                const prevCard = () => {
                    // 1. Trouver l'index de la carte actuelle dans la liste UNIQUE
                    const currentIndex = navigateListID.indexOf(cardID); 
    
                    // 3. Vérifier que l'on n'est pas au début (currentIndex > 0)
                    if (currentIndex > 0) {
                        
                        // 4. Utiliser la liste UNIQUE pour trouver l'ID précédent
                        const prevCardId = navigateListID[currentIndex - 1]; 
                        
                        // 5. Trouver la carte correspondante
                        const prevCard = deckCards.find(card => card.id === prevCardId);
    
                        if (prevCard) {
                            setCardID(prevCard.id);
                            setCardImage(prevCard.image);
                        }
                    }
                };
    
                           
                                   
                useEffect(() => {
                    const desacPrevCard = () => {
                                       const firstID = navigateListApiID[0];
                                       if (cardID === firstID) {
                                           setPrevCardButtonActive(false)
                                       }
                                       else {
                                           setPrevCardButtonActive(true)
                                       }
                }
                    desacPrevCard() }, [cardID]);
    
    
                // Navigue vers la carte suivante dans a liste
                const nextCard = () => {
                
                    // 1. Trouver l'index de la carte actuelle dans la liste UNIQUE
                    const currentIndex = navigateListID.indexOf(cardID); 
    
                    // ATTENTION: La condition de longueur doit aussi utiliser la liste UNIQUE
                    if (currentIndex >= 0 && currentIndex < navigateListID.length - 1) { 
                        
                        // 2. Utiliser la liste UNIQUE pour trouver l'ID suivant (CORRECTION)
                        const nextCardId = navigateListID[currentIndex + 1]; 
                        
                        // 3. Trouver la carte correspondante
                        const nextCard = deckCards.find(card => card.id === nextCardId);
    
                        if (nextCard) {
                            setCardID(nextCard.id);
                            setCardImage(nextCard.image);
                        }
                    }
                };
    
          
                                    
                // Navigue vers la carte précédente dans a liste
                 useEffect(() => {
                    const desacNextCard = () => {
                                                const lastID = navigateListID[navigateListApiID.length - 1];
                
                                                if (cardID === lastID) {
                                                    setNextCardButtonActive(false)
                                                }
                                                else {
                                                    setNextCardButtonActive(true)
                                                }
                    }
                    desacNextCard() }, [cardID]);
            
     
                        
                        // Désactive le bouton si il n'y a plus de decks qui suivent     
                        const [prevCardButtonActive, setPrevCardButtonActive] = useState(true)
                                
                        useEffect(() => {
                            const desacPrevCard = () => {
                                    const firstID = navigateListID[0];
                                    if (cardID === firstID) {
                                        setPrevCardButtonActive(false)
                                    }
                                    else {
                                        setPrevCardButtonActive(true)
                                    }
                            }
                            desacPrevCard() }, [cardID]);
                    
            
                        
                                
                                // Désactive le bouton si il n'ya plus de decks qui suivent     
                                const [nextCardButtonActive, setNextCardButtonActive] = useState(true)
                                
                                // Navigue vers la carte précédente dans a liste
                                useEffect(() => {
                                        const desacNextCard = () => {
                                            const lastID = navigateListID[navigateListID.length - 1];
            
                                            if (cardID === lastID) {
                                                setNextCardButtonActive(false)
                                            }
                                            else {
                                                setNextCardButtonActive(true)
                                            }
                                        }
                                        desacNextCard() }, [cardID]);
                                    
                    // Fermer le popup de zoom
                     const closePopup =  () => {
                        setCardID(null);
                        setCardApiID(null);
                        setCardImage(null);
                        setNavigateListID([]);
                        setNavigateListApiID([]);
                        setListImage([]);
                        setDisplayZoomPopup(false)
                        setPrevCardButtonActive(false)
                        setNextCardButtonActive(false)
                    };
                    
            
                   
            
        const [displayLoading, setDisplayLoading] = useState(false);
        
        // Graphique de répartition des cartes par types
        // Graphique de répartition des cartes par types
        const getCardsByType = () => {
            // Définir l’ordre de priorité des types
            const cardsTypes = [
                "Land", "Creature", "Artifact", "Enchantment", "Instant", "Planeswalker",
                "Sorcery", "Battle", "Conspiracy", "Tribal"
            ];

            const typeCount = deckCardsGraphic.reduce((acc, card) => {
                // Trouver le premier type de la carte correspondant à cardsTypes
                const firstMappedType = cardsTypes.find(type => card.types?.includes(type));

                if (firstMappedType) {
                acc[firstMappedType] = (acc[firstMappedType] || 0) + 1;
                }

                return acc;
        }, {});

  // Transformer l’objet en tableau exploitable pour le graphique
  return Object.entries(typeCount).map(([type, count]) => ({
    name: type,
    value: count,
  }));
}; 


        // Données pour les graphiques
        const typeData = getCardsByType();

        // Graphique de répartition des cartes par cout en mana
        const getCardsByManaCost = () => {
            const manacostCount = deckCardsGraphic.reduce((acc, card) => {
            if (card.cmc) {
                acc[card.cmc] = acc[card.cmc] ? acc[card.cmc] + 1 : 1;
            }
            return acc;
            }, {});

            return Object.entries(manacostCount).map(([cmc, count]) => ({
            name: cmc,
            value: count
            }));
        };

        // Données pour les graphiques
        const manaCostData = getCardsByManaCost();
      
        // Graphique de répartition des cartes par couleurs
        // Préparer les données pour la répartition des couleurs
        const getCardsByColor = () => {
            const colorCount = deckCardsGraphic.reduce((acc, card) => {
            card.colors.forEach(color => {
                acc[color] = acc[color] ? acc[color] + 1 : 1;
            });
            return acc;
            }, {});

            return Object.entries(colorCount).map(([color, count]) => ({
            name: color,
            value: count,
            }));
        };

        const colorData = getCardsByColor();

        const COLOR_MAP = { 
                'U': '#b5cbe4',
                'W': '#f8ecc0',
                'G': '#177244',
                'R': '#c13534',
                'B': '#140f0c'
                };

        const TYPE_COLORS = [
            '#82ca9d', '#75bfcaff', '#ffc658', '#ff7300', '#ff0000', '#d977d1ff', '#0000ff', '#ffff00'
        ];

        const LEGEND_IMAGES = {
                'U': blue,
                'W': white,
                'G': green,
                'R': red,
                'B': black,
                'colorless': colorless
        };


        const [cardsSelected, setCardsSelected] = useState([])
        const [cardsUnselected, setCardsUnselected] = useState([])

         // Donne le nombre d'exemplaire d'une carte
        const count = (cardID) => {
            const deckCardsid = deckCards.map(card => card.id);
            return deckCardsid.filter(id => id === cardID).length 
        }

        
        return (  
            <Section>  
                { displayLoading && (
                    <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
                )}
                <img src={backgroundPage} className="background-image" alt="background" />



                    {/* Boutons d'action */}
                    <div className='deckbuilding-buttons-container'>                       
                                
                        <div className='admin-users-button'>
                        
                        {/* Afficher une main piochée dans le deck */}
                        <button className='update-deck-container' style={{flexDirection: "row"}} onClick={()=>displayHand()}>
                            <GiCardRandom className='icon-update-user' />
                            <h5 className='update-user-p'>Piocher une main</h5>
                        </button>
                        
                        </div>
                    </div>
                
                
                            {/*La carte format desktop*/}
                            <div className='card-selected-container'> 
                                <div className="deck-card-desktop" style={{ backgroundImage: `url(${backgroundPopup})`, marginTop: '1%'}}>
                                                          <h1 className='deck-name'>{deck.name}</h1>            
                                                          <div className="deck-content">
                                                               <img className="deckbuilding-pp" 
                                                               src={deck.image && deck.image.startsWith('/uploads/') ? `https://christian-missie-bdt-36df9a45.koyeb.app${deck.image}` : deck.image} alt="Deck mtg"/> 
                                
                                                              <div className="deck-selected-attributs" >
                                 
                                                    
                                                                  <div className='card-line-attribut'>
                                                                      <h4 className='deck-selected-line-title'> Format : </h4>
                                                                      <p className='deck-selected-format' style={{marginTop: '-5px'}}>{deck.format} </p>
                                                                  </div>  
                                
                                                                  <div className='card-line-attribut'>
                                                                      <h4 className='deck-selected-line-title' > Couleurs : </h4> 
                                                                      {deck.colors && deck.colors.length > 0 && (
                                                                        <div className='new-deck-colors-mapping' >
                                                                          {deck.colors.map((color, index)  => (
                                                                          <img key={index} src={getColors(color)} className="deck-selected-colors-imgs"
                                                                            style={{display:(displayColor(colors, color)), marginTop: '-5px'}} alt={color}/>                                
                                                                          ))}
                                                                        </div>
                                                                      )}                                                      
                                                                  </div> 

                                                                <div className='card-line-attribut'>              
                                                                    <h4 className='deck-selected-line-title'> Cout en mana moyen : </h4> 
                                                                    <h3><strong>{cmc}</strong></h3>
                                                                </div>

                
                                                              </div>
                                                                  
                                                          </div>  
                  
                                </div> 
     
                            </div>

                             {/*La carte format medium*/}   
                            <h2 className='deck-selected-card-medium-name'style={{marginTop: '2%'}}>{deck.name}</h2> 
                            <div className="deck-selected-card-medium" style={{ backgroundImage: `url(${backgroundPopup})`}}>
                                    <div className="img-container" style={{marginTop: '2%'}}>
                                                          <img className="new-deck-img-mobile" src={deck.image && deck.image.startsWith('/uploads/') ? `https://christian-missie-bdt-36df9a45.koyeb.app${deck.image}` : deck.image} alt="Deck mtg"/>
                                    </div>
                                    <div className="card-medium-body" >
                                
                                                                
                                    <div className='attribut-mobile-container'>
                                                                      <h4 className='deck-selected-line-title'> Format : </h4>
                                                                      <p className='deck-selected-format' style={{marginTop: '-5px'}}>{deck.format} </p>
                                    </div>  
                                
                                    <div className='attribut-mobile-container'>
                                                                      <h4 className='deck-selected-line-title' > Couleurs : </h4> 
                                                                      {deck.colors && deck.colors.length > 0 && (
                                                                        <div className='new-deck-colors-mapping' >
                                                                          {deck.colors.map((color, index)  => (
                                                                          <img key={index} src={getColors(color)} className="deck-selected-colors-imgs"
                                                                            style={{display:(displayColor(colors, color)), marginTop: '-5px'}} alt={color}/>                                
                                                                          ))}
                                                                        </div>
                                                                      )}                                                      
                                    </div> 
                
                                    <div className='attribut-mobile-container'>              
                                                                    <h4 className='deck-selected-line-title'> Cout en mana moyen : </h4> 
                                                                    <h3><strong>{cmc}</strong></h3>
                                    </div>
                
                                   </div> 
                            </div>  
                            
                
                            {/*La carte format mobile*/}
                            <h2 className='deck-card-mobile-name' style={{marginTop: '2%'}}>{deck.name}</h2>
                            <div style={{ backgroundImage: `url(${backgroundPopup})`}} className="deck-card-mobile" >
                                    <div className="img-container">
                                                          <img className="hover-deck-card-img" src={deck.image && deck.image.startsWith('/uploads/') ? `https://christian-missie-bdt-36df9a45.koyeb.app${deck.image}` : deck.image} alt="Deck mtg"/>
                                    </div>
                
                                    <div className="deck-hover-body" >

     
                                                <div className='attribut-mobile-container'>                        
                                                                    <h4 className='attribut-line-title' style={{marginTop: "2px"}}> Couleurs : </h4> 
                                                                    {deck.colors && deck.colors.length > 0 && (
                                                                        <div className='mapping-color'>
                                                                          {deck.colors.map((color, index)  => (
                                                                        <img key={index} src={getColors(color)} className="color-img-select" style={{display:(displayColor(colors, color))}} alt={color}/>                                
                                                                    ))}
                                                                        </div>
                                                                    )} 
                                                </div> 

                                                <div className='attribut-mobile-container'>              
                                                                    <h4 className='attribut-line-title' style={{marginTop: "4px"}}> Format : </h4> 
                                                                    <h4 className='card-format' style={{ backgroundColor: 'green'}}>{deck.format}</h4>
                                                </div>

                                                <div className='attribut-mobile-container'>              
                                                                    <h4 className='attribut-line-title'> Cout en mana moyen : </h4> 
                                                                    <h4  className='card-manacost'>{cmc}</h4>
                                                </div>
                
                                                                
                                    </div> 
                            </div>

                            <button className="deck-like-button" onClick={likeDislike}>{hearthIcon()}</button>                                  


                

            { format === "commander" && (
                <Title title={`Cartes du deck (${deckCards.length + 1} / ${cardsNumber()})`}/>
            )}

            { format !== "commander" && (
                <Title title={`Cartes du deck (${deckCards.length})`}/>
            )}
                        
        {/*Mapping des cartes*/}
        <div className='map-deck-cards'>  
        

            {/*Affichage du commandant*/}
            { format === "commander" && ( 
            <div style={{width: '100%', display : 'flex', flexDirection: 'column', alignItems: 'center'}}>               
                <div className='title-commandant-container'>
                <TitleType title={"Commandant"}/>
                </div>
                <div className="cedh-background" id='creature-card' style={{ backgroundImage: `url(${backgroundCedh})`, 
                backgroundSize: '100%',
                backgroundPosition: 'center'}}>
                <div className="cedh-details">
                    
                    <div className='card-link-desktop'>
                        <img className="cedh-img" src={deckCedh.image && deckCedh.image.startsWith('/uploads/') ? `https://christian-missie-bdt-36df9a45.koyeb.app${deckCedh.image}` : deckCedh.image} alt="creature-img" onClick={()=>navCedh(deckCedh.apiID)}
                                                    onMouseEnter={() => hoveredCard(deckCedh.id) } onMouseOut={() => hoveredCard()}/>
                    </div>

                    <div className='card-link-mobile'>
                        <img className="cedh-img" src={deckCedh.image && deckCedh.image.startsWith('/uploads/') ? `https://christian-missie-bdt-36df9a45.koyeb.app${deckCedh.image}` : deckCedh.image} alt="creature-img" 
                        onClick={()=>openZoomPopup(deckCedh)} />
                    </div>
                                                
                    {detailsCard && detailsCard.id === deckCedh.id && (
                                                <img className="card-img-zoom" src={deckCedh.image && deckCedh.image.startsWith('/uploads/') ? `https://christian-missie-bdt-36df9a45.koyeb.app${deckCedh.image}` : deckCedh.image} alt="Card-image"
                                                />
                    )}
                </div>
                </div>
            </div>
            )} 


            {/*Affichage des cartes par types*/}        
            <div className='decks-types-map'>
                {(() => {
                    // 1️⃣ Créer un mapping { type -> cartes } basé sur cardsTypes order
                    const cardsByMappedType = {};
                    const cardsByMappedTypeUnit = {};

                    // --- Mapping principal ---
                    deckCards.forEach(card => {
                    const firstMappedType = cardsTypes.find(type => card.types.includes(type));
                    if (firstMappedType) {
                        if (!cardsByMappedType[firstMappedType]) cardsByMappedType[firstMappedType] = [];
                        cardsByMappedType[firstMappedType].push(card);
                    }
                    });

                    // --- Mapping pour deckCardsUnit ---
                    deckCardsUnit.forEach(card => {
                    const firstMappedType = cardsTypes.find(type => card.types.includes(type));
                    if (firstMappedType) {
                        if (!cardsByMappedTypeUnit[firstMappedType]) cardsByMappedTypeUnit[firstMappedType] = [];
                        cardsByMappedTypeUnit[firstMappedType].push(card);
                    }
                    });

                    // 2️⃣ Itérer sur cardsTypes pour le rendu
                    return cardsTypes.map(type => {
                    const cardsOfType = cardsByMappedType[type] || [];
                    const cardsOfTypeUnit = cardsByMappedTypeUnit[type] || [];

                    // 🚫 Sauter les types sans cartes
                    if (cardsOfType.length === 0 && cardsOfTypeUnit.length === 0) return null;

                    // ✅ Rendu uniquement pour les types ayant des cartes
                    return (
                        <div 
                        key={type} 
                        className='decks-type-map' 
                        style={{ backgroundImage: `url(${backgroundPopup})`, backgroundPosition: 'top' }}
                        >
                        <TitleType title={`${type} (${cardsOfType.length})`} />

                        <div className='deck-text-map'>
                            {cardsOfTypeUnit.map(card => (
                            <div
                                className="land-text-details"
                                id='land-card'
                                key={card.id}
                            >
                                <div className='card-link-desktop'>
                                <h5
                                    className='land-text-name'
                                    onMouseEnter={() => hoveredCard(card.id)}
                                    onMouseOut={() => hoveredCard()}
                                    onClick={() => navCard(card)}
                                >
                                    {card.name}
                                </h5>
                                {card.types.includes("Basic") && (
                                    <p style={{marginTop: '0px'}} className="p-cards-deck-length">basic land</p>
                                )}
                                </div> 

                                <div className='card-link-mobile'>
                                <h5 className='land-text-name' onClick={() => openZoomPopup(card)}>
                                    {card.name}
                                </h5>
                                </div>

                                {detailsCard && detailsCard.id === card.id && (
                                <img
                                    className="card-img-zoom"
                                    src={
                                    card.image && card.image.startsWith('/uploads/')
                                        ? `https://christian-missie-bdt-36df9a45.koyeb.app${card.image}`
                                        : card.image
                                    }
                                    alt="Card-image"
                                />
                                )}
                                {format !== "commander" && (
                                    <p className='p-card-length'>{count(card.id)}</p>
                                )}
                            </div>
                            ))}
                        </div>
                        </div>
                    );
                    });
                })()}
            </div>



            
            {/*Graphiques*/}
            <div className='stats-conatainer' >
                    <Title title={`Statistiques`} />       

                    <div className='graphics-container'> 

                        <div className='graphic-container' >
                            <h3 className='graphic-title'>Courbe de mana</h3>
                            <ResponsiveContainer
                                    width="100%"
                                    height={window.innerWidth < 768 ? 300 : 400}
                                    className="responsive-container"
                                    style={{
                                        backgroundImage: `url(${backgroundPopup})`,
                                        backgroundPosition: 'top',
                                    }}
                                    >
                                    <BarChart
                                        data={manaCostData}
                                        margin={{ top: 20, right: 20, left: window.innerWidth < 768 ? 10 : 20, bottom: 30 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        
                                        {/* L'axe X doit afficher le nom du coût de mana (par exemple '1', '3', '5') */}
                                        <XAxis
                                        dataKey="name"  // Affiche la propriété "name" dans les données
                                        label={{
                                            value: 'Coût en mana',
                                            position: 'insideBottom',
                                            offset: -5,
                                            style: { fontWeight: 'bold', fontStyle: 'italic', color: 'grey' }
                                        }}
                                        style={{ paddingBottom: '5%' }}
                                        />
                                        
                                        <YAxis />
                                        
                                        <Bar dataKey="value" fill="#8884d8">
                                        {/* Ajout de l'affichage des labels personnalisés sur chaque barre */}
                                        <LabelList
                                            content={({ x, y, width, height, value, index }) => {
                                            const { name } = manaCostData[index];
                                            const isMobile = window.innerWidth < 768;
                                            const boxWidth = isMobile ? 40 : 140;
                                            const boxHeight = isMobile ? 25 : 50;
                                            const chartHeight = isMobile ? 300 : 400;
                                            const paddingFromBottom = 10;

                                            const centerX = x + width / 2;
                                            let centerY = y + height / 2;

                                            const bottomEdge = centerY + boxHeight / 2;
                                            if (bottomEdge > chartHeight - paddingFromBottom) {
                                                centerY = chartHeight - paddingFromBottom - boxHeight / 2;
                                            }

                                            return (
                                                <g>
                                                <foreignObject
                                                    x={centerX - boxWidth / 2}
                                                    y={centerY - boxHeight / 2}
                                                    width={boxWidth}
                                                    height={boxHeight}
                                                >
                                                    <div
                                                    xmlns="http://www.w3.org/1999/xhtml"
                                                    style={{
                                                        backgroundColor: 'white',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '6px',
                                                        padding: isMobile ? '2px' : '6px',
                                                        textAlign: 'center',
                                                        fontSize: isMobile ? '12px' : '14px',
                                                        fontWeight: 'bold',
                                                        width: '100%',
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        boxSizing: 'border-box',
                                                    }}
                                                    >
                                                    <p style={{ margin: 0 }}>{isMobile ? value : `${value} cartes`}</p>
                                                    </div>
                                                </foreignObject>
                                                </g>
                                            );
                                            }}
                                        />
                                        </Bar>
                                    </BarChart>
                            </ResponsiveContainer>
                    </div>                                      


                        <div className='graphic-container'>
                            <h3 className='graphic-title'>Répartition par couleur</h3>
                            <ResponsiveContainer
                            className='responsive-container'
                            width="100%"
                            height={400}
                            style={{
                                backgroundImage: `url(${backgroundPopup})`,
                                backgroundPosition: 'top'
                            }}
                        >
                            <PieChart>
                                <Pie
                                    data={colorData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius="90%"
                                    fill="#8884d8"
                                    labelLine={false}
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                                        const RADIAN = Math.PI / 180;
                                        // On augmente le radius pour éloigner les objets
                                        const radius = innerRadius + (outerRadius - innerRadius) / 2 + 30; // On ajoute 30px pour éloigner les objets
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                        const entry = colorData[index];

                                        return (
                                            <g transform={`translate(${x},${y})`}>
                                                <foreignObject x={-30} y={-35} width={80} height={70}>
                                                    <div
                                                        xmlns="http://www.w3.org/1999/xhtml"
                                                        style={{
                                                            backgroundColor: 'white',
                                                            border: '1px solid #ccc',
                                                            padding: '10px',
                                                            borderRadius: '8px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '14px',
                                                            fontWeight: 'bold',
                                                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                                                        }}
                                                    >
                                                        <img
                                                            src={LEGEND_IMAGES[entry.name]}
                                                            alt={entry.name}
                                                            style={{ width: '30px', height: '30px', marginRight: 8 }}
                                                        />
                                                        <span>{entry.value}</span>
                                                    </div>
                                                </foreignObject>
                                            </g>
                                        );
                                    }}
                                >
                                    {colorData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLOR_MAP[entry.name] || '#CCCCCC'} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>


            
                        </div>
                    </div> 

                    <div className='graphic-container-type'>      
                            <h3 className='graphic-title'>Répartition par type</h3>
                            <ResponsiveContainer
                                width="100%"
                                height={window.innerWidth < 768 ? 300 : 400}
                                className="responsive-container"
                                style={{
                                    backgroundImage: `url(${backgroundPopup})`,
                                    backgroundPosition: 'top'
                                }}
                                >
                                <BarChart data={typeData} margin={{ top: 20, right: 20, left: window.innerWidth < 768 ? 10 : 20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <YAxis />
                                    <XAxis hide={true} />
                                    {/* SUPPRIMER le Tooltip */}
                                    {/* <Tooltip content={<CustomTooltipType />} /> */}
                                    <Bar dataKey="value" fill="#8884d8">
                                        <LabelList
                                        content={({ x, y, width, height, value, index }) => {
                                            const { name } = typeData[index];
                                            const isMobile = window.innerWidth < 768;
                                            const boxWidth = isMobile ? 40 : 140;
                                            const boxHeight = isMobile ? 25 : 70;
                                            const chartHeight = isMobile ? 300 : 400;
                                            const paddingFromBottom = 10;

                                            const centerX = x + width / 2;
                                            let centerY = y + height / 2;

                                            const bottomEdge = centerY + boxHeight / 2;
                                            if (bottomEdge > chartHeight - paddingFromBottom) {
                                            centerY = chartHeight - paddingFromBottom - boxHeight / 2;
                                            }

                                            return (
                                            <g>
                                                <foreignObject
                                                x={centerX - boxWidth / 2}
                                                y={centerY - boxHeight / 2}
                                                width={boxWidth}
                                                height={boxHeight}
                                                >
                                                <div
                                                    xmlns="http://www.w3.org/1999/xhtml"
                                                    style={{
                                                    backgroundColor: isMobile ? TYPE_COLORS[index % TYPE_COLORS.length] : 'white',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '6px',
                                                    padding: isMobile ? '2px' : '6px',
                                                    textAlign: 'center',
                                                    fontSize: isMobile ? '12px' : '14px',
                                                    fontWeight: 'bold',
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    boxSizing: 'border-box',
                                                    color: isMobile ? 'white' : 'black'
                                                    }}
                                                >
                                                    {isMobile ? (
                                                        <p style={{ margin: 0 }}>{value}</p>
                                                    ) : (
                                                        <>
                                                            <p
                                                            style={{
                                                                margin: 0,
                                                                color: 'white',
                                                                backgroundColor: '#5D3B8C',
                                                                width: '100%',
                                                                padding: '6px 0',
                                                                fontSize: '14px',
                                                            }}
                                                            >
                                                            {name}
                                                            </p>
                                                            <p style={{ margin: '6px 0 0 0', fontSize: '14px' }}>x {value}</p>
                                                        </>
                                                    )}
                                                </div>
                                                </foreignObject>
                                            </g>
                                            );
                                        }}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>

                            {/* Légendes externes pour mobile */}
                                <div className='legend-graphic-types'>
                                    {typeData.map((type, index) => (
                                        <div key={type.name} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '5px',
                                            fontSize: '10px'
                                        }}>
                                            <div style={{
                                                width: '12px',
                                                height: '12px',
                                                backgroundColor: TYPE_COLORS[index % TYPE_COLORS.length],
                                                borderRadius: '2px'
                                            }}></div>
                                            <span>{type.name}</span>
                                        </div>
                                    ))}
                                </div>

                    </div>

            </div>
            <IoIosArrowDropleft className='icon-close-popup' size={'5em'}  onClick={()=>navigate(-1)}/>      
    
        </div>
                                          

                {/* Popup de zoom carte mobile */}
                {displayZoomPopup && cardImage && (
                    <div className='popup-bckg'>                                
                                                                <img className="card-selected-image-zoom" src={getImageUrl(cardImage)} alt="Card mtg"/>
                                                                <button className='nav-card-button' onClick={()=>(navigate(`/cardSelected`, { state: { cardID: cardApiID, ListCard: navigateListApiID  }}))}>Afficher détails</button>
                                                                <div className='button-nav-mobile' style={{position : 'fixed', marginTop: '48vh', zIndex: '102', color: 'white'}} >   
                                                                    <IconButtonHover onClick={() => prevCard()} disabled={!prevCardButtonActive}
                                                                    icon={<MdOutlinePlayArrow className='icon-nav' color="white" style={{ transform: 'scaleX(-1)' }} />} />
                                                                    <IconButtonHover onClick={() => nextCard()}  disabled={!nextCardButtonActive}
                                                                    icon={<MdOutlinePlayArrow className='icon-nav' color="white" />} />                   
                                                                </div>
                                                               
                                                                <CgCloseO className='icon-close-popup' style={{zIndex: '103'}} color='white' size={'5em'} onClick={()=> closePopup()}/>
                    </div>
                                )} 
            
                
                {/* Popup affichage d'une main */}
                { popupHand && (
                            <div className='popup-bckg'> 
                                <div className='hand-background' style={{
                                        backgroundImage:`url(${backgroundHand})`,
                                        backgroundPosition: "center",   
                                        backgroundRepeat: "no-repeat"}}>
                                     <div className='hand-mapping'>
                                        {hand.map((card, index) => ( 
                                            <div className="cards-hand-details" key={index}>
                                                <img className="cards-draw-img" src={getImageUrl(card.image)} alt="Card-image"
                                                onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                                                onClick={() => openZoomPopup(card)}
                                                />
                                                
                                            </div>
                                        
                                        ))}
                                    </div>
                                <button className='update-deck-container' style={{flexDirection: 'row'}} onClick={()=>displayHand()}>
                                    <GiCardRandom className='icon-update-user' />
                                    <h5 className='update-user-p'>Piocher une main</h5>
                                </button>
                                   
                                </div>
                                 

                                <CgCloseO className='icon-close-popup-desktop'
                                color='white' size={'5em'} onClick={()=> {setPopupHand(false); setHand([])}} style={{position: 'fixed',
                                    bottom: '10'
                                }}/> 

                                <CgCloseO className='icon-close-popup-mobile'
                                color='white' size={'5em'} onClick={()=> {setPopupHand(false); setHand([])}} style={{position: 'fixed',
                                    bottom: '10'
                                }}/>
                            </div>
                        )}
                        
                {/* Popup de zoom sur une carte de la main */}
                {displayZoomPopup && hand.length > 0 && (
                            <div className='popup-bckg'>                                
                                <img className="card-selected-image-zoom" src={getImageUrl(cardImage)} alt="Card mtg"/>
                                <CgCloseO className='icon-close-popup' color='white' size={'5em'} onClick={()=> setDisplayZoomPopup(false)}/>
                            </div>
                )}


        <FooterSection/>
                                
    </Section> 
        )

 }

export default DeckSelected;
