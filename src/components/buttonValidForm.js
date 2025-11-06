import "./css/buttonValidForm.css"



const ButtonValidForm= function (props) {

    return (
        <button className='valid-form' disabled={props.disabled} onClick={props.onClick} type={props.type} style={props.style}>
            <h4 className="valid-form-title">{props.text}</h4>
        </button>

    )    
} 


export default ButtonValidForm 
