import { GrSearch } from "react-icons/gr";
import { TbFilterCancel } from "react-icons/tb";
import "./css/searchBar.css"


/*
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
*/


const SearchBar = function (props) {
    return ( 
        <div className="input-container" style={props.style}> 
            <input type="search" className="form-control-rounded" placeholder={props.placeholder}
            aria-describedby="search-addon" onChange={props.onChange} value={props.value}/>
            {(props.filter === "" || props.filter !== props.prompt) && (
                <button className="searchbar-button" onClick={props.onClick} style={props.buttonStyle}
                ><GrSearch className="searchbar-icon" /></button>
            )}
            {props.filter !== "" && props.filter === props.prompt && (
                <button className="searchbar-button" onClick={props.onPush} style={props.buttonStyle}
                ><TbFilterCancel className="searchbar-icon" /></button>
            )}
        </div> ) 
} 


export default SearchBar