import React, { useEffect, useState } from "react";

//services
import dietServices from "../services/Puter-AI/aiDietService.js"

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const DietLabel = (props) => {

    const { store, dispatch } = useGlobalReducer();

    const [ingredients, setIngredients] = useState(store.recipe?.ingredients);
    const [diet, setDiet] = useState("");

    const handleSubmit = async () => {
        const ingredientsText = ingredients.map(
            i => `${i.quantity} ${i.unit} ${i.name}`
        );
        const label = await dietServices.classifyDiet(ingredientsText);
        setDiet(label);
    };

    useEffect(() => {
        // Only run once when store.recipe is ready
        if (store?.recipe?.ingredients) {
            setIngredients(store.recipe.ingredients);
            handleSubmit()
        }
    }, [store.recipe]);

    return (
        <div>
            <p>Diet label: {diet}</p>
        </div>
    );
}