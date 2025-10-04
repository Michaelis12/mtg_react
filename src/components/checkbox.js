import React from 'react';
import { TbFilterCancel } from "react-icons/tb";
import "./css/checkbox.css";




const Checkbox = function (props) {
    

    return ( 
        <div className="compenant-checkbox">
            <div className="compenant-checkbox-map">
            {props.attributs.map((attribut, index) => (
                <li className="li-checkbox" key={index}>
                    <input className='component-input' type="checkbox" name={"nom"+ attribut} value={attribut} onChange={props.onChange} 
                    checked={props.filter.includes(attribut)}/>
                <p style={{margin : '0px'}} className={props.classNameP}>{attribut}</p></li>           
            ))}
            </div>
            <TbFilterCancel className='compenant-reset' style={props.iconStyle} onClick={props.onPush}/>
       </div>

    )  
}

export default Checkbox
