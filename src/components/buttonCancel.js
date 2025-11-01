import "./css/buttonReturn.css"
import { RiResetLeftFill } from "react-icons/ri";



const ButtonCancel = function (props) {

    return (
        <div className="button-valid-container">
            <button className="button-cancel" style={props.style} onClick={props.onClick} disabled={props.disabled}><RiResetLeftFill style={{padding: "15%"}} className="icon-button-fixed" color="red"/></button>
        </div> 

    )   
} 


export default ButtonCancel 