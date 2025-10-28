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
            if (card.onClick) card.onClick(); // exécute le code avant navigation
            if (card.link) navigate(card.link); // ensuite navigue
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


