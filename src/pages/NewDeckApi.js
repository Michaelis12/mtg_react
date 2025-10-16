import './css/NewDeck.css'
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { CgAdd } from "react-icons/cg";
import { TbFilterCancel } from "react-icons/tb";
import { IoIosArrowDropleft } from "react-icons/io";
import { CgCloseO  } from "react-icons/cg";
import Card from '../model/Card';
import Section from '../components/section';
import Title from '../components/title';
import TitleMobile from '../components/titleMobile';
import OpenButton from '../components/openButton';
import Pipeline from '../components/pipeline';
import CheckboxFormat from '../components/checkboxFormat'
import ButtonModif from '../components/iconModif';
import ButtonSelect from '../components/buttonSelect';
import ButtonValid from '../components/buttonValid';
import AddButton from '../components/addButton';
import InputName from '../components/inputName';
import SearchBar from '../components/searchBar';
import InputValue from '../components/inputValue';
import InputManaCoast from '../components/inputManaCoast';
import CheckboxColor from '../components/checkboxColor';
import CheckboxRarity from '../components/checkboxRarity';
import CheckboxEdition from '../components/checkboxEdition';
import OpenButtonLarge from '../components/openButtonLarge';
import axiosInstance from "../api/axiosInstance";
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import incolore from "../assets/incolore-mtg.png"
import defaultImg from "../assets/default_deck.png"
import backgroundCardsPage from "../assets/background_cardsPage2.jpg"
import loading from "../assets/loading.gif"
import backgroundPopup from "../assets/background_white.png"
import backgroundWhite from "../assets/background_white.png";
import { FaHeart  } from 'react-icons/fa'; 



const NewDeck = () => {
    
   const navigate = useNavigate();
   const [displayLoading, setDisplayLoading] = useState(false);

   // Récupère les couleurs pour le checkbox
   const [existingColors, setExistingColors] = React.useState(["W", "U", "R", "G", "B", "colorless"])
      
    // Change de valeur à la sélection 
    const [selectedColors, setSelectedColors] = React.useState([])
    const [selectedFormat, setSelectedFormat] = React.useState("")
    const [selectedName, setSelectedName] = React.useState("")
    const [selectedImage, setSelectedImage] = React.useState(defaultImg) 
    const [selectedImageFile, setSelectedImageFile] = React.useState(null) // Fichier sélectionné pour upload

    // Change de valeur après validation
    const [colors, setColors] = React.useState([])
    const [format, setFormat] = React.useState("")
    const [name, setName] = React.useState("")
    const [image, setImage] = React.useState("")

    // Mobile filters toggle (inspired by CardsPage)
    const [arrowFiltersSens, setArrowFiltersSens] = React.useState(<SlArrowDown/>);
    const [displayFilters, setDisplayFilters] = React.useState(false);
    const OpenFilters = () => {
      setArrowFiltersSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
      setDisplayFilters(!displayFilters);
    };

    // Z-index for filter containers (inspired by CardsPage)
    let filterZIndex = 99;

    const callColors = useRef(false);

     // Récupère les colors dans le storage si l'user vient de cardSelected
      const recupStorageColor = (response) => {
      try {

          if (callColors.current) return;
        
          const stored = sessionStorage.getItem('ndFilterColors');

            if (stored) {
                
                setFilterColors(JSON.parse(stored));
                sessionStorage.removeItem('ndFilterColors');
                callColors.current = true;
            } else {
                setFilterColors(response);
                
            }
    } catch (error) {
        console.error("Erreur lors de la récupération du sessionStorage :", error);
    }
}; 


    const [rarities, setRarities] = React.useState([])

     const callRarities = useRef(false);

      // Récupère les rarities dans le storage si l'user vient de cardSelected
      const recupStorageRarity = (response) => {
      try {

          if (callRarities.current) return;
        
          const stored = sessionStorage.getItem('ndFilterRarities');

            if (stored) {
                
                setFilterRarities(JSON.parse(stored));
                sessionStorage.removeItem('ndFilterRarities');
                callRarities.current = true;
            } else {
                setFilterRarities(response);
                
            }
    } catch (error) {
        console.error("Erreur lors de la récupération du sessionStorage :", error);
    }
};
      



    const [editions, setEditions] = React.useState([])


    const callEditions = useRef(false);

      const recupStorageEdition = (response) => {
      try {

          if (callEditions.current) return;
        
          const stored = sessionStorage.getItem('ndFilterEditions');

            if (stored) {
                
                setFilterEditions(JSON.parse(stored));
                sessionStorage.removeItem('ndFilterEditions');
                callEditions.current = true;
            } else {
                setFilterEditions(response);
                
            }
    } catch (error) {
        console.error("Erreur lors de la récupération du sessionStorage :", error);
    }
};
  // Récupère toutes les éditions pour les mapper
  useEffect(() => {
                  const getEditions = async () => {
                      try {
                          setDisplayLoading(true);
                          const request = await axiosInstance.get(`/f_all/getEditions`);
      
                          const response = request.data
              
                          setEditions(response)
                          
                          recupStorageEdition(response)
                          setDisplayLoading(false);
                      }   
                      catch (error) {
                          setDisplayLoading(false);
                          console.log(error);
                      }
                  }
                  getEditions();
      }, []);

      // N'affiche pas INCOLORE dans le 1er checkout
      const displayColor = (value) => {
        if(value === "INCOLORE") {
            return "none";
      }
    }
    
     // Récupère les images des couleurs  
    const getColorPics = (value ) => {
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

    // Choix colors
    const selectColors = (newColor) => {
      console.log("newColor : " + newColor)
      setSelectedColors(prev => {
        if (newColor === 'colorless') {
          return ['colorless'];
        }

        const updated = prev.includes(newColor)
          ? prev.filter(c => c !== newColor)
          : [...prev.filter(c => c !== 'colorless'), newColor];

        return updated;
      });
    };

     

      // Validation colors
      const validColors = () => {
        setColors(selectedColors)
      }
       
      // Choix format
      const selectFormat = (newFormat) => {
        setSelectedFormat(newFormat);
      };

      // Validation format
      const validFormat = () => {
        setFormat(selectedFormat)
      }

      // Choix image
      const selectImage = (event) => {
        const file = event.target.files[0];
        
        if (file) {
          // Créer une URL temporaire pour afficher l'image sélectionnée
          const imageUrl = URL.createObjectURL(file);
          setSelectedImage(imageUrl);
          setSelectedImageFile(file); // Stocker le fichier pour upload ultérieur
        }
      }

      // Validation name & image
      const validName = () => {
        setName(selectedName)
        setImage(selectedImage)
      }

      // Revenir au choix de format
      const returnFormat = () => {
        setFormat("");
        setColors([]);
        setCedh([]);
      };

      // Revenir au choix des couleurs
      const returnColors = () => {
        setColors([]);
        setName("");
      };

      // Revenir au choix du nom 
      const returnName = () => {
        setName("");
      };

      
      // Créé le deck
      const createDeck = async () => {
        try {
            setDisplayLoading(true);
            
            let imagePath = "";
            
            // Si une image a été sélectionnée, l'uploader
            if (selectedImageFile) {
              const formData = new FormData();
              formData.append('file', selectedImageFile);
              
              const uploadRes = await axiosInstance.post("/f_all/uploadImage", formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
                  withCredentials: true
              });
              
              imagePath = uploadRes.data;
            } else {
              // Si aucune image n'a été sélectionnée, utiliser l'image par défaut
              // On utilise un chemin simple pour éviter l'encodage HTML
              imagePath = "/uploads/default_deck.png";
            }
            
            const deckRegister = {
              name,
              format,
              image: imagePath,
              colors
            }

            
/*
            const cardsId = [];

            if (colors.includes("w")) {
                          cardsId.push(1);  
                        }

            if (colors.includes("u")) {
              cardsId.push(2);  
            }

            if (colors.includes("b")) {
              cardsId.push(3); 
            }

            if (colors.includes("r")) {
              cardsId.push(4);  
            }

            if (colors.includes("g")) {
              cardsId.push(5);  
            }
*/
            const response = await axiosInstance.post('/f_user/addDeck', deckRegister, { withCredentials: true}); 
            const responseData = response.data

            //const request = await axiosInstance.post(`f_user/addCardsOnDeck?cardId=${cardsId}&deckId=${responseData}`, null, { withCredentials: true });


            navigate(`/deckbuilding`, { state: { deckID: responseData }}) 
            setDisplayLoading(false);

        } catch (e) {
            setDisplayLoading(false);
        }     
    }

    // Ajouter un commander 

    const [cards, setCards] = React.useState([])
    const [topCards, setTopCards] = React.useState([])
    const [detailsCard, setDetailsCard] = React.useState(null)
    const [displayCards, setDisplayCards] = React.useState("id")
    
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

  // États pour la pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    
        
        // Récupère les cartes triées par id 
      const getCardsByID = async () => {
            try { 
                setDisplayLoading(true);
                // On utilise ça pour contourner le bug qui appelle la méthode sans paramètre
                if (filterEditions.length <1 || filterRarities.length <1 || filterColors.length <1) {
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
                    formats: format,
                    colors: filterColors,
                    rarities : filterRarities,
                    valueMin : inputValueMin,
                    valueMax : inputValueMax,
                    manaCostMin : inputManaCostMin,
                    manaCostMax : inputManaCostMax,
                    editions : filterEditions,
                    types : "CREATURE",
                    legendary : "legendary"
                    
                }; 


                
                const response = await axiosInstance.get('/f_all/getCardsPaged', {
                  params,
                  paramsSerializer: {
                    indexes: null // Cela désactive l'ajout des crochets
                }
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
                setDisplayLoading(false);
            }   
            catch (error) {
                setDisplayLoading(false);
                console.log(error);
            }

    
      }
      React.useEffect(() => {
          getCardsByID();
      }, [displayCards, filterName, filterText, filterColors, format, inputValueMin, inputValueMax, inputManaCostMin, inputManaCostMax,
      filterRarities, filterEditions]);

      const displayMoreCardsWithID = async () => {

       try {
          setIsLoading(true);

          const params = {
              page: page,
              size: pageSize,
              order: 'id',
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
              types : "CREATURE",
              legendary : "legendary"
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

     
                
      
    const hoveredCard = (id) => {
               setDetailsCard({ id });
      
    }

    // Si il y'a un commandant le reset en cas de changement de format
    useEffect(() => {
                  const resetCedh = async () => {
                      try {
                           if( format !== "Commander" && cedhID !== "") {             
                            setCedh([])
                            setCedhID("")
                            setCedhSelected([])
                           }
      
                      }   
                      catch (error) {
                          console.log(error);
                      }
                  }
                  resetCedh();
      }, [format]);
      
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
      
    // Reset le filtre manaCost
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

     // Choix colors
    const selectColors2 = (newColor) => {
      if(newColor !== 'INCOLORE') {
              setFilterColors(prevColors => {
              // Si la couleur existe déjà dans le tableau, on la retire
              if (prevColors.includes(newColor)) {
                  return prevColors.filter(color => color !== newColor);  // Retire la couleur
              } else {
                  return [...prevColors.filter(color => color !== 'INCOLORE'), newColor];  // Ajoute la couleur au tableau et retire INCOLORE
              }
              });
          }
      else {setFilterColors([newColor])} // Retire toutes les autres couleurs et les remplace par INCOLORE
      };

      
                
    // Refiltre selon toutes les couleurs du deck
   const removeColors = () => {
    setFilterColors(existingColors)
   } 
      
   // Filtre editions 
              
    const [arrowEditionSens, setArrowEditionSens] = React.useState(<SlArrowDown/>)
    const [displayFilterEditions, setDisplayFilterEditions] = React.useState(false)
              
    // Affiche le filtre des éditions
    const OpenFilterEdition = () => {
                    setArrowEditionSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
                    setDisplayFilterEditions(!displayFilterEditions)                     
      }
      
      
              
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

    // Naviguer vers une carte depuis id
    const navCard = (id) => {
      
          sessionStorage.setItem('ndCedhSelected', JSON.stringify(cedhSelected));
          sessionStorage.setItem('ndFormat', JSON.stringify(format));
          sessionStorage.setItem('ndFilterName', JSON.stringify(filterName));
          sessionStorage.setItem('ndFilterText', JSON.stringify(filterText));
          sessionStorage.setItem('ndInputValueMin', JSON.stringify(inputValueMin));
          sessionStorage.setItem('ndInputValueMax', JSON.stringify(inputValueMax));
          sessionStorage.setItem('ndInputManacostMin', JSON.stringify(inputManaCostMin));
          sessionStorage.setItem('ndInputManacostMax', JSON.stringify(inputManaCostMax));
          sessionStorage.setItem('ndFilterColors', JSON.stringify(filterColors));
          sessionStorage.setItem('ndFilterRarities', JSON.stringify(filterRarities));
          sessionStorage.setItem('ndFilterEditions', JSON.stringify(filterEditions));

          const cardsIds = cards.map(card => card.id);
          navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds}})
    };

                      
              
    const [cedhSelected, setCedhSelected] = React.useState([])
    const [cedh, setCedh] = React.useState([])
    const [cedhID, setCedhID] = React.useState("")
    const [detailsCedh, setDetailsCedh] = React.useState(false)
      
    // Sélectionne des cartes
    const selectCedh = (card) => {
            if(cedhSelected.id !== card.id) {
                setCedhSelected(card)
            }
            else {
              setCedhSelected([])
            }
      };
     
    // Modifie l'icone de la carte quand elle est sélectionnée 
    const changeIcon = (id) => {
                if(cedhSelected.id !== id) {
                                return <CgAdd size={'2.5em'} color={'black'} />
                                }
                                else {
                                    return <CgCloseO size={'2.5em'} color={'red'} />
                                } 
    } 
    
    // Ajoute le cedh sélectionné par l'user pour le deck et récupère ses couleurs
    const addCedh = () => { 
            try {   
                    setCedh(cedhSelected)
                    setColors(cedhSelected.colors)
                    setCedhID(cedhSelected.id)

                 }   
            catch (error) {
                console.log(error); 
            }
    } 

    // Revenir au choix du commandant 
      const returnCedh = () => {
        setCedh([]);
        setCedhID("")
        setColors([])
      };

     // Créé le cedh
      const createCedh = async () => {
        try {
            setDisplayLoading(true);
            
            let imagePath = "";
            
            // Si une image a été sélectionnée, l'uploader
            if (selectedImageFile) {
              const formData = new FormData();
              formData.append('file', selectedImageFile);
              
              const cedhResponse = await axiosInstance.post("/f_all/uploadImage", formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
                  withCredentials: true
              });
              
              imagePath = cedhResponse.data;
            } else {
              // Si aucune image n'a été sélectionnée, utiliser l'image par défaut
              // On utilise un chemin simple pour éviter l'encodage HTML
              imagePath = "/uploads/default_deck.png";
            } 
            
            const deckRegister = {
              name,
              image: imagePath,
              format,
              colors,
              cedhID : Number(cedhID) // Conversion du string en number
            }

            const response = await axiosInstance.post('/f_user/addCedh', deckRegister, { withCredentials: true}); 
            const responseData = response.data

            const cardsId = []; 

            if (colors.includes("BLANC")) {
              cardsId.push(1);  
            }

            if (colors.includes("BLEU")) {
              cardsId.push(2);  
            }

            if (colors.includes("NOIR")) {
              cardsId.push(3); 
            }

            if (colors.includes("ROUGE")) {
              cardsId.push(4);  
            }

            if (colors.includes("VERT")) {
              cardsId.push(5);  
            }

            cardsId.push(6);


            const request = await axiosInstance.post(`f_user/addCardsOnDeck?cardId=${cardsId}&deckId=${responseData}`, null, { withCredentials: true });

            navigate(`/deckbuilding`, { state: { deckID: responseData }}) 
            setDisplayLoading(false);
        } catch (e) {
            setDisplayLoading(false);
            console.log(e)
        }     
    }

    useEffect(() => {
    const recupStorage = () => {
        try {
            const cedh = sessionStorage.getItem('ndCedhSelected');
            const fmt = sessionStorage.getItem('ndFormat');
            const filterName = sessionStorage.getItem('ndFilterName');
            const filterText = sessionStorage.getItem('ndFilterText');
            const inputValueMin = sessionStorage.getItem('ndInputValueMin');
            const inputValueMax = sessionStorage.getItem('ndInputValueMax');
            const inputManaCostMin = sessionStorage.getItem('ndInputManacostMin');
            const inputManaCostMax = sessionStorage.getItem('ndInputManacostMax');


            if (cedh) {
              setCedhSelected(JSON.parse(cedh));
               sessionStorage.removeItem('ndCedhSelected');
            }
            if (fmt) {
              setFormat(JSON.parse(fmt));
              sessionStorage.removeItem('ndFormat');
            }           

            if (filterName) {
                  setFilterName(JSON.parse(filterName));
                  sessionStorage.removeItem('ndFilterName');
              }
              if (filterText) {
                  setFilterText(JSON.parse(filterText));
                  sessionStorage.removeItem('ndFilterText');
              }
              if (inputValueMin) {
                  setInputValueMin(JSON.parse(inputValueMin));
                  sessionStorage.removeItem('ndInputValueMin');
              }
              if (inputValueMax) {
                  setInputValueMax(JSON.parse(inputValueMax));
                  sessionStorage.removeItem('ndInputValueMax');
              }
              if (inputManaCostMin) {
                  setInputManaCostMin(JSON.parse(inputManaCostMin));
                  sessionStorage.removeItem('ndInputManacostMin');
              }
              if (inputManaCostMax) {
                  setInputManaCostMax(JSON.parse(inputManaCostMax));
                  sessionStorage.removeItem('ndInputManacostMax');
              }
        } catch (error) {
            console.error("Erreur lors de la récupération du sessionStorage :", error);
        }
    };

    recupStorage();
}, []);


               
 
    return (   
    <Section> 
      { displayLoading && (
                <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
            )}
      <img src={backgroundCardsPage} className="background-image" alt="background" />

      <div className='new-deck-attributes'>
            {cedhID !== "" && image === "" &&(
              <div>
                <img className="new-cedh-image" src={cedh.image && cedh.image.startsWith('/uploads/') ? `http://localhost:8080${cedh.image}` : cedh.image} alt="Cedh mtg" onMouseEnter={()=>setDetailsCedh(true)} 
                onMouseLeave={()=>setDetailsCedh(false)} />
              </div>
            )}
            {colors.length !== 0 && image === "" && (
              <div className='new-deck-colors'>
                  {colors.map((color, index)  => (
                  <img key={index} src={getColorPics(color)} className="new-deck-colors-imgs" alt={color}/>                                
                  ))}
              </div>
            )}
            {format !== "" && image === "" && (
                    <p className='new-deck-format'>{format}</p>
            )}
            
            {name !== "" && image === "" && (
                    <h3 className='new-deck-name'>{name}</h3>
            )}
          </div>

        {/*Le choix du format*/} 
        {format === "" && (
            <div className='formats-group'>
                  <div className='pipeline-container'>
                    <Pipeline style={{borderTopLeftRadius: '15px', borderBottomLeftRadius: '15px', backgroundColor: '#5D3B8C', color: '#ffffff', zIndex: '0', fontFamily: 'MedievalSharp, cursive' }} text={"Format"}/>
                    <Pipeline style={{ backgroundColor: '#D3D3D3', color:'#000000', zIndex: '1', fontFamily: 'MedievalSharp, cursive' }} text={"Couleurs"}/>                 
                    <Pipeline style={{borderTopRightRadius: '15px', borderBottomRightRadius: '15px', backgroundColor: '#D3D3D3', color: '#000000', zIndex: '-1', fontFamily: 'MedievalSharp, cursive'}} text={"Attributs"}/>
                  </div>
                  <div className='pipeline-container-mobile'>
                    <Title style={{marginTop : '-2%', marginBottom : '2%'}} title={"Sélectionner un format"}/>
                  </div>
                  <div className='checkbox-format-container'>
                    <CheckboxFormat
                        onChange={(event) => selectFormat(event.target.value)}
                        filterFormats={selectedFormat}                   
                    />
                  </div>
                  <ButtonValid disabled={selectedFormat === ""} text={"Valider"} 
                  onClick={() => validFormat()}/>
            </div>
              )} 

        {/*Le choix du commandant*/}
        {format === "commander" && cedhID === "" && (
            <div className='cedh-add-container'>


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
                    <CheckboxColor attributs={existingColors} onChange={(event) => selectColors2(event.target.value)} filter={filterColors}
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
                    <CheckboxColor attributs={colors} onChange={(event) => selectColors2(event.target.value)} filter={filterColors}
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
   
                </div>
              </div>
              )}  
            
            <div className='title-cards-dispo-container'>
              <Title title='Commandants'/>
            </div>
            

            <div className='icon-return-container'>
                    <IoIosArrowDropleft className='icon-return'  size={'7em'} onClick={()=>returnFormat()} /> 
                  </div>

             <div className='display-objects-section'>

              <div className='map-cards-section'>
                  <div className='icon-return-container-mobile'>
                      <IoIosArrowDropleft className='icon-return'  size={'5em'} onClick={()=>returnFormat()} /> 
                    </div>
                  {cards.map(card => ( 
                      <div className="cards-details" key={card.id}>
                          <img className="cards-img" src={card.image && card.image.startsWith('/uploads/') ? `http://localhost:8080${card.image}` : card.image} alt="Card-image" onClick={() => navCard(card.id)}
                          onMouseEnter={() => hoveredCard(card.id) } onMouseOut={() => hoveredCard() }
                          />
                                            
                          <AddButton style={{ backgroundColor: 'white', width:'40px', height: '40px' }} onClick={()=> selectCedh(card)}
                          icon={changeIcon(card.id)}/>

                          <p className='card-page-likenumber' style={{position:'relative', marginTop: '10px'}}>{card.likeNumber} <FaHeart 
                          style={{position:'relative', marginBottom: '3px'}}
                           size={'0.9em'}  color='red' /></p>


                      {detailsCard && detailsCard.id === card.id && (
                      <img className="card-img-zoom" src={card.image && card.image.startsWith('/uploads/') ? `http://localhost:8080${card.image}` : card.image} alt="Card-image"/>
                      )}  
                  </div>
                  ))}
                <ButtonValid onClick={()=> addCedh()} disabled={cedhSelected.length < 1} style={{position: 'fixed', bottom: '0%'}}
                  text={'Ajouter'}/>   
                
              
              </div>

              { hasMore && (
                <button className='next-page-button' disabled={!hasMore} onClick={()=>displayMoreCardsWithID()}>Afficher plus</button> 
              )} 


          </div>
            
          
          </div>
        )} 

        {/*Le choix de la couleur*/}
        {format !== "" && format !== "commander" && colors.length === 0 && ( 
          <div className='color-group'>
                <div className='pipeline-container'>
                    <Pipeline style={{borderTopLeftRadius: '15px', borderBottomLeftRadius: '15px', backgroundColor: '#D3D3D3', color: '#000000', zIndex: '0', fontFamily: 'MedievalSharp, cursive'  }}  text={"Format"}/>
                    <Pipeline style={{ backgroundColor: '#5D3B8C', color:'#ffffff', zIndex: '1', fontFamily: 'MedievalSharp, cursive' }} text={"Couleurs"}/>
                    <Pipeline style={{borderTopRightRadius: '15px', borderBottomRightRadius: '15px', backgroundColor: '#D3D3D3', color: '#000000', zIndex: '-1', fontFamily: 'MedievalSharp, cursive'}} text={"Attributs"}/>
                </div> 
                <div className='title-container-mobile'>

                  <Title style={{marginTop : '2%', marginBottom : '2%'}} title={"Couleurs du deck"}/>
              </div>
            
            <div className='deck-colors-container'>
            {existingColors.map((color, index) =>  
                <div style={{display:'flex', gap:'10%'}} key={index}>
                  <input className="newDeck-checkbox-colors" type="checkbox" name={"nom"+ color} value={color} 
                  onChange={(event) => selectColors(event.target.value)} 
                  checked={selectedColors.includes(color)} style={{display:(displayColor(color))}}/>
                  <img src={getColorPics(color)} className="deck-colors-img" alt={color} style={{display:(displayColor(color))}}/>
                </div>
                )}
                
            </div>
            

            <div className='icon-return-container'>
                    <IoIosArrowDropleft className='icon-return'  size={'7em'} onClick={()=>returnFormat()} /> 
            </div>

            <div className='icon-return-container-mobile'>
                    <IoIosArrowDropleft className='icon-return'  size={'4em'} onClick={()=>returnFormat()} /> 
            </div>
            
            <ButtonValid disabled={selectedColors.length === 0} text={"Valider"} onClick={() => validColors()}/>
          </div>
            )}

         {/*Le choix du nom et de l'image*/}
        {colors.length !== 0 && name === "" && (
          <div className="name-group">
              <div className='pipeline-container'>
                  <Pipeline style={{borderTopLeftRadius: '15px', borderBottomLeftRadius: '15px', backgroundColor: '#D3D3D3', color: '#000000', zIndex: '0', fontFamily: 'MedievalSharp, cursive' }} text={"Format"}/>
                  <Pipeline style={{backgroundColor: '#D3D3D3', color:'#000000', zIndex: '1', fontFamily: 'MedievalSharp, cursive' }} text={"Couleurs"}/>
                  <Pipeline style={{borderTopRightRadius: '15px', borderBottomRightRadius: '15px', backgroundColor: '#5D3B8C', color: '#ffffff', zIndex: '-1', fontFamily: 'MedievalSharp, cursive'}} text={"Attributs"}/>
              </div>
              <div className='title-container-mobile'>

                  <Title style={{marginTop : '2%', marginBottom : '2%'}} title={"Attributs du deck"}/>
              </div>

                  <div className='attribut-container' style={{ backgroundImage: `url(${backgroundPopup})`}}>
                    <div className='input-img-container'>
                        <input
                          className='input-deck-img'
                          type="file"
                          accept="image/*" 
                          onChange={(e) => selectImage(e)}
                        />
                      </div>
                      <div className='input-name-container'>
                        <img className='deck-selected-img' src={selectedImage} alt="deck-img" />
                        <InputName onChange={(e) => setSelectedName(e.target.value)}  placeholder='Entrer le nom du deck'
                        onClick={() => validName()} disabled={selectedName.length < 8 || selectedName.length > 20}/>
                        <p className="instruction-para"> Le nom doit contenir entre 8 et 20 caractères </p>
                      </div>

                      <div className='icon-return-container-mobile'>
                      <IoIosArrowDropleft className='icon-return'  size={'5em'} onClick={()=>(returnColors(), returnCedh())} /> 
                    </div>
                      
                  </div>
                  <div className='icon-return-container'>
                    <IoIosArrowDropleft className='icon-return'  size={'7em'} onClick={()=>(returnColors(), returnCedh())} /> 
                  </div>

                  <ButtonValid disabled={selectedName.length < 8 || selectedName.length > 25} 
                  text={"Valider"} onClick={() => validName()}/>
              

          </div> 
          )} 

        {/*La carte finale pour les decks non commander*/}
        {colors.length !== 0 && format !== "" && format !== "commander" && name !== "" && image !== "" && (
          <div className="final-card-group">
              <div className='pipeline-container'>
                  <Pipeline style={{borderTopLeftRadius: '15px', borderBottomLeftRadius: '15px', backgroundColor: 'rgba(176, 176, 176, 1)', color: 'white', zIndex: '0' }} text={"Format"}/> 
                  <Pipeline style={{ backgroundColor: 'rgba(176, 176, 176, 1)', color: 'white', zIndex: '1' }} text={"Couleurs"}/>                 
                  <Pipeline style={{borderTopRightRadius: '15px', borderBottomRightRadius: '15px', backgroundColor: 'rgba(176, 176, 176, 1)', color: 'white', zIndex: '-1'}} text={"Attributs"}/>
              </div>

             
              <div className="new-deck-body-container">

               {/*La carte finale format desktop*/}
                <div className="new-deck-body" style={{ backgroundImage: `url(${backgroundPopup})`}}>
                          <h1 className='deck-name'>{name}  <ButtonModif onClick={() => returnName()} style={{marginTop: '-20px'}}/></h1>
  
                          <div className="deck-content">
                              <img className="deck-selected-img" src={image.startsWith('/uploads/') ? `http://localhost:8080${image}` : image} alt="Deck mtg"/>

                              <div className="deck-selected-attributs" >
                                
                                  <div className='card-line-attribut'>
                                      <h4 className='new-deck-line-title'> Format : </h4>
                                      <p className='new-deck-format'>{format} </p>
                                      <ButtonModif onClick={() => returnFormat()} /> 
                                  </div>  

                                  <div className='card-line-attribut'>
                                      <h4 className='new-deck-line-title' > Couleurs : </h4> 
                                      {colors && colors.length > 0 && (
                                        <div className='new-deck-colors-mapping' >
                                          {colors.map((color, index)  => (
                                          <img key={index} src={getColorPics(color)} className="new-deck-colors-imgs" alt={color}/>                                
                                          ))}
                                           <ButtonModif onClick={() => returnColors()} /> 
                                        </div>
                                      )}
                                     
                                  </div> 
                                </div>
                                  
                          </div>  
                        <div className='valid-form-container'>      
                          <button className='valid-popup' disabled={displayLoading} onClick={() => createDeck()}><h4>Créer le deck</h4></button> 
                        </div>    
                </div>  
                
                
                {/*La carte finale format medium*/}
                <h2 className='deck-card-medium-name'>{name} <ButtonModif onClick={() => returnName()} /></h2>
                <div className="deck-card-medium">
                                    <div className="img-container">
                                                          <img className="new-deck-img-mobile" src={image.startsWith('/uploads/') ? `http://localhost:8080${image}` : image} alt="Deck mtg"/>
                                    </div>
          
                
                  <div className="new-deck-body-mobile" style={{ backgroundImage: `url(${backgroundPopup})`}} >
                                                              
                    <div className='card-line-attribut'>                        
                                                    <h4 className='new-deck-line-title'> Couleurs : </h4> 
                                                    <div className='color-modif'>
                                                      {colors && colors.length > 0 && (
                                                          <div className='mapping-color'>
                                                            {colors.map((color, index)  => (
                                                          <img key={index} src={getColorPics(color)} className="color-img-new-deck" alt={color}/>                                
                                                      ))}
                                                          </div>
                                                      )} 
                                                      <ButtonModif onClick={() => returnColors()} />
                                                    </div>
                      </div>
                      <div className='card-line-attribut'>              
                                  <h4 className='new-deck-line-title' style={{marginTop: '10px'}}> Format : </h4> 
                                  <p className='new-deck-format' >{format}</p>
                                  <ButtonModif onClick={() => returnFormat()} />
                      </div>
                                                                                                      
                      <button style={{marginBottom: '5%', marginTop: '5%', paddingLeft: '2%', paddingRight: '2%'}} className="valid-popup" disabled={displayLoading} onClick={() => createDeck() } ><h3>Créer le deck</h3></button>                                          
                    </div> 
                </div> 

              </div>

                {/*La carte finale format mobile*/}                                         
                <h2 className='deck-card-mobile-name'>{name} <ButtonModif onClick={() => returnName()} /></h2>
                <div className="deck-card-mobile">
                                    <div className="img-container">
                                                          <img className="new-deck-img-mobile" src={image.startsWith('/uploads/') ? `http://localhost:8080${image}` : image} alt="Deck mtg"/>
                                    </div>
          
                
                  <div className="new-deck-body-mobile" style={{ backgroundImage: `url(${backgroundPopup})`}} >
                                                              
                    <div className='card-line-attribut'>                        
                                                    <h4 className='new-deck-line-title'> Couleurs : </h4> 

                                                    <div className='color-modif'>
                                                      {colors && colors.length > 0 && (
                                                          <div className='mapping-color'>
                                                            {colors.map((color, index)  => (
                                                          <img key={index} src={getColorPics(color)} className="color-img-new-deck" alt={color}/>                                
                                                      ))}
                                                          </div>
                                                      )} 
                                                      <ButtonModif onClick={() => returnColors()} />
                                                    </div>
                      </div>
                      <div className='card-line-attribut'>              
                                                                    <h4 className='new-deck-line-title'> Format : </h4> 
                                                                    <p className='new-deck-format' >{format}</p>
                                                                    <ButtonModif onClick={() => returnFormat()} />
                      </div>
                                                                                                      
                      <button style={{marginBottom: '5%', marginTop: '5%', paddingLeft: '2%', paddingRight: '2%'}} className='valid-form' 
                      disabled={displayLoading} onClick={() => createDeck()} ><h4>Créer le deck</h4></button>                                          
                    </div> 
                </div> 
              

              
          </div>

        )}

        {/*La carte finale pour les decks commander*/}
        {colors.length !== 0 && format === "commander" && cedhID !== "" && name !== "" && image !== "" && (
          <div className="final-card-group">

              <div className='pipeline-container'>
                  <Pipeline style={{borderTopLeftRadius: '15px', borderBottomLeftRadius: '15px', backgroundColor: 'rgba(176, 176, 176, 1)', color: 'white', zIndex: '0' }} text={"Format"}/> 
                  <Pipeline style={{ backgroundColor: 'rgba(176, 176, 176, 1)', color: 'white', zIndex: '1' }} text={"Couleurs"}/>                 
                  <Pipeline style={{borderTopRightRadius: '15px', borderBottomRightRadius: '15px', backgroundColor: 'rgba(176, 176, 176, 1)', color: 'white', zIndex: '-1'}} text={"Attributs"}/>
              </div>

              


              <div className="new-deck-body-container" >
                <div className="new-deck-body" style={{ backgroundImage: `url(${backgroundPopup})`}}>
                          <h1 className='deck-name'>{name}  <ButtonModif onClick={() => returnName()} style={{marginTop: '-20px'}}/></h1>
  
                          <div className="deck-content">
                              <img className="deck-selected-img" src={image.startsWith('/uploads/') ? `http://localhost:8080${image}` : image} alt="Deck mtg"/>

                              <div className="deck-selected-attributs" >

                                  <div className='cedh-line-attribut'>
                                      <h4 className='new-deck-line-title' > Commandant : </h4>
                                      <h3 className='new-deck-cedh' onMouseEnter={() => hoveredCard(cedh.id) } onMouseOut={() => hoveredCard()}
                                        > {cedh.name}<ButtonModif onClick={() => returnCedh()} 
                                        style={{marginTop: '-20px'}}  /> </h3>
                                      {detailsCard && detailsCard.id === cedh.id && (
                                            <img className="cedh-img-zoom" src={cedh.image && cedh.image.startsWith('/uploads/') ? `http://localhost:8080${cedh.image}` : cedh.image} alt="Card-image"/>
                                        )} 
                                </div> 
                                
                                  <div className='card-line-attribut'>
                                      <h4 className='new-deck-line-title'> Format : </h4>
                                      <p className='new-deck-format'>{format} </p>
                                      <ButtonModif onClick={() => returnFormat()} /> 
                                  </div>  

                                  <div className='card-line-attribut'>
                                      <h4 className='new-deck-line-title' > Couleurs : </h4> 
                                      {colors && colors.length > 0 && (
                                        <div className='new-deck-colors-mapping' >
                                          {colors.map((color, index)  => (
                                          <img key={index} src={getColorPics(color)} className="new-deck-colors-imgs" alt={color}/>                                
                                          ))}
                                        </div>
                                      )}
                                     
                                  </div> 
                                </div>
                                  
                          </div>  
                        <div className='valid-form-container'>      
                          <button className='valid-popup' disabled={displayLoading} onClick={() => createCedh()}><h4 className='valid-popup-title'>Créer le deck</h4></button> 
                        </div>    
                </div> 
              </div>
    


              <h2 className='deck-card-medium-name'>{name} <ButtonModif onClick={() => returnName()} /></h2>
                <div className="deck-card-medium">
                                    <div className="img-container">
                                                          <img className="new-deck-img-mobile" src={image.startsWith('/uploads/') ? `http://localhost:8080${image}` : image} alt="Deck mtg"/>
                                    </div>
          
                
                  <div className="new-deck-body-mobile" style={{ backgroundImage: `url(${backgroundPopup})`}} >


                    <div className='cedh-line-attribut'>
                                      <h4 className='new-deck-line-title' > Commandant : </h4>
                                      <h3 className='new-deck-cedh' onMouseEnter={() => hoveredCard(cedh.id) } onMouseOut={() => hoveredCard()}
                                        > {cedh.name}<ButtonModif onClick={() => returnCedh()} 
                                        style={{marginTop: '-20px'}}  /> </h3>
                                      {detailsCard && detailsCard.id === cedh.id && (
                                            <img className="cedh-img-zoom" src={cedh.image && cedh.image.startsWith('/uploads/') ? `http://localhost:8080${cedh.image}` : cedh.image} alt="Card-image"/>
                                        )} 
                                </div> 
                                                              
                    <div className='card-line-attribut'>                        
                                                    <h4 className='new-deck-line-title'> Couleurs : </h4> 
                                                    <div className='color-modif'>
                                                      {colors && colors.length > 0 && (
                                                          <div className='mapping-color'>
                                                            {colors.map((color, index)  => (
                                                          <img key={index} src={getColorPics(color)} className="color-img-new-deck" alt={color}/>                                
                                                      ))}
                                                          </div>
                                                      )} 
                                                    </div>
                      </div>
                      <div className='card-line-attribut'>              
                                  <h4 className='new-deck-line-title' style={{marginTop: '10px'}}> Format : </h4> 
                                  <p className='new-deck-format' >{format}</p>
                                  <ButtonModif onClick={() => returnFormat()} />
                      </div>
                                                                                                      
                      <button style={{marginBottom: '5%', marginTop: '5%', paddingLeft: '2%', paddingRight: '2%'}} className="valid-form" 
                      onClick={() => createCedh()} disabled={displayLoading} ><h4>Créer le deck</h4></button>                                          
                    </div> 
                </div>  

              

              <h2 className='deck-card-mobile-name'>{name} <ButtonModif onClick={() => returnName()} style={{marginLeft : '10px'}} /></h2>
              <div className="deck-card-mobile" >
                                  <div className="img-container">
                                                        <img className="new-deck-img-mobile" src={image.startsWith('/uploads/') ? `http://localhost:8080${image}` : image} alt="Deck mtg"/>
                                  </div>
          
              
                <div className="new-deck-body-mobile" >

                    <div className='card-line-attribut'>
                                                  <h4 className='format'>Commandant :</h4>
                                                  <h2 className='card-cedh'><strong>{cedh.name} <ButtonModif style={{marginTop : '-10px'}} onClick={() => returnCedh()} /></strong></h2>
                    </div>
                                                             
                    <div className='card-line-attribut'>                        
                                                  <h4 className='color'> Couleurs : </h4> 
                                                  {colors && colors.length > 0 && (
                                                      <div className='mapping-color'>
                                                        {colors.map((color, index)  => (
                                                      <img key={index} src={getColorPics(color)} className="color-img-new-deck" alt={color}/>                                
                                                  ))}
                                                      </div>
                                                  )} 
                    </div>
                    <div className='card-line-attribut'>              
                                                  <h4 className='format'> Format : </h4> 
                                                  <h4 className='card-format' style={{ position: 'relative' }}>{format}</h4>
                                                  <ButtonModif onClick={() => returnFormat()} />
                    </div>
                                                                                                    
                     <button style={{marginBottom: '5%', marginTop: '5%', paddingLeft: '2%', paddingRight: '2%'}}
                     disabled={displayLoading} className="valid-popup" onClick={() => createCedh()} ><h4 className='valid-popup-title'>Créer le deck</h4></button>                                          
                  </div> 
              </div> 
              


        </div>

              

        )}
      
    </Section>
);
}

export default NewDeck
