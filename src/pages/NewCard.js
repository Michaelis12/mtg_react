import  "./css/NewCard.css"
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../api/axiosInstance";
import backgroundCardsPage from "../assets/background_cardsPage2.jpg"
import Section from '../components/section';
import CheckboxAddImage from '../components/checkboxAddImage'
import defaultImg from "../assets/mtg-card-back.jpg"
import Title from "../components/title"
import ButtonValidPopup from "../components/buttonValidPopup";
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import incolore from "../assets/incolore-mtg.png"
import innistrad from '../assets/innistrad.png';
import ixalan from '../assets/ixalan.png';
import friches_eldraine from '../assets/friches_eldraine.png';
import meutre_manoir from '../assets/meurtre_manoir.png';
import ravinca from '../assets/ravinca.png';
import modernHorizon from '../assets/modern_horizon.png';
import bloomburrow from '../assets/bloomburrow.png';
import { MdPublishedWithChanges } from "react-icons/md";
import CheckboxAdd from '../components/checkboxAdd'
import loading from "../assets/loading.gif"
import backgroundPopup from "../assets/background_white.png"


const NewCard = function () { 

    const navigate = useNavigate();
    
    const [name, setName] = React.useState("")
    const [text, setText] = React.useState("")
    const [image, setImage] = React.useState("")
    const [manaCost, setManaCost] = React.useState("")
    const [value, setValue] = React.useState("")
    const [colors, setColors] = React.useState([])
    const [existingColors, setExistingColors] = React.useState([])
    const [formats, setFormats] = React.useState([])
    const [type, setType] = React.useState("")
    const [legendary, setLegendary] = React.useState("")
    const [rarity, setRarity] = React.useState("")
    const [edition, setEdition] = React.useState("")
    const [completeState, setCompleteState] = React.useState(false)
    const [displayLoading, setDisplayLoading] = useState(false);

    

        // Affiche une image par défaut ou l'image entré par l'admin
        const displayImage = () => {
            if(image !== "") {
                return image && image.startsWith('/uploads/') ? `https://localhost:8443${image}` : image;
            }
            else {
                return defaultImg;
            }
        }

         // Changer l'image
        const changeImage = async (event) => {
            const file = event.target.files[0];

            if (file) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    const uploadRes = await axiosInstance.post("https://localhost:8443/f_all/uploadImage", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        withCredentials: true
                    });
                    
                    // Stocker le chemin retourné au lieu du base64
                    setImage(uploadRes.data);
                } catch (error) {
                    console.error("Erreur lors de l'upload de l'image:", error);
                    alert("Erreur lors de l'upload de l'image");
                }
            }
        };
        

      // Récupère les 5 couleurs cumulables pour un 1er checkout
      useEffect(() => {
          const getColors = async () => {
              try {
                  const request = await axiosInstance.get(`/f_all/getColors`);
  
                  const response = request.data
      
                  setExistingColors(response)
                  //setColors(response)
              }   
              catch (error) {
                  console.log(error);
              }
          }
          getColors();
          }, [existingColors]);

          // N'affiche pas INCOLORE dans le 1er checkout
          const displayColor = (value) => {
            if(value === "INCOLORE") {
                return "none";
          }
        }
          // Récupère les images des couleurs
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
          
        // Permt un choix multiple pour les couleurs
        const selectColors = (newColor) => {
        if(newColor !== 'INCOLORE') {
                setColors(prevColors => {
                // Si la couleur existe déjà dans le tableau, on la retire
                if (prevColors.includes(newColor)) {
                    return prevColors.filter(color => color !== newColor);  // Retire la couleur
                } else {
                    return [...prevColors.filter(color => color !== 'INCOLORE'), newColor];  // Ajoute la couleur au tableau et retire INCOLORE
                }
                });
            }
        else {setColors([newColor])} // Retire toutes les autres couleurs et les remplace par INCOLORE
        };


      const [existingFormats, setExistingFormats] = React.useState([])
    
    // Map les formats existants
    useEffect(() => {
        const getFormats = async () => {
            try {
                const request = await axiosInstance.get(`/f_all/getFormats`);

                const response = request.data.map(format => format.name);

                setExistingFormats(response);
                //setFormats(response);
            }   
            catch (error) {
                console.log(error);
            }
        }
        getFormats(); 
        }, []); 

      const selectFormats = (newFormat) => {
        setFormats(prevFormats => {
          if (prevFormats.includes(newFormat)) {
            return prevFormats.filter(format => format !== newFormat);  
          } else {
            return [...prevFormats, newFormat];  
          }
        });
      };

    const [existingRarities, setExistingRarities] = React.useState([])

    useEffect(() => {
        const getRarities = async () => {
            try {
                const raritiesRequest = await axiosInstance.get(`/f_all/getRarities`);

                const response = raritiesRequest.data
    
                setExistingRarities(response)
                //setRarity(response)
            }   
            catch (error) {
                console.log(error);
            }
        }
        getRarities();
        }, []);

    const [existingTypes, setExistingTypes] = React.useState([])

    useEffect(() => {
        const getTypes = async () => {
            try {
                const typesRequest = await axiosInstance.get(`/f_all/getTypes`);

                const response = typesRequest.data
    
                setExistingTypes(response)
                //setType(response)
            }   
            catch (error) {
                console.log(error);
            }
        }
        getTypes(); 
        }, []);

    
    const [existingEditions, setExistingEditions] = React.useState([])

    useEffect(() => {
        const getEditions = async () => {
            try {
                const editionsRequest = await axiosInstance.get(`/f_all/getEditions`);

                const response = editionsRequest.data
    
                setExistingEditions(response)
                //setEdition(response)
            }   
            catch (error) {
                console.log(error);
            }
        }
        getEditions();
        }, []);


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
    
        // Affichage de l'image correspondant à l'édition
        const getEditions = (edition) => {
    
          if (edition === "MYSTICAL") {
            return innistrad;
          } else if (edition === "LES_FRICHES_D_ELDRAINE") {
            return friches_eldraine;
          } else if (edition === "LES_CAVERNES_OUBLIÉES_D_IXALAN") {
            return ixalan;
          } else if (edition === "RAVNICA_REMASTERED") {
            return ravinca;
          } else if (edition === "MURDERS_AT_KARLOV_MANOR") {
            return meutre_manoir;
          } else if (edition === "MODERN_HORIZONS_3") {
            return modernHorizon;
          } else if (edition === "BLOOMBURROW") {
            return bloomburrow;
          }
    
          return null;
        };

    // Active le bouton
    useEffect(() => {
        const verifState = () => { 
            
            if(name !== "" &&  value !== "" && image !== "" &&
                formats.length > 0 && colors.length > 0 && type !== "" && rarity !== "") {
                    setCompleteState(true)
                }
        }
        verifState();
    },[name, text, image, manaCost, value, formats, colors, type, rarity, edition]);

    const [alertCardSend, setAlertCardSend] = React.useState(false)
    const [alertCardDontSend, setAlertCardDontSend] = React.useState(false)
    const [popupPub, setPopupPub]= React.useState(false)

    // Créer la carte 
    const addCard = async () => {
        try {
            setAlertCardSend(false)
            setAlertCardDontSend(false)
            setDisplayLoading(true);
            const card = {
                name,
                text, 
                image,
                manaCost, 
                value, 
                formats,
                colors, 
                type, 
                legendary, 
                rarity, 
                edition
            }

            const response = await axiosInstance.post('/f_admin/addCard', card, { withCredentials: true });
            setAlertCardSend(true)
            setDisplayLoading(false);
            window.location.reload();
            
        }catch (e) {
            setDisplayLoading(false);
            setAlertCardDontSend(true)
        } 

        
    }
    const popupConfirm = () => { 
            window.location.reload();
        }
    
    return ( 
    <Section>
        { displayLoading && (
            <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
        )}
        <img src={backgroundCardsPage} className="background-image" alt="background" />

    <Title title={"Créer une carte"}/>

    <div className="new-card-container">


        {/* Version desktop */}   
        <div className="form-edit-card" style={{ backgroundImage: `url(${backgroundPopup})`}}>
                
                <div className='textarea-container'>
                    <textarea
                        className="input-name"
                        id="deck-name"
                        name="deck-name"
                        rows="1"
                        cols="33"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom de la carte"
                    />
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
                        <img className='card-selected-img' src={displayImage()} alt="deck-img" />
                    </div>
                    <div className='setAttributs-card-checkout'>
                        <h5 className='card-line-title' >Couleurs : </h5>                        
                            <CheckboxAddImage
                            style={{marginBottom: '5%'}}
                            attributs={existingColors}
                            filter={colors}
                            onChange={(event) => selectColors(event.target.value)}
                            image={getColorPics}
                            classNameImg='set-colors-img'
                            />
                        <h5 className='card-line-title' >Formats : </h5>
                        <CheckboxAdd attributs={existingFormats} filter={formats} style={{marginBottom: '5%'}}
                            classNameP='card-format'
                            styleL={{width: '150px'}}
                            onChange={(event) => selectFormats(event.target.value)}/>
                        <h5 className='card-line-title' >Rareté : </h5>
                        <CheckboxAdd attributs={existingRarities} filter={rarity} style={{marginBottom: '5%'}}
                            styleL={{width: '140px'}}
                            methodBackground={getBackgroundColor}
                            classNameP="card-selected-rarity"
                            onChange={(event) => setRarity(event.target.value)}/>
                        <h5 className='card-line-title' >Type : </h5>
                        <CheckboxAdd attributs={existingTypes} filter={type} style={{marginBottom: '5%'}}
                            styleL={{width: '160px'}}
                            classNameP="checkbox-type-p"
                            onChange={(event) => setType(event.target.value)}/>
                        {/* Légendaire */}
                        {type === 'CREATURE' && (
                            <div className="compenant-checkbox-add" style={{marginBottom: '5%', width: '100%', flexDirection: 'column', alignItems: 'center'}} >
                                <div style={{display : 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <li>
                                        <input 
                                            className="checkbox-legendary" 
                                            type="checkbox" 
                                            name={"legendary"}  
                                            onClick={() => setLegendary("legendary")} 
                                            onChange={() => {
                                                if (legendary !== "legendary") {
                                                    setLegendary("legendary");
                                                } else {
                                                    setLegendary(null);
                                                }}}
                                        /> Légendaire
                                    </li>
                                    
                                </div>
                            </div>
                        )}
                        <h5 className='card-line-title' >Edition : </h5>
                        <CheckboxAddImage attributs={existingEditions} filter={edition} style={{marginBottom: '5%'}}
                            styleL={{height: '100px', backgroundColor: "#f3eaff"}}
                            image={getEditions}
                            classNameImg='checkbox-edition-img'
                            onChange={(event) => setEdition(event.target.value)}/>
                        <div className="compenant-checkbox-add" style={{marginBottom: '5%', width: '100%', flexDirection: 'column', alignItems: 'center'}}>
                            <h5 className='card-line-title' >Texte :</h5>
                            <textarea
                                style={{minHeight: '150px'}}
                                className="input-card-text"
                                id="card-text"
                                name="deck-name"
                                rows="9"
                                cols="33"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>
                        

                        <div className="input-mana-cost-card">
                        <h5 className='card-line-title'  style={{marginTop: '5px'}}>Cout en mana :</h5>
                        <input className="input-card-number" type="number" id="cout-mana" name="cout-mana" 
                            value={manaCost} onChange={(e) => setManaCost(e.target.value)} required/>
                        </div>

                        <div className="input-value-card" style={{marginTop: '3%'}}>
                        <h5 className='card-line-title' style={{marginTop: '5px'}}>Valeur € :</h5>
                        <input className="input-card-number" type="number" value={value}
                        step="0.01" onChange={(e) => setValue(e.target.value)} required />
                    </div>
                    </div>
                </div>
                
                <div className='valid-button-container'>
                    <ButtonValidPopup   disabled={!completeState} onClick={() => addCard()}/>
                    {/* Alertes */}
                    { alertCardSend &&(
                        <h5 className="alert-send-card" style={{color: 'green'}}>Carte publiée !</h5>
                    )}
                    { alertCardDontSend && (
                       <h5 className="alert-send-card" style={{color: 'red'}}>Echec de l'envoi</h5>
                    )}
                </div>
                
        </div>


        {/* Version medium */}
        <div className='setAttributs-card-medium' style={{ backgroundImage: `url(${backgroundPopup})`, maxHeight: '90vh' }}>
        {/* Header avec nom de la carte */}
        <div className='setAttributs-card-mobile-header'>
            <textarea 
            className="input-name" 
            id="deck-name" 
            name="deck-name" 
            rows="1" 
            cols="33" 
            value={name}
            maxLength={25}
            onChange={(e) => setName(e.target.value)} 
            placeholder="Nom de la carte"
            />
        </div>

        {/* Image de la carte */}
        <div className='setAttributs-card-mobile-img'>
            <input
            className='input-deck-img'
            style={{position: 'absolute', marginTop: '-15%'}}
            type="file"
            accept="image/*"
            onChange={(e) => changeImage(e)}
            />
            <img className='card-selected-img' src={displayImage()} alt="deck-img" />
        </div>

        {/* Contenu principal */}
        <div className='setAttributs-card-img-checkout-mobile'  style={{overflowY: 'auto' }}>
            <div className='setAttributs-card-checkout' style={{ width: '100%' }}> 

            {/* Couleurs */}
            <h5 className='card-line-title'>Couleurs : </h5>
            <CheckboxAddImage
                style={{ marginBottom: '5%' }}
                attributs={existingColors}
                filter={colors}
                onChange={(event) => selectColors(event.target.value)}
                image={getColorPics}
                classNameImg='set-colors-img'
            />

            {/* Formats */}
            <h5 className='card-line-title'>Formats : </h5>
            <CheckboxAdd
                attributs={existingFormats}
                filter={formats}
                style={{ marginBottom: '5%' }}
                classNameP='card-format'
                styleL={{ width: '150px' }}
                onChange={(event) => selectFormats(event.target.value)}
            />

            {/* Rareté */}
            <h5 className='card-line-title'>Rareté : </h5>
            <CheckboxAdd
                attributs={existingRarities}
                filter={rarity}
                style={{ marginBottom: '5%' }}
                styleL={{ width: '160px' }}
                methodBackground={getBackgroundColor}
                classNameP="card-selected-rarity"
                onChange={(event) => setRarity(event.target.value)}
            />

            {/* Type */}
            <h5 className='card-line-title'>Type : </h5>
            <CheckboxAdd
                attributs={existingTypes}
                filter={type}
                style={{ marginBottom: '5%' }}
                styleL={{ width: '150px' }}
                classNameP="checkbox-type-p"
                onChange={(event) => setType(event.target.value)}
            />

            {/* Légendaire */}
            {type === 'CREATURE' && (
                <div className="input-legendary-container">
                <li>
                    <input 
                    className="checkbox-legendary" 
                    type="checkbox" 
                    name={"legendary"}  
                    checked={legendary === "legendary"}
                    onChange={(e) => {
                        if (e.target.checked) {
                        setLegendary("legendary");
                        } else {
                        setLegendary(null);
                        }
                    }}
                    /> Légendaire
                </li>
                </div>
            )}

            {/* Edition */}
            <h5 className='card-line-title'>Edition : </h5>
            <CheckboxAddImage
                style={{ marginBottom: '5%' }}
                styleL={{ height: '70px', backgroundColor: "#f3eaff" }}
                attributs={existingEditions}
                filter={edition}
                onChange={(event) => setEdition(event.target.value)}
                image={getEditions}
                classNameImg='checkbox-edition-img'
            />

            {/* Texte de la carte */}
            <div className="compenant-checkbox-add" style={{ marginBottom: '5%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h5 className='card-line-title'>Texte :</h5>
                <textarea
                className="input-card-text"
                id="card-text"
                name="deck-name"
                rows="5"
                cols="33"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ width: '80%' }}
                />
            </div>

            {/* Coût en mana */}
            <div className="input-mana-cost-card">
                <h5 className='card-line-title' style={{ marginTop: '5px' }}>Coût en mana :</h5>
                <input 
                className="input-card-number" 
                type="number" 
                id="cout-mana" 
                name="cout-mana" 
                onChange={(e) => setManaCost(e.target.value)} 
                disabled={type === "TERRAIN"}
                required
                />
            </div>

            {/* Valeur € */}
            <div className="input-value-card" style={{ marginTop: '3%' }}>
                <h5 className='card-line-title' style={{ marginTop: '5px' }}>Valeur € :</h5>
                <input 
                className="input-card-number" 
                type="number" 
                step="0.01" 
                onChange={(e) => setValue(e.target.value)}
                required 
                />
            </div>
            </div>
        </div>


        {/* Bouton de validation */}
        <div className='valid-button-container' style={{padding: '5%'}}>
            <ButtonValidPopup disabled={!completeState} onClick={() => addCard()} />
            {/* Alertes */}
            { alertCardSend &&(
                <h4 className="alert-send-card" style={{color: 'green', position : 'absolute', marginTop: "100px"}}>Carte publiée !</h4>
            )}
            { alertCardDontSend && (
                <h5 className="alert-send-card" style={{color: 'red', position : 'absolute', marginTop: "100px"}}>Échec de l'envoi</h5>
            )}
        </div>
    </div>


        {/* Version mobile */}
        <div className="setAttributs-card-mobile" style={{ backgroundImage: `url(${backgroundPopup})`, maxHeight: '90vh'}}>
                {/* Header avec titre */}
                <div className='setAttributs-card-mobile-header'>
                <textarea 
                            className="input-name" 
                            id="deck-name" 
                            name="deck-name" 
                            rows="2" 
                            cols="33" 
                            value={name}
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Nom de la carte"
                        />
                </div>
                
                {/* Image en haut */}
                <div className='setAttributs-card-mobile-img'>
                    <input
                        className='input-deck-img'
                        style={{position:'absolute', marginTop:'-15%'}}
                        type="file"
                        accept="image/*" 
                        onChange={(e) => changeImage(e)}
                    />
                    <img className='card-selected-img' src={displayImage()} alt="deck-img" />
                </div>
                
                {/* Contenu principal */}
                <div className='setAttributs-card-mobile-content' style={{overflowY: 'auto' }}>
                    
                    {/* Couleurs */}
                    <div className='setAttributs-card-mobile-section'>
                        <h5 className='card-line-title'>Couleurs : </h5>
                        <CheckboxAddImage
                            style={{marginBottom: '5%'}}
                            attributs={existingColors}
                            filter={colors}
                            onChange={(event) => selectColors(event.target.value)}
                            image={getColorPics}
                            classNameImg='set-colors-img'
                            />
                    </div>
                    
                    {/* Formats */}
                    <div className='setAttributs-card-mobile-section'>
                        <h5 className='card-line-title'>Formats : </h5>
                        <CheckboxAdd 
                            attributs={existingFormats} filter={formats} style={{marginBottom: '5%'}}
                            classNameP='card-format'
                            styleL={{width: '100px'}}
                            onChange={(event) => selectFormats(event.target.value)}
                        />

                    </div>

                    {/* Type */}
                    <div className='setAttributs-card-mobile-section'>
                        <h5 className='card-line-title'>Type : </h5>
                        <CheckboxAdd attributs={existingRarities} filter={rarity} style={{marginBottom: '5%'}}
                            styleL={{width: '100px'}}
                            methodBackground={getBackgroundColor}
                            classNameP="card-selected-rarity"
                            onChange={(event) => setRarity(event.target.value)}
                        />

                    </div>

                    {/* Légendaire */}
                        {type === 'CREATURE' && (
                            <div className="compenant-checkbox-add" style={{marginBottom: '5%', width: '100%', flexDirection: 'column', alignItems: 'center'}} >
                                <div style={{display : 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <li>
                                        <input 
                                            className="checkbox-legendary" 
                                            type="checkbox" 
                                            name={"legendary"}  
                                            onClick={() => setLegendary("legendary")} 
                                            onChange={() => {
                                                if (legendary !== "legendary") {
                                                    setLegendary("legendary");
                                                } else {
                                                    setLegendary(null);
                                                }}}
                                        /> Légendaire
                                    </li>
                                    
                                </div>
                            </div>
                        )}

                    {/* Rareté */}
                    <div className='setAttributs-card-mobile-section'>
                        <h5 className='card-line-title'>Rareté : </h5>
                        <CheckboxAdd 
                            attributs={existingTypes} filter={type} style={{marginBottom: '5%'}}
                            styleL={{width: '100px'}}
                            classNameP="checkbox-type-p"
                            onChange={(event) => setType(event.target.value)}
                        />

                    </div>

                    {/* Edition */}
                    <div className='setAttributs-card-mobile-section'>
                        <h5 className='card-line-title'>Edition : </h5>
                        <CheckboxAddImage attributs={existingEditions} filter={edition} style={{marginBottom: '5%'}}
                            styleL={{height: '70px', backgroundColor: "#f3eaff"}}
                            image={getEditions}
                            classNameImg='checkbox-edition-img'
                            onChange={(event) => setEdition(event.target.value)}/>

                    </div>

                    {/* Texte de la carte */}
                    <div className='setAttributs-card-mobile-section'>
                        <h5 className='card-line-title'>Texte :</h5>
                        <textarea
                            className="input-card-text"
                            id="card-text"
                            name="deck-name"
                            rows="6"
                            cols="33"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{width: '80%'}}
                        />
                    </div>

                    {/* Coût en mana et valeur */}
                    <div className='setAttributs-card-mobile-section'>
                        <div className="input-group-number">
                            <h5 className='card-line-title'>Coût en mana :</h5>
                            <input 
                                className="input-card-number" 
                                type="number" 
                                id="cout-mana" 
                                name="cout-mana" 
                                value={manaCost}
                                onChange={(e) => setManaCost(e.target.value)} 
                                disabled={type === "TERRAIN"}
                                required
                            />
                            <h5 className='card-line-title'>Valeur € :</h5>
                            <input 
                                className="input-card-number" 
                                type="number" 
                                step="0.01" 
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                required 
                            />
                        </div>
                    </div>

                     <div className='valid-button-container' style={{padding: '5%'}}>
                    <ButtonValidPopup disabled={!completeState} onClick={() => addCard()} />
                    {/* Alertes */}
                    { alertCardSend &&(
                        <h4 className="alert-send-card" style={{color: 'green'}}>Carte publiée !</h4>
                    )}
                    { alertCardDontSend && (
                        <h5 className="alert-send-card" style={{color: 'red'}}>Échec de l'envoi</h5>
                    )}
                </div>
                
                </div>
                
                

               

        </div>


        
        
    </div>
    
     {/* Popup publication */}
    {popupPub && (
                        <div className='popup-bckg'>
                            
                            <div className='set-attributs-deck'>
                                <div className='pub-title-container'>
                                    <h1 className='pub-title'>Carte Publiée</h1>
                                </div>
                                <MdPublishedWithChanges size={'5em'} color=" #5D3B8C" />
                                <button  type="button" className="valid-form" onClick={() => popupConfirm()}>
                                                    Ok
                                        </button>
                            </div>
                        </div>
                    )}

    </Section> 
    )
} 

export default NewCard