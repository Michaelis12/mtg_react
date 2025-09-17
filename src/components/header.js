import "./css/header.css"
import LogoMTG from "../assets/LogoMTG.png"

const Header = function (props) {
    

   
    return (    

        <header className="header">
            <a href="/" className="link-home"><img src={LogoMTG} className="logo-site" alt="logo-mtg"/></a>
            <div className="nav-bar">{props.child}</div>
            
        </header>       
    )
}

// Des variables TS inscritent dans Node exigent d'intégrer les fichiers png de cette manière 

export default Header