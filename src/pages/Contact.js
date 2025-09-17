import "./css/RuleSelected.css"
import React from 'react';
import Section from '../components/section';
import Title from '../components/title'
import backgroundCardsPage from "../assets/background_cardsPage.jpg"
import backgroundWhite from "../assets/background_white.png"

const Contact = function () {

  return (
    <Section>
      <img src={backgroundCardsPage} className="background-image" alt="background" />
      
      <Title title={"Contact"} style={{marginTop:"3%", marginBottom:"2%"}}/>

      <div className="regle-selected-container" style={{ backgroundImage: `url(${backgroundWhite})` }}>
        <h5 className="regle-selected-content">
          <strong>Nous contacter</strong><br/><br/>
          
          Vous avez des questions, des suggestions ou besoin d'aide ? N'hésitez pas à nous contacter !
          <br/><br/>
          
          <strong> Adresse e-mail</strong><br/>
          support@mtg-app.com<br/>
          privacy@mtg-app.com (pour les questions de confidentialité)<br/><br/>
          
          <strong> Support technique</strong><br/>
          Notre équipe technique est disponible pour vous aider avec :
          <br/>• Problèmes de connexion ou d'authentification
          <br/>• Difficultés d'utilisation de l'application
          <br/>• Bugs ou dysfonctionnements
          <br/>• Questions sur les fonctionnalités
          <br/><br/>
          
          <strong> Support communautaire</strong><br/>
          Pour les questions liées au jeu Magic: The Gathering :
          <br/>• Règles et clarifications
          <br/>• Conseils de deckbuilding
          <br/>• Partage d'expériences
          <br/><br/>
          
          <strong> Questions légales</strong><br/>
          Pour toute question concernant :
          <br/>• Les mentions légales
          <br/>• La politique de confidentialité
          <br/>• Les conditions d'utilisation
          <br/>• La protection des données
          <br/><br/>
          
          <strong> Informations à inclure dans votre message</strong><br/>
          Pour un traitement plus rapide de votre demande, merci d'inclure :
          <br/>• Votre nom d'utilisateur
          <br/>• Une description claire du problème
          <br/>• Les étapes pour reproduire le problème (si applicable)
          <br/>• Votre navigateur et système d'exploitation
          <br/>• Une capture d'écran (si pertinent)
          <br/><br/>

          
          <strong> Suivi de votre demande</strong><br/>
          Chaque demande reçoit un numéro de référence. 
          Conservez-le pour le suivi de votre dossier.
          <br/><br/>
          
          <strong> Urgences</strong><br/>
          En cas d'urgence technique bloquant l'accès à votre compte, 
          contactez-nous immédiatement avec le sujet "URGENT - Blocage compte".
          <br/><br/>
          
          <strong> Suggestions d'amélioration</strong><br/>
          Vos idées nous intéressent ! N'hésitez pas à nous faire part de vos suggestions 
          pour améliorer l'application. Chaque proposition est étudiée avec attention.
        </h5>
      </div> 
    </Section> 
  )
}

export default Contact 