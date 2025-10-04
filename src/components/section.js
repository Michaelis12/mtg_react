import React from 'react';
import './css/section.css'


const Section = function ({children}, props) {
    return (
        <section className='section' style={props.style}>
        {children}
        </section> 
    )
}

export default Section
