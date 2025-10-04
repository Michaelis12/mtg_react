import "./css/buttonSelect.css"

const ButtonSelect = function (props) {
    const { className, onClick, backgroundColor, color, text } = props;

    return (
        <button className={className} onClick={onClick} style={{ backgroundColor: backgroundColor, color: color }}>
            {text}
        </button>
    )
}

export default ButtonSelect
