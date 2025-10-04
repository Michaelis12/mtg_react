import "./css/RulesPage.css"
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../api/axiosInstance";
import Rule from '../model/Rule';
import Section from '../components/section';
import FooterSection from '../components/footerSection';
import Title from '../components/title'
import TitleType from '../components/titleType';
import backgroundCardsPage from "../assets/background_cardsPage.jpg"
import backgroundRule from "../assets/background_white.png"
import loading from "../assets/loading.gif" 

const RulesPage = function () { 

  const [rules, setRules] = React.useState([])
  const [ruleToDelete, setRuleToDelete] = useState(null);
  const [ruleToUpdate, setRuleToUpdate] = useState(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const [displayLoading, setDisplayLoading] = useState(false);

  // Mapper les règles
  const getRules = async () => { 
    try {
      setDisplayLoading(true);
      const response = await axiosInstance.get('f_all/getRegles');
      
      const listRules = response.data.map(
              rule => new Rule (rule.id, rule.title, rule.text) )          

      setRules(listRules)
      setDisplayLoading(false);
    }   
    catch (error) {
      setDisplayLoading(false);
      console.log(error);
    }
  }
  React.useEffect(() => {
    getRules();
  }, [ruleToUpdate, ruleToDelete]); 

  // Naviguer vers une règle
  const selectRule = async (ruleID) => { 
    try {
      setDisplayLoading(true);
      const rulesIDs = rules.map(rule => rule.id);

      navigate(`/ruleSelected`, { state: { ruleID: ruleID, ListRules : rulesIDs }})
    } 
    catch (error) {
      setDisplayLoading(false);
      console.log(error);
    }
  }
  
  return ( 
    <Section>
      { displayLoading && (
        <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
      )}
      <img src={backgroundCardsPage} className="background-image" alt="background" />
      <Title title={"Règles MTG"} />
      <div className="display-objects-section">  
        <div className="regles-container">
          {rules.map(rule=>(
          <div className="regle-container" key={rule.id}>
            
            <div className="regle" onClick={()=>selectRule(rule.id)} >

              <div className="title-rule-desktop">
                <h1 className="regle-title">{rule.title}</h1>
              </div>

              <div className="title-rule-mobile">
                <TitleType title={rule.title}/>
              </div>

              <div className="regle-content" style={{backgroundImage:`url(${backgroundRule})`,
                                                      backgroundPosition: "center"}}>{rule.text}</div>
              

            </div>               
          </div>                        
          ))}
        </div>
      </div>
      <FooterSection/>
    </Section>
  )
}

export default RulesPage
