import React from 'react';
import { useEffect, useRef, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authContext"
import "./css/UsersList.css" 
import axiosInstance from "../api/axiosInstance";
import User from '../model/User';
import Section from '../components/sectionMap';
import Checkbox from '../components/checkboxActivity';
import SearchBar from '../components/searchBar';
import OpenButton from '../components/openButton';
import Title from '../components/title';
import FooterSection from '../components/footerSection';
import { FaRegEye } from "react-icons/fa";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import backgroundUserList from "../assets/background_cardsPage.jpg"
import backgroundWhite from "../assets/background_white.png"
import OpenButtonLarge from '../components/openButtonLarge';
import loading from "../assets/loading.gif"
import { getAvatarUrl } from '../utils/imageUtils'; 




const UsersList = () => {

    const [users, setUsers] = React.useState([])
    const [activities, setActivities] = React.useState([])
    const navigate = useNavigate();
    const [displayLoading, setDisplayLoading] = useState(false);

    // Filtre Users
    const [filterName, setFilterName] = React.useState("")
    const [filterEmail, setFilterEmail] = React.useState("")
    const [filterActivities, setFilterActivities] = React.useState([])
    

    // États pour la pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Map tous les users avec paramètres
    const getUsers = async () => {      
        try {
            setDisplayLoading(true);


            const params = {
                                page: 0,
                                size: pageSize,
                                pseudo: filterName,
                                email: filterEmail,
                                activities: filterActivities                                
                            };
                            
                            const response = await axiosInstance.get('f_admin/getUsersPaged', {
                            params,
                            paramsSerializer: { indexes: null },
                            withCredentials: true
                            });
            
            const listUsers = response.data.content.map(
                    user => new User (user.id, user.pseudo, user.email, user.password, user.dateSign, 
                        user.avatar, user.bio, user.activity, user.roles, user.decks 
            ) )                

            setUsers(listUsers)
            setPage(1) 
            setHasMore(!response.data.isLast)
            setDisplayLoading(false);
        }   
        catch (error) {
            setDisplayLoading(false);
            console.log(error);
        }
    }
    React.useEffect(() => {
        getUsers();
          }, [filterName, filterEmail, filterActivities]);


    // Affiche plus d'users

    const displayMoreUsers = async () => {
        try {
            setIsLoading(true);
            
            const params = {
                                page: page,
                                size: pageSize,
                                pseudo: filterName,
                                email: filterEmail,
                                activities: filterActivities                                
                            };
                            
                            const response = await axiosInstance.get('f_admin/getUsersPaged', {
                            params,
                            paramsSerializer: { indexes: null },
                            withCredentials: true
                            });
            
            const newUsers = response.data.content.map(
                    user => new User (user.id, user.pseudo, user.email, user.password, user.dateSign, 
                        user.avatar, user.bio, user.activity, user.roles, user.decks 
            ) )  

            setUsers(prevUsers => [...prevUsers, ...newUsers]);
            setHasMore(!response.data.isLast);
            setPage(page + 1);
        } catch (error) {
            console.error('Erreur de chargement des cartes populaires :', error);
        } finally {
            setIsLoading(false);
        }
    }

    const callActivities = useRef(false);
                    
    // Récupère les formats dans le storage si l'user vient de cardSelected
    const recupStorageActivity = (response) => {
                          try {
                    
                              if (callActivities.current) return;
                            
                              const stored = sessionStorage.getItem('dpFilterFormats');
                    
                                if (stored) {
                                    
                                    setFilterActivities(JSON.parse(stored));
                                    sessionStorage.removeItem('dpFilterFormats');
                                    callActivities.current = true;
                                } else {
                                    setFilterActivities(response);
                                    
                                }
                        } catch (error) {
                            console.error("Erreur lors de la récupération du sessionStorage :", error);
                        }
     };


    // Map toutes les activités
        useEffect(() => {
            const getActivities = async () => {
                try {
                    setDisplayLoading(true);
                    const request = await axiosInstance.get('/f_all/getActivities');
    
                    const response = request.data
        
                    setActivities(response)
                    recupStorageActivity(response)
                    setDisplayLoading(false);
                }   
                catch (error) {
                    setDisplayLoading(false);
                    console.log(error);
                }
            }
            getActivities();
            }, []);

    // Permet de sélectionner une activité
    const selectActivities = (newActivity) => {
        setFilterActivities(prevActivities => {
          const activitiesArray = Array.isArray(prevActivities) ? prevActivities : 
          (prevActivities || '').split(',').filter(activity => activity.trim() !== '');
          if (activitiesArray.includes(newActivity)) {
            return activitiesArray.filter(activity => activity !== newActivity).join(',');
          } else {
            return [...activitiesArray, newActivity].join(',');                 
          }
        });
      };

      
      // Permet de retirer la sélection des activités
      const removeActivities = () => { 
        setFilterActivities(activities)
      } 

     // Affichage de couleur d'arrière-plan en fonction de l'activité
     const getBackgroundColor = (activity ) => {
       if(activity === "PUBLISHER") {
            return 'rgba(255, 165, 0)'
        }
        if(activity === "CREATOR") {
            return 'rgba(60, 179, 113)'
        }
        
        if(activity === "VIEWVER") {
            return 'rgba(93, 59, 140)'
        }
        if(activity === "INACTIVE") {
            return 'rgba(180,180,180)'
        }

        if(activity === "BANNED") {
            return 'rgba(255,0,0)'
        }       
       
    }

    
    const [arrowActivitySens, setArrowActivitySens] = React.useState(<SlArrowDown/>)
    const [displayFilterActivity, setDisplayFilterActivity] = React.useState(false)
            
    // Affiche le filtre activity
    const OpenFilterActivity = () => {
                  setArrowActivitySens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));    
                  setDisplayFilterActivity(!displayFilterActivity)
        }

    // Naviguer vers une carte depuis id
        const navUser = (id) => {
            sessionStorage.setItem('ulFilterName', JSON.stringify(filterName));
            sessionStorage.setItem('ulFilterEmail', JSON.stringify(filterEmail));

          const usersIds = users.map(card => card.id);
          navigate(`/admin/userSelected`, { state: { userID: id, ListUser: usersIds }})
        };


        useEffect(() => {
         const recupStorage = () => {
                              try {
                                  const filterName = sessionStorage.getItem('ulFilterName');
                                  const filterEmail = sessionStorage.getItem('ulFilterEmail');
                                  
                                   
                                  if (filterName) {
                                      setFilterName(JSON.parse(filterName));
                                      sessionStorage.removeItem('ulFilterName');
                                  }
                                  if (filterEmail) {
                                      setFilterEmail(JSON.parse(filterEmail));
                                      sessionStorage.removeItem('ulFilterEmail');
                                  }
                                  
                              } catch (error) {
                                  console.error("Erreur lors de la récupération du sessionStorage :", error);
                              }
                          };
                    
            recupStorage();
        }, []);


        // Filtres mobile
        
        
        const [arrowFiltersSens, setArrowFiltersSens] = React.useState(<SlArrowDown/>)
        const [displayFilters, setDisplayFilters] = React.useState(false)
                
        const OpenFilters = () => {
            setArrowFiltersSens((prevIcon) => (prevIcon.type === SlArrowDown ? <SlArrowUp/> : <SlArrowDown/>));
            setDisplayFilters(!displayFilters)
        }

    return (
        <Section>  
            { displayLoading && (
                <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
            )}
            <img src={backgroundUserList} className="background-image" alt="background" />



             {/* Searchbar desktop*/}
            <div className="search-line">
                <SearchBar value={filterName} onChange={(event) => (setFilterName(event.target.value))} placeholder={" Chercher un pseudonyme"}/>
                <SearchBar value={filterEmail} onChange={(event) => (setFilterEmail(event.target.value))} placeholder={" Chercher un email"}
                style={{marginBottom: '30px'}}/>
            </div>

            {/* Bouton ouverture des filtres*/}
            <OpenButtonLarge text="Afficher les filtres" icon={arrowFiltersSens} onClick={OpenFilters}/>

            <div className="filters-container">

                {/* Filtres desktop */}
                <div className='filters-line'>
                    <div className="filter-activity-container">
                        <OpenButton text="Filtrer par activité" icon={arrowActivitySens} onClick={OpenFilterActivity} />
                        { displayFilterActivity && (
                            <div className='user-activity-filter-container' >
                                <Checkbox attributs={activities} onChange={(event) => selectActivities(event.target.value)} 
                                filter={filterActivities} onPush={removeActivities}/>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filtres mobile */}
                {displayFilters && (
                        <div className="filters-line-mobile">
                            <div className='filter-mobile-container' style={{ backgroundImage: `url(${backgroundWhite})`}} >
                            <SearchBar value={filterName} onChange={(event) => (setFilterName(event.target.value))} placeholder={" Chercher un pseudonyme"}/>
                            <SearchBar value={filterEmail} onChange={(event) => (setFilterEmail(event.target.value))} placeholder={" Chercher un email"}
                            />
                            <div className="filter-value-container">
                            <OpenButton text="Filtrer par activité" icon={arrowActivitySens} onClick={OpenFilterActivity} />
                            { displayFilterActivity && (
                            <div className='add-card-filter-container' >
                                <Checkbox attributs={activities} onChange={(event) => selectActivities(event.target.value)} 
                                filter={filterActivities} onPush={removeActivities}/>
                            </div>
                            )}
                            </div>
                            </div>
                        </div>
                )}

            </div>


            <Title title={"Liste des utilisateurs"}/>
            
            <div className='display-objects-section'>  


                            
                <table className="table">
                    <thead>
                        <tr className='users-list-header'>
                            <th scope="col">Avatar</th>
                            <th scope="col">Pseudo</th>
                            <th scope="col">Adresse</th>
                            <th scope="col">Date d'inscription</th>
                            <th scope="col">Activité</th>
                        </tr>
                    </thead>
                    <tbody style={{ backgroundImage: `url(${backgroundWhite})`}}>
                        {users.map(user => ( 
                            <tr key={user.id}>
                                <td className="1stTD"><img src={getAvatarUrl(user.avatar)} className='admin-table-image' alt='user-avatar'/></td>
                                <td>{user.pseudo}</td>
                                <td>{user.email}</td>
                                <td>{user.dateSign}</td>
                                <td><p style={{backgroundColor : getBackgroundColor(user.activity), marginTop: '20px'}}
                                    className='admin-table-activity'>{user.activity}</p></td>
                                <td><FaRegEye size={'2.5em'} className='eyeIcone' onClick={()=>navUser(user.id)}  /></td>
                            </tr> 
                        ))}
                    </tbody>
                </table> 


                <div className="user-cards-container">
                    {users.map(user => (
                        <div key={user.id} className="user-card-large">
                        <img src={getAvatarUrl(user.avatar)} alt="avatar" className="user-avatar-large" />

                        <div className="user-info-large" >
                            <h4>Pseudo : <span>{user.pseudo}</span></h4>
                        <h5>Email : <span>{user.email}</span></h5>
                        <h5>Inscription : <span>{user.dateSign}</span></h5>
                        <h5>
                            Activité :
                            <span
                                className="card-format"
                                style={{ backgroundColor: getBackgroundColor(user.activity) }}
                            >
                                {user.activity}
                            </span>
                        </h5>
                    </div>

                    <FaRegEye className="eye-icon-large" onClick={() => {navUser(user.id); setDisplayLoading(false);}} />
                        </div>

                        

                    ))}
                </div>

                <div className="user-cards-container">
                    {users.map(user => (
                        <div key={user.id} className="user-card-mobile">
                        <img src={getAvatarUrl(user.avatar)} alt="avatar" className="admin-table-image" />
                        <div className="user-card-info">
                            <p><strong>Pseudo :</strong> {user.pseudo}</p>
                            <p><strong>Email :</strong> {user.email}</p>
                            <p><strong>Inscription :</strong> {user.dateSign}</p>
                            <p>
                            <strong>Activité :</strong>
                            <span className="admin-table-activity-mobile" style={{ backgroundColor: getBackgroundColor(user.activity) }}>
                                {user.activity}
                            </span>
                            </p>
                        </div>
                        <FaRegEye size="1.8em" className="eyeIcone" onClick={() => navUser(user.id)} />
                        </div>
                    ))}
                </div>

                { hasMore && (
                        <button 
                            className='next-page-button' 
                            disabled={!hasMore} 
                            onClick={()=>displayMoreUsers()}
                        >
                            Afficher plus d'utilisateurs
                        </button> 
                )}
                
            </div>


            <FooterSection/>
        </Section>
    )

}

export default UsersList;
