import "./css/pipeline.css"

const Pipeline = function (props) {
    return (
        <h3 className='pipeline-forme' style={props.style}>{props.text}</h3>
    )  

}

export default Pipeline