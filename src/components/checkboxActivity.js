import React from 'react';
import { TbFilterCancel } from "react-icons/tb";
import "./css/checkboxActivity.css";




const CheckboxActivity = function (props) {

      // Affichage de couleur d'arrière-plan en fonction de l'activité
     const getBackgroundColor = (activity ) => {
        if(activity === "PUBLISHER") {
            return 'rgba(255, 165, 0)'
        }
        if(activity === "CREATOR") {
            return 'rgba(60, 179, 113)'
        }
        
        if(activity === "VIEWVER") {
            return 'rgba(93, 59, 140)'
        }
        if(activity === "INACTIVE") {
            return 'rgba(180,180,180)'
        }

        if(activity === "BANNED") {
            return 'rgba(255,0,0)'
        }
       
    }
    
 
    return ( 
        <div className="compenant-checkbox">
            <div className="compenant-checkbox-map">
            {props.attributs.map((attribut, index) => (
                <li style={{width: '160px'}} key={index}>
                    <input className='component-input' type="checkbox" name={"nom"+ attribut} value={attribut} onChange={props.onChange} 
                    checked={props.filter.includes(attribut)}/>
                <p style={{marginTop: '12px', backgroundColor: `${getBackgroundColor(attribut)}`, color: 'white'}} 
                    className='p-user-activity'>{attribut}</p></li>           
            ))}
            </div>
            <TbFilterCancel className='compenant-reset' style={props.iconStyle} onClick={props.onPush} />
       </div>

    ) 
}

export default CheckboxActivity