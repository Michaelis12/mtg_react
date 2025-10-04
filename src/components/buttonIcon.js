import "./css/buttonIcon.css"

const buttonIcon = function (props) {
    return (
        <button className="buttonIcon" style={props.style} onClick={props.onClick}
         onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>{props.icon} 
        </button>
                )   
}

export default buttonIcon
