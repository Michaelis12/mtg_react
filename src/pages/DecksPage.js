import React from 'react';
import { useEffect, useRef, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authContext"
import Section from '../components/sectionMap';
import OpenButtonLarge from '../components/openButtonLarge';
import Deck from '../model/Deck';
import Title from '../components/title';
import SearchBar from '../components/searchBar';
import InputValue from '../components/inputValue';
import InputManaCoast from '../components/inputManaCoast';
import Checkbox from '../components/checkbox';
import CheckboxColor from '../components/checkboxColor';
import IconButton from '../components/buttonIcon';
import OpenButton from '../components/openButton';
import ButtonSelect from '../components/buttonSelect';
import ParagraphLikeNumber from '../components/paragraphLikeNumber';
import DeckMap from '../components/deck';
import FooterSection from '../components/footerSection';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { TbFilterCancel } from "react-icons/tb";
import { FaHeart, FaRegHeart  } from 'react-icons/fa';
import backgroundCardsPage from "../assets/background_cardsPage3.jpg"
import backgroundWhite from "../assets/background_white.png"
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import incolore from "../assets/incolore-mtg.webp"
import axiosInstance from "../api/axiosInstance";
import loading from "../assets/loading.gif"
import { getDeckImageUrl } from '../utils/imageUtils';
import "./css/DecksPage.css";



const DecksPage = () => {
    const navigate = useNavigate();
    const [decks, setDecks] = React.useState([])
    const [topDecks, setTopDecks] = React.useState([])
    const [detailsDeck, setDetailsDeck] = React.useState(null)
    const [colors, setColors] = React.useState([])
    const [formats, setFormats] = React.useState([])
    const [deckLikedId, setDeckLikedId] = React.useState([])
    const { getCookie } = useContext(AuthContext);
    const [displayLoading, setDisplayLoading] = useState(false);

    // Filtre recherche
        const [name, setName] = React.useState("")
        const [filterName, setFilterName] = React.useState("")
        const [inputManaCostMin, setInputManaCostMin] = React.useState("")
        const [inputManaCostMax, setInputManaCostMax] = React.useState("")
        const [filterColors, setFilterColors] = React.useState([])
        const [filterFormats, setFilterFormats] = React.useState([])
        
        // États pour la pagination
        const [page, setPage] = React.useState(1);
        const [pageSize, setPageSize] = React.useState(20);
        const [totalPages, setTotalPages] = React.useState(0);
        const [totalElements, setTotalElements] = React.useState(0);
        const [hasMore, setHasMore] = useState(true);
        const [isLoading, setIsLoading] = useState(false);

        // États pour ajuster le nombre de likes des cartes
        const [newDeckLikedId, setNewDeckLikedId] = React.useState([])
        const [newDeckDislikedId, setNewDeckDislikedId] = React.useState([])

        //const [displayDecks, setDisplayDecks] = React.useState("date")
        const location = useLocation();
        const order = location.state?.order; 
        
        // Récupérer les decks triés par date
        useEffect(() => {
        const getDecks = async () => {
            try {
                setDisplayLoading(true);

                // Contient les RequestParams de la requete
                const params = {
                    page: 0,
                    size: pageSize,
                    order: order,
                    name: filterName,
                    manaCostMin : inputManaCostMin,
                    manaCostMax : inputManaCostMax,
                    colors: filterColors,
                    formats: filterFormats

                }; 


                const response = await axiosInstance.get('f_all/getDecks', {
                  params,
                  paramsSerializer: {
                    indexes: null // Cela désactive l'ajout des crochets
                }} );
    
                    const listDecks = response.data.content.map(
                        deck => new Deck (deck.id, deck.name, deck.dateCreation, deck.image, deck.format,
                            deck.colors, deck.manaCost, deck.value, deck.isPublic, deck.deckBuilder,
                            deck.deckBuilderName, deck.likeNumber, deck.cards, deck.commander
                ) )
                        
                setDecks(listDecks)
                setPage(1) 
                setTotalPages(response.data.totalPages)
                setTotalElements(response.data.totalElements)
                setHasMore(!response.data.isLast)
                setDisplayLoading(false)
            }   
            catch (error) {
                setDisplayLoading(false);
                console.log(error);
            }

    
        }
        getDecks();
        }, [filterName, inputManaCostMin, inputManaCostMax,
            filterColors, filterFormats]);


        const displayMoreDecks = async () => {
 
                        try {
                            setIsLoading(true);

                            const params = {
                                page: page,
                                size: pageSize,
                                order: order,
                                name: filterName,
                                colors: filterColors,
                                formats: filterFormats,
                                manaCostMin : inputManaCostMin,
                                manaCostMax : inputManaCostMax
                            };

                            const request = await axiosInstance.get(`f_all/getDecks`, {
                                    params,
                                    paramsSerializer: { indexes: null }
                                });

                            const newDecks = request.data.content.map(
                                    deck => new Deck (deck.id, deck.name, deck.dateCreation, deck.image, deck.format,
                                        deck.colors, deck.manaCost, deck.value, deck.isPublic, deck.deckBuilder,
                                        deck.deckBuilderName, deck.likeNumber, deck.cards, deck.commander
                            ) )

                            setDecks(prevDecks => [...prevDecks, ...newDecks]);

                        setHasMore(!request.data.isLast);
                        setPage(page + 1)
                        } catch (error) {
                        console.error('Erreur de chargement des decks :', error);
                        } finally {
                        setIsLoading(false);
                        }
                };
/*
        // Récupérer les decks triés par nb de likes
        useEffect(() => {
          const getDecksWithLikes = async () => {
                  setDisplayLoading(true)
                
                  try {
                      const params = {
                          page: 0,
                          size: pageSize,
                          order: "like",
                          name: filterName,
                          colors: filterColors,
                          formats: filterFormats,
                          manaCostMin : inputManaCostMin,
                          manaCostMax : inputManaCostMax
      
                      };
      
                      const response = await axiosInstance.get('f_all/getDecks', {
                      params,
                      paramsSerializer: {
                        indexes: null // Cela désactive l'ajout des crochets
                    }} );
          
                          const listDecks = response.data.content.map(
                              deck => new Deck (deck.id, deck.name, deck.dateCreation, deck.image, deck.format,
                                  deck.colors, deck.manaCost, deck.value, deck.isPublic, deck.deckBuilder,
                                  deck.deckBuilderName, deck.likeNumber, deck.cards, deck.commander
                      ) )
                              
                      setTopDecks(listDecks)
                      setPage(1) // Quand la méthode initiale est appelé on reinitialise la page à 1
                      setTotalPages(response.data.totalPages)
                      setTotalElements(response.data.totalElements)
                      setHasMore(!response.data.isLast)
                      setDisplayLoading(false)
                  }   
                  catch (error) {
                      setDisplayLoading(false);
                      console.log(error);
                  }
      
          
              }
              getDecksWithLikes();
              }, [displayDecks, deckLikedId, filterName, inputManaCostMin, inputManaCostMax,
                  filterColors, filterFormats]);


         const displayMoreDecksByLikes = async () => {
         
                                try {
                                    setIsLoading(true);
        
                                    const params = {
                                        page: page,
                                        size: pageSize,
                                        order: "like",
                                        name: filterName,
                                        colors: filterColors,
                                        formats: filterFormats,
                                        manaCostMin : inputManaCostMin,
                                        manaCostMax : inputManaCostMax
                                    };
        
                                    const request = await axiosInstance.get(`/f_all/getDecks`, {
                                            params,
                                            paramsSerializer: { indexes: null }
                                        });
        
                                    const newDecks = request.data.content.map(
                                            deck => new Deck (deck.id, deck.name, deck.dateCreation, deck.image, deck.format,
                                                deck.colors, deck.manaCost, deck.value, deck.isPublic, deck.deckBuilder,
                                                deck.deckBuilderName, deck.likeNumber, deck.cards, deck.commander
                                    ) )
        
                                    setTopDecks(prevDecks => [...prevDecks, ...newDecks]);
        
                                setHasMore(!request.data.isLast);
                                setPage(page + 1)
                                } catch (error) {
                                console.error('Erreur de chargement des decks :', error);
                                } finally {
                                setIsLoading(false);
                                }
                        };
      
        
        
        // Afficher les decks les plus likés
        const displayTopDecks = () => {
          setDisplayDecks("popularity")
        }

        // Afficher les decks les plus récents
        const displayDateDecks = () => {
          setDisplayDecks("date")
        }


          const getBgDate= () => {
            if(displayDecks==="date") {
              return '#1B1D40'
            } 
            else {
              return '#D3D3D3'
            }
           }

           const getBgTop= () => {
            if(displayDecks==="popularity") {
              return '#1B1D40'
            }
            else {
              return '#D3D3D3'
            }
           }

           const getColorDate= () => {
            if(displayDecks==="date") {
              return 'white'
            } 
            else {
              return 'black'
            }
           }

           const getColorTop= () => {
            if(displayDecks==="popularity") {
              return 'white'
            }
            else {
              return 'black'
            }
           }
  
*/       
        
        // Afficher les détails d'un deck
        const hoveredDeck = (id, name, format) => {
            setDetailsDeck({ id, name, format }); 
        }

        // Naviguer vers un deck
         const chooseDeck = (id) => {
          sessionStorage.setItem('dpFilterName', JSON.stringify(filterName));
          sessionStorage.setItem('dpInputManacostMin', JSON.stringify(inputManaCostMin));
          sessionStorage.setItem('dpInputManacostMax', JSON.stringify(inputManaCostMax));
          sessionStorage.setItem('dpFilterColors', JSON.stringify(filterColors));
          sessionStorage.setItem('dpFilterFormats', JSON.stringify(filterFormats));

          const deckIds = decks.map(deck => deck.id);
          navigate(`/deckSelected`, { state: { deckID: id, ListDeck: deckIds }})
               };

        // Naviguer vers un user
        const chooseUser = async (deckID) => { 

          try {
            setDisplayLoading(true);
            sessionStorage.setItem('dpFilterName', JSON.stringify(filterName));
            sessionStorage.setItem('dpInputManacostMin', JSON.stringify(inputManaCostMin));
            sessionStorage.setItem('dpInputManacostMax', JSON.stringify(inputManaCostMax));
            sessionStorage.setItem('dpFilterColors', JSON.stringify(filterColors));
            sessionStorage.setItem('dpFilterFormats', JSON.stringify(filterFormats));
                  
            const response = await axiosInstance.get(`f_all/getDeckUser?deckID=${deckID}` );

            navigate(`/userSelected`, { state: { userID: response.data }})
            setDisplayLoading(false);
            } 
          catch (error) {
            setDisplayLoading(false);
            console.log(error);
          }
        }
        
        // Récupère le contenu depuis le storage si l'user revient de deckSelected
                      useEffect(() => {
                      const recupStorage = () => {
                          try {
                              const filterName = sessionStorage.getItem('dpFilterName');
                              const inputValueMin = sessionStorage.getItem('dpInputValueMin');
                              const inputValueMax = sessionStorage.getItem('dpInputValueMax');
                              const inputManaCostMin = sessionStorage.getItem('dpInputManacostMin');
                              const inputManaCostMax = sessionStorage.getItem('dpInputManacostMax');
                               
                              if (filterName) {
                                  setFilterName(JSON.parse(filterName));
                                  sessionStorage.removeItem('dpFilterName');
                              }
                              if (inputManaCostMin) {
                                  setInputManaCostMin(JSON.parse(inputManaCostMin));
                                  sessionStorage.removeItem('dpInputManacostMin');
                              }
                              if (inputManaCostMax) {
                                  setInputManaCostMax(JSON.parse(inputManaCostMax));
                                  sessionStorage.removeItem('dpInputManacostMax');
                              }
                              
                              
                          } catch (error) {
                              console.error("Erreur lors de la récupération du sessionStorage :", error);
                          }
                      };
                
                      recupStorage();
                  }, []);
        
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

        

           // Méthode liker un deck
            const likeDeck = async (id) => {
                try {
                    setDisplayLoading(true);
                   await axiosInstance.post(`/f_user/likeDeck?deckId=${id}`, null, 
                   { withCredentials: true });          
                   setDeckLikedId(prevState => [...prevState, id]); 

                  if (newDeckDislikedId.includes(id)) {
                        // Si l'id est dans newDeckDislikedId, le retirer
                        setNewDeckDislikedId(prevState => prevState.filter(deckId => deckId !== id));
                    }
                    else {
                        setNewDeckLikedId(prevState => [...prevState, id]);
                    }

                   setDisplayLoading(false);
                }   
                catch (error) {
                    setDisplayLoading(false);
                    navigate(`/sign`);
                }
            };

            // Méthode disliker un deck
            const dislikeDeck = async (id) => {
                try {
                    setDisplayLoading(true);
                   await axiosInstance.delete(`/f_user/dislikeDeck?deckId=${id}`, { withCredentials: true });          
                   setDeckLikedId(prevState => prevState.filter(deckId => deckId !== id));
                   
                   if (newDeckLikedId.includes(id)) {
                        // Si l'id est dans newDeckDislikedId, le retirer
                     setNewDeckLikedId(prevState => prevState.filter(deckId => deckId !== id));
                    }
                    else {
                        setNewDeckDislikedId(prevState => [...prevState, id]);
                    }

                    setDisplayLoading(false);
                    }   
                catch (error) {
                    setDisplayLoading(false);
                    navigate(`/sign`);
                }
            };

            // Génère un like ou un dislike selon l'état de la carte
            const likeDislike = (id) => {

                    if (!deckLikedId.some(deckId => deckId === (id))) {
                        likeDeck(id);
                    }
                    else {
                        dislikeDeck(id);
                    }
            } 
            // Modifie la couleur de l'icone coeur après un like
            const hearthIcon = (id) => {
                if(!deckLikedId.some(deckId => deckId === (id))) {
                    return (<FaRegHeart className='deckspage-like-icon' size="2em" />)
                }
                else {
                    return (<FaHeart className='deckspage-like-icon' size="2em" color="red"/>)
                }
            }

            // Calcule le nombre de likes ajusté pour un deck (analogue à CardsPage)
            const getAdjustedLikeNumber = (deck) => {
              if (newDeckLikedId && newDeckLikedId.includes(deck.id)) return deck.likeNumber + 1;
              if (newDeckDislikedId && newDeckDislikedId.includes(deck.id)) return deck.likeNumber - 1;
              return deck.likeNumber;
            };

        // Affiche le bouton de la searchbar name
          const displayResetName = () => {
               if(filterName === "") {
                 return 'none'
               }
            }


        // Filtres mobile


        const [arrowFiltersSens, setArrowFiltersSens] = React.useState(<SlArrowDown/>)
        const [displayFilters, setDisplayFilters] = React.useState(false)
        
        const OpenFilters = () => {
          setArrowFiltersSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
          setDisplayFilters(!displayFilters)
        }


          // Filtre value

         const [arrowValueSens, setArrowValueSens] = React.useState(<SlArrowDown/>)
         const [displayFilterValue, setDisplayFilterValue] = React.useState(false)

         // Ouvrir le filtre value
         const OpenFilterValue = () => {
            setArrowValueSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
            setDisplayFilterValue(!displayFilterValue)
         }


         // Filtre manaCost

         const [arrowManaCostSens, setArrowManaCostSens] = React.useState(<SlArrowDown/>)
         const [displayFilterManaCost, setDisplayFilterManaCost] = React.useState(false)

         // Ouvrir le filtre manaCost
         const OpenFilterManaCost = () => {
          setArrowManaCostSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
          setDisplayFilterManaCost(!displayFilterManaCost)
         }

         // Reset le filtre manaCost
        const ResetFilterManaCost = () => {
            setInputManaCostMin("")
            setInputManaCostMax("")
          }

         // Filtre colors

         const [arrowColorSens, setArrowColorSens] = React.useState(<SlArrowDown/>)
         const [displayFilterColors, setDisplayFilterColors] = React.useState(false)


        const callColors = useRef(false);
                
                      // Récupère les rarities dans le storage si l'user vient de cardSelected
        const recupStorageColor = (response) => {
                      try {
                
                          if (callColors.current) return;
                        
                          const stored = sessionStorage.getItem('dpFilterColors');
                
                            if (stored) {
                                
                                setFilterColors(JSON.parse(stored));
                                sessionStorage.removeItem('dpFilterColors');
                                callColors.current = true;
                            } else {
                                setFilterColors(response);
                                
                            }
                    } catch (error) {
                        console.error("Erreur lors de la récupération du sessionStorage :", error);
                    }
        };


         // Ouvrir le filtre colors 
         const OpenFilterColor = () => {
            setArrowColorSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
            setDisplayFilterColors(!displayFilterColors)                     
         }              
          
         // Sélectionner le filtre colors
         const selectColors = (newColor) => {
            setFilterColors(prevColors => {
              const colorsArray = Array.isArray(prevColors) ? prevColors : (prevColors || '').split(',').filter(color => color.trim() !== '');
              if (colorsArray.includes(newColor)) {
                return colorsArray.filter(color => color !== newColor).join(',');
              } else {
                return [...colorsArray, newColor].join(',');                 
              }
            });
          };
          
          // Reset le filtre colors 
          const removeColors = () => {
            setFilterColors(colors)
          }   

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
                                    return incolore
                                }
                               
          };

          // Méthode pour afficher ou masquer les images de couleurs
          const displayColor = (value) => {
              if(value === "INCOLORE") {
                  return "none";
              }
          };
          
        // Filtre formats

        const [arrowFormatSens, setArrowFormatSens] = React.useState(<SlArrowDown/>)
        const [displayFilterFormats, setDisplayFilterFormats] = React.useState(false)
        const callFormats = useRef(false);
                
        // Récupère les formats dans le storage si l'user vient de cardSelected
        const recupStorageFormat = (response) => {
                      try {
                
                          if (callFormats.current) return;
                        
                          const stored = sessionStorage.getItem('dpFilterFormats');
                
                            if (stored) {
                                
                                setFilterFormats(JSON.parse(stored));
                                sessionStorage.removeItem('dpFilterFormats');
                                callFormats.current = true;
                            } else {
                                setFilterFormats(response);
                                
                            }
                    } catch (error) {
                        console.error("Erreur lors de la récupération du sessionStorage :", error);
                    }
        };


        // Affiche le filtre des formats
         const OpenFilterFormat = () => {
            setArrowFormatSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
            setDisplayFilterFormats(!displayFilterFormats)                     
                         }
        
        // Sélectionne un format
          const selectFormats = (newFormat) => {
            setFilterFormats(prevFormats => {
              const formatsArray = Array.isArray(prevFormats) ? prevFormats : (prevFormats || '').split(',').filter(format => format.trim() !== '');
              if (formatsArray.includes(newFormat)) {
                return formatsArray.filter(format => format !== newFormat).join(',');
              } else {
                return [...formatsArray, newFormat].join(',');                 
              }
            });
          };

        // Retire un format
          const removeFormats = () => {
            setFilterFormats(formats)
          }
          
         

        let filterZIndex = 99;

        return (
            <Section className="section">
            { displayLoading && (
                <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
            )}
            <img src={backgroundCardsPage} className="background-image" alt="background" />

            {/* Searchbar desktop*/}
            <div className="search-line">            
              <SearchBar value={name} placeholder={" Chercher un deck"}
                onClick={() => (setFilterName(name))}
                filter={filterName}  
                prompt={name}                        
                onChange={(event) => (setName(event.target.value))}
                onPush={() => (setName(""), setFilterName(""))} iconStyle={{ display: displayResetName() }}
                style={{marginBottom: '30px'}} />

            </div>

            

            {/* Bouton ouverture des filtres*/}
            <OpenButtonLarge text="Afficher les filtres" icon={arrowFiltersSens} onClick={OpenFilters}/>
            
            
            <div className="filters-container">
              
              {/* Filtres desktop */}
              <div className="filters-line">
                  
                
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


              </div>

              {/* Filtres mobile */}
              {displayFilters && (
                    <div className="filters-line-mobile">
                      <div className='filter-mobile-container' style={{ backgroundImage: `url(${backgroundWhite})`}} >

                        <SearchBar value={name} placeholder={" Chercher un deck"}
                        onClick={() => (setFilterName(name))}
                        filter={filterName}  
                        prompt={name}                        
                        onChange={(event) => (setName(event.target.value))}
                        onPush={() => (setName(""), setFilterName(""))} iconStyle={{ display: displayResetName() }}
                        style={{marginTop: '20px'}} />
 
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
                      </div>
                    </div>
              )}

            </div>


            <div className='deck-title'>
              <Title title={"DeckList"}/>
            </div>
          {/*
          <div className='cards-buttons-order-container'>
              <ButtonSelect className={"button-date"} onClick={() => (displayDateDecks(), setTopDecks([]))} text={"Les plus récents"}
                          backgroundColor={getBgDate()} color={getColorDate()}/>
              <ButtonSelect className={"button-top"} onClick={() => (displayTopDecks(), setDecks([]))} text={"Les plus populaires"} 
                          backgroundColor={getBgTop()} color={getColorTop()}/>
          </div>
        */}

          <div className='display-objects-section'>
            <div className='display-decks-section'>
                            {decks.map(deck => ( 
                              <DeckMap key={deck.id} id={deck.id} name={deck.name} image={deck.image} 
                                                format={deck.format} colors={deck.colors} likeNumber={deck.likeNumber} 
                                                onClick={() => chooseDeck(deck.id)}
                                                onMouseEnter={() => hoveredDeck(deck.id, deck.name, deck.format) } 
                                                onMouseOut={() => hoveredDeck()}
                                                paraOnClick={()=>chooseUser(deck.id)}
                                                className="deck-db"                                 
                                                para={deck.deckBuilderName}
                                                detailsDeck={detailsDeck} />                        
                            ))}
                                   
            </div>   
          { hasMore && (
            <button className='next-page-button' disabled={!hasMore}
            onClick={()=>displayMoreDecks()}>Afficher plus</button> 
          )}

          </div>

        {/*
              {displayDecks === "popularity" && (  
                <div className='display-decks-section'>
                            {topDecks.map(deck => ( 
                              <DeckMap key={deck.id} id={deck.id} name={deck.name} image={deck.image} 
                                                format={deck.format} colors={deck.colors} likeNumber={deck.likeNumber} 
                                                onClick={() => chooseDeck(deck.id)}
                                                onMouseEnter={() => hoveredDeck(deck.id, deck.name, deck.format) } 
                                                onMouseOut={() => hoveredDeck()}
                                                paraOnClick={()=>chooseUser(deck.id)}
                                                className="deck-db"                                 
                                                para={deck.deckBuilderName}
                                                detailsDeck={detailsDeck} />   
                            ))}
                    </div>   
              )}  

              { displayDecks === "popularity" && topDecks.length > 0 && hasMore && (
                            <button className='next-page-button' disabled={!hasMore} 
                                onClick={()=>displayMoreDecksByLikes()}>Afficher plus</button> 
                        )} 
          </div>   
        */}

          <FooterSection/>               
          
            </Section>
        )
}

export default DecksPage;
