import React from 'react';
import { useEffect } from 'react';
import { useParams,  useNavigate} from 'react-router-dom';
import Section from '../components/section';
import SettingButton from '../components/buttonIcon';
import Deck from '../model/Deck';
import { IoSettingsOutline } from "react-icons/io5";
import axiosInstance from '../api/axiosInstance';


const UserSelected = () => {
    const [user, setUser] = React.useState([])
    const [decks, setDecks] = React.useState([])

    const navigate = useNavigate();

    
    const { id } = useParams();
        // { id } va récupérer uniquement la valeur située à l'emplacement :number dans le rout
    
        // Renvoie les attributs du deck sélectionné
        useEffect(() => {
        const getUserSelected = async () => {
            try {
                const request = await axiosInstance.get(`/f_admin/getUser?userID=${id}`);

                const response = request.data

                    setUser(response)
                    
            }   
            catch (error) {
                console.log(error);
            }

    
        }
        getUserSelected();
        }, [id]);

        const [detailsDeck, setDetailsDeck] = React.useState(null)
        

        // Renvoie les cartes du deck sélectionné
        useEffect(() => {
            const getDecksUser = async () => {
                try {
                    const response = await axiosInstance.get(`/f_admin/getDecksOfUser?userID=${id}`);

                    const listDecks = response.data.map(
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
            getDecksUser();
            }, [id]);

        // Boutons navigation decks
        const prevDeck = () => { 
            navigate(`/users/${parseInt(id) - 1}`)
              };

        const nextDeck = () => {
            navigate(`/users/${parseInt(id) + 1}`)
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
    

       // Pop-up détails de cartes
       const hoveredDeck = (id, name, format) => {
           setDetailsDeck({ id, name, format});
           }

       // Naviguer vers un deck
       const chooseDeck = (id) => {
           navigate(`/decks/${id}`)
           };


        return (
            <Section className="section">

                    <div className="user" style={{width : `50%`}}>
                    <img className="deck-img" src={user.avatar} alt="Deck mtg"/>
                        <div className="card-body" >
                            <h2 className="user-name"> {user.pseudo}</h2>
                            <h5 className="user-email">{user.mail}</h5>                
                            <h6 className='role'> Role : </h6> 
                            <li className='user-role' style={{ backgroundColor: 'green' }}>{user.role}</li>                                                         
                        </div>
                    </div>   
                <div className='button-navig'>
                    <button onClick={() => prevDeck()} > Utilisateur précédent</button>
                    <button onClick={() => nextDeck()}> Utilisateur suivant</button>
                 </div>
                 <div className="settingButton-container">
                   <SettingButton className= "settingButton" onClick={likeDislike} icon={<IoSettingsOutline/>}/>
               </div> 

                <div className='deck-section'>
                       {decks.map(deck => ( 
                           <div className="deck-details"  key={deck.id}>
                               <img className="deck-pp" src={deck.image} alt="Deck avatar" onClick={() => chooseDeck(deck.id)}
                               onMouseEnter={() => hoveredDeck(deck.id, deck.name, deck.format) } onMouseOut={() => hoveredDeck()} />
                               <strong className="deck-name"> {deck.name} </strong>

                               {detailsDeck && detailsDeck.id === deck.id && (
                               <div className="container-mt-5" >
                                   <div className="hv-card" style={{maxWidth: '18rem', border : '2px solid black',
                                       padding: '5px', borderRadius : '5px', backgroundColor:'rgba(208,215,231,255)'}}>
                                       <div className="hv-card-body">
                                           <h5 className="hv-title">{detailsDeck.name}</h5>
                                           <hr/>
                                           <h6 className="hv-type">{detailsDeck.format}</h6>
                                       </div>
                                   </div>
                               </div>
                               )}
                           </div>
                      
                       ))}
                   </div>  
                             
            </Section>
        )
}

export default UserSelected;
