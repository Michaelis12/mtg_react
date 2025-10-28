import "./css/cardLink.css";
import { useNavigate } from 'react-router-dom';

const Card = ({ cards = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="cardlink-container">
      {cards.map((card, index) => (
        <div
          key={index}
          className="cardlink"
          onClick={() => {
            if (card.onClick) card.onClick();

            // Si link est une fonction, on la laisse gérer la navigation
            if (typeof card.link === "function") {
              card.link(navigate);
            } 
            // Si link est un objet { path, options }
            else if (typeof card.link === "object" && card.link.path) {
              navigate(card.link.path, card.link.options || {});
            } 
            // Si link est une simple string
            else if (typeof card.link === "string") {
              navigate(card.link);
            }
          }}
        >
          <img
            src={card.image}
            alt={card.alt || card.caption}
            className="cardlink-image"
          />
          <div className="cardlink-legend-container">
            <h3 className="cardlink-legend"><strong>{card.caption}</strong></h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
