import "./css/buttonValid.css"
import { FaCheck } from "react-icons/fa";



const ButtonValid = function (props) {

    return (
        <div className="button-valid-container">
            <button className="button-valid-mobile" style={props.style} onClick={props.onClick} disabled={props.disabled}><FaCheck className="icon-button-fixed" color="white"/></button>
        </div> 

    )   
} 


export default ButtonValid 
