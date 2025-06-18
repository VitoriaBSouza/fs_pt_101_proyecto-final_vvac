import { Link, useLocation } from "react-router-dom";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//assets
import logo from "../assets/img/recetea-logo.png";

//components
import { LogOut } from "../components/LogOut.jsx";
import { CollectionList } from "../components/CollectionList.jsx";
import { Search } from '../components/Search.jsx';
import { Search } from '../components/Search.jsx';

export const Navbar = () => {

  const { store, dispatch } = useGlobalReducer();
  const location = useLocation()

  return (

    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-navbar" />
        </Link>

        <Search />

        {store.user?.id ? 

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            
            <CollectionList />

            <ul className="navbar-nav mb-lg-0">
            
              <li className="nav-item dropdown">
                <img className="nav-link dropdown-toggle user_img m-2" 
                src={store.user?.photo_url}
                href="#" id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"/>

                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li className="m-2"><a className="dropdown-item" href="/profile">Profile</a></li>
                  <li className="m-2"><a className="dropdown-item" href="/your-collection">My Recipes</a></li>
                  <li className="m-2"><a className="dropdown-item" href="/meal-planner">Meal Planner</a></li>
                  <li className="mb-2"><hr className="dropdown-divider"/></li>
                  <li className="mb-2"><LogOut /></li>
                </ul>
              </li>
            </ul>

          </div>
        
        : 
          <div>
            {location.pathname == "/" ? 
            
            <div className="d-flex">
              <Link to="/login" className="border-end border-2">
                <button className="btn border-0 m-2 fs-5 fw-bold">Log In</button>
              </Link>
              <Link to="/signup">
                <button className="btn border-0 m-2 fs-5 fw-bold text-danger">Sign Up</button>
              </Link>
            </div>

            : 
              <div className="ms-auto">
                {location.pathname == "/login" ? 
                  <Link to="/signup">
                    <button className="btn border-0 m-2 fs-5 fw-bold text-danger">Sign Up</button>
                  </Link>
                  :
                  <Link to="/login">
                    <button className="btn border-0 m-2 fs-5 fw-bold">Log In</button>
                  </Link>
                }
                
              </div>
            }
          </div>
        }

      </div>
    </nav>
  );
};