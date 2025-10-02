import BackgroundMTG from "../assets/background_zombie.jpg"
import defaultImg from "../assets/default_avatar.jpg"
import loading from "../assets/loading.gif"
import React from 'react';
import "./css/SignPage.css"
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authContext"
import axiosInstance from '../api/axiosInstance';
import backgroundForm from "../assets/background_white.png"
import Section from "../components/section";



const NewAdmin = function () {  
    
    const [pseudo, setPseudo] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [avatar, setAvatar] = React.useState(defaultImg);
    const [bio, setBio] = React.useState("Apprenti Deckbuilder");
    const [completeState, setCompleteState] = React.useState(false);
    const [errorContent, setErrorContent] = React.useState(null);
    const [borderPseudoColor, setBorderPseudoColor] = React.useState(null);
    const [borderPasswordColor, setBorderPasswordColor] = React.useState(null);
    const [displayLoading, setDisplayLoading] = React.useState(false);
    const [alertAdminSend, setAlertAdminSend] = React.useState(false)
  

    // Vérifie que tous les champs sont remplis lors de l'inscription
    const verifyState = () => {
        if( pseudo.length > 4 && pseudo.length < 16 && email.length > 1 && password.length > 7 && confirmPassword.length > 7) {
            setCompleteState(true)          
        }
        else {
           setCompleteState(false) 
        }
    }
    React.useEffect(() => {
              verifyState();
          }, [pseudo, email, password, confirmPassword]);


     const pseudoStyle = () => {
            if(errorContent !== null)
                
                if (errorContent.includes("pseudo")) {
                    return 'red';
                }
            }
        
        React.useEffect(() => {
                  pseudoStyle();
              }, [errorContent]);
    
    
          const emailStyle = () => {
            if(errorContent !== null)
                
                if (errorContent.includes("email")) {
                    return 'red';
                }
            }
        
            React.useEffect(() => {
                    emailStyle();
                }, [errorContent]);
    
          
          
          const passwordStyle = () => {
            if(errorContent !== null)
                
                if (errorContent.includes("passe")) {
                    return 'red';
                }
            }
        
            React.useEffect(() => {
                    passwordStyle();
                }, [errorContent]);


    // Form ajout d'admin 
    const addAdmin = async (e) => {
       e.preventDefault();
       setErrorContent(null) 
       setDisplayLoading(true)
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
        if(regex.test(password)) {
                try{

                     setAlertAdminSend(false)

                    const user = {
                    pseudo,
                    email,
                    password,
                    confirmPassword, 
                    avatar,
                    bio 
                    }



                    const response = await axiosInstance.post('/f_admin/addAdmin', user, { withCredentials: true });

                    setAlertAdminSend(true)
                    setErrorContent(null)
                    setPseudo("")
                    setEmail("")
                    setPassword("")
                    setConfirmPassword("")
                    setDisplayLoading(false)


                }catch (e) {
                    setErrorContent(e.response.data)
                    setDisplayLoading(false)

                }
            }
        
        else {
            setErrorContent("Le mot de passe ne respecte pas les instructions")
            setDisplayLoading(false)
        }   


    }

return (
    <Section> 
            <div className="sign-container">
            <img src={BackgroundMTG} className="background-sign" alt="Image 1" />
            { displayLoading && (
            <img src={loading} className="loading-img" alt="Image 1" />
            )}
             
            {/* Form d'ajout de l'admin */}
                <div className="login-container" style={{backgroundImage: `url(${backgroundForm})`}}>
                <h1 className="title-log">Ajouter un nouvel administrateur</h1>

                <div className="alert-send-error-container">
                        <h6 className="alert-send-error-auth">{errorContent}</h6>
                    </div>

                { alertAdminSend && (
                    <div className="alert-send-admin-container">
                    <h4 className="alert-send-card" style={{position: 'absolute', color: "green"}}>Administrateur ajouté !</h4>
                    </div>
                )}
                
                <form className="sign-form" onSubmit={addAdmin} style={{marginTop: '2%'}}> 
                    <div className="input-group-sign">
                        <label>Pseudo :</label>
                        
                        <input type="pseudo" id="pseudo" name="pseudo" placeholder="ex : MagicPlayer1" value={pseudo}
                        onChange={(e) => setPseudo(e.target.value)} style={{borderColor: pseudoStyle()}}/>
                        <p className="instruction-para-sign">  doit contenir entre 5 et 15 caractères</p>
                    </div>
                    <div className="input-group-sign">
                        <label >E-mail :</label>
                        <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)}
                        style={{borderColor: emailStyle()}} value={email} required/>
                    </div>
                    <div className="input-group-sign">
                        <label>Mot de passe :</label>
                        <input type="password" id="password" onChange={(e) => setPassword(e.target.value)}
                        placeholder="entre 8 et 20 caractères avec au moins une majuscule et un caractère spécial"
                        style={{borderColor: passwordStyle()}} value={password} required/>
                        <p className="instruction-para-sign">  doit contenir entre 8 et 20 caractères, au moins une majuscule, au moins un caractère spécial  </p>
                    </div>
                    <div className="input-group-sign" style={{marginBottom: '5%'}}>
                        <label>Confirmation du mot de passe :</label>
                        <input type="password" id="password" onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{borderColor: passwordStyle()}} value={confirmPassword} required/>
                    </div> 
                    <div className="link-group">
                        <button className="valid-form" type="submit" disabled={!completeState || displayLoading}
                        ><h4>Ajouter</h4></button>
                    </div>
                    
                </form>
                
                
                </div>

                
        </div>
        </Section>
)
}

export default NewAdmin;



