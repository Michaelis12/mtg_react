import  "./css/NewRegle.css"
import Section from '../components/section';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonValidPopup from "../components/buttonValidPopup";
import backgroundCardsPage from "../assets/background_cardsPage3.jpg"
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
    
    // Soumet le form 
    const sendRegle = async () => {

            try{
                setAlertDataDontSend(false)
                setAlertDataSend(false)


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
                setTitle("")
                setText("")
                setDisplayLoading(false);
            }catch (e) { 
                setAlertDataDontSend(true)
                setDisplayLoading(false);
            } 
        

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
                
                <div className="input-group-rule">
                    <label className='rule-line-title' >Texte :</label>
                    <textarea type="text" id="texte" name="texte" style={{width:'80%'}} rows="15" cols="33" value={text}  
                    onChange={(e) => setText(e.target.value)}required/>
                </div> 
            <div className='valid-button-container' style={{padding: '1%'}}>
                <ButtonValidPopup disabled={!completeState} onClick={() => sendRegle()} />
                {/* Alertes */}
                { alertDataSend &&(
                    <h4 className="alert-send-rule" style={{color: 'green'}}>Règle publiée !</h4>
                )}
                { alertDataDontSend && (
                    <h5 className="alert-send-rule" style={{color: 'red'}}>Échec de l'envoi</h5>
                 )}
            </div>

            </div>     
        </div>
        { displayLoading && (
                <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
            )}

        </Section>
    )
} 

export default NewRegle