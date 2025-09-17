import "./css/titleMobile.css"

const Title = function (props) { 


    // Les éléments titles qui n'apparaissent que sur la partie mobile
    return (
        <h1 className="title-for-mobile" style={props.style}>{props.title}</h1>
                ) 
}

export default Title  