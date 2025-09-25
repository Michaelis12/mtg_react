import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import { FaHeart, FaRegHeart  } from 'react-icons/fa';
import { MdOutlinePlayArrow } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CgCloseO  } from "react-icons/cg";
import { ImCross } from "react-icons/im";
import { VscDebugStart } from "react-icons/vsc";
import axiosInstance from '../api/axiosInstance';
import Section from '../components/section';
import IconButton from '../components/buttonIcon';
import IconButtonHover from '../components/buttonIconHover';
import ButtonValidPopup from "../components/buttonValidPopup";
import ParagraphLikeNumber from '../components/paragraphLikeNumber';
import PopupDelete from '../components/popupDelete';
import FooterSection from '../components/footerSection';
import Deck from '../model/Deck';
import Title from '../components/title';
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import incolore from "../assets/incolore-mtg.png"
import BackgroundCard from "../assets/background_white.png"
import BackgroundGif from "../assets/background-forest.gif"
import BackgroundMTG from "../assets/background_cardsPage2.jpg"
import loading from "../assets/loading.gif"
import "./css/UserSelected.css"
import { getAvatarUrl, getDeckImageUrl } from '../utils/imageUtils'; 




 

const AccountPage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const id = location.state?.userID
    const users = location.state?.ListUser 
    const [deckLikedId, setDeckLikedId] = React.useState([])
    const [userDecks, setUserDecks] = useState([])
    const [userLikes, setUserLikes] = useState([])
    const [newID, setNewID] = React.useState("")
    const [day, setDay] = React.useState("")
    const [cause, setCause] = React.useState("")
    const [signalUpdate, setSignalUpdate] = useState(true)
    const [disableButtons, setDisableButtons] = useState(false)
    const [displayDeletePopUp, setDisplayDeletePopUp] = React.useState(false)
    const [displayActivePopUp, setDisplayActivePopUp] = React.useState(false)
    const [displayDesacPopUp, setDisplayDesacPopUp] = React.useState(false)
    const [displayLoading, setDisplayLoading] = useState(false)


    // États pour ajuster le nombre de likes des cartes
    const [newDeckLikedId, setNewDeckLikedId] = React.useState([])
    const [newDeckDislikedId, setNewDeckDislikedId] = React.useState([])


    // États pour la pagination 
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(20);
    const [hasMore, setHasMore] = useState(true);



        // Afficher l'user

        const [deckBuilder, setDeckBuilder] = useState([])

        useEffect(() => {
        const getDeckBuilder = async () => {
            try {
                setDisplayLoading(true)
                if(newID === "") {
                    setNewID(id)
                }


                const request = await axiosInstance.get(`/f_admin/getUserID?userID=${newID}`);

                const response = request.data
    
                setDeckBuilder(response)

                if(request.data.roles.includes("ADMIN")) {
                    setDisableButtons(true)
                }
                if(!request.data.roles.includes("ADMIN")) {
                    setDisableButtons(false)
                }

                setDisplayLoading(false)

            }   
            catch (error) {
                setDisplayLoading(false)
                console.log(error);
            }

    
        }
        getDeckBuilder();
        }, [id, newID, signalUpdate]);


        // Activer l'user
        const activeDeckBuilder = async () => { 
            try {
                setDisplayLoading(true)
               

                const request = await axiosInstance.put(`/f_admin/activeUser?userID=${newID}`, null, { withCredentials: true }); 
                
                setDisplayLoading(false)
                setDisplayActivePopUp(false)
                setSignalUpdate(!signalUpdate)
            }   
            catch (error) {
                setDisplayLoading(false)
                console.log(error);
            }

    
        }

        // Désactiver l'user
        const desacDeckBuilder = async () => {
            try {
                setDisplayLoading(true)
                const body = {
                    cause: cause                    
                };

                if (day === "def") {
                const request = await axiosInstance.put(`/f_admin/desacUser?userID=${newID}`, body, { withCredentials: true });               
                 
                }
                else {
                const request = await axiosInstance.put(`/f_admin/desacUserTemporal?userID=${newID}&days=${day}`, body, { withCredentials: true });
                }
                
                setDisplayLoading(false)
                setDisplayDesacPopUp(false)
                setSignalUpdate(!signalUpdate)
    
            }   
            catch (error) {
                setDisplayLoading(false)
                console.log(error);
            }

    
        }

        // Supprimer l'user
        const deleteDeckBuilder = async () => {
            try {
                setDisplayLoading(true)
                const request = await axiosInstance.delete(`/f_admin/deleteUser?dbID=${newID}`, { withCredentials: true });
                 navigate(-1);
    
            }   
            catch (error) {
                setDisplayLoading(false)
                console.log(error);
            }

    
        }

       

        // Afficher les decks de l'user
            
            const [decks, setDecks] = useState([])
            const [detailsDeck, setDetailsDeck] = useState(null)

            useEffect(() => {
                const getDecks = async () => {
                    try {
                        setDisplayLoading(true)


                // Contient les RequestParams de la requete
                const params = {
                        userID : newID,
                        page: 0,
                        size: pageSize,
                        order: "date"
                };

                const response = await axiosInstance.get('f_all/getDecksUserPaged', {
                  params,
                  paramsSerializer: {
                    indexes: null // Cela désactive l'ajout des crochets
                  }
                });
    
                const listDecks = response.data.content.map(
                        deck => new Deck (deck.id, deck.name, deck.dateCreation, deck.image, deck.format,
                            deck.colors, deck.manaCost, deck.value, deck.isPublic, deck.deckBuilder,
                            deck.deckBuilderName, deck.likeNumber, deck.cards, deck.commander
                ) )
                                    
                setDecks(listDecks)
                setPage(1) 
                setHasMore(!response.data.isLast)
                setUserDecks(response.data.deckNumber)
                setDisplayLoading(false)
                           
        
                    }   
                    catch (error) {
                        setDisplayLoading(false)
                        console.log(error);
                    }           
                }
            getDecks();
            }, [newID]);

            const displayMoreDecks = async () => {
 
                try {
                    setDisplayLoading(true);

                    const params = {
                            userID : newID,
                            page: page,
                            size: pageSize,
                            order: "date"
                    };

                    const request = await axiosInstance.get('f_all/getDecksUserPaged', {
                    params,
                    paramsSerializer: {
                        indexes: null // Cela désactive l'ajout des crochets
                    }
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
                        }
                }; 

            // Afficher le total de likes obtenus par les decks de l'user
            useEffect(() => {
                const getUserLikes = async () => {
                    try {
                        setDisplayLoading(true)
                        const response = await axiosInstance.get(`/f_all/getUserLikes?userID=${newID}`);
                    
            
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
            }, [newID, deckLikedId]);

        // Affiche le pop-up de chaque deck 
        const hoveredDeck = (id, name, format, likeNumber) => {
            setDetailsDeck({ id,  name, format, likeNumber });
            }
        
        // Dirige vers la page de chaque deck
        const chooseDeck = (id) => {
            const deckIds = decks.map(deck => deck.id);
            navigate(`/deckSelected`, { state: { deckID: id, ListDeck: deckIds }})
            };

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

        // Boutons navigation decks
        const prevUser = async () => {
            try {
                setDisplayLoading(true)
                const request = await axiosInstance.get(`/f_all/getPrevUser?userID=${newID}&usersID=${users}`);

                const response = request.data

                setNewID(response)
                
                setDisplayLoading(false)

            }   
            catch (error) {
                setDisplayLoading(false)
                console.log(error);
            }
            }; 

        // Désactive le bouton si il n'ya plus de decks qui suivent     
        const [prevButtonActive, setPrevButtonActive] = useState(true)
        
        useEffect(() => {
        const desacPrevUser = () => {
            const firstUserId = users[0];
            if (newID === firstUserId) {
                setPrevButtonActive(false)
            }
            else {
                setPrevButtonActive(true)
            }
        }
        desacPrevUser() }, [newID]);
        
        // Navigue vers le deck suivant dans a liste
        const nextUser = async () => {
            try {
                setDisplayLoading(true)
                const request = await axiosInstance.get(`/f_all/getNextUser?userID=${newID}&usersID=${users}`);

                const response = request.data
                
                setNewID(response)
                setDisplayLoading(false)

            }   
            catch (error) {
                setDisplayLoading(false)
                console.log(error);
            }
            };
        
        // Désactive le bouton si il n'ya plus de decks qui suivent     
        const [nextButtonActive, setNextButtonActive] = useState(true)
        
        useEffect(() => {
        const desacNextUser = () => {
            const lastUserId = users[users.length - 1];
            if (newID === lastUserId) {
                setNextButtonActive(false)
            }
            else {
                setNextButtonActive(true)
            }
        }
        desacNextUser() }, [newID]); 


        // Calcule le nombre de likes ajusté pour un deck (analogue à CardsPage)
        const getAdjustedLikeNumber = (deck) => {
            if (newDeckLikedId && newDeckLikedId.includes(deck.id)) return deck.likeNumber + 1;
            if (newDeckDislikedId && newDeckDislikedId.includes(deck.id)) return deck.likeNumber - 1;
            return deck.likeNumber;
        };


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
                    setDisplayLoading(true)
                   await axiosInstance.post(`/f_user/likeDeck?deckId=${id}`, null, { withCredentials: true });          
                   setDeckLikedId(prevState => [...prevState, id]);

                   if (newDeckDislikedId.includes(id)) {
                        // Si l'id est dans newDeckDislikedId, le retirer
                        setNewDeckDislikedId(prevState => prevState.filter(deckId => deckId !== id));
                    }
                    else {
                        setNewDeckLikedId(prevState => [...prevState, id]);
                    }

                   setDisplayLoading(false)
                }   
                catch (error) {
                    setDisplayLoading(false)
                    navigate(`/sign`);
                }
        };

        // Méthode disliker un deck
        const dislikeDeck = async (id) => {
                try {
                    setDisplayLoading(true)
                   await axiosInstance.delete(`/f_user/dislikeDeck?deckId=${id}`, { withCredentials: true });          
                   setDeckLikedId(prevState => prevState.filter(deckId => deckId !== id));

                   if (newDeckLikedId.includes(id)) {
                        // Si l'id est dans newDeckDislikedId, le retirer
                     setNewDeckLikedId(prevState => prevState.filter(deckId => deckId !== id));
                    }
                    else {
                        setNewDeckDislikedId(prevState => [...prevState, id]);
                    }

                   setDisplayLoading(false)
                    }   
                catch (error) {
                    setDisplayLoading(false)
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
        
 
        return ( 
            <Section>
                { displayLoading && (
                    <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
                )}
                <img src={BackgroundMTG} className="background-image" alt="background" />


                    <div className='button-nav-mobile'>   
                                        <IconButtonHover onClick={() => prevUser()} disabled={!prevButtonActive}
                                         icon={<MdOutlinePlayArrow className='icon-nav' style={{ transform: 'scaleX(-1)' }} />} />
                                        <IconButtonHover onClick={() => nextUser()}  disabled={!nextButtonActive}
                                         icon={<MdOutlinePlayArrow className='icon-nav' />} />                   
                                     </div> 

                    <div className="card-user-container">   

                        <div className='button-navig'>  
                            <IconButtonHover onClick={() => prevUser()} disabled={!prevButtonActive}
                            icon={<MdOutlinePlayArrow className='icon-nav' style={{ transform: 'scaleX(-1)' }}/>} />
                            <IconButtonHover onClick={() => nextUser()}  disabled={!nextButtonActive}
                            icon={<MdOutlinePlayArrow className='icon-nav' />} />
                        </div>                  

                        <div className="card-user-desktop" style={{ backgroundImage: `url(${BackgroundCard})`}}>
                                    <div className="card-user-avatar-section">
                                        <img
                                        src={getAvatarUrl(deckBuilder.avatar)}
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
                                                <h5>Decks publics : </h5>
                                                <h4>{userDecks}</h4>
                                            </div>
                                            <div  className='user-stat'>
                                                <h5>Likes obtenus : </h5>
                                                <h4>{userLikes}</h4>
                                            </div>
                                        </div>
                                    </div>
                        
                        </div> 

                        <div className='admin-users-button'>
                                    { deckBuilder.activity !== "INACTIVE" && deckBuilder.activity !== "BANNED" && (
                                    <button className='update-user-container' onClick={() => setDisplayDesacPopUp(true)}
                                    disabled={disableButtons} >
                                            <ImCross className='icon-update-user' />
                                            <h5 className='update-user-p'>Desactiver le compte</h5>
                                    </button> 
                                    )}
                                    { deckBuilder.activity === "INACTIVE" || deckBuilder.activity === "BANNED" && (
                                    <button className='update-user-container' onClick={() => setDisplayActivePopUp(true)}
                                     >
                                            <VscDebugStart className='icon-update-user' />
                                            <h5 className='update-user-p'>Activer le compte</h5>
                                    </button> 
                                    )}
                                    <button className='delete-user-container' onClick={() => setDisplayDeletePopUp(true)}
                                      disabled={disableButtons} >
                                            <RiDeleteBin6Line className='icon-update-user' />
                                            <h5 className='update-user-p'>Supprimer le compte</h5>
                                    </button> 
                         </div>
                        

                        <div className="card-user-mobile"> 
                                        <div className="header-card" style={{backgroundImage:`url(${BackgroundGif})`}}>
                                            <img src={getAvatarUrl(deckBuilder.avatar)} className="user-avatar" alt="user-pp"/>
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
                                            <h5>Decks publics : </h5>
                                            <h4>{userDecks}</h4>
                                        </div>
                                        <div  className='user-stat'>
                                            <h5>Likes obtenus : </h5>
                                            <h4>{userLikes}</h4>
                                        </div>

                                        </div>

                        </div>
                        
                    </div>
                                                                                  
                    
                    <div className='title-user-container'>
                            <Title title={"Decks"}/>
                        </div>


                    <div className="display-objects-section">

                        { decks.length > 0 && (
                        <div className='display-decks-section'>
                                {decks.map(deck => ( 
                                    <div className="deck-details"  key={deck.id}>
                                        <img className="deck-pp" src={getDeckImageUrl(deck.image)} alt="Deck avatar"
                                        onClick={()=>chooseDeck(deck.id)}
                                        onMouseEnter={() => hoveredDeck(deck.id, deck.name, deck.format, deck.likeNumber )} 
                                        onMouseOut={() => hoveredDeck()}/>
                                        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                                        </div>
                                        <strong className="deck-named"> {deck.name} </strong>

                                        <IconButton   
                                            onClick={()=> likeDislike(deck.id)} 
                                            
                                            style={{ 
                                                background: 'none', 
                                                boxShadow: 'none', 
                                                paddingTop: '5%', 
                                                border: 'none',                                       
                                            }} 
                                                        
                                            icon={hearthIcon(deck.id)} 
                                        />

                                        <ParagraphLikeNumber text={getAdjustedLikeNumber(deck)} iconStyle={{position:'relative', marginBottom: '3px'}}/>

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
                                                            {deck.colors && deck.colors.length > 0 && (
                                                                <div className='mapping-color'>
                                                                {deck.colors.map((color, index)  => (
                                                                <img src={getColorPics(color)} key={index}
                                                                 className="color-img-select" style={{display:(displayColor(color))}} alt={color}/>                                
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

                        {hasMore && (
                            <button className='next-page-button' disabled={!hasMore}
                            onClick={()=>displayMoreDecks()}>Afficher plus</button>
                        )}
                        
                    </div> 

                    { decks.length < 1 && (
                            <div className='no-deck-text'>
                                <h4 className='no-deck-title'> Aucun deck publié</h4>
                            </div>
                        )}
                <FooterSection/>

                { displayDeletePopUp && (
                    <PopupDelete title={"Supprimer le compte " + deckBuilder.pseudo} text={"La perte des données sera irréversible"}
                    onClick={()=>deleteDeckBuilder()} 
                    back={()=>setDisplayDeletePopUp(false)}/>
                )}
                
                { displayActivePopUp && (
                   <div className='popup-bckg'>
                        <div className='popup-update-user'>
                            <div className='header-ban-container'>
                                <h2 style={{color: 'white', fontFamily: 'MedievalSharp, cursive'}}>Réactiver le compte {deckBuilder.pseudo}</h2>
                            </div>
                            <h4 className='active-p1' style={{padding:'5%', color: 'black', textAlign: 'center'}} >Le compte {deckBuilder.pseudo} sera à nouveau actif</h4>                               
                            <button className='valid-popup' onClick={() => activeDeckBuilder()}><h4 className='valid-poup-title'>Valider</h4></button>
                          </div> 
                          <CgCloseO className='icon-close-popup' color='white' size={'5em'} onClick={()=> setDisplayActivePopUp(false)}/> 
                      </div>
                )}

                { displayDesacPopUp && (
                    <div className='popup-bckg'>
                        <div className='popup-update-user'>
                            <div className='header-ban-container'>
                                <h2 style={{color: 'white', fontFamily: 'MedievalSharp, cursive'}}>Bannir le compte {deckBuilder.pseudo}</h2>
                            </div>
                            <div className='time-ban-container'>
                                <h4 className="form-label-format"> Pour la durée :</h4>
                                <div className='checkout-days'>
                                    <li className='li-day'><input type="radio" className='input-day' name={"dayNumber"} value={7} 
                                    onChange={(event) => setDay(event.target.value)} 
                                            /><h5 className='text-day'>1 semaine</h5></li>
                                    <li className='li-day'><input type="radio" name={"dayNumber"} className='input-day' value={14} 
                                    onChange={(event) => setDay(event.target.value)} 
                                            /><h5 className='text-day'>2 semaines</h5></li>
                                    <li className='li-day'><input type="radio" className='input-day' name={"dayNumber"} value={30} 
                                    onChange={(event) => setDay(event.target.value)} 
                                            /><h5 className='text-day'>1 mois</h5></li>
                                    <li className='li-day'><input type="radio" className='input-day' name={"dayNumber"} value={"def"} 
                                    onChange={(event) => setDay(event.target.value)}
                                            /><h5 className='text-day'>Définitive</h5></li>
                                </div>
                            </div>

                            <div className='cause-ban-container'>
                                <h4 className="form-label-format"> Pour la raison :</h4>
                                <textarea className='textarea-ban' id="deck-name" name="deck-name" rows="5" cols="33" 
                                             onChange={(e) => setCause(e.target.value)} >
                                </textarea>
                            </div>
                                <ButtonValidPopup  onClick={() => desacDeckBuilder()}/>
                          </div> 
                          <CgCloseO className='icon-close-popup' color='white' size={'5em'} onClick={()=> setDisplayDesacPopUp(false)}/> 
                      </div>
                )}
            </Section>

        )

    }

    export default AccountPage;