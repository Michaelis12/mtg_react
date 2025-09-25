import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CgAdd } from "react-icons/cg";
import { TbFilterCancel } from "react-icons/tb";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { TiDeleteOutline } from "react-icons/ti";
import { CgCloseO  } from "react-icons/cg";
import backgroundCardsPage from "../assets/background_cardsPage.jpg"
import backgroundPopup from "../assets/background_white.png"
import backgroundWhite from "../assets/background_white.png";
import Section from '../components/sectionMap';
import Title from '../components/title';
import OpenButton from '../components/openButton';
import OpenButtonLarge from '../components/openButtonLarge';
import SearchBar from '../components/searchBar';
import InputValue from '../components/inputValue';
import InputManaCoast from '../components/inputManaCoast';
import Checkbox from '../components/checkbox';
import CheckboxColor from '../components/checkboxColor';
import CheckboxRarity from '../components/checkboxRarity';
import CheckboxEdition from '../components/checkboxEdition';
import AddButton from '../components/addButton';
import ButtonSelect from '../components/buttonSelect';
import ButtonValid from '../components/buttonValid';
import IconButtonHover from '../components/buttonIconHover';
import { FaHeart  } from 'react-icons/fa';
import { MdOutlinePlayArrow } from "react-icons/md";
import Card from '../model/Card';
import axiosInstance from "../api/axiosInstance";
import "./css/CardsDeckPage.css";
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import incolore from "../assets/incolore-mtg.png"
import defaultImg from "../assets/mtg-card-back.jpg"



const CardsDeckPage = () => { 
    const [cards, setCards] = React.useState([])
    const [topCards, setTopCards] = React.useState([])
    const [cardsLiked, setCardsLiked] = React.useState([])
    const [detailsCard, setDetailsCard] = React.useState(null)
    const [cardsSelected, setCardsSelected] = React.useState([])
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.deckID;
    const  deckCards = location.state.cardsDesac
    const [deck, setDeck] = React.useState([])
    const [colors, setColors] = React.useState([])
    const [format, setFormat] = React.useState("")

    // Mobile filters toggle (inspired by CardsPage)
    const [arrowFiltersSens, setArrowFiltersSens] = React.useState(<SlArrowDown/>);
    const [displayFilters, setDisplayFilters] = React.useState(false);
    const OpenFilters = () => {
      setArrowFiltersSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
      setDisplayFilters(!displayFilters);
    };
    const [cardImage, setCardImage] = React.useState(defaultImg)
    

     const callColors = useRef(false)
     const recupStorageColors = (response) => {
        try {
            console.log(callColors)

             if (callColors.current) return;

            const stored = sessionStorage.getItem('filterColors');

            if (stored) {
                setFilterColors(JSON.parse(stored));
                sessionStorage.removeItem('filterColors');
                callColors.current = true;
            } else {
                setFilterColors(response);
                
            }
            
        } catch (error) {
            console.error("Erreur lors de la récupération du sessionStorage :", error);
        }
        };


    // Renvoie les attributs du deck sélectionné 
    useEffect(() => {
        const getDeckSelected = async () => {
            try {
                const stored = sessionStorage.getItem('filterColors');
                const request = await axiosInstance.get(`f_all/getDeckID?deckID=${id}`);

                const response = request.data
    
                setDeck(response)
                    
                // Sert à mapper les colors pour le filtre
                setColors(response.colors)
                setFormat(response.format)

              if (!stored) {
                setFilterColors(response.colors)
              }

                recupStorageColors(response.colors)
                    


            }   
            catch (error) {
                console.log(error);
            }

    
        }
        getDeckSelected();
        }, [id]);
 
    // Filtre recherche
    const [filterName, setFilterName] = React.useState("")
    const [filterText, setFilterText] = React.useState("")
    const [inputValueMin, setInputValueMin] = React.useState("")
    const [inputValueMax, setInputValueMax] = React.useState("")
    const [inputManaCostMin, setInputManaCostMin] = React.useState("")
    const [inputManaCostMax, setInputManaCostMax] = React.useState("")
    const [filterColors, setFilterColors] = React.useState([])
    const [filterRarities, setFilterRarities] = React.useState([])
    const [filterEditions, setFilterEditions] = React.useState([])
    const [filterTypes, setFilterTypes] = React.useState([])
    const [filterLegendary, setFilterLegendary] = React.useState(null)
    const [displayLoading, setDisplayLoading] = React.useState(true);
    // États pour la pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    
    // États pour la pagination des cartes populaires
    const [pagePopular, setPagePopular] = useState(1);
    const [hasMorePopular, setHasMorePopular] = useState(true);
    const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  
    // État pour l'affichage des cartes
    const [displayCards, setDisplayCards] = React.useState("id")
     const [displayCardsOrder, setDisplayCardsOrder] = React.useState("id")

        // Récupère les cartes triées par id 
 
    const getCardsWithID = async () => {             
    
      if (
        filterEditions.length < 1 || filterRarities.length < 1 ||
        filterColors.length < 1 ||
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
          formats: format,
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
  }, [displayCards, filterName, filterText,
    inputValueMin, inputValueMax,
    inputManaCostMin, inputManaCostMax,
    filterColors, filterRarities,
    filterEditions, filterTypes, filterLegendary]);


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
            formats: format,
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

        // Récupère les cartes triées par popularité 
        const getCardsWithLikes = async () => {
            try {
                setDisplayLoading(true); 
                if (filterEditions.length <1 || filterRarities.length <1 || filterColors.length <1 || filterTypes.length <1
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
                    formats: format,
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
                setDisplayLoading(false);
            }   
            catch (error) {
                setDisplayLoading(false);
                console.log(error);
            }

    
        }
        React.useEffect(() => {
          getCardsWithLikes();
      }, [displayCards, filterName, filterText, inputValueMin, inputValueMax, inputManaCostMin, inputManaCostMax,
         filterColors, filterRarities, filterEditions, filterTypes, filterLegendary]);

    const displayMoreCardsWithLikes = async () => {
        try {
            setIsLoadingPopular(true);

            const params = {
                page: pagePopular,
                size: pageSize,
                order : 'like',
                name: filterName,
                text: filterText,
                formats: format,
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

            const response = await axiosInstance.get('f_all/getTopCardsPaged', {
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


  // Récupère uniquement les cards likées par l'user

  const getCardsLikedWithID = async () => {             
    
      if (
        filterEditions.length < 1 || filterRarities.length < 1 ||
        filterColors.length < 1 ||
        filterTypes.length < 1
      ) {
        return;
      }
          
      try {
        setIsLoading(true);


        const params = {
          page: 0,
          size: pageSize,
          order : displayCardsOrder,
          name: filterName,
          text: filterText,
          colors: filterColors,
          formats: format,
          rarities: filterRarities,
          valueMin: inputValueMin,
          valueMax: inputValueMax,
          manaCostMin: inputManaCostMin,
          manaCostMax: inputManaCostMax,
          editions: filterEditions,
          types: filterTypes,
          legendary: filterLegendary
        };

        const response = await axiosInstance.get('/f_user/getCardsLikedFiltredPaged', 
        {
          params,
          paramsSerializer: { indexes: null },
          withCredentials: true
        });

        const listCards = response.data.content.map(card => new Card(
          card.id, card.name, card.text, card.image, card.manaCost, card.value,
          card.formats, card.colors, card.type, card.legendary, card.rarity,
          card.edition, card.deckBuilders, card.decks, card.decksCommander,
          card.likeNumber, card.deckNumber, card.commanderNumber
        ));
        setCardsLiked(listCards)
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
    getCardsLikedWithID();
  }, [displayCards, filterName, filterText,
    inputValueMin, inputValueMax,
    inputManaCostMin, inputManaCostMax,
    filterColors, filterRarities,
    filterEditions, filterTypes, filterLegendary]);


    const displayMoreCardsLiked = async () => {
        try {
            setIsLoading(true);

            const params = {
                page: pagePopular,
                size: pageSize,
                order : 'id',
                name: filterName,
                text: filterText,
                formats: format,
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

            const response = await axiosInstance.get('f_all/getCardsLikedPaged', {
                params,
                paramsSerializer: { indexes: null }
            });

            const newCards = response.data.content.map(
                card => new Card(card.id, card.name, card.text, card.image, card.manaCost, card.value, card.formats,
                    card.colors, card.type, card.legendary, card.rarity, card.edition,
                    card.deckBuilders, card.decks, card.decksCommander, card.likeNumber,
                    card.deckNumber, card.commanderNumber
                ));

            setCards(prevCards => [...prevCards, ...newCards]);
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
                   setDisplayCards("popularity")
                   setDisplayCardsOrder("like")
    }
         
    // Afficher les cartes dans l'ordre des plus récentes
    const displayIdCards = () => {
                   setDisplayCards("id")
                   setDisplayCardsOrder("id")
    }

    // Afficher que les cartes likées
    const displayLikedCards = () => {
                   setDisplayCards("liked")
    }

        
         
    const getBgDate= () => {
      
                     if(displayCardsOrder ==="id") {
                       return '#5D3B8C'
                     } 
                     else {
                       return '#D3D3D3'
                     }
      
    }
         
    const getBgTop= () => {
                     if(displayCardsOrder ==="like") {
                       return '#5D3B8C'
                     }
                     else {
                       return '#D3D3D3'
                     }
    }

    const getBgLike= () => {
                     if(displayCards==="liked") {
                       return '#5D3B8C'
                     }
                     else {
                       return '#D3D3D3'
                     }
    }
         
    const getColorDate= () => {
                     if(displayCardsOrder ==="id") {
                       return 'white'
                     } 
                     else {
                       return 'black'
                     }
    }
         
    const getColorTop= () => {
                     if(displayCardsOrder ==="like") {
                       return 'white'
                     }
                     else {
                       return 'black'
                     }
    }

    const getColorLike= () => {
                     if(displayCards==="liked") {
                       return 'white'
                     }
                     else {
                       return 'black'
                     }
    }


        // Naviguer vers une carte depuis id
        const navCard = (id) => {     
          sessionStorage.setItem('cardsSelected', JSON.stringify(cardsSelected));
          sessionStorage.setItem('filterName', JSON.stringify(filterName));
          sessionStorage.setItem('filterText', JSON.stringify(filterText));
          sessionStorage.setItem('inputValueMin', JSON.stringify(inputValueMin));
          sessionStorage.setItem('inputValueMax', JSON.stringify(inputValueMax));
          sessionStorage.setItem('inputManacostMin', JSON.stringify(inputManaCostMin));
          sessionStorage.setItem('inputManacostMax', JSON.stringify(inputManaCostMax));
          sessionStorage.setItem('filterColors', JSON.stringify(filterColors));
          sessionStorage.setItem('filterTypes', JSON.stringify(filterTypes));
          sessionStorage.setItem('filterLegendary', JSON.stringify(filterLegendary));
          sessionStorage.setItem('filterRarities', JSON.stringify(filterRarities));
          sessionStorage.setItem('filterEditions', JSON.stringify(filterEditions));

          const cardsIds = cards.map(card => card.id);
          navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds}})
        };

      // Récupère le contenu depuis le storage si l'user revient de cardSelected
      useEffect(() => {
      const recupStorage = () => {
          try {
              const cardsSelected = sessionStorage.getItem('cardsSelected');
              const filterName = sessionStorage.getItem('filterName');
              const filterText = sessionStorage.getItem('filterText');
              const inputValueMin = sessionStorage.getItem('inputValueMin');
              const inputValueMax = sessionStorage.getItem('inputValueMax');
              const inputManaCostMin = sessionStorage.getItem('inputManacostMin');
              const inputManaCostMax = sessionStorage.getItem('inputManacostMax');
              const filterLegendary = sessionStorage.getItem('filterLegendary');
                
              if (cardsSelected) {
                  setCardsSelected(JSON.parse(cardsSelected));
                  sessionStorage.removeItem('cardsSelected');
              }
              if (filterName) {
                  setFilterName(JSON.parse(filterName));
                  sessionStorage.removeItem('filterName');
              }
              if (filterText) {
                  setFilterText(JSON.parse(filterText));
                  sessionStorage.removeItem('filterText');
              }
              if (inputValueMin) {
                  setInputValueMin(JSON.parse(inputValueMin));
                  sessionStorage.removeItem('inputValueMin');
              }
              if (inputValueMax) {
                  setInputValueMax(JSON.parse(inputValueMax));
                  sessionStorage.removeItem('inputValueMax');
              }
              if (inputManaCostMin) {
                  setInputManaCostMin(JSON.parse(inputManaCostMin));
                  sessionStorage.removeItem('inputManacostMin');
              }
              if (inputManaCostMax) {
                  setInputManaCostMax(JSON.parse(inputManaCostMax));
                  sessionStorage.removeItem('inputManacostMax');
              }
              if(filterLegendary) {
                setFilterLegendary(JSON.parse(filterLegendary));
                sessionStorage.removeItem('filterLegendary');
              }
              
              
          } catch (error) {
              console.error("Erreur lors de la récupération du sessionStorage :", error);
          }
      };

      recupStorage();
  }, []);



        // Naviguer vers une carte depuis top
        const navTopCard = (id) => {
          sessionStorage.setItem('cardsSelected', JSON.stringify(cardsSelected));
          sessionStorage.setItem('format', JSON.stringify(format));
          sessionStorage.setItem('filterName', JSON.stringify(filterName));
          sessionStorage.setItem('filterText', JSON.stringify(filterText));
          sessionStorage.setItem('inputValueMin', JSON.stringify(inputValueMin));
          sessionStorage.setItem('inputValueMax', JSON.stringify(inputValueMax));
          sessionStorage.setItem('inputManacostMin', JSON.stringify(inputManaCostMin));
          sessionStorage.setItem('inputManacostMax', JSON.stringify(inputManaCostMax));
          sessionStorage.setItem('filterColors', JSON.stringify(filterColors));
          sessionStorage.setItem('filterTypes', JSON.stringify(filterTypes));
          sessionStorage.setItem('filterLegendary', JSON.stringify(filterLegendary));
          sessionStorage.setItem('filterRarities', JSON.stringify(filterRarities));
          sessionStorage.setItem('filterEditions', JSON.stringify(filterEditions));

          const cardsIds = topCards.map(card => card.id);
          navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
        };
        
        
        // Zoomer sur une carte
        const hoveredCard = (id) => {
         setDetailsCard({ id });

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
        
          const stored = sessionStorage.getItem('filterRarities');

            if (stored) {
                
                setFilterRarities(JSON.parse(stored));
                sessionStorage.removeItem('filterRarities');
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
           setFilterColors(deck.colors)
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

        const callEditions = useRef(false)

        const recupStorageEdition = (response) => {
        try {
            if (callEditions.current) return;
            
            const stored = sessionStorage.getItem('filterEditions');

            if (stored) {
                setFilterEditions(JSON.parse(stored));
                sessionStorage.removeItem('filterEditions');
                callEditions.current = true;
            }
            else {
                setFilterEditions(response)
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
      
      // Affiche le filtre des Types
      const OpenFilterType = () => {
            setArrowTypeSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
            setDisplayFilterTypes(!displayFilterTypes)                     
                               }


        const [types, setTypes] = React.useState([])

        const callTypes = useRef(false)


        const recupStorageType = (response) => {
        try {

            if (callTypes.current) return;
        
            const stored = sessionStorage.getItem('filterTypes');

            
            if (stored) {
                setFilterTypes(JSON.parse(stored));
                sessionStorage.removeItem('filterTypes');
                callTypes.current = true
            }
            else {
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

                    recupStorageType(response)

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

    
        // Sélectionne des cartes pour Commander 
        const selectCardCedh = (newCard) => {
          setCardsSelected((prevCards) => {
            if (prevCards.some((card) => card.id === newCard.id)) {
              // Si la carte est déjà dans la sélection, on la retire
              return prevCards.filter((card) => card.id !== newCard.id);
            } else {
              // Sinon, on ajoute la carte à la sélection
              return [...prevCards, newCard];
            }
          });
        };

        // Sélectionne des cartes un format =/= commander
        const selectCard = (newCard) => {
          setCardsSelected(prevCards => [...prevCards, newCard])
        };

        // Retire des cartes pour un format =/= commander 
        const unselectCard = (cardToRemove) => {
            setCardsSelected(prevCards => {
              const index = prevCards.findIndex(card => card.id === cardToRemove.id);
              if (index === -1) return prevCards; // Rien à retirer
              const newCards = [...prevCards];
              newCards.splice(index, 1);
              return newCards;
            });
          };
        
        // Retire tous les exemplaires d'une carte
        const unselectCards = (cardToRemove) => {
            if(cardsSelected.length === 1) {
               setCardImage(defaultImg)
              setDisplayPopup(false)
            }
            
            setCardsSelected(prevCards => 
              prevCards.filter(card => card.id !== cardToRemove.id)
            );
            
          };



      // N'affiche pas les terrains de base
      const maskBaseLand = (value) => {
        if(value > 0 && value < 7) {
            return "none";
      }
    }

      // Masque les cartes présentes dans le deck, si le format est pas CEDH
      const desacCardsDeck = (value) => {
        const count = deckCards.filter(card => card === value).length;
        if (count > 3) {
          return 0.5;
        }
      }

      // Masque les cartes présentes dans le deck, si le format est CEDH
      const desacCardsCedh = (value) => {

        if(deckCards.includes(value)) {
          return '0.5'
        }
      }

        // Modifie l'icone de la carte quand elle est sélectionnée 
        const changeIcon = (id) => {
          const cardIds = cardsSelected.map(card => card.id);
          if(!cardIds.includes(id)) {
                          return <CgAdd size={'2.5em'} color={'black'} className="icon-add-card"/>
                          }
                          else {
                              return <CgCloseO size={'2.5em'} color={'red'} className="icon-add-card"/>
                          } 
        } 
        
        // Ajoute les cartes sélectionnées par l'user dans le deck
        const addCards = async () => { 
            try { 
                const cardIds = cardsSelected.map(card => card.id).join(',');

                const response = await axiosInstance.post(`f_user/addCardsOnDeck?cardId=${cardIds}&deckId=${id}`, null, { withCredentials: true });
                const data = id
                navigate(`/deckbuilding`, { state: { deckID: data }})
                
                 }   
            catch (error) {
                console.log(error); 
            }
        }
        
        // Donne le nombre d'exemplaire d'une carte
        const count = (card) => {
          const cardsSelectedIds = cardsSelected.map(card => card.id);

          return deckCards.filter(id => id === card.id).length + cardsSelectedIds.filter(id => id === card.id).length
        }


        // Masque le bouton moins si il n'y a pas de cartes à retirer 
        const lessCard = (card) => {

          const cardOnDeck = deckCards.filter(cardDeck => cardDeck === card.id).length

          if(count(card) > cardOnDeck) {
            return false
          }
          else {
            return true
          }
        }


        const [displayPopup, setDisplayPopup]= React.useState(false)
        const [cardsSelectedUnit, setCardsSelectedUnit]= React.useState(false)

        // Réupère les cartes sélectionnés par l'user avec des id différents
          useEffect(() => {
            const getCardsSelectedUnit =  () => {
                try {

                      const unitsCardsMap = new Map();
  
                      const listUnitCards = cardsSelected.map(card => {
                          if (!unitsCardsMap.has(card.id)) {
                              unitsCardsMap.set(card.id, true);  
                              return new Card (card.id, card.name, card.text, card.image, card.manaCost, card.value, card.formats,
                                  card.colors, card.type, card.rarity, card.edition, card.decks );
                          }
                          return null; 
                      }).filter(card => card !== null);
  
                      setCardsSelectedUnit(listUnitCards)

                

                }   
                catch (error) {
                    console.log(error);
                }
            }
            getCardsSelectedUnit();
            }, [cardsSelected]);


      const [cardNumber, setCardNumber] = React.useState(0)

        const prevCard = () => {
          setCardNumber(cardNumber-1)
        }

        const nextCard = () => {
          setCardNumber(cardNumber+1)
          console.log(cardNumber)
        }

        let filterZIndex = 99;

        return (  
            <Section className="section"> 
            <img src={backgroundCardsPage} className="background-image" alt="background" />
            
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
            
            <div className='title-cards-dispo-container'>
              <Title title='Cartes disponibles'/>
            </div>

            <div className='cards-buttons-order-container'>
                          <ButtonSelect className={"button-date"} onClick={() => displayIdCards()} text={"Dernières parutions"}
                                                  backgroundColor={getBgDate()} color={getColorDate()}/>
                          <ButtonSelect className={"button-top"} onClick={() => displayTopCards()} text={"Les plus populaires"} 
                                                 backgroundColor={getBgTop()} color={getColorTop()}/>
            </div>

            <div className='cards-buttons-order-container'>
                          <ButtonSelect className={"button-top"} onClick={() => displayLikedCards()} text={"Cartes likées uniquement"} 
                                                 backgroundColor={getBgLike()} color={getColorLike()}/>
            </div>

          <div className='display-objects-section'>
                  
            { displayCards === "id" && (
              <div className='map-cards-section'>
              
                {cards.map(card => ( 
                    <div className="cards-details" key={card.id} style={{display:(maskBaseLand(card.id))}}>                       

                      { deck.format === "COMMANDER" && ( 
                      <div className='classic-formats-deck-details'>
                        <img className="cards-img" src={card.image && card.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${card.image}` : card.image} alt="Card-image" onClick={() => navCard(card.id)}
                        onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                        style={{opacity: desacCardsCedh(card.id)}} />                
                        <AddButton onClick={() => selectCardCedh(card)} style={{ backgroundColor: 'white', margin : '2%', border: 'none' }}
                            icon={changeIcon(card.id)}  disabled={deckCards.includes(card.id)}/>
                      </div>
                      )}

                      { deck.format !== "COMMANDER" && (                 
                      <div className='classic-formats-deck-details'>
                        <img className="cards-img" src={card.image && card.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${card.image}` : card.image} alt="Card-image" onClick={() => navCard(card.id)}
                        onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                        style={{opacity: desacCardsDeck(card.id)}} />

                        

                       <div className="deck-presence-container">
                         <p className="p-cards-deck-length">présence dans le deck : {deckCards.filter(cardDeck => cardDeck === card.id).length}</p>
                         {cardsSelected.filter(cardDeck => cardDeck === card).length > 0 && (
                          <p className='p-card-add-length'>+ {cardsSelected.filter(cardDeck => cardDeck === card).length}</p>
                        )}

                        
                       </div>

                       { !deckCards.includes(card.id) && !cardsSelected.includes(card) && (
                        <AddButton onClick={() => selectCard(card)} style={{ backgroundColor: 'white', margin : '2%', marginBottom: '7%', border: 'none' }}
                              icon={<CgAdd size={'2.5em'} color={'black'} />} />
                        )}
 
                       
                  
                       { count(card) > 0 && (
                        <div className='card-deck-count' style={{marginBottom: '2%'}}>
                          <button className="add-button-deckbuilding" style={{ backgroundColor: 'white', margin : '2%', border: 'none' }} onClick={() => unselectCard(card)}
                           disabled={lessCard(card)} >
                            <AiOutlineMinusCircle  className="icon-add-card" size={'3em'} color={'black'} />
                          </button>
                          <p className='p-card-length' style={{ fontWeight: 'bold', marginTop: '1%' }}>{count(card)}</p>
                          <button className="add-button-deckbuilding" disabled={count(card) > 3} style={{ backgroundColor: 'white', margin : '2%', border: 'none' }} onClick={() => selectCard(card)} >
                            <CgAdd className="icon-add-card" size={'3em'} color={'black'} />
                          </button> 
                        
  
                        </div>
                       )}
                      </div>                    
                      )} 
                    
                    <p className='card-page-likenumber'>{card.likeNumber} <FaHeart style={{position:'relative', marginBottom: '3px'}} size={'0.9em'}  color='red' /></p>

                    {detailsCard && detailsCard.id === card.id && (
                    <img className="card-img-zoom" src={card.image && card.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${card.image}` : card.image} alt="Card-image"/>
                    )}  
                </div>
                ))}
              
                <ButtonValid style={{position: 'fixed', bottom: '15px', right: '50px'}}
                onClick={()=>setDisplayPopup(true)} disabled={cardsSelected.length === 0} text={'+ ' + cardsSelected.length + ' cartes'}/>

                
                
              </div>
            )} 

            { displayCards === "id" && hasMore && (
              <button className='next-page-button' disabled={!hasMore} onClick={()=>displayMoreCardsWithID()}>Afficher plus</button> 
            )}

            { displayCards === "popularity" && (
              <div className='map-cards-section'>

                    {topCards.map(card => ( 
                    <div className="cards-details" key={card.id} style={{display:(maskBaseLand(card.id))}}>                       

                      { deck.format === "COMMANDER" && ( 
                      <div className='classic-formats-deck-details'>
                        <img className="cards-img" src={card.image && card.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${card.image}` : card.image} alt="Card-image" onClick={() => navCard(card.id)}
                        onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                        style={{opacity: desacCardsCedh(card.id)}} />                
                        <AddButton onClick={() => selectCardCedh(card)} style={{ backgroundColor: 'white', margin : '2%', border: 'none' }}
                            icon={changeIcon(card.id)}  disabled={deckCards.includes(card.id)}/>
                      </div>
                      )}

                      { deck.format !== "COMMANDER" && (                 
                      <div className='classic-formats-deck-details'>
                        <img className="cards-img" src={card.image && card.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${card.image}` : card.image} alt="Card-image" onClick={() => navCard(card.id)}
                        onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                        style={{opacity: desacCardsDeck(card.id)}} />

                        

                       <div className="deck-presence-container">
                         <p className="p-cards-deck-length">présence dans le deck : {deckCards.filter(cardDeck => cardDeck === card.id).length}</p>
                         {cardsSelected.filter(cardDeck => cardDeck === card).length > 0 && (
                          <p className='p-card-add-length'>+ {cardsSelected.filter(cardDeck => cardDeck === card).length}</p>
                        )}

                        
                       </div>

                       { !deckCards.includes(card.id) && !cardsSelected.includes(card) && (
                        <AddButton onClick={() => selectCard(card)} style={{ backgroundColor: 'white', margin : '2%', marginBottom: '7%', border: 'none' }}
                              icon={<CgAdd size={'2.5em'} color={'black'} />} />
                        )}

                       
                  
                       { count(card) > 0 && (
                        <div className='card-deck-count' style={{marginBottom: '2%'}}>
                          <button className="add-button-deckbuilding" style={{ backgroundColor: 'white', margin : '2%', border: 'none' }} onClick={() => unselectCard(card)}
                           disabled={lessCard(card)} >
                            <AiOutlineMinusCircle  className="icon-add-card" size={'3em'} color={'black'} />
                          </button>
                          <p className='p-card-length' style={{ fontWeight: 'bold', marginTop: '1%' }}>{count(card)}</p>
                          <button className="add-button-deckbuilding" disabled={count(card) > 3} style={{ backgroundColor: 'white', margin : '2%', border: 'none' }} onClick={() => selectCard(card)} >
                            <CgAdd className="icon-add-card" size={'3em'} color={'black'} />
                          </button>
                        
  
                        </div>
                       )}
                      </div>                    
                      )}
                    
                    <p className='card-page-likenumber'>{card.likeNumber} <FaHeart style={{position:'relative', marginBottom: '3px'}} size={'0.9em'}  color='red' /></p>

                    {detailsCard && detailsCard.id === card.id && (
                    <img className="card-img-zoom" src={card.image && card.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${card.image}` : card.image} alt="Card-image"/>
                    )}  
                </div> 
                ))}
                    <ButtonValid style={{position: 'fixed', bottom: '15px', right: '50px'}}
                    onClick={()=>setDisplayPopup(true)} disabled={cardsSelected.length === 0} text={'+ ' + cardsSelected.length + ' cartes'}/>
                    
                  </div>
            )}

            { displayCards === "popularity" && hasMorePopular && (
              <button className='next-page-button' disabled={!hasMorePopular} onClick={()=>displayMoreCardsWithLikes()}>Afficher plus</button> 
            )}

            { displayCards === "liked" && (
              <div className='map-cards-section'>
              
                {cardsLiked.map(card => ( 
                    <div className="cards-details" key={card.id} style={{display:(maskBaseLand(card.id))}}>                       

                      { deck.format === "COMMANDER" && ( 
                      <div className='classic-formats-deck-details'>
                        <img className="cards-img" src={card.image && card.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${card.image}` : card.image} alt="Card-image" onClick={() => navCard(card.id)}
                        onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                        style={{opacity: desacCardsCedh(card.id)}} />                
                        <AddButton onClick={() => selectCardCedh(card)} style={{ backgroundColor: 'white', margin : '2%', border: 'none' }}
                            icon={changeIcon(card.id)}  disabled={deckCards.includes(card.id)}/>
                      </div>
                      )}

                      { deck.format !== "COMMANDER" && (                 
                      <div className='classic-formats-deck-details'>
                        <img className="cards-img" src={card.image && card.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${card.image}` : card.image} alt="Card-image" onClick={() => navCard(card.id)}
                        onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                        style={{opacity: desacCardsDeck(card.id)}} />

                        

                       <div className="deck-presence-container">
                         <p className="p-cards-deck-length">présence dans le deck : {deckCards.filter(cardDeck => cardDeck === card.id).length}</p>
                         {cardsSelected.filter(cardDeck => cardDeck === card).length > 0 && (
                          <p className='p-card-add-length'>+ {cardsSelected.filter(cardDeck => cardDeck === card).length}</p>
                        )}

                        
                       </div>

                       { !deckCards.includes(card.id) && !cardsSelected.includes(card) && (
                        <AddButton onClick={() => selectCard(card)} style={{ backgroundColor: 'white', margin : '2%', marginBottom: '7%', border: 'none' }}
                              icon={<CgAdd size={'2.5em'} color={'black'} />} />
                        )}

                       
                  
                       { count(card) > 0 && (
                        <div className='card-deck-count' style={{marginBottom: '2%'}}>
                          <button className="add-button-deckbuilding" style={{ backgroundColor: 'white', margin : '2%', border: 'none' }} onClick={() => unselectCard(card)}
                           disabled={lessCard(card)} >
                            <AiOutlineMinusCircle  className="icon-add-card" size={'3em'} color={'black'} />
                          </button>
                          <p className='p-card-length' style={{ fontWeight: 'bold', marginTop: '1%' }}>{count(card)}</p>
                          <button className="add-button-deckbuilding" disabled={count(card) > 3} style={{ backgroundColor: 'white', margin : '2%', border: 'none' }} onClick={() => selectCard(card)} >
                            <CgAdd className="icon-add-card" size={'3em'} color={'black'} />
                          </button>
                        
  
                        </div>
                       )}
                      </div>                    
                      )}
                    
                    <p className='card-page-likenumber'>{card.likeNumber} <FaHeart style={{position:'relative', marginBottom: '3px'}} size={'0.9em'}  color='red' /></p>

                    {detailsCard && detailsCard.id === card.id && (
                    <img className="card-img-zoom" src={card.image && card.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${card.image}` : card.image} alt="Card-image"/>
                    )}  
                </div>
                ))}
              
                <ButtonValid style={{position: 'fixed', bottom: '15px', right: '50px'}}
                onClick={()=>setDisplayPopup(true)} disabled={cardsSelected.length === 0} text={'+ ' + cardsSelected.length + ' cartes'}/>

                
                
              </div>
            )} 

            { displayCards === "liked" && hasMore && (
              <button className='next-page-button' disabled={!hasMore} onClick={()=>displayMoreCardsLiked()}>Afficher plus</button> 
            )}

            { displayPopup && (
              <div className='popup-bckg'>
                       <div className='popup-cards-selected' style={{ backgroundImage: `url(${backgroundPopup})`}} >
                                              <div className='header-popup-cards-selected'>
                                                  <h2><strong>Cartes sélectionnées ({cardsSelected.length})</strong></h2>
                                              </div>
                                              <div className='cards-selected-container'>
                                                <img className='card-add-img' src={cardImage && cardImage.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${cardImage}` : cardImage} alt="deck-img" />
                                                <div className='cards-deck-unit-container'> 
                                                  {cardsSelectedUnit.map(card => ( 
                                                    <div className="land-text-details" id='land-card'  key={card.id}>
                                                        <h5 className='land-text-name' onMouseEnter={() => setCardImage(card.image)} >{card.name}</h5>
                                                      { format !== "COMMANDER" && (
                                                        <div className='land-text-number'>                              
                                                            <button className="addButton" style={{ backgroundColor: 'white', margin : '2%', border: 'none' }} onClick={() => unselectCard(card)}
                                                            disabled={lessCard(card)} >
                                                              <AiOutlineMinusCircle  size={'2em'} color={'black'} />
                                                            </button>
                                                            <p className='p-card-length' style={{ fontWeight: 'bold' }}> {cardsSelected.filter(cardSelected => cardSelected.id === card.id).length}</p>
                                                            <button className="addButton" disabled={count(card) > 3} style={{ backgroundColor: 'white', margin : '2%', border: 'none' }} onClick={() => selectCard(card)} ><CgAdd size={'2em'} color={'black'} />
                                                            </button> 
                                                        </div>
                                                      )}
                                                        <TiDeleteOutline className='delete-card-button' color='red' size={'3em'} onClick={()=>unselectCards(card)} />
                                                        
                                                        {detailsCard && detailsCard.id === card.id && (
                                                        <img className="card-img-zoom" src={card.image && card.image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${card.image}` : card.image} alt="Card-image"/>
                                                        )} 
                                                    </div>
                                            
                                                  ))}  
                                              </div>
                                              </div>                                       
                                                <div className='valid-popup-container'>                                   
                                                  <button className='valid-popup' >
                                                      <h4 className='valid-popup-title' onClick={() => addCards()}>Ajouter au deck</h4>
                                                  </button>
                                                </div>
                       </div> 

                        <div className='popup-cards-selected-mobile' style={{ backgroundImage: `url(${backgroundPopup})`}}>
                            <div className='header-popup-cards-selected'>
                              <h3>Cartes sélectionnées ({cardsSelected.length})</h3>
                            </div>
                            <div className='cards-selected-container-mobile'>
                              

                              <div className='button-nav-mobile'>   
                                <IconButtonHover onClick={() => prevCard()} disabled={cardNumber === 0}
                                icon={<MdOutlinePlayArrow className='icon-nav' style={{ transform: 'scaleX(-1)' }} />} />
                                <IconButtonHover onClick={() => nextCard()}  disabled={cardNumber === cardsSelectedUnit.length - 1}
                                icon={<MdOutlinePlayArrow className='icon-nav' />} />                   
                              </div>
                              <img className="card-selected-img-mobile"
                                              src={cardsSelectedUnit[cardNumber].image && cardsSelectedUnit[cardNumber].image.startsWith('/uploads/') ? `https://mtg-spring.onrender.com${cardsSelectedUnit[cardNumber].image}` : cardsSelectedUnit[0].image} alt="Card mtg"/>
                              <div className='cards-deck-unit-container'> 
                                {cardsSelectedUnit.length > 0 && (
                                  <div className="land-text-details" id='land-card' key={cardsSelectedUnit[cardNumber].id}>
                                    { format !== "COMMANDER" && (
                                    <div className='land-text-number'>                              
                                      <button className="add-button-deckbuilding" style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => unselectCard(cardsSelectedUnit[cardNumber])}
                                      disabled={lessCard(cardsSelectedUnit[cardNumber])} >
                                     <AiOutlineMinusCircle className="icon-add-card-form" size={'2em'} color={'black'} />
                                      </button> 
                                      <p className='p-card-length' style={{ fontWeight: 'bold' }}> {cardsSelected.filter(cardSelected => cardSelected.id === cardsSelectedUnit[cardNumber].id).length}</p>
                                      <button className="add-button-deckbuilding" disabled={count(cardsSelectedUnit[cardNumber]) > 3} style={{ backgroundColor: 'transparent', border: 'none'}}
                                       onClick={() => selectCard(cardsSelectedUnit[cardNumber])} ><CgAdd className="icon-add-card-form" size={'2em'} color={'black'} />
                                      </button> 
                                      </div>
                                    )}
                                  <TiDeleteOutline className='delete-card-button-form' style={{marginTop: '2%'}}
                                  color='red' size={'4em'} onClick={()=>unselectCards(cardsSelectedUnit[cardNumber])} />
                                  </div>
                                )}
                                
                              </div>
                            </div>
                            
                              <button className='valid-popup' style={{padding : '2%'}}>
                                <h4 className='valid-popup-title' onClick={() => addCards()}>Ajouter au deck</h4>
                              </button>
                        </div>

                      <div className='icon-close-popup-container-desktop'>
                        <CgCloseO className='icon-close-popup' color='white' size={'5em'}  onClick={()=>(setDisplayPopup(false), setCardNumber(0))}/>
                      </div>
                      
                      <div className='icon-close-popup-container-mobile'>
                        <CgCloseO className='icon-close-popup' color='white' size={'3em'}  onClick={()=>(setDisplayPopup(false), setCardNumber(0))}/> 
                      </div>
              </div>
            )}

          </div>

            <div className='footer-section'></div> 
                

  </Section>
        )
}

export default CardsDeckPage;