import React, { useContext, useEffect } from 'react'; // Ajout de useEffect
import { AuthContext } from "../context/authContext"
import { Outlet, useLocation } from 'react-router-dom'; // Ajout de useLocation
import Header from '../components/header'
import Footer from '../components/footer'


const LayoutUser = function ()
{   
    const { navBar } = useContext(AuthContext);
    const location = useLocation(); // 1. Obtenir l'objet location

    // 2. Utiliser useEffect pour remonter en haut à chaque changement de chemin
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]); // Déclencher l'effet uniquement quand le chemin de l'URL change


    return (
        <>
        <Header child={navBar} />
        <main>
        <Outlet/>
        </main>
        <Footer/>
        </>
    )
}
    // On ajoute un élément Outlet qui nous servira plus tard pour le rooter

export default LayoutUser
