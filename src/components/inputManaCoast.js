import "./css/inputNumber.css"
import React from 'react';





const InputManaCost = function (props) { 

    return (
    <div className="input-number-container">
        <input type="number" value={props.value} 
         className="input-manaCost" style={props.style} placeholder={props.placeholder} onChange={props.onChange} step="1" min="0" />
    </div> 

    ) 
}


export default InputManaCost