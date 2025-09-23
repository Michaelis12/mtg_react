import React from 'react';
import './css/sectionMap.css'


const SectionMap = function ({children}, props) {
    return (
        <section className='section-map' style={props.style}>
        {children}
        </section> 
    ) 
}

export default SectionMap