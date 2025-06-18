import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useMemo, useState } from "react";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//services
import commentServices from "../services/recetea_API/commentServices.js"

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

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

        

        return (
            <div className="row mb-4 ms-4 p-4" key={comment.id}>

                <div className="col-3 col-sm-2 col-md-1 col-lg-1 mt-1
                g-0 my-sm-1 d-flex justify-content-start">
                    <img
                    src={comment.user_photo || placeHolderImage}
                    className="float-start comment_img bg-info border-0 mt-1"
                    alt={comment.user_id}
                    />
                </div>
                
                {/* All the other comments */}
                <div className="col-8 col-sm-9 col-md-10 col-lg-9 border-bottom">
                    <h5 className="fs-4">{comment.username}</h5>
                    <p className="fs-5 comment_box my-4">{comment.content}</p>
                </div>
            </div>
        );
    };    

    useEffect(() => {

        getAllComments()

    }, [props.recipe_id]);

    return(
        <div className="row comment_row p-4">
            <h2 className="m-4">Comments</h2>

            <div className="row mb-4 ms-4 p-4">
                <div className="col-3 col-sm-2 col-md-1 col-lg-1 mt-1
                g-0 my-sm-1 d-flex justify-content-start">
                    <img
                    src={store.user?.photo_url}
                    className="float-start comment_img border-0 mt-1"
                    alt={store.user?.id}
                    />
                </div>

                <div className="col-8 col-sm-9 col-md-10 col-lg-9 border-bottom">
                    <h5 className="fs-4">{store.user?.username}</h5>
                    {
                        // We set the textarea to frow but has a max.height so it's easier to see our comments
                        store.user?.id ? 
                        <div className="input-group mb-4 text_box rounded">
                            <textarea 
                            className="form-control border-danger rounded"
                            onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
                            }} 
                            aria-label="With textarea"></textarea>

                            <button type="submit" className="btn border-0">
                                <FontAwesomeIcon icon={faPaperPlane}  className="send_btn fs-3 m-3" />
                            </button>
                        </div>
                        :
                        // if not logged can only see other users comments
                        null
                    }
                </div>
            </div>
           <div className={store.comments?.length >= 6 ? "row overflow-auto comment_overflow" : "row comment_overflow"}>
                {/* Will only map if array has comments */}
                {Array.isArray(store.comments) && store.comments.length > 0
                ? store.comments.map(loadComments)
                : 
                // Will return a phrase if empty
                <h5 className="m-4">Be the first to comment on this recipe!</h5>
                }
           </div>
        </div>
    );
}