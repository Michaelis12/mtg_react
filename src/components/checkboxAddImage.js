import "./css/checkboxAdd.css";




const CheckboxAddImage = function (props) { 

    return ( 
        <div >
            <div className="compenant-checkbox-add" style={props.style}>
            {props.attributs.map((attribut, index) => (
                <li key={index} style={props.styleL}> 
                    <input className='component-input' type="checkbox" name={"nom"+ attribut} value={attribut} onChange={props.onChange} 
                    style={props.styleI}
                    checked={props.filter.includes(attribut)} />
                <img src={props.image(attribut)} className={props.classNameImg} alt={props.alt}/>
                </li>           
            ))}
            </div> 
       </div>

    ) 
}

export default CheckboxAddImage
