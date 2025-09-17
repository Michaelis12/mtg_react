import "./css/paragraphBlank.css"

const ParagraphBlank = function (props) { 

    return (
        <h2 className="paragraph-blank" style={props.style}>{props.text}</h2>
                ) 
}

export default ParagraphBlank 