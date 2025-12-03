import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TbFilterCancel } from "react-icons/tb";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { FaPencilAlt } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CgCloseO  } from "react-icons/cg";
import { FaHeart  } from 'react-icons/fa';
import defaultImg from "../assets/mtg-card-back.jpg"
import backgroundCardsPage from "../assets/background_cardsPage2.jpg"
import backgroundPopup from "../assets/background_white.png"
import backgroundWhite from "../assets/background_white.png";
import Section from '../components/sectionMap';
import Title from '../components/title';
import OpenButton from '../components/openButton';
import OpenButtonLarge from '../components/openButtonLarge';
import SearchBar from '../components/searchBar';
import InputValue from '../components/inputValue';
import InputManaCoast from '../components/inputManaCoast';
import Checkbox from '../components/checkbox'
import CheckboxAdd from '../components/checkboxAdd'
import CheckboxAddImage from '../components/checkboxAddImage'
import CheckboxColor from '../components/checkboxColor';
import CheckboxRarity from '../components/checkboxRarity';
import ButtonSelect from '../components/buttonSelect';
import PopupDelete from '../components/popupDelete';
import ButtonValidPopup from "../components/buttonValidPopup";
import FooterSection from '../components/footerSection';
import Card from '../model/Card';
import axiosInstance from "../api/axiosInstance";
import "./css/CardsPageAdmin.css";
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import incolore from "../assets/incolore-mtg.webp"
import loading from "../assets/loading.gif"
import { getImageUrl } from '../utils/imageUtils';

const CardsPageAdmin = () => {
    const [cards, setCards] = React.useState([])
    const [topCards, setTopCards] = React.useState([])
    const [detailsCard, setDetailsCard] = React.useState(null)
    const navigate = useNavigate();
    const [colors, setColors] = React.useState([])
    const [format, setFormat] = React.useState([])

    // Filtre recherche
    const [filterName, setFilterName] = React.useState("")
    const [filterText, setFilterText] = React.useState("")
    const [inputValueMin, setInputValueMin] = React.useState("")
    const [inputValueMax, setInputValueMax] = React.useState("")
    const [inputManaCostMin, setInputManaCostMin] = React.useState("")
    const [inputManaCostMax, setInputManaCostMax] = React.useState("")
    const [filterColors, setFilterColors] = React.useState([])
    const [filterFormats, setFilterFormats] = React.useState([])
    const [filterRarities, setFilterRarities] = React.useState([])
    const [filterEditions, setFilterEditions] = React.useState([])
    const [filterTypes, setFilterTypes] = React.useState([])
    const [filterLegendary, setFilterLegendary] = React.useState(null)

    // Mobile filters toggle (inspired by CardsPage)
    const [arrowFiltersSens, setArrowFiltersSens] = React.useState(<SlArrowDown/>);
    const [displayFilters, setDisplayFilters] = React.useState(false);
    const OpenFilters = () => {
      setArrowFiltersSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
      setDisplayFilters(!displayFilters);
    };

    // États pour la pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
        


    // Modifier une carte

        const [cardToUpdate, setCardToUpdate] = React.useState(null)

        const [cardName, setCardName] = React.useState("")
        const [cardText, setCardText] = React.useState("")
        const [cardImage, setCardImage] = React.useState("")
        const [cardManaCost, setCardManaCost] = React.useState("")
        const [cardValue, setCardValue] = React.useState("")
        const [cardColors, setCardColors] = React.useState([])
        const [cardFormats, setCardFormats] = React.useState([])
        const [cardType, setCardType] = React.useState("")
        const [cardLegendary, setCardLegendary] = React.useState(null)
        const [cardRarity, setCardRarity] = React.useState("")
        const [cardEdition, setCardEdition] = React.useState("")

        const [newName, setNewName] = React.useState("")
        const [newText, setNewText] = React.useState("")
        const [newImage, setNewImage] = React.useState("")
        const [newManaCost, setNewManaCost] = React.useState("")
        const [newValue, setNewValue] = React.useState("")
        const [newColors, setNewColors] = React.useState([])
        const [newFormats, setNewFormats] = React.useState([])
        const [newType, setNewType] = React.useState("")
        const [newLegendary, setNewLegendary] = React.useState(null)
        const [newRarity, setNewRarity] = React.useState("")
        const [newEdition, setNewEdition] = React.useState("")

        // Pop-up suppression
        const [cardToDelete, setCardToDelete] = useState(null);
        
        const [displayLoading, setDisplayLoading] = React.useState(false);
        const [displayCards, setDisplayCards] = React.useState("id")
        
        // Récupère les cartes triées par id 
        const getCardsWithID = async () => {             
            
            if (
              filterEditions.length < 1 || filterRarities.length < 1 ||
              filterColors.length < 1 || filterFormats.length < 1 ||
              filterTypes.length < 1
            ) {
              return;
            }
                 
        
            try {
              setIsLoading(true);
        
              const params = {
                page: 0,
                size: pageSize,
                order : 'id',
                name: filterName,
                text: filterText,
                colors: filterColors,
                formats: filterFormats,
                rarities: filterRarities,
                valueMin: inputValueMin,
                valueMax: inputValueMax,
                manaCostMin: inputManaCostMin,
                manaCostMax: inputManaCostMax,
                editions: filterEditions,
                types: filterTypes,
                legendary: filterLegendary
              };
        
              const response = await axiosInstance.get('/f_all/getCardsPaged', {
                params,
                paramsSerializer: { indexes: null }
              });
        
              const listCards = response.data.content.map(card => new Card(
                card.id, card.name, card.text, card.image, card.manaCost, card.value,
                card.formats, card.colors, card.type, card.legendary, card.rarity,
                card.edition, card.deckBuilders, card.decks, card.decksCommander,
                card.likeNumber, card.deckNumber, card.commanderNumber
              ));
        
              setCards(listCards)
              setHasMore(!response.data.isLast);
              setPage(1)
            } catch (error) {
              console.error('Erreur de chargement des cartes :', error);
            } finally {
              setIsLoading(false);
            }
          };
          // 👇 Rechargement des cartes quand la page change
          useEffect(() => {
            getCardsWithID();
          }, [ displayCards, filterName, filterText, inputValueMin, inputValueMax, inputManaCostMin, inputManaCostMax,
         filterColors, filterFormats, filterRarities, filterEditions, filterTypes, filterLegendary]);


         // Récupère les cartes triées par popularité 
        const getCardsWithLikes = async () => {
            try {
                setDisplayLoading(true); 
                if (filterEditions.length <1 || filterRarities.length <1 || filterColors.length <1
                    || filterFormats.length <1 || filterTypes.length <1
                ) {
                    setDisplayLoading(false);
                    return;
                }

                // Contient les RequestParams de la requete
                const params = {
                    page: 0,
                    size: pageSize,
                    order : 'like',
                    name: filterName,
                    text: filterText,
                    formats: filterFormats,
                    colors: filterColors,
                    rarities : filterRarities,
                    valueMin : inputValueMin,
                    valueMax : inputValueMax,
                    manaCostMin : inputManaCostMin,
                    manaCostMax : inputManaCostMax,
                    editions : filterEditions,
                    types : filterTypes,
                    legendary : filterLegendary
                    
                };
                
                const response = await axiosInstance.get('f_all/getCardsPaged', {
                  params,
                  paramsSerializer: {
                    indexes: null // Cela désactive l'ajout des crochets
                }
                });
                
                const listCards = response.data.content.map(
                        card => new Card (card.id, card.name, card.text, card.image, card.manaCost, card.value, card.formats,
                                card.colors, card.type, card.legendary, card.rarity, card.edition,
                                card.deckBuilders, card.decks, card.decksCommander, card.likeNumber,
                                card.deckNumber, card.commanderNumber
                ) )                
                 
                setTopCards(listCards)
                setHasMore(!response.data.isLast);
                setPage(1);
                setDisplayLoading(false);
            }   
            catch (error) {
                setDisplayLoading(false);
                console.log(error);
            }

    
        }
        React.useEffect(() => {
          getCardsWithLikes();
      }, [ displayCards, filterName, filterText, inputValueMin, inputValueMax, inputManaCostMin, inputManaCostMax,
         filterColors, filterFormats, filterRarities, filterEditions, filterTypes, filterLegendary]);


      

    const displayMoreCardsWithID = async () => {
 
       try {
          setIsLoading(true);

          const params = {
            page: page,
            size: pageSize,
            order : 'id',
            name: filterName,
            text: filterText,
            colors: filterColors,
            formats: filterFormats,
            rarities: filterRarities,
            valueMin: inputValueMin,
            valueMax: inputValueMax,
            manaCostMin: inputManaCostMin,
            manaCostMax: inputManaCostMax,
            editions: filterEditions,
            types: filterTypes,
            legendary: filterLegendary
          };

          const response = await axiosInstance.get('/f_all/getCardsPaged', {
            params,
            paramsSerializer: { indexes: null }
          });

          const newCards = response.data.content.map(card => new Card(
            card.id, card.name, card.text, card.image, card.manaCost, card.value,
            card.formats, card.colors, card.type, card.legendary, card.rarity,
            card.edition, card.deckBuilders, card.decks, card.decksCommander,
            card.likeNumber, card.deckNumber, card.commanderNumber
          ));

          setCards(prevCards => [...prevCards, ...newCards]);
          setHasMore(!response.data.isLast);
          setPage(page + 1)

      } catch (error) {
        console.error('Erreur de chargement des cartes :', error);
      } finally {
        setIsLoading(false);
      }
    }

    const displayMoreCardsWithLikes = async () => {
            try {
                setIsLoading(true);
                const params = {
                    page: page,
                    size: pageSize,
                    order : 'like',
                    name: filterName,
                    text: filterText,
                    formats: filterFormats,
                    colors: filterColors,
                    rarities: filterRarities,
                    valueMin: inputValueMin,
                    valueMax: inputValueMax,
                    manaCostMin: inputManaCostMin,
                    manaCostMax: inputManaCostMax,
                    editions: filterEditions,
                    types: filterTypes,
                    legendary: filterLegendary
                };
    
                const response = await axiosInstance.get('f_all/getCardsPaged', {
                    params,
                    paramsSerializer: { indexes: null }
                });
    
                const newCards = response.data.content.map(
                    card => new Card(card.id, card.name, card.text, card.image, card.manaCost, card.value, card.formats,
                        card.colors, card.type, card.legendary, card.rarity, card.edition,
                        card.deckBuilders, card.decks, card.decksCommander, card.likeNumber,
                        card.deckNumber, card.commanderNumber
                    ));
    
                setTopCards(prevCards => [...prevCards, ...newCards]);
                setHasMore(!response.data.isLast);
                setPage(page + 1);
            } catch (error) {
                console.error('Erreur de chargement des cartes populaires :', error);
            } finally {
                setIsLoading(false);
            }
        }

                 
                 
    // Afficher les cartes dans l'ordre des plus likées
    const displayTopCards = () => {
                   setDisplayCards("like")
                   setCards([])
    }
         
    // Afficher les cartes dans l'ordre des plus récentes
    const displayIdCards = () => {
                   setDisplayCards("id")
                   setTopCards([])
    }
         
         
    const getBgDate= () => {
                     if(displayCards==="id") {
                       return '#5D3B8C'
                     } 
                     else {
                       return '#D3D3D3'
                     }
    }
         
    const getBgTop= () => {
                     if(displayCards==="like") {
                       return '#5D3B8C'
                     }
                     else {
                       return '#D3D3D3'
                     }
    }
         
    const getColorDate= () => {
                     if(displayCards==="id") {
                       return 'white'
                     } 
                     else {
                       return 'black'
                     }
    }
         
    const getColorTop= () => {
                     if(displayCards==="like") {
                       return 'white'
                     }
                     else {
                       return 'black'
                     }
    }



    // Naviguer vers une carte depuis id
        const navCard = (id) => {

          sessionStorage.setItem('cpaFilterName', JSON.stringify(filterName));
          sessionStorage.setItem('cpaFilterText', JSON.stringify(filterText));
          sessionStorage.setItem('cpaInputValueMin', JSON.stringify(inputValueMin));
          sessionStorage.setItem('cpaInputValueMax', JSON.stringify(inputValueMax));
          sessionStorage.setItem('cpaInputManacostMin', JSON.stringify(inputManaCostMin));
          sessionStorage.setItem('cpaInputManacostMax', JSON.stringify(inputManaCostMax));
          sessionStorage.setItem('cpaFilterColors', JSON.stringify(filterColors));
          sessionStorage.setItem('cpaFilterFormats', JSON.stringify(filterFormats));
          sessionStorage.setItem('cpaFilterTypes', JSON.stringify(filterTypes));
          sessionStorage.setItem('cpaFilterLegendary', JSON.stringify(filterLegendary));
          sessionStorage.setItem('cpaFilterRarities', JSON.stringify(filterRarities));
          sessionStorage.setItem('cpaFilterEditions', JSON.stringify(filterEditions));

          const cardsIds = cards.map(card => card.id);
          navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
        };

        // Naviguer vers une carte depuis top
        const navTopCard = (id) => {

          sessionStorage.setItem('cpaFilterName', JSON.stringify(filterName));
          sessionStorage.setItem('cpaFilterText', JSON.stringify(filterText));
          sessionStorage.setItem('cpaInputValueMin', JSON.stringify(inputValueMin));
          sessionStorage.setItem('cpaInputValueMax', JSON.stringify(inputValueMax));
          sessionStorage.setItem('cpaInputManacostMin', JSON.stringify(inputManaCostMin));
          sessionStorage.setItem('cpaInputManacostMax', JSON.stringify(inputManaCostMax));
          sessionStorage.setItem('cpaFilterColors', JSON.stringify(filterColors));
          sessionStorage.setItem('cpaFilterFormats', JSON.stringify(filterFormats));
          sessionStorage.setItem('cpaFilterTypes', JSON.stringify(filterTypes));
          sessionStorage.setItem('cpaFilterLegendary', JSON.stringify(filterLegendary));
          sessionStorage.setItem('cpaFilterRarities', JSON.stringify(filterRarities));
          sessionStorage.setItem('cpaFilterEditions', JSON.stringify(filterEditions));

          const cardsIds = topCards.map(card => card.id);
          navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
        };

        // Récupère le contenu depuis le storage si l'user revient de cardSelected
                      useEffect(() => {
                      const recupStorage = () => {
                          try {
                              const filterName = sessionStorage.getItem('cpaFilterName');
                              const filterText = sessionStorage.getItem('cpaFilterText');
                              const inputValueMin = sessionStorage.getItem('cpaInputValueMin');
                              const inputValueMax = sessionStorage.getItem('cpaInputValueMax');
                              const inputManaCostMin = sessionStorage.getItem('cpaInputManacostMin');
                              const inputManaCostMax = sessionStorage.getItem('cpaInputManacostMax');
                              const filterLegendary = sessionStorage.getItem('cpaFilterLegendary');  
                              
                              if (filterName) {
                                  setFilterName(JSON.parse(filterName));
                                  sessionStorage.removeItem('cpaFilterName');
                              }
                              if (filterText) {
                                  setFilterText(JSON.parse(filterText));
                                  sessionStorage.removeItem('cpaFilterText');
                              }
                              if (inputValueMin) {
                                  setInputValueMin(JSON.parse(inputValueMin));
                                  sessionStorage.removeItem('cpaInputValueMin');
                              }
                              if (inputValueMax) {
                                  setInputValueMax(JSON.parse(inputValueMax));
                                  sessionStorage.removeItem('cpaInputValueMax');
                              }
                              if (inputManaCostMin) {
                                  setInputManaCostMin(JSON.parse(inputManaCostMin));
                                  sessionStorage.removeItem('cpaInputManacostMin');
                              }
                              if (inputManaCostMax) {
                                  setInputManaCostMax(JSON.parse(inputManaCostMax));
                                  sessionStorage.removeItem('cpaInputManacostMax');
                              }
                              if(filterLegendary) {
                                  setFilterLegendary(JSON.parse(filterLegendary));
                                  sessionStorage.removeItem('cpaFilterLegendary');
                                }
                              
                              
                          } catch (error) {
                              console.error("Erreur lors de la récupération du sessionStorage :", error);
                          }
                      };
                
                      recupStorage();
                  }, []);
        
        
    // Zoom sur une carte
    const hoveredCard = (id) => {
         setDetailsCard({ id });

    }
           

    // Supprimer une carte

    const deleteCard = async (id) => {
                try {
                    setDisplayLoading(true);
                   await axiosInstance.delete(`f_admin/deleteCard?cardID=${id}`, { withCredentials: true });
                   
                   let cardLength = cards.length

                if(displayCards === "like") {
                  cardLength = topCards.length
                }

              // Rappeler toutes les cartes affichées actuellement avec la carte modifiée maj
              const params = {
                page: 0,
                size: cardLength,
                order : displayCards,
                name: filterName,
                text: filterText,
                colors: filterColors,
                formats: filterFormats,
                rarities: filterRarities,
                valueMin: inputValueMin,
                valueMax: inputValueMax,
                manaCostMin: inputManaCostMin,
                manaCostMax: inputManaCostMax,
                editions: filterEditions,
                types: filterTypes,
                legendary: filterLegendary
              };
        
              const response = await axiosInstance.get('/f_all/getCardsPaged', {
                params,
                paramsSerializer: { indexes: null }
              });
        
              const listCards = response.data.content.map(card => new Card(
                card.id, card.name, card.text, card.image, card.manaCost, card.value,
                card.formats, card.colors, card.type, card.legendary, card.rarity,
                card.edition, card.deckBuilders, card.decks, card.decksCommander,
                card.likeNumber, card.deckNumber, card.commanderNumber
              ));
              
              if(displayCards === "id") {
                setCards(listCards)
              }

              if(displayCards === "like") {
                setTopCards(listCards)
              }

              setCardToDelete(null)
                    }   
              catch (error) {
                console.log(error)
              }
              finally {
                setDisplayLoading(false)
              }
    };
            

        // Filtre value 

        const [arrowValueSens, setArrowValueSens] = React.useState(<SlArrowDown/>)
        const [displayFilterValue, setDisplayFilterValue] = React.useState(false)
        
        // Affiche le filtre value
        const OpenFilterValue = () => {
              setArrowValueSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
              setDisplayFilterValue(!displayFilterValue)
              }

        // Reset le filtre value
        const ResetFilterValue = () => {
          setInputValueMin("")
          setInputValueMax("")
          }

        // Filtre manaCost

        const [arrowManaCostSens, setArrowManaCostSens] = React.useState(<SlArrowDown/>)
        const [displayFilterManaCost, setDisplayFilterManaCost] = React.useState(false)
        
        // Affiche le filtre manaCost
        const OpenFilterManaCost = () => {
                  setArrowManaCostSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
                  setDisplayFilterManaCost(!displayFilterManaCost)
                 }

        // Reset le filtre value
        const ResetFilterManaCost = () => {
          setInputManaCostMin("")
          setInputManaCostMax("")
          }

        // Filtre raretés
        const [arrowRaritiesSens, setArrowRaritiesSens] = React.useState(<SlArrowDown/>)
        const [displayFilterRarities, setDisplayFilterRarities] = React.useState(false)
        
        // Affiche le filtre manaCost
        const OpenFilterRarities = () => {
                  setArrowRaritiesSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
                  setDisplayFilterRarities(!displayFilterRarities)
                 }

        const [rarities, setRarities] = React.useState([])
        const callRarities = useRef(false);

         // Récupère les rarities dans le storage si l'user vient de cardSelected
          
         const recupStorageRarity = (response) => {
            try {

                if (callRarities.current) return;
              
                const stored = sessionStorage.getItem('cpaFilterRarities');

                  if (stored) {
                      
                      setFilterRarities(JSON.parse(stored));
                      sessionStorage.removeItem('cpaFilterRarities');
                      callRarities.current = true;
            } else {
                setFilterRarities(response);
                
            }
    } catch (error) {
        console.error("Erreur lors de la récupération du sessionStorage :", error);
    }
          };

        // Récupère toutes les raretés pour les mapper
        useEffect(() => {
            const getRarities = async () => {
                try {
                    const request = await axiosInstance.get(`f_all/getRarities`);

                    const response = request.data
        
                    setRarities(response)
                    recupStorageRarity(response)

                }   
                catch (error) {
                    console.log(error);
                }
            }
            getRarities();
            }, []);
                    
          const selectRarities = (newRarity) => {
            setFilterRarities(prevRarities => {
              const raritiesArray = Array.isArray(prevRarities) ? prevRarities : (prevRarities || '').split(',').filter(rarity => rarity.trim() !== '');
              if (raritiesArray.includes(newRarity)) {
                return raritiesArray.filter(rarity => rarity !== newRarity).join(',');
              } else {
                return [...raritiesArray, newRarity].join(',');                 
              }
            });
          };
          const removeRarities = () => {
            setFilterRarities(rarities)
          } 
        
        // Filtre colors

        const [arrowColorSens, setArrowColorSens] = React.useState(<SlArrowDown/>)
        const [displayFilterColors, setDisplayFilterColors] = React.useState(false)
        
       const callColors = useRef(false);
        
       // Récupère les colors dans le storage
      const recupStorageColor = (response) => {
              try {
        
                  if (callColors.current) return;
                
                  const stored = sessionStorage.getItem('cpaFilterColors');
        
                    if (stored) {
                        
                        setFilterColors(JSON.parse(stored));
                        sessionStorage.removeItem('cpaFilterColors');
                        callColors.current = true;
                    } else {
                        setFilterColors(response);
                        
                    }
            } catch (error) {
                console.error("Erreur lors de la récupération du sessionStorage :", error);
            }
        };
        
        // Récupère toutes les couleurs
        useEffect(() => {
            const getColors = async () => {
                try {
                    const request = await axiosInstance.get(`f_all/getColors`);

                    const response = request.data
        
                    setColors(response)
                    recupStorageColor(response)

                }   
                catch (error) {
                    console.log(error);
                }
            }
            getColors();
            }, []);
        
        // Affiche le filtre des couleurs
        const OpenFilterColor = () => {
              setArrowColorSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
              setDisplayFilterColors(!displayFilterColors)  
              
            
                                 }
        const selectColors = (newColor) => {
          setFilterColors(prevColors => {
              const colorsArray = Array.isArray(prevColors) ? prevColors : (prevColors || '').split(',').filter(color => color.trim() !== '');
              if (colorsArray.includes(newColor)) {
                return colorsArray.filter(filterColor => filterColor !== newColor).join(',');
              } else {
                return [...colorsArray, newColor].join(',');                 
              }
            });
          };

          // Récupère l'image de chaque couleur
          const getColorPics = (value) => {
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
          
          // Refiltre selon toutes les couleurs du deck
          const removeColors = () => {
           setFilterColors(colors)
          } 


        // Filtre formats 
        
        const [arrowFormatSens, setArrowFormatSens] = React.useState(<SlArrowDown/>)
        const [displayFilterFormats, setDisplayFilterFormats] = React.useState(false)
        
        // Affiche le filtre des formats
        const OpenFilterFormat = () => {
              setArrowFormatSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
              setDisplayFilterFormats(!displayFilterFormats)                     
                                 }

        // Récupère toutes les formats pour les mapper
        const [formats, setFormats] = React.useState([])
        const callFormats = useRef(false);
        
        const recupStorageFormat = (response) => {
              try {        
                  if (callFormats.current) return;                
                  const stored = sessionStorage.getItem('cpaFilterFormats');
        
                    if (stored) {
                        
                        setFilterFormats(JSON.parse(stored));
                        sessionStorage.removeItem('cpaFilterFormats');
                        callFormats.current = true;
                    } else {
                        setFilterFormats(response);
                        
                    }
            } catch (error) {
                console.error("Erreur lors de la récupération du sessionStorage :", error);
            }
        };
        
        useEffect(() => {
            const getFormats = async () => {
                try {
                    const request = await axiosInstance.get(`f_all/getFormats`);

                     const response = request.data.map(format => format.name);
        
                    setFormats(response)
                    recupStorageFormat(response)

                }   
                catch (error) {
                    console.log(error);
                }
            }
            getFormats();
            }, []);

        
        const selectFormats = (newFormat) => {
          setFilterFormats(prevFormat => {
            const formatsArray = Array.isArray(prevFormat) ? prevFormat : (prevFormat || '').split(',').filter(format => format.trim() !== '');
            if (formatsArray.includes(newFormat)) {
              return formatsArray.filter(edition => edition !== newFormat).join(',');
            } else {
              return [...formatsArray, newFormat].join(',');                 
            }
          });
        };
        const removeFormats = () => {
          setFilterFormats(formats)
        } 

        // Filtre editions 
        
        const [arrowEditionSens, setArrowEditionSens] = React.useState(<SlArrowDown/>)
        const [displayFilterEditions, setDisplayFilterEditions] = React.useState(false)
        
        // Affiche le filtre des éditions
        const OpenFilterEdition = () => {
              setArrowEditionSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
              setDisplayFilterEditions(!displayFilterEditions)                     
                                 }

        // Récupère toutes les éditions pour les mapper
        const [editions, setEditions] = React.useState([])

        const callEditions = useRef(false);
        
        const recupStorageEdition = (response) => {
              try {
        
                  if (callEditions.current) return;
                
                  const stored = sessionStorage.getItem('cpaFilterEditions');
        
                    if (stored) {
                        
                        setFilterEditions(JSON.parse(stored));
                        sessionStorage.removeItem('cpaFilterEditions');
                        callEditions.current = true;
                    } else {
                        setFilterEditions(response);
                        
                    }
            } catch (error) {
                console.error("Erreur lors de la récupération du sessionStorage :", error);
            }
        };

        useEffect(() => {
            const getEditions = async () => {
                try {
                    const request = await axiosInstance.get(`f_all/getEditions`);

                    const response = request.data
        
                    setEditions(response)
                    recupStorageEdition(response)

                }   
                catch (error) {
                    console.log(error);
                }
            }
            getEditions();
            }, []);

        
        const selectEditions = (newEdition) => {
          setFilterEditions(prevEditions => {
            const editionsArray = Array.isArray(prevEditions) ? prevEditions : (prevEditions || '').split(',').filter(edition => edition.trim() !== '');
            if (editionsArray.includes(newEdition)) {
              return editionsArray.filter(edition => edition !== newEdition).join(',');
            } else {
              return [...editionsArray, newEdition].join(',');                 
            }
          });
        };
        const removeEditions = () => {
          setFilterEditions(editions)
        } 


      // Récupère tous les types pour les mapper

      const [arrowTypeSens, setArrowTypeSens] = React.useState(<SlArrowDown/>)
      const [displayFilterTypes, setDisplayFilterTypes] = React.useState(false)
      
      // Affiche le filtre des éditions
      const OpenFilterType = () => {
            setArrowTypeSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
            setDisplayFilterTypes(!displayFilterTypes)                     
                               }


        const [types, setTypes] = React.useState([])
        const callTypes = useRef(false);

        const recupStorageTypes = (response) => {
              try {
        
                  if (callTypes.current) return;
                
                  const stored = sessionStorage.getItem('cpaFilterTypes');
        
                    if (stored) {
                        
                        setFilterTypes(JSON.parse(stored));
                        sessionStorage.removeItem('cpaFilterTypes');
                        callTypes.current = true;
                    } else {
                        setFilterTypes(response);
                        
                    }
            } catch (error) {
                console.error("Erreur lors de la récupération du sessionStorage :", error);
            }
        };

        useEffect(() => {
            const getTypes = async () => {
                try {
                    const request = await axiosInstance.get(`f_all/getTypes`);

                    const response = request.data
        
                    setTypes(response)
                    recupStorageTypes(response)

                }   
                catch (error) {
                    console.log(error);
                }
            }
            getTypes();
            }, []);

         // Filtre types
         const selectTypes = (newType) => {
            setFilterTypes(prevTypes => {
            const typesArray = Array.isArray(prevTypes) ? prevTypes : (prevTypes || '').split(',').filter(type => type.trim() !== '');
            if (typesArray.includes(newType)) {
              return typesArray.filter(type => type !== newType).join(',');
            } else {
              return [...typesArray, newType].join(',');                 
            }
          });
        };
        const removeTypes = () => {
          setFilterTypes(types)
        } 

        // Filtre légendaire
        const checkoutLegendary = () => {
          if(filterLegendary === null && filterTypes.includes("CREATURE")) {
            setFilterLegendary("legendary")
          }
          else {
            setFilterLegendary(null)
          }
        }

      
      // N'affiche pas les terrains de base
      const maskBaseLand = (value) => {
        if(value < 7) {
            return "none";
      }
    } 
    
    
    // Modifier une carte
        
        // Ouvrir le form d'edit
        const startEdit = (id, name, image, text, manaCost, value, colors, formats, type, rarity, edition, legendary) => {
                    setCardToUpdate(id)
                    setCardName(name)
                    if(image !== "") { 
                      setCardImage(image)
                    }
                    else {
                      setCardImage(defaultImg)
                    }
                    setCardText(text)
                    setCardManaCost(manaCost)
                    setCardValue(value)
                    setCardColors(colors)
                    setCardFormats(formats) 
                    setCardType(type)
                    if(legendary === "legendary") {
                      setCardLegendary(legendary)
                    }
                    else {
                      setCardLegendary(null)
                    }
                    setCardRarity(rarity)
                    setCardEdition(edition)  

                    // Pour afficher les valeurs sur les input
                    setNewManaCost(manaCost)
                    setNewValue(value)
       
        }

        // Changer les couleurs (choix multiple sauf pour INCOLORE)
        const selectMutipleColors = (newColor) => {
            if (newColor !== 'INCOLORE') {
                setCardColors(prevColors => {
                    let updatedColors;
                    if (prevColors.includes(newColor)) {
                        updatedColors = prevColors.filter(color => color !== newColor);
                    } else {
                        updatedColors = [...prevColors.filter(color => color !== 'INCOLORE'), newColor];
                    }
                    // Met à jour également newColors
                    setNewColors(updatedColors);
                    return updatedColors;
                });
            } else {
                setCardColors(['INCOLORE']);
                setNewColors(['INCOLORE']);
            }
        };

        
        // Changer les formats (choix multiple)
        const selectMultipleFormats = (newFormat) => {
            setCardFormats(prevFormats => {
                let updatedFormats;
                if (prevFormats.includes(newFormat)) {
                    updatedFormats = prevFormats.filter(format => format !== newFormat);
                } else {
                    updatedFormats = [...prevFormats, newFormat];
                }
                // Met à jour également newFormats
                setNewFormats(updatedFormats);
                return updatedFormats;
            });
        };


        // Changer le nom
        const changeName =  (value) => {
            setCardName(value)
            setNewName(value)
        }

        // Changer le texte
        const changeText =  (value) => {
            setCardText(value)
            setNewText(value)
        }

        // Changer le type
        const changeType =  (value) => {
            setCardType(value)
            setNewType(value)
        }

        // Changer le légendaire
        const changeLegendary =  (value) => {
            setCardLegendary(value)
            setNewLegendary(value)
        }

        // Changer la rareté
        const changeRarity =  (value) => {
            setCardRarity(value)
            setNewRarity(value)
        }

        // Changer l'édition
        const changeEdition =  (value) => {
            setCardEdition(value)
            setNewEdition(value)
        }
        
        const [isImageUpdate, setIsImageUpdate] = React.useState(false) 

         // Changer l'image
        const changeImage = async (event) => {
            const file = event.target.files[0];

            if (file) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    const uploadRes = await axiosInstance.post("f_all/uploadImage", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        withCredentials: true
                    });
                    
                    // Stocker le chemin retourné au lieu du base64
                    setCardImage(uploadRes.data);     // Met à jour l'image actuelle
                    setNewImage(uploadRes.data);      // Met aussi à jour la nouvelle image
                    setIsImageUpdate(true);
                } catch (error) {
                    console.error("Erreur lors de l'upload de l'image:", error);
                    alert("Erreur lors de l'upload de l'image");
                }
            }
        };
               
         // Annuler l'édit 
        const cancelEdit = () => {
                    setNewName("")
                    setNewImage("")
                    setNewManaCost("")
                    setNewValue("")
                    setNewColors([])
                    setNewFormats([])
                    setNewType("")
                    setNewLegendary(null)
                    setNewRarity("")
                    setNewEdition("")
                    setCardToUpdate(null)
                    if(isImageUpdate) {
                        setIsImageUpdate(false)
                    }
          }
        
    // Modifier la carte
    const editCard = async (id) => {
      try {
              setDisplayLoading(true);
              
              const newCard = {};       
                        if (newName !== "") newCard.name = newName;
                        if (newImage !== "") newCard.image = newImage;
                        if (newText !== "") newCard.text = newText;
                        if (newManaCost !== "") newCard.manaCost = newManaCost;
                        if (newValue !== "") newCard.value = newValue;
                        if (newColors.length > 0) newCard.colors = newColors;
                        if (newFormats.length > 0) newCard.formats = newFormats;
                        if (newType !== "") newCard.type = newType;
                        if (newLegendary !== null) newCard.legendary = newLegendary;
                        if (newRarity !== "") newCard.rarity = newRarity;
                        if (newEdition !== "") newCard.edition = newEdition;
                          


                const request = await axiosInstance.put(`f_admin/updateCard?cardID=${id}`, newCard, { withCredentials: true });
            
                        setNewName("")
                        setNewImage("")
                        setNewManaCost("")
                        setNewValue("")
                        setNewColors([])
                        setNewFormats([])
                        setNewType("")
                        setNewLegendary(null)
                        setNewRarity("")
                        setNewEdition("")
                        setCardToUpdate(null)
                        setIsImageUpdate(false)
                        setDisplayLoading(false);
                
                let cardLength = cards.length

                if(displayCards === "like") {
                  cardLength = topCards.length
                }

              // Rappeler toutes les cartes affichées actuellement avec la carte modifiée maj
              const params = {
                page: 0,
                size: cardLength,
                order : displayCards,
                name: filterName,
                text: filterText,
                colors: filterColors,
                formats: filterFormats,
                rarities: filterRarities,
                valueMin: inputValueMin,
                valueMax: inputValueMax,
                manaCostMin: inputManaCostMin,
                manaCostMax: inputManaCostMax,
                editions: filterEditions,
                types: filterTypes,
                legendary: filterLegendary
              };
        
              const response = await axiosInstance.get('/f_all/getCardsPaged', {
                params,
                paramsSerializer: { indexes: null }
              });
        
              const listCards = response.data.content.map(card => new Card(
                card.id, card.name, card.text, card.image, card.manaCost, card.value,
                card.formats, card.colors, card.type, card.legendary, card.rarity,
                card.edition, card.deckBuilders, card.decks, card.decksCommander,
                card.likeNumber, card.deckNumber, card.commanderNumber
              ));
              
              if(displayCards === "id") {
                setCards(listCards)
              }

              if(displayCards === "like") {
                setTopCards(listCards)
              }

      } catch (error) {
        console.log(error);
      }
      finally {
        setDisplayLoading(false);
      }
    };

    // Affichage de couleur d'arrière-plan en fonction de la rareté
    const getBackgroundColor = (rarity) => {
    
        if(rarity === "MYTHIQUE") {
                      return "linear-gradient(135deg, #D94F4F 0%, #FF8A5C 100%)";  
                  }
          if(rarity === "RARE") {
                      return "linear-gradient(135deg, #D4AF37 0%, #F7C83D 100%)";  
                    };
          if(rarity === "UNCO") {
                      return "linear-gradient(135deg, #5A6E7F 0%, #A1B2C1 100%)";  
                    }
          if(rarity === "COMMUNE") {
                      return "linear-gradient(135deg, #5C5C5C 0%, #9B9B9B 100%)";  
                  }
      };


    // Correction portée du compteur z-index
    let filterZIndex = 99;
          
     

        return (  
            <Section> 
            <img src={backgroundCardsPage} className="background-image" alt="background" />
            { displayLoading && (
                <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
            )}


            <OpenButtonLarge  text="Afficher les filtres" icon={arrowFiltersSens} onClick={OpenFilters}/>

            <div className="search-line">            
            <SearchBar value={filterName} onChange={(event) => (setFilterName(event.target.value))} placeholder={" Chercher une carte"} />
            <SearchBar value={filterText}  onChange={(event) => (setFilterText(event.target.value))} placeholder={" Chercher le texte d'une carte"}
            style={{marginBottom: '30px'}} />
            </div>

              {/*Les filtres formats desktop*/}
              <div className="filters-line">
                
                <div className="filter-value-container">
                  <OpenButton text="Filtrer par valeur €" icon={arrowValueSens} onClick={OpenFilterValue} />
                  {displayFilterValue && (
                    <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                          <InputValue style={{width: '150px'}} value={inputValueMin}
                          onChange={(event) => (setInputValueMin(event.target.value))} placeholder={"min"}/>
                          <InputValue style={{width: '150px'}} value={inputValueMax}
                          onChange={(event) => (setInputValueMax(event.target.value))} placeholder={"max"}/>
                          <TbFilterCancel className='compenant-reset' onClick={()=> ResetFilterValue()} />
                      </div>
                  )}
                </div>
                
                <div className="filter-manaCost-container">
                  <OpenButton text="Filtrer par cout en mana" icon={arrowManaCostSens} onClick={OpenFilterManaCost} />
                  {displayFilterManaCost && (
                  <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                    <InputManaCoast style={{width: '150px'}}  value={inputManaCostMin}
                      onChange={(event) => (setInputManaCostMin(event.target.value))} placeholder={"min"}/>
                    <InputManaCoast style={{width: '150px'}} value={inputManaCostMax}
                    onChange={(event) => (setInputManaCostMax(event.target.value))} placeholder={"max"}/>
                    <TbFilterCancel className='compenant-reset' onClick={()=> ResetFilterManaCost()} />
                  </div>
                  )}
                </div>

                <div className="filter-colors-container">
                <OpenButton text="Filtrer par couleur" icon={arrowColorSens} onClick={OpenFilterColor} />
                  { displayFilterColors && (
                  <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                    <CheckboxColor attributs={colors} onChange={(event) => selectColors(event.target.value)} filter={filterColors}
                    image={getColorPics} onPush={removeColors} />
                  </div>
                  )}
                </div>


                <div className="filter-formats-container">
                  <OpenButton text="Filtrer par format" icon={arrowFormatSens} onClick={OpenFilterFormat} />
                  {displayFilterFormats && (
                  <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                    <Checkbox attributs={formats} onChange={(event) => selectFormats(event.target.value)} filter={filterFormats}
                    onPush={removeFormats} classNameP='checkbox-format-p'/>
                  </div>
                  )}                 
                </div>

             

                <div className="filter-rarities-container">
                  <OpenButton text="Filtrer par rareté" icon={arrowRaritiesSens} onClick={OpenFilterRarities} />
                  {displayFilterRarities && (
                  <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                    <CheckboxRarity attributs={rarities} onChange={(event) => selectRarities(event.target.value)} filter={filterRarities}
                    onPush={removeRarities} className='checkbox-rarity-p'/>
                  </div>
                  )}                 
                </div>
                
                <div className="filter-types-container">
                  <OpenButton text="Filtrer par type" icon={arrowTypeSens} onClick={OpenFilterType} />
                  { displayFilterTypes && (
                    <div className='add-card-filter-container' style={{zIndex: filterZIndex--, marginBottom: '10%'}}>
                      <Checkbox attributs={types} onChange={(event) => selectTypes(event.target.value)} filter={filterTypes}
                      onPush={removeTypes} iconStyle={{marginBottom: '2%'}}  classNameP='checkbox-type-p'/>               
                      
                    </div>
                  )}
                  </div>
                    

              </div>

            
              {/*Les filtres formats mobile*/}
              { displayFilters && (
              <div className="filters-line-mobile">
                <div className='filter-mobile-container' style={{ backgroundImage: `url(${backgroundWhite})`}} >
                  <SearchBar value={filterName} onChange={(event) => (setFilterName(event.target.value))} 
                  placeholder={" Chercher une carte"} style={{marginTop: '20px'}} />
                  <SearchBar value={filterText} style={{height : '80px'}}
                  onChange={(event) => (setFilterText(event.target.value))} placeholder={" Chercher le texte d'une carte"}
                  />
                
                    
                    <div className="filter-value-container">
                  <OpenButton text="Filtrer par valeur €" icon={arrowValueSens} onClick={OpenFilterValue} />
                  {displayFilterValue && (
                    <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                          <InputValue  value={inputValueMin}
                          onChange={(event) => (setInputValueMin(event.target.value))} placeholder={"min"}/>
                          <InputValue  value={inputValueMax}
                          onChange={(event) => (setInputValueMax(event.target.value))} placeholder={"max"}/>
                          <TbFilterCancel className='compenant-reset' onClick={()=> ResetFilterValue()} />
                      </div>
                  )}
                </div>
                
                <div className="filter-manaCost-container">
                  <OpenButton text="Filtrer par cout en mana" icon={arrowManaCostSens} onClick={OpenFilterManaCost} />
                  {displayFilterManaCost && (
                  <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                    <InputManaCoast style={{width: '150px'}}  value={inputManaCostMin}
                      onChange={(event) => (setInputManaCostMin(event.target.value))} placeholder={"min"}/>
                    <InputManaCoast style={{width: '150px'}} value={inputManaCostMax}
                    onChange={(event) => (setInputManaCostMax(event.target.value))} placeholder={"max"}/>
                    <TbFilterCancel className='compenant-reset' onClick={()=> ResetFilterManaCost()} />
                  </div>
                  )}
                </div>

                <div className="filter-colors-container">
                <OpenButton text="Filtrer par couleur" icon={arrowColorSens} onClick={OpenFilterColor} />
                  { displayFilterColors && (
                  <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                    <CheckboxColor attributs={colors} onChange={(event) => selectColors(event.target.value)} filter={filterColors}
                    image={getColorPics} onPush={removeColors} />
                  </div>
                  )}
                </div>


                <div className="filter-formats-container">
                  <OpenButton text="Filtrer par format" icon={arrowFormatSens} onClick={OpenFilterFormat} />
                  {displayFilterFormats && (
                  <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                    <Checkbox attributs={formats} onChange={(event) => selectFormats(event.target.value)} filter={filterFormats}
                    onPush={removeFormats} classNameP='checkbox-format-p'/>
                  </div>
                  )}                 
                </div>

             

                <div className="filter-rarities-container">
                  <OpenButton text="Filtrer par rareté" icon={arrowRaritiesSens} onClick={OpenFilterRarities} />
                  {displayFilterRarities && (
                  <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                    <CheckboxRarity attributs={rarities} onChange={(event) => selectRarities(event.target.value)} filter={filterRarities}
                    onPush={removeRarities} className='checkbox-rarity-p'/>
                  </div>
                  )}                 
                </div>
                
                <div className="filter-types-container">
                  <OpenButton text="Filtrer par type" icon={arrowTypeSens} onClick={OpenFilterType} />
                  { displayFilterTypes && (
                    <div className='add-card-filter-container' style={{zIndex: filterZIndex--, marginBottom: '10%'}}>
                      <Checkbox attributs={types} onChange={(event) => selectTypes(event.target.value)} filter={filterTypes}
                      onPush={removeTypes} iconStyle={{marginBottom: '2%'}}  classNameP='checkbox-type-p'/>               
                      
                    </div>
                  )}
                  </div>
                      
                </div>
              </div>
              )}
            
            <div className='title-cards-dispo-container'>
              <Title title='Cartes' />
            </div>
            
            <div className='cards-buttons-order-container'>
              <ButtonSelect className={"button-date"} onClick={() => displayIdCards()} text={"Dernières parutions"}
                                      backgroundColor={getBgDate()} color={getColorDate()}/>
              <ButtonSelect className={"button-top"} onClick={() => displayTopCards()} text={"Les plus populaires"} 
                                     backgroundColor={getBgTop()} color={getColorTop()}/>
            </div>


       <div className='display-objects-section'>

        { displayCards === "id" && (
            <div className='map-cards-section'>
              {cards.map(card => ( 
                  <div className="cards-details" key={card.id} style={{display:(maskBaseLand(card.id))}}>
                      <img className="cards-img" src={getImageUrl(card.image)} alt="Card-image" onClick={() => navCard(card.id)}
                      onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                       />
              <div className='cards-page-icon-container'>    
                <FaPencilAlt className='cards-admin-icon' onClick={()=> startEdit(card.id, card.name, card.image, card.text, card.manaCost, card.value, card.colors, card.formats, card.type, card.rarity, card.edition, card.legendary)}
                 size={'2em'}/>
                <RiDeleteBin6Line className='cards-admin-icon' onClick={() => setCardToDelete(card.id)}  size={'2em'}/>
              </div>
              <p className='card-page-likenumber'>{card.likeNumber} <FaHeart style={{position:'relative', marginBottom: '3px'}} size={'0.9em'}  color='red' /></p>
              {detailsCard && detailsCard.id === card.id && (
                <img className="card-img-zoom" src={getImageUrl(card.image)} alt="Card-image"/>
              )}
              </div>
              ))}       
      </div>
        )}

        { displayCards === "id" && cards.length > 0 && hasMore && (
          <button className='next-page-button' disabled={!hasMore} onClick={()=>displayMoreCardsWithID()}>Afficher plus</button> 
        )}


        { displayCards === "like" && (
              <div className='map-cards-section'>
                {topCards.map(card => ( 
                    <div className="cards-details" key={card.id} style={{display:(maskBaseLand(card.id))}}>
                        <img className="cards-img" src={getImageUrl(card.image)} alt="Card-image" onClick={() => navTopCard(card.id)}
                        onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                        />
                <div className='cards-page-icon-container'>                           
                  <FaPencilAlt className='cards-admin-icon' onClick={()=> startEdit(card.id, card.name, card.image, card.text, card.manaCost, card.value, card.colors, card.formats, card.type, card.rarity, card.edition, card.legendary)}
                  size={'2em'}/>
                  <RiDeleteBin6Line className='cards-admin-icon' onClick={() => setCardToDelete(card.id)}  size={'2em'}/>
                </div>
                <p className='card-page-likenumber'>{card.likeNumber} <FaHeart style={{position:'relative', marginBottom: '3px'}} size={'0.9em'}  color='red' /></p>
                {detailsCard && detailsCard.id === card.id && (
                  <img className="card-img-zoom" src={getImageUrl(card.image)} alt="Card-image"/>
                )}  
                </div>
                ))}       
        </div>
        )}  

        { displayCards === "like" && cards.length > 0 && hasMore && (
          <button className='next-page-button' disabled={!hasMore} onClick={()=>displayMoreCardsWithLikes()}>Afficher plus</button> 
        )} 

      </div> 

      {/* Global Edit Popup */}
      {cardToUpdate && (
        <div className='popup-bckg'>
          {/* Version desktop */}
          <div className='form-edit-card' style={{ backgroundImage: `url(${backgroundPopup})`, marginTop: '2%'}}>
            <div className='textarea-container'>
              <textarea className="input-name" id="deck-name" name="deck-name" rows="1" cols="33" value={cardName}
                maxLength={25} onChange={(e) => changeName(e.target.value)} >
                  {cardName}
              </textarea>
            </div>
            <div className='setAttributs-card-img-checkout'>
              <div className='setAttributs-card-img'>
                <input
                  className='input-deck-img'
                  style={{position:'absolute', marginTop:'-15%'}}
                  type="file"
                  accept="image/*"
                  onChange={(e) => changeImage(e)}
                />
                <img className='card-selected-img' src={cardImage && cardImage.startsWith('/uploads/') ? `http://54.77.12.209:8081${cardImage}` : cardImage} alt="deck-img" />
              </div>
              <div className='setAttributs-card-checkout'>
              
                <h5 className='card-line-title'>Couleurs : </h5>
                
                <CheckboxAddImage
                  style={{marginBottom: '5%'}}
                  attributs={colors}
                  filter={cardColors}
                  onChange={(event) => selectMutipleColors(event.target.value)}
                  image={getColorPics}
                  classNameImg='set-colors-img'
                />

                <h5 className='card-line-title'>Formats : </h5>
                <CheckboxAdd attributs={formats} filter={cardFormats} style={{marginBottom: '5%'}} classNameP='card-format'
                  styleL={{width: '150px'}}
                  onChange={(event) => selectMultipleFormats(event.target.value)}/>
                <h5 className='card-line-title'>Rareté : </h5>
                <CheckboxAdd attributs={rarities} filter={cardRarity} style={{marginBottom: '5%'}}
                  styleL={{width: '140px'}}
                  methodBackground={getBackgroundColor}
                  classNameP="card-selected-rarity"
                  onChange={(event) => changeRarity(event.target.value)}/>
                <h5 className='card-line-title'>Type : </h5>
                <CheckboxAdd attributs={types} filter={cardType} style={{marginBottom: '5%'}} 
                styleL={{width: '160px'}}
                classNameP="checkbox-type-p"
                  onChange={(event) => changeType(event.target.value)}/>

                {/* Légendaire */}
                    {(cardType === 'CREATURE' || newType === 'CREATURE') && (
                       
                            <div
                            className="input-legendary-container">
                                <li>
                                    <input 
                                        className="checkbox-legendary" 
                                        type="checkbox" 
                                        name={"legendary"}
                                        checked={cardLegendary !== null}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                changeLegendary("legendary");
                                            } else {
                                                changeLegendary(null);
                                            }
                                        }}
                                    />Légendaire
                                </li>
                                
                            </div>
                    )}

                
                <div className="compenant-checkbox-add" 
                  style={{marginBottom: '5%', width: '100%', flexDirection: 'column', alignItems: 'center'}}>
                  <h5 className='card-line-title'>Texte :</h5>
                  <textarea
                  style={{minHeight: '150px'}}
                    className="input-card-text"
                    id="card-text"
                    name="deck-name"
                    rows="6"
                    cols="33"
                    value={cardText}
                    onChange={(e) => changeText(e.target.value)}
                  >{cardText}</textarea>
               </div>

                <div className="input-mana-cost-card" style={{marginBottom: '5%'}}>
                    <h5 className='card-line-title'>Cout en mana :</h5>
                    <input className="input-card-number" type="number" id="cout-mana" name="cout-mana" 
                   value={newManaCost}
                    onChange={(e) => setNewManaCost(e.target.value)} required/>
                </div>
                <div className="input-value-card">
                  <h5 className='card-line-title'>Valeur € :</h5>
                  <input className="input-card-number" type="number" 
                    step="0.01" onChange={(e) => setNewValue(e.target.value)} required value={newValue}/>
                </div>

              </div>
            </div>
            <div className='valid-button-container'>
              <ButtonValidPopup onClick={() => editCard(cardToUpdate)} disabled={displayLoading}/>
            </div>
          </div>
          {/* Version medium */}
          <div className='setAttributs-card-medium' style={{ backgroundImage: `url(${backgroundPopup})`}}>
          <div className='setAttributs-card-mobile-header'>
            <textarea className="input-name" id="deck-name" name="deck-name" rows="1" cols="33" value={cardName}
              maxLength={25} onChange={(e) => changeName(e.target.value)} >
                {cardName}
            </textarea>
          </div>
          <div className='setAttributs-card-mobile-img'>
            <input
              className='input-deck-img'
              style={{position:'absolute', marginTop:'-15%'}}
              type="file"
              accept="image/*"
              onChange={(e) => changeImage(e)}
            />
            <img className='card-selected-img' src={cardImage && cardImage.startsWith('/uploads/') ? `http://54.77.12.209:8081${cardImage}` : cardImage} alt="deck-img" />
          </div>
          <div className='setAttributs-card-img-checkout-mobile'>

            <div className='setAttributs-card-checkout' style={{width: '100%'}}> 
                  
                    <h5 className='card-line-title'>Couleurs : </h5>
                    
                    <CheckboxAddImage
                      style={{marginBottom: '5%'}}
                      attributs={colors}
                      filter={cardColors}
                      onChange={(event) => selectMutipleColors(event.target.value)}
                      image={getColorPics}
                      classNameImg='set-colors-img'
                    />

                    <h5 className='card-line-title'>Formats : </h5>
                    <CheckboxAdd attributs={formats} filter={cardFormats} style={{marginBottom: '5%'}} classNameP='card-format'
                      styleL={{width: '150px'}}
                      onChange={(event) => selectMultipleFormats(event.target.value)}/>
                    <h5 className='card-line-title'>Rareté : </h5>
                    <CheckboxAdd attributs={rarities} filter={cardRarity} style={{marginBottom: '5%'}}
                      styleL={{width: '160px'}}
                      methodBackground={getBackgroundColor}
                      classNameP="card-selected-rarity"
                      onChange={(event) => changeRarity(event.target.value)}/>
                    <h5 className='card-line-title'>Type : </h5>
                    <CheckboxAdd attributs={types} filter={cardType} style={{marginBottom: '5%'}} 
                    styleL={{width: '150px'}}
                    classNameP="checkbox-type-p"
                      onChange={(event) => changeType(event.target.value)}/>

                    {/* Légendaire */}
                        {(cardType === 'CREATURE' || newType === 'CREATURE') && (
                          
                                <div
                                className="input-legendary-container">
                                    <li>
                                        <input 
                                            className="checkbox-legendary" 
                                            type="checkbox" 
                                            name={"legendary"}
                                            checked={cardLegendary !== null}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    changeLegendary("legendary");
                                                } else {
                                                    changeLegendary(null);
                                                }
                                            }}
                                        /> Légendaire
                                    </li>
                                    
                                </div>
                        )}

                    <div className="compenant-checkbox-add" 
                      style={{marginBottom: '5%', width: '100%', flexDirection: 'column', alignItems: 'center'}}>
                      <h5 className='card-line-title'>Texte :</h5>
                      <textarea
                        className="input-card-text"
                        id="card-text"
                        name="deck-name"
                        rows="5"
                        cols="33"
                        value={cardText}
                        onChange={(e) => changeText(e.target.value)}
                      >{cardText}</textarea>
                  </div>

                      <div className="input-mana-cost-card">
                      <h5 className='card-line-title'  style={{marginTop: '5px'}}>Cout en mana :</h5>
                      <input className="input-card-number" type="number" id="cout-mana" name="cout-mana" 
                         value={newManaCost}
                        onChange={(e) => setNewManaCost(e.target.value)} required/>
                    </div>

                    <div className="input-value-card" style={{marginTop: '3%'}}>
                    <h5 className='card-line-title' style={{marginTop: '5px'}}>Valeur € :</h5>
                    <input className="input-card-number" type="number" 
                      step="0.01" onChange={(e) => setNewValue(e.target.value)} required value={newValue}/>
                  </div>

                  
                  </div>
                </div>
                <div className='valid-button-container'>
                  <ButtonValidPopup onClick={() => editCard(cardToUpdate)} disabled={displayLoading}/>
                </div>
          </div>

           {/* Version mobile */}
          <div className='setAttributs-card-mobile' style={{ backgroundImage: `url(${backgroundPopup})`}}>
          <div className='setAttributs-card-mobile-header'>
            <textarea className="input-name" id="deck-name" name="deck-name" rows="1" cols="33" value={cardName}
              maxLength={25} onChange={(e) => changeName(e.target.value)} >
                {cardName}
            </textarea>
          </div>
          <div className='setAttributs-card-mobile-img'>
            <input
              className='input-deck-img'
              style={{position:'absolute', marginTop:'-15%'}}
              type="file"
              accept="image/*"
              onChange={(e) => changeImage(e)}
            />
            <img className='card-selected-img' src={cardImage && cardImage.startsWith('/uploads/') ? `http://54.77.12.209:8081${cardImage}` : cardImage} alt="deck-img" />
          </div>
          <div className='setAttributs-card-img-checkout-mobile'>

            <div className='setAttributs-card-checkout' style={{width: '100%'}}> 
                  
                    <h5 className='card-line-title'>Couleurs : </h5>
                    
                    <CheckboxAddImage
                      style={{marginBottom: '5%'}}
                      attributs={colors}
                      filter={cardColors}
                      onChange={(event) => selectMutipleColors(event.target.value)}
                      image={getColorPics}
                      classNameImg='set-colors-img'
                    />

                    <h5 className='card-line-title'>Formats : </h5>
                    <CheckboxAdd attributs={formats} filter={cardFormats} style={{marginBottom: '5%'}} classNameP='card-format'
                      styleL={{width: '100px'}}
                      onChange={(event) => selectMultipleFormats(event.target.value)}/>
                    <h5 className='card-line-title'>Rareté : </h5>
                    <CheckboxAdd attributs={rarities} filter={cardRarity} style={{marginBottom: '5%'}}
                      styleL={{width: '100px'}}
                      methodBackground={getBackgroundColor}
                      classNameP="card-selected-rarity"
                      onChange={(event) => changeRarity(event.target.value)}/>
                    <h5 className='card-line-title'>Type : </h5>
                    <CheckboxAdd attributs={types} filter={cardType} style={{marginBottom: '5%'}} 
                    styleL={{width: '100px'}}
                    classNameP="checkbox-type-p"
                      onChange={(event) => changeType(event.target.value)}/>

                    {/* Légendaire */}
                        {(cardType === 'CREATURE' || newType === 'CREATURE') && (
                          
                                <div
                                className="input-legendary-container">
                                    <li>
                                        <input 
                                            className="checkbox-legendary" 
                                            type="checkbox" 
                                            name={"legendary"}
                                            checked={cardLegendary !== null}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    changeLegendary("legendary");
                                                } else {
                                                    changeLegendary(null);
                                                }
                                            }}
                                        /> <p className="p-checkbox-legendary">Légendaire</p>
                                    </li>
                                    
                                </div>
                        )}

                    <div className="compenant-checkbox-add" 
                      style={{marginBottom: '5%', width: '100%', flexDirection: 'column', alignItems: 'center'}}>
                      <h5 className='card-line-title'>Texte :</h5>
                      <textarea
                        className="input-card-text"
                        id="card-text"
                        name="deck-name"
                        rows="5"
                        cols="33"
                        value={cardText}
                        onChange={(e) => changeText(e.target.value)}
                      >{cardText}</textarea>
                  </div>

                      <div className="input-mana-cost-card">
                      <h5 className='card-line-title'  style={{marginTop: '5px'}}>Cout en mana :</h5>
                      <input className="input-card-number" type="number" id="cout-mana" name="cout-mana" 
                         value={newManaCost}
                        onChange={(e) => setNewManaCost(e.target.value)} required/>
                    </div>

                    <div className="input-value-card" style={{marginTop: '3%'}}>
                    <h5 className='card-line-title' style={{marginTop: '5px'}}>Valeur € :</h5>
                    <input className="input-card-number" type="number" 
                      step="0.01" onChange={(e) => setNewValue(e.target.value)} required value={newValue}/>
                  </div>

                  
                  </div>
                </div>
                <div className='valid-button-container'>
                  <ButtonValidPopup onClick={() => editCard(cardToUpdate)} disabled={displayLoading}/>
                </div>
          </div>


          <CgCloseO className='icon-close-popup' color='white' size={'5em'} onClick={()=> cancelEdit()}/>
        </div>

              )}
      {/* Global Delete Popup */}
      {cardToDelete && (
        <PopupDelete title={"Supprimer la carte ?"} text={"Les données seront perdues à jamais"}
          back={()=>setCardToDelete(null)} onClick={()=>deleteCard(cardToDelete)}/>
      )}
      <FooterSection/>
  </Section> 
        )
}

export default CardsPageAdmin;
