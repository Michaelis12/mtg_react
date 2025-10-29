import "./navbarAll.css";
import { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { FiMenu } from "react-icons/fi";
import { CgCloseO  } from "react-icons/cg";
import React from 'react';

const NavbarUser = function () {

    const navigate = useNavigate();    

    const [displayNavBarMobile, setDisplayNavBarMobile] = useState(false);

    return (
        <div>
            <nav className="nav-container">               
                <strong onClick={()=> {navigate(`/rules`); sessionStorage.clear();}} className="p-navbar">Règles du jeu</strong>
                <strong onClick={()=> {navigate(`/cards`); sessionStorage.clear();}} className="p-navbar">Cartes</strong>
                <strong onClick={()=> {navigate('/decks', { state: { order: 'date' } }); sessionStorage.clear();}} className="p-navbar">Decks</strong>
                <strong onClick={()=> {navigate(`/sign`); sessionStorage.clear();}}  className="p-navbar">Se connecter</strong>
            </nav>  

            <div className="menu"><FiMenu onClick={()=>setDisplayNavBarMobile(!displayNavBarMobile)} className="icon-menu" color="white" size={'3em'}/></div>

            { displayNavBarMobile && (
            <nav className="nav-mobile">
                <CgCloseO className='icon-close-navbar' color='white' size={'3em'}  onClick={()=>setDisplayNavBarMobile(!displayNavBarMobile)}/>
                <button className="section-navbar-mobile" onClick={()=> {navigate(`/rules`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}><strong>Règles du jeu</strong></button>
                <button className="section-navbar-mobile" onClick={()=> {navigate(`/cards`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}><strong>Cartes</strong></button>
                <button className="section-navbar-mobile" onClick={()=> {navigate('/decks', { state: { order: 'date' } }); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}}><strong>Decks</strong></button>
                <button className="section-navbar-mobile" onClick={()=> {navigate(`/sign`); sessionStorage.clear(); setDisplayNavBarMobile(!displayNavBarMobile);}} ><strong>Se connecter</strong></button>
            </nav> 
        )} 
        </div> 
    )
}

export default NavbarUser
