import React from "react";
import { useNavigate} from "react-router-dom";
import { useEffect } from "react";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//services
import recipeServices from "../services/recetea_API/recipeServices.js"



export const SearchFilter = () => {
    const navigate = useNavigate()
    const {store, dispatch} = useGlobalReducer();

    const getOneRecipe = async () => recipeServices.getOneRecipe(props.id).then(data=>{
        dispatch({type: 'get_one_recipe', payload:data});
    })

    const handleClick = (e) => {
        navigate("/recipes/" + props.id)
        window.history.scrollRestoration = 'manual'
        getOneRecipe()
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [props.recipe_id]);

    return (
        <nav className="filter-links"> //se quedan vacios a la espera de
            <ul>
                <li>
                    <Link to="/" className="filter-links">
                        <i className="fa-regular fa-user"></i>
                        <span>sin asignar</span>
                    </Link>
                </li>
                <li>
                    <Link to="/" className="filter-links"> 
                        <i className="fa-regular fa-user"></i>
                        <span>sin asignar</span>
                    </Link>
                </li>
            </ul>
            <div className="m-2 recipes_cards_bg border" onClick={handleClick}>
                <div className="card row_bg_suggestions text-white p-3 border-0 position-relative overflow-hidden">
                    <img src={props.url} className="img-fluid card-img recipes_card_img border-0" alt="recipe_img" />
                    <div className="card-img-overlay p-0 d-flex align-items-end">
                        <div className="w-100 bg-opacity-50 text-center title_suggestion_card m-3">
                            <p className="card-title text-light fs-3 p-3">{props.name}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="m-2 recipes_cards_bg border" onClick={handleClick}>
                <div className="card row_bg_suggestions text-white p-3 border-0 position-relative overflow-hidden">
                    <img src={props.url} className="img-fluid card-img recipes_card_img border-0" alt="recipe_img" />
                    <div className="card-img-overlay p-0 d-flex align-items-end">
                        <div className="w-100 bg-opacity-50 text-center title_suggestion_card m-3">
                            <p className="card-title text-light fs-3 p-3">{props.name}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="m-2 recipes_cards_bg border" onClick={handleClick}>
                <div className="card row_bg_suggestions text-white p-3 border-0 position-relative overflow-hidden">
                    <img src={props.url} className="img-fluid card-img recipes_card_img border-0" alt="recipe_img" />
                    <div className="card-img-overlay p-0 d-flex align-items-end">
                        <div className="w-100 bg-opacity-50 text-center title_suggestion_card m-3">
                            <p className="card-title text-light fs-3 p-3">{props.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

    );

};