import innistrad from '../assets/innistrad.png';
import ixalan from '../assets/ixalan.png';
import friches_eldraine from '../assets/friches_eldraine.png';
import meutre_manoir from '../assets/meurtre_manoir.png';
import ravinca from '../assets/ravinca.png';
import modernHorizon from '../assets/modern_horizon.png';
import bloomburrow from '../assets/bloomburrow.png';
import { TbFilterCancel } from "react-icons/tb";
import "./css/checkboxEdition.css";




const Checkbox = function (props) {


    // Affichage de l'image correspondant à l'édition
    const getEditions = (edition) => {
    switch (edition) {
        case "MYSTICAL":
            return innistrad;  
        case "LES_FRICHES_D_ELDRAINE":
            return friches_eldraine;  
        case "LES_CAVERNES_OUBLIÉES_D_IXALAN":
            return ixalan;  
        case "RAVNICA_REMASTERED":
            return ravinca;
        case "MURDERS_AT_KARLOV_MANOR":
            return meutre_manoir;  
        case "MODERN_HORIZONS_3":
            return modernHorizon; 
        case "BLOOMBURROW":
            return bloomburrow;    

    }
};
    

    return ( 
        <div className="compenant-checkbox">
            <div className="compenant-checkbox-map-large">
            {props.attributs.map((attribut, index) => ( 
                <li className='li-edition' key={index}>
                    <input className='component-input-edition' type="checkbox" name={"nom"+ attribut} value={attribut} onChange={props.onChange} 
                    checked={props.filter.includes(attribut)}/>
                <img src={getEditions(attribut)} className="filter-edition-img" alt={attribut}/>
                </li>           
            ))}
            </div>
            <TbFilterCancel className='compenant-reset' style={props.iconStyle} onClick={props.onPush}/>
       </div>

    ) 
}

export default Checkbox
