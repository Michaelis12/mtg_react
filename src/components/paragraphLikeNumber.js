 import "./css/paragraphLikeNumber.css"
import { FaHeart } from 'react-icons/fa';

const ParagraphLikeNumber = function (props) { 

    return (
        <p style={props.style} className='paragraph-likenumber'>{props.text} <FaHeart className="icon-like-number" style={props.iconStyle}
                           size={'0.9em'}  color='red' /></p>
                ) 
} 

export default ParagraphLikeNumber 
