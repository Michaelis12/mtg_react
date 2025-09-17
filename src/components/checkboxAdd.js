import "./css/checkboxAdd.css";




const CheckboxAdd = function (props) { 

    return ( 
        <div >
            <div className="compenant-checkbox-add" style={props.style}>
            {props.attributs.map((attribut, index) => (
                <li key={index} style={props.styleL}> 
                    <input className='component-input' type="checkbox" name={"nom"+ attribut} value={attribut} onChange={props.onChange} 
                    style={props.styleI}
                    checked={props.filter.includes(attribut)} />
                <p 
                style={{ margin: '0', background: props.methodBackground?.(attribut) }}
                 className={props.classNameP}>{attribut}</p></li>           
            ))}
            </div> 
       </div>

    ) 
}

export default CheckboxAdd