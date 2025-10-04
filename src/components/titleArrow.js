 import "./css/titleArrow.css"


 const TitleType = function (props) { 

    return (
        <h1 className="titleArrow" style={props.style}
                    onClick={props.onClick}>
                    <span className="button-text">{props.title}</span>
                    <span className="button-icon" style={{marginTop: '-2%'}}>{props.icon}</span>
        </h1>
                ) 
}

export default TitleType  
