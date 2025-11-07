import "./css/header.css"
import Logo from "../assets/logo_site.png"

const Header = function (props) {
    

   
    return (    

        <header className="header">
            <a href="/" className="link-home"><img src={Logo} className="logo-site" alt="logo-mtg"/></a>
            <div className="nav-bar">{props.child}</div>
            
        </header>       
    )
}

export default Header
