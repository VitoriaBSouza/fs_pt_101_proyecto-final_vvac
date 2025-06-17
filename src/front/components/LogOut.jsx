import { useNavigate, Link} from "react-router-dom";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const LogOut = () => {

    const {store, dispatch} = useGlobalReducer();
    const navigate = useNavigate()
    
    const handleLogout = () => {
        dispatch({type: 'logout'})
        navigate('/')
    }


    return(
        <Link className="text-decoration-none text-danger fw-bold m-4" onClick={handleLogout}>Log Out</Link>
    );
}