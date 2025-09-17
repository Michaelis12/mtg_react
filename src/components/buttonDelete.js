 import "./css/buttonDelete.css"
 import { RiDeleteBin6Line } from "react-icons/ri";


const ButtonDelete = function (props) {
    return (
        <button className='delete-account' style={props.style} onClick={props.onClick}>{props.text}</button>
                )   
}

export default ButtonDelete