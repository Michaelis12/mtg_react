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
import loading from "../assets/loading.gif"
import Section from '../components/sectionMap';
import Title from '../components/title';
import OpenButton from '../components/openButton';
import OpenButtonLarge from '../components/openButtonLarge';
import SearchBar from '../components/searchBar';
import InputManaCost from '../components/inputManaCoast';
import AddButton from '../components/addButton';
import ButtonValid from '../components/buttonValid';
import Card from '../model/CardApi';
import axios from "axios";
import axiosInstance from "../api/axiosInstance";
import "./css/CardsDeckPage.css";
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import colorless from "../assets/incolore-mtg.png"
import defaultImg from "../assets/mtg-card-back.jpg"
import { buildQuery } from '../utils/buildQuery';
import { getImageUrl } from '../utils/imageUtils';




const CardsDeckPage = () => { 
    const [cards, setCards] = React.useState([])
    const [detailsCard, setDetailsCard] = React.useState(null)
    const [cardsSelected, setCardsSelected] = React.useState([])
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.deckID;
    const  deckCards = location.state.cardsDesac
    const [deck, setDeck] = React.useState([])
    const [deckColors, setDeckColors] = React.useState([])
    const [format, setFormat] = React.useState([])
    const [editions, setEditions] = React.useState([])

    // Mobile filters toggle (inspired by CardsPage)
    const [arrowFiltersSens, setArrowFiltersSens] = React.useState(<SlArrowDown/>);
    const [displayFilters, setDisplayFilters] = React.useState(false);
    const OpenFilters = () => {
      setArrowFiltersSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
      setDisplayFilters(!displayFilters);
    };
    const [cardImage, setCardImage] = React.useState(defaultImg)

    // Filtre recherche
    const [name, setName] = React.useState("")
    const [filterName, setFilterName] = React.useState("")
    const [text, setText] = React.useState("")
    const [filterText, setFilterText] = React.useState("")
    const [inputManaCostMin, setInputManaCostMin] = React.useState("")
    const [inputManaCostMax, setInputManaCostMax] = React.useState("")
    const [filterColors, setFilterColors] = React.useState([])
    const [filterRarities, setFilterRarities] = React.useState([])
    const [filterEditions, setFilterEditions] = React.useState([])
    const [filterTypes, setFilterTypes] = React.useState([])
    const [filterLegendary, setFilterLegendary] = React.useState(null)
    const [displayLoading, setDisplayLoading] = React.useState(false);
    // États pour la pagination
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
/*
     const callColors = useRef(false)
     const recupStorageColors = (response) => {
        try {

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
*/

    // Renvoie les attributs du deck sélectionné 
    useEffect(() => {
        const getDeckSelected = async () => {
            try {
                setDisplayLoading(true);



                const stored = sessionStorage.getItem('filterColors');
                const request = await axiosInstance.get(`f_all/getDeckID?deckID=${id}`);

                const response = request.data
    
                setDeck(response)
                    
                // Sert à mapper les colors pour le filtre
                
                setDeckColors(response.colors)
                

                setFormat(response.format);

            }   
            catch (error) {
                console.log(error);
            }
            finally {
              setDisplayLoading(false);
            }

    
        }
        getDeckSelected();
        }, [id]);
 



  // Récupère les cartes 
  const getCards = async () => {
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
                    q: buildQuery(filterName, filterText, inputManaCostMin, inputManaCostMax, filterColors, [format],
                                  filterRarities, filterTypes, filterLegendary, filterEditions, deckColors
                    ),
                    page: 1
                  };

                  
                  const response = await axios.get('https://api.scryfall.com/cards/search', {
                    params,
                    paramsSerializer: {
                      indexes: null 
                    }
                  });

                  const listCards = response.data.data.map(cardData => Card.fromApi(cardData));
                  setCards(listCards)
                  setHasMore(response.data.has_more);
                  setPage(2);
                  setDisplayLoading(false);
                  
              }   
              catch (error) {
                  setCards([])
                  setHasMore(false)
                  setDisplayLoading(false);
                  console.log(error);
              }
  
      
          }
          React.useEffect(() => {
            getCards();
        }, [ deck, filterName, filterText, inputManaCostMin, inputManaCostMax, filterColors, 
            filterRarities, filterEditions, filterTypes, filterLegendary]);
  
      
      // Charge plus de cartes pour la pagination
  
      const displayMoreCards = async () => {
   
         try {
            setDisplayLoading(true);
  
            const params = {
                    q: buildQuery(filterName, filterText, inputManaCostMin, inputManaCostMax, filterColors, deck.format, 
                                  filterRarities, filterTypes, filterLegendary, filterEditions
                    ),
                    page: page
                  };
  
  
                  
            const response = await axios.get('https://api.scryfall.com/cards/search', {
                    params,
                    paramsSerializer: {
                      indexes: null 
                  }
            });
                  
                  
            const listCards = response.data.data.map(cardData => Card.fromApi(cardData));
  
            setCards(prevCards => [...prevCards, ...listCards])
            setHasMore(response.data.has_more);
            setPage(page + 1)
  
        } catch (error) {
          console.error('Erreur de chargement des cartes :', error);
        } finally {
          setDisplayLoading(false);
        }
      }

        // Naviguer vers une carte depuis id
        const navCard = (id) => {     
          sessionStorage.setItem('cardsSelected', JSON.stringify(cardsSelected));
          sessionStorage.setItem('filterName', JSON.stringify(filterName));
          sessionStorage.setItem('filterText', JSON.stringify(filterText));
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
              const inputManaCostMin = sessionStorage.getItem('inputManacostMin');
              const inputManaCostMax = sessionStorage.getItem('inputManaCostMax');
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
              if (inputManaCostMin) {
                  setInputManaCostMin(JSON.parse(inputManaCostMin));
                  sessionStorage.removeItem('inputManacostMin');
              }
              if (inputManaCostMax) {
                  setInputManaCostMin(JSON.parse(inputManaCostMax));
                  sessionStorage.removeItem('inputManaCostMax');
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

        
        
        // Zoomer sur une carte
        const hoveredCard = (id) => {
         setDetailsCard({ id });

          }



         // Affiche le bouton de la searchbar name
          const displayResetName = () => {
               if(filterName === "") {
                 return 'none'
               }
            }

        // Affiche le bouton de la searchbar text
          const displayResetText = () => {
               if(filterText === "") {
                 return 'none'
               }
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
        
                            
                  const selectRarities = (newRarity) => {
                    setFilterRarities((prevRarities) => {
                      const rarityArray = Array.isArray(prevRarities)
                        ? prevRarities
                        : typeof prevRarities === 'string'
                          ? prevRarities.split(',').filter(r => r.trim() !== '')
                          : [];
        
                      if (rarityArray.includes(newRarity)) {
                        // Si la rareté est déjà sélectionnée, on la retire
                        return rarityArray.filter(rarity => rarity !== newRarity);
                      } else {
                        // Sinon on l’ajoute
                        return [...rarityArray, newRarity];
                      }
                    });
                  };
        
        
                  const removeRarities = () => {
                    setFilterRarities([])
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
                
        
                // Affiche le filtre des couleurs
                const OpenFilterColor = () => {
                      setArrowColorSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
                      setDisplayFilterColors(!displayFilterColors)  
                      
                    
                                         }
                const selectColors = (newColor) => {
                  setFilterColors((prevColors) => {
                    const colorsArray = Array.isArray(prevColors)
                      ? prevColors
                      : typeof prevColors === 'string'
                        ? prevColors.split(',').filter(c => c.trim() !== '')
                        : [];
        
                    // Si on clique sur "colorless"
                    if (newColor === "colorless") {
                      if (colorsArray.includes("colorless")) {
                        // Retirer "colorless"
                        return colorsArray.filter(color => color !== "colorless");
                      } else {
                        // Ajouter "colorless" et retirer toutes les autres couleurs
                        return ["colorless"];
                      }
                    }
        
                    // Si on clique sur une couleur normale
                    if (colorsArray.includes(newColor)) {
                      // La retirer
                      return colorsArray.filter(color => color !== newColor);
                    } else {
                      // Ajouter la couleur, en retirant "colorless" s'il est présent
                      return [...colorsArray.filter(color => color !== "colorless"), newColor];
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
                              if(value === "colorless") {
                                  return colorless
                              }
                             
                          };
                  
                  // Refiltre selon toutes les couleurs du deck
                  const removeColors = () => {
                   setFilterColors([])
                  } 
        

              // Récupère tous les types pour les mapper
        
              const [arrowTypeSens, setArrowTypeSens] = React.useState(<SlArrowDown/>)
              const [displayFilterTypes, setDisplayFilterTypes] = React.useState(false)
              
              // Affiche le filtre des types
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
        
        
        const selectTypes = (newType) => {
          setFilterTypes((prevTypes) => {
            const typeArray = Array.isArray(prevTypes)
              ? prevTypes
              : typeof prevTypes === 'string'
                ? prevTypes.split(',').filter(t => t.trim() !== '')
                : [];
        
            if (typeArray.includes(newType)) {
              // Si le type est déjà sélectionné, on le retire
              return typeArray.filter(type => type !== newType);
            } else {
              // Sinon on l’ajoute
              return [...typeArray, newType];
            }
          });
                };
        
        const removeTypes = () => {
          setFilterTypes([])
        }
        
        
        // Filtre légendaire
        
        const [arrowLegendarySens, setArrowLegendarySens] = React.useState(<SlArrowDown/>)
        const [displayFilterLegendary, setDisplayFilterLegendary] = React.useState(false)
        
        
        // Affiche le filtre des éditions
        const OpenFilterLegendary = () => {
                    setArrowLegendarySens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
                    setDisplayFilterLegendary(!displayFilterLegendary)                     
                                       }
        
        // Filtre éditions
        
        const [arrowEditionSens, setArrowEditionSens] = React.useState(<SlArrowDown/>)
        const [displayFilterEditions, setDisplayFilterEditions] = React.useState(false)
        
        
        
        const selectEditions = (newEdition) => {
                setFilterEditions((prevEditions) => {
                  const editionArray = Array.isArray(prevEditions)
                    ? prevEditions
                    : typeof prevEditions === 'string'
                      ? prevEditions.split(',').filter(e => e.trim() !== '')
                      : [];
        
                  if (editionArray.includes(newEdition)) {
                    // Si l'édition est déjà sélectionnée, on la retire
                    return editionArray.filter(edition => edition !== newEdition);
                  } else {
                    // Sinon on l’ajoute
                    return [...editionArray, newEdition];
                  }
                });
        };
        
        
        
        // Affiche le filtre des éditions
        const OpenFilterEdition = () => {
                            setArrowEditionSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
                            setDisplayFilterEditions(!displayFilterEditions)                     
        }
              
        
               useEffect(() => {
                    const getEditions = async () => {
                        try {
                            const request = await axios.get(`https://api.scryfall.com/sets`);
        
                            const response = request.data.data
                
                            setEditions(response)
        
                        }   
                        catch (error) {
                            console.log(error);
                        }
                    }
                    getEditions();
                    }, []);


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
                setDisplayLoading(true);

                 // On transforme les cartes sélectionnées pour correspondre au modèle backend
                const payload = cardsSelected.map(card => ({
                    apiID: card.id,          
                    name: card.name,
                    image: card.image,
                    manaCost: card.manaCost,
                    cmc: card.cmc,
                    colors: card.colors,  
                    types: card.types,
                    formats: card.formats,
                    legendary: card.legendary || false,
                    decksNumber: card.decksNumber || 0
                }));


                
                const response = await axiosInstance.post(`f_user/addCardsOnDeck?deckId=${id}`, payload, { withCredentials: true });
                const data = id
                navigate(`/deckbuilding`, { state: { deckID: data }})
                
                
                 }   
            catch (error) {
                console.log(error); 
            }
            finally {
              setDisplayLoading(false);
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

                      // On parcourt les cartes sélectionnées et on ne garde qu'une seule par ID
                      cardsSelected.forEach(card => {
                        if (!unitsCardsMap.has(card.id)) {
                          unitsCardsMap.set(card.id, card);
                        }
                      });

                      // On récupère uniquement les valeurs uniques (les cartes)
                      const listUnitCards = Array.from(unitsCardsMap.values());

                      setCardsSelectedUnit(listUnitCards);

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
            { displayLoading && (
                <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
            )}

            <img src={backgroundCardsPage} className="background-image" alt="background" />
            
            <OpenButtonLarge  text="Afficher les filtres" icon={arrowFiltersSens} onClick={OpenFilters}/>

            <div className="search-line">            
              <SearchBar value={name} onChange={(event) => (setName(event.target.value))}
              style={{position : "relative", width: '80%'}}
              onClick={() => (setFilterName(name))} placeholder={" Chercher une carte"}
              onPush={() => (setName(""), setFilterName(""))} iconStyle={{ display: displayResetName(), position: 'absolute', marginLeft: '75%' }} />

              <SearchBar value={text}  onChange={(event) => (setText(event.target.value))}
                style={{position : "relative", width: '80%', marginBottom: '30px'}}
                onClick={() => (setFilterText(text))} placeholder={" Chercher le texte d'une carte"}
                onPush={() => (setText(""), setFilterText(""))}
                iconStyle={{ display: displayResetText(), position: 'absolute', marginLeft: '75%'  }} />
            </div>

            {/*Les filtres pour la requete de carte*/}
            <div className="filters-line">
                
                
                <div className="filter-manaCost-container">
                                  <OpenButton text="Filtrer par cout en mana" icon={arrowManaCostSens} onClick={OpenFilterManaCost} />
                                  {displayFilterManaCost && (
                                  <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                                    <InputManaCost style={{width: '150px'}}  value={inputManaCostMin}
                                      onChange={(event) => (setInputManaCostMin(event.target.value))} placeholder={"min"}/>
                                    <InputManaCost style={{width: '150px'}} value={inputManaCostMax}
                                    onChange={(event) => (setInputManaCostMax(event.target.value))} placeholder={"max"}/>
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

                          {deckColors.map((color, index) => (
                            <li className="li-checkbox" key={index}>
                              <input
                                className='component-input'
                                type="checkbox"
                                name={color}
                                value={color}
                                onChange={(event) => selectColors(event.target.value)}
                                checked={filterColors.includes(color) && !filterColors.includes("colorless")}
                              />
                              <img src={getColorPics(color)} className="filter-color-img" alt={color}/>
                            </li>
                          ))}
                          <li className="li-checkbox">
                              <input
                                className='component-input'
                                type="checkbox"
                                name="colorless"
                                value="colorless"
                                onChange={(event) => selectColors(event.target.value)}
                                checked={filterColors.includes("colorless")}
                              />
                              <img src={getColorPics("colorless")} className="filter-color-img" alt="colorless"/>
                            </li>

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

                <div className="filter-editions-container" >
                  <OpenButton text="Filtrer par édition" icon={arrowEditionSens} onClick={OpenFilterEdition} />
                  { displayFilterEditions && ( 
                    <div className='add-card-filter-container' style={{zIndex: filterZIndex--}} >
                      {editions.map((edition, index) => (
                          <li className="li-checkbox" key={index}>
                            <input
                              className='component-input'
                              type="checkbox"
                              name={edition.name}
                              value={edition.code}
                              onChange={(event) => selectEditions(event.target.value)}
                              checked={filterEditions.includes(edition.code)}
                            />
                            <p
                              className='checkbox-type-p'
                              style={{ margin: '0px' }}
                            >
                              {edition.name}
                            </p>
                          </li>
                        ))}
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
                              "Battle",
                              "Conspiracy",
                              "Tribal",
                              "Vanguard",
                              "Artifact Creature",
                              "Enchantment Creature",
                              "Artifact Land"
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

                <div className="filter-legendary-container">
                <OpenButton
                  text="Filtrer les légendaires"
                  icon={arrowLegendarySens}
                  onClick={OpenFilterLegendary}
                />

                {displayFilterLegendary && (
                  <div className='add-card-filter-container' style={{ zIndex: filterZIndex-- }}>
                    <div className="compenant-checkbox">
                      <div className="compenant-checkbox-map-large">

                          <li className="li-checkbox">
                            <input
                              className='component-input'
                              type="checkbox"
                              name="Legendary"
                              value="Legendary"
                              onChange={() => setFilterLegendary(!filterLegendary)}
                              checked={filterLegendary}
                            />
                            <p
                              className='checkbox-type-p'
                              style={{ margin: '0px' }}
                            >
                              LEGENDAIRE
                            </p>
                          </li>

                      </div>
                      <TbFilterCancel className='compenant-reset' onClick={() => setFilterLegendary("")}/>
                    </div>
                  </div>
                )}
                </div>
                   

            </div>
            
            {/*Titre d'affichage des cartes*/}
            <div className='title-cards-dispo-container'>
              <Title title='Cartes disponibles'/>
            </div>

          <div className='display-objects-section'>
              {/*Mapping des cartes*/}    
              <div className='map-cards-section'>
              
                {cards.map(card => ( 
                    <div className="cards-details" key={card.id}>                       

                      {/*Si le format est commander les cartes sont à l'unité*/} 
                      { deck.format === "commander" && ( 
                      <div className='classic-formats-deck-details'>
                        <img className="cards-img" src={card.image ? getImageUrl(card.image) : defaultImg} alt="Card-image" onClick={() => navCard(card.id)}
                        onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                        style={{opacity: desacCardsCedh(card.id)}} />                
                        <AddButton onClick={() => selectCardCedh(card)} style={{ backgroundColor: 'white', margin : '2%', border: 'none' }}
                            icon={changeIcon(card.id)}  disabled={deckCards.includes(card.id)}/>
                      </div>
                      )}

                      {/*Si la carte est légendaire elle est à l'unité également */} 
                      { deck.format !== "commander" && card.legendary && ( 
                      <div className='classic-formats-deck-details'>
                        <img className="cards-img" src={card.image ? getImageUrl(card.image) : defaultImg} alt="Card-image" onClick={() => navCard(card.id)}
                        onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                        style={{opacity: desacCardsCedh(card.id)}} /> 

                        {/*La présence de cartes dans le deck*/}
                       <div className="deck-presence-container">
                         <p className="p-cards-deck-length">présence dans le deck : {deckCards.filter(cardDeck => cardDeck === card.id).length}</p>
                         {cardsSelected.filter(cardDeck => cardDeck === card).length > 0 && (
                          <p className='p-card-add-length'>+ {cardsSelected.filter(cardDeck => cardDeck === card).length}</p>
                        )}                      
                       </div> 
                        
                                      
                        <AddButton onClick={() => selectCardCedh(card)} style={{ backgroundColor: 'white', margin : '2%', border: 'none' }}
                            icon={changeIcon(card.id)}  disabled={deckCards.includes(card.id)}/>
                      </div>
                      )}

                       {/*Sinon la carte peut etre ajoutée en jusqu'à 4 exemplaires */}
                      { deck.format !== "commander" && !card.legendary && (   
                                      
                      <div className='classic-formats-deck-details'>
                        <img className="cards-img" src={card.image ? getImageUrl(card.image) : defaultImg} alt="Card-image" onClick={() => navCard(card.id)}
                        onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                        style={{opacity: desacCardsDeck(card.id)}} />

                        
                      {/*La présence de cartes dans le deck*/}
                       <div className="deck-presence-container">
                         <p className="p-cards-deck-length">présence dans le deck : {deckCards.filter(cardDeck => cardDeck === card.id).length}</p>
                         {cardsSelected.filter(cardDeck => cardDeck === card).length > 0 && (
                          <p className='p-card-add-length'>+ {cardsSelected.filter(cardDeck => cardDeck === card).length}</p>
                        )}                      
                       </div>

                        {/*Le bouton + si la carte n'est pas encore dans le deck*/}
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
                    

                    {detailsCard && detailsCard.id === card.id && (
                    <img className="card-img-zoom" src={card.image ? getImageUrl(card.image) : defaultImg} alt="Card-image"/>
                    )}  
                </div>
                ))}
              
                <ButtonValid style={{position: 'fixed', bottom: '15px', right: '50px'}}
                onClick={()=>setDisplayPopup(true)} disabled={cardsSelected.length === 0} text={'+ ' + cardsSelected.length + ' cartes'}/>

                
                
              </div>
             
              {/*Bouton + de cartes*/} 
              { hasMore && (
              <button className='next-page-button' disabled={!hasMore} onClick={()=>displayMoreCards()}>Afficher plus</button> 
              )}

            {/*Popup ajout de cartes*/} 
            { displayPopup && (
              <div className='popup-bckg'>
                       <div className='popup-cards-selected' style={{ backgroundImage: `url(${backgroundPopup})`}} >
                                              <div className='header-popup-cards-selected'>
                                                  <h2><strong>Cartes sélectionnées ({cardsSelected.length})</strong></h2>
                                              </div>
                                              <div className='cards-selected-container'>
                                                <img className='card-add-img' src={cardImage && cardImage.startsWith('/uploads/') ? `http://localhost:8080${cardImage}` : cardImage} alt="deck-img" />
                                                <div className='cards-deck-unit-container'> 
                                                  {cardsSelectedUnit.map(card => ( 
                                                    <div className="land-text-details" id='land-card'  key={card.id}> 
                                                        <h5 className='land-text-name' onMouseEnter={() => setCardImage( card.image ? card.image :  defaultImg)} >{card.name}</h5>
                                                      { format !== "commander" && !card.legendary && (
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
                                                        <img className="card-img-zoom" src={card.image && card.image.startsWith('/uploads/') ? `http://localhost:8080${card.image}` : card.image} alt="Card-image"/>
                                                        )} 
                                                    </div>
                                            
                                                  ))}  
                                              </div>
                                              </div>                                       
                                                <div className='valid-popup-container'>                                   
                                                  <button className='valid-popup' disabled={displayLoading}>
                                                      <h4 className='valid-popup-title' onClick={() => addCards()}>Ajouter au deck</h4>
                                                  </button>
                                                </div>
                       </div> 
                      {/*
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
                                              src={cardsSelectedUnit[cardNumber].image && cardsSelectedUnit[cardNumber].image.startsWith('/uploads/') ? `http://localhost:8080${cardsSelectedUnit[cardNumber].image}` : cardsSelectedUnit[0].image} alt="Card mtg"/>
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
                            
                              <button className='valid-popup' style={{padding : '2%'}} disabled={displayLoading}>
                                <h4 className='valid-popup-title' onClick={() => addCards()}>Ajouter au deck</h4>
                              </button>
                        </div>
                      */}

                      <div className='icon-close-popup-container-desktop'>
                        <CgCloseO className='icon-close-popup' color='white' size={'5em'}  onClick={()=>(setDisplayPopup(false), setCardNumber(0), setCardImage(defaultImg))}/>
                      </div>
                      
                      <div className='icon-close-popup-container-mobile'>
                        <CgCloseO className='icon-close-popup' color='white' size={'3em'}  onClick={()=>(setDisplayPopup(false), setCardNumber(0),  setCardImage(defaultImg))}/> 
                      </div>
              </div>
            )}

          </div>

            <div className='footer-section'></div> 
                

  </Section>
        )
}

export default CardsDeckPage;
