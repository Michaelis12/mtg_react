import  "./css/NewRegle.css"
import Section from '../components/section';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import backgroundCardsPage from "../assets/background_cardsPage3.jpg"
import { MdPublishedWithChanges } from "react-icons/md";
import Title from '../components/title';
import loading from "../assets/loading.gif"
import backgroundPopup from "../assets/background_white.png"
import axiosInstance from '../api/axiosInstance';


const NewRegle = function () {

    const navigate = useNavigate();    
    const [title, setTitle] = React.useState("")
    const [text, setText] = React.useState("")
    const [completeState, setCompleteState] = React.useState(false)
    const [displayLoading, setDisplayLoading] = useState(false);



    // Active le bouton
        useEffect(() => {
            const verifState = () => { 
                if(title !== "" && text !== "") {
                        setCompleteState(true)
                    }
            }
            verifState();
        },[title, text]);
    
    const [alertDataSend, setAlertDataSend] = React.useState(false)
    const [alertDataDontSend, setAlertDataDontSend] = React.useState(false)
    
    const [popupPub, setPopupPub]= React.useState(false)

    // Soumet le form 
    const sendRegle = async () => {

            try{
                setDisplayLoading(true);
                const formData = new FormData();
                    formData.append('title', title);
                    formData.append('text', text);

                const data = {
                    title: title,
                    text: text,
                };

                const response = await axiosInstance.post('/f_admin/addRegle', data, { withCredentials: true }); 
                setAlertDataSend(true)
                setAlertDataDontSend(false)
                setDisplayLoading(false);
                setPopupPub(true)
            }catch (e) { 
                setAlertDataDontSend(true)
                setDisplayLoading(false);
            } 
        

    }

    const popupConfirm = () => { 
            window.location.reload();
        }

    
    
    return (
        <Section>
        <div className="new-regle-container">
        <img src={backgroundCardsPage} className="background-image" alt="background" />

            <Title title={"Publier une règle"} /> 
            <div className="form-add-regle" style={{ backgroundImage: `url(${backgroundPopup})`}}>
                <div className='textarea-container'>
                       <textarea
                       className="input-name" id="deck-name" name="deck-name" rows="1" cols="33" value={title}                                      
                                        maxLength={25} onChange={(e) => setTitle(e.target.value)} placeholder="Titre"  >
                                            {title}
                       </textarea>
            </div>
                
                <div className="input-groupe">
                    <label>Texte :</label>
                    <textarea type="text" id="texte" name="texte" className="text-input" rows="15" cols="33" 
                    onChange={(e) => setText(e.target.value)}required/>
                </div> 
            <button className='create-card' disabled={!completeState} onClick={sendRegle}>Publier</button>
          </div>   
          { alertDataSend && (
            <h4 className="alert-send-card">Contenu publié !</h4>
        )}
        { alertDataDontSend && (
        <div className="alert-send-error-container">
            <h5 className="alert-send-error">Echec de l'envoi</h5>
            <h6 className="para-send-error">Assurez-vous que tous les champs sont correctement remplis</h6>
        </div>
        )}   
        </div>
        { displayLoading && (
                <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
            )}
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

export default NewRegle