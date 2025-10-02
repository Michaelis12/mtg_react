import "./css/RulesPage.css"
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../api/axiosInstance";
import Rule from '../model/Rule';
import Section from '../components/section';
import FooterSection from '../components/footerSection';
import Title from '../components/title'
import PopupDelete from '../components/popupDelete';
import { FaPencilAlt } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CgCloseO  } from "react-icons/cg";
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
  const token = localStorage.getItem('authToken');
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

  // Supprimer la règle
  const deleteRule = async (id) => {
    try {
      setDisplayLoading(true);
      await axiosInstance.delete(`f_admin/deleteRegle?regleID=${id}`, { withCredentials: true });   
      
      setRuleToDelete(null)
    }   
    catch (error) {
      setDisplayLoading(false);
      console.log(error)
    }
  };

  // Modifier la règle
  const updateRule = async (id) => {
    try {
      setDisplayLoading(true);
      const regleForm = {};       
      if (title !== "") regleForm.title = title;
      if (text !== "") regleForm.text = text;

      await axiosInstance.put(`f_admin/updateRegle?regleID=${id}`, regleForm, { withCredentials: true });   
      
      setRuleToUpdate(null)
      setDisplayLoading(false)
      setTitle("")
      setText("")
    }   
    catch (error) {
      setDisplayLoading(false);
      console.log(error)
    }
  };
   
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
            <h1 className="regle-title">{rule.title}</h1>
            <div className="regle-content" style={{backgroundImage:`url(${backgroundRule})`,
                                                    backgroundPosition: "center"}}>{rule.text}</div>

          </div>
          <div className="icon-regle-container">
            <FaPencilAlt className='cards-admin-icon' onClick={()=> setRuleToUpdate(rule.id)} size={'2em'}/>
            <RiDeleteBin6Line className='cards-admin-icon' onClick={() => setRuleToDelete(rule.id)}  size={'2em'}/>
          </div>


        { ruleToDelete === rule.id && (
              <PopupDelete title={"Supprimer la règle ?"} 
              back={()=>setRuleToDelete(null)} onClick={()=>deleteRule(rule.id)}/>
            )}
        { ruleToUpdate === rule.id && (
              <div className='popup-bckg'>
              <div className="update-element-popup">
                <div className='textarea-container'>
                 <textarea className="input-name" id="deck-name" name="deck-name" rows="1" cols="33"
                 onChange={(e) => setTitle(e.target.value)} >
                      {rule.title}
                 </textarea>
                </div>

                <textarea className="input-text-rule" id="deck-name" name="deck-name" rows="20"
                 onChange={(e) => setText(e.target.value)} >
                      {rule.text}
                 </textarea>

                 <textarea className="input-text-rule-mobile" id="deck-name" name="deck-name" rows="25"
                 onChange={(e) => setText(e.target.value)} >
                      {rule.text}
                 </textarea> 

                 <button  type="button" className="valid-form"
                            disabled={title === "" && text === "" || displayLoading}
                            onClick={() => updateRule(rule.id)}><h4>
                                Valider
              </h4></button>
              </div>
              <CgCloseO className='icon-close-popup' color='white' size={'5em'}  onClick={()=>setRuleToUpdate(null)}/> 
             </div>
            )}
          
        </div>                       
         ))}
        </div>
         
      </div>
      <FooterSection/>
    </Section>
  )
}

export default RulesPage