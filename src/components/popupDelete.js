import "./css/popupDelete.css"
import { CgCloseO  } from "react-icons/cg";
import { RiDeleteBin6Line } from "react-icons/ri";
import backgroundWhite from "../assets/background_white.png"
import ButtonValidPopup from "./buttonValidPopup";
 
const PopupDelete = function (props) {
    return ( 

        <div className='popup-bckg'>
             <div className='popup-delete' style={{ backgroundImage: `url(${backgroundWhite})`}}>
                                    <div className='header-popup-delete'>
                                        <RiDeleteBin6Line size="2em" className="delete-icon" />
                                        <h2>{props.title}</h2>
                                    </div>
                                    <div className="avert-header">
                                        <h4 className="avert-p1">{props.text}</h4> 
                                        <h4 className="avert-p2"> Êtes-vous sûr(e) de vouloir continuer ?</h4>
                                    </div>                                     
                                    <ButtonValidPopup onClick={props.onClick}/>
             </div> 
            <CgCloseO className='icon-close-popup' color='white' size={'5em'}  onClick={props.back}/> 
        </div>  
    ) 
}

export default PopupDelete;