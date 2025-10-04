import "./css/SettingPage.css"
import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../context/authContext"
import {useNavigate} from 'react-router-dom';
import axiosInstance from "../api/axiosInstance";
import { LuRefreshCw } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import Section from '../components/section';
import PopupDelete from "../components/popupDelete";
import ButtonValidPopup from "../components/buttonValidPopup";
import 'bootstrap/dist/css/bootstrap.min.css';
import { CgCloseO  } from "react-icons/cg";
import { ImCross } from "react-icons/im";
import { RiDeleteBin6Line } from "react-icons/ri";
import loading from "../assets/loading.gif"
import backgroundWhite from "../assets/background_white.png"



const SettingPage = function () {

  const [deckBuilder, setDeckBuilder] = useState([])
  const [displayDesacPopUp, setDisplayDesacPopUp] = useState(false)
  const [displayDeletePopUp, setDisplayDeletePopUp] = useState(false)
  const [displayResetPassword, setDisplayResetPassword] = React.useState(false)
  const [displayLoading, setDisplayLoading] = useState(false);
  const [userDecks, setUserDecks] = useState([])
  const { authLogOut } = useContext(AuthContext);
  

  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);

  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [errorContent, setErrorContent] = React.useState(null);
  const [succesContent, setSuccesContent] = React.useState(null);
  

    // Récupère les données de l'user
    useEffect(() => {
            const getDeckBuilder = async () => {
                try {
                    setDisplayLoading(true);
                    const request = await axiosInstance.get(`/f_user/getDeckBuilder`,
                    { withCredentials: true }
                    );
    
                    const response = request.data

                    // Contient les RequestParams de la requete
                    const params = {
                            userID : request.data.id,
                            page: 0,
                            size: 1,
                            order: "date"
                    };
    
                    const request2 = await axiosInstance.get('f_all/getDecksUserPaged', {
                      params,
                      paramsSerializer: {
                        indexes: null // Cela désactive l'ajout des crochets
                      }
                    });
        
                 
                    setUserDecks(request2.data.deckNumber)      
                    setDeckBuilder(response)
                    setDisplayLoading(false);
                }   
                catch (error) {
                    setDisplayLoading(false);
                    console.log(error);
                }
    
        
            }
            getDeckBuilder();
            }, []);


    // Affiche le nombre de decks publics de l'user 

    useEffect(() => {
                    const getDecks = async () => {
                        try {
                            setDisplayLoading(true)
    
    
                    // Contient les RequestParams de la requete
                    const params = {
                            userID : deckBuilder.id,
                            page: 0,
                            size: 1,
                            order: "date"
                    };
    
                    const response = await axiosInstance.get('f_all/getDecksUserPaged', {
                      params,
                      paramsSerializer: {
                        indexes: null // Cela désactive l'ajout des crochets
                      }
                    });
        
                 
                    setUserDecks(response.data.deckNumber)
                    setDisplayLoading(false)
                               
            
                        }   
                        catch (error) {
                            setDisplayLoading(false)
                            console.log(error);
                        }           
                    }
                getDecks();
                }, []);


    // Affichage de couleur d'arrière-plan en fonction de l'activité
     const getBackgroundColor = (activity ) => {
        if(activity === "PUBLISHER") {
            return 'rgba(255, 165, 0)'
        }
        if(activity === "CREATOR") {
            return 'rgba(60, 179, 113)'
        }
        
        if(activity === "VIEWVER") {
            return 'rgba(180, 180, 180)'
        }
        if(activity === "INACTIVE") {
            return 'rgba(255,0,0)'
        }
       
    }
 
    // Affiche le total de likes obtenus par l'user
    const [userLikes, setUserLikes] = useState([])
    const id = deckBuilder.id

            useEffect(() => {
                const getUserLikes = async () => {
                    try {
                        setDisplayLoading(true);
                        const response = await axiosInstance.get(`/f_all/getUserLikes?userID=${id}`);
                    
            
                        setUserLikes(response.data)
                        setDisplayLoading(false);
                    }   
                    catch (error) {
                        setDisplayLoading(false);
                        console.log(error);
                    }           
                }
            getUserLikes();
            }, [id]); 

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 850);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);


    


    // Changer le mot de passe 
     const updatePassword = async (e) => {
            e.preventDefault();

                  if (newPassword !== confirmNewPassword) {
                    setErrorContent("Les mots de passe ne correspondent pas.");
                    return; // On arrête la fonction ici
                  }
    

                try {

                    const requestBody = {
                    password,
                    newPassword
                } 
                

                    setDisplayLoading(true);
                    const request = await axiosInstance.put(`/f_user/updatePassword`, requestBody,
                    { withCredentials: true }
                    );
                    setSuccesContent("Mot de passe mis à jour");
                    setDisplayLoading(false);
                    setDisplayResetPassword(false);
                    setSuccesContent(null);
                }   
                catch (error) {
                    setDisplayLoading(false);
                    setErrorContent(error?.response?.data || "Echec de la requête");
                    console.log(error);
                }
            }


    const passwordStyle = () => {
            if(errorContent !== null)
                    return 'red';
            }
        
            React.useEffect(() => {
                    passwordStyle();
                }, [errorContent]);


        // Desactive l'user
      const desacAccount = async () => {
        try {
            setDisplayLoading(true);
            const request = await axiosInstance.put(`/f_user/desacAccount`, null, { withCredentials: true });
            authLogOut()
            navigate('/')
            setDisplayLoading(false);
            
        }   
        catch (error) {
            setDisplayLoading(false);
            console.log(error);
        }
      }



      // Supprime l'user
      const deleteAccount = async () => {
        try {
            setDisplayLoading(true);
            const request = await axiosInstance.delete(`/f_user/deleteAccount`, { withCredentials: true });
            authLogOut()
            navigate('/')
            setDisplayLoading(false);

            
        }   
        catch (error) {
            setDisplayLoading(false);
            console.log(error);
        }


    }

  

    return (
        <Section>
            { displayLoading && (
                <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
            )}
            <div className="setting-responsive-container">
            <div className="setting-bckg">

                <div className="settings-container">
                        <div className='header-popup-container'> 
                                <IoSettingsOutline size="3em" />
                                <h1 className='title-setting'>Paramètres avancés du compte</h1>
                        </div>
                          
                      <div className="table-container" style={{ backgroundImage: `url(${backgroundWhite})`}}>
                        {isMobile ? (
                          <div className="table-mobile-attributes">
                            <div className="table-mobile-row"><span className="table-mobile-label">Pseudo</span><span className="table-mobile-value">{deckBuilder.pseudo}</span></div>
                            <div className="table-mobile-row"><span className="table-mobile-label">Email</span><span className="table-mobile-value">{deckBuilder.email}</span></div>
                            <div className="table-mobile-row"><span className="table-mobile-label">Date d'inscription</span><span className="table-mobile-value">{deckBuilder.dateSign}</span></div>
                            <div className="table-mobile-row"><span className="table-mobile-label">Activité</span><span className="table-mobile-value"><p className='card-format'>{deckBuilder.activity}</p></span></div>
                            <div className="table-mobile-row"><span className="table-mobile-label">Decks créés</span><span className="table-mobile-value">{deckBuilder.decksNumber}</span></div>
                            <div className="table-mobile-row"><span className="table-mobile-label">Decks publics</span><span className="table-mobile-value">0</span></div>
                            <div className="table-mobile-row"><span className="table-mobile-label">Total de likes obtenus</span><span className="table-mobile-value">{userLikes}</span></div>
                          </div>
                        ) : (
                          <table className="table-attributes">
                            <tr>
                                <td>Pseudo</td>
                                <td>{deckBuilder.pseudo}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{deckBuilder.email}</td>
                            </tr>
                            <tr>
                                <td>Date d'inscription</td>
                                <td>{deckBuilder.dateSign}</td>
                            </tr>
                            <tr> 
                                <td>Activité</td>
                                <td><span className='card-format' style={{ backgroundColor: getBackgroundColor(deckBuilder.activity), fontSize : "0.8em" }} >{deckBuilder.activity}</span></td>
                            </tr>
                            <tr>
                                <td>Decks créés</td>
                                <td>{deckBuilder.decksNumber}</td>
                            </tr>
                            <tr>
                                <td>Decks publics</td>
                                <td>{userDecks}</td>
                            </tr>
                            <tr> 
                                <td>Total de likes obtenus</td>
                                <td>{userLikes}</td>
                            </tr> 
                          </table>
                        )}
                              

                    </div> 
                            
                     
                </div> 

                <div className='admin-users-button'>                                                   
                        <button className='update-user-container' onClick={() => setDisplayResetPassword(true)} >
                                                                            <LuRefreshCw  className='icon-update-user' />
                                                                            <h5 className='update-user-p'>Réinitialiser le mot de passe</h5>
                        </button> 
                
                        <button className='update-user-container' onClick={() => setDisplayDesacPopUp(true)} >
                                                                            <ImCross className='icon-update-user' />
                                                                            <h5 className='update-user-p'>Desactiver le compte</h5>
                        </button> 

                        <button className='update-user-container' onClick={() => setDisplayDeletePopUp(true)} >
                                                                            <RiDeleteBin6Line className='icon-update-user' />
                                                                            <h5 className='update-user-p'>Supprimer le compte</h5>
                        </button> 
                                                         
                </div>

                <CgCloseO className='icon-close-popup' color='white' size={'5em'}  onClick={()=>navigate(-1)}/>

            {/*Popup modification de password*/}
            {displayResetPassword && ( 
                <div className="popup-bckg">
                             
                            <div className="login-container" style={{ backgroundImage: `url(${backgroundWhite})`, marginTop: '0%'}}>
                                <h2 className="title-log">Modifier le mot de passe</h2>
                                <div className="alert-send-error-container">
                                        <h6 className="alert-send-error-auth">{errorContent}</h6>
                                </div>
                                <div className="alert-send-error-container">
                                        <h6 className="alert-send-error-auth" style={{color: 'green'}}>{succesContent}</h6>
                                </div>
                                <form className="login-form" onSubmit={updatePassword} style={{width : `100%`}}> 

                                <div className="input-group">
                                    <label className="sign-label">Mot de passe actuel :</label>
                                    <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} 
                                     className="sign-input" style={{borderColor: passwordStyle()}} required/>
                                </div>
                                    
                                <div className="input-group">
                                    <label className="sign-label">Nouveau Mot de passe :</label>
                                    <input type="password" id="newPassword" onChange={(e) => setNewPassword(e.target.value)} placeholder="ex : M@agicPlayer12"
                                     className="sign-input" style={{borderColor: passwordStyle()}} required/>
                                    <p className="instruction-para">  doit contenir entre 8 et 20 caractères, au moins une majuscule, au moins un caractère spécial  </p>
                                </div>
                                
                                
                                <div className="input-group">      
                                    <label className="sign-label">Confirmation du nouveau mot de passe :</label>
                                    <input type="password" id="confirmPassword" onChange={(e) => setConfirmNewPassword(e.target.value)}
                                     className="sign-input" style={{borderColor: passwordStyle()}} required/>
                                </div> 
                                <div className="link-group">
                                        <button className="valid-popup" 
                                        disabled={password === "" || newPassword === "" || confirmNewPassword ==="" && displayLoading} type="submit" 
                                        ><h4 className="valid-popup-title" >Valider</h4></button>
                                    </div>
                                </form>                             
                            </div>
                            

                             
                        
                        <CgCloseO className='icon-close-popup' color='white' size={'5em'}  onClick={()=>{setDisplayResetPassword(false); setErrorContent(null); 
                            setPassword("");  setNewPassword(""); setConfirmNewPassword("")}}/>
                </div>
            )}

            {displayDesacPopUp && ( 

            <div className='popup-bckg'> 
                <div className='popup-delete' style={{ backgroundImage: `url(${backgroundWhite})`}}>
                    <div className='header-popup-delete' style={{gap: "10px"}}>
                                        <ImCross  className="desac-icon" />
                                        <h1 className="popup-delete-title">Désactiver le compte ?</h1>
                    </div>
                    <div className="avert-header">
                                        <h4 className="avert-p2">Une fois désactivé votre compte, comme vos decks ne seront plus visibles par les autres utilisateurs</h4> 
                                        <h4 className="avert-p2"> Êtes-vous sûr(e) de vouloir continuer ?</h4>
                    </div>                                     
                    <ButtonValidPopup disabled={displayLoading} onClick={() => desacAccount()}/>
                </div> 
            <CgCloseO className='icon-close-popup' color='white' size={'5em'}  onClick={() => setDisplayDesacPopUp(false)}/> 
        </div> 
            )} 

            {displayDeletePopUp && ( 
        
                <PopupDelete 
                    title={"Supprimer le compte ?"} 
                    text={"Une fois désactivé votre compte, comme vos decks seront perdu à jamais"}
                    onClick={() => deleteAccount()}
                    back={() => setDisplayDeletePopUp(false)}
                />
            )
            } 
   
        </div>
        </div>
    </Section>
  

  )
}

export default SettingPage
