import "./css/RuleSelected.css"
import React from 'react';
import Section from '../components/section';
import Title from '../components/title'
import backgroundCardsPage from "../assets/background_cardsPage.jpg"
import backgroundWhite from "../assets/background_white.png"

const RGPD = function () {

  return (
    <Section>
      <img src={backgroundCardsPage} className="background-image" alt="background" />
      
      <Title title={"Politique de confidentialité (RGPD)"} style={{marginTop:"3%", marginBottom:"2%"}}/>

      <div className="regle-selected-container" >
        <h5 className="regle-selected-content">
          <strong>1. Collecte des données personnelles</strong><br/><br/>
          
          Nous collectons les informations que vous nous fournissez directement, notamment lors de la création de votre compte, 
          de l'utilisation de nos services ou de la communication avec nous. Ces informations peuvent inclure :
          <br/>• Pseudo et adresse e-mail
          <br/>• Informations de profil (avatar, préférences)
          <br/>• Contenu que vous créez (decks)
          <br/>• Données d'utilisation de l'application
          <br/><br/>
          
          <strong>2. Utilisation des données</strong><br/><br/>
          
          Nous utilisons vos données personnelles pour :
          <br/>• Fournir et améliorer nos services
          <br/>• Personnaliser votre expérience utilisateur
          <br/>• Communiquer avec vous concernant votre compte
          <br/>• Assurer la sécurité de notre plateforme
          <br/>• Respecter nos obligations légales
          <br/><br/>
          
          <strong>3. Partage des données</strong><br/><br/>
          
          Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. 
          Nous pouvons partager vos informations uniquement dans les cas suivants :
          <br/>• Avec votre consentement explicite
          <br/>• Pour respecter une obligation légale
          <br/>• Pour protéger nos droits et notre sécurité
          <br/>• Avec nos prestataires de services (hébergement, analyse)
          <br/><br/>
          
          <strong>4. Sécurité des données</strong><br/><br/>
          
          Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées 
          pour protéger vos données personnelles contre l'accès non autorisé, la modification, 
          la divulgation ou la destruction.
          <br/><br/>
          
          <strong>5. Vos droits</strong><br/><br/>
          
          Conformément au RGPD, vous disposez des droits suivants :
          <br/>• Droit d'accès à vos données personnelles
          <br/>• Droit de rectification des données inexactes
          <br/>• Droit à l'effacement de vos données
          <br/>• Droit à la limitation du traitement
          <br/>• Droit à la portabilité de vos données
          <br/>• Droit d'opposition au traitement
          <br/>• Droit de retirer votre consentement
          <br/><br/>
          
          <strong>6. Conservation des données</strong><br/><br/>
          
          Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services 
          ou pour respecter nos obligations légales. Vous pouvez demander la suppression de votre compte 
          à tout moment dans l'espace "Paramètres avancés du compte".
          <br/><br/>
          
          <strong>7. Cookies et technologies similaires</strong><br/><br/>
          
          Les cookies présents sur ce site sont utilisés uniquement pour gérer la session de l’utilisateur connecté (connexion/déconnexion, accès aux pages sécurisées, etc.).
          Ils sont strictement nécessaires au fonctionnement du service et ne sont en aucun cas utilisés à des fins de suivi marketing.
          <br/><br/>
          
          <strong>8. Modifications de cette politique</strong><br/><br/>
          
          Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. 
          Nous vous informerons de tout changement significatif via notre site web ou par e-mail.
          <br/><br/>
          
          <strong>9. Autorité de contrôle</strong><br/><br/>
          
          Vous avez le droit de déposer une plainte auprès de la Commission Nationale de l'Informatique 
          et des Libertés (CNIL) si vous estimez que le traitement de vos données personnelles 
          constitue une violation du RGPD.
        </h5>
      </div> 
    </Section> 
  )
}

export default RGPD 