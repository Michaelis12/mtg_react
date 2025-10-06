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
import SearchBar from '../components/searchBar';
import InputValue from '../components/inputValue';
import InputManaCost from '../components/inputManaCoast';
import Checkbox from '../components/checkbox';
import CheckboxColor from '../components/checkboxColor';
import CheckboxRarity from '../components/checkboxRarity';
import CheckboxEdition from '../components/checkboxEdition';
import FooterSection from '../components/footerSection';
import Card from '../model/CardApi';
import axios from "axios";
import axiosInstance from '../api/axiosInstance';
import "./css/CardsPage.css";
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import incolore from "../assets/incolore-mtg.png" 
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
    const [inputManaCost, setInputManaCost] = React.useState("")
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
    const [pageSize, setPageSize] = useState(50);
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
                /*
                if (filterEditions.length <1 || filterRarities.length <1 || filterColors.length <1
                    || filterFormats.length <1 || filterTypes.length <1
                ) {
                    setDisplayLoading(false);
                    return;
                }
                */

                // Contient les RequestParams de la requete
                const params = {
                    page: 1,                
                    pageSize: pageSize,  
                    name: filterName,
                    text : filterText,
                    cmc : inputManaCost,
                    rarity : filterRarities,
                    type : filterTypes,
                    colors: filterColors                
                };
                
                const response = await axios.get('https://api.magicthegathering.io/v1/cards', {
                  params,
                  paramsSerializer: {
                    indexes: null 
                }
                });

                
                const listCards = response.data.cards.map(cardData => Card.fromApi(cardData));
                
                // Crée un Set pour stocker les noms uniques
                const seenNames = new Set();

                // Filtre pour ne garder que les cartes dont le nom n'est pas déjà présent
                const listCardsUnit = listCards.filter(card => {
                  if (seenNames.has(card.name)) {
                    return false; // ignore si le nom existe déjà
                  } else {
                    seenNames.add(card.name);
                    return true; // garde la carte
                  }
                });
                 
                setCards(listCardsUnit)
                setPage(2);
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
      }, [ displayCards, filterName, filterText, inputValueMin, inputValueMax, inputManaCost,
         filterColors, filterFormats, filterRarities, filterEditions, filterTypes, filterLegendary]);


    const displayMoreCardsWithID = async () => {
 
       try {
          setIsLoading(true);

          // Contient les RequestParams de la requete
          // Contient les RequestParams de la requete
                const params = {
                    page: 1,                
                    pageSize: pageSize,  
                    name: filterName,
                    text : filterText,
                    cmc : inputManaCost,
                    rarity : filterRarities,
                    type : filterTypes,
                    colors: filterColors                   
                    
                };
                
          const response = await axios.get('https://api.magicthegathering.io/v1/cards', {
                  params,
                  paramsSerializer: {
                    indexes: null 
                }
          });

                
          const newCards = response.data.cards.map(cardData => Card.fromApi(cardData));

          // Crée un Set pour stocker les noms uniques
                const seenNames = new Set();

                // Filtre pour ne garder que les cartes dont le nom n'est pas déjà présent
                const newCardsUnit = newCards.filter(card => {
                  if (seenNames.has(card.name)) {
                    return false; // ignore si le nom existe déjà
                  } else {
                    seenNames.add(card.name);
                    return true; // garde la carte
                  }
                });

          setCards(prevCards => [...prevCards, ...newCardsUnit]);
          setPage(page + 1)

      } catch (error) {
        console.error('Erreur de chargement des cartes :', error);
      } finally {
        setIsLoading(false);
      }
    }

 


        // Naviguer vers une carte depuis id
        const navCard = (id) => {

          sessionStorage.setItem('cpFilterName', JSON.stringify(filterName));
          sessionStorage.setItem('cpFilterText', JSON.stringify(filterText));
          sessionStorage.setItem('cpInputValueMin', JSON.stringify(inputValueMin));
          sessionStorage.setItem('cpInputValueMax', JSON.stringify(inputValueMax));
          sessionStorage.setItem('cpInputManacost', JSON.stringify(inputManaCost));
          sessionStorage.setItem('cpFilterColors', JSON.stringify(filterColors));
          sessionStorage.setItem('cpFilterFormats', JSON.stringify(filterFormats));
          sessionStorage.setItem('cpFilterTypes', JSON.stringify(filterTypes));
          sessionStorage.setItem('cpFilterLegendary', JSON.stringify(filterLegendary));
          sessionStorage.setItem('cpFilterRarities', JSON.stringify(filterRarities));
          sessionStorage.setItem('cpFilterEditions', JSON.stringify(filterEditions));

          const cardsIds = cards.map(card => card.id);
          navigate(`/cardSelectedApi`, { state: { cardID: id, ListCard: cardsIds }})
        };


        // Récupère le contenu depuis le storage si l'user revient de cardSelected
              useEffect(() => {
              const recupStorage = () => {
                  try {
                      const filterName = sessionStorage.getItem('cpFilterName');
                      const filterText = sessionStorage.getItem('cpFilterText');
                      const inputValueMin = sessionStorage.getItem('cpInputValueMin');
                      const inputValueMax = sessionStorage.getItem('cpInputValueMax');
                      const inputManaCost = sessionStorage.getItem('cpInputManacost');
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
                      if (inputManaCost) {
                          setInputManaCost(JSON.parse(inputManaCost));
                          sessionStorage.removeItem('cpInputManacost');
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
          setInputManaCost("")
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
          return "transparent"; 
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

              {/*Les filtres pour la requete de carte*/}
              <div className="filters-line">
                
                
                <div className="filter-manaCost-container">
                  <OpenButton text="Filtrer par cout en mana" icon={arrowManaCostSens} onClick={OpenFilterManaCost} />
                  {displayFilterManaCost && (
                  <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                    <InputManaCost style={{width: '150px'}}  value={inputManaCost}
                      onChange={(event) => (setInputManaCost(event.target.value))} placeholder={"exemple : 5"}/>
                    <TbFilterCancel className='compenant-reset' onClick={()=> ResetFilterManaCost()} />
                  </div>
                  )}
                </div>

                <div className="filter-colors-container">
                <OpenButton text="Filtrer par couleur" icon={arrowColorSens} onClick={OpenFilterColor} />
                  {displayFilterColors && (
                    <div className='add-card-filter-container' style={{ zIndex: filterZIndex-- }}>
                      <div className="compenant-checkbox">
                        <div className="compenant-checkbox-map-large">

                          {[
                            { value: "W"},
                            { value: "U"},
                            { value: "B"},
                            { value: "R"},
                            { value: "G"}
                          ].map((color, index) => (
                            <li className="li-checkbox" key={index}>
                              <input
                                className='component-input'
                                type="checkbox"
                                name={color.value}
                                value={color.value}
                                onChange={(event) => selectColors(event.target.value)}
                                checked={filterColors.includes(color.value)}
                              />
                              <img src={getColorPics(color.value)} className="filter-color-img" alt={color}/>
                            </li>
                          ))}

                        </div>
                        <TbFilterCancel className='compenant-reset' onClick={removeColors}/>
                      </div>
                    </div>
                  )}
                </div>

             
                <div className="filter-rarities-container">
                <OpenButton
                  text="Filtrer par rareté"
                  icon={arrowRaritiesSens}
                  onClick={OpenFilterRarities}
                />

                {displayFilterRarities && (
                  <div className='add-card-filter-container' style={{ zIndex: filterZIndex-- }}>
                    <div className="compenant-checkbox">
                      <div className="compenant-checkbox-map-large">

                        {[
                          { value: "mythic", label: "MYTHIQUE" },
                          { value: "rare", label: "RARE" },
                          { value: "uncommon", label: "UNCO" },
                          { value: "common", label: "COMMUNE" }
                        ].map((rarity, index) => (
                          <li className="li-checkbox" key={index}>
                            <input
                              className='component-input'
                              type="checkbox"
                              name={rarity.value}
                              value={rarity.value}
                              onChange={(event) => selectRarities(event.target.value)}
                              checked={filterRarities.includes(rarity.value)}
                            />
                            <p
                              className='checkbox-rarity-p'
                              style={{ background: getBackgroundColor(rarity.value), margin: '0px' }}
                            >
                              {rarity.label}
                            </p>
                          </li>
                        ))}

                      </div>
                      <TbFilterCancel className='compenant-reset' onClick={removeRarities}/>
                    </div>
                  </div>
                )}
                </div>

                    
                <div className="filter-types-container">
                  <OpenButton text="Filtrer par type" icon={arrowTypeSens} onClick={OpenFilterType} />
                  {displayFilterTypes && (
                    <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                      <div className="compenant-checkbox">
                          <div className="compenant-checkbox-map-large">
                            {[
                              "Artifact",
                              "Creature",
                              "Enchantment",
                              "Instant",
                              "Land",
                              "Planeswalker",
                              "Sorcery",
                              "Tribal",
                              "Vanguard"
                            ].map((type, index) => (
                              <li className="li-checkbox" key={index}>
                                <input
                                  className='component-input'
                                  type="checkbox"
                                  name={type}
                                  value={type}
                                  onChange={(event) => selectTypes(event.target.value)}
                                  checked={filterTypes.includes(type)}
                                />
                                <p style={{margin: '0px'}} className='checkbox-type-p'>{type.toUpperCase()}</p>
                              </li>
                            ))}
                            
                          </div>
                          <TbFilterCancel className='compenant-reset' onClick={removeTypes}/>
                    </div>  
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
                    <InputManaCost style={{width: '150px'}}  value={inputManaCost}
                      onChange={(event) => (setInputManaCost(event.target.value))} placeholder={"exemple : 5"}/>

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
   
      <div className='display-objects-section'>
        
        {/* affichage cartes */}
          <div className='map-cards-section'>
                {cards.map(card => ( 
                    <div className="cards-details" key={card.id} style={{display:(maskBaseLand(card.id))}}>
                        <img className="cards-img" src={getImageUrl(card.image)} alt="Card-image" onClick={() => navCard(card.id)}
                        onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                        />
                

                    {detailsCard && detailsCard.id === card.id && (
                    <img className="card-img-zoom" src={getImageUrl(card.image)} alt="Card-image"/>
                    )}  
                </div>
                ))} 
                        
          </div>
              
      
      {/* Bouton pour afficher plus de cartes */}
      <button className='next-page-button' disabled={!hasMore} onClick={()=>displayMoreCardsWithID()}>Afficher plus</button> 

      </div>


      
      <FooterSection/>       

  </Section>
        )
}

export default CardsPage;
