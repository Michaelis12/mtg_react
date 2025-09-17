// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from '../api/axiosInstance';
import Notification from "../model/Notification"
import NavbarAll from '../navigation/navbarAll';
import NavbarUser from '../navigation/navbarUser';
import NavbarAdmin from '../navigation/navbarAdmin';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRoles, setUserRoles] = useState([]);
    const [navBar, setNavBar] = useState(<NavbarAll />);


    // 🔐 Récupère un cookie par nom
    const getCookie = (name) => {

        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return decodeURIComponent(match[2]);
        return null;
    }; 

    const getNotifs = async () => {
            try {
                           
                            const request = await axiosInstance.get(`/f_user/getUserNotifs`, 
                            { withCredentials: true });
                            
                            const response = request.data.map(
                                notification => new Notification 
                                (notification.id, notification.deckID, notification.issuerID, notification.receivorID,
                                notification.date, notification.deckName, notification.issuerPseudo, notification.receivorPseudo
                        ) ) 

                        return response                         
            
            }   
            catch (error) {
                            console.log(error);
            }              
    }


    const fetchRoles = async () => {
        const cookies = document.cookie.split('; ');
        const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));
        /*
        if(!jwtCookie) {
            console.log("pas de cookie")
            return null
        }
        */

        try {
            const response = await axiosInstance.get('/f_user/getDeckBuilder', {
                withCredentials: true,
                
            });

            const roles = response.data.roles;
            setUserRoles(roles);
            setIsAuthenticated(true);

            if (roles.includes("ADMIN")) {
                setNavBar(<NavbarAdmin />);
            } else {
                setNavBar(<NavbarUser />);
            }
        } catch (err) {
            setIsAuthenticated(false);
            setUserRoles([]);
            console.error("Erreur lors de la récupération des rôles :", err);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const authLogIn = (roles) => {
        setIsAuthenticated(true);
        setUserRoles(roles);

        if (roles.includes("ADMIN")) {
            setNavBar(<NavbarAdmin />);
        } else {
            setNavBar(<NavbarUser />);
        }
    };

    const authLogOut = async () => {
        try {
            await axiosInstance.post(
                "/f_all/logout",
                {},
                { withCredentials: true }            
            );

        } catch (err) {
            console.warn("Erreur pendant la déconnexion :", err);
        }

        setIsAuthenticated(false);
        setUserRoles([]);
        setNavBar(<NavbarAll />);
    };

    return (
        <AuthContext.Provider value={{ getCookie, getNotifs, isAuthenticated, userRoles, navBar, authLogIn, authLogOut }}>
            {children}
        </AuthContext.Provider>
    );
};
