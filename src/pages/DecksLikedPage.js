import React from 'react';
import { useEffect, useRef, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authContext"
import Section from '../components/sectionMap';
import Deck from '../model/Deck';
import Title from '../components/title';
import SearchBar from '../components/searchBar';
import InputValue from '../components/inputValue';
import InputManaCoast from '../components/inputManaCoast';
import Checkbox from '../components/checkbox';
import CheckboxColor from '../components/checkboxColor';
import IconButton from '../components/buttonIcon';
import OpenButton from '../components/openButton';
import OpenButtonLarge from '../components/openButtonLarge';
import ButtonSelect from '../components/buttonSelect';
import ParagraphLikeNumber from '../components/paragraphLikeNumber';
import FooterSection from '../components/footerSection';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { TbFilterCancel } from "react-icons/tb";
import { FaHeart, FaRegHeart  } from 'react-icons/fa';
import backgroundCardsPage from "../assets/background_deck_select_page.png"
import backgroundWhite from "../assets/background_white.png";
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import incolore from "../assets/incolore-mtg.png"
import axiosInstance from "../api/axiosInstance";
import loading from "../assets/loading.gif"
import { getDeckImageUrl } from '../utils/imageUtils';
import "./css/DecksPage.css";



const DecksLikedPage = () => {
    const navigate = useNavigate();
    const [decks, setDecks] = React.useState([])
    const [topDecks, setTopDecks] = React.useState([])
    const [detailsDeck, setDetailsDeck] = React.useState(null)
    const [colors, setColors] = React.useState([])
    const [formats, setFormats] = React.useState([])
    const [deckLikedId, setDeckLikedId] = React.useState([])
    const [decksLikedLength, setDecksLikedLength] = React.useState("")
    const [displayLoading, setDisplayLoading] = useState(false);
    

    // Filtre recherche
        const [filterName, setFilterName] = React.useState("")
        const [inputValueMin, setInputValueMin] = React.useState("")
        const [inputValueMax, setInputValueMax] = React.useState("")
        const [inputManaCostMin, setInputManaCostMin] = React.useState("")
        const [inputManaCostMax, setInputManaCostMax] = React.useState("")
        const [filterColors, setFilterColors] = React.useState([])
        const [filterFormats, setFilterFormats] = React.useState([])
        
        // États pour la pagination
        const [page, setPage] = React.useState(20);
        const [pageSize, setPageSize] = React.useState(1);
        const [totalPages, setTotalPages] = React.useState(0);
        const [totalElements, setTotalElements] = React.useState(0);
        const [hasMore, setHasMore] = useState(true);
        const [isLoading, setIsLoading] = useState(false);

        // Mobile filters toggle
        const [arrowFiltersSens, setArrowFiltersSens] = React.useState(<SlArrowDown/>);
        const [displayFilters, setDisplayFilters] = React.useState(false);
        const OpenFilters = () => {
          setArrowFiltersSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
          setDisplayFilters(!displayFilters);
        };

        const [displayDecks, setDisplayDecks] = React.useState("date")
  // Pagination decks likés par date
        
        // Récupérer les decks triés par date
        useEffect(() => {
        const getDecksWithDate = async () => {
            try {
                setDisplayLoading(true);
                // Contient les RequestParams de la requete

                if (filterColors.length <1 || filterFormats.length <1
                ) {
                    setDisplayLoading(false);
                    return;
                }

                const params = {
                    page: 0,
                    size: pageSize,
                    order: "date",
                    name: filterName,
                    colors: filterColors,
                    formats: filterFormats,
                    valueMin : inputValueMin,
                    valueMax : inputValueMax,
                    manaCostMin : inputManaCostMin,
                    manaCostMax : inputManaCostMax

                };

                const response = await axiosInstance.get('f_user/getDecksLikedFilterPaged', {
                  params,
                  paramsSerializer: {
                    indexes: null // Cela désactive l'ajout des crochets
                  },
                  withCredentials: true
                });
    
                    const listDecks = response.data.content.map(
                        deck => new Deck (deck.id, deck.name, deck.dateCreation, deck.image, deck.format,
                            deck.colors, deck.manaCost, deck.value, deck.isPublic, deck.deckBuilder,
                            deck.deckBuilderName, deck.likeNumber, deck.cards, deck.commander
                ) )
                        
                setDecks(listDecks)
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
        getDecksWithDate();
        }, [displayDecks, deckLikedId, filterName, inputValueMin, inputValueMax, inputManaCostMin, inputManaCostMax,
            filterColors, filterFormats]);


        const displayMoreDecksByDate = async () => {
 
                        try {
                            setIsLoading(true);

                            const params = {
                                page: page,
                                size: pageSize,
                                order: "date",
                                name: filterName,
                                colors: filterColors,
                                formats: filterFormats,
                                valueMin : inputValueMin,
                                valueMax : inputValueMax,
                                manaCostMin : inputManaCostMin,
                                manaCostMax : inputManaCostMax
                            };

              const request = await axiosInstance.get(`f_user/getDecksLikedFilterPaged`, {
                  params,
                  paramsSerializer: { indexes: null },
                  withCredentials: true
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
  // Pagination decks likés par nb de likes
                        }
                };

        // Récupérer les decks triés par nb de likes
        useEffect(() => {
          const getDecksWithLikes = async () => {
                  setDisplayLoading(true)
                  try {

                    if (filterColors.length <1 || filterFormats.length <1
                ) {
                    setDisplayLoading(false);
                    return;
                }
                      const params = {
                          page: 0,
                          size: pageSize,
                          order: "like",
                          name: filterName,
                          colors: filterColors,
                          formats: filterFormats,
                          valueMin : inputValueMin,
                          valueMax : inputValueMax,
                          manaCostMin : inputManaCostMin,
                          manaCostMax : inputManaCostMax
      
                      };
      
                      const response = await axiosInstance.get('f_user/getDecksLikedFilterPaged', {
                      params,
                      paramsSerializer: {
                        indexes: null // Cela désactive l'ajout des crochets
                      },
                      withCredentials: true
                    });
          
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
              }, [displayDecks, deckLikedId, filterName, inputValueMin, inputValueMax, inputManaCostMin, inputManaCostMax,
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
                                        valueMin : inputValueMin,
                                        valueMax : inputValueMax,
                                        manaCostMin : inputManaCostMin,
                                        manaCostMax : inputManaCostMax
                  };
        
                  const request = await axiosInstance.get(`/f_user/getDecksLikedFilterPaged`, {
                      params,
                      paramsSerializer: { indexes: null },
                      withCredentials: true
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

        // Renvoie tous les id des cartes likés par l'user connecté
      useEffect(() => {
      const getDecksLiked = async () => {
            try {
                  const response = await axiosInstance.get(
                  'f_user/getDecksLiked',
                  { withCredentials: true }
                );
                                                                   
                  const listId = response.data
                  
                  setDeckLikedId(listId)
                  setDecksLikedLength(listId.length)
                 
              
            }
            catch (error) {
                console.log(error);
                }
         }
        getDecksLiked();
           }, []);
        
      
        
        
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
              return '#5D3B8C'
            } 
            else {
              return '#D3D3D3'
            }
           }

           const getBgTop= () => {
            if(displayDecks==="popularity") {
              return '#5D3B8C'
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
  
        
        
        // Afficher les détails d'un deck
        const hoveredDeck = (id, name, format) => {
            setDetailsDeck({ id, name, format }); 
        }

        // Naviguer vers un deck
         const chooseDeck = (id) => {
          sessionStorage.setItem('dlpFilterName', JSON.stringify(filterName));
          sessionStorage.setItem('dlpInputValueMin', JSON.stringify(inputValueMin));
          sessionStorage.setItem('dlpInputValueMax', JSON.stringify(inputValueMax));
          sessionStorage.setItem('dlpInputManacostMin', JSON.stringify(inputManaCostMin));
          sessionStorage.setItem('dlpInputManacostMax', JSON.stringify(inputManaCostMax));
          sessionStorage.setItem('dlpFilterColors', JSON.stringify(filterColors));
          sessionStorage.setItem('dlpFilterFormats', JSON.stringify(filterFormats));

          const deckIds = decks.map(deck => deck.id);
          navigate(`/deckSelected`, { state: { deckID: id, ListDeck: deckIds }})
               };

        // Naviguer vers un user
        const chooseUser = async (deckID) => { 

          try {
            setDisplayLoading(true);
            sessionStorage.setItem('dpFilterName', JSON.stringify(filterName));
            sessionStorage.setItem('dpInputValueMin', JSON.stringify(inputValueMin));
            sessionStorage.setItem('dpInputValueMax', JSON.stringify(inputValueMax));
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
                              const filterName = sessionStorage.getItem('dlpFilterName');
                              const inputValueMin = sessionStorage.getItem('dlpInputValueMin');
                              const inputValueMax = sessionStorage.getItem('dlpInputValueMax');
                              const inputManaCostMin = sessionStorage.getItem('dlpInputManacostMin');
                              const inputManaCostMax = sessionStorage.getItem('dlpInputManacostMax');
                               
                              if (filterName) {
                                  setFilterName(JSON.parse(filterName));
                                  sessionStorage.removeItem('dlpFilterName');
                              }
                              if (inputValueMin) {
                                  setInputValueMin(JSON.parse(inputValueMin));
                                  sessionStorage.removeItem('dlpInputValueMin');
                              }
                              if (inputValueMax) {
                                  setInputValueMax(JSON.parse(inputValueMax));
                                  sessionStorage.removeItem('dlpInputValueMax');
                              }
                              if (inputManaCostMin) {
                                  setInputManaCostMin(JSON.parse(inputManaCostMin));
                                  sessionStorage.removeItem('dlpInputManacostMin');
                              }
                              if (inputManaCostMax) {
                                  setInputManaCostMax(JSON.parse(inputManaCostMax));
                                  sessionStorage.removeItem('dlpInputManacostMax');
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


            // Méthode disliker un deck
            const dislikeDeck = async (id) => {
                try {
                    setDisplayLoading(true);
                   await axiosInstance.delete(`/f_user/dislikeDeck?deckId=${id}`, { withCredentials: true });          
                   setDeckLikedId(prevState => prevState.filter(deckId => deckId !== id));
                   setDecksLikedLength(decksLikedLength -1)
                    }   
                catch (error) {
                   console.log(error)
                }
                finally {
                  setDisplayLoading(false);
                }
            };

            // Modifie la couleur de l'icone coeur après un like
            const hearthIcon = (id) => {
                if(!deckLikedId.some(deckId => deckId === (id))) {
                    return (<FaRegHeart className='deckspage-like-icon' size="2em" />)
                }
                else {
                    return (<FaHeart className='deckspage-like-icon' size="2em" color="red"/>)
                }
            }


          // Filtre value

         const [arrowValueSens, setArrowValueSens] = React.useState(<SlArrowDown/>)
         const [displayFilterValue, setDisplayFilterValue] = React.useState(false)

         // Ouvrir le filtre value
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
                        
                              const stored = sessionStorage.getItem('dlpFilterColors');
                
                            if (stored) {
                                
                                setFilterColors(JSON.parse(stored));
                                sessionStorage.removeItem('dlpFilterColors');
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
                             setDisplayLoading(true);
                             const request = await axiosInstance.get(`f_all/getColors`);
         
                             const response = request.data
                 
                             setColors(response)
                             recupStorageColor(response)
                             setDisplayLoading(false);
                         }   
                         catch (error) {
                             setDisplayLoading(false);
                             console.log(error);
                         }
                     }
                     getColors();
                     }, []);

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
                        
                              const stored = sessionStorage.getItem('dlpFilterFormats');
                
                            if (stored) {
                                
                                setFilterFormats(JSON.parse(stored));
                                sessionStorage.removeItem('dlpFilterFormats');
                                callFormats.current = true;
                            } else {
                                setFilterFormats(response);
                                
                            }
                    } catch (error) {
                        console.error("Erreur lors de la récupération du sessionStorage :", error);
                    }
        };
        
        // Récupère tous les formats
        useEffect(() => {
            const getFormats = async () => {
                try {
                    setDisplayLoading(true);
                    const request = await axiosInstance.get(`f_all/getFormats`);

                    const response = request.data.map(format => format.name);
        
                    setFormats(response)
                    recupStorageFormat(response)
                    setDisplayLoading(false);

                }   
                catch (error) {
                    setDisplayLoading(false);
                    console.log(error);
                }
            }
            getFormats();
            }, []);

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
              <SearchBar value={filterName} onChange={(event) => (setFilterName(event.target.value))} placeholder={" Chercher un deck"}
              style={{marginBottom: '30px'}} />
            </div>
            

            {/* Bouton ouverture des filtres*/}
            <OpenButtonLarge text="Afficher les filtres" icon={arrowFiltersSens} onClick={OpenFilters}/>
            
            {/* Filtres desktop */}
            <div className="filters-container">

               {/* Filtres desktop */}
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

              </div>


              {/* Filtres mobile */}
                {displayFilters && (
                    <div className="filters-line-mobile">
                      <div className='filter-mobile-container' style={{ backgroundImage: `url(${backgroundWhite})`}} >
                        <SearchBar value={filterName} onChange={(event) => (setFilterName(event.target.value))} 
                        placeholder={"Chercher un deck"} style={{marginTop: '20px'}} />
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
                      </div>
                    </div>
                )}
            </div>


            <div className='deck-title'>
              <Title title={'Decks likés (' + decksLikedLength + ')'}/>
            </div>
          
          <div className='cards-buttons-order-container'>
              <ButtonSelect className={"button-date"} onClick={() => (displayDateDecks(), setTopDecks([]))} text={"Les plus récents"}
                          backgroundColor={getBgDate()} color={getColorDate()}/>
              <ButtonSelect className={"button-top"} onClick={() => (displayTopDecks(), setDecks([]))} text={"Les plus populaires"} 
                          backgroundColor={getBgTop()} color={getColorTop()}/>
          </div>


          <div className='display-objects-section'>
              {displayDecks === "date" && (  
                <div className='display-decks-section'>
                            {decks.map(deck => ( 
                                <div className="deck-details"  key={deck.id}>
                                    <img className="deck-pp" src={getDeckImageUrl(deck.image)} alt="Deck avatar" onClick={() => chooseDeck(deck.id)}
                                    onMouseEnter={() => hoveredDeck(deck.id, deck.name, deck.format) } onMouseOut={() => hoveredDeck()} />
                                    <strong className="decks-name"> {deck.name} </strong>
                                    <button><strong className="deck-db" onClick={() => chooseUser(deck.id)}> by {deck.deckBuilderName}</strong></button>

                                    <IconButton   
                                        onClick={()=> dislikeDeck(deck.id)} 
                                        
                                        style={{ 
                                            background: 'none', 
                                            boxShadow: 'none', 
                                            paddingTop: '5%', 
                                            border: 'none',                                       
                                          }} 
                                                      
                                        icon={<FaHeart className='deckspage-like-icon' size="2em" color="red"/>} 
                                    />

                                    <ParagraphLikeNumber text={deck.likeNumber} iconStyle={{position:'relative', marginBottom: '3px'}}/>


                                    {detailsDeck && detailsDeck.id === deck.id && (
                                      <div className="hover-deck-card">
                                          <div className="img-container">
                                              <img className="hover-deck-card-img" src={getDeckImageUrl(deck.image)} alt="Deck mtg"/>
                                          </div>
                                                  <div className="deck-hover-body" >
                                                    <div className='name-line'>
                                                      <h1 className="hover-deck-name"> {deck.name}</h1>
                                                    </div>
                                                    <div className='color-line'>                        
                                                        <h2 className='color'> Couleurs : </h2> 
                                                        {deck.colors && deck.colors.length > 0 && Array.isArray(colors) && (
                                                            <div className='mapping-color'>
                                                              {deck.colors.map((color)  => (
                                                            <img src={getColorPics(color)} className="color-img-select" style={{display:(displayColor(color))}} alt={color}/>                                
                                                        ))}
                                                            </div>
                                                        )} 
                                                    </div>
                                                    <div className='format-line'>              
                                                        <h2 className='format'> Format : </h2> 
                                                        <h2 className='card-format' style={{ position: 'relative', marginTop: '5px' }}>{deck.format}</h2>
                                                    </div>
                                                    
                                                </div>                                                
                                              </div>
                                    )}
                </div>
                          
                            ))}
                                  
                    </div>   
              )} 

              { displayDecks === "date" && decks.length > 0 && hasMore && (
                                <button className='next-page-button' disabled={!hasMore}
                                onClick={()=>displayMoreDecksByDate()}>Afficher plus</button> 
                            )}

              {displayDecks === "popularity" && (  
                <div className='display-decks-section'>
                            {topDecks.map(deck => ( 
                                <div className="deck-details"  key={deck.id}>
                                    <img className="deck-pp" src={getDeckImageUrl(deck.image)} alt="Deck avatar" onClick={() => chooseDeck(deck.id)}
                                    onMouseEnter={() => hoveredDeck(deck.id, deck.name, deck.format) } onMouseOut={() => hoveredDeck()} />
                                    <strong className="decks-name"> {deck.name} </strong>
                                  <button><strong className="deck-db" onClick={() => chooseUser(deck.id)}> by {deck.deckBuilderName}</strong></button>

                                    <IconButton   
                                        onClick={()=> dislikeDeck(deck.id)} 
                                        
                                        style={{ 
                                            background: 'none', 
                                            boxShadow: 'none', 
                                            paddingTop: '5%', 
                                            border: 'none',                                       
                                          }} 
                                                      
                                        icon={<FaHeart className='deckspage-like-icon' size="2em" color="red"/>} 
                                    />

                                    <ParagraphLikeNumber text={deck.likeNumber} iconStyle={{position:'relative', marginBottom: '3px'}}/>

                                    {detailsDeck && detailsDeck.id === deck.id && (
                                    <div className="hover-deck-card">
                                          <div className="img-container">
                                              <img className="hover-deck-card-img" src={getDeckImageUrl(deck.image)} alt="Deck mtg"/>
                                          </div>
                                                  <div className="deck-hover-body" >
                                                    <div className='name-line'>
                                                      <h1 className="hover-deck-name"> {deck.name}</h1>
                                                    </div>
                                                    <div className='color-line'>                        
                                                        <h2 className='color'> Couleurs : </h2> 
                                                        {deck.colors && deck.colors.length > 0 && Array.isArray(colors) && (
                                                            <div className='mapping-color'>
                                                              {deck.colors.map((color)  => (
                                                            <img src={getColorPics(color)} className="color-img-select" style={{display:(displayColor(color))}} alt={color}/>                                
                                                        ))}
                                                            </div>
                                                        )} 
                                                    </div>
                                                    <div className='format-line'>              
                                                        <h2 className='format'> Format : </h2> 
                                                        <h2 className='card-format' style={{ backgroundColor: 'green' }}>{deck.format}</h2>
                                                    </div>
                                                    
                                                </div>                                                
                                              </div>
                                    )}
                </div>
                          
                            ))}
                    </div>   
              )}  

              { displayDecks === "popularity" && topDecks.length > 0 && hasMore && (
                            <button className='next-page-button' disabled={!hasMore} 
                                onClick={()=>displayMoreDecksByLikes()}>Afficher plus</button> 
                        )} 
          </div>   


          <FooterSection/>               
          
        </Section>
    );
}

export default DecksLikedPage;