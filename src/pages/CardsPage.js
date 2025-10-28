import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TbFilterCancel } from "react-icons/tb";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { FaHeart, FaRegHeart  } from 'react-icons/fa';
import backgroundCardsPage from "../assets/background_cardsPage2.jpg"
import backgroundWhite from "../assets/background_white.png"
import Section from '../components/sectionMap';
import Title from '../components/title';
import OpenButtonLarge from '../components/openButtonLarge';
import OpenButton from '../components/openButton';
import IconButton from '../components/buttonIcon'
import SearchBar from '../components/searchBar';
import InputValue from '../components/inputValue';
import InputManaCoast from '../components/inputManaCoast';
import Checkbox from '../components/checkbox';
import CheckboxColor from '../components/checkboxColor';
import CheckboxRarity from '../components/checkboxRarity';
import CheckboxEdition from '../components/checkboxEdition';
import ButtonSelect from '../components/buttonSelect';
import ParagraphLikeNumber from '../components/paragraphLikeNumber';
import FooterSection from '../components/footerSection';
import Card from '../model/Card';
import axiosInstance from '../api/axiosInstance';
import "./css/CardsPage.css";
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import incolore from "../assets/incolore-mtg.webp" 
import loading from "../assets/loading.gif"
import { getImageUrl } from '../utils/imageUtils';



const CardsPage = () => {
    const [cards, setCards] = React.useState([])
    const [topCards, setTopCards] = React.useState([])
    const [detailsCard, setDetailsCard] = React.useState(null)
    const [cardLikedId, setCardLikedId] = React.useState([])
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
    const [displayLoading, setDisplayLoading] = React.useState(true);
        
    // États pour la pagination
    const [page, setPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    
    // États pour la pagination des cartes populaires
    const [pagePopular, setPagePopular] = useState(1);
    const [hasMorePopular, setHasMorePopular] = useState(true);
    const [isLoadingPopular, setIsLoadingPopular] = useState(false);

    // États pour ajuster le nombre de likes des cartes
    const [newCardLikedId, setNewCardLikedId] = React.useState([])
    const [newCardDislikedId, setNewCardDislikedId] = React.useState([])

    const [displayCards, setDisplayCards] = React.useState("id")
 

        // Récupère les cartes triées par id 
 
    const getCardsWithID = async () => {
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
                    order : 'id',
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
                    indexes: null 
                }
                });
                
                const listCards = response.data.content.map(
                        card => new Card (card.id, card.name, card.text, card.image, card.manaCost, card.value, card.formats,
                                card.colors, card.type, card.legendary, card.rarity, card.edition,
                                card.deckBuilders, card.decks, card.decksCommander, card.likeNumber,
                                card.deckNumber, card.commanderNumber
                ) )                
                 
                setCards(listCards)
                setHasMore(!response.data.isLast);
                setCurrentPage(response.data.currentPage)
                setPage(1);
                setNewCardLikedId([]);
                setNewCardDislikedId([]);
                setDisplayLoading(false);
                
            }   
            catch (error) {
                setDisplayLoading(false);
                console.log(error);
            }

    
        }
        React.useEffect(() => {
          getCardsWithID();
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
          setCurrentPage(response.data.currentPage)
          setPage(page + 1)

      } catch (error) {
        console.error('Erreur de chargement des cartes :', error);
      } finally {
        setIsLoading(false);
      }
    }


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
                setHasMorePopular(!response.data.isLast);
                setPagePopular(1);
                setNewCardLikedId([]);
                setNewCardDislikedId([]);
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

    const displayMoreCardsWithLikes = async () => {
        try {
            setIsLoadingPopular(true);
            const params = {
                page: pagePopular,
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
            setHasMorePopular(!response.data.isLast);
            setPagePopular(pagePopular + 1);
        } catch (error) {
            console.error('Erreur de chargement des cartes populaires :', error);
        } finally {
            setIsLoadingPopular(false);
        }
    }

        
                 
                 
    // Afficher les cartes dans l'ordre des plus likées
     const displayTopCards = () => {
                   setDisplayCards("popularity")
                   setCards([])
     }
    
         
                 // Afficher les cartes dans l'ordre des plus récentes
                 const displayIdCards = () => {
                   setDisplayCards("id")
                   setTopCards([])
                 }
         
         
                   const getBgDate= () => {
                     if(displayCards==="id") {
                       return '#1B1D40'
                     } 
                     else {
                       return '#D3D3D3'
                     }
                    }
         
                    const getBgTop= () => {
                     if(displayCards==="popularity") {
                       return '#1B1D40'
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
                     if(displayCards==="popularity") {
                       return 'white'
                     }
                     else {
                       return 'black'
                     }
                    } 


        // Naviguer vers une carte depuis id
        const navCard = (id) => {

          sessionStorage.setItem('cpFilterName', JSON.stringify(filterName));
          sessionStorage.setItem('cpFilterText', JSON.stringify(filterText));
          sessionStorage.setItem('cpInputValueMin', JSON.stringify(inputValueMin));
          sessionStorage.setItem('cpInputValueMax', JSON.stringify(inputValueMax));
          sessionStorage.setItem('cpInputManacostMin', JSON.stringify(inputManaCostMin));
          sessionStorage.setItem('cpInputManacostMax', JSON.stringify(inputManaCostMax));
          sessionStorage.setItem('cpFilterColors', JSON.stringify(filterColors));
          sessionStorage.setItem('cpFilterFormats', JSON.stringify(filterFormats));
          sessionStorage.setItem('cpFilterTypes', JSON.stringify(filterTypes));
          sessionStorage.setItem('cpFilterLegendary', JSON.stringify(filterLegendary));
          sessionStorage.setItem('cpFilterRarities', JSON.stringify(filterRarities));
          sessionStorage.setItem('cpFilterEditions', JSON.stringify(filterEditions));

          const cardsIds = cards.map(card => card.id);
          navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
        };

        // Naviguer vers une carte depuis top
        const navTopCard = (id) => {

          sessionStorage.setItem('cpFilterName', JSON.stringify(filterName));
          sessionStorage.setItem('cpFilterText', JSON.stringify(filterText));
          sessionStorage.setItem('cpInputValueMin', JSON.stringify(inputValueMin));
          sessionStorage.setItem('cpInputValueMax', JSON.stringify(inputValueMax));
          sessionStorage.setItem('cpInputManacostMin', JSON.stringify(inputManaCostMin));
          sessionStorage.setItem('cpInputManacostMax', JSON.stringify(inputManaCostMax));
          sessionStorage.setItem('cpFilterColors', JSON.stringify(filterColors));
          sessionStorage.setItem('cpFilterFormats', JSON.stringify(filterFormats));
          sessionStorage.setItem('cpFilterTypes', JSON.stringify(filterTypes));
          sessionStorage.setItem('cpFilterLegendary', JSON.stringify(filterLegendary));
          sessionStorage.setItem('cpFilterRarities', JSON.stringify(filterRarities));
          sessionStorage.setItem('cpFilterEditions', JSON.stringify(filterEditions));

          const cardsIds = topCards.map(card => card.id);
          navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
        };

        // Récupère le contenu depuis le storage si l'user revient de cardSelected
              useEffect(() => {
              const recupStorage = () => {
                  try {
                      const filterName = sessionStorage.getItem('cpFilterName');
                      const filterText = sessionStorage.getItem('cpFilterText');
                      const inputValueMin = sessionStorage.getItem('cpInputValueMin');
                      const inputValueMax = sessionStorage.getItem('cpInputValueMax');
                      const inputManaCostMin = sessionStorage.getItem('cpInputManacostMin');
                      const inputManaCostMax = sessionStorage.getItem('cpInputManacostMax');
                      const filterLegendary = sessionStorage.getItem('cpFilterLegendary');  
                      
                      if (filterName) {
                          setFilterName(JSON.parse(filterName));
                          sessionStorage.removeItem('cpFilterName');
                      }
                      if (filterText) {
                          setFilterText(JSON.parse(filterText));
                          sessionStorage.removeItem('cpFilterText');
                      }
                      if (inputValueMin) {
                          setInputValueMin(JSON.parse(inputValueMin));
                          sessionStorage.removeItem('cpInputValueMin');
                      }
                      if (inputValueMax) {
                          setInputValueMax(JSON.parse(inputValueMax));
                          sessionStorage.removeItem('cpInputValueMax');
                      }
                      if (inputManaCostMin) {
                          setInputManaCostMin(JSON.parse(inputManaCostMin));
                          sessionStorage.removeItem('cpInputManacostMin');
                      }
                      if (inputManaCostMax) {
                          setInputManaCostMax(JSON.parse(inputManaCostMax));
                          sessionStorage.removeItem('cpInputManacostMax');
                      }
                      if(filterLegendary) {
                          setFilterLegendary(JSON.parse(filterLegendary));
                          sessionStorage.removeItem('cpFilterLegendary');
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

             
      // Renvoie les cartes likés par l'user connecté
      useEffect(() => {
      const getCardsLiked = async () => {
            try {
                  const response = await axiosInstance.get(
                  'f_user/GetCardsLiked',
                  { withCredentials: true }
                );
                                                                   
                  const listId = response.data
                  
                  setCardLikedId(listId)
                 
              
            }
            catch (error) {
                console.log(error);
                }
         }
        getCardsLiked();
           }, []);


      // Affiche une icone de couleur différente selon le statut de la carte            
      const hearthIcon = (id) => {
                      if(!cardLikedId.some(cardId => cardId === (id))) {
                          return (<FaRegHeart className='cardspage-like-icon' size="2em" />)
                      }
                      else {
                          return (<FaHeart className='cardspage-like-icon' size="2em" color="red"/>)
                      }
      }


        const getAdjustedLikeNumber = (card) => {
          if (newCardLikedId.includes(card.id)) return card.likeNumber + 1;
          if (newCardDislikedId.includes(card.id)) return card.likeNumber - 1;
          return card.likeNumber;
        };


        // Like une carte
    const likeCard = async (id) => {
        try {
          await axiosInstance.post(`/f_user/likeCard?cardId=${id}`, null,  { withCredentials: true});          
          setCardLikedId(prevState => [...prevState, id]);
                    
          if (newCardDislikedId.includes(id)) {
            // Si l'id est dans newCardDislikedId, le retirer
            setNewCardDislikedId(prevState => prevState.filter(cardId => cardId !== id));
          }
          else {
            setNewCardLikedId(prevState => [...prevState, id]);
          }                 
        }   
        catch (error) {
          navigate(`/sign`)
        }
    };

        // Dislike une carte
    const dislikeCard = async (id) => {
        try {
          await axiosInstance.delete(`/f_user/dislikeCard?cardId=${id}`, { withCredentials: true});          
          setCardLikedId(prevState => prevState.filter(cardId => cardId !== id));

          if (newCardLikedId.includes(id)) {
            // Si l'id est dans newCardDislikedId, le retirer
            setNewCardLikedId(prevState => prevState.filter(cardId => cardId !== id));
          }
          else {
            setNewCardDislikedId(prevState => [...prevState, id]);
          } 
        }   
        catch (error) {
          navigate(`/sign`)
        }
    };
            
        // Like ou dislike en fonction de ce que l'user a deja liké
        const likeDislike = (id) => {
                if (!cardLikedId.some(cardId => cardId === (id))) {
                    likeCard(id);
                }
                else {
                    dislikeCard(id);
                }

        }



        // Affiche les filtres au format mobile

        const [arrowFiltersSens, setArrowFiltersSens] = React.useState(<SlArrowDown/>)
        const [displayFilters, setDisplayFilters] = React.useState(false)
        
        // Affiche le filtre des formats
        const OpenFilters = () => {
              setArrowFiltersSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
              setDisplayFilters(!displayFilters)                     
                                 }

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
        
        // Affiche le filtre rarities
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
        
          const stored = sessionStorage.getItem('cpFilterRarities');

            if (stored) {
                
                setFilterRarities(JSON.parse(stored));
                sessionStorage.removeItem('cpFilterRarities');
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
        
              // Récupère les rarities dans le storage si l'user vient de cardSelected
              const recupStorageColor = (response) => {
              try {
        
                  if (callColors.current) return;
                
                  const stored = sessionStorage.getItem('cpFilterColors');
        
                    if (stored) {
                        
                        setFilterColors(JSON.parse(stored));
                        sessionStorage.removeItem('cpFilterColors');
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
        
        // Récupère les formats dans le storage si l'user vient de cardSelected
        const recupStorageFormat = (response) => {
              try {
        
                  if (callFormats.current) return;
                
                  const stored = sessionStorage.getItem('cpFilterFormats');
        
                    if (stored) {
                        
                        setFilterFormats(JSON.parse(stored));
                        sessionStorage.removeItem('cpFilterFormats');
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
        
        // Récupère les formats dans le storage si l'user vient de cardSelected
        const recupStorageEdition = (response) => {
              try {
        
                  if (callEditions.current) return;
                
                  const stored = sessionStorage.getItem('cpFilterEditions');
        
                    if (stored) {
                        
                        setFilterEditions(JSON.parse(stored));
                        sessionStorage.removeItem('cpFilterEditions');
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
        
        // Récupère les formats dans le storage si l'user vient de cardSelected
        const recupStorageTypes = (response) => {
              try {
        
                  if (callTypes.current) return;
                
                  const stored = sessionStorage.getItem('cpFilterTypes');
        
                    if (stored) {
                        
                        setFilterTypes(JSON.parse(stored));
                        sessionStorage.removeItem('cpFilterTypes');
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

              {/*Les filtres pour la requete de carte*/}
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
          
                 
                <div className="filter-editions-container" >
                  <OpenButton text="Filtrer par édition" icon={arrowEditionSens} onClick={OpenFilterEdition} />
                  { displayFilterEditions && ( 
                    <div className='add-card-filter-container' style={{zIndex: filterZIndex--}} >
                      <CheckboxEdition attributs={editions} onChange={(event) => selectEditions(event.target.value)} filter={filterEditions}
                        onPush={removeEditions}/>
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
          
                 
                <div className="filter-editions-container">
                  <OpenButton text="Filtrer par édition" icon={arrowEditionSens} onClick={OpenFilterEdition} />
                  { displayFilterEditions && ( 
                    <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                      <CheckboxEdition attributs={editions} onChange={(event) => selectEditions(event.target.value)} filter={filterEditions}
                        onPush={removeEditions}/>
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

 
            
            <div className='title-cards-container'>
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
                                          
                <IconButton   
                    onClick={()=> likeDislike(card.id)} 
                    
                    style={{ 
                        background: 'none', 
                        boxShadow: 'none', 
                        paddingTop: '5%', 
                        border: 'none',                                       
                      }}  
                                  
                    icon={hearthIcon(card.id)} 
                />
                    <p className='card-page-likenumber'>{getAdjustedLikeNumber(card)} <FaHeart style={{position:'relative', marginBottom: '3px'}}
                      size={'0.9em'}  color='red' /></p>

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

       { displayCards === "popularity" && ( 
            <div className='map-cards-section'>
              {topCards.map(card => ( 
                  <div className="cards-details" key={card.id} style={{display:(maskBaseLand(card.id))}}>
                      <img className="cards-img" src={getImageUrl(card.image)} alt="Card-image" onClick={() => navTopCard(card.id)}
                      onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                       />
                                         
              <IconButton   
                  onClick={()=> likeDislike(card.id)} 
                  
                  style={{ 
                      background: 'none', 
                      boxShadow: 'none', 
                      paddingTop: '5%', 
                      border: 'none',                                       
                    }} 
                                
                  icon={hearthIcon(card.id)} 
              /> 

              <ParagraphLikeNumber text={getAdjustedLikeNumber(card)} iconStyle={{position:'relative', marginBottom: '3px'}}/>


                  {detailsCard && detailsCard.id === card.id && (
                  <img className="card-img-zoom" src={getImageUrl(card.image)} alt="Card-image"/>
                  )}  
              </div>
              ))}       
      </div>
      )}
      
      { displayCards === "popularity" && cards.length > 0 && hasMorePopular && (
        <button className='next-page-button' disabled={!hasMorePopular} onClick={()=>displayMoreCardsWithLikes()}>Afficher plus</button> 
      )}     
      </div>


      
      <FooterSection/>       

  </Section>
        )
}

export default CardsPage;
