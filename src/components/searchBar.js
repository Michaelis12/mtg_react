import "./css/searchBar.css"


const SearchBar = function (props) {
    return ( 
        <div className="input-container"> 
            <input type="search" className="form-control-rounded" placeholder={props.placeholder} aria-label="Search" style={props.style}
            aria-describedby="search-addon" onChange={props.onChange} value={props.value}/>
        </div> ) 
} 

export default SearchBar