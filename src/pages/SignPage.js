import BackgroundMTG from "../assets/background_zombie.jpg"
import defaultImg from "../assets/default_avatar.jpg"
import loading from "../assets/loading.gif"
import React from 'react';
import "./css/SignPage.css"
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authContext"
import axiosInstance, { setCsrfToken, setJwtToken } from "../api/axiosInstance"; 
import backgroundForm from "../assets/background_white.png"
import Section from "../components/section";
import validator from "validator";
import { IoIosArrowDropleft } from "react-icons/io";



const SignPage = function () {  
    
    const { authLogIn } = useContext(AuthContext);
    const [pseudo, setPseudo] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
    const [verificationCode, setVerificationCode] = React.useState("");
    const [avatar, setAvatar] = React.useState(defaultImg);
     const [bio, setBio] = React.useState("Apprenti Deckbuilder");
    const navigate = useNavigate();
    const [existingAccount, setExistingAccount] = React.useState(true);
    const [activeAccount, setActiveAccount] = React.useState(true);
    const [forgotPassword, setForgotPassword] = React.useState(false);
    const [sendCode, setSendCode] = React.useState(false);
    const [changepassword, setChangePassword] = React.useState(false);
    const [completeState, setCompleteState] = React.useState(false);
    const [errorContent, setErrorContent] = React.useState(null);
    const [borderPseudoColor, setBorderPseudoColor] = React.useState(null);
    const [borderPasswordColor, setBorderPasswordColor] = React.useState(null);
    const [displayLoading, setDisplayLoading] = React.useState(false);

    // Passer du form de connexion au form d'inscription
    const switchForm = () => {
        setExistingAccount(!existingAccount);
        setActiveAccount(!activeAccount)
        setErrorContent(null)
    }

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



    // Form Inscription 
    const signUp = async (e) => {
    e.preventDefault();
       setErrorContent(null) 
       setDisplayLoading(true)
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
        if(regex.test(password)) {
                try{

                    const user = {
                    pseudo,
                    email,
                    password,
                    confirmPassword, 
                    avatar,
                    bio 
                    }

                    const response = await axiosInstance.post('/f_all/inscription', user);
                    setExistingAccount(true)
                    setErrorContent(null)
                    setDisplayLoading(false)


                }catch (error) {
                    setErrorContent(error.response.data)
                    setDisplayLoading(false)

                } 
            }
        
        else {
            setErrorContent("Le mot de passe ne respecte pas les instructions")
            setDisplayLoading(false)
        }   


    }

    // Form code de vérification pour activer le compte après l'inscription
    const verifyUser = async (e) => {
    e.preventDefault();
    setDisplayLoading(true)

        try{
        
            const response = await axiosInstance.post(`/f_all/verificationSign?email=${email}&code=${verificationCode}`, null);

            setActiveAccount(true)
            setErrorContent(null)
            setDisplayLoading(false)

                    

        }catch (error) {
            setErrorContent(error.response.data)
            setDisplayLoading(false)

                } 
            }   


    
    // Form Connexion
    const logIn = async (e) => {
        e.preventDefault();
    
            try{  
                setErrorContent(null)
                setDisplayLoading(true)

                const user = {
                    email,
                    password
                }  
    
                const response = await axiosInstance.post('/f_all/login', user, { withCredentials: true });  
    
                const authentification = response.data; 
                
                const roles = authentification.authorities.map(auth => auth.authority);
                authLogIn(roles);

                setDisplayLoading(false)
                navigate('/myspace')

    
            }catch (error) {
                setDisplayLoading(false)
                setErrorContent(error.response.data)
            }}

            
    const [avertCodeSend, setAvertCodeSend] = React.useState(false);
    // Form envoie code pour password oublié
    const sendLinkPassword = async (e) => {

        if(e) {
            e.preventDefault();
        }

        setDisplayLoading(true)

            try{ 

                setErrorContent(null)
                setAvertCodeSend(false)
               
                const response = await axiosInstance.post(`/f_all/forgotPassword?email=${email}`, { withCredentials: true });   
                
                if(!sendCode) {
                    setSendCode(true)
                }

                if(!e) {
                    setAvertCodeSend(true)
                }
                setDisplayLoading(false)

    
            }catch (error) {
                setErrorContent(error.response.data)
                setDisplayLoading(false)

            }}

    // Renvoie vers un form pour insérer un nouveau password
    const navChangePassword = async (e) => {
        e.preventDefault();
        setDisplayLoading(true)


        try {

            setErrorContent(null)
             const params = {
                    email: email,
                    code: verificationCode,
                    
                };
               
                const response = await axiosInstance.post(`/f_all/verification`, null,
                {
                  params,
                  paramsSerializer: {
                    indexes: null // Cela désactive l'ajout des crochets
                } }); 

                setChangePassword(true)
                setDisplayLoading(false)

            
        } catch (error) {
            setErrorContent(error.response.data)
            setDisplayLoading(false)

        }
        
    }

    // Modifie le password de l'user et renvoie au form de connexion 
    const resetPassword = async (e) => {
        e.preventDefault();
        setDisplayLoading(true)

    
            try{  
                setErrorContent(null)

                const params = {
                    email: email,
                    newPassword: newPassword,
                    code: verificationCode,
                    
                };
               
                const response = await axiosInstance.post(`/f_all/resetPassword`, null,
                {
                  params,
                  paramsSerializer: {
                    indexes: null // Cela désactive l'ajout des crochets
                } },
                 { withCredentials: true });   
    
                setSendCode(true)
                setForgotPassword(false)
                setSendCode(false)
                setChangePassword(false)
                setActiveAccount(true)
                setDisplayLoading(false)

                
    
            }catch (e) {
                setErrorContent("Les mots de passe ne correspondent pas")
                setDisplayLoading(false)

            }}

    const logStyle = () => {
        if(errorContent !== null) {
            return 'red';
        }
    }
        React.useEffect(() => {
                logStyle();
            }, [errorContent]);

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

       
     const quitForgotPassword = () => {

        setErrorContent(null)
        setForgotPassword(false);
     }

     const quitSendCode = () => {
        setErrorContent(null)
        setSendCode(false)
        setAvertCodeSend(false)
     } 

     const quitChangePassword = () => {
        setErrorContent(null)
        setChangePassword(false)
     }

     const quitActiveAccount = () => {
        setErrorContent(null)
        setExistingAccount(false)
        setAvertCodeSend(false)
     }
     
     
 
    
    return (
    <Section> 
        <div className="sign-container">
        <img src={BackgroundMTG} className="background-sign" alt="Image 1" />
        { displayLoading && (
        <img src={loading} className="loading-img" alt="Image 1" />
        )}
        
        {/* Form d'inscription */}
        {!activeAccount && !existingAccount && (
            <div className="login-container" style={{marginTop: '2%', marginBottom: '1%', backgroundImage: `url(${backgroundForm})`}}>
            <h1 className="title-log">Inscription</h1>

            <div className="alert-send-error-container">
                    <h6 className="alert-send-error-auth">{errorContent}</h6>
                </div>
            
            <form className="sign-form" onSubmit={signUp} style={{marginTop: '2%'}}> 
                <div className="input-group">
                    <label>Pseudo :</label>
                    
                    <input type="pseudo" id="pseudo" name="pseudo" placeholder="ex : MagicPlayer1"
                    onChange={(e) => setPseudo(e.target.value)} style={{borderColor: pseudoStyle()}}/>
                    <p className="instruction-para">  doit faire entre 5 et 15 caractères</p>
                </div>
                <div className="input-group">
                    <label >E-mail :</label>
                    <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)}
                    style={{borderColor: emailStyle()}}  required/>
                </div>
                <div className="input-group">
                    <label>Mot de passe :</label>
                    <input type="password" id="password" onChange={(e) => setPassword(e.target.value)}
                    placeholder="entre 8 et 20 caractères avec au moins une majuscule et un caractère spécial"
                    style={{borderColor: passwordStyle()}} required/>
                    <p className="instruction-para">  doit contenir entre 8 et 20 caractères, au moins une majuscule, au moins un caractère spécial  </p>
                </div>
                <div className="input-group">
                    <label>Confirmation du mot de passe :</label>
                    <input type="password" id="password" onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{borderColor: passwordStyle()}} required/>
                </div> 
                <div className="link-group">
                    <button className="valid-form" type="submit" disabled={!completeState}
                    ><h4>S'inscrire</h4></button>
                </div>
                <div className="nav-form-container">
                    <button className="nav-form" onClick={()=>switchForm()}><p>Se connecter</p></button>
                </div>
                
            </form> 
            
            
            </div>
            )}

         {/* Form validation de l'inscription */}
        { !activeAccount && existingAccount && (
            <div className="login-container" style={{backgroundImage: `url(${backgroundForm})`}} >
                <h1 className="title-log">Validation</h1>
                <div className="alert-send-error-container">
                        <h6 className="alert-send-error-auth">{errorContent}</h6>
                </div>
                <form className="login-form" onSubmit={verifyUser} style={{width : `100%`}}> 
                    
                    <div className="input-group">
                        <label >Code de vérification :</label>
                        <input type="text" id="code" name="code" onChange={(e) => setVerificationCode(e.target.value)}
                        style={{borderColor: logStyle()}} required/>
                        <p className="p-tutorial">Un code d'activation a été envoyé sur votre adresse mail, veuillez l'entrer</p>
                    </div>

                    <div className="link-group">
                        <button className="valid-form" type="submit" disabled={verificationCode === ""} ><h4>Valider</h4></button>
                    </div>
                    
                </form>
                 <button className="nav-form" type="button"  onClick={()=>sendLinkPassword()}>Renvoyer un code</button>
                 { avertCodeSend &&(
                        <h6 style={{color:'green'}}>Code envoyé avec succès !</h6>
                        )}
                
                <div className="back-icon-container">
                    <IoIosArrowDropleft className="back-icon" size={'5em'} onClick={()=>quitActiveAccount()} />
                </div>
            </div>
        )}

        {/* Form de connexion */}
        {activeAccount && !forgotPassword && ( 
            <div className="login-container" style={{ backgroundImage: `url(${backgroundForm})`}}>
            <h1 className="title-log">Connexion</h1>
            <div className="alert-send-error-container">
                    <h6 className="alert-send-error-auth">{errorContent}</h6>
                </div>
            <form className="login-form" onSubmit={logIn} style={{width : `100%`}}> 
                
                <div className="input-group">
                    <label className="sign-label" >E-mail :</label>
                    <input className="sign-input" type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)}
                    style={{borderColor: logStyle()}} required/>
                </div>
                <div className="input-group">
                    <label className="sign-label">Mot de passe :</label>
                    <input className="sign-input" type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}
                    style={{borderColor: logStyle()}} required/>
                </div>
                <div className="link-group">
                    <button className="valid-form" type="submit" disabled={email === "" || password === ""} >
                        <h4>Se connecter</h4></button>
                    <button className="nav-form" onClick={()=>switchForm()}>S'inscrire</button>
                     <button className="nav-form" onClick={()=>(setForgotPassword(true), 
                    setErrorContent(null))}>Mot de passe oublié</button>
                                      
                </div>               
            </form>
            </div>       
        )}

        {/* Form de renseignement de l'adresse mail */}
        {activeAccount && forgotPassword && !sendCode && (
            <div className="login-container" style={{ backgroundImage: `url(${backgroundForm})`}}>
                <h1 className="title-log">Mot de passe oublié</h1>
                
                <h5 className="p-tutorial"><strong>Entrez l'adresse mail associée à votre compte</strong></h5>

                <div className="alert-send-error-container">
                        <h6 className="alert-send-error-auth">{errorContent}</h6>
                </div>

                <form className="login-form" onSubmit={sendLinkPassword} style={{width : `100%`}}> 

            
                           
                    <div className="input-group">
                        <label >Adresse email :</label>
                        <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)}
                        style={{borderColor: logStyle()}} required/>
                    </div>
                    
                    <div className="link-group">
                        <button className="valid-form" type="submit"  disabled={email === ""} ><h4>Valider</h4></button>
                    </div>
                    
                    
                </form>
                
                <div className="back-icon-container">
                    <IoIosArrowDropleft className="back-icon" size={'5em'} onClick={()=>quitForgotPassword()} />
                </div>

            

            </div>
        )}

        {/* Form de renseignement du code */}
        {activeAccount && sendCode && !changepassword && (
            <div className="login-container" style={{ backgroundImage: `url(${backgroundForm})`}}>
                <h1 className="title-log">Mot de passe oublié</h1>

                <h5 className="p-tutorial"><strong>Entrez le code d'activation reçu par mail</strong></h5>
                <div className="alert-send-error-container">
                        <h6 className="alert-send-error-auth">{errorContent}</h6>
                </div>


                <form className="login-form" onSubmit={navChangePassword} style={{width : `100%`}}> 
                    
                    <div className="input-group">
                        <label >Code :</label>
                        <input type="text" id="text" name="text" onChange={(e) => setVerificationCode(e.target.value)} placeholder="XXXXXXX"
                        style={{borderColor: logStyle()}} required/>
                    </div>

                    <div className="link-group">
                        <button className="valid-form" type="submit" disabled={verificationCode === ""} ><h4>Valider</h4></button>
                        <button className="nav-form" type="button"  onClick={()=>sendLinkPassword()}>Renvoyer un code</button>

                        { avertCodeSend &&(
                        <h6 style={{color:'green'}}>Code envoyé avec succès !</h6>
                        )}
                    </div>
                     
                    
                </form>
                
               
                <div className="back-icon-container">
                    <IoIosArrowDropleft className="back-icon" size={'5em'} onClick={()=>quitSendCode()} />
                </div>
                
                
            </div>
        )}

        {/* Form d'update du mot de passe' */}
        {activeAccount && changepassword && (
            <div className="login-container" style={{ backgroundImage: `url(${backgroundForm})`}}>
                <h1 className="title-log">Mot de passe oublié</h1>
                <h5 className="p-tutorial"><strong>Choisissez votre nouveau mot de passe</strong></h5>
                <div className="alert-send-error-container">
                        <h6 className="alert-send-error-auth">{errorContent}</h6>
                </div>
                <form className="login-form" onSubmit={resetPassword} style={{width : `100%`}}> 
                    
                    <div className="input-group">
                    <label>Nouveau Mot de passe :</label>
                    <input type="password" id="password" onChange={(e) => setNewPassword(e.target.value)} placeholder="ex : M@agicPlayer12"
                    style={{borderColor: passwordStyle()}} required/>
                    <p className="instruction-para">  doit contenir entre 8 et 20 caractères, au moins une majuscule, au moins un caractère spécial  </p>
                </div>
                
                
                <div className="input-group">
                    <label>Confirmation du nouveau mot de passe :</label>
                    <input type="password" id="password" onChange={(e) => setConfirmNewPassword(e.target.value)}
                    style={{borderColor: passwordStyle()}} required/>
                </div> 
                <div className="link-group">
                        <button className="valid-form" type="submit" ><h4>Valider</h4></button>
                    </div>
                </form>
                <div className="back-icon-container">
                    <IoIosArrowDropleft className="back-icon" size={'5em'} onClick={()=>quitChangePassword()} />
                </div>
                
            </div>
        )}
            
        </div>
    </Section>
    )
}

export default SignPage