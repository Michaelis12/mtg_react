 import "./css/titleType.css"


 const TitleType = function (props) { 

    return (
        <h1 className="titleType" style={props.style} onClick={props.onClick}>{props.title}</h1>
                )  
}

export default TitleType  
