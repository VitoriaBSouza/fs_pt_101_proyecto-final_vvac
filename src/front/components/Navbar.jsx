import { Link } from "react-router-dom";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//assets
import logo from "../assets/img/recetea-logo.png";

//components
import { LogOut } from "../components/LogOut.jsx";
import { CollectionList } from "../components/CollectionList.jsx";
import { SearchButton } from '../components/buttons/searchButton.jsx';

export const Navbar = () => {

  const { store, dispatch } = useGlobalReducer();

  return (

    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-navbar" />
        </Link>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">

          <SearchButton />

          <CollectionList />

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          
            <li className="nav-item dropdown">
              <img className="nav-link dropdown-toggle user_img" 
              src={store.user?.photo_url}
              href="#" id="navbarDropdown" 
              role="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"/>

              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li className="m-2"><a className="dropdown-item" href="/profile">Profile</a></li>
                <li className="m-2"><a className="dropdown-item" href="/your-collection">My Recipes</a></li>
                <li className="m-2"><a className="dropdown-item" href="/meal-planner">Meal Planner</a></li>
                <li className="mb-2"><hr className="dropdown-divider"/></li>
                <li className="mb-2"><LogOut /></li>
              </ul>
            </li>
          </ul>

        </div>
      </div>
    </nav>
  );
};