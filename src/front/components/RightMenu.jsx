import { useNavigate } from "react-router-dom"; 

// hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const RightMenu = () => {

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate(); 

    const handleCreateRecipeClick = () => {
        navigate("/recipes/new");
    };

    return (
        <div className="d-grid row-gap-5 b-grids-right h-100">
            <div className="p-2 mt-2">
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleCreateRecipeClick} 
                >
                    + Create recipe
                </button>
            </div>
        </div>
    );
};