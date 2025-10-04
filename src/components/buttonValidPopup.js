import "./css/buttonValidPopup.css"



const ButtonValidPopup = function (props) {

    return (
        <button className='valid-popup' disabled={props.disabled} onClick={props.onClick}>
            <h4 className="valid-popup-title">Valider</h4>
        </button>

    )    
} 


export default ButtonValidPopup 
