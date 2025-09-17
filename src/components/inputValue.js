import "./css/inputNumber.css"





const InputValue = function (props) {

    return (
    <div className="input-number-container">
        <input type="number" className="input-value"  value={props.value}
        style={props.style} placeholder={props.placeholder} onChange={props.onChange} step="1.00" min="0" max="10" />
    </div>

    )
}


export default InputValue