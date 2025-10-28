import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TbFilterCancel } from "react-icons/tb";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import backgroundCardsPage from "../assets/background_cardsPage2.jpg"
import Section from '../components/sectionMap';
import Title from '../components/title';
import OpenButtonLarge from '../components/openButtonLarge';
import OpenButton from '../components/openButton';
import SearchBar from '../components/searchBar';
import InputManaCost from '../components/inputManaCoast';
import FooterSection from '../components/footerSection';
import Card from '../model/CardApi';
import axios from "axios";
import "./css/CardsPage.css";
import defaultImg from "../assets/mtg-card-back.jpg"
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import colorless from "../assets/incolore-mtg.webp"
import loading from "../assets/loading.gif"
import { getImageUrl } from '../utils/imageUtils';
import { buildQuery } from '../utils/buildQuery';




const CardsPage = () => {
    const [cards, setCards] = React.useState([])
    const [detailsCard, setDetailsCard] = React.useState(null)
    const navigate = useNavigate();
    const [editions, setEditions] = React.useState([])


    // Filtre recherche
    const [name, setName] = React.useState("")
    const [filterName, setFilterName] = React.useState("")
    const [text, setText] = React.useState("")
    const [filterText, setFilterText] = React.useState("")
    const [inputManaCostMin, setInputManaCostMin] = React.useState("")
    const [inputManaCostMax, setInputManaCostMax] = React.useState("")
    const [filterColors, setFilterColors] = React.useState([])
    const [filterFormats, setFilterFormats] = React.useState([])
    const [filterRarities, setFilterRarities] = React.useState([])
    const [filterEditions, setFilterEditions] = React.useState([])
    const [filterTypes, setFilterTypes] = React.useState([])
    const [filterLegendary, setFilterLegendary] = React.useState(false)
    const [displayLoading, setDisplayLoading] = React.useState(true);
        
    // États pour la pagination
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
 

    // Récupère la première page de cartes 
 
    const getCards = async (cancelToken) => {
    try {
        setDisplayLoading(true);

        const params = {
            q: buildQuery(filterName, filterText, inputManaCostMin, inputManaCostMax, filterColors, filterFormats, 
                         filterRarities, filterTypes, filterLegendary, filterEditions),
            page: 1
        };

        const response = await axios.get('https://api.scryfall.com/cards/search', {
            params,
            cancelToken
        });

        const listCards = response.data.data.map(cardData => Card.fromApi(cardData));
        setCards(listCards);
        setHasMore(response.data.has_more);
        setPage(2);
        setDisplayLoading(false);

    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            setCards([]);
            setHasMore(false);
            setDisplayLoading(false);
            console.log(error);
        }
    }
};

React.useEffect(() => {
    const source = axios.CancelToken.source();
    getCards(source.token);

    return () => {
        source.cancel("Operation canceled due to new request.");
    };
}, [filterName, filterText, inputManaCostMin, inputManaCostMax, filterColors, 
    filterFormats, filterRarities, filterEditions, filterTypes, filterLegendary]);


    
    // Charge plus de cartes pour la pagination

    const displayMoreCards = async () => {
 
       try {
          setDisplayLoading(true);

          const params = {
                  q: buildQuery(filterName, filterText, inputManaCostMin, inputManaCostMax, filterColors, filterFormats, 
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

          sessionStorage.setItem('cpFilterName', JSON.stringify(filterName));
          sessionStorage.setItem('cpFilterText', JSON.stringify(filterText));
          sessionStorage.setItem('cpInputManacost', JSON.stringify(inputManaCostMin));
          sessionStorage.setItem('cpInputManacost', JSON.stringify(inputManaCostMax));
          sessionStorage.setItem('cpFilterColors', JSON.stringify(filterColors));
          sessionStorage.setItem('cpFilterFormats', JSON.stringify(filterFormats));
          sessionStorage.setItem('cpFilterTypes', JSON.stringify(filterTypes));
          sessionStorage.setItem('cpFilterLegendary', JSON.stringify(filterLegendary));
          sessionStorage.setItem('cpFilterRarities', JSON.stringify(filterRarities));
          sessionStorage.setItem('cpFilterEditions', JSON.stringify(filterEditions));

          const cardsIds = cards.map(card => card.id);
          navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
        };


        // Récupère le contenu depuis le storage si l'user revient de cardSelected
              useEffect(() => {
              const recupStorage = () => {
                  try {
                      const filterName = sessionStorage.getItem('cpFilterName');
                      const filterText = sessionStorage.getItem('cpFilterText');
                      const inputManaCostMin = sessionStorage.getItem('cpInputManacostMin');
                      const inputManaCostMax = sessionStorage.getItem('cpInputManacostMax');
                      const filterLegendary = sessionStorage.getItem('cpFilterLegendary');
                      const filterEditions = sessionStorage.getItem('cpFilterEditions');  
                      
                      if (filterName) {
                          setFilterName(JSON.parse(filterName));
                          sessionStorage.removeItem('cpFilterName');
                      }
                      if (filterText) {
                          setFilterText(JSON.parse(filterText));
                          sessionStorage.removeItem('cpFilterText');
                      }
                      if (inputManaCostMin) {
                          setInputManaCostMin(JSON.parse(inputManaCostMin));
                          sessionStorage.removeItem('cpInputManacostMin');
                      }
                      if (inputManaCostMax) {
                          setInputManaCostMin(JSON.parse(inputManaCostMax));
                          sessionStorage.removeItem('cpInputManacostMin');
                      }
                      if(filterLegendary) {
                          setFilterLegendary(JSON.parse(filterLegendary));
                          sessionStorage.removeItem('cpFilterLegendary');
                        }
                      if(filterEditions) {
                          setFilterEditions(JSON.parse(filterEditions));
                          sessionStorage.removeItem('cpFilterEditions');
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

        // Affiche les filtres au format mobile

        const [arrowFiltersSens, setArrowFiltersSens] = React.useState(<SlArrowDown/>)
        const [displayFilters, setDisplayFilters] = React.useState(false)
        
        // Affiche le filtre des formats
        const OpenFilters = () => {
              setArrowFiltersSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
              setDisplayFilters(!displayFilters)                     
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

                
      const selectFormats = (newFormat) => {
        setFilterFormats((prevFormats) => {
          const formatArray = Array.isArray(prevFormats)
            ? prevFormats
            : typeof prevFormats === 'string'
              ? prevFormats.split(',').filter(f => f.trim() !== '')
              : [];

          if (formatArray.includes(newFormat)) {
            // Si le format est déjà sélectionné, on le retire
            return formatArray.filter(format => format !== newFormat);
          } else {
            // Sinon on l’ajoute
            return [...formatArray, newFormat];
          }
        });
      };



      const removeFormats = () => {
          setFilterFormats(formats)
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
          setFilterTypes(types)
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

      // Refiltre selon toutes les couleurs du deck
          const removeEditions = () => {
           setFilterEditions([])
          } 




      // Affiche le filtre des éditions
      const OpenFilterEdition = () => {
                    setArrowEditionSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
                    setDisplayFilterEditions(!displayFilterEditions)                     
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
              <SearchBar value={name} onChange={(event) => (setName(event.target.value))}
              style={{position : "relative"}}
              onClick={() => (setFilterName(name))} placeholder={" Chercher une carte"}
              onPush={() => (setName(""), setFilterName(""))} iconStyle={{ display: displayResetName() }} />

              <SearchBar value={text}  onChange={(event) => (setText(event.target.value))}
                style={{position : "relative", marginBottom: '30px'}}
                onClick={() => (setFilterText(text))} placeholder={" Chercher le texte d'une carte"}
                onPush={() => (setText(""), setFilterText(""))}
                iconStyle={{ display: displayResetText()}} />
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

                          {[ 
                            { value: "W"},
                            { value: "U"},
                            { value: "B"},
                            { value: "R"},
                            { value: "G"},
                          ].map((color, index) => (
                            <li className="li-checkbox" key={index}>
                              <input
                                className='component-input'
                                type="checkbox"
                                name={color.value}
                                value={color.value}
                                onChange={(event) => selectColors(event.target.value)}
                                checked={filterColors.includes(color.value) && !filterColors.includes("colorless")}
                              />
                              <img src={getColorPics(color.value)} className="filter-color-img" alt={color}/>
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
                

                <div className="filter-formats-container">                 
                  <OpenButton
                    text="Filtrer par format"
                      icon={arrowFormatSens}
                    onClick={OpenFilterFormat}
                  />
                  {displayFilterFormats && (
                    <div className='add-card-filter-container' style={{ zIndex: filterZIndex-- }}>
                      <div className="compenant-checkbox">
                        <div className="compenant-checkbox-map-large">

                          {[
                            { value: "standard", label: "STANDARD" },
                            { value: "future", label: "FUTURE" },
                            { value: "historic", label: "HISTORIC" },
                            { value: "gladiator", label: "GLADIATOR" },
                            { value: "pioneer", label: "PIONEER" },
                            { value: "modern", label: "MODERN" },
                            { value: "legacy", label: "LEGACY" },
                            { value: "pauper", label: "PAUPER" },
                            { value: "vintage", label: "VINTAGE" },
                            { value: "commander", label: "COMMANDER" },
                            { value: "brawl", label: "BRAWL" },
                            { value: "alchemy", label: "ALCHEMY" },
                            { value: "duel", label: "DUEL" },
                            { value: "oldschool", label: "OLDSCHOOL" },
                            { value: "premodern", label: "PREMODERN" },
                            // ajoute ou enlève les formats que tu veux ici
                          ].map((format, index) => (
                            <li className="li-checkbox" key={index}>
                              <input
                                className='component-input'
                                type="checkbox"
                                name={format.value}
                                value={format.value}
                                onChange={(event) => selectFormats(event.target.value)}
                                checked={filterFormats.includes(format.value)}
                              />
                              <p className='checkbox-format-p' style={{ margin: '0px' }}>
                                {format.label}
                              </p>
                            </li>
                          ))}

                        </div>
                        <TbFilterCancel className='compenant-reset' onClick={removeFormats} />
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
                      <div className="compenant-checkbox">
                        <div className="compenant-checkbox-map-large" style={{width:"100%"}}>
                          {editions.map((edition, index) => (
                              <li className="li-checkbox" key={index} style={{width:"90%"}}>
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
                         <TbFilterCancel className='compenant-reset' onClick={removeEditions}/>
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

 
            
            <div className='title-cards-container'>
              <Title title='Cartes' />
            </div> 
   
      <div className='display-objects-section'>
        
        {/* affichage cartes */}
          <div className='map-cards-section'>
                {cards.map(card => ( 
                    <div className="cards-details" key={card.id}>
                        <img className="cards-img" src={card.image ? getImageUrl(card.image) : defaultImg} 
                        alt="Card-image" onClick={() => navCard(card.id)}
                        onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                        />
                

                    {detailsCard && detailsCard.id === card.id && (
                    <img className="card-img-zoom" src={card.image ? getImageUrl(card.image) : defaultImg} alt={card.name}/>
                    )}  
                </div>
                ))} 
                        
          </div>
              
      
      {/* Bouton pour afficher plus de cartes */}
      { hasMore && !displayLoading && (
        <button className='next-page-button' onClick={()=>displayMoreCards()}>Afficher plus</button> 
      )}

      </div>


      
      <FooterSection/>       

  </Section>
        )
}

export default CardsPage;
