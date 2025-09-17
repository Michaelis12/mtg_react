 import "./css/navIconsMobile.css"
import { MdOutlinePlayArrow } from "react-icons/md";


 const NavIconsMobile = function (props) {
    return (
        <div className='button-nav-mobile' style={props.style}>  
                            <MdOutlinePlayArrow style={{ transform: 'scaleX(-1)' }}  className='icon-nav' onClick={props.prev} />
                            <MdOutlinePlayArrow style={props.styleNext} className='icon-nav' onClick={props.next} />
        </div>
                )
}

export default NavIconsMobile 