import "./css/RuleSelected.css"
import React from 'react';
import { useLocation,  useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosInstance from "../api/axiosInstance";
import IconButtonHover from '../components/buttonIconHover';
import backgroundRule from "../assets/background_white.png"
import Section from '../components/section';
import Title from '../components/title'
import backgroundCardsPage from "../assets/background_cardsPage2.jpg"
import { MdOutlinePlayArrow } from "react-icons/md";
import loading from "../assets/loading.gif" 

const ReglesPage = function () {

  const [rule, setRule] = React.useState([])
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.ruleID;
  const rules = location.state?.ListRules
  const [newID, setNewID] = React.useState("")
  const [displayLoading, setDisplayLoading] = useState(false);

  const getRule = async () => { 
    try {
      setDisplayLoading(true);
      if(newID === "") {
        setNewID(id)
      }
     
      const response = await axiosInstance.get(`/f_all/getRegleByID?regleID=${newID}`);
      
      setRule(response.data)
      setDisplayLoading(false);
    }   
    catch (error) {
      setDisplayLoading(false);
      console.log(error);
    }
  }
  React.useEffect(() => {
    getRule();
  }, [id, newID]); 

  // Boutons navigation règles
  const prevRule = async () => {
    try {
      setDisplayLoading(true);
      const request = await axiosInstance.get(`/f_all/getPrevRegle?regleID=${newID}&reglesID=${rules}`);
      const response = request.data
      setNewID(response)
      setDisplayLoading(false);
    }   
    catch (error) {
      setDisplayLoading(false);
      console.log(error);
    }
  }; 

  // Désactive le bouton si il n'y a plus de decks qui suivent     
  const [prevButtonActive, setPrevButtonActive] = useState(true)
  
  useEffect(() => {
    const desacPrevRule = () => {
      const firstRuleId = rules[0];
      if (newID === firstRuleId) {
        setPrevButtonActive(false)
      }
      else {
        setPrevButtonActive(true)
      }
    }
    desacPrevRule() }, [newID]);
  
  // Navigue vers la carte suivante dans a liste
  const nextRule = async () => {
    try {
      setDisplayLoading(true);
      const request = await axiosInstance.get(`/f_all/getNextRegle?regleID=${newID}&reglesID=${rules}`);
      const response = request.data
      setNewID(response)
      setDisplayLoading(false);
    }   
    catch (error) {
      setDisplayLoading(false);
      console.log(error);
    }
  };
  
  // Désactive le bouton si il n'ya plus de decks qui suivent     
  const [nextButtonActive, setNextButtonActive] = useState(true)
  
  // Navigue vers la carte précédente dans a liste
  useEffect(() => {
    const desacNextRule = () => {
      const lastRuleId = rules[rules.length - 1];
      if (newID === lastRuleId) {
        setNextButtonActive(false)
      }
      else {
        setNextButtonActive(true)
      }
    }
    desacNextRule() }, [newID]);

  return (
    <Section>
      <img src={backgroundCardsPage} className="background-image" alt="background" />
      { displayLoading && (
        <img src={loading} className="loading-img" alt="Chargement..." style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:1000}} />
      )}
      <Title title={rule.title} style={{marginTop:"3%", marginBottom:"2%"}}/>


      <div className='button-nav-mobile'>   
        <IconButtonHover onClick={() => prevRule()} disabled={!prevButtonActive}
        icon={<MdOutlinePlayArrow className='icon-nav' style={{ transform: 'scaleX(-1)' }} />} />
        <IconButtonHover onClick={() => nextRule()}  disabled={!nextButtonActive}
        icon={<MdOutlinePlayArrow className='icon-nav' />} />                   
      </div>
      
      
      <div className='button-navig'>  
        <IconButtonHover onClick={() => prevRule()} disabled={!prevButtonActive}
        icon={<MdOutlinePlayArrow className='icon-nav' style={{ transform: 'scaleX(-1)' }} />} />
        <IconButtonHover onClick={() => nextRule()}  disabled={!nextButtonActive}
        icon={<MdOutlinePlayArrow className='icon-nav' />} />
      </div>

      <div className="regle-selected-container">
        <h5 className="regle-selected-content" >{rule.text}</h5>
      </div> 
    </Section> 
  )
}

export default ReglesPage
