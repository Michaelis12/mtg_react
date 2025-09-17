import "./css/inputName.css"


 const InputName = function (props) {
    return (
            <input className="input-name" type="name" id="name" name="name" placeholder={props.placeholder} onChange={props.onChange}required/>

            )  
}

export default InputName