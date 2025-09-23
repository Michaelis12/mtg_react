import "./navbarUser.css";
import React from 'react';
import axiosInstance from "../api/axiosInstance";
import { useNavigate} from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../context/authContext"
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { CgCloseO  } from "react-icons/cg";
import { FiMenu } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";

const NavbarUser = function () {
    const [userRegles, setUserRegles] = React.useState(false)
    const [userCards, setUserCards] = React.useState(false)
    const [userDecks, setUserDecks] = React.useState(false)
    const [userLog, setUserLog] = React.useState(false)
    const [userNotifs, setUserNotifs] = React.useState(false)
    const [notifications, setNotifications] = React.useState([]);
    const [alertNotifs, setAlertNotifs] = React.useState(false);
    const [displayNavBarMobile, setDisplayNavBarMobile] = useState(false);
    const { authLogOut, getNotifs } = useContext(AuthContext);
    const navigate = useNavigate();
 

    // Ouvre le hover regles
    const navRegles = () => {
        setUserRegles(true)
        setUserCards(true)
        setUserDecks(false)
        setUserLog(false)
        }

    // Ouvre le hover cards
    const navCards = () => {
        setUserCards(true)
        setUserDecks(false)
        setUserLog(false)
        }

    // Ouvre le hover decks
    const navDecks = () => {
        setUserCards(false)
        setUserDecks(true)
        setUserLog(false)
        }

    // Ouvre le hover log
    const navLog = () => {
        setUserCards(false)
        setUserDecks(false)
        setUserLog(true)
        }
    
    // Se déconnecter
    const deconnexion =  () => {
        authLogOut()
        navigate('/');
        
    } 

    // Fermer tous les logs
    const resetAll = () => {
        setUserCards(false)
        setUserDecks(false)
        setUserLog(false)
        setUserNotifs(false)
    }

    // Naviguer vers un deck
    const navDeck = (id) => {
        navigate(`/deckbuilding`, { state: { deckID: id } })
    };

    // Naviguer vers un user
    const navUser = (id) => {
        navigate(`/userSelected`, { state: { userID: id } })
    };

    // Afficher les régles dans la navbar mobile
        const [arrowSensRegles, setArrowSensRegles] = useState(<SlArrowDown/>)
    
         useEffect(() => {
                            const navMobileRegles = () => {
                              
                              if (navRegles) {
                                setArrowSensRegles((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp color="white"/> : <SlArrowDown color="white"/>));
                                 } 
                              else {
                                setArrowSensRegles((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp color="white"/> : <SlArrowDown color="white"/>));
                                   }
                              } 
                    navMobileRegles() }, [userRegles]);
         
         
         // Afficher les cartes dans la navbar mobile
         const [arrowSensCards, setArrowSensCards] = useState(<SlArrowDown/>)
    
         useEffect(() => {
                            const navMobileCards = () => {
                              
                              if (navCards) {
                                setArrowSensCards((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp color="white"/> : <SlArrowDown color="white"/>));
                                 } 
                              else {
                                setArrowSensCards((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp color="white"/> : <SlArrowDown color="white"/>));
                                   }
                              } 
                    navMobileCards() }, [userCards]);
    
    
        // Afficher les decks dans la navbar mobile
         const [arrowSensDecks, setArrowSensDecks] = useState(<SlArrowDown/>)
    
         useEffect(() => {
                            const navMobileDecks = () => {
                              
                              if (navDecks) {
                                setArrowSensDecks((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp color="white"/> : <SlArrowDown color="white"/>));
                                 } 
                              else {
                                setArrowSensDecks((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp color="white"/> : <SlArrowDown color="white"/>));
                                   }
                              } 
                    navMobileDecks() }, [userDecks]);
    
            
        // Afficher la log dans la navbar mobile
        const [arrowSensLog, setArrowSensLog] = useState(<SlArrowDown/>)
    
         useEffect(() => {
                            const navMobileLog = () => {
                              
                              if (navLog) {
                                setArrowSensLog((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp color="white"/> : <SlArrowDown color="white"/>));
                                 } 
                              else {
                                setArrowSensLog((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp color="white"/> : <SlArrowDown color="white"/>));
                                   }
                              } 
                    navMobileLog() }, [userLog]);

     // Afficher les notifications dans la navbar mobile
    const [arrowSensNotifs, setArrowSensNotifs] = useState(<SlArrowDown/>)   


    useEffect(() => {
                    const navMobileNotifs = () => {
                              
                              if (userNotifs) {
                                setArrowSensNotifs((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp color="white"/> : <SlArrowDown color="white"/>));
                                 } 
                              else {
                                setArrowSensNotifs((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp color="white"/> : <SlArrowDown color="white"/>));
                                   }
                              } 
                    navMobileNotifs() }, [userNotifs]);


    
    // Ouvre le hover notifications
    const navNotifs = () => {
        setUserCards(false)
        setUserDecks(false)
        setUserLog(false)
        setUserNotifs(true)
    }

    // Récupérer les notifications
    const displayNotifs = async () => {
        const response = await getNotifs();
        setNotifications(response);
    }
    useEffect(() => {
        displayNotifs();
    }, [alertNotifs]);

    // Supprimer une notif
    const deleteNotif = async (id) => {
        try {
            await axiosInstance.delete(`f_user/deleteUserNotif?notifID=${id}`, {withCredentials: true});
            setAlertNotifs(!alertNotifs);
        } catch (error) {
            console.log(error);
        }
    }
        
              

    return ( 

        <div>
            <nav className="nav-container" onMouseLeave={resetAll}>
                <div className="nav-item" onMouseLeave={resetAll}>
                    <strong className="p-navbar" onClick={()=>{navigate(`/rules`); sessionStorage.clear();}}>Règles du jeu</strong>
                </div>
                <div className="nav-item" onMouseLeave={resetAll}>
                    <strong className="p-navbar" onMouseEnter={()=> navCards()}>Cartes</strong>            
                    { userCards && (
                        <div className="hv-card-nav">
                            <button className="btn-navbar" onClick={()=>{navigate(`/cards`); sessionStorage.clear();} }>Recherche avancée</button>
                            <button className="btn-navbar" onClick={()=>{navigate(`/mySpace`, { state: { arrowUp2: true } }); sessionStorage.clear();}}>Cartes likées</button>
                        </div>
                    )}
                </div>
                <div className="nav-item" onMouseLeave={resetAll}>
                    <strong className="p-navbar" onMouseEnter={()=> navDecks()}>Decks</strong>
                    { userDecks && (
                        <div className="hv-user-nav">
                            <button className="btn-navbar" onClick={()=>{navigate(`/decks`); sessionStorage.clear();}}>Recherche avancée</button>
                            <button className="btn-navbar" onClick={()=>{navigate(`/mySpace`, { state: { arrowUp: true } }); sessionStorage.clear();}}>Decks créés</button>
                            <button className="btn-navbar" onClick={()=>{navigate(`/mySpace`, { state: { arrowUp3: true } }); sessionStorage.clear();}}>Decks likées</button>
                            <button className="btn-navbar" onClick={()=>{navigate(`addDeck`); sessionStorage.clear();}}>Créer un deck</button>
                        </div>
                    )}
                </div>
                <div className="nav-item" onMouseLeave={resetAll}> 
                    <strong className="p-navbar" onClick={()=>navigate(`/mySpace`)} onMouseEnter={()=> navLog()}>Espace personnel</strong>
                    { userLog && (
                        <div className="hv-log-nav" onMouseLeave={()=> setUserLog(!userLog)} onClick={()=>navLog()}>
                            <button className="btn-navbar" onClick={()=> deconnexion()}>Se déconnecter</button>
                        </div>
                    )}
                </div>
                <div className="nav-item" onMouseLeave={resetAll}>
                    <IoNotificationsOutline size={'2em'} color="white" onMouseEnter={()=> navNotifs()} />
                    {notifications.length > 0 && (
                        <p className="alert-notif">{notifications.length}</p>
                    )}
                    { userNotifs && (
                        <div className="hv-notifs-nav" onMouseLeave={()=> setUserNotifs(!userNotifs)}>
                            {notifications.length > 0 ? (
                                notifications.map((notification, index) => (
                                    <div key={index} className="notification-item">
                                        <p style={{
                                            fontFamily: 'Arial', 
                                            fontWeight: 'normal', 
                                            fontStyle: 'normal',
                                            margin: '5px 0'
                                        }}>
                                            <span 
                                                onClick={() => {navUser(notification.issuerID); sessionStorage.clear();}}
                                                style={{
                                                    color: '#007bff',
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {notification.issuerPseudo}
                                            </span>
                                            {' a liké votre deck '}
                                            <br/>
                                            <span 
                                                onClick={() => {navDeck(notification.deckID); sessionStorage.clear();}}
                                                style={{
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {notification.deckName}
                                            </span>
                                        </p>
                                        <CgCloseO onClick={()=>deleteNotif(notification.id)} size={"2em"}/>
                                    </div>
                                ))
                            ) : (
                                <div className="notification-blank-p">
                                    <p>Aucune notification</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            <div className="menu"><FiMenu onClick={()=>setDisplayNavBarMobile(!displayNavBarMobile)} className="icon-menu" color="white" size={'3em'}/></div>

        { displayNavBarMobile && (
            <nav className="nav-mobile">
                <CgCloseO className='icon-close-navbar' color='white' size={'3em'} onClick={()=>setDisplayNavBarMobile(!displayNavBarMobile)}/>
                <button className="section-navbar-mobile" onClick={()=> {setUserRegles(!userRegles)}}><strong>Règles du jeu</strong><span className="icon-fleche">{arrowSensRegles}</span></button>
                { userRegles && ( 
                    <div className="btn-navbar-mobile-hover">
                        <button className="btn-navbar-mobile" onClick={()=>{navigate(`/rules`); sessionStorage.clear();setDisplayNavBarMobile(!displayNavBarMobile);}}>Consulter les règles</button>
                    </div>
                )}
                <button className="section-navbar-mobile" onClick={()=> {setUserCards(!userCards)}}><strong>Cartes</strong><span className="icon-fleche">{arrowSensCards}</span></button>
                { userCards &&(
                    <div className="btn-navbar-mobile-hover">
                        <button className="btn-navbar-mobile" onClick={()=>{navigate(`/cards`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Recherche avancée</button>
                        <button className="btn-navbar-mobile" onClick={()=>{navigate(`/mySpace`, { state: { arrowUp2: true } }); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Cartes likées</button>
                    </div>
                )}
                <button className="section-navbar-mobile" onClick={()=> {setUserDecks(!userDecks)}}><strong>Decks</strong><span className="icon-fleche">{arrowSensDecks}</span></button>
                { userDecks && (
                    <div className="btn-navbar-mobile-hover">
                        <button className="btn-navbar-mobile" onClick={()=>{navigate(`/decks`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Recherche avancée</button>
                        <button className="btn-navbar-mobile" onClick={()=>{navigate(`/mySpace`, { state: { arrowUp: true } }); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Decks créés</button>
                        <button className="btn-navbar-mobile" onClick={()=>{navigate(`/mySpace`, { state: { arrowUp3: true } }); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Decks likés</button>
                        <button className="btn-navbar-mobile" onClick={()=>{navigate(`addDeck`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Créer un deck</button>
                    </div>
                )}
                <button className="section-navbar-mobile" onClick={()=> {setUserLog(!userLog)}}><strong>Compte</strong><span className="icon-fleche">{arrowSensLog}</span></button>
                { userLog && (
                    <div className="btn-navbar-mobile-hover">
                        <button className="btn-navbar-mobile" onClick={()=> {navigate(`/mySpace`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Espace personnel</button>
                        <button className="btn-navbar-mobile" onClick={()=> {deconnexion(); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Se déconnecter</button>
                    </div> 
                )}
                <button className="section-navbar-notif-mobile" onClick={()=> {setUserNotifs(!userNotifs);}}>
                            <strong style={{marginLeft: notifications.length < 1 ? '20%' : '0'}}>Notifications</strong>                            
                            {notifications.length > 0 && (
                            <p className="alert-notif-mobile">{notifications.length}</p> 
                            )}
                            <span className="icon-fleche">{arrowSensNotifs}</span></button>
                { userNotifs && ( 
                                        <div className="btn-navbar-mobile-hover" style={{marginTop:'1px'}}>
                                            {notifications.length > 0 ? (
                                                notifications.map((notification, index) => (
                                                    <div key={index} className="notification-item-mobile">
                                                        <p style={{
                                                            fontFamily: 'Arial', 
                                                            fontWeight: 'normal', 
                                                            fontStyle: 'normal',
                                                            margin: '5px 0'
                                                        }}>
                                                            <span 
                                                                onClick={() => {navUser(notification.issuerID); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}
                                                                style={{
                                                                    color: '#007bff',
                                                                    textDecoration: 'underline',
                                                                    cursor: 'pointer',
                                                                    fontWeight: 'bold'
                                                                }}
                                                            >
                                                                {notification.issuerPseudo}
                                                            </span>
                                                            {' a liké votre deck '}
                                                            <span 
                                                                onClick={() => {navDeck(notification.deckID); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}
                                                                style={{
                                                                    color: '#007bff',
                                                                    textDecoration: 'underline',
                                                                    cursor: 'pointer',
                                                                    fontWeight: 'bold'
                                                                }}
                                                            >
                                                                {notification.deckName}
                                                            </span>
                                                        </p>
                                                        <CgCloseO onClick={()=>deleteNotif(notification.id)} size={"2em"}/>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="notification-empty-mobile">Aucune notification</p>
                                            )}
                                        </div> 
                )}
            </nav> 
        )}

        </div>
    )
}

export default NavbarUser
