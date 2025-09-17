import "./css/addButton.css"

const AddButton = function (props) {
    return (
        <button className="addButton" style={props.style} onClick={props.onClick} disabled={props.disabled}>{props.icon}
        </button> 
                )
}

export default AddButton 