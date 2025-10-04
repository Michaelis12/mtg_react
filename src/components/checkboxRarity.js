import React from 'react';
import { TbFilterCancel } from "react-icons/tb";
import "./css/checkboxRarity.css";

 


const Checkbox = function (props) {


    // Affichage de couleur d'arrière-plan en fonction de la rareté
    const getBackgroundColor = (rarity) => {
    switch (rarity) {
        case "MYTHIQUE":
            return "linear-gradient(135deg, #D94F4F 0%, #FF8A5C 100%)";  
        case "RARE":
            return "linear-gradient(135deg, #D4AF37 0%, #F7C83D 100%)";  
        case "UNCO":
            return "linear-gradient(135deg, #5A6E7F 0%, #A1B2C1 100%)";  
        case "COMMUNE":
            return "linear-gradient(135deg, #5C5C5C 0%, #9B9B9B 100%)";  

            return "transparent"; 
    }
};
    

    return ( 
        <div className="compenant-checkbox">
            <div className="compenant-checkbox-map-large">
            {props.attributs.map((attribut, index) => (
                <li className="li-checkbox" key={index}>
                    <input className='component-input' type="checkbox" name={"nom"+ attribut} value={attribut} onChange={props.onChange} 
                    checked={props.filter.includes(attribut)}/>
                    <p className={props.className} style={{ background: getBackgroundColor(attribut), margin : '0px'}}>{attribut}</p>
                </li>           
            ))}
            </div>
            <TbFilterCancel className='compenant-reset' style={props.iconStyle} onClick={props.onPush}/>
       </div>

    ) 
}

export default Checkbox
