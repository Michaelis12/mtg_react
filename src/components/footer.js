import "./css/footer.css"
import { useNavigate} from 'react-router-dom';


const Footer = function () {
    const navigate = useNavigate();

    return (
        <footer className="footer">
             <div className="nav-bar"> 
                <nav className="nav-footer-container">               
                    <strong onClick={()=> {navigate(`/mentions`); sessionStorage.clear();}} className="p-navbar">Mentions légales</strong>
                    <strong onClick={()=> {navigate(`/rgpd`); sessionStorage.clear();}} className="p-navbar">RGPD</strong>
                    <strong onClick={()=> {navigate(`/contact`); sessionStorage.clear();}} className="p-navbar">Contact</strong>
                </nav>
             </div>
        </footer>
    ) 
}

export default Footer
