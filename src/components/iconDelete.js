import { RiDeleteBin6Line } from "react-icons/ri";
import "./css/iconModif.css"

const IconModif = function (props) {
    return (
            <RiDeleteBin6Line className="pencil-icon" style={props.style} onClick={props.onClick} size={'1.5em'} />
    )
}  

export default IconModif
