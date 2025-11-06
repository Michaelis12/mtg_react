import "./css/buttonValidPopup.css"



const ButtonValidPopup = function (props) {

    return (
        <button className='valid-form' disabled={props.disabled} onClick={props.onClick} type={props.type}>
            <h4 className="valid-form-title">Valider</h4>
        </button>

    )    
} 


export default ButtonValidPopup 
