
import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import { FaHeart, FaRegHeart  } from 'react-icons/fa';
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import axiosInstance from '../api/axiosInstance';
import Section from '../components/section';
import IconButton from '../components/buttonIcon';
import DeckMap from '../components/deck';
import FooterSection from '../components/footerSection';
import Deck from '../model/Deck';
import Title from '../components/title';
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import incolore from "../assets/incolore-mtg.webp"
import BackgroundMTG from "../assets/background_cardsPage.jpg"
import BackgroundCard from "../assets/background_white.png"
import BackgroundGif from "../assets/background-forest.gif"
import loading from "../assets/loading.gif"
import "./css/UserSelected.css"
import { getAvatarUrl, getDeckImageUrl } from '../utils/imageUtils'; 
 



 

const AccountPage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const id = location.state?.userID
    const [deckLikedId, setDeckLikedId] = React.useState([])
    const [userLikes, setUserLikes] = useState([])
    const [userDecks, setUserDecks] = useState([])
    const [newID, setNewID] = React.useState("")
    const [displayLoading, setDisplayLoading] = useState(false)

    // États pour ajuster le nombre de likes des cartes
    const [newDeckLikedId, setNewDeckLikedId] = React.useState([])
    const [newDeckDislikedId, setNewDeckDislikedId] = React.useState([])


        // Afficher l'user

        const [deckBuilder, setDeckBuilder] = useState([])

        useEffect(() => {
        const getDeckBuilder = async () => {
            try {
                setDisplayLoading(true)
                if(newID === "") {
                    setNewID(id)
                }

                const request = await axiosInstance.get(`/f_all/getUserID?userID=${newID}`);

                const response = request.data
    
                setDeckBuilder(response)
                setDisplayLoading(false)

            }   
            catch (error) {
                setDisplayLoading(false)
                console.log(error);
            }

    
        }
        getDeckBuilder();
        }, [id, newID]);

       

        // Afficher les decks de l'user
            
            const [decks, setDecks] = useState([])
            const [detailsDeck, setDetailsDeck] = useState(null)

            // États pour la pagination 
            const [page, setPage] = React.useState(1);
            const [pageSize, setPageSize] = React.useState(20);
            const [hasMore, setHasMore] = useState(true);

            useEffect(() => {
                const getDecks = async () => {
                    try {
                        setDisplayLoading(true)


                // Contient les RequestParams de la requete
                const params = {
                        userID : id,
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
                        setDisplayLoading(false)
                           
        
                    }   
                    catch (error) {
                        setDisplayLoading(false)
                        console.log(error);
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

        // Calcule le nombre de likes ajusté pour un deck (analogue à CardsPage)
        const getAdjustedLikeNumber = (deck) => {
            if (newDeckLikedId && newDeckLikedId.includes(deck.id)) return deck.likeNumber + 1;
            if (newDeckDislikedId && newDeckDislikedId.includes(deck.id)) return deck.likeNumber - 1;
            return deck.likeNumber;
        };
        
 
        return ( 
            <Section className="section">
                { displayLoading && (
                    <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
                )}
                <img src={BackgroundMTG} className="background-image" alt="background" />
                <div className="div-container">
                    <div className="card-user-container">                   

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
                                                <h5>Decks créés : </h5>
                                                <h4>{userDecks}</h4>
                                            </div>
                                            <div  className='user-stat'>
                                                <h5>Likes obtenus : </h5>
                                                <h4>{userLikes}</h4>
                                            </div>
                                        </div>

                                    </div>
                        </div>

                        <div className="card-user-mobile"> 
                                        <div className="header-card" style={{backgroundImage:`url(${BackgroundGif})`}}>
                                            <img src={getAvatarUrl(deckBuilder.avatar)} className="user-avatar" alt="user-pp"/>
                                                <h1 className="user-pseudo">{deckBuilder.pseudo}</h1>   
                                        </div>  

                                        <div className='user-bio-container'>
                                            <h4 className="user-title-bio" >Bio : </h4>                  
                                            { deckBuilder.bio !== null && (                   
                                                <h3 className="user-bio">{deckBuilder.bio}
</h3>
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
                                            <h4>{userDecks}</h4>
                                        </div>
                                        <div  className='user-stat'>
                                            <h5>Likes obtenus : </h5>
                                            <h4>{userLikes}</h4>
                                        </div>

                                        </div>

                        </div>
                </div>


                    <div className='title-container'>
                            <Title title={"Decks"}/>
                        </div> 


                    <div className="display-objects-section">
                        
                        { decks.length > 0 && (
                        <div className='display-decks-section'>
                                {decks.map(deck => ( 
                                <DeckMap key={deck.id} id={deck.id} name={deck.name} image={deck.image} 
                                                format={deck.format} colors={deck.colors} likeNumber={deck.likeNumber} 
                                                onClick={() => chooseDeck(deck.id)}
                                                onMouseEnter={() => hoveredDeck(deck.id, deck.name, deck.format) } 
                                                onMouseOut={() => hoveredDeck()}
                                                className="deck-db"                                 
                                                para={deck.deckBuilderName}
                                                detailsDeck={detailsDeck} />                        
                            ))}
                        </div>
                        )}

                        {hasMore && (
                            <button className='next-page-button' disabled={!hasMore}
                            onClick={()=>displayMoreDecks()}>Afficher plus</button>
                        )}
                        
                    </div> 
                </div>

                { decks.length < 1 && (
                            <div className='no-deck-text'>
                                <h2 className='no-deck-title'> Aucun deck publié</h2>
                            </div>
                        )}
                <FooterSection/>
            </Section>

        )

    }

    export default AccountPage;
