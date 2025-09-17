import "./css/pipeline.css"

const Pipeline = function (props) {
    return (
        <h4 className='pipeline-forme' style={props.style}>{props.text}</h4>
    )  

}

export default Pipeline