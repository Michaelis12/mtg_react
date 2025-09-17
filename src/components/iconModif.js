import { FaPencilAlt } from "react-icons/fa";
import "./css/iconModif.css"

const IconModif = function (props) {
    return ( 
            <FaPencilAlt className="pencil-icon" style={props.style} onClick={props.onClick} size={'1.5em'} />
    )
}   

export default IconModif