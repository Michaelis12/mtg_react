import { TbFilterCancel } from "react-icons/tb";
import "./css/checkbox.css";




const Checkbox = function (props) {
    

    return ( 
        <div className="compenant-checkbox">
            <div className="compenant-checkbox-map">
            {props.attributs.map((attribut, index) => (
                <li style={{width: '160px'}} key={index}>
                    <input className='component-input' type="checkbox" name={"nom"+ attribut} value={attribut} onChange={props.onChange} 
                    checked={props.filter.includes(attribut)}/>
                <img src={props.image(attribut)} className="filter-color-img" alt={attribut}/>
                </li>           
            ))}
            </div>
            <TbFilterCancel className='compenant-reset' style={props.iconStyle} onClick={props.onPush}/>
       </div>

    ) 
}

export default Checkbox