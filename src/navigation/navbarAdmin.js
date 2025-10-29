import "./navbarAdmin.css";
import React from 'react';
import axios from "axios";
import axiosInstance from "../api/axiosInstance";
import { useState, useEffect, useContext } from 'react';
import { useNavigate} from 'react-router-dom';
import { AuthContext } from "../context/authContext"
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { CgCloseO  } from "react-icons/cg";
import { FiMenu } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
 


const NavbarAdmin = function () {

    const [adminRegles, setAdminRegles] = React.useState(false)
    const [adminCards, setAdminCards] = React.useState(false)
    const [adminDecks, setAdminDecks] = React.useState(false)
    const [adminUsers, setAdminUsers] = React.useState(false)
    const [adminLog, setAdminLog] = React.useState(false)
    const [adminNotifs, setAdminNotifs] = React.useState(false)
    const { authLogOut } = useContext(AuthContext);
    const { getNotifs } = useContext(AuthContext);
    const [displayNavBarMobile, setDisplayNavBarMobile] = useState(false);
    const [notifications, setNotifications] = React.useState([]);
     const [alertNotifs, setAlertNotifs] = React.useState(false);
    const navigate = useNavigate();

    // Ouvre le hover regles
    const navRegles = () => {
        setAdminRegles(true)
        setAdminCards(false)
        setAdminDecks(false)
        setAdminUsers(false)
        setAdminLog(false)
        }
    
    // Ouvre le hover cards 
    const navCards = () => {
        setAdminRegles(false)
        setAdminCards(true)
        setAdminDecks(false)
        setAdminUsers(false)
        }
    
    // Ouvre le hover decks
    const navDecks = () => {
        setAdminRegles(false)
        setAdminCards(false)
        setAdminDecks(true)
        setAdminUsers(false)
        setAdminLog(false)
        }
    
    // Ouvre le hover user
    const navUsers = () => {
        setAdminRegles(false)
        setAdminCards(false)
        setAdminDecks(false)
        setAdminUsers(true)
        setAdminLog(false)
        }

    // Ouvre le hover log
    const navLog = () => {
        setAdminRegles(false)
        setAdminCards(false)
        setAdminDecks(false)
        setAdminUsers(false)
        setAdminLog(true)
        } 
    
    // Ouvre le hover notifications
    const navNotifs = () => {
        setAdminRegles(false)
        setAdminCards(false)
        setAdminDecks(false)
        setAdminUsers(false)
        setAdminLog(false)
        setAdminNotifs(true)
        }
    
    const displayNotifs =  async () => {

        const response = await getNotifs()
        setNotifications(response)
    }
    useEffect(() => {
            displayNotifs();
        }, [alertNotifs]);


    // Supprimer une notif

    const deleteNotif = async (id) => {
            try {
                const request = await axiosInstance.delete(`f_user/deleteUserNotif?notifID=${id}`, 
                    {withCredentials: true});

                setAlertNotifs(!alertNotifs)


            }
            catch (error) {
                console.log(error)
            }
        }

    // Se déconnecter
    const deconnexion =  () => {
        authLogOut()
        navigate('/');
        
    } 


     const resetAll = () => {
        setAdminRegles(false)
        setAdminCards(false)
        setAdminDecks(false)
        setAdminUsers(false)
        setAdminLog(false)
        setAdminNotifs(false)
    }

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
                navMobileRegles() }, [adminRegles]);
     
     
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
                navMobileCards() }, [adminCards]);


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
                navMobileDecks() }, [adminDecks]);

     
     // Afficher les users dans la navbar mobile
      const [arrowSensUsers, setArrowSensUsers] = useState(<SlArrowDown/>)

     useEffect(() => {
                        const navMobileUsers = () => {
                          
                          if (navUsers) {
                            setArrowSensUsers((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp color="white"/> : <SlArrowDown color="white"/>));
                             } 
                          else {
                            setArrowSensUsers((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp color="white"/> : <SlArrowDown color="white"/>));
                               }
                          } 
                navMobileUsers() }, [adminUsers]);

        
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
                navMobileLog() }, [adminLog]);

    // Afficher les notifications dans la navbar mobile
    const [arrowSensNotifs, setArrowSensNotifs] = useState(<SlArrowDown/>)

     useEffect(() => {
                        const navMobileNotifs = () => {
                          
                          if (adminNotifs) {
                            setArrowSensNotifs((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp color="white"/> : <SlArrowDown color="white"/>));
                             } 
                          else {
                            setArrowSensNotifs((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp color="white"/> : <SlArrowDown color="white"/>));
                               }
                          } 
                navMobileNotifs() }, [adminNotifs]);


     useEffect(() => {
                        const closeHover = () => {
                          
                          if (!displayNavBarMobile) {
                                setAdminRegles(false)
                                setAdminCards(false)
                                setAdminDecks(false)
                                setAdminUsers(false)
                                setAdminLog(false)
                                setAdminNotifs(false)
                           
                               }
                          } 
                closeHover() }, [displayNavBarMobile]);

        // Naviguer vers un deck
        const navDeck = (id) => {
            navigate(`/deckbuilding`, { state: { deckID: id  }})
            };
        
        // Naviguer vers un utilisateur
         const navUser = (id) => {
          navigate(`/userSelected`, { state: { userID: id }})
        };

 
         

    return (
 
        <div>
        <nav className="nav-container" onMouseLeave={resetAll}>
           
            <div className="nav-item" onMouseLeave={resetAll}>
                <strong className="p-navbar" onMouseEnter={()=> navRegles()}>Règles du jeu</strong> 
                { adminRegles && (        
                    <div className="hv-rule-nav" onMouseLeave={()=> setAdminRegles(!adminRegles)}>
                        <button className="btn-navbar" onClick={()=>{navigate(`admin/rules`); sessionStorage.clear();}}>Règles du jeu</button>
                        <button className="btn-navbar" onClick={()=>{navigate(`admin/addRule`); sessionStorage.clear();}}>Publier une règle</button>
                    </div>
                )}
            </div> 
            
            <div className="nav-item" onMouseLeave={resetAll}>
                <strong className="p-navbar" onMouseEnter={()=> navCards()}>Cartes</strong> 
                { adminCards && (        
                    <div className="hv-card-nav" onMouseLeave={()=> setAdminCards(!adminCards)}>
                        <button className="btn-navbar" onClick={()=>{navigate(`/cards`); sessionStorage.clear();} }>Recherche avancée</button>
                        <button className="btn-navbar" onClick={()=>{navigate(`admin/cards`); sessionStorage.clear();}}>Recherche avancée admin</button>
                        <button className="btn-navbar" onClick={()=>{navigate(`/cardsLiked`); sessionStorage.clear();}}>Cartes likées</button>
                        <button className="btn-navbar" onClick={()=>{navigate(`admin/addCard`); sessionStorage.clear();}}>Créer une carte</button>
                    </div>
                )}
            </div>
            
            <div className="nav-item" onMouseLeave={resetAll}>
                <strong className="p-navbar" onMouseEnter={()=> navDecks()}>Decks</strong>
                { adminDecks && (
                    <div className="hv-deck-nav" onMouseLeave={()=> setAdminDecks(!adminDecks)}>
                        <button className="btn-navbar" onClick={()=>{navigate('/decks', { state: { order: 'date' } }); sessionStorage.clear();}}>Recherche avancée</button>
                        <button className="btn-navbar" onClick={()=>{navigate(`/decksCreate`); sessionStorage.clear();}}>Decks créés</button>
                        <button className="btn-navbar" onClick={()=>{navigate(`/decksLiked`); sessionStorage.clear();}}>Decks likés</button>
                        <button className="btn-navbar" onClick={()=>{navigate(`addDeck`); sessionStorage.clear();}}>Créer un deck</button>
                    </div>
                )}
            </div> 

            <div className="nav-item"  onMouseLeave={resetAll}>
                <strong className="p-navbar" onMouseEnter={()=> navUsers()}>Utilisateurs</strong>
                { adminUsers && (
                    <div className="hv-user-nav" onMouseLeave={()=> setAdminUsers(!adminUsers)}>
                        <button className="btn-navbar" onClick={()=>{navigate(`/admin/users`); sessionStorage.clear();}}>Liste utilisateurs</button>
                        <button className="btn-navbar" onClick={()=>{navigate(`/admin/addAdmin`); sessionStorage.clear();}}>Ajouter un administrateur</button>
                    </div>
                )}
            </div>

            <div className="nav-item" onMouseLeave={resetAll}> 
                <strong className="p-navbar" onClick={()=>navigate(`/mySpace`)} onMouseEnter={()=> navLog()}>Espace personnel</strong>
                { adminLog && (
                    <div className="hv-log-nav" onMouseLeave={()=> {setAdminLog(!adminLog);}} onClick={()=>navLog()}>
                        <button className="btn-navbar" onClick={()=> deconnexion()}>Se déconnecter</button>
                        
                    </div>
                )}
            </div>

            <div className="nav-item" onMouseLeave={resetAll}>
                
                <IoNotificationsOutline size={'2em'} color="white" onMouseEnter={()=> navNotifs()} />
                {notifications.length > 0 && (
                <p className="alert-notif">{notifications.length}</p>
                )}
                 { adminNotifs && (
                        <div className="hv-notifs-nav" onMouseLeave={()=> setAdminNotifs(!adminNotifs)}>
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
                        <div className="nav-header">
                        <CgCloseO className='icon-close-navbar' color='white' size={'3em'}  onClick={()=>setDisplayNavBarMobile(!displayNavBarMobile)}/>
                        </div>

                        <button className="section-navbar-mobile" onClick={()=> {setAdminRegles(!adminRegles)}}><strong>Règles du jeu</strong><span className="icon-fleche">{arrowSensRegles}</span></button>
                        { adminRegles && ( 
                            <div className="btn-navbar-mobile-hover">
                                <button className="btn-navbar-mobile" onClick={()=>{navigate(`admin/rules`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Consulter les règles</button>
                                <button className="btn-navbar-mobile" onClick={()=>{navigate(`admin/addRule`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Publier une règle</button>
                            </div>
                        )}
                        <button className="section-navbar-mobile" onClick={()=> {setAdminCards(!adminCards);}}><strong>Cartes</strong><span className="icon-fleche">{arrowSensCards}</span></button>
                        { adminCards &&(
                        <div className="btn-navbar-mobile-hover">
                            <button className="btn-navbar-mobile" onClick={()=>{navigate(`/cards`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);} }>Recherche avancée</button>
                            <button className="btn-navbar-mobile" onClick={()=>{navigate(`admin/cards`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Recherche avancée admin</button>
                            <button className="btn-navbar-mobile" onClick={()=>{navigate(`/mySpace`, { state: { arrowUp2: true } }); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Cartes likées</button>
                            <button className="btn-navbar-mobile" onClick={()=>{navigate(`admin/addCard`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Créer une carte</button>
                        </div>
                        )}
                        <button className="section-navbar-mobile" onClick={()=> {setAdminDecks(!adminDecks);}}><strong>Decks</strong><span className="icon-fleche">{arrowSensDecks}</span></button>
                        { adminDecks && (
                        <div className="btn-navbar-mobile-hover">
                            <button className="btn-navbar-mobile" onClick={()=>{navigate('/decks', { state: { order: 'date' } }); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Recherche avancée</button>
                            <button className="btn-navbar-mobile" onClick={()=>{navigate(`/mySpace`, { state: { arrowUp: true } }); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Decks créés</button>
                            <button className="btn-navbar-mobile" onClick={()=>{navigate(`/mySpace`, { state: { arrowUp3: true } }); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Decks likées</button>
                            <button className="btn-navbar-mobile" onClick={()=>{navigate(`addDeck`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Créer un deck</button>
                        </div>
                        )}
                        <button className="section-navbar-mobile" onClick={()=> {setAdminUsers(!adminUsers)}}><strong>Utilisateurs</strong><span className="icon-fleche">{arrowSensUsers}</span></button>
                        { adminUsers && (
                        <div className="btn-navbar-mobile-hover">
                             <button className="btn-navbar-mobile" onClick={()=>{navigate(`/admin/users`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Liste utilisateurs</button>
                             <button className="btn-navbar-mobile" onClick={()=>{navigate(`/admin/addAdmin`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile)}}>Ajouter un administrateur</button>
                        </div>
                        )}
                        <button className="section-navbar-mobile" onClick={()=> {setAdminLog(!adminLog);}}><strong>Compte</strong><span className="icon-fleche">{arrowSensLog}</span></button>
                        { adminLog && (
                        <div className="btn-navbar-mobile-hover">
                            <button className="btn-navbar-mobile" onClick={()=> {navigate(`/mySpace`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Espace personnel</button>
                            <button className="btn-navbar-mobile" onClick={()=> {deconnexion(); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}>Se déconnecter</button>

                        </div> 
                        )}
                        
                        <button className="section-navbar-notif-mobile" onClick={()=> {setAdminNotifs(!adminNotifs);}}>
                            <strong style={{marginLeft: notifications.length < 1 ? '20%' : '0'}}>Notifications</strong>
                            {notifications.length > 0 && (
                            <p className="alert-notif-mobile">{notifications.length}</p>
                            )}
                            <span className="icon-fleche">{arrowSensNotifs}</span></button>
                        
                        { adminNotifs && ( 
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

export default NavbarAdmin
