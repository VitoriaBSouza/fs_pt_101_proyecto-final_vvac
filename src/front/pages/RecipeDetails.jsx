import { useNavigate, useParams} from "react-router-dom";
import { useEffect} from "react";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//services
import recipeServices from "../services/recetea_API/recipeServices.js"

export const RecipeCard = () => {

    const navigate = useNavigate()
    const {store, dispatch} = useGlobalReducer();
    
    const { id } = useParams();
    const title = store.recipes?.title;
    const steps = store.recipes?.steps;
    const username = store.recipes?.username;

    // const getOneRecipe = async (recipe_id) => {

    //     const data = await recipeServices.getOneRecipe(recipe_id);

    //     if (data.success){ 
    //         dispatch({type: 'get_one_recipe', payload: data})
    //     } else{
    //         window.alert(data.error);
    //         navigate('/');
    //     }
    // }

    const getOneRecipe = async () => recipeServices.getOneRecipe(id).then(data=>{
        dispatch({type: 'get_one_recipe', payload:data});
    })

    useEffect(() => {
        getOneRecipe();
    }, []);

    return(
        <div className="container-fluid recipe_card_bg1 mx-auto">
            
            <div className="row recipe_card_bg2 my-4 p-4 mt-4">
                <div className="col-6 d-flex mt-2">
                    <div className="card bg-dark text-white">
                        <img src="https://picsum.photos/450/350?random=1" className="card-img" alt="image"/>
                        <div className="card-img-overlay">
                            <button type="button" className="btn btn-info m-2 position-absolute bottom-0 end-0">INCONO LIKE</button>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="row p-2">
                        <div className="col-12">
                            <h1 className="bg-info">{title}</h1>
                        </div>
                    </div>
                    <div className="border-top my-4"></div>
                    <div className="row p-2">
                        <div className="col-12 d-flex">
                            <div className="bg-warning">
                                USER FOTO
                            </div>
                            <div className="ms-4 bg-danger">
                                {username}
                            </div>
                        </div>
                    </div>
                    <div className="row p-2 recipe_card_prep my-4">
                        <div className="col-6 col-md-3 bg-success">
                            PREP TIME
                        </div>
                        <div className="col-6 col-md-3 bg-info">
                            DIFFICULTY LEVEL
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-12 d-flex">
                            <div className="bg-danger">ICONO1</div>
                            <div className="ms-2 bg-warning">ICONO2</div>
                            <div className="ms-2 bg-secondary">ICONO3</div>
                            <div className=" ms-2 bg-primary">ICONO4</div>
                        </div>
                    </div>

                    <div className="border-bottom my-2"></div>
                    <div className="col-12">
                        <h6 className="text-end">Published on:</h6>
                    </div>
                </div>
            </div>
            <div className="row py-2">

                <div className="col-12 col-md-5 ingredients_bg">
                    <div className="row p-3">

                        <div className="col-12">
                            <h3>
                                Ingredients
                            </h3>
                        </div>

                        <div className="col-12 d-flex my-2">
                            
                            <div className="row">
                                <div className="col-6 d-flex">
                                    <div>ICON</div>

                                    <p className="me-4 text_ing1">
                                        {store.recipes?.portions} portion
                                    </p>
                                </div>

                                <div className="col-6">
                                    <p className="text-end">
                                        Total grams: <span className="text_ing1">{store.recipes?.total_grams}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                            
                        <div className="col-12">
                            <ul>
                                {store.recipes?.ingredients?.map((ing, i) => (
                                    <li key={i} className="m-0 d-flex">
                                        <span className="text_ing1 me-1" >{ing.quantity} {ing.unit}</span>
                                        <p style={{textTransform: 'capitalize'}}>{ing.ingredient_name}</p>
                                    </li>
                                ))}
                            </ul>
                        </div> 
                    </div>

                </div>
                <div className="col-12 col-md-7 p-4 steps_bg g-0">
                    <h3>Steps</h3>
                    <ul className="list-group list-group-flush">
                         {(store.recipes?.steps?.match(/"([^"]+)"/g) || []).map((step, i) => (
                            <li key={i} className="list-group-item steps_bg mb-2 text_steps">{step.replace(/"/g, '')}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div>
                COMMENTS WILL BE ANOTHER COMPONENT
            </div>
            <div>
                Sugerencias
            </div>

        </div>
    );
}