import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useMemo, useState } from "react";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//services
import commentServices from "../services/recetea_API/commentServices.js"

export const Comments = (props) => {

    const { store, dispatch } = useGlobalReducer();
    const [comment, setComment] = useState({
        content: "",
    })

    // Fetch of the comments by recipe_id
    const getAllComments = async () => commentServices.getCommentsByRecipe(props.recipe_id).then(data => {
        dispatch({ type: 'get_all_comments', payload: data });
    })

    function getRandomColor() {
        return Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    function getBrightness(hexColor) {
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        return (299 * r + 587 * g + 114 * b) / 1000;
    }

    const randomColor = useMemo(() => getRandomColor(), []);

    //Just like recipe page we will set the random placehold image to have
    //the first letter of user + random background. We will map outside so it applies to each comment
    //we also set to make the color of the letter change depending on the brightness
    const loadComments = (comment) => {

        const brightness = getBrightness(randomColor);

        //check bringhtness to stablish the letter color
        const textColor = brightness < 125 ? 'fff' : '000';

        const firstLetter = comment.username?.charAt(0).toUpperCase() || "R";
        const placeHolderImage = `https://ui-avatars.com/api/?name=${firstLetter}&background=${randomColor}&color=${textColor}`;

        return (
            <div className="row mb-4 ms-4 p-4" key={comment.id}>

                <div className="col-3 col-sm-2 col-md-1 col-lg-1 mt-1 me-1
                g-0 my-sm-1 d-flex justify-content-start">
                    <img
                    src={comment.user_photo || placeHolderImage}
                    className="float-start comment_img bg-info border-0"
                    alt={comment.user_id}
                    />
                </div>

                <div className="col-8 col-sm-9 col-md-10 col-lg-9 border-bottom">
                    <h5 className="fs-4">{comment.username}</h5>
                    {
                        store.user?.token ? 
                        "Add here post coment option, below that dive has to be the <p> with comments from other users"
                        :
                        // if not logged can only see other users comments
                        <p className="fs-5 comment_box my-4">{comment.content}</p>
                    }
                </div>
            </div>
        );
    };    

    useEffect(() => {

        getAllComments()

    }, [props.recipe_id]);

    return(
        <div className="row comment_row">
            <h2 className="m-4">Comments</h2>
           {Array.isArray(store.comments) && store.comments.length > 0
            ? store.comments.map(loadComments)
            : 
            <h5 className="m-4">Be the first to comment on this recipe!</h5>
            }
        </div>
    );
}