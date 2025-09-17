import React from 'react';
import { useNavigate } from 'react-router-dom';
import Section from '../components/section';
import User from '../model/User';
import axios from "axios";
import "./css/CardsPage.css";
import { getAvatarUrl } from '../utils/imageUtils';
import axiosInstance from '../api/axiosInstance';

const UsersPage = () => {
    const [users, setUsers] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(false);

    // const navigate = useNavigate();

        // L'appel asynchrone doit obligatoirement etre fait à l'intérieur de useEffect
        const getUsers = async () => {
            try {
                setIsLoading(true)
                const response = await axiosInstance.get('/f_all/testUsers');              
                const listUsers = response.data.map(
                        user => new User (user.id, user.pseudo, user.email, user.password, user.dateSign, user.avatar, user.activity,
                            user.roles, user.decks
                ) )                
                              
                setUsers(listUsers)
                setIsLoading(false)


            }   
            catch (error) {
                console.log(error);
            }

    
        }
        React.useEffect(() => {
            getUsers();
        }, []);
        
    if(isLoading) {
        return (
            <Section className="section">
                 <strong className="card-name"> Chargement en cours </strong>       
          
            </Section> )
    }             
        return (
            <Section className="section">
                     <div className='card-section'>
                        {users.map(user => ( 
                            <div className="card-details" key={user.id}>
                                <strong className="card-name"> {user.pseudo} </strong>
                                <strong className="card-name"> {user.roles} </strong>
                            </div>
                        
                        ))}
                        </div>                   
            </Section>
        )

}

export default UsersPage;