import "./css/title.css"

const title = function (props) { 

    return (
        <h1 className="title" style={props.style}>{props.title}</h1>
                ) 
}

export default title  
