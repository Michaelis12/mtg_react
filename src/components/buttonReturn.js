import "./css/buttonReturn.css"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";



const ButtonReturn = function (props) {

    return (
        <div className="button-valid-container">
            <button className="button-return" style={props.style} onClick={props.onClick} disabled={props.disabled}><MdOutlineKeyboardArrowLeft className="icon-button-fixed" color="#5D3B8C"/></button>
        </div> 

    )   
} 


export default ButtonReturn 
