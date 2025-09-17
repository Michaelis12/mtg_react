import "./css/RuleSelected.css"
import React from 'react';
import Section from '../components/section';
import Title from '../components/title'
import backgroundCardsPage from "../assets/background_cardsPage.jpg"
import backgroundWhite from "../assets/background_white.png"

const Mentions = function () {

  return (
    <Section>
      <img src={backgroundCardsPage} className="background-image" alt="background" />
      
      <Title title={"Mentions légales"} style={{marginTop:"3%", marginBottom:"2%"}}/>

      <div className="regle-selected-container" style={{ backgroundImage: `url(${backgroundWhite})` }}>
        <h5 className="regle-selected-content">
           <h5 className="regle-selected-content">
          <strong>Éditeur du site</strong><br/><br/>
          
          Ce site est édité par l'équipe MTG App, dédiée à la communauté Magic: The Gathering.
          <br/><br/>
          
          <strong>Hébergement</strong><br/><br/>
          Le site est hébergé sur des serveurs sécurisés avec des protocoles de sécurité 
          conformes aux standards actuels.
          <br/><br/>
          
          <strong>Propriété intellectuelle</strong><br/><br/>        
Ce site est un projet de fans, réalisé dans un but non commercial, et respecte la <a href="https://company.wizards.com/en/legal/fancontentpolicy" target="_blank">Fan Content Policy</a> de Wizards of the Coast. Aucun contenu de ce site ne prétend être officiel ni approuvé par Wizards of the Coast. Tous les éléments présentés sont utilisés à des fins informatives et communautaires, dans le respect des droits d’auteur et des marques déposées. Aucune illustration ou ressource n’est modifiée, et les mentions de copyright originales sont conservées dans la mesure du possible.<br/><br/>
<br/>

          <strong>Conditions générales d’utilisation (CGU)</strong><br/><br/>
          En utilisant ce site, vous acceptez de respecter les conditions suivantes :
          <br/><br/>
          <strong>Comportement des utilisateurs</strong><br/>
          Tout utilisateur s'engage à :
          <br/>• Respecter les autres membres de la communauté
          <br/>• Contribuer de manière constructive aux discussions
          <br/>• Respecter les règles du jeu Magic: The Gathering
          <br/>• Ne pas perturber l'expérience des autres utilisateurs
          <br/><br/>
          <strong>Contenu interdit</strong><br/>
          Sont strictement interdits :
          <br/>• Le spamming de publications inutiles perturbant l'expérience utilisateur
          <br/>• La publication de contenu obscène, pornographique ou choquant
          <br/>• La publication de contenu haineux, discriminatoire ou violent
          <br/>• Le harcèlement ou l'intimidation d'autres utilisateurs
          <br/>• La publication de contenu illégal ou incitant à des activités illégales
          <br/>• L'usurpation d'identité ou la création de faux comptes
          <br/>• La publicité non autorisée ou le marketing agressif
          <br/><br/>
          <strong>Sanctions</strong><br/>
          En cas de non-respect de ces conditions :
          <br/>• Première infraction : avertissement et suppression du contenu
          <br/>• Récidive : suspension temporaire du compte (7 à 30 jours)
          <br/>• Infractions graves ou répétées : bannissement définitif
          <br/>• Contenu illégal : bannissement immédiat et signalement aux autorités
          <br/><br/>
          <strong>Modération</strong><br/>
          L'équipe de modération se réserve le droit de :
          <br/>• Supprimer tout contenu inapproprié sans préavis
          <br/>• Suspendre ou bannir des comptes selon la gravité des infractions
          <br/>• Modifier ces conditions à tout moment
          <br/>• Prendre des mesures exceptionnelles en cas d'urgence
          <br/><br/>
          <strong>Recours</strong><br/>
          Si vous estimez qu'une sanction a été appliquée à tort :
          <br/>• Contactez l'équipe de modération via la page Contact
          <br/>• Fournissez des preuves et explications détaillées
          <br/>• Votre demande sera examinée dans les 5 jours ouvrés
          <br/><br/>
          <strong>Responsabilité</strong><br/>
          Chaque utilisateur est responsable du contenu qu'il publie. 
          L'éditeur du site ne peut être tenu responsable des propos tenus par les utilisateurs.
          <br/><br/>
        </h5>
        </h5>
      </div> 
    </Section> 
  )
}

export default Mentions