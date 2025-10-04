import "./css/buttonIconHover.css"

const IconButtonHover = function (props) {
    return (
        <button className="button-direction" onClick={props.onClick} style={props.style} disabled={props.disabled}>
            {props.icon}
        </button>
    ) 
} 

export default IconButtonHover
