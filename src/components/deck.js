import "./css/deck.css"
import { getImageUrl } from '../utils/imageUtils';
import BackgroundDeck from "../assets/background_deck_scelled.png"
import BackgroundDeckAttributs from "../assets/old-paper.jpg"
import { FaHeart  } from 'react-icons/fa';
import white from "../assets/white-mtg.png"
import blue from "../assets/blue-mtg.png"
import green from "../assets/green-mtg.png"
import red from "../assets/red-mtg.png"
import black from "../assets/black-mtg.png"
import incolore from "../assets/incolore-mtg.png"

const Deck = function (props) {


    // Récupère l'image de chaque couleur
        const getColorPics = (value) => {
                                        if(value === "W") {
                                            return white
                                        }
                                        if(value === "U") {
                                            return blue
                                        }
                                        if(value === "G") {
                                            return green
                                        }
                                        if(value === "R") {
                                            return red
                                        }
                                        if(value === "B") {
                                            return black
                                        }
                                        if(value === "colorless") {
                                            return incolore
                                        }
                                       
        };

    
   
    return (    

            <div className="deck-details-container">
                                    <div className="deck-details" id='decks-user'  key={props.key} style={{ backgroundImage: `url(${BackgroundDeck})`,backgroundSize: 'cover',      // L'image couvre tout le div
                                        backgroundPosition: 'center', 
                                        backgroundRepeat: 'no-repeat'}}>
                                        <div className='deck-attributs' style={{ backgroundImage: `url(${BackgroundDeckAttributs})`}}>
                                            <img className="deck-pp" src={getImageUrl(props.image)} alt="Deck avatar" onClick={props.onClick}
                                            onMouseEnter={props.onMouseEnter} onMouseOut={props.onMouseOut}/>
                                            
                                            <h3 className="decks-name" style={{padding:'2%'}}><strong> {props.name} </strong></h3>
                                            <h6 className={props.className} onClick={props.paraOnClick} style={props.style}>{props.para}</h6>

                                            {props.detailsDeck && props.detailsDeck.id === props.id && (
                                                <div className="hover-deck-card" style={{ backgroundImage: `url(${BackgroundDeckAttributs})`, zIndex: '1'}}>
                                                    <div className="img-container">
                                                        <img className="hover-deck-card-img" src={getImageUrl(props.image)} alt="Deck mtg"/>
                                                    </div>
                                                    <div className="deck-hover-body" >
                                                                <div className='name-line'>
                                                                <h1 className="hover-deck-name"><strong>{props.name}</strong></h1>
                                                                </div>
                                                                <div className='color-line'>                        
                                                                    <h4 className='color'> Couleurs : </h4>                                                                    
                                                                    {props.colors && props.colors.length > 0 && (
                                                                        <div className='mapping-color'>
                                                                        {props.colors.map((color)  => (
                                                                        <img src={getColorPics(color)} key={props.color}
                                                                        className="color-img-select" alt={color}/>                                
                                                                    ))}
                                                                        </div>
                                                                    )} 
                                                                </div>
                                                                <div className='format-line'>               
                                                                    <h4 className='format'> Format : </h4> 
                                                                    <h4 className='card-format' style={{ backgroundColor: 'green' }}>{props.format}</h4>
                                                                </div>
                                                                
                                                    </div>                                                
                                                </div>
                                            )}
                                        </div>                                    
                                    </div> 
                                    <p style={props.likenumberStyle} className='card-page-likenumber'>{props.likeNumber} <FaHeart style={{marginBottom: '3px', zIndex: '1'}}
                                                            size={'0.8em'}  color='red' /></p>
                                </div>      
    )
}

export default Deck
