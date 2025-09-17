import React from 'react';
import { useEffect, useRef, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authContext"
import Section from '../components/section';
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
import FooterSection from '../components/footerSection';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { CgCloseO } from "react-icons/cg";
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
import { getImageUrl } from '../utils/imageUtils';
import IconButtonHover from '../components/buttonIconHover';
import ButtonModif from '../components/iconModif';
import { FaPlus } from 'react-icons/fa';
import "./css/DecksPage.css";



const DecksCreatePage = () => {
    const navigate = useNavigate();
    const [deckBuilder, setDeckBuilder] = useState([]);
    const [decks, setDecks] = React.useState([])
    const [detailsDeck, setDetailsDeck] = React.useState(null)
    const [colors, setColors] = React.useState([])
    const [formats, setFormats] = React.useState([])
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
        const [page, setPage] = React.useState(1);
        const [pageSize, setPageSize] = React.useState(20);
        const [hasMore, setHasMore] = useState(true);


        useEffect(() => {
        const getDeckBuilder = async () => {
            try {

                
                const request = await axiosInstance.get('/f_user/getDeckBuilder', {
                    withCredentials: true,                  
                });
              
                const response = request.data
    
                setDeckBuilder(response)

            }   
            catch (error) {
                console.log(error)
            }

    
        }
        getDeckBuilder();
        }, [decks]);

        
        // Récupérer les decks de l'user
        useEffect(() => {
        const getDecks = async () => {
            try {
                setDisplayLoading(true);

                if (filterColors.length <1 || filterFormats.length <1
                ) {
                    setDisplayLoading(false);
                    return;
                }

                // Contient les RequestParams de la requete
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

                const response = await axiosInstance.get('f_user/getDecksCreateFilterPaged', {
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
                setHasMore(!response.data.isLast)
                setDisplayLoading(false)
            }   
            catch (error) {
                setDisplayLoading(false);
                console.log(error);
            }

    
        }
        getDecks();
        }, [ filterName, inputValueMin, inputValueMax, inputManaCostMin, inputManaCostMax,
            filterColors, filterFormats]);


        const displayMoreDecks = async () => {
 
                        try {
                            setDisplayLoading(true);

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

              const request = await axiosInstance.get(`f_user/getDecksCreateFilterPaged`, {
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
                        setDisplayLoading(false);
  // Pagination decks likés par nb de likes
                        }
                };  


        
        // Naviguer vers la construction d'un deck
         const chooseDeck = (id) => {
          sessionStorage.setItem('dcpFilterName', JSON.stringify(filterName));
          sessionStorage.setItem('dcpInputValueMin', JSON.stringify(inputValueMin));
          sessionStorage.setItem('dcpInputValueMax', JSON.stringify(inputValueMax));
          sessionStorage.setItem('dcpInputManacostMin', JSON.stringify(inputManaCostMin));
          sessionStorage.setItem('dcpInputManacostMax', JSON.stringify(inputManaCostMax));
          sessionStorage.setItem('dcpFilterColors', JSON.stringify(filterColors));
          sessionStorage.setItem('dcpFilterFormats', JSON.stringify(filterFormats));

          const deckIds = decks.map(deck => deck.id);
          navigate(`/deckbuilding`, { state: { deckID: id, ListDeck: deckIds }})
               };
        

          // Navigation pour créer un nouveau deck
          const navNewDeck = () => {
            navigate('/addDeck');
          };
        
        // Afficher les détails d'un deck
        const hoveredDeck = (id, name, format) => {
            setDetailsDeck({ id, name, format }); 
        }
/*
        // Naviguer vers un deck
         const chooseDeck = (id) => {
          sessionStorage.setItem('dcpFilterName', JSON.stringify(filterName));
          sessionStorage.setItem('dcpInputValueMin', JSON.stringify(inputValueMin));
          sessionStorage.setItem('dcpInputValueMax', JSON.stringify(inputValueMax));
          sessionStorage.setItem('dcpInputManacostMin', JSON.stringify(inputManaCostMin));
          sessionStorage.setItem('dcpInputManacostMax', JSON.stringify(inputManaCostMax));
          sessionStorage.setItem('dcpFilterColors', JSON.stringify(filterColors));
          sessionStorage.setItem('dcpFilterFormats', JSON.stringify(filterFormats));

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
*/
        
        // Récupère le contenu depuis le storage si l'user revient de deckSelected
                      useEffect(() => {
                      const recupStorage = () => {
                          try {
                              const filterName = sessionStorage.getItem('dcpFilterName');
                              const inputValueMin = sessionStorage.getItem('dcpInputValueMin');
                              const inputValueMax = sessionStorage.getItem('dcpInputValueMax');
                              const inputManaCostMin = sessionStorage.getItem('dcpInputManacostMin');
                              const inputManaCostMax = sessionStorage.getItem('dcpInputManacostMax');
                               
                              if (filterName) {
                                  setFilterName(JSON.parse(filterName));
                                  sessionStorage.removeItem('dcpFilterName');
                              }
                              if (inputValueMin) {
                                  setInputValueMin(JSON.parse(inputValueMin));
                                  sessionStorage.removeItem('dcpInputValueMin');
                              }
                              if (inputValueMax) {
                                  setInputValueMax(JSON.parse(inputValueMax));
                                  sessionStorage.removeItem('dcpInputValueMax');
                              }
                              if (inputManaCostMin) {
                                  setInputManaCostMin(JSON.parse(inputManaCostMin));
                                  sessionStorage.removeItem('dcpInputManacostMin');
                              }
                              if (inputManaCostMax) {
                                  setInputManaCostMax(JSON.parse(inputManaCostMax));
                                  sessionStorage.removeItem('dcpInputManacostMax');
                              }
                              
                              
                          } catch (error) {
                              console.error("Erreur lors de la récupération du sessionStorage :", error);
                          }
                      };
                
                      recupStorage();
                  }, []);
    


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
                        
                              const stored = sessionStorage.getItem('dcpFilterColors');
                
                            if (stored) {
                                
                                setFilterColors(JSON.parse(stored));
                                sessionStorage.removeItem('dcpFilterColors');
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
                        
                              const stored = sessionStorage.getItem('dcpFilterFormats');
                
                            if (stored) {
                                
                                setFilterFormats(JSON.parse(stored));
                                sessionStorage.removeItem('dcpFilterFormats');
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
            <SearchBar value={filterName} onChange={(event) => (setFilterName(event.target.value))} placeholder={"Chercher un deck ou un deckbuilder"}
            style={{marginBottom: '30px'}} />
            
            <div className="filters-container">
                <div className="filters-line">
                  
                  <div className="filter-value-container">
                    <OpenButton text="Filtrer par valeur €" icon={arrowValueSens} onClick={OpenFilterValue} />
                    {displayFilterValue && (
                      <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                        <InputValue style={{width: '150px'}} value={inputValueMin}
                        onChange={(event) => (setInputValueMin(event.target.value))} placeholder={"min"}/>
                        <InputValue style={{width: '150px'}} value={inputValueMax}
                        onChange={(event) => (setInputValueMax(event.target.value))} placeholder={"max"}/>
                        <CgCloseO className='filter-reset' onClick={()=> ResetFilterValue()} size={'2.5em'}/>
                      </div>
                    )}
                  </div>
                  
                  <div className="filter-manaCost-container">
                    <OpenButton text="Filtrer par cout de mana" icon={arrowManaCostSens} onClick={OpenFilterManaCost} />
                    {displayFilterManaCost && (
                    <div className='add-card-filter-container' style={{zIndex: filterZIndex--}}>
                      <InputManaCoast style={{width: '150px'}}  value={inputManaCostMin}
                        onChange={(event) => (setInputManaCostMin(event.target.value))} placeholder={"min"}/>
                      <InputManaCoast style={{width: '150px'}} value={inputManaCostMax}
                      onChange={(event) => (setInputManaCostMax(event.target.value))} placeholder={"max"}/>
                      <CgCloseO className='filter-reset' onClick={()=> ResetFilterManaCost()} size={'2.5em'}/>
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


            <div className='deck-title'>
              <Title title={'Decks créés (' + deckBuilder.decksNumber + ')'}/>
            </div>


                <div className='display-objects-section'> 
                  <div className='display-decks-section' style={{marginTop: '2%'}}>
                        {decks.map(deck => (   

                            <div className="deck-details" id='decks-user'  key={deck.id}>
                                <img className="deck-pp" src={getImageUrl(deck.image)} alt="Deck avatar" onClick={() => chooseDeck(deck.id)}
                                onMouseEnter={() => hoveredDeck(deck.id, deck.name, deck.format) } onMouseOut={() => hoveredDeck()}/>
                                <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                                </div>
                                <strong className="deck-named" style={{padding:'5%'}}> {deck.name} </strong>

                                {!deck.isPublic && (
                                    <h6 className='deck-public' style={{backgroundColor: 'red'}}>privé</h6>
                                )}
                                {deck.isPublic && (
                                    <h6 className='deck-public' style={{backgroundColor: 'green'}}>public</h6>
                                )}

                                {detailsDeck && detailsDeck.id === deck.id && (
                                        <div className="hover-deck-card" style={{zIndex: '1'}}>
                                          <div className="img-container">
                                              <img className="hover-deck-card-img" src={getImageUrl(deck.image)} alt="Deck mtg"/>
                                          </div>
                                                  <div className="deck-hover-body" >
                                                    <div className='name-line'>
                                                      <h1 className="hover-deck-name"> {deck.name}</h1>
                                                    </div>
                                                    <div className='color-line'>                        
                                                        <h2 className='color'> Couleurs : </h2> 
                                                        {deck.colors && deck.colors.length > 0 && (
                                                            <div className='mapping-color'>
                                                              {deck.colors.map((color, index)  => (
                                                            <img src={getColorPics(color)} key={index}
                                                             style={{display:(displayColor(color))}}
                                                             className="color-img-select" alt={color}/>                                
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
                                <p className='card-page-likenumber'>{deck.likeNumber} <FaHeart style={{position:'relative', marginBottom: '3px'}}
                                                   size={'0.9em'}  color='red' /></p>
                            </div> 
                    
                        ))}
                            <div className="deck-details">
                                <div className='new-user-deck-contenair'>
                                    <IconButtonHover onClick={() => navNewDeck()} icon={<FaPlus size={'4em'} color='white'/>} 
                                    style={{ width: '150px', height: '150px', backgroundColor: '#5D3B8C', marginBottom: '5%'
                                             }}/>
                                    <h5 style={{padding:'5%'}}><strong>Nouveau deck</strong></h5>                              
                                </div>
                            <h6 className='deck-public' style={{visibility: 'hidden'}}>privé</h6>
                            <ButtonModif style={{visibility: 'hidden'}} />
                            </div>
                  </div>

                {hasMore && (
                  <button className='next-page-button' disabled={!hasMore}
                  onClick={()=>displayMoreDecks()}>Afficher plus</button>
                )}
                
                </div>

  
   


          <FooterSection/>               
          
        </Section>
    );
}

export default DecksCreatePage;