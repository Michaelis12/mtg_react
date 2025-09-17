import "./css/openButton.css"

const OpenButton = function (props) {
    const { onClick, text, icon, width, height, marginTop, marginBottom } = props;

    return (
        <button className="open-button" style={{ width: width, height: height, marginTop: marginTop, marginBottom: marginBottom }} onClick={onClick}>
            <h5 className="button-text">{text}</h5>
            <span className="button-icon">{icon}</span> 
        </button>
                )   
}

export default OpenButton 