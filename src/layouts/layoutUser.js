import React from 'react';
import { AuthContext } from "../context/authContext"
import {useContext } from 'react';
import { Outlet} from 'react-router-dom';
import Header from '../components/header'
import Footer from '../components/footer'


const LayoutUser = function ()
{   
    const { navBar } = useContext(AuthContext);

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