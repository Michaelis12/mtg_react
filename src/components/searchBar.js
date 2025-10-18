import "./css/searchBar.css"
import { GrSearch } from "react-icons/gr";
import { TbFilterCancel } from "react-icons/tb";


const SearchBar = function (props) {
    return ( 
        <div className="input-container" style={props.style}> 
            <input type="search" className="form-control-rounded" placeholder={props.placeholder}
            aria-describedby="search-addon" onChange={props.onChange} value={props.value}/>
            <button className="searchbar-button" onClick={props.onClick} style={props.buttonStyle}
            ><GrSearch className="searchbar-icon" /></button>
            <TbFilterCancel className='compenant-reset-searchbar' style={props.iconStyle} onClick={props.onPush}/>
        </div> ) 
} 

export default SearchBar
