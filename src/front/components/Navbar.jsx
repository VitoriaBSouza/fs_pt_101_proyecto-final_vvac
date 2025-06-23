import { Link, useLocation } from "react-router-dom";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//assets
import logo from "../assets/img/recetea-logo.png";

//components
import { CollectionList } from "../components/CollectionList.jsx";
import { Search } from '../components/Search.jsx';
import { UserButton } from "./userButton.jsx";

export const Navbar = () => {

  const { store, dispatch } = useGlobalReducer();
  const location = useLocation()

  return (

    <nav className="navbar navbar-expand-lg navbar-light bg-light flex-column">

      <div className="container-fluid d-flex align-items-center w-100 d-lg-none justify-content-between">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-navbar" />
        </Link>

        <div className="d-flex align-items-center">
          {store.user?.id ? (
            <div className="d-flex align-items-center ms-auto">
              <CollectionList />
              <UserButton />
            </div>
          ) : location.pathname === "/" || location.pathname === "/forgot-password" ? (
            <div className="d-flex">
              <Link to="/login" className="border-end border-2">
                <button className="btn border-0 m-2 fs-5 fw-bold">Log In</button>
              </Link>
              <Link to="/signup">
                <button className="btn border-0 m-2 fs-5 fw-bold text-danger">Sign Up</button>
              </Link>
            </div>
          ) : (
            <div className="ms-auto">
              {location.pathname === "/login" ? (
                <Link to="/signup">
                  <button className="btn border-0 m-2 fs-5 fw-bold text-danger">Sign Up</button>
                </Link>
              ) : (
                <Link to="/login">
                  <button className="btn border-0 m-2 fs-5 fw-bold">Log In</button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container-fluid mt-2 w-100 d-lg-none">
        <Search />
      </div>

      <div className="container-fluid d-none d-lg-flex align-items-center w-100">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-navbar me-4" />
        </Link>

        <Search />

        <div className="ms-auto d-flex align-items-center">
          {store.user?.id ? (
            <>
              <CollectionList />
              <UserButton />
            </>
          ) : location.pathname === "/" ? (
            <div className="d-flex">
              <Link to="/login" className="border-end border-2">
                <button className="btn border-0 m-2 fs-5 fw-bold">Log In</button>
              </Link>
              <Link to="/signup">
                <button className="btn border-0 m-2 fs-5 fw-bold text-danger">Sign Up</button>
              </Link>
            </div>
          ) : (
            <div className="ms-auto">
              {location.pathname === "/login" ? (
                <Link to="/signup">
                  <button className="btn border-0 m-2 fs-5 fw-bold text-danger">Sign Up</button>
                </Link>
              ) : (
                <Link to="/login">
                  <button className="btn border-0 m-2 fs-5 fw-bold">Log In</button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

    </nav>

  );
};