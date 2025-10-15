import React, { useEffect, useState } from 'react';
import "./css/checkboxFormat.css";

const CheckboxFormat = function (props) {
    const [formats, setFormats] = useState([]);
    const [displayLoading, setDisplayLoading] = useState(false);

    useEffect(() => {
        const allFormats = [
  {
    name: "standard",
    text: "Format construit qui utilise uniquement les extensions récentes. C’est le format le plus dynamique, car les cartes tournent régulièrement. Idéal pour les nouveaux joueurs ou les environnements compétitifs en constante évolution.",
  },
  {
    name: "future",
    text: "Format non officiel et purement spéculatif. Utilisé pour tester ou imaginer des mécaniques de jeu à venir. Ce format n'a pas de règles fixes et ne fait pas partie du jeu compétitif classique.",
  },
  {
    name: "historic",
    text: "Format numérique exclusif à MTG Arena. Il inclut toutes les cartes disponibles dans Arena, y compris certaines conçues spécialement pour ce format. Moins restreint que Standard, mais plus contenu que Modern.",
  },
  {
    name: "gladiator",
    text: "Format singleton (une seule copie de chaque carte) en 100 cartes, jouable en BO3 sur Arena. Créé par la communauté, il mélange le gameplay de Commander avec la structure compétitive du construit.",
  },
  {
    name: "pioneer",
    text: "Format construit papier jouant les cartes depuis Return to Ravnica (2012). Il comble le fossé entre Standard et Modern, avec moins de bannissements que ce dernier. Accessible et compétitif.",
  },
  {
    name: "modern",
    text: "Un des formats les plus populaires en tournoi. Il comprend toutes les cartes depuis la 8e édition (2003). Rapide, varié et exigeant, c’est un format équilibré entre accessibilité et puissance.",
  },
  {
    name: "legacy",
    text: "Format ancien très puissant, avec un immense pool de cartes. Bien que coûteux, il offre une diversité stratégique inégalée. Les interactions complexes y sont fréquentes, rendant les parties très techniques.",
  },
  {
    name: "pauper",
    text: "Format compétitif et économique, où seules les cartes ayant existé en version commune sont autorisées. Malgré sa simplicité apparente, Pauper propose une grande profondeur stratégique.",
  },
  {
    name: "vintage",
    text: "Le format le plus ancien et le plus permissif. Peu de cartes sont bannies, mais certaines sont limitées à une seule copie. Il permet d’utiliser les cartes les plus puissantes jamais imprimées, comme le Black Lotus.",
  },
  {
    name: "commander",
    text: "Format multijoueur en 100 cartes singleton autour d’un commandant légendaire. Très populaire en casual, il favorise les interactions sociales, les combos originaux et les parties longues et épiques.",
  },
  {
    name: "brawl",
    text: "Variante du Commander en 60 cartes, avec un commandant légendaire issu du Standard. Moins de cartes, parties plus rapides, et exclusivement disponible sur MTG Arena (et parfois en papier).",
  },
  {
    name: "alchemy",
    text: "Format numérique évolutif sur Arena, avec des cartes modifiées régulièrement pour l’équilibrage. Propose également du contenu exclusif absent du format papier. Parfait pour les joueurs compétitifs en ligne.",
  },
  {
    name: "duel",
    text: "Version 1v1 compétitive du format Commander, avec une banlist spécifique. Le gameplay est plus tendu et stratégique, conçu pour des affrontements en duel plutôt que multijoueur.",
  },
  {
    name: "oldschool",
    text: "Format nostalgique utilisant uniquement les premières éditions de Magic (1993–1994). Joué surtout pour l’esthétique, l’ambiance rétro et le respect de l’histoire du jeu.",
  },
  {
    name: "premodern",
    text: "Format non officiel qui couvre les cartes entre 1995 (4e édition) et 2003 (fin de l'ère pré-Modern). Il recrée un environnement compétitif « à l’ancienne » sans cartes trop modernes ni mécaniques récentes.",
  },
];


        // Simuler un chargement
        setDisplayLoading(true);
        setTimeout(() => {
            setFormats(allFormats);
            setDisplayLoading(false);
        }, 500); // délai pour simuler une requête
    }, []);

    return (
        <div className="checkbox-deck-format">
            {displayLoading ? (
                <p>Chargement des formats...</p>
            ) : (
                formats.map((format, index) => (
                    <div className="checkbox-input-format-container" key={index}>
                        <div className="input-format-container">
                            <input
                                className="input-deck-format"
                                type="checkbox"
                                name={format.name}
                                value={format.name}
                                onChange={props.onChange}
                                checked={props.filterFormats.includes(format.name)}
                            />
                            <p className="new-deck-checkout-format">{format.name}</p>
                        </div>
                        <p className="format-text">{format.text}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default CheckboxFormat;
