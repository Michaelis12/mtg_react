import "./css/checkboxFormat.css"
import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from "../api/axiosInstance";
import loading from "../assets/loading.gif"



const CheckboxFormat = function (props) {
    const [formats, setFormats] = React.useState([])
    const [displayLoading, setDisplayLoading] = useState(false);


    useEffect(() => {
        const getFormats = async () => {
            try {
                setDisplayLoading(true);
                const request = await axiosInstance.get(`f_all/getFormats`);

                const response = request.data
    
                setFormats(response)
                setDisplayLoading(false);
            }   
            catch (error) {
                setDisplayLoading(false);
                console.log(error);
            }
        }
        getFormats();
        }, []); 


    return (
        <div className="checkbox-deck-format">
            {displayLoading && (
                <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
            )}
            {formats.map((format, index) => (
            <div className="checkbox-input-format-container" key={index}>
                <div className="input-format-container" >
                    <input className="input-deck-format" type="checkbox" name={format.name} value={format.name} onChange={props.onChange} 
                    checked={props.filterFormats.includes(format.name)}/>
                        <p className="new-deck-checkout-format">{format.name}</p>
                </div>
                <p className="format-text">{format.text}</p>
            </div> 
            ))}
        </div>

    )
}


export default CheckboxFormat
