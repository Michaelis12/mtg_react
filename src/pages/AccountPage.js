import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import { AuthContext } from "../context/authContext"
import axiosInstance, { setCsrfToken } from '../api/axiosInstance';
import Section from '../components/section';
import TitleArrow from '../components/titleArrow';
import IconButton from '../components/buttonIcon'
import ButtonModif from '../components/iconModif';
import IconButtonHover from '../components/buttonIconHover';
import ParagraphBlank from '../components/paragraphBlank'
import ParagraphLikeNumber from '../components/paragraphLikeNumber';
import FooterSection from '../components/footerSection';
import Deck from '../model/Deck';
import Card from '../model/Card';
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import incolore from "../assets/incolore-mtg.png"
import { FaPencilAlt } from "react-icons/fa";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { FaHeart, FaRegHeart, FaPlus  } from 'react-icons/fa';
import { IoSettingsOutline } from "react-icons/io5";
import { CgCloseO  } from "react-icons/cg";
import { MdOutlinePlayArrow } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import BackgroundPage from "../assets/background_cardsPage3.jpg"
import BackgroundWhite from "../assets/background_white.png"
import BackgroundGif from "../assets/background-forest.gif"
import "./css/AccountPage.css" 
import loading from "../assets/loading.gif"
import { getImageUrl } from '../utils/imageUtils';



 

const AccountPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { getCookie, isAuthenticated } = useContext(AuthContext);
    const [deckBuilder, setDeckBuilder] = useState([]);
    const [updateProfil, setUpdateProfil] = useState(false);
    const [activeProfil, setActiveProfil] = useState(false);
    const [userDecks, setUserDecks] = useState([])
    const [userLikes, setUserLikes] = useState([])
    const { authLogOut } = useContext(AuthContext);

    // Récupérer le CSRF token pour l'intégrer dans le cookie
    useEffect(() => {
    const fetchCsrfToken = async () => {
        try {
        await axiosInstance.get("/f_csrf/csrf");
        setDisplayLoading(false);
        } catch (err) {
        console.error("Erreur récupération CSRF", err);
        }
        finally {
            setDisplayLoading(false);
        }
    };

    fetchCsrfToken();
    }, []);



        
        // Afficher les decks
            
            const [decks, setDecks] = useState([])
            const [detailsDeck, setDetailsDeck] = useState(null)

                const getDecks = async () => {
                    try {   
                        
                const params = {
                    page: 0,
                    size: pageSize,
                    order: "date"
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
                           
        
                    }   
                    catch (error) {
                        console.log(error);
                    }           
                } 

                const [arrowSens, setArrowSens] = useState(<SlArrowUp/>)
                const [arrowUp, setArrowUp] = useState(true)
                const [navDecks, setNavDecks] = useState(true)
                
                useEffect(() => { 
                    const DisplayDecks = () => {
        
                    if (navDecks) {
                      setArrowSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                      setArrowUp(true)
                      getDecks();
                    } else {
                        setArrowSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
                        setArrowUp((prevArrowSens) => !prevArrowSens);
                        setDecks([]);
                    }
                  } 
                  DisplayDecks() }, [navDecks]);               

                const hoveredDeck = (id, name, format) => {
                    setDetailsDeck({ id, name, format });
                } 

                // Naviguer vers la modification de deck
                const newDeck = (id) => {
                    navigate(`/deckbuilding`, { state: { deckID: id }})
                         }; 
             
                // Afficher les cartes likées

                    const [cardsLiked, setCardsLiked] = React.useState([])
                    const [cardsLikedID, setCardsLikedID] = React.useState([])
                    const [detailsCardLiked, setDetailsCardLiked] = React.useState(null)
                    const [dislikeCardSignal, setDislikeCardSignal] = React.useState(false)

                    const [arrowSens2, setArrowSens2] = React.useState(<SlArrowUp/>)
                    const [arrowUp2, setArrowUp2] = React.useState(true)

                    // États pour la pagination
                    const [pageCardLiked, setPageCardLiked] = useState(1);
                    const [hasMoreCardLiked, setHasMoreCardLiked] = useState(true);
                    
                    // Récupère les cartes likées
                    useEffect(() => {
                    const getCardsLiked = async () => {
                        try {
                            setDisplayLoading(true)

                            const params = {
                                page: 0,
                                size: pageSize                    
                            };

                            const request = await axiosInstance.get('f_user/getCardsLikedPaged', {
                            params,
                            paramsSerializer: {
                                indexes: null, 
                                withCredentials : true
                            }} ); 
                            
                            const response = request.data.content.map(
                                card => new Card (card.id, card.name, card.text, card.image, card.manaCost, card.value, card.formats,
                                                card.colors, card.type, card.rarity, card.edition, card.decks 
                        ) ) 
                        setCardsLikedID(response.map(card => card.id))
                        setCardsLiked(response)
                        setPageCardLiked(1)
                        setHasMoreCardLiked(!response.data.isLast)                          
                        
            
                        }   
                        catch (error) {
                            console.log(error);
                        }  
                        finally {
                            setDisplayLoading(false) 
                        }            
                    }
                    getCardsLiked() }, [dislikeCardSignal]);
                                        
                    
                    // Icone coeur de la carte 
                      const hearthIconCard = (id) => {
                        if(!cardsLikedID.some(cardID => cardID === (id))) {
                            return (<FaRegHeart className='icon-for-dislike' size="2em" color="black"/>)
                        }
                        else {
                            return (<FaHeart size="2em" color="red"/>)
                        }
                    }
            
                    const mouseEnterCard = (id) => {
                        setCardsLikedID(prevState => prevState.filter(cardID => cardID !== id));
                    }
            
                    const mouseLeaveCard = (id) => {
                        setCardsLikedID(prevState => [...prevState, id]);
                    }
                    
            
                    // Méthode disliker une carte
                
                    const dislikeCard = async (id) => {
                        try {
                           await axiosInstance.delete(`/f_user/dislikeCard?cardId=${id}`, 
                           { withCredentials: true });                                
                            setDislikeCardSignal(!dislikeCardSignal)
                            }   
                        catch (error) {
                            console.log(error);
                        }
                    };

                    // Naviguer vers les cartes likées
                    const navCardLiked = (id) => {
                    const cardsIds = cardsLiked.map(card => card.id);
                    navigate(`/cardSelected`, { state: { cardID: id, ListCard: cardsIds }})
                    };

            
                    const hoveredCardLiked = (id, name, type, text) => {
                        setDetailsCardLiked({ id, name, type, text });
                    }

        // Afficher les decks likés

        const [decksLiked, setDecksLiked] = React.useState( [] )
        const [decksLikedId, setDecksLikedId] = React.useState( [] )
        const [detailsDeckLiked, setDetailsDeckLiked] = React.useState(null)
        const [dislikeDeckSignal, setDislikeDeckSignal] = React.useState(false)

        // États pour la pagination
        const [pageDeckLiked, setPageDeckLiked] = useState(1);
        const [hasMoreDeckLiked, setHasMoreDeckLiked] = useState(true);
        const [isLoading, setIsLoading] = useState(false);
         
        useEffect(() => {
        const getDecksLiked = async () => {
            try { 
                setDisplayLoading(true);
                // Contient les RequestParams de la requete
                const params = {
                    page: 0,
                    size: pageSize                    
                };

                const response = await axiosInstance.get('f_user/getDecksLikedPaged', {
                  params,
                  paramsSerializer: {
                    indexes: null, 
                    withCredentials : true
                }} ); 
    
                    const listDecks = response.data.content.map(
                        deck => new Deck (deck.id, deck.name, deck.dateCreation, deck.image, deck.format,
                            deck.colors, deck.manaCost, deck.value, deck.isPublic, deck.deckBuilder,
                            deck.deckBuilderName, deck.likeNumber, deck.cards, deck.commander
                ) )
                        
                setDecksLiked(listDecks)
                setDecksLikedId(listDecks.map(deck => deck.id))
                setPageDeckLiked(1)
                setHasMoreDeckLiked(!response.data.isLast)                   
                }
                catch (error) { 
                    console.log(error);
                    }
                finally {
                    setDisplayLoading(false)
                }
                 }
        getDecksLiked() }, [dislikeDeckSignal]);
             

        const [arrowSens3, setArrowSens3] = React.useState(<SlArrowUp/>)
        const [arrowUp3, setArrowUp3] = React.useState(true)       
       
          

        const hearthIconDeck = (id) => {
            if(!decksLikedId.some(deckID => deckID === (id))) {
                return (<FaRegHeart className='icon-for-dislike' size="2em" color="black"/>)
            }
            else {
                return (<FaHeart className='icon-for-dislike' size="2em" color="red"/>)
            }
        }


        const mouseEnterDeck = (id) => {
            setDecksLikedId(prevState => prevState.filter(deckId => deckId !== id));
        }

        const mouseLeaveDeck = (id) => {
            setDecksLikedId(prevState => [...prevState, id]);
        }
        

        // Méthode disliker un deck
    
        const dislikeDeck = async (id) => {
            try {

               await axiosInstance.delete(`/f_user/dislikeDeck?deckId=${id}`, 
                    { withCredentials: true });          
               setDislikeDeckSignal(!dislikeDeckSignal)
               
                }   
            catch (error) {
                console.log(error);
            }
        };

        // Naviguer vers un deck liké
        const navDeckLiked = (id) => {
            const decksIds = decksLiked.map(deck => deck.id);
            navigate(`/deckSelected`, { state: { deckID: id, ListDeck: decksIds }})
        };

         
        // Méthode afficher les détails d'un deck
        const hoveredDeckLiked = (id, name, format) => {
            setDetailsDeckLiked({ id, name, format });
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

        // N'affiche pas INCOLORE 
        const displayColor = (values, value) => {
            if(values.length < 2) {
                return
            }
            if(value === "INCOLORE") {
                return "none";
        }
        }

        // Naviguer vers un user
        const chooseUser = async (deckID) => { 
          try {
                  
            const response = await axiosInstance.get(`f_all/getDeckUser?deckID=${deckID}` );

            navigate(`/userSelected`, { state: { userID: response.data }})
            } 
          catch (error) {
            console.log(error);
          }
        }

        // Naviguer vers la création de deck 
        const navNewDeck = () => {
            if (isAuthenticated) {
                navigate('/addDeck');
            } else {
                navigate('/signPage');
            }
        }



        // Les états des attributs modifiés
        const [pseudo, setPseudo] = React.useState("")
        const [bio, setBio] = React.useState("")
        const [avatar, setAvatar] = React.useState("")

        const [displayLoading, setDisplayLoading] = useState(false);
        const [pageSize, setPageSize] = useState(20);


        // Récupérer le profil de l'user
        useEffect(() => {
        const getDeckBuilder = async () => {
            try {

                
                const request = await axiosInstance.get('/f_user/getDeckBuilder', {
                    withCredentials: true,                  
                });
              
                const response = request.data

                const request2 = await axiosInstance.get(`/f_all/getUserLikes?userID=${request.data.id}`);
                   
                if(response.activity === 'INACTIVE') {
                    setActiveProfil(true)
                }
                
                setDeckBuilder(response)
                setUserLikes(request2.data)

            }   
            catch (error) {
                console.log(error)
            }

    
        }
        getDeckBuilder();
        }, [decks, cardsLiked, decksLiked, updateProfil]);


        // Afficher le total de likes obtenus par les decks de l'user
        useEffect(() => {
        const getUserLikes = async () => {
                    try {
                        setDisplayLoading(true)
                        const response = await axiosInstance.get(`/f_all/getUserLikes?userID=${deckBuilder.id}`);
                    
            
                        setUserLikes(response.data)
                           
        
                    }   
                    catch (error) {
                        console.log(error);
                    } 
                    finally {
                       setDisplayLoading(false) 
                    }          
                }
            getUserLikes();
            }, []);


        // Rendre le compte actif si il a été désactivé

         const reactAccount = async () => {
            try {

                setDisplayLoading(true)
                const request = await axiosInstance.put('/f_user/reacAccount', {
                    withCredentials: true,                  
                });
              
               setActiveProfil(false)

            }   
            catch (error) {
                console.log(error)
            }
            finally {
                setDisplayLoading(false)
            }
         }


        
        // Modifier le profil
        const updateDeckBuilder = async () => {
            try {

                setDisplayLoading(true)
                
                const newDeckBuilder = {};

                if (pseudo !== "") newDeckBuilder.pseudo = pseudo;
                if (bio !== "") newDeckBuilder.bio = bio;
                if (avatar !== "") newDeckBuilder.avatar = avatar;
                

                const request = await axiosInstance.put(`/f_user/updateAccount`, newDeckBuilder,
                { withCredentials: true }); 
                              
                
                setUpdateProfil(false);
                setDisplayLoading(false)
                setPseudo("");
                setBio("");
                setAvatar("");

            }   
            catch (error) {
                console.log(error);
                setDisplayLoading(false)
            }           
        }

        // Afficher la pp de l'user
        const displayAvatar = () => { 
                if(avatar === "") {
                    // Si pas d'avatar sélectionné, afficher l'avatar existant
                    if(deckBuilder.avatar && deckBuilder.avatar.startsWith('/uploads/')) {
                        return `https://localhost:8443${deckBuilder.avatar}`;
                    }
                    return deckBuilder.avatar;
                }
                else {
                    // Si un nouvel avatar a été sélectionné
                    if(avatar.startsWith('/uploads/')) {
                        return `https://localhost:8443${avatar}`;
                    }
                    return avatar;
                }
        }
         
        // Editer le profil
        const editProfil = () => {
            setUpdateProfil(true);
        }

        // Annuler les modifications du profil
        const cancelEdit = () => {
            setUpdateProfil(false);
            setBio("");
            setPseudo("");
            setAvatar("");
        }



        const selectImage = async (event) => {
            const file = event.target.files[0];
           
            if (file) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    const uploadRes = await axiosInstance.post("f_all/uploadImage", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        withCredentials: true
                    });
                    
                    // Stocker le chemin retourné au lieu du base64
                    setAvatar(uploadRes.data);
                } catch (error) {
                    console.error("Erreur lors de l'upload de l'image:", error);
                    alert("Erreur lors de l'upload de l'image");
                }
            }
        }
        
           
 
        return ( 
            <Section>

                    <img src={BackgroundPage} className="background-image" alt="background" />
                    { displayLoading && (
                            <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
                            )}

                    { activeProfil && (
                    <div className='popup-bckg'>
                        <div className='popup-delete' style={{ backgroundImage: `url(${BackgroundWhite})`}}>
                            <div className='header-popup-delete'>
                                                    <MdOutlinePlayArrow className="active-icon" />
                                                    <h1 style={{textAlign: 'center', marginBottom: '0'}}>Activation du compte</h1>  
                            </div>
                            <div className="avert-header">
                                                    <h4 className="avert-p1"> Votre compte est inactif</h4>
                                                    <h4 className="avert-p2"> Votre profil comme vos decks ne sont plus visibles</h4>
                            </div>                                     
                            <button className='valid-popup' onClick={()=>reactAccount()}>
                                                    <h4 className="valid-popup-title">Activer</h4>
                            </button>
                            </div> 
                        <CgCloseO className='icon-close-popup' color='white' size={'5em'}  onClick={()=>{navigate(-1);authLogOut()}}/> 
                    </div>  
                    )}  

                    <div className="card-user-container">                    
                    
                                            <div className="card-user-desktop" style={{ backgroundImage: `url(${BackgroundWhite})`}}>
                                                        <div className="card-user-avatar-section">
                                                            <img
                                                            src={displayAvatar()}
                                                            className="user-avatar-desktop"
                                                            alt="user-avatar"
                                                            />
                                                        </div>
                    
                                                        <div className="card-user-info">
                                                            <h1 className="user-pseudo">{deckBuilder.pseudo}</h1>
                    
                                                            <div className="user-line-bio">
                                                            <h4 className="user-title-bio">Bio :</h4>
                                                            {deckBuilder.bio ? (
                                                                <h3 className='user-bio'>{deckBuilder.bio}</h3>
                                                            ) : (
                                                                <h3 className='user-bio'>Deckbuilder Magic en formation</h3>
                                                            )}
                                                            </div> 
                    
                                                            <div className="card-line-attribut">
                                                                <h4 className="deck-selected-line-title">Date d'inscription :</h4>
                                                                <h4 className='user-date'>{deckBuilder.dateSign}</h4>
                                                            
                                                            </div>
                    
                                                            <div className='user-stat-container'>
                    
                                                                <div className='user-stat'>
                                                                    <h5>Decks créés : </h5>
                                                                    <h4>{deckBuilder.decksNumber}</h4>
                                                                </div>
                                                                <div  className='user-stat'>
                                                                    <h5>Likes obtenus : </h5>
                                                                    <h4>{userLikes}</h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                            
                                            </div>
                    
                                            <div className='admin-users-button'>                                                   
                                                        <button className='update-user-container' onClick={() => editProfil()} >
                                                                <FaPencilAlt className='icon-update-user' />
                                                                <h5 className='update-user-p'>Editer le profil</h5>
                                                        </button> 

                                                        <button className='update-user-container' onClick={() => navigate("/setting")} >
                                                                <IoSettingsOutline className='icon-update-user' />
                                                                <h5 className='update-user-p'>Paramètres du compte</h5>
                                                        </button> 
                                            </div>

                                            <div className="card-user-mobile"> 
                                                            <div className="header-card" style={{backgroundImage:`url(${BackgroundGif})`}}>
                                                                <img src={displayAvatar()} className="user-avatar" alt="user-pp"/>
                                                                    <h1 className="user-pseudo">{deckBuilder.pseudo}</h1>   
                                                            </div>  
                    
                                                            <div className='user-bio-container'>
                                                                <h4 className="user-title-bio" >Bio : </h4>                  
                                                                { deckBuilder.bio !== null && (                   
                                                                    <h3 className="user-bio">{deckBuilder.bio}</h3>
                                                                )}
                                                                { deckBuilder.bio === null && (                   
                                                                    <p className="user-bio" >Deckbuilder Magic en formation</p>
                                                                )}
                                                            </div>
                    
                                                            <div className="date-user-container">
                                                                <h4 className="user-date-line-title">Date d'inscription :</h4>
                                                                <h4 className='user-date'>{deckBuilder.dateSign}</h4>
                                                            
                                                            </div>
                    
                                                            <div className='user-stat-container'>
                    
                                                            <div className='user-stat'>
                                                                <h5>Decks créés : </h5>
                                                                <h4>{deckBuilder.decksNumber}</h4>
                                                            </div>
                                                            <div  className='user-stat'>
                                                                <h5>Likes obtenus : </h5>
                                                                <h4>{userLikes}</h4>
                                                            </div>
                    
                                                            </div>
                    
                                            </div>


                                            { updateProfil && (
                                            
                                            <div className='popup-bckg'>
                                                <div className="card-user-desktop" style={{ backgroundImage: `url(${BackgroundWhite})`}}>
                                                        <div className="card-user-avatar-section">
                                                            <img
                                                            src={displayAvatar()}
                                                            className="user-avatar-desktop"
                                                            alt="user-avatar"
                                                            />
                                                            <div className='input-image-container'>
                                                                <input className='input-image' type="file"  accept="image/*"
                                                                    style={{ opacity: !updateProfil ? 0 : 1 }}  onChange={(e) => selectImage(e)}/> 
                                                            </div>
                                                        </div>
                    
                                                        <div className="card-user-info">
                                                            <textarea className="user-pseudo" id="pseudo" name="pseudo" rows="1"
                                                                style={{color: 'black', backgroundColor: 'white'}}
                                                                maxLength={25} onChange={(e) => setPseudo(e.target.value)} >
                                                                    {deckBuilder.pseudo}
                                                            </textarea>

                    
                                                            <div className="user-line-bio">
                                                            <h4 className="user-title-bio">Bio :</h4>
                                                            <textarea className="input-bio" id="bio" name="bio" rows="4"
                                                                maxLength={100} onChange={(e) => setBio(e.target.value)} >
                                                                    {deckBuilder.bio}
                                                            </textarea>

                                                            </div> 
                
                    
                    
                                                            <button  type="button" className="valid-edit-button"
                                                            disabled={pseudo.length < 6 && bio === "" && avatar === ""}
                                                            onClick={() => updateDeckBuilder()}>
                                                                <h3>Valider</h3>
                                                            </button>
                                                        </div>
                                            
                                                </div>

                                                <div className="card-user-mobile"> 
                                                            <div className="header-card" style={{backgroundImage:`url(${BackgroundGif})`}}>
                                                                <img src={displayAvatar()} className="user-avatar" alt="user-pp"/>
                                                                <div className='input-image-container'>
                                                                <input className='input-image' type="file"  accept="image/*"
                                                                    style={{ opacity: !updateProfil ? 0 : 1 }}  onChange={(e) => selectImage(e)}/> 
                                                                </div>

                                                                <textarea className="user-input-pseudo" id="pseudo" name="pseudo" rows="1"
                                                                    style={{color: 'black', backgroundColor: 'white'}}
                                                                    maxLength={25} onChange={(e) => setPseudo(e.target.value)} >
                                                                        {deckBuilder.pseudo}
                                                                </textarea>  
                                                            </div>  
                    
                                                            <div className='user-bio-container'>
                                                                <h4 className="user-title-bio" >Bio : </h4>                  
                                                                <textarea className="input-bio" id="bio" name="bio" rows="4"
                                                                    maxLength={100} onChange={(e) => setBio(e.target.value)} >
                                                                        {deckBuilder.bio}
                                                                </textarea>
                                                            </div>
                            
                                                            <button  type="button" className="valid-edit-button"
                                                                disabled={pseudo.length < 6 && bio === "" && avatar === ""}
                                                                onClick={() => updateDeckBuilder()}>
                                                                    <h3 className="valid-edit-button-title">Valider</h3>
                                                                </button>
                    
                    
                                                </div>


                                                <CgCloseO className='icon-close-popup' color='white' size={'5em'} onClick={()=> cancelEdit()}/>
                                            </div>
                                            )}


                                            
                    
                                            
                                            
                    </div>               

                
                    <div className="user-attributs-container" style={{marginTop: '3%'}}>

                    <div className="open-buttons-container">
                        
                        {/*Mapping des decks créés*/}
                        <TitleArrow onClick={()=>setNavDecks(!navDecks)} style={{marginTop: '0%'}}
                                    title={`Mes decks (${deckBuilder.decksNumber})`}
                                    icon={arrowSens}
                        />

                            {arrowUp === true && 
                            <div className='attributs-map-container'
                            style={{ backgroundImage: `url(${BackgroundWhite})`, display: 'flex', flexDirection: 'column'}}>
                            <div className='deck-created-section'>
                            {decks.map(deck => (  

                                <div className="deck-details" id='decks-user'  key={deck.id}>
                                    <img className="deck-pp" src={getImageUrl(deck.image)} alt="Deck avatar" onClick={() => newDeck(deck.id)}
                                    onMouseEnter={() => hoveredDeck(deck.id, deck.name, deck.format) } onMouseOut={() => hoveredDeck()}/>
                                    
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
                                                            <h4 className='color'> Couleurs : </h4> 
                                                            {deck.colors && deck.colors.length > 0 && (
                                                                <div className='mapping-color'>
                                                                {deck.colors.map((color, index)  => (
                                                                <img src={getColorPics(color)} key={index}
                                                                style={{display:(displayColor(deck.colors, color))}}
                                                                className="color-img-select" alt={color}/>                                
                                                            ))}
                                                                </div>
                                                            )} 
                                                        </div>
                                                        <div className='format-line'>               
                                                            <h4 className='format'> Format : </h4> 
                                                            <h4 className='card-format' style={{ backgroundColor: 'green' }}>{deck.format}</h4>
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
                            
                            <button className='next-page-button' style={{marginBottom: '3%'}} 
                                onClick={()=>navigate('/decksCreate')}>Afficher plus en détails</button>
                            </div>
                            }

                        {/*Mapping des cartes likées*/}
                        <TitleArrow onClick={()=>(setArrowSens2((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>)),
                            setArrowUp2(!arrowUp2))} 
                                    title={"Mes cartes likées (" + deckBuilder.cardsLikedNumber + ")"}
                                    icon={arrowSens2}
                        />
                                {arrowUp2 === true && cardsLiked.length > 0 &&
                                <div className="attributs-map-container" style={{ backgroundImage: `url(${BackgroundWhite})`, display: 'flex', flexDirection: 'column'}}>
                                <div className='card-liked-section'>
                                    {cardsLiked.map(card => ( 
                                        <div className="cards-liked-user" id='cards-liked-user' key={card.id}>
                                            <img className="card-liked-user-image" src={getImageUrl(card.image)} alt="Card-liked-user-image" onClick={() => navCardLiked(card.id)}
                                            onMouseEnter={() => hoveredCardLiked(card.id, card.name, card.type, card.text) } onMouseOut={() => hoveredCardLiked() } />
                                            <IconButton 
                                                onClick={()=> dislikeCard(card.id)} 
                                                onMouseEnter={() => mouseEnterCard(card.id)}
                                                onMouseLeave={() => mouseLeaveCard(card.id)}
                                                style={{ 
                                                    background: 'none', 
                                                    boxShadow: 'none', 
                                                    padding: 0, 
                                                    border: 'none',
                                                    position: 'relative',
                                                    marginTop: '2%'
                                                }} 
                                                icon={hearthIconCard(card.id)} 
                                            />
                                            {detailsCardLiked && detailsCardLiked.id === card.id && (
                                                <img className="card-img-zoom" src={getImageUrl(card.image)} alt="Card-image"/>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button className='next-page-button' style={{marginBottom: '3%'}} onClick={()=>navigate('/cardsLiked')}>Afficher plus en détails</button>
                                </div>
                        }
                        {arrowUp2 === true && cardsLiked.length < 1 && (
                            <div className='p-blank-section' style={{ backgroundImage: `url(${BackgroundWhite})`}}>
                                <ParagraphBlank text={"Aucune carte likée"}/>
                            </div>
                                                                    )}

                    
                    {/*Mapping des decks likés*/}
                    <TitleArrow onClick={()=>(setArrowSens3((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>)),
                            setArrowUp3(!arrowUp3))} 
                                    title={"Mes decks likés (" + deckBuilder.decksLikedNumber + ")"}
                                    icon={arrowSens3}
                        />
                    
                                    {arrowUp3 === true && decksLiked.length > 0 &&
                                    <div className="attributs-map-container" style={{ backgroundImage: `url(${BackgroundWhite})`, display: 'flex', flexDirection: 'column'}}>
                                        <div className='deck-liked-section'>
                                            {decksLiked.map(deck => ( 
                                                    <div className="deck-details" id='decks-liked-user'  key={deck.id}>
                                                            <img className="deck-pp" src={deck.image && deck.image.startsWith('/uploads/') ? `https://localhost:8443${deck.image}` : deck.image} alt="Deck avatar" onClick={() => navDeckLiked(deck.id)}
                                                            onMouseEnter={() => hoveredDeckLiked(deck.id, deck.name, deck.format)} onMouseOut={() => hoveredDeckLiked()}/>
                                                            <strong className="deck-named" style={{paddingTop:'5%'}}> {deck.name} </strong>
                                                            <button style={{marginBottom: '5%'}}><strong className="deck-db" onClick={() => chooseUser(deck.id)} 
                                                            > by {deck.deckBuilderName} </strong></button>
                                                            <IconButton 
                                                            onClick={()=> dislikeDeck(deck.id)} 
                                                            onMouseEnter={() => mouseEnterDeck(deck.id)}
                                                            onMouseLeave={() => mouseLeaveDeck(deck.id)}
                                                            style={{ 
                                                                    background: 'none', 
                                                                    boxShadow: 'none', 
                                                                    padding: 0, 
                                                                    border: 'none',
                                                            }} 
                                                            icon={hearthIconDeck(deck.id)} 
                                                            />
                                                            <ParagraphLikeNumber text={deck.likeNumber} style={{marginTop:'3%'}}
                                                            iconStyle={{position:'relative', marginBottom: '3px'}}/>
                                                            
                                                            {detailsDeckLiked && detailsDeckLiked.id === deck.id && (
                                                                            <div className="hover-deck-card">
                                                                                        <div className="img-container">
                                                                                                <img className="hover-deck-card-img" src={deck.image && deck.image.startsWith('/uploads/') ? `https://localhost:8443${deck.image}` : deck.image} alt="Deck mtg"/>
                                                                                        </div>
                                                                                                        <div className="deck-hover-body" >
                                                                                                            <div className='name-line'>
                                                                                                                <h1 className="hover-deck-name"> {deck.name}</h1>
                                                                                                            </div>
                                                                                                            <div className='color-line'>                        
                                                                                                                    <h4 className='color'> Couleurs : </h4> 
                                                                                                                    {deck.colors && deck.colors.length > 0 && (
                                                                                                                            <div className='mapping-color'>
                                                                                                                                {deck.colors.map((color, index)  => (
                                                                                                                            <img src={getColorPics(color)} key={index} style={{display:(displayColor(deck.colors, color))}}
                                                                                                                            className="color-img-select" alt={color}/>                                
                                                                                                                    ))}
                                                                                                                            </div>
                                                                                                                    )} 
                                                                                                            </div>
                                                                                                            <div className='format-line'>              
                                                                                                                    <h4 className='format'> Format : </h4> 
                                                                                                                    <h4 className='card-format' style={{ backgroundColor: 'green' }}>{deck.format}</h4>
                                                                                                            </div>
                                                                                                    </div>                                                
                                                                                                </div>
                                                                            )}
                                                            
                                                    </div>
                                            ))}
                                        </div>
                                        <button className='next-page-button' style={{marginBottom: '3%'}} onClick={()=>navigate('/decksLiked')}>Afficher plus en détails</button>
                                    </div>
                                    }
                                    {arrowUp3 === true && decksLiked.length < 1 && (
                                        <div className='p-blank-section' style={{ backgroundImage: `url(${BackgroundWhite})`}}>
                                                <ParagraphBlank  text={"Aucun deck liké"}/>
                                        </div>
                                                                                    )}
                                    </div>

                    </div>  

                <FooterSection/>   
                
            </Section> 



        )

    }

    export default AccountPage;