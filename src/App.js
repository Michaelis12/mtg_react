import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// Pages User
import LayoutUser from './layouts/layoutUser';
import HomePage from './pages/HomePage';
import SignPage from './pages/SignPage';
import AccountPage from './pages/AccountPage';
import SettingPage from './pages/SettingPage';
import RulesPage from './pages/RulesPage';
import RulesPageAdmin from './pages/RulesPageAdmin';
import RuleSelected from './pages/RuleSelected';
import CardsPage from './pages/CardsPageApi';
import CardSelected from './pages/CardSelectedApi';
import DecksPage from './pages/DecksPage';
import DeckSelected from './pages/DeckSelected';
import DecksCreatePage from './pages/DecksCreatePage';
import DecksLikedPage from './pages/DecksLikedPage';
import UserSelected from './pages/UserSelected';
import UserSelectedAdmin from './pages/UserSelectedAdmin';
import Deckbuilding from './pages/DeckbuildingApi';
import CardsDeckPage from './pages/CardsDeckPageApi';
import NewDeck from './pages/NewDeckApi';
// Pages légales
import Mentions from './pages/Mentions';
import RGPD from './pages/RGPD';
import Contact from './pages/Contact';
// Pages admin
import NewRule from './pages/NewRule';
import CardsPageAdmin from './pages/CardsPageAdmin';
import UsersList from './pages/UsersList'; 
import NewAdmin from './pages/NewAdmin';


// On réalise une function qui fonctione avec le Router de React

const Router = createBrowserRouter([

  {path:"/",
  element : <LayoutUser/>,
  children: 
  [
    {path:"/",
      element : <HomePage/>}, 
    {path:"/sign",
      element : <SignPage/>},
    {path: "/mySpace",
      element: <AccountPage/>},
    {path: "/setting",
      element: <SettingPage/>},
    {path: "/rules",
      element: <RulesPage/>},
    {path: "/admin/rules",
      element: <RulesPageAdmin/>},
    {path: "/ruleSelected",
      element: <RuleSelected/>},
    {path: "/admin/addRule",
      element: <NewRule/>},
    {path: "/cards",
      element: <CardsPage/>},
    {path: "/cardSelected",
      element: <CardSelected/>},
    {path: "/decks",
      element: <DecksPage/>},
    {path: "/decksCreate",
      element: <DecksCreatePage/>},
    {path: "/decksLiked",
      element: <DecksLikedPage/>},
    {path: "/deckSelected",
      element: <DeckSelected/>},
    {path: "/userSelected",
      element: <UserSelected/>},
    {path: "/admin/userSelected",
      element: <UserSelectedAdmin/>},
    {path: "/deckbuilding",
      element: <Deckbuilding/>},
    {path: "/cardsDeck",
      element: <CardsDeckPage/>},
    {path: "/addDeck",
        element: <NewDeck/>},
    {path:"admin/cards", 
        element : <CardsPageAdmin/>},
    {path:"admin/users", 
        element : <UsersList/>},
    {path:"admin/addAdmin", 
        element : <NewAdmin/>},
    // Pages légales
    {path:"/mentions", 
        element : <Mentions/>},
    {path:"/rgpd", 
        element : <RGPD/>},
    {path:"/contact", 
        element : <Contact/>}
    ]
  }
])


const App = function () {
  return (
      <>
      <RouterProvider router={Router}/>
      </>
  )
}

export default App
