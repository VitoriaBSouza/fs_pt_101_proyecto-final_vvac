import { Link, useLocation } from "react-router-dom";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//assets
import logo from "../assets/img/recetea-logo.png";

//components
import { LogOut } from "../components/LogOut.jsx";
import { CollectionList } from "../components/CollectionList.jsx";
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

        <form className="d-flex" role="search">
          <input className="form-control me-2 r-10" type="search" placeholder="Search recipes, diets and more" aria-label="Search" />
          <button className="btn btn-outline-primary" type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
        </form>

        {/* Botón hamburguesa para colapsar en móvil */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarButtons">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido colapsable */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarButtons">
          <div className="d-flex gap-2">
            <a href="/login" className="btn btn-primary">Login</a>
            <a href="/signup" className="btn btn-primary">Register</a>
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