import "./css/buttonPass.css"
import React from 'react';




const ButtonPass = function (props) {


    return (
    
        <div className="button-container">
            <button className="button-pass" onClick={props.onClick} disabled={props.disabled}>{props.text}</button>
        </div>

    )
}


export default ButtonPass