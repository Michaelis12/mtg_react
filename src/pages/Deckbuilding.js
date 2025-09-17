import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation ,  useNavigate} from 'react-router-dom';
import "./css/Deckbuilding.css";
import Card from '../model/Card';
import addCardBackground from "../assets/deckbuilding_add.jpg"
import drawBackground from "../assets/hand_card.jpg"
import backgroundRedGreen from "../assets/background_cardsPage2.jpg"
import backgroundHand from "../assets/background_hand.png"
import backgroundPopup from "../assets/background_white.png"
import backgroundCedh from "../assets/mtg_wallpaper.jpg"
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import incolore from "../assets/incolore-mtg.png"
import loading from "../assets/loading.gif"
import { TiDeleteOutline } from "react-icons/ti";
import { MdPublishedWithChanges } from "react-icons/md";
import { SlArrowDown, SlArrowUp } from "react-icons/sl"; 
import { SlRefresh } from "react-icons/sl";
import { CgAdd, CgCloseO   } from "react-icons/cg";
import { IoIosArrowDropleft } from "react-icons/io";
import { MdOutlinePlayArrow } from "react-icons/md";
import { GiCardPlay } from "react-icons/gi";
import { GiCardRandom } from "react-icons/gi";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import { MdSend } from "react-icons/md";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { FaPencilAlt } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Section from '../components/section';
import IconButtonHover from '../components/buttonIconHover';
import ButtonValidPopup from "../components/buttonValidPopup";
import PopupDelete from '../components/popupDelete';
import Title from '../components/title';
import TitleType from '../components/titleType';
import TitleArrow from '../components/titleArrow';
import FooterSection from '../components/footerSection';
import { getImageUrl } from '../utils/imageUtils';
import axiosInstance from '../api/axiosInstance';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
 BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList  } from 'recharts';

 const Deckbuilding = () => { 

       const location = useLocation();
       const navigate = useNavigate();
       const id = location.state?.deckID; 
       const [deck, setDeck] = React.useState([])
       const [updateDeck, setUpdateDeck] = React.useState(false)
       const [deckCards, setDeckCards] = React.useState([])
       const [colors, setColors] = React.useState([])
       const [format, setFormat]= React.useState([])

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

                        // Permet d'afficher l'image actuelle du deck et celle après sa modification
                        setNewImage(response.image)
                        setDisplayLoading(false);
  
    
                }   
                catch (error) {
                    setDisplayLoading(false);
                    console.log(error);
                }
    
        
            }
            getDeckSelected();
            }, [updateDeck, id, deckSignal]);


        // N'affiche pas INCOLORE 
        const displayColor = (values, value) => {
            
            if(values.length < 2) {
                return
            }
            
            if(value === "INCOLORE") {
                return "none";
            }
            
        }


        // Modifier le deck
        
        const [newName, setNewName] = React.useState("")
        const [newImage, setNewImage] = React.useState("")
        
        // Ouvrir le form d'edit
        const startEdit = () => {
            setUpdateDeck(true)
        }


        const [isImageUpdate, setIsImageUpdate] = React.useState(false) 

        // Entrer une nouvelle image
        const selectImage = async (event) => {
            const file = event.target.files[0];
            
            if (file) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    const uploadRes = await axiosInstance.post(`/f_all/uploadImage`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        withCredentials: true
                    });
                    
                    // Stocker le chemin retourné au lieu du base64
                    setNewImage(uploadRes.data);
                } catch (error) {
                    console.error("Erreur lors de l'upload de l'image:", error);
                    alert("Erreur lors de l'upload de l'image");
                }
            }
            setIsImageUpdate(true)
        }


        // Annuler l'édit 
        const cancelEdit = () => {
            setNewName("")
            setNewImage("")
            setUpdateDeck(false)
            if(isImageUpdate) {
                setIsImageUpdate(false)
            }
        }

        // Valider l'edit 
        const editDeck = async () => {
            try {
                setDisplayLoading(true);
                const newDeck = {};

                if (newName !== "") newDeck.name = newName;
                if (newImage !== "") newDeck.image = newImage;

                const request = await axiosInstance.put(`/f_user/updateDeck?deckID=${id}`, newDeck, { withCredentials: true });
    
                setNewName("")
                setNewImage("")
                setUpdateDeck(false)
                setIsImageUpdate(false)
                setDisplayLoading(false);

            }   
            catch (error) {
                setDisplayLoading(false);
                console.log(error);
            }

    
        } 

        const [displayPopup, setDisplayPopup] = React.useState(false)

        // Supprimer le deck
        const deleteDeck = async () => {
            try {
                setDisplayLoading(true);
                console.log("cc")
                const request = await axiosInstance.delete(`/f_user/deleteDeck?deckID=${id}`, { withCredentials: true });

                setDisplayPopup(false)
    
                navigate("/mySpace");
                setDisplayLoading(false);

            }   
            catch (error) {
                setDisplayLoading(false);
                console.log(error);
            }

    
        }

        // Requete les cartes du deck
        useEffect(() => {
            const getCardsDeck = async () => {
                try {
                    setDisplayLoading(true);
                    const response = await axiosInstance.get(`/f_all/getCardDeckID?deckID=${id}`);

                    const listCards = response.data.map(
                        card => new Card (card.id, card.name, card.text, card.image, card.manaCost, card.value, card.formats,
                                        card.colors, card.type, card.rarity, card.edition, card.decks
                ) ) 
                setDeckCards(listCards)
                setDisplayLoading(false);

                }   
                catch (error) {
                    setDisplayLoading(false);
                    console.log(error);
                }

        
            }
            getCardsDeck();
            }, [ deckSignal ]);

            
        const [deckCedh, setDeckCedh] = useState([])
        

        // Requete le commandant du deck pour les commanders 
        useEffect(() => {
            const getCedh = async () => { 
                try {
                    
                    if( deck.format === "COMMANDER") {

                        setDisplayLoading(true);
                        console.log("cedh")
                            

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
        const [arrowUp, setArrowUp] = useState(false)
        const [lands, setLands] = useState(false)
        
        // Affiche les terrains du deck
        useEffect(() => {
              const DisplayLands = () => {
                
                if (lands) {
                    setArrowSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                    setArrowUp(true)                    
                   } 
                else {
                    setArrowSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                    setArrowUp((prevArrowSens) => !prevArrowSens);
                     }
                } 
                DisplayLands() }, [lands]); 


        const [arrowSens2, setArrowSens2] = useState(<SlArrowDown/>)
        const [arrowUp2, setArrowUp2] = useState(false)
        const [creatures, setCreatures] = useState(false)

        // Affiche les créatures du deck
        useEffect(() => {
            const DisplayCreatures = () => {
              
              if (creatures) {
                  setArrowSens2((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                  setArrowUp2(true)
                 } 
              else {
                setArrowSens2((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                setArrowUp2((prevArrowSens) => !prevArrowSens);
                   }
              } 
              DisplayCreatures() }, [creatures]);
              

        const [arrowSens3, setArrowSens3] = useState(<SlArrowDown/>)
        const [arrowUp3, setArrowUp3] = useState(false)
        const [spells, setSpells] = useState(false)

        // Affiche les sorts du deck
        useEffect(() => {
            const DisplaySpells = () => {
              
              if (spells) {
                setArrowSens3((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                setArrowUp3(true)
                 } 
              else {
                setArrowSens3((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                setArrowUp3((prevArrowSens) => !prevArrowSens);
                   }
              } 
              DisplaySpells() }, [spells]);

        const [arrowSens4, setArrowSens4] = useState(<SlArrowDown/>)
        const [arrowUp4, setArrowUp4] = useState(false)
        const [artefacts, setArtefacts] = useState(false)

        // Affiche les artefacts du deck
        useEffect(() => {
            const DisplayArtefacts = () => {
              
              if (artefacts) {
                setArrowSens4((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                setArrowUp4(true)
                 } 
              else {
                setArrowSens4((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                setArrowUp4((prevArrowSens) => !prevArrowSens);
                   }
              } 
              DisplayArtefacts() }, [artefacts]);

        
          // Requete les cartes du deck par type 
            const getCardByType = async (...cardTypes  ) => {
                try {
                    setDisplayLoading(true);
                    const params = {
                        deckID : id,
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
                    getCardByType("TERRAIN");
                    getCardByType("CREATURE");
                    getCardByType("ENCHANTEMENT");
                    getCardByType("EPHEMERE", "RITUEL", "BATAILLE");
                    getCardByType("PLANESWALKER");
                    getCardByType("ARTEFACT");
             } 
       DisplayCardByType() }, [deckCards]); 

        
        // Zoom sur la carte sélectionnée
        const [detailsCard, setDetailsCard] = React.useState(null)
        const hoveredCard = (id) => {
         setDetailsCard({ id });

          }

    // Affichage d'image correspondant aux couleurs de la carte
            const getColors = (value ) => {
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
    

       
        // Ajouter une carte
        const addCard = async (value) => {
            try { 

                const values = Array.isArray(value) ? value : [value];

                const response = await axiosInstance.post(`f_user/addCardsOnDeck?cardId=${values}&deckId=${id}`, null, { withCredentials: true });
                setDeckSignal(!deckSignal)
                 }   
            catch (error) {
                console.log(error);
            }
        }

   

        // Retirer une carte du deck
        const deleteCard = async (value) => {
            try { 
                const response = await axiosInstance.delete(`/f_user/deleteCardOnDeck?cardId=${value}&deckId=${id}`, { withCredentials: true });
                setDeckSignal(!deckSignal)
                
                 }   
            catch (error) {
                console.log(error);
            }
        }

        // Retirer toutes les exemplaires d'une carte du deck
        const deleteCards = async (value) => {
            try { 
                setDisplayLoading(true);
                const response = await axiosInstance.delete(`/f_user/deleteCardsOnDeck?cardId=${value}&deckId=${id}`, { withCredentials: true });
                setDeckSignal(!deckSignal)
                setDisplayLoading(false);
                
                 }   
            catch (error) {
                setDisplayLoading(false);
                console.log(error);
            }
        }

        // Choisir le nombre d'exemplaire d'une carte dans le deck
         const setNumberCardOnDeck = async (value, number) => {
            try {
            setDisplayLoading(true);
            const response = await axiosInstance.put(`/f_user/setNumberCardOnDeck?cardID=${value}&deckID=${id}&number=${number}`, 
            { withCredentials: true });
            setDeckSignal(!deckSignal)
            setDisplayLoading(false);
                
            } catch (error) {
                setDisplayLoading(false);
                console.log(error);               
            }
            

         }

        // Consultez les cartes (en masquant les cartes qui seront deja dans le deck si le format est CEDH)
        const navigateCards = () => {
            const data = id
            const deckCardsID = [...deckCards.map(card => card.id), deckCedh.id];
            navigate(`/cardsDeck`, { state: { deckID: data, cardsDesac: deckCardsID }})
        }


        // Nombre de cartes requises
        const cardsNumber = () => {
            if(deck.format === "COMMANDER") {
                return 100
            }
            else {
                return 40
            }
        }

        // Ouvrir un pop-up zoom sur la carte sur la partie mobile


        // Desactiver le bouton de publication si le nb de cartes suffisant n'est pas encore atteint
        const disabledPublication = () => {
            if(deck.format === "COMMANDER") {
                return deckCards.length !== 99 
            }
            else {
                return deckCards.length < 40
            } 
        }

        const [popupPub, setPopupPub]= React.useState(false)

        // Publier le deck
        const publishDeck = async () => {
            try { 
                setDisplayLoading(true);
                const response = await axiosInstance.put(`/f_user/deckPublic?deckID=${id}`, null, { withCredentials: true });
                //navigate('/myspace')
                setDisplayLoading(false);
                setPopupPub(true)
                 }   
            catch (error) {
                setDisplayLoading(false);
                console.log(error);
            }
        }

        // Passer le deck en privé
        const privateDeck = async () => {
            try { 
                setDisplayLoading(true);
                const response = await axiosInstance.put(`/f_user/deckPrivate?deckID=${id}`, null, { withCredentials: true });
                window.location.reload();
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
                const cardsIds = deckCreatures.map(card => card.id);
                navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
                    };
                    
            // Naviguer vers les enchantements 
            const chooseEnchant = (id) => {
                const cardsIds = deckEnchants.map(card => card.id);
                navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
                    };
                    
            // Naviguer vers les sorts 
            const chooseSpell = (id) => {
                const cardsIds = deckSpells.map(card => card.id);
                navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
                    };

            // Naviguer vers les artefacts 
            const chooseArtefact = (id) => {
                const cardsIds = deckArtefacts.map(card => card.id);
                navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
                    };

            // Naviguer vers les artefacts 
            const choosePlaneswalker = (id) => {
                const cardsIds = deckPlaneswalkers.map(card => card.id);
                navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
                    };
            
            const [popupHand, setPopupHand]= React.useState(false)
            const [hand, setHand]= React.useState([])
            
            // États pour le popup de zoom et la navigation
            const [displayCardPopup, setDisplayCardPopup] = React.useState(false)
            const [displayZoomPopup, setDisplayZoomPopup] = React.useState(false)
            const [currentCardIndex, setCurrentCardIndex] = React.useState(0)
            const [prevButtonActive, setPrevButtonActive] = React.useState(false)
            const [nextButtonActive, setNextButtonActive] = React.useState(false)
            

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
            
            // Fonctions de navigation pour le popup de zoom
            const prevCard = () => {
                if (currentCardIndex > 0) {
                    setCurrentCardIndex(currentCardIndex - 1);
                }
            }
            
            const nextCard = () => {
                if (currentCardIndex < hand.length - 1) {
                    setCurrentCardIndex(currentCardIndex + 1);
                }
            }
            
            // Gérer l'activation/désactivation des boutons de navigation
            React.useEffect(() => {
                setPrevButtonActive(currentCardIndex > 0);
                setNextButtonActive(currentCardIndex < hand.length - 1);
            }, [currentCardIndex, hand.length]);
            
            // Fonction pour ouvrir le popup de zoom
            const openZoomPopup = (index) => {
                setCurrentCardIndex(index);
                setDisplayZoomPopup(true);
            }

        // Zoom pour afficher les cartes dans la partie mobile

           // Ajout des états pour le zoom de la main et du land
            const [cardImage, setCardImage] = useState(null);
            const [cardID, setCardID] = useState(null);
            const [navigateListID, setNavigateListID] = useState([]);
            const [listImage, setListImage] = useState([]);
        
 
                    
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
                    
            
                   
            
        const [displayLoading, setDisplayLoading] = useState(false);
        
        // Graphique de répartition des cartes par types
        const getCardsByType = () => {
            const typeCount = deckCards.reduce((acc, card) => {
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
            const manacostCount = deckCards.reduce((acc, card) => {
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
            const colorCount = deckCards.reduce((acc, card) => {
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
            <Section>  
                { displayLoading && (
                    <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
                )}
                <img src={backgroundRedGreen} className="background-image" alt="background" />
                
                {/*  Boutons d'action edit */}
            
             <div className='deckbuilding-icons-container'>      
                <FaPencilAlt className='edit-deckbuilding-icon' onClick={()=> setUpdateDeck(true)}/>
                <RiDeleteBin6Line className='edit-deckbuilding-icon' onClick={()=> setDisplayPopup(true)} />
            </div>
                
                            {/*La carte format desktop*/}
                            <div className='card-selected-container'> 
                                <div className="deck-card-desktop" style={{ backgroundImage: `url(${backgroundPopup})`, marginTop: '1%'}}>
                                                          <h1 className='deck-name'>{deck.name}</h1> 
                                  
                                                          <div className="deck-content">
                                                               <img className="deckbuilding-pp" style={{marginTop: '-5%'}}
                                                               src={deck.image && deck.image.startsWith('/uploads/') ? `https://localhost:8443${deck.image}` : deck.image} alt="Deck mtg"/>
                                
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
                                                                    <h4 className='deck-selected-line-title'> Valeur totale : </h4> 
                                                                    <h3><strong>{deck.value} €</strong></h3>
                                                                </div>
                                                                <div className='card-line-attribut'>              
                                                                    <h4 className='deck-selected-line-title'> Cout en mana moyen : </h4> 
                                                                    <h3><strong>{deck.manaCost}</strong></h3>
                                                                </div>
                
                                                              </div>
                                                                  
                                                          </div>  
                  
                                </div> 
     
                            </div>
                
                
                             {/*La carte format medium*/}   
                            <h2 className='deck-selected-card-medium-name'style={{marginTop: '2%'}}>{deck.name}</h2> 
                            <div className="deck-selected-card-medium" style={{ backgroundImage: `url(${backgroundPopup})`}}>
                                    <div className="img-container">
                                                          <img className="new-deck-img-mobile" src={deck.image && deck.image.startsWith('/uploads/') ? `https://localhost:8443${deck.image}` : deck.image} alt="Deck mtg"/>
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
                                                                    <h4 className='deck-selected-line-title'> Valeur totale : </h4> 
                                                                    <h3><strong>{deck.value} €</strong></h3>
                                    </div>
                
                                    <div className='attribut-mobile-container'>              
                                                                    <h4 className='deck-selected-line-title'> Cout en mana moyen : </h4> 
                                                                    <h3><strong>{deck.manaCost}</strong></h3>
                                    </div>
                           
                
                                   </div> 
                            </div>  
                            
                
                            {/*La carte format mobile*/}
                            <h2 className='deck-card-mobile-name' style={{marginTop: '2%'}}>{deck.name}</h2>
                            <div style={{ backgroundImage: `url(${backgroundPopup})`}} className="deck-card-mobile" >
                                    <div className="img-container">
                                                          <img className="hover-deck-card-img" src={deck.image && deck.image.startsWith('/uploads/') ? `https://localhost:8443${deck.image}` : deck.image} alt="Deck mtg"/>
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
                                                                    <h4 className='attribut-line-title'> Valeur totale : </h4> 
                                                                    <h4 className='card-value'>{deck.value} €</h4>
                                                </div>

                                                <div className='attribut-mobile-container'>              
                                                                    <h4 className='attribut-line-title'> Cout en mana moyen : </h4> 
                                                                    <h4  className='card-manacost'>{deck.manaCost}</h4>
                                                </div>
                
                                                                
                                    </div> 
                            </div>

                { updateDeck && (
                    <div className='popup-bckg'>
                     <div className='set-attributs-deck' style={{ backgroundImage: `url(${backgroundPopup})`}}>
                                <div className='textarea-container'>
                                    <textarea className="input-name" id="deck-name" name="deck-name" rows="3" cols="33" 
                                            style={{marginBottom:'5%'}}
                                            maxLength={25} onChange={(e) => setNewName(e.target.value)} >
                                                {deck.name}
                                    </textarea>
                                </div>
                                <input 
                                className='input-deck-img'
                                style={{position:'absolute', marginTop:'-5%'}}
                                type="file"
                                accept="image/*" 
                                onChange={(e) => selectImage(e)}
                                />
                                <img className='deck-selected-img' src={newImage && newImage.startsWith('/uploads/') ? `https://localhost:8443${newImage}` : newImage} alt="deck-img" />
                                
                                <ButtonValidPopup onClick={()=>editDeck()}/>
                      </div>
                     <CgCloseO className='icon-close-popup' color='white' size={'5em'}  onClick={()=>cancelEdit()}/> 
                    </div>
                    
                )}  

                {displayPopup && (
                        
                            <PopupDelete title="Supprimer le deck ?" 
                            text='La suppression du deck est irréversible. Toutes les données seront définitivement perdues.'
                            onClick={()=>deleteDeck()} back={() => setDisplayPopup(false)}/>
                       )}

            
            {/*  Boutons d'action */}
            <div className='deckbuilding-buttons-container'>                       
                        
                <div className='admin-users-button'>
                <button className='update-deck-container' onClick={()=>navigateCards()} 
                >
                    <GiCardPlay className='icon-update-user' />
                    <h5 className='update-user-p'>Ajouter des cartes</h5>
                </button> 

                <button className='update-deck-container' onClick={()=>displayHand()}>
                    <GiCardRandom className='icon-update-user' />
                    <h5 className='update-user-p'>Piocher une main</h5>
                </button>

                {!deck.isPublic && ( 
                    <div className='public-container'>
                            <button className="pub-deck-container" 
                            disabled={disabledPublication()} onClick={()=>publishDeck()}>
                                <MdSend className='icon-update-user' />
                                <div className='pub-deck-text-container' >
                                <h5 className='update-user-p'>Publier le deck </h5>
                                <strong className='update-user-p2'>({cardsNumber()} cartes)</strong>
                                </div>
                            </button> 
                               
                    </div>                
                )}
                {deck.isPublic && (
                    <button className='update-deck-container' onClick={()=>privateDeck()}>
                        <RiGitRepositoryPrivateLine  className='icon-update-user' />
                        <h5 className='update-user-p'>Passer en privé</h5>
                    </button>                   
                )}
                </div>
            </div>
                

            { format === "COMMANDER" && (
                <Title title={`Cartes du deck (${deckCards.length + 1} / ${cardsNumber()})`}/>
            )}

            { format !== "COMMANDER" && (
                <Title title={`Cartes du deck (${deckCards.length})`}/>
            )}
                        

        <div className='map-deck-cards'> 
        

        {/*Affichage du commandant*/}
        { format === "COMMANDER" && ( 
        <div style={{width: '100%', display : 'flex', flexDirection: 'column', alignItems: 'center'}}>               
            <div style={{width: '30%'}}>
            <TitleType title={"Commandant"}/>
            </div>
            <div className="cedh-background" id='creature-card' style={{ backgroundImage: `url(${backgroundCedh})`}}>
             <div className="cedh-details">
                <img className="cedh-img" src={deckCedh.image && deckCedh.image.startsWith('/uploads/') ? `https://localhost:8443${deckCedh.image}` : deckCedh.image} alt="creature-img" onClick={()=>chooseCedh(deckCedh.id)}
                                            onMouseEnter={() => hoveredCard(deckCedh.id) } onMouseOut={() => hoveredCard()}/>
                                            
                {detailsCard && detailsCard.id === deckCedh.id && (
                                            <img className="card-img-zoom" src={deckCedh.image && deckCedh.image.startsWith('/uploads/') ? `https://localhost:8443${deckCedh.image}` : deckCedh.image} alt="Card-image"
                                            />
                )}
            </div>
            </div>
        </div>
        )} 


        <div className='decks-types-map'> 

             {/*Mapping des terrains*/}
            { deckLands.length > 0 && (
                <div className='decks-type-map' style={{ backgroundImage: `url(${backgroundPopup})`, backgroundPosition: 'top'}}>
                    <TitleType title={"Terrains (" + deckLands.length + ")"}/>
                    <div className='deck-text-map'>
                        {deckLandsUnit.map(land => {
                            const isMobile = window.innerWidth < 500;
                            return (
                                <div className="land-text-details" id='land-card' key={land.id}
                                    style={isMobile ? { fontSize: '0.85em', padding: '6px 4px', margin: '4px 0' } : {}}>
                                    <h5 className='land-text-name'
                                        onMouseEnter={() => hoveredCard(land.id)}
                                        onMouseOut={() => hoveredCard()}
                                        onClick={() => chooseLand(land.id)}>{isMobile ? land.name.slice(0, 16) + (land.name.length > 16 ? '…' : '') : land.name}</h5>                                    
                                    {/* Si le terrain est basique 
                                    {land.id < 8 && (
                                        <p className="p-cards-deck-length" style={isMobile ? { marginTop: '4px', fontSize: '0.85em' } : { marginTop: '10px' }}>
                                            {isMobile ? 'basique' : 'terrain basique'}
                                        </p>
                                    )}
                                    */}
                                    {detailsCard && detailsCard.id === land.id && (
                                            <img className="card-img-zoom" style={isMobile ? { maxWidth: '80vw', maxHeight: '40vw' } : {}} src={land.image && land.image.startsWith('/uploads/') ? `https://localhost:8443${land.image}` : land.image} alt="Card-image" />
                                        )}
                                    <div className='deckbuilding-number-container'>
                                        {land.id < 8 && (
                                            <div className='deckbuilding-text-number' style={isMobile ? { gap: '4px' } : {}}>
                                                <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => deleteCard(land.id)} >
                                                <AiOutlineMinusCircle  size={'2em'} color={'black'} className="icon-add-card" />
                                                </button>
                                                <textarea className='input-card-length' step="1" min="0"
                                                    value={numberLand(land.id) || 0}
                                                    onChange={(e) => setNumberCardOnDeck(land.id, e.target.value)}
                                                />
                                                <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => addCard(land.id)} >
                                                <CgAdd size={'2em'} color={'black'} className="icon-add-card"/>
                                                </button>
                                            </div>
                                        )} 
                                        {format !== "COMMANDER" && land.id > 7 && (
                                        <div className='deckbuilding-text-number'>                              
                                            <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => deleteCard(land.id)} >
                                                <AiOutlineMinusCircle  size={'2em'} color={'black'} className="icon-add-card" />
                                            </button>
                                            
                                            <p className='p-card-length'>{numberLand(land.id)}</p>                                  
                                            <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} disabled={numberLand(land.id) > 3} onClick={() => addCard(land.id)} >
                                                <CgAdd size={'2em'} color={'black'} className="icon-add-card"/>
                                            </button>
                                        </div>
                                        )}
                                        <TiDeleteOutline className='delete-card-button' color='red' size={isMobile ? '1em' : '3em'} onClick={() => deleteCards(land.id)} />
                                        
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            { deckCreatures.length > 0 && (    
                <div className='decks-type-map' style={{ backgroundImage: `url(${backgroundPopup})`, backgroundPosition: 'top'}}>
                    <TitleType title={"Créatures (" + deckCreatures.length + ")"}/>
                    <div className='deck-text-map'>
                            {deckCreaturesUnit.map(creature => ( 
                                <div className="land-text-details" id='land-card'  key={creature.id}>
                                    <h5 className='land-text-name' onMouseEnter={() => hoveredCard(creature.id) } onMouseOut={() => hoveredCard()} onClick={()=>chooseCreature(creature.id)}>{creature.name}</h5>
                                    <div className='deckbuilding-number-container'>
                                        { format !== "COMMANDER" && ( 
                                        <div className='deckbuilding-text-number'>                              
                                            <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => deleteCard(creature.id)} >
                                                                        <AiOutlineMinusCircle  size={'2em'} color={'black'} className="icon-add-card"/>
                                            </button>
                                            
                                            <p className='p-card-length'>{numberCreature(creature.id)}</p>                                  
                                            <button className="add-button-deckbuilding" disabled={numberCreature(creature.id) > 3}
                                            style={{ margin : '2%', border: 'none' }} 
                                            onClick={() => addCard(creature.id)} ><CgAdd size={'2em'} color={'black'} className="icon-add-card"/>
                                            </button> 
                                        </div>
                                        )}
                                        <TiDeleteOutline className='delete-card-button' color='red' size={'3em'} onClick={()=>deleteCards(creature.id)}/>
                                </div>  
                                    {detailsCard && detailsCard.id === creature.id && (
                                    <img className="card-img-zoom" src={creature.image && creature.image.startsWith('/uploads/') ? `https://localhost:8443${creature.image}` : creature.image} alt="Card-image"/>
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
                                    <h5 className='land-text-name' onMouseEnter={() => hoveredCard(enchant.id) } onMouseOut={() => hoveredCard()} 
                                    onClick={()=>chooseEnchant(enchant.id)} >{enchant.name}</h5>

                                    <div className='deckbuilding-number-container'>
                                        { format !== "COMMANDER" && ( 
                                        <div className='deckbuilding-text-number'>                              
                                        <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => deleteCard(enchant.id)} >
                                                                    <AiOutlineMinusCircle  size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button>
                                        
                                        <p className='p-card-length'>{numberEnchant(enchant.id)}</p>                                  
                                        <button className="add-button-deckbuilding" disabled={numberEnchant(enchant.id) > 3} style={{ margin : '2%', border: 'none' }} onClick={() => addCard(enchant.id)} ><CgAdd size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button> 
                                        </div>
                                        )}

                                        <TiDeleteOutline className='delete-card-button' color='red' size={'3em'} onClick={()=>deleteCards(enchant.id)}/>
                                    </div>
                                    {detailsCard && detailsCard.id === enchant.id && (
                                    <img className="card-img-zoom" src={enchant.image && enchant.image.startsWith('/uploads/') ? `https://localhost:8443${enchant.image}` : enchant.image} alt="Card-image"/>
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
                                    <h5 className='land-text-name' onMouseEnter={() => hoveredCard(spell.id) } onMouseOut={() => hoveredCard()} onClick={()=>chooseSpell(spell.id)} >{spell.name}</h5>
                                    
                                     <div className='deckbuilding-text-number'>
                                        { format !== "COMMANDER" && (
                                        <div className='deckbuilding-text-number'>                              
                                        <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => deleteCard(spell.id)} >
                                                                    <AiOutlineMinusCircle  size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button>
                                        
                                        <p className='p-card-length'>{numberSpell(spell.id)}</p>                                  
                                        <button className="add-button-deckbuilding" disabled={numberSpell(spell.id) > 3} style={{ margin : '2%', border: 'none' }} onClick={() => addCard(spell.id)} ><CgAdd size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button> 
                                        </div>
                                        )}
                                        <TiDeleteOutline className='delete-card-button' color='red' size={'3em'} onClick={()=>deleteCards(spell.id)}/>
                                    </div>
                                    {detailsCard && detailsCard.id === spell.id && (
                                    <img className="card-img-zoom" src={spell.image && spell.image.startsWith('/uploads/') ? `https://localhost:8443${spell.image}` : spell.image} alt="Card-image"/>
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
                                    <h5 className='land-text-name' onMouseEnter={() => hoveredCard(artefact.id) } onMouseOut={() => hoveredCard()} onClick={()=>chooseArtefact(artefact.id)} >{artefact.name}</h5>
                                     <div className='deckbuilding-number-container'>
                                        { format !== "COMMANDER" && (
                                        <div className='deckbuilding-text-number'>                              
                                        <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => deleteCard(artefact.id)} >
                                                                    <AiOutlineMinusCircle  size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button>
                                        
                                        <p className='p-card-length'>{numberArtefact(artefact.id)}</p>                                  
                                        <button className="add-button-deckbuilding" disabled={numberArtefact(artefact.id) > 3} style={{ margin : '2%', border: 'none' }} onClick={() => addCard(artefact.id)} ><CgAdd size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button> 
                                        </div>
                                        )}
                                        <TiDeleteOutline className='delete-card-button' color='red' size={'3em'} onClick={()=>deleteCards(artefact.id)}/>
                                    </div>
                                    {detailsCard && detailsCard.id === artefact.id && (
                                    <img className="card-img-zoom" src={artefact.image && artefact.image.startsWith('/uploads/') ? `https://localhost:8443${artefact.image}` : artefact.image} alt="Card-image"/>
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
                                    <h5 className='land-text-name' 
                                        onMouseEnter={() => hoveredCard(planeswalker.id)} 
                                        onMouseOut={() => hoveredCard()} 
                                        onClick={() => choosePlaneswalker(planeswalker.id)}>
                                        {planeswalker.name}
                                    </h5>
                                    <div className='deckbuilding-number-container'>
                                    { format !== "COMMANDER" && (
                                    <div className='deckbuilding-text-number'>                              
                                        <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => deleteCard(planeswalker.id)} >
                                            <AiOutlineMinusCircle size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button>
                            
                                        <p className='p-card-length'>{numberPlaneswalker(planeswalker.id)}</p>                                  
                                        <button className="add-button-deckbuilding" disabled={numberPlaneswalker(planeswalker.id) > 3} style={{ margin : '2%', border: 'none' }} onClick={() => addCard(planeswalker.id)} >
                                            <CgAdd size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button> 
                                    </div>
                                    )}
                                    <TiDeleteOutline className='delete-card-button' color='red' size={'3em'} onClick={() => deleteCards(planeswalker.id)}/>
                                    </div>
                                    {detailsCard && detailsCard.id === planeswalker.id && (
                                        <img className="card-img-zoom" 
                                            src={planeswalker.image && planeswalker.image.startsWith('/uploads/') ? `https://localhost:8443${planeswalker.image}` : planeswalker.image} 
                                            alt="Card-image"/>
                                    )} 
                                </div>
                            ))} 

                    </div>
                </div>
            )}
        </div>

                
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

                
                   <IoIosArrowDropleft className='icon-close-popup' size={'5em'}  onClick={()=>navigate(-1)}/>      
    
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
            

                { popupHand && (
                            <div className='popup-bckg'> 
                                <div className='hand-background' style={{
                                        backgroundImage:`url(${backgroundHand})`,
                                        backgroundSize: "120%",        
                                        backgroundPosition: "center",   
                                        backgroundRepeat: "no-repeat"}}>
                                    {hand.map((card, index) => ( 
                                        <div className="cards-hand-details" key={index}>
                                            <img className="cards-draw-img" src={getImageUrl(card.image)} alt="Card-image"
                                            onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
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


                        
                {/* Popup de zoom avec navigation */}
                {displayZoomPopup && hand.length > 0 && (
                            <div className='popup-bckg'>                                
                                <img className="card-selected-image-zoom" src={getImageUrl(hand[currentCardIndex].image)} alt="Card mtg"/>
                                <CgCloseO className='icon-close-popup' color='white' size={'5em'} onClick={()=> setDisplayZoomPopup(false)}/>
                            </div>
                )}
                            

                {popupPub && (
                    <div className='popup-bckg'>
                        
                        <div className='set-attributs-deck'>
                            <div className='pub-title-container'>
                                <h1 className='pub-title'>Deck publié, félicitations</h1>
                            </div>
                            <MdPublishedWithChanges size={'5em'} color=" #5D3B8C" />
                            <button  type="button" className="valid-form" onClick={() => {setPopupPub(false);}}>
                                                Ok
                                    </button>
                        </div>
                    </div>
                )}

        <FooterSection/>
                                
    </Section> 
        )

 } 

 export default Deckbuilding;