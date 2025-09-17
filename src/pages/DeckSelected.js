import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation ,  useNavigate} from 'react-router-dom';
import Section from '../components/section';
import Title from '../components/title';
import TitleType from '../components/titleType';
import TitleArrow from '../components/titleArrow';
import IconButtonHover from '../components/buttonIconHover';
import axiosInstance from "../api/axiosInstance";
import "./css/DeckSelected.css";
import white from "../assets/white-mtg.png" 
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import incolore from "../assets/incolore-mtg.png"
import Card from '../model/Card';
import Deck from '../model/Deck';
import NavIconsMobile from '../components/navIconsMobile';
import { FaHeart, FaRegHeart  } from 'react-icons/fa';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { SlRefresh } from "react-icons/sl";
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
import { VscHeart } from 'react-icons/vsc';
 


const DeckSelected = () => { 
    const location = useLocation()
    const navigate = useNavigate()
    const id = location.state?.deckID 
    const decks = location.state?.ListDeck
    const [deck, setDeck] = React.useState([])
    const [cards, setCards] = React.useState([]) 
    const [newID, setNewID] = React.useState("")
    const [deckLikesNumber, setDeckLikesNumber] = React.useState("")
    const [deckLikedId, setDeckLikedId] = React.useState([])
    const [displayLoading, setDisplayLoading] = useState(false);

      
        // Renvoie les attributs du deck sélectionné
        useEffect(() => {
        const getDeckSelected = async () => {
            try {
                setDisplayLoading(true);
                if(newID === "") {
                    setNewID(id)
                }
                const request = await axiosInstance.get(`/f_all/getDeckID?deckID=${newID}`);

                const response = request.data
    
                   setDeck(response)
                   setDisplayLoading(false);
            }   
            catch (error) {
                setDisplayLoading(false);
                console.log(error);
            }

    
        }
        getDeckSelected();
        }, [id, newID, deckLikedId]);

        const [detailsCard, setDetailsCard] = React.useState(null)
        const [unitCards, setUnitCards] = React.useState([])
        

        // Renvoie les cartes du deck sélectionné
        useEffect(() => {
            const getCardsDeck = async () => {
                try {
                    setDisplayLoading(true);
                    const response = await axiosInstance.get(`/f_all/getCardDeckID?deckID=${newID}`);

                    const listCards = response.data.map(
                        card => new Card (card.id, card.name, card.text, card.image, card.manaCost, card.value, card.formats,
                                        card.colors, card.type, card.rarity, card.edition, card.decks
                    ) ) 
                    setCards(listCards) 
    
                    const uniqueCardsMap = new Map();

                    // Parcours des cartes et ajoute uniquement les cartes avec un ID unique
                    const listUnitCards = response.data.map(card => {
                        // Si la carte n'a pas encore été rencontrée (par son ID), on l'ajoute au Map
                        if (!uniqueCardsMap.has(card.id)) {
                            uniqueCardsMap.set(card.id, true);  // Enregistrer l'ID comme déjà vu
                            return new Card(
                                card.id, 
                                card.name, 
                                card.text, 
                                card.image, 
                                card.manaCost, 
                                card.value, 
                                card.formats,
                                card.colors, 
                                card.type, 
                                card.rarity, 
                                card.edition, 
                                card.decks
                            );
                        }
                        return null;  // Ignorer les cartes dupliquées
                    }).filter(card => card !== null);

                    setUnitCards(listUnitCards)
                    setDisplayLoading(false);
                }   
                catch (error) {
                    setDisplayLoading(false);
                    console.log(error);
                }
    
        
            }
            getCardsDeck();
            }, [newID]);


        const [deckCedh, setDeckCedh] = useState([])
                
        
                // Requete le commandant du deck pour les commanders 
                useEffect(() => {
                    const getCedh = async () => { 
                        try {
                            
                            if( deck.format === "COMMANDER") {
        
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


        // Contient toutes les cartes du deck d'un type
        const [deckLands, setDeckLands] = useState([])
        const [deckCreatures, setDeckCreatures] = useState([])
        const [deckEnchants, setDeckEnchants] = useState([])
        const [deckSpells, setDeckSpells] = useState([])
        const [deckArtefacts, setDeckArtefacts] = useState([])
        const [deckPlaneswalkers, setDeckPlaneswalkers] = useState([])

        // Contient toutes les cartes du deck UNIQUES d'un type
        const [deckLandsUnit, setDeckLandsUnit] = useState([])
        const [deckCreaturesUnit, setDeckCreaturesUnit] = useState([])
        const [deckEnchantsUnit, setDeckEnchantsUnit] = useState([])
        const [deckSpellsUnit, setDeckSpellsUnit] = useState([])
        const [deckArtefactsUnit, setDeckArtefactsUnit] = useState([])
        const [deckPlaneswalkersUnit, setDeckPlaneswalkersUnit] = useState([])
        
        // Requete les cartes du deck par type 
            const getCardByType = async (...cardTypes  ) => {
                try {
                    setDisplayLoading(true);
                    const params = {
                        deckID : newID,
                        type: cardTypes.join(',')
                    }
                    const request = await axiosInstance.get(`/f_all/getTypeCardDeckID`, {params});
                    
                    const listCards = request.data.map(
                        card => new Card (card.id, card.name, card.text, card.image, card.manaCost, card.value, card.formats,
                                        card.colors, card.type, card.rarity, card.edition, card.decks
                ) ) 
                
                    // Si la méthode est  appelée avec TERRAIN renvoie le résultat dans deckLands
                    if(cardTypes.includes("TERRAIN")) {
                                    setDeckLands(listCards)
                
                                    const uniqueLandsMap = new Map();
                
                                    const listUnitLands = request.data.map(card => {
                                        // Si la carte n'a pas encore été rencontrée (par son ID), on l'ajoute au Map
                                        if (!uniqueLandsMap.has(card.id)) {
                                            uniqueLandsMap.set(card.id, true);  // Enregistrer l'ID comme déjà vu
                                            return new Card (card.id, card.name, card.text, card.image, card.manaCost, card.value, card.formats,
                                                card.colors, card.type, card.rarity, card.edition, card.decks );
                                        }
                                        return null;  // Ignorer les cartes dupliquées
                                    }).filter(card => card !== null);
                
                                    setDeckLandsUnit(listUnitLands)
                                    setDisplayLoading(false);
                                    return
                    }
                
                    // Si la méthode est appelée avec CREATURE renvoie le résultat dans deckCreatures
                    if(cardTypes.includes("CREATURE")) {
                                    setDeckCreatures(listCards)
                
                                    const uniqueCreaturesMap = new Map();
                                    const listUnitCreatures = request.data.map(card => {
                                        if (!uniqueCreaturesMap.has(card.id)) {
                                            uniqueCreaturesMap.set(card.id, true);
                                            return new Card (card.id, card.name, card.text, card.image, card.manaCost, card.value, card.formats,
                                                card.colors, card.type, card.rarity, card.edition, card.decks );
                                        }
                                        return null;
                                    }).filter(card => card !== null);
                
                                    setDeckCreaturesUnit(listUnitCreatures)
                                    setDisplayLoading(false);
                                    return
                                }
                
                    // Si la méthode est appelée avec ENCHANTEMENT renvoie le résultat dans deckEnchants
                    if(cardTypes.includes("ENCHANTEMENT")) {
                
                                        setDeckEnchants(listCards);
                
                                        const uniqueEnchantsMap = new Map();
                                        const listUnitEnchants = request.data.map(card => {
                                            if (!uniqueEnchantsMap.has(card.id)) {
                                                uniqueEnchantsMap.set(card.id, true);
                                                return new Card(
                                                    card.id, 
                                                    card.name, 
                                                    card.text, 
                                                    card.image, 
                                                    card.manaCost, 
                                                    card.value, 
                                                    card.formats,
                                                    card.colors, 
                                                    card.type, 
                                                    card.rarity, 
                                                    card.edition, 
                                                    card.decks
                                                );
                                            }
                                            return null;
                                        }).filter(card => card !== null);
                
                                        setDeckEnchantsUnit(listUnitEnchants);
                                        setDisplayLoading(false);
                                        return;
                    }
                
                    // Si la méthode est appelée avec EPHEMERE renvoie le résultat dans deckSpells
                    if(cardTypes.includes("EPHEMERE")) {
                                    setDeckSpells(listCards)
                
                                    const uniqueSpellsMap = new Map();
                                    const listUnitSpells = request.data.map(card => {
                                        if (!uniqueSpellsMap.has(card.id)) {
                                            uniqueSpellsMap.set(card.id, true);
                                            return new Card (card.id, card.name, card.text, card.image, card.manaCost, card.value, card.formats,
                                                card.colors, card.type, card.rarity, card.edition, card.decks );
                                        }
                                        return null;
                                    }).filter(card => card !== null);
                
                                    setDeckSpellsUnit(listUnitSpells)
                                    setDisplayLoading(false);
                                    return
                    }
                
                    // Si la méthode est appelée avec ARTEFACT renvoie le résultat dans deckArtefacts
                    if(cardTypes.includes("ARTEFACT")) {
                                    setDeckArtefacts(listCards)
                
                                    const uniqueArtefactsMap = new Map();
                                    const listUnitArtefacts = request.data.map(card => {
                                        if (!uniqueArtefactsMap.has(card.id)) {
                                            uniqueArtefactsMap.set(card.id, true);
                                            return new Card (card.id, card.name, card.text, card.image, card.manaCost, card.value, card.formats,
                                                card.colors, card.type, card.rarity, card.edition, card.decks );
                                        }
                                        return null;
                                    }).filter(card => card !== null);
                
                                    setDeckArtefactsUnit(listUnitArtefacts)
                                    setDisplayLoading(false);
                                    return
                    }
                
                    // Si la méthode est appelée avec PLANESWALKER renvoie le résultat dans deckPlaneswalkers
                    if(cardTypes.includes("PLANESWALKER")) {
                                setDeckPlaneswalkers(listCards);
                
                                const uniquePlaneswalkersMap = new Map();
                                const listUnitPlaneswalkers = request.data.map(card => {
                                    if (!uniquePlaneswalkersMap.has(card.id)) {
                                        uniquePlaneswalkersMap.set(card.id, true);
                                        return new Card(
                                            card.id, 
                                            card.name, 
                                            card.text, 
                                            card.image, 
                                            card.manaCost, 
                                            card.value, 
                                            card.formats,
                                            card.colors, 
                                            card.type, 
                                            card.rarity, 
                                            card.edition, 
                                            card.decks
                                        );
                                    }
                                    return null;
                                }).filter(card => card !== null);
                
                                setDeckPlaneswalkersUnit(listUnitPlaneswalkers);
                                setDisplayLoading(false);
                                return;
                    }
                
                 
                }   
                catch (error) {
                    setDisplayLoading(false);
                    console.log(error);
                }           
            }
        
        
        // Appelle la méthode précédente pour les terrains, créatures et sorts (se met à jour dés qu'une carte du deck est modifié)
        useEffect(() => {
            const DisplayCardByType = () => {
                    getCardByType("TERRAIN")
                    getCardByType("CREATURE")
                    getCardByType("ENCHANTEMENT")
                    getCardByType("EPHEMERE", "RITUEL", "BATAILLE")
                    getCardByType("ARTEFACT")
                     getCardByType("PLANESWALKER")
            } 
        DisplayCardByType() }, [newID]);
        
        // Affiche le nombre d'exemplaires de la carte


        const numberLand = (id) => {
                const cardWithID = deckLands.filter(card => card.id === id);
                    const number = cardWithID.length
                    return number
            }

        const numberCreature = (id) => {
            const cardWithID = deckCreatures.filter(card => card.id === id);
            const number = cardWithID.length;
                return number;
        };

        const numberEnchant = (id) => {
            const cardWithID = deckEnchants.filter(card => card.id === id);
            const number = cardWithID.length;
                return number;
        };

        const numberSpell = (id) => {
            const cardWithID = deckSpells.filter(card => card.id === id);
            const number = cardWithID.length;
                return number;

        };
        const numberArtefact = (id) => {
            const cardWithID = deckArtefacts.filter(card => card.id === id);
            const number = cardWithID.length;
                return number;
        };

        const numberPlaneswalker = (id) => {
            const cardWithID = deckPlaneswalkers.filter(card => card.id === id);
            const number = cardWithID.length;
                return number;
        };            
        
        const [arrowSens, setArrowSens] = useState(<SlArrowDown/>)
        const [lands, setLands] = useState(false)
                
        // Affiche les terrains du deck
        useEffect(() => {
                      const DisplayLands = () => {
                        
                        if (lands) {
                            setArrowSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                           } 
                        else {
                            setArrowSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                             }
                        } 
            DisplayLands() }, [lands]); 
        
        
        const [arrowSens2, setArrowSens2] = useState(<SlArrowDown/>)
        const [creatures, setCreatures] = useState(false)
        
        // Affiche les créatures du deck
        useEffect(() => {
                    const DisplayCreatures = () => {
                      
                      if (creatures) {
                          setArrowSens2((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                         } 
                      else {
                        setArrowSens2((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                           }
                      } 
            DisplayCreatures() }, [creatures]);
                      
        
        const [arrowSens3, setArrowSens3] = useState(<SlArrowDown/>)
        const [spells, setSpells] = useState(false)
        
        // Affiche les sorts du deck
        useEffect(() => {
            const DisplaySpells = () => {
                      
                      if (spells) {
                        setArrowSens3((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                         } 
                      else {
                        setArrowSens3((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                           }
            } 
            DisplaySpells() }, [spells]);

        const [arrowSens4, setArrowSens4] = useState(<SlArrowDown/>)
        const [artefacts, setArtefacts] = useState(false)
        
        // Affiche les artefacts du deck
        useEffect(() => {
                    const DisplayArtefacts = () => {
                      
                      if (artefacts) {
                        setArrowSens4((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                         } 
                      else {
                        setArrowSens4((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                           }
                      } 
            DisplayArtefacts() }, [artefacts]);

        // Boutons navigation decks
        const prevDeck = async () => {
            try {
                setDisplayLoading(true);
                const request = await axiosInstance.get(`/f_all/getPrevDeck?deckID=${newID}&decksID=${decks}`);

                const response = request.data

                setNewID(response)
                setDisplayLoading(false);
            }   
            catch (error) {
                setDisplayLoading(false);
                console.log(error);
            }
            }; 

        // Désactive le bouton si il n'ya plus de decks qui suivent     
        const [prevButtonActive, setPrevButtonActive] = useState(true)
        
        useEffect(() => {
        const desacPrevDeck = () => {
            const firstDeckId = decks[0];
            if (newID === firstDeckId) {
                setPrevButtonActive(false)
            }
            else {
                setPrevButtonActive(true)
            }
        }
        desacPrevDeck() }, [newID]);
        
        // Navigue vers le deck suivant dans a liste
        const nextDeck = async () => {
            try {
                setDisplayLoading(true);
                const request = await axiosInstance.get(`/f_all/getNextDeck?deckID=${newID}&decksID=${decks}`);

                const response = request.data
                
                setNewID(response)
                setDisplayLoading(false);
            }   
            catch (error) {
                setDisplayLoading(false);
                console.log(error);
            }
            };
        
        // Désactive le bouton si il n'ya plus de decks qui suivent     
        const [nextButtonActive, setNextButtonActive] = useState(true)
        
        useEffect(() => {
        const desacNextDeck = () => {
            const lastDeckId = decks[decks.length - 1];
            if (newID === lastDeckId) {
                setNextButtonActive(false)
            }
            else {
                setNextButtonActive(true)
            }
        }
        desacNextDeck() }, [newID]); 
        

        // Affichage d'images correspondant aux couleurs de la carte
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
                return null
            }
           
        };

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
            const response = await axiosInstance.get(`/f_user/getDecksLiked`, { withCredentials: true });
            
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

     

     // Méthode afficher les likes du deck
     useEffect(() => {
                const displayLikeNumber = () => {

                    setDeckLikesNumber(deck.likeNumber)
                } 
                displayLikeNumber();
     }, [deck]);

           // Méthode liker un deck
            const likeDeck = async () => {
                try {
                    setDisplayLoading(true);
                   await axiosInstance.post(`/f_user/likeDeck?deckId=${newID}`, null, { withCredentials: true });          
                   setDeckLikedId(prevState => [...prevState, newID]); 
                   setDeckLikesNumber(deckLikesNumber +1)
                   setDisplayLoading(false);
                }   
                catch (error) {
                    setDisplayLoading(false);
                    console.log(error);
                }
            };

            // Méthode disliker un deck
            const dislikeDeck = async () => {
                try {
                    setDisplayLoading(true);
                   await axiosInstance.delete(`/f_user/dislikeDeck?deckId=${newID}`, { withCredentials: true });          
                   setDeckLikedId(prevState => prevState.filter(deckId => deckId !== newID));
                   setDeckLikesNumber(deckLikesNumber -1)
                    }   
                catch (error) {
                    console.log(error);
                }
                finally {
                    setDisplayLoading(false);
                }
            };

            // Génère un like ou un dislike selon l'état de la carte
            const likeDislike = () => {

                    if (!deckLikedId.some(deckId => deckId === (newID))) {
                        likeDeck();
                    }
                    else {
                        dislikeDeck();
                    }
            } 
            // Modifie la couleur de l'icone coeur après un like
            const hearthIcon = () => {
                if(!deckLikedId.some(deckId => deckId === (newID))) {
                    return (<FaRegHeart  className='icon-like-object-selected' />)
                }
                else {
                    return (<FaHeart className='icon-like-object-selected' color="red"/>)
                }
            }         

            // Pop-up détails de cartes
            const hoveredCard = (id, name, type, text) => {
                setDetailsCard({ id, name, type, text });
            }

            // Naviguer vers un user
            const chooseUser = async () => {
                try {
                    setDisplayLoading(true);
                    const response = await axiosInstance.get(`/f_all/getDeckUser?deckID=${newID}` );
                    navigate(`/userSelected`, { state: { userID: response.data }})
                    setDisplayLoading(false);
                } 
                catch (error) {
                    setDisplayLoading(false);
                    console.log(error);
                }
            }

            // Naviguer vers le commandant
            const chooseCedh = (id) => {
                //const cardsIds = deckLandsUnit.map(card => card.id);
                navigate(`/cardSelected`, { state: { cardID: id, ListCard: id  }})
                    };  

            // Naviguer vers les terrains
            const chooseLand = (id) => {
                const cardsIds = deckLandsUnit.map(card => card.id);
                navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
                    }; 

            // Naviguer vers les créatures 
            const chooseCreature = (id) => {
                const cardsIds = [...new Set(deckCreatures.map(card => card.id))];
                navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
                    }; 
                    
            // Naviguer vers les enchantements 
            const chooseEnchant = (id) => {
                const cardsIds = [...new Set(deckEnchants.map(card => card.id))];
                navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
                    };
                    
            // Naviguer vers les sorts 
            const chooseSpell = (id) => {
                const cardsIds = [...new Set(deckSpells.map(card => card.id))];
                navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
                    };

            // Naviguer vers les artefacts 
            const chooseArtefact = (id) => {
                const cardsIds = [...new Set(deckArtefacts.map(card => card.id))];
                navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
                    };

            // Naviguer vers les artefacts 
            const choosePlaneswalker = (id) => {
                const cardsIds = [...new Set(deckPlaneswalkers.map(card => card.id))];
                navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
                    };
            
            const [popupHand, setPopupHand]= React.useState(false)
            const [hand, setHand]= React.useState([])
            

            // Obtenir une main de 7 cartes
            const getHand = async () => {
                        try { 
                            setDisplayLoading(true);
                            setHand([])
                            
                            const response = await axiosInstance.get(`/f_all/get7CardsDeckID?deckID=${id}`);
                            
                            const listCards = response.data.map(
                                    card => new Card (card.id, card.name, card.text, card.image, card.manaCost, card.value, card.formats,
                                            card.colors, card.type, card.legendary, card.rarity, card.edition,
                                            card.deckBuilders, card.decks, card.decksCommander, card.likeNumber,
                                            card.deckNumber, card.commanderNumber 
                            ) )                
                             
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

            const [displayDetailsDeck, setDisplayDetailsDeck]= React.useState(false)

            // Ajout des états pour le zoom de la main et du land
            const [displayZoomPopup, setDisplayZoomPopup] = useState(false);
            const [cardImage, setCardImage] = useState(null);
            const [cardID, setCardID] = useState(null);
            const [navigateListID, setNavigateListID] = useState([]);
            const [listImage, setListImage] = useState([]);

            // Ouvre le popup de zoom pour une carte de la main (index) ou un land (objet)
            const openZoomPopup = (cardOrIndex) => {
                if (typeof cardOrIndex === 'number') {
                    // main: index
                    setCardImage(hand[cardOrIndex]?.image || null);
                    setCardID(hand[cardOrIndex]?.id);
                    setNavigateListID([]);
                } else if (cardOrIndex && cardOrIndex.image) {
                    setCardImage(cardOrIndex.image);
                    setCardID(cardOrIndex.id);
                    switch(cardOrIndex.type) {
                        case "TERRAIN":
                            setNavigateListID(deckLandsUnit.map(card => card.id));
                            setListImage(deckLandsUnit.map(card => card.image));
                            break;
                        case "CREATURE":
                            setNavigateListID(deckCreaturesUnit.map(card => card.id));
                            setListImage(deckCreaturesUnit.map(card => card.image));
                            break;
                        case "ENCHANTEMENT":
                            setNavigateListID(deckEnchantsUnit.map(card => card.id));
                            setListImage(deckEnchantsUnit.map(card => card.image));
                            break;
                        case "EPHEMERE":
                        case "RITUEL":
                        case "BATAILLE":
                            setNavigateListID(deckSpellsUnit.map(card => card.id));
                            setListImage(deckSpellsUnit.map(card => card.image));
                            break;
                        case "ARTEFACT":
                            setNavigateListID(deckArtefactsUnit.map(card => card.id));
                            setListImage(deckArtefactsUnit.map(card => card.image));
                            break;
                        case "PLANESWALKER":
                            setNavigateListID(deckPlaneswalkersUnit.map(card => card.id));
                            setListImage(deckPlaneswalkersUnit.map(card => card.image));
                            break;
                        default:
                            setNavigateListID([]);
                            setListImage([])
                    }
                } else {
                    setCardImage(null);
                    setCardID(null);
                    setNavigateListID([]);
                }
                setDisplayZoomPopup(true);
            };
            
             // Boutons navigation cartes
            const prevCard = () => {
                            const currentIndex = navigateListID.indexOf(cardID);
                            const currentImage = listImage.indexOf(cardImage);

                            if (currentIndex > 0) {
                                setCardID(navigateListID[currentIndex - 1]);
                                setCardImage(listImage[currentImage - 1]);
                            }
          
                }; 
            
            // Désactive le bouton si il n'y a plus de decks qui suivent     
            const [prevCardButtonActive, setPrevCardButtonActive] = useState(true)
                    
            useEffect(() => {
                const desacPrevCard = () => {
                        const firstID = navigateListID[0];
                        if (cardID === firstID) {
                            setPrevCardButtonActive(false)
                            console.log(prevCardButtonActive)
                        }
                        else {
                            setPrevCardButtonActive(true)
                            console.log(prevCardButtonActive)
                        }
                }
                desacPrevCard() }, [cardID]);
        
 
      
                    
                    // Navigue vers la carte suivante dans a liste
                    const nextCard =  () => {
                            const currentIndex = navigateListID.indexOf(cardID);
                             const currentImage = listImage.indexOf(cardImage);

                            if (currentIndex >= 0 && currentIndex < navigateListID.length - 1) {
                                setCardID(navigateListID[currentIndex + 1]);
                                setCardImage(listImage[currentImage + 1]);
                            }
            
                        };
            
            
                    
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

                
             const closePopup =  () => {

                setCardID(null);
                setCardImage(null);
                setNavigateListID([]);
                setListImage([]);
                setDisplayZoomPopup(false)
                 setPrevCardButtonActive(false)
                setNextCardButtonActive(false)
            
            };
            

        // Afficher un zoom sur une carte


    // Graphique de répartition des cartes par types

        const getCardsByType = () => {
            const typeCount = cards.reduce((acc, card) => {
            if (card.type) {
                acc[card.type] = acc[card.type] ? acc[card.type] + 1 : 1;
            }
            return acc;
            }, {});

            return Object.entries(typeCount).map(([type, count]) => ({
            name: type,
            value: count,
            }));
        };

        // Données pour les graphiques
        const typeData = getCardsByType();



    // Graphique de répartition des cartes par cout en mana

         const getCardsByManaCost = () => {
            const manacostCount = cards.reduce((acc, card) => {
            if (card.manaCost) {
                acc[card.manaCost] = acc[card.manaCost] ? acc[card.manaCost] + 1 : 1;
            }
            return acc;
            }, {});


            return Object.entries(manacostCount).map(([manaCost, count]) => ({
            name: manaCost,
            value: count
            }));
        };

        // Données pour les graphiques
        const manaCostData = getCardsByManaCost();
      

    // Graphique de répartition des cartes par couleurs

        // Préparer les données pour la répartition des couleurs
        const getCardsByColor = () => {
            const colorCount = cards.reduce((acc, card) => {
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
                'BLEU': '#b5cbe4',
                'BLANC': '#f8ecc0',
                'VERT': '#177244',
                'ROUGE': '#c13534',
                'NOIR': '#140f0c',
                'INCOLORE': '#9b8e8a'
                };


        const TYPE_COLORS = [
            '#82ca9d', '#75bfcaff', '#ffc658', '#ff7300', '#ff0000', '#d977d1ff', '#0000ff', '#ffff00'
        ];

        const LEGEND_IMAGES = {
                'BLEU': blue,
                'BLANC': white,
                'VERT': green,
                'ROUGE': red,
                'NOIR': black,
                'INCOLORE': incolore
        };

        return (  
            <Section className="section" >
            { displayLoading && (
                <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
            )} 
            <img src={backgroundPage} className="background-image" alt="deck-background" />
       
            <div className='button-nav-mobile'>   
                    <IconButtonHover onClick={() => prevDeck()} disabled={!prevButtonActive}
                     icon={<MdOutlinePlayArrow className='icon-nav' style={{ transform: 'scaleX(-1)' }} />} />
                    <IconButtonHover onClick={() => nextDeck()}  disabled={!nextButtonActive}
                     icon={<MdOutlinePlayArrow className='icon-nav' />} />                   
                 </div>            

            {/*La carte format desktop*/}
            <div className='card-selected-container'> 
                <div className="deck-card-desktop" style={{ backgroundImage: `url(${backgroundPopup})`}}>
                                          <h1 className='deck-name'>{deck.name}</h1>
                  
                                          <div className="deck-content">
                                               <img className="deck-selected-pp" style={{marginTop: '-5%'}}
                                               src={deck.image && deck.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${deck.image}` : deck.image} alt="Deck mtg"/>
                
                                              <div className="deck-selected-attributs" >
                
                                                  <div className='card-line-attribut'>
                                                        <h4 className='deck-selected-line-title' >Créateur :</h4>
                                                        <h3 className='deck-selected-db' 
                                                        onClick={() => chooseUser(deck.id)}><strong>{deck.deckBuilderName}</strong></h3>
                                                  </div>
                                                
                                                  <div className='card-line-attribut'>
                                                      <h4 className='deck-selected-line-title'> Format : </h4>
                                                      <p className='deck-selected-format' style={{marginTop: '-5px'}}>{deck.format} </p>
                                                  </div>  
                
                                                  <div className='card-line-attribut'>
                                                      <h4 className='deck-selected-line-title' > Couleurs : </h4> 
                                                      {deck.colors && deck.colors.length > 0 && (
                                                        <div className='new-deck-colors-mapping' >
                                                          {deck.colors.map((color, index)  => (
                                                          <img key={index} src={getColor(color)} className="deck-selected-colors-imgs"
                                                            style={{display:(displayColor(color)), marginTop: '-5px'}} alt={color}/>                                
                                                          ))}
                                                        </div>
                                                      )}                                                      
                                                  </div> 

                                                  <div className='card-line-attribut'>              
                                                    <h4 className='deck-selected-line-title'> Valeur totale : </h4> 
                                                    <h3><strong>{deck.value} €</strong></h3>
                                                </div>
                                                <div className='card-line-attribut'>              
                                                    <h4 className='deck-selected-line-title'> Cout en mana moyen : </h4> 
                                                    <h3><strong>{deck.manaCost}</strong></h3>
                                                </div>

                                                  <div className='card-line-attribut'> 
                                                    <h2 className='card-like-number' onClick={likeDislike}>{deck.likeNumber} {hearthIcon()}                                 
                                                    </h2>                                                                     
                                                </div> 
                                              </div>
                                                  
                                          </div>  
  
                </div> 
                <div className='button-navig'>  
                    <IconButtonHover onClick={() => prevDeck()} disabled={!prevButtonActive}
                     icon={<MdOutlinePlayArrow className='icon-nav' style={{ transform: 'scaleX(-1)' }} />} />
                    <IconButtonHover onClick={() => nextDeck()}  disabled={!nextButtonActive}
                     icon={<MdOutlinePlayArrow className='icon-nav' />} />
                 </div> 
            </div>


             {/*La carte format medium*/}   
            <h2 className='deck-selected-card-medium-name'>{deck.name}</h2> 
            <div className="deck-selected-card-medium" style={{ backgroundImage: `url(${backgroundPopup})`}}>
                    <div className="img-container">
                                          <img className="new-deck-img-mobile" src={deck.image && deck.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${deck.image}` : deck.image} alt="Deck mtg"/>
                    </div>
                    <div className="card-medium-body" >
                    
                    <div className='attribut-mobile-container'>
                        <h4 className='deck-selected-line-title' >Créateur :</h4>                                                        
                        <h3 className='deck-selected-db' 
                        onClick={() => chooseUser(deck.id)}><strong>{deck.deckBuilderName}</strong></h3>
                    </div>
                                                
                    <div className='attribut-mobile-container'>
                                                      <h4 className='deck-selected-line-title'> Format : </h4>
                                                      <p className='deck-selected-format' style={{marginTop: '-5px'}}>{deck.format} </p>
                    </div>  
                
                    <div className='attribut-mobile-container'>
                                                      <h4 className='deck-selected-line-title' > Couleurs : </h4> 
                                                      {deck.colors && deck.colors.length > 0 && (
                                                        <div className='new-deck-colors-mapping' >
                                                          {deck.colors.map((color, index)  => (
                                                          <img key={index} src={getColor(color)} className="deck-selected-colors-imgs"
                                                            style={{display:(displayColor(color)), marginTop: '-5px'}} alt={color}/>                                
                                                          ))}
                                                        </div>
                                                      )}                                                      
                    </div> 

                    <div className='attribut-mobile-container'>              
                                                    <h4 className='deck-selected-line-title'> Valeur totale : </h4> 
                                                    <h3><strong>{deck.value} €</strong></h3>
                    </div>

                    <div className='attribut-mobile-container'>              
                                                    <h4 className='deck-selected-line-title'> Cout en mana moyen : </h4> 
                                                    <h3><strong>{deck.manaCost}</strong></h3>
                    </div>

                    <div className='attribut-mobile-container'> 
                                                    <h2 className='card-like-number' onClick={likeDislike}>{deck.likeNumber} {hearthIcon()}                                 
                                                    </h2>                                                                     
                    </div>           

                   </div> 
            </div>  
            

            {/*La carte format mobile*/}
            <h2 className='deck-card-mobile-name'>{deck.name}</h2>
            <div style={{ backgroundImage: `url(${backgroundPopup})`}} className="deck-card-mobile" >
                    <div className="img-container">
                                          <img className="hover-deck-card-img" src={deck.image && deck.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${deck.image}` : deck.image} alt="Deck mtg"/>
                    </div>

                    <div className="deck-hover-body" >
                            <div className='attribut-mobile-container'>
                                <h4 className="attribut-line-title" style={{marginTop: "5px"}}>Créateur :</h4>
                                <strong onClick={() => chooseUser(deck.id)} className='card-deckbuilder'> {deck.deckBuilderName}</strong>
                                </div>
                                
                                <div className='attribut-mobile-container'>                        
                                                    <h4 className='attribut-line-title' style={{marginTop: "2px"}}> Couleurs : </h4> 
                                                    {deck.colors && deck.colors.length > 0 && (
                                                        <div className='mapping-color'>
                                                          {deck.colors.map((color, index)  => (
                                                        <img key={index} src={getColor(color)} className="color-img-select" style={{display:(displayColor(color))}} alt={color}/>                                
                                                    ))}
                                                        </div>
                                                    )} 
                                </div> 
                                                <div className='attribut-mobile-container'>              
                                                    <h4 className='attribut-line-title' style={{marginTop: "4px"}}> Format : </h4> 
                                                    <h4 className='card-format' style={{ backgroundColor: 'green'}}>{deck.format}</h4>
                                                </div>
                                                <div className='attribut-mobile-container'>              
                                                    <h4 className='attribut-line-title'> Valeur totale : </h4> 
                                                    <h4 className='card-value'>{deck.value} €</h4>
                                                </div>
                                                <div className='attribut-mobile-container'>              
                                                    <h4 className='attribut-line-title'> Cout en mana moyen : </h4> 
                                                    <h4  className='card-manacost'>{deck.manaCost}</h4>
                                                </div>

                                                <div className='attribut-mobile-container'> 
                                                    <h2 className='card-like-number' onClick={likeDislike}>{deck.likeNumber} {hearthIcon()}                                 
                                                    </h2>                                                                     
                                                </div> 
                                                
                    </div> 
            </div> 


                 <Title  title={"Cartes du deck"}/> 
                    

                 <div className='map-deck-cards'> 
                 
                         { deck.format === "COMMANDER" && ( 
                         <div style={{width: '100%', display : 'flex', flexDirection: 'column', alignItems: 'center'}}>               
                             <div style={{width: '30%'}}>
                             <TitleType title={"Commandant"}/>
                             </div>
                             <div className="cedh-background" id='creature-card' style={{ backgroundImage: `url(${backgroundCedh})`}}>
                              <div className="cedh-details">
                                 <img className="cedh-img" src={deckCedh.image && deckCedh.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${deckCedh.image}` : deckCedh.image} alt="creature-img" onClick={()=>chooseCedh(deckCedh.id)}
                                                             onMouseEnter={() => hoveredCard(deckCedh.id) } onMouseOut={() => hoveredCard()}/>
                                                             
                                 {detailsCard && detailsCard.id === deckCedh.id && (
                                                             <img className="card-img-zoom" src={deckCedh.image && deckCedh.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${deckCedh.image}` : deckCedh.image} alt="Card-image"
                                                             />
                                 )}
                             </div>
                             </div>
                         </div>
                         )}
                 
                 
                         <div className='decks-types-map'>
                             
                             { deckLands.length > 0 && (
                                 <div className='decks-type-map' style={{ backgroundImage: `url(${backgroundPopup})`, backgroundPosition: 'top'}}>
                                     <TitleType title={"Terrains (" + deckLands.length + ")"}/>
                                     <div className='deck-text-map'>
                                             {deckLandsUnit.map(land => ( 
                                                 <div className="land-text-details" id='land-card'  key={land.id}>
                                                    <div className='card-link-desktop'>
                                                     <h5 className='land-text-name' onMouseEnter={() => hoveredCard(land.id) } onMouseOut={() => hoveredCard()} onClick={()=>chooseLand(land.id)}>{land.name}</h5>
                                                    </div>

                                                    <div className='card-link-mobile'>
                                                     <h5 className='land-text-name'  onClick={()=> openZoomPopup(land)} >{land.name}</h5>
                                                    </div>

                                                    <div className='card-length'>
                                                     {/* Si le terrain est basique */}
                                                        { land.id < 8 && (
                                                        <p className="p-cards-deck-length"
                                                        >terrain basique</p>
                                                        )}

                                                        <p className='p-card-length'>{numberLand(land.id)}</p>
                                                    </div>
                                                     
                                                     {detailsCard && detailsCard.id === land.id && (
                                                     <img className="card-img-zoom" src={land.image && land.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${land.image}` : land.image} alt="Card-image"/>
                                                     )} 
                                                 </div>
                                         
                                             ))}
                                     </div>
                                 </div>
                             )}
                 
                            { deckCreatures.length > 0 && (    
                                <div className='decks-type-map' style={{ backgroundImage: `url(${backgroundPopup})`, backgroundPosition: 'top'}}>
                                    <TitleType title={"Créatures (" + deckCreatures.length + ")"}/>
                                    <div className='deck-text-map'>
                                    {deckCreaturesUnit.map(creature => ( 
                                        <div className="land-text-details" id='land-card'  key={creature.id}>
                                        <div className='card-link-desktop'>
                                            <h5 className='land-text-name' onMouseEnter={() => hoveredCard(creature.id) } onMouseOut={() => hoveredCard()} onClick={()=>chooseCreature(creature.id)}>{creature.name}</h5>
                                        </div>
                                        <div className='card-link-mobile'>
                                            <h5 className='land-text-name' onClick={()=> openZoomPopup(creature)} >{creature.name}</h5>
                                        </div>
                                        { deck.format !== "COMMANDER" && (
                                            <p className='p-card-length'>{numberCreature(creature.id)}</p>
                                        )}
                                        {detailsCard && detailsCard.id === creature.id && (
                                            <img className="card-img-zoom" src={creature.image && creature.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${creature.image}` : creature.image} alt="Card-image"/>
                                        )} 
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            )} 


                            { deckEnchants.length > 0 && (
                                <div className='decks-type-map' style={{ backgroundImage: `url(${backgroundPopup})`, backgroundPosition: 'top'}}>
                                    <TitleType title={"Enchantements (" + deckEnchants.length + ")"}/>
                                    <div className='deck-text-map'>
                                    {deckEnchantsUnit.map(enchant => ( 
                                        <div className="land-text-details" id='land-card'  key={enchant.id}>
                                        <div className='card-link-desktop'>
                                            <h5 className='land-text-name' onMouseEnter={() => hoveredCard(enchant.id) } onMouseOut={() => hoveredCard()} onClick={()=>chooseEnchant(enchant.id)}>{enchant.name}</h5>
                                        </div>
                                        <div className='card-link-mobile'>
                                            <h5 className='land-text-name' onClick={()=> openZoomPopup(enchant)} >{enchant.name}</h5>
                                        </div>
                                        { deck.format !== "COMMANDER" && (
                                            <p className='p-card-length'>{numberEnchant(enchant.id)}</p>
                                        )}
                                        {detailsCard && detailsCard.id === enchant.id && (
                                            <img className="card-img-zoom" src={enchant.image && enchant.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${enchant.image}` : enchant.image} alt="Card-image"/>
                                        )} 
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            )}

                            { deckSpells.length > 0 && (
                                <div className='decks-type-map' style={{ backgroundImage: `url(${backgroundPopup})`, backgroundPosition: 'top'}}>
                                    <TitleType title={"Sorts (" + deckSpells.length + ")"}/>
                                    <div className='deck-text-map'>
                                    {deckSpellsUnit.map(spell => ( 
                                        <div className="land-text-details" id='land-card'  key={spell.id}>
                                        <div className='card-link-desktop'>
                                            <h5 className='land-text-name' onMouseEnter={() => hoveredCard(spell.id) } onMouseOut={() => hoveredCard()} onClick={()=>chooseSpell(spell.id)}>{spell.name}</h5>
                                        </div>
                                        <div className='card-link-mobile'>
                                            <h5 className='land-text-name' onClick={()=> openZoomPopup(spell)} >{spell.name}</h5>
                                        </div>
                                        { deck.format !== "COMMANDER" && (
                                            <p className='p-card-length'>{numberSpell(spell.id)}</p>
                                        )}
                                        {detailsCard && detailsCard.id === spell.id && (
                                            <img className="card-img-zoom" src={spell.image && spell.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${spell.image}` : spell.image} alt="Card-image"/>
                                        )} 
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            )}

                            { deckArtefacts.length > 0 && (
                                <div className='decks-type-map' style={{ backgroundImage: `url(${backgroundPopup})`, backgroundPosition: 'top'}}>    
                                    <TitleType title={"Artefacts (" + deckArtefacts.length + ")"}/>
                                    <div className='deck-text-map'>
                                    {deckArtefactsUnit.map(artefact => ( 
                                        <div className="land-text-details" id='land-card'  key={artefact.id}>
                                        <div className='card-link-desktop'>
                                            <h5 className='land-text-name' onMouseEnter={() => hoveredCard(artefact.id) } onMouseOut={() => hoveredCard()} onClick={()=>chooseArtefact(artefact.id)}>{artefact.name}</h5>
                                        </div>
                                        <div className='card-link-mobile'>
                                            <h5 className='land-text-name' onClick={()=> openZoomPopup(artefact)} >{artefact.name}</h5>
                                        </div>
                                        { deck.format !== "COMMANDER" && (
                                            <p className='p-card-length'>{numberArtefact(artefact.id)}</p>
                                        )}
                                        {detailsCard && detailsCard.id === artefact.id && (
                                            <img className="card-img-zoom" src={artefact.image && artefact.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${artefact.image}` : artefact.image} alt="Card-image"/>
                                        )} 
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            )}

                            { deckPlaneswalkers.length > 0 && (
                            <div className='decks-type-map' style={{ backgroundImage: `url(${backgroundPopup})`, backgroundPosition: 'top'}}>
                                <TitleType title={"Planeswalkers (" + deckPlaneswalkers.length + ")"}/>
                                <div className='deck-text-map'>
                                {deckPlaneswalkersUnit.map(planeswalker => ( 
                                    <div className="land-text-details" id='land-card' key={planeswalker.id}>
                                    <div className='card-link-desktop'>
                                        <h5 className='land-text-name' 
                                        onMouseEnter={() => hoveredCard(planeswalker.id)} 
                                        onMouseOut={() => hoveredCard()} 
                                        onClick={() => choosePlaneswalker(planeswalker.id)}>
                                        {planeswalker.name}
                                        </h5>
                                    </div>
                                    <div className='card-link-mobile'>
                                        <h5 className='land-text-name' onClick={()=> openZoomPopup(planeswalker)} >{planeswalker.name}</h5>
                                    </div>
                                    { deck.format !== "COMMANDER" && (
                                        <p className='p-card-length'>{numberPlaneswalker(planeswalker.id)}</p>
                                    )}
                                    {detailsCard && detailsCard.id === planeswalker.id && (
                                        <img className="card-img-zoom" 
                                        src={planeswalker.image && planeswalker.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${planeswalker.image}` : planeswalker.image} 
                                        alt="Card-image"/>
                                    )} 
                                    </div>
                                ))}
                                </div>
                            </div>
                            )}
                    </div>
                                                
                          
             {/* Graphiques */}
             <TitleArrow title={`Statistiques`} />
            
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

             <IoIosArrowDropleft className='icon-close-popup' size={'5em'} style={{marginTop: '5%'}}  onClick={()=>navigate(-1)}/>
        
                </div>
 
       

                {displayZoomPopup && cardImage && (
                                        <div className='popup-bckg'>                                
                                                <img className="card-selected-image-zoom" src={getImageUrl(cardImage)} alt="Card mtg"/>
                                                <button className='nav-card-button' onClick={()=>(navigate(`/cardSelected`, { state: { cardID: cardID, ListCard: navigateListID  }}))}>Afficher détails</button>
                                                <div className='button-nav-mobile' style={{position : 'fixed', marginTop: '73vh', zIndex: '102', color: 'white'}} >   
                                                    <IconButtonHover onClick={() => prevCard()} disabled={!prevCardButtonActive}
                                                    icon={<MdOutlinePlayArrow className='icon-nav' style={{ transform: 'scaleX(-1)' }} />} />
                                                    <IconButtonHover onClick={() => nextCard()}  disabled={!nextCardButtonActive}
                                                    icon={<MdOutlinePlayArrow className='icon-nav' />} />                   
                                                </div>
                                               
                                                <CgCloseO className='icon-close-popup' color='white' size={'5em'} onClick={()=> closePopup()}/>
                                        </div>
                )} 

                {popupHand && (
                        <div className='popup-bckg'>
                            <div className='hand-background' style={{
                                                         backgroundImage:`url(${backgroundHand})`,
                                                         backgroundSize: "120%",        
                                                         backgroundPosition: "center",   
                                                         backgroundRepeat: "no-repeat"}}>
                                                     {hand.map((card, index) => ( 
                                                         <div className="cards-hand-details" key={index}>
                                                             <img className="cards-draw-img" src={getImageUrl(card.image)} alt="Card-image"
                                                             onMouseEnter={() => hoveredCard(card.id)} onMouseOut={() => hoveredCard()}
                                                             onClick={() => openZoomPopup(index)}
                                                             />
                                                             
                                                         </div>
                                                     
                                                     ))}
                                                    
                             </div>
                            <button className='refresh-hand-button' onClick={()=>displayHand()} >
                                                     <h5 style={{color: 'white', position: 'relative', top: '2px', fontFamily: 'MedievalSharp, cursive'}}> Pioche</h5> 
                            <SlRefresh color='white' size={"1.5em"}/></button>               
                            <CgCloseO className='icon-close-popup-desktop'
                                                 color='white' size={'5em'} onClick={()=> setPopupHand(false)} style={{position: 'fixed',
                                                     bottom: '10'
                            }}/> 
                            <CgCloseO className='icon-close-popup-mobile'
                                                 color='white' size={'3em'} onClick={()=> setPopupHand(false)} style={{position: 'fixed',
                                                     bottom: '10'
                            }}/> 
                        </div>
                    )}
                                        
            </Section> 
        )
}

export default DeckSelected;