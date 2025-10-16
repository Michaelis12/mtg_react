import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation ,  useNavigate} from 'react-router-dom';
import "./css/Deckbuilding.css";
import Card from '../model/CardApiSave';
import deckPile from "../assets/deck_pile.png"
import backgroundRedGreen from "../assets/background_cardsPage2.jpg"
import backgroundHand from "../assets/background_hand.png"
import backgroundPopup from "../assets/background_white.png"
import backgroundCedh from "../assets/mtg_wallpaper.jpg"
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import colorless from "../assets/incolore-mtg.png"
import loading from "../assets/loading.gif"
import { TiDeleteOutline } from "react-icons/ti";
import { RiResetLeftFill } from "react-icons/ri";
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
import ButtonValid from '../components/buttonValid';
import PopupDelete from '../components/popupDelete';
import Title from '../components/title';
import TitleType from '../components/titleType';
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
       const [deckCardsLength, setDeckCardsLength] = React.useState([])
       const [deckCardsGraphic, setDeckCardsGraphic] = React.useState([])
       const [colors, setColors] = React.useState([])
       const [format, setFormat]= React.useState([])
       const [cmc, setCmc]= React.useState()

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
            
            if(value === "colorless") {
                return "none";
            }
            
        }


        // Modifier le deck
        
        const [newName, setNewName] = React.useState("")
        const [newImage, setNewImage] = React.useState("")
        


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

        // Requete les cartes du deck et les sépare par type
        useEffect(() => {
            const getCardsDeck = async () => {
                try {
                    setDisplayLoading(true);
                    const request = await axiosInstance.get(`/f_all/getCardDeckID?deckID=${id}`);

                    const listCards = request.data.map(cardData => Card.fromApi(cardData));
                    setDeckCards(listCards)
                    setDeckCardsLength(listCards.length)
                    setDeckCardsGraphic(listCards)

                
                const landCards = listCards.filter(card => card.types.includes("Land"));
                if (landCards.length > 0) {
                    setDeckLands(landCards);

                    const uniqueCards = Array.from(
                        new Map(landCards.map(card => [card.id, card])).values()
                    );
                    setDeckLandsUnit(uniqueCards);
                }

                const creatureCards = listCards.filter(card => card.types.includes("Creature"));
                if (creatureCards.length > 0) {
                    setDeckCreatures(creatureCards)
                    
                    const uniqueCards = Array.from(
                    new Map(creatureCards.map(card => [card.id, card])).values()
                    );
                    setDeckCreaturesUnit(uniqueCards);
                }


                const artefactCards = listCards.filter(card => card.types.includes("Artifact") && !card.types.includes("Creature"));
                if (artefactCards.length > 0) {
                    setDeckArtefacts(artefactCards)

                    const uniqueCards = Array.from(
                    new Map(artefactCards.map(card => [card.id, card])).values()
                    );
                    setDeckArtefactsUnit(uniqueCards);
                }


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

            const validCards = deckCards.filter(card => typeof !card.types.includes("Land"));

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


        // Desactiver le bouton de publication si le nb de cartes suffisant n'est pas encore atteint
        const disabledPublication = () => {
            if(deck.format === "commander") {
                return deckCardsLength !== 99 
            }
            else {
                return deckCardsLength < 40
            } 
        }

        const [popupPub, setPopupPub]= React.useState(false)

        // Publier le deck
        const publishDeck = async () => {
            try { 
                setDisplayLoading(true);
                const response = await axiosInstance.put(`/f_user/deckPublic?deckID=${id}`, null, { withCredentials: true });
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

                if (card.types.includes("Land")) {
                    cardsIds = deckLandsUnit.map(card => card.apiID);
                } else if (card.types.includes("Creature")) {
                    cardsIds = deckCreatures.map(card => card.apiID);
                } else if (card.types.includes("Artifact")) {
                    cardsIds = deckArtefacts.map(card => card.apiID);
                } else {
                    cardsIds = [];
                }


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
            
            // Ouvre le popup de zoom pour une carte de la main (index) ou un type de carte (objet)
            const openZoomPopup = (cardOrIndex) => {
                if (cardOrIndex && cardOrIndex.image) {

                    setCardImage(cardOrIndex.image);
                    setCardID(cardOrIndex.id);
                    if(deck.format === "commander") {
                        if(cardOrIndex.id === deckCedh.id) {
                        setNavigateListID([cardOrIndex.id]);
                        setListImage(cardOrIndex.image);
                        setDisplayZoomPopup(true);
                        return
                        }
                    }
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

        // Zoom pour afficher les cartes dans la partie mobile

           // Ajout des états pour le zoom de la main et du land
            const [cardImage, setCardImage] = useState(null);
            const [cardID, setCardID] = useState(null);
            const [navigateListID, setNavigateListID] = useState([]);
            const [listImage, setListImage] = useState([]);


              // Boutons navigation cartes
            const prevCard = () => {
                                       const currentIndex = navigateListID.indexOf(cardID);
                                       const currentImage = listImage.indexOf(cardImage);
           
                                       if (currentIndex > 0) {
                                           setCardID(navigateListID[currentIndex - 1]);
                                           setCardImage(listImage[currentImage - 1]);
                                       }
                     
            }; 
                       
                               
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


             // Navigue vers la carte suivante dans a liste
            const nextCard =  () => {
                                        const currentIndex = navigateListID.indexOf(cardID);
                                         const currentImage = listImage.indexOf(cardImage);
            
                                        if (currentIndex >= 0 && currentIndex < navigateListID.length - 1) {
                                            setCardID(navigateListID[currentIndex + 1]);
                                            setCardImage(listImage[currentImage + 1]);
                                        }
                        
            };
      
                                
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
            const typeCount = deckCardsGraphic.reduce((acc, card) => {
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


        // Sélectionne des cartes un format =/= commander
        const selectCard = (newCard) => {
            setDeckCards(prevCards => [...prevCards, newCard])

            if (cardsUnselected.filter(id => id === newCard.id).length > 0) {
                setCardsUnselected(prevCards => {
                      const index = prevCards.findIndex(card => card === newCard.id);
                      const newCards = [...prevCards];
                      newCards.splice(index, 1);
                      return newCards;
                    });
            }
            else {
              setCardsSelected(prevCards => [...prevCards, newCard.id])
            }


        };
        
        // Retire des cartes pour un format =/= commander 
        const unselectCard = (cardToRemove) => {
         setDeckCards(prevCards => {
            const index = prevCards.findIndex(card => card.id === cardToRemove.id);

            if (index === -1) return prevCards; // aucune carte trouvée → rien à changer

            // copie immuable du tableau
            const newCards = [...prevCards];
            newCards.splice(index, 1); // supprime UNE seule occurrence
            return newCards;
        });

                if (cardsSelected.filter(id => id === cardToRemove.id).length > 0)
                    setCardsSelected(prevCards => {
                      const index = prevCards.findIndex(card => card === cardToRemove.id);
                      const newCards = [...prevCards];
                      newCards.splice(index, 1);
                      return newCards;
                    });
                else {
                     setCardsUnselected(prevCards => [...prevCards, cardToRemove.id])
                }

                
        };
                
        // Retire tous les exemplaires d'une carte
        const unselectCards = (cardToRemove) => {

            if(cardToRemove.types.includes("Land")) {
                setDeckLands(prevCards => prevCards.filter(card => card.id !== cardToRemove.id));
                setDeckLandsUnit(prevCards => prevCards.filter(card => card.id !== cardToRemove.id));
            }

            if(cardToRemove.types.includes("Creature")) {
                setDeckCreatures(prevCards => prevCards.filter(card => card.id !== cardToRemove.id));
                setDeckCreaturesUnit(prevCards => prevCards.filter(card => card.id !== cardToRemove.id));
            }

            if(cardToRemove.types.includes("Artifact")) {
                setDeckArtefacts(prevCards => prevCards.filter(card => card.id !== cardToRemove.id));
                setDeckArtefactsUnit(prevCards => prevCards.filter(card => card.id !== cardToRemove.id));
            }

            setDeckCards((prevCards) => {
                // Sépare les cartes à garder et celles à retirer
                const remainingCards = prevCards.filter(card => card.id !== cardToRemove.id);
                const removedCards = prevCards.filter(card => card.id === cardToRemove.id);


                // Met à jour cardsUnselected en évitant les doublons
                setCardsUnselected((prevUnselected) => {
                    // On filtre les ids déjà présents
                    const newIds = removedCards
                        .map(card => card.id)
                        .filter(id => !prevUnselected.includes(id));

                    return [...prevUnselected, ...newIds];
                });

                return remainingCards;
            });

        };


        // Donne le nombre d'exemplaire d'une carte
        const count = (cardID) => {
            const deckCardsid = deckCards.map(card => card.id);
            return deckCardsid.filter(id => id === cardID).length 
        }

        const [displayAddPopUp, setDisplayAddPopUp] = useState(false)

        // Enregistrer les modifications
        const updateCards = async () => {
            try { 
                setDisplayLoading(true)


                if(cardsSelected.length > 0) {
                const request1 = await axiosInstance.post(`f_user/duplicateCardsOnDeck?cardsId=${cardsSelected}&deckId=${id}`, null, { withCredentials: true });
                }
                if (cardsUnselected.length > 0) {
                const request2 = await axiosInstance.delete(`/f_user/deleteCardsListOnDeck?cardId=${cardsUnselected}&deckId=${id}`, { withCredentials: true });
                }

                window.location.reload();
                
                 }   
            catch (error) {
                console.log(error);
            }
            finally {
              setDisplayLoading(false)
            }
        }

        // Annuler les modifications
        const resetCards = () => {
            setCardsSelected([])
            setCardsUnselected([])
            setDeckSignal(!deckSignal)
        } 

        const updateCardText = () => {


            if (cardsSelected.length < 1) {
                return `${cardsUnselected.length} cartes retirées ` 
            }
            if (cardsUnselected.length < 1) {
                return `+ ${cardsSelected.length} cartes ajoutées` 
            }

            return `${cardsSelected.length} cartes ajoutées , ${cardsUnselected.length} cartes retirées `

        }

        // Masque les cartes si elles ont été retirées de la liste
        const maskCard = (id) => {
            const deckCardsid = deckCards.map(card => card.id);
            if(!deckCardsid.includes(id)) {
                return 'flex'
            }
        }

        
        
        
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
                                                          <h1 className='deck-name'>{deck.name} 
                                                                   {!deck.isPublic && (
                                                                        <h4 className='deck-card-public' style={{background: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif'}}>privé</h4>
                                                                    )} 
                                                                    {deck.isPublic && (
                                                                        <h4 className='deck-card-public' style={{background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif'}}>public</h4>
                                                                    )} 
                                                            </h1> 
                                  
                                                          <div className="deck-content">
                                                               <img className="deckbuilding-pp" style={{marginTop: '-5%'}}
                                                               src={deck.image && deck.image.startsWith('/uploads/') ? `http://localhost:8080${deck.image}` : deck.image} alt="Deck mtg"/> 
                                
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
                                                                    <h3><strong>{cmc}</strong></h3>
                                                                </div>
                
                                                              </div>
                                                                  
                                                          </div>  
                  
                                </div> 
     
                            </div>
                
                 
                             {/*La carte format medium*/}   
                            <h2 className='deck-selected-card-medium-name'style={{marginTop: '2%'}}>{deck.name}</h2> 
                            <div className="deck-selected-card-medium" style={{ backgroundImage: `url(${backgroundPopup})`}}>
                                    <div className="img-container">
                                                          <img className="new-deck-img-mobile" src={deck.image && deck.image.startsWith('/uploads/') ? `http://localhost:8080${deck.image}` : deck.image} alt="Deck mtg"/>
                                    </div>
                                    <div className="card-medium-body" >
                                    
                                    {!deck.isPublic && (
                                        <h4 className='deck-card-public' style={{background: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif'}}>privé</h4>
                                    )}
                                    {deck.isPublic && (
                                        <h4 className='deck-card-public' style={{background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif'}}>public</h4>
                                    )}
                                                                
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
                                                                    <h3><strong>{cmc}</strong></h3>
                                    </div>
                           
                
                                   </div> 
                            </div>  
                            
                
                            {/*La carte format mobile*/}
                            <h2 className='deck-card-mobile-name' style={{marginTop: '2%'}}>{deck.name}</h2>
                            <div style={{ backgroundImage: `url(${backgroundPopup})`}} className="deck-card-mobile" >
                                    <div className="img-container">
                                                          <img className="hover-deck-card-img" src={deck.image && deck.image.startsWith('/uploads/') ? `http://localhost:8080${deck.image}` : deck.image} alt="Deck mtg"/>
                                    </div>
                
                                    <div className="deck-hover-body" >

                                                {!deck.isPublic && (
                                                    <h4 className='deck-card-public' style={{background: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif'}}>privé</h4>
                                                )}
                                                {deck.isPublic && (
                                                    <h4 className='deck-card-public' style={{background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif'}}>public</h4>
                                                )}
     
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
                                                                    <h4  className='card-manacost'>{cmc}</h4>
                                                </div>
                
                                                                
                                    </div> 
                            </div>
                
                {/*Popup d'edit du deck*/}
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
                                <img className='deck-selected-img' src={newImage && newImage.startsWith('/uploads/') ? `http://localhost:8080${newImage}` : newImage} alt="deck-img" />
                                
                                <ButtonValidPopup disabled={displayLoading} onClick={()=>editDeck()}/>
                      </div>
                     <CgCloseO className='icon-close-popup' color='white' size={'5em'}  onClick={()=>cancelEdit()}/> 
                    </div>
                    
                )}  

                {/*Popup de suppression du deck*/}
                {displayPopup && (
                        
                            <PopupDelete title="Supprimer le deck ?" 
                            text='La suppression du deck est irréversible. Toutes les données seront définitivement perdues.'
                            onClick={()=>deleteDeck()} back={() => setDisplayPopup(false)}/>
                       )}

            
            {/*  Boutons d'action */}
            <div className='deckbuilding-buttons-container'>                       
                        
                <div className='admin-users-button'>

                {/* Naviguer vers la page d'ajout de cartes */}
                <button className='update-deck-container' onClick={()=>navigateCards()} 
                >
                    <GiCardPlay className='icon-update-user' />
                    <h5 className='update-user-p'>Ajouter des cartes</h5>
                </button> 
                
                {/* Afficher une main piochée dans le deck */}
                <button className='update-deck-container' onClick={()=>displayHand()}>
                    <GiCardRandom className='icon-update-user' />
                    <h5 className='update-user-p'>Piocher une main</h5>
                </button>
                
                {/* Passer le deck en public */}
                {!deck.isPublic && ( 
                            <button className="pub-deck-container" 
                            disabled={disabledPublication()} onClick={()=>publishDeck()}>
                                <MdSend className='icon-update-user' />
                                <div className='pub-deck-text-container' >
                                <h5 className='update-user-p'>Publier le deck </h5>
                                <strong className='update-user-p2'>({cardsNumber()} cartes)</strong>
                                </div>
                            </button> 
                               
                )}

                {/* Passer le deck en privé */}
                {deck.isPublic && (
                    <button className='pv-deck-container' onClick={()=>privateDeck()}>
                        <RiGitRepositoryPrivateLine  className='icon-update-user' />
                        <h5 className='update-user-p'>Passer en privé</h5>
                    </button>                   
                )}
                </div>
            </div>
                

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
            <div style={{width: '30%'}}>
            <TitleType title={"Commandant"}/>
            </div>
            <div className="cedh-background" id='creature-card' style={{ backgroundImage: `url(${backgroundCedh})`}}>
             <div className="cedh-details">
                
                <div className='card-link-desktop'>
                    <img className="cedh-img" src={deckCedh.image && deckCedh.image.startsWith('/uploads/') ? `http://localhost:8080${deckCedh.image}` : deckCedh.image} alt="creature-img" onClick={()=>navCedh(deckCedh.apiID)}
                                                onMouseEnter={() => hoveredCard(deckCedh.id) } onMouseOut={() => hoveredCard()}/>
                </div>

                <div className='card-link-mobile'>
                    <img className="cedh-img" src={deckCedh.image && deckCedh.image.startsWith('/uploads/') ? `http://localhost:8080${deckCedh.image}` : deckCedh.image} alt="creature-img" 
                    onClick={()=>openZoomPopup(deckCedh)} />
                </div>
                                            
                {detailsCard && detailsCard.id === deckCedh.id && (
                                            <img className="card-img-zoom" src={deckCedh.image && deckCedh.image.startsWith('/uploads/') ? `http://localhost:8080${deckCedh.image}` : deckCedh.image} alt="Card-image"
                                            />
                )}
            </div>
            </div>
        </div>
        )} 


        {/*Affichage des cartes par types*/}
        <div className='decks-types-map'> 
          
            { deckLands.length > 0 && (
                <div className='decks-type-map' style={{ backgroundImage: `url(${backgroundPopup})`, backgroundPosition: 'top'}}>
                    <TitleType title={"Terrains ("+ deckLands.length + ")"}/>
                    <div className='deck-text-map'>
                        {deckLandsUnit.map(land => {
                            return (
                                <div className="land-text-details" id='land-card'  style={{display: maskCard(land.id)}} key={land.id}>
                                    
                                    <div className='card-link-desktop'>
                                        <h5 className='land-text-name' onMouseEnter={() => hoveredCard(land.id) } onMouseOut={() => hoveredCard()} onClick={()=>navCard(land)}>{land.name}</h5>
                                    </div>

                                    <div className='card-link-mobile'>
                                        <h5 className='land-text-name'  onClick={()=> openZoomPopup(land)} >{land.name}</h5>
                                    </div>


                                    {detailsCard && detailsCard.id === land.id && (
                                            <img className="card-img-zoom"  src={land.image && land.image.startsWith('/uploads/') ? `http://localhost:8080${land.image}` : land.image} alt="Card-image" />
                                        )}
                                    <div className='deckbuilding-number-container'>
                                        {land.id < 7 && (
                                            <div className='deckbuilding-text-number'>

                                                { cardsSelected.filter(cardDeck => cardDeck === land.id).length > 0  && (
                                                    <p className='p-card-add-length-deckbuilding'>+ {cardsSelected.filter(cardDeck => cardDeck === land.id).length}</p>
                                                )}

                                                { cardsUnselected.filter(cardDeck => cardDeck === land.id).length > 0  && (
                                                    <p className='p-card-add-length-deckbuilding' style={{color: 'red'}}>- {cardsUnselected.filter(cardDeck => cardDeck === land.id).length}</p>
                                                )}

                                                <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => unselectCard(land)} >
                                                <AiOutlineMinusCircle  size={'2em'} color={'black'} className="icon-add-card" />
                                                </button>
                                                <p className='p-card-length'>{count(land.id)}</p>
                                                <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => selectCard(land)} >
                                                <CgAdd size={'2em'} color={'black'} className="icon-add-card"/>
                                                </button>
                                            </div>
                                        )} 
                                        {format !== "commander" && land.id > 6 && (
                                        <div className='deckbuilding-text-number'>                              
                                            <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => unselectCard(land)} >
                                                <AiOutlineMinusCircle  size={'2em'} color={'black'} className="icon-add-card" />
                                            </button>
                                            
                                            <p className='p-card-length'>{count(land.id)}</p>

                                            { cardsSelected.filter(cardDeck => cardDeck === land.id).length > 0  && (
                                                    <p className='p-card-add-length-deckbuilding'>+ {cardsSelected.filter(cardDeck => cardDeck === land.id).length}</p>
                                                )}

                                                { cardsUnselected.filter(cardDeck => cardDeck === land.id).length > 0  && (
                                                    <p className='p-card-add-length-deckbuilding' style={{color: 'red'}}>- {cardsUnselected.filter(cardDeck => cardDeck === land.id).length}</p>
                                                )}

                                            <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} disabled={count(land.id) > 3} onClick={() => selectCard(land)} >
                                                <CgAdd size={'2em'} color={'black'} className="icon-add-card"/>
                                            </button>
                                        </div>
                                        )}
                                        <TiDeleteOutline className='delete-card-button' color='red' size={'3em'} onClick={() => unselectCards(land)} />
                                        
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
                                <div className="land-text-details" id='land-card' style={{display: maskCard(creature.id)}} key={creature.id}>
                                    
                                    <div className='card-link-desktop'>
                                            <h5 className='land-text-name' onMouseEnter={() => hoveredCard(creature.id) } onMouseOut={() => hoveredCard()} onClick={()=>navCard(creature)}>{creature.name}</h5>
                                        </div>
                                        <div className='card-link-mobile'>
                                            <h5 className='land-text-name' onClick={()=> openZoomPopup(creature)} >{creature.name}</h5>
                                        </div>
                                    
                                    <div className='deckbuilding-number-container'>
                                        { format !== "commander" && !creature.legendary && ( 
                                        <div className='deckbuilding-text-number'>  
                                            { cardsSelected.filter(cardDeck => cardDeck === creature.id).length > 0  && (
                                                    <p className='p-card-add-length-deckbuilding'>+ {cardsSelected.filter(cardDeck => cardDeck === creature.id).length}</p>
                                                )}

                                            { cardsUnselected.filter(cardDeck => cardDeck === creature.id).length > 0  && (
                                                <p className='p-card-add-length-deckbuilding' style={{color: 'red'}}>- {cardsUnselected.filter(cardDeck => cardDeck === creature.id).length}</p>
                                             )}

                                            <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => unselectCard(creature)} >
                                                                        <AiOutlineMinusCircle  size={'2em'} color={'black'} className="icon-add-card"/>
                                            </button>

                        
                                            
                                            <p className='p-card-length'>{count(creature.id)}</p>                                  
                                            <button className="add-button-deckbuilding" disabled={count(creature.id) > 3}
                                            style={{ margin : '2%', border: 'none' }} 
                                            onClick={() => selectCard(creature)} ><CgAdd size={'2em'} color={'black'} className="icon-add-card"/>
                                            </button> 
                                        </div>
                                        )}
                                        <TiDeleteOutline className='delete-card-button' color='red' size={'3em'} onClick={()=>unselectCards(creature)}/>
                                </div>  
                                    {detailsCard && detailsCard.id === creature.id && (
                                    <img className="card-img-zoom" src={creature.image && creature.image.startsWith('/uploads/') ? `http://localhost:8080${creature.image}` : creature.image} alt="Card-image"/>
                                    )} 
                                </div>
                        
                            ))}
                    </div>
                </div>
            )}

            { deckEnchants.length > 0 && (
                <div className='decks-type-map' style={{ backgroundImage: `url(${backgroundPopup})`, backgroundPosition: 'top'}}>
                    <TitleType title={"Enchantements (" + deckCards.filter(card => card.type === "ENCHANTEMENT").length + ")"}/>
                    <div className='deck-text-map'>
                            {deckEnchantsUnit.map(enchant => ( 
                                <div className="land-text-details" id='land-card' style={{display: maskCard(enchant.id)}} key={enchant.id}>
                                    
                                    <div className='card-link-desktop'>
                                            <h5 className='land-text-name' onMouseEnter={() => hoveredCard(enchant.id) } onMouseOut={() => hoveredCard()} onClick={()=>navCard(enchant)}>{enchant.name}</h5>
                                        </div>
                                    <div className='card-link-mobile'>
                                            <h5 className='land-text-name' onClick={()=> openZoomPopup(enchant)} >{enchant.name}</h5>
                                    </div>

                                    <div className='deckbuilding-number-container'>
                                        { format !== "commander" && ( 
                                        <div className='deckbuilding-text-number'>                              
                                        <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => unselectCard(enchant)} >
                                                                    <AiOutlineMinusCircle  size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button>
                                        
                                        { cardsSelected.filter(cardDeck => cardDeck === enchant.id).length > 0  && (
                                                <p className='p-card-add-length-deckbuilding'>+ {cardsSelected.filter(cardDeck => cardDeck === enchant.id).length}</p>
                                        )}

                                        { cardsUnselected.filter(cardDeck => cardDeck === enchant.id).length > 0  && (
                                                <p className='p-card-add-length-deckbuilding' style={{color: 'red'}}>- {cardsUnselected.filter(cardDeck => cardDeck === enchant.id).length}</p>
                                        )}
                                        
                                        <p className='p-card-length'>{count(enchant.id)}</p>                                  
                                        <button className="add-button-deckbuilding" disabled={count(enchant.id) > 3} style={{ margin : '2%', border: 'none' }} onClick={() => selectCard(enchant)} ><CgAdd size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button> 
                                        </div>
                                        )}

                                        <TiDeleteOutline className='delete-card-button' color='red' size={'3em'} onClick={()=>unselectCards(enchant)}/>
                                    </div>
                                    {detailsCard && detailsCard.id === enchant.id && (
                                    <img className="card-img-zoom" src={enchant.image && enchant.image.startsWith('/uploads/') ? `http://localhost:8080${enchant.image}` : enchant.image} alt="Card-image"/>
                                    )} 
                                </div>
                        
                            ))}
                    </div>
                </div>
            )}
                
            { deckSpells.length > 0 && (
                <div className='decks-type-map' style={{ backgroundImage: `url(${backgroundPopup})`, backgroundPosition: 'top'}}>
                    <TitleType title={"Sorts (" + deckCards.filter(card =>
                            card.type === "EPHEMERE" || card.type === "RITUEL" || card.type === "BATAILLE"
                            ).length
                            + ")"}/>
                    <div className='deck-text-map'>
                            {deckSpellsUnit.map(spell => ( 
                                <div className="land-text-details" id='land-card' style={{display: maskCard(spell.id)}}  key={spell.id}>
                                    
                                    <div className='card-link-desktop'>
                                            <h5 className='land-text-name' onMouseEnter={() => hoveredCard(spell.id) } onMouseOut={() => hoveredCard()} onClick={()=>navCard(spell)}>{spell.name}</h5>
                                        </div>
                                        <div className='card-link-mobile'>
                                            <h5 className='land-text-name' onClick={()=> openZoomPopup(spell)} >{spell.name}</h5>
                                        </div>
                                    
                                     <div className='deckbuilding-text-number'>
                                        { format !== "commander" && (
                                        <div className='deckbuilding-text-number'>   
                                        { cardsSelected.filter(cardDeck => cardDeck === spell.id).length > 0  && (
                                                <p className='p-card-add-length-deckbuilding'>+ {cardsSelected.filter(cardDeck => cardDeck === spell.id).length}</p>
                                        )}

                                        { cardsUnselected.filter(cardDeck => cardDeck === spell.id).length > 0  && (
                                                <p className='p-card-add-length-deckbuilding' style={{color: 'red'}}>- {cardsUnselected.filter(cardDeck => cardDeck === spell.id).length}</p>
                                        )}

                                        <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => unselectCard(spell)} >
                                                                    <AiOutlineMinusCircle  size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button>
                                        
                                        <p className='p-card-length'>{count(spell.id)}</p>                                  
                                        <button className="add-button-deckbuilding" disabled={count(spell.id) > 3} style={{ margin : '2%', border: 'none' }} onClick={() => selectCard(spell)} ><CgAdd size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button> 
                                        </div>
                                        )}
                                        <TiDeleteOutline className='delete-card-button' color='red' size={'3em'} onClick={()=>unselectCards(spell)}/>
                                    </div>
                                    {detailsCard && detailsCard.id === spell.id && (
                                    <img className="card-img-zoom" src={spell.image && spell.image.startsWith('/uploads/') ? `http://localhost:8080${spell.image}` : spell.image} alt="Card-image"/>
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
                                <div className="land-text-details" id='land-card' style={{display: maskCard(artefact.id)}}  key={artefact.id}>

                                        <div className='card-link-desktop'>
                                            <h5 className='land-text-name' onMouseEnter={() => hoveredCard(artefact.id) } onMouseOut={() => hoveredCard()} onClick={()=>navCard(artefact)}>{artefact.name}</h5>
                                        </div>
                                       <div className='card-link-mobile'>
                                            <h5 className='land-text-name' onClick={()=> openZoomPopup(artefact)} >{artefact.name}</h5>
                                       </div>

                                     <div className='deckbuilding-number-container'>
                                        { format !== "commander" && (
                                        <div className='deckbuilding-text-number'>   

                                        { cardsSelected.filter(cardDeck => cardDeck === artefact.id).length > 0  && (
                                                <p className='p-card-add-length-deckbuilding'>+ {cardsSelected.filter(cardDeck => cardDeck === artefact.id).length}</p>
                                        )}

                                        { cardsUnselected.filter(cardDeck => cardDeck === artefact.id).length > 0  && (
                                                <p className='p-card-add-length-deckbuilding' style={{color: 'red'}}>- {cardsUnselected.filter(cardDeck => cardDeck === artefact.id).length}</p>
                                        )}

                                        <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => unselectCard(artefact)} >
                                                                    <AiOutlineMinusCircle  size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button>
                                        
                                        <p className='p-card-length'>{count(artefact.id)}</p>                                  
                                        <button className="add-button-deckbuilding" disabled={count(artefact.id) > 3} style={{ margin : '2%', border: 'none' }} onClick={() => selectCard(artefact)} ><CgAdd size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button> 
                                        </div>
                                        )}
                                        <TiDeleteOutline className='delete-card-button' color='red' size={'3em'} onClick={()=>unselectCards(artefact)}/>
                                    </div>
                                    {detailsCard && detailsCard.id === artefact.id && (
                                    <img className="card-img-zoom" src={artefact.image && artefact.image.startsWith('/uploads/') ? `http://localhost:8080${artefact.image}` : artefact.image} alt="Card-image"/>
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
                                <div className="land-text-details" id='land-card' key={planeswalker.id}
                                style={{display: maskCard(planeswalker.id)}}>
                                    <div className='card-link-desktop'>
                                        <h5 className='land-text-name' 
                                        onMouseEnter={() => hoveredCard(planeswalker.id)} 
                                        onMouseOut={() => hoveredCard()} 
                                        onClick={() => navCard(planeswalker)}>
                                        {planeswalker.name}
                                        </h5>
                                    </div>
                                    <div className='card-link-mobile'>
                                        <h5 className='land-text-name' onClick={()=> openZoomPopup(planeswalker)} >{planeswalker.name}</h5>
                                    </div>
                                    <div className='deckbuilding-number-container'>
                                    { format !== "commander" && (
                                    <div className='deckbuilding-text-number'>

                                        { cardsSelected.filter(cardDeck => cardDeck === planeswalker.id).length > 0  && (
                                                <p className='p-card-add-length-deckbuilding'>+ {cardsSelected.filter(cardDeck => cardDeck === planeswalker.id).length}</p>
                                        )}

                                        { cardsUnselected.filter(cardDeck => cardDeck === planeswalker.id).length > 0  && (
                                                <p className='p-card-add-length-deckbuilding' style={{color: 'red'}}>- {cardsUnselected.filter(cardDeck => cardDeck === planeswalker.id).length}</p>
                                        )}
                                                                      
                                        <button className="add-button-deckbuilding" style={{ margin : '2%', border: 'none' }} onClick={() => unselectCard(planeswalker)} >
                                            <AiOutlineMinusCircle size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button>
                            
                                        <p className='p-card-length'>{count(planeswalker.id)}</p>                                  
                                        <button className="add-button-deckbuilding" disabled={count(planeswalker.id) > 3} style={{ margin : '2%', border: 'none' }} onClick={() => selectCard(planeswalker)} >
                                            <CgAdd size={'2em'} color={'black'} className="icon-add-card"/>
                                        </button> 
                                    </div>
                                    )}
                                    <TiDeleteOutline className='delete-card-button' color='red' size={'3em'} onClick={() => unselectCards(planeswalker)}/>
                                    </div>
                                    {detailsCard && detailsCard.id === planeswalker.id && (
                                        <img className="card-img-zoom" 
                                            src={planeswalker.image && planeswalker.image.startsWith('/uploads/') ? `http://localhost:8080${planeswalker.image}` : planeswalker.image} 
                                            alt="Card-image"/>
                                    )} 
                                </div>
                            ))} 

                    </div>
                </div>
            )}
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
        
        {/*Bouton pour annuler les changements de carte */} 
        <button className="button-reset-cards" style={{position: 'fixed', bottom: '100px', right: '70px'}} onClick={()=>resetCards()} disabled={cardsSelected.length === 0 && cardsUnselected.length === 0 }>
            <RiResetLeftFill className="button-reset-cards-icon" size={'4em'} color="red"/></button>

        {/*Bouton pour valider les changements de carte */} 
        <ButtonValid style={{position: 'fixed', bottom: '15px', right: '50px'}}
                        onClick={()=>setDisplayAddPopUp(true)} disabled={cardsSelected.length === 0 && cardsUnselected.length === 0 } 
                        text={"Valider"}/>                                      

                {/* Popup de zoom carte mobile */}
                {displayZoomPopup && cardImage && (
                    <div className='popup-bckg'>                                
                                                                <img className="card-selected-image-zoom" src={getImageUrl(cardImage)} alt="Card mtg"/>
                                                                <button className='nav-card-button' onClick={()=>(navigate(`/cardSelected`, { state: { cardID: cardID, ListCard: navigateListID  }}))}>Afficher détails</button>
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
                                        backgroundSize: "120%",        
                                        backgroundPosition: "center",   
                                        backgroundRepeat: "no-repeat"}}>
                                    {hand.map((card, index) => ( 
                                        <div className="cards-hand-details" key={index}>
                                            <img className="cards-draw-img" src={getImageUrl(card.image)} alt="Card-image"
                                            onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                                            onClick={() => openZoomPopup(card)}
                                            />
                                            
                                        </div>
                                    
                                    ))}
                                   
                                </div>
                                 <button className='refresh-hand-button' onClick={()=>displayHand()} >
                                    <h5 style={{color: 'white', position: 'relative', top: '2px', fontFamily: 'MedievalSharp, cursive'}}> Pioche</h5> 
                                <SlRefresh color='white' size={"1.5em"}/></button>

                                <CgCloseO className='icon-close-popup-desktop'
                                color='white' size={'5em'} onClick={()=> {setPopupHand(false); setHand([])}} style={{position: 'fixed',
                                    bottom: '10'
                                }}/> 

                                <CgCloseO className='icon-close-popup-mobile'
                                color='white' size={'3em'} onClick={()=> {setPopupHand(false); setHand([])}} style={{position: 'fixed',
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

                {/* Popup d'ajout de cartes */}
                { displayAddPopUp && (
                                   <div className='popup-bckg'>
                                        <div className='popup-update-user'>
                                            <div className='header-ban-container'>
                                                <h2 style={{color: 'white', fontFamily: 'MedievalSharp, cursive'}}>Modifications effectuées</h2>
                                            </div>
                                            <h4 className='active-p1' style={{padding:'5%', color: 'black', textAlign: 'center'}} >{updateCardText()}</h4>                               
                                            <button className='valid-popup' onClick={() => updateCards()} disabled={displayLoading}><h4 className='valid-poup-title'>Enregistrer</h4></button>
                                          </div> 
                                          <CgCloseO className='icon-close-popup' color='white' size={'5em'} onClick={()=> setDisplayAddPopUp(false)}/> 
                                      </div>
                                )}
                            
                {/* Popup publication du deck */}
                {popupPub && (
                    <div className='popup-bckg'>
                        
                        <div className='set-attributs-deck'>
                            <div className='pub-title-container'>
                                <h1 className='pub-title'>Deck publié !</h1>
                            </div>
                            <img src={deckPile} className='pub-image' alt="deck_pile" /> 
                            <h4  className='pub-public'>public</h4>
                            <button  type="button" className="valid-popup" onClick={() => {setPopupPub(false); window.location.reload();}}>
                                            <h4 className="valid-popup-title" >Fermer</h4> 
                                    </button>
                        </div>
                    </div>
                )}

        <FooterSection/>
                                
    </Section> 
        )

 } 

 export default Deckbuilding;