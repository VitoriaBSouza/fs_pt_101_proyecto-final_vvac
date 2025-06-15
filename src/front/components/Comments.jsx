import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef } from "react";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//services
import commentServices from "../services/recetea_API/commentServices.js"

export const Comments = (props) => {

    const { store, dispatch } = useGlobalReducer();

    // Fetch of the comments by recipe_id
    const getAllComments = async () => commentServices.getCommentsByRecipe(props.recipe_id).then(data => {
        dispatch({ type: 'get_all_comments', payload: data });
    })

    const placeHolderImg = store.comments.map((comment) => {
        const firstLetter = comment.username?.charAt(0).toUpperCase() || "R";
        const placeHolderImage = `https://ui-avatars.com/api/?name=${firstLetter}&background=random&color=fff`;

        return (
            <div className="row mb-4 ms-4" key={comment.id}>
                <div className="col-3 col-sm-2 col-md-1 col-lg-1 mt-1 me-1
                                g-0 my-sm-1 d-flex justify-content-start">
                    <img
                    src={comment.user_photo || placeHolderImage}
                    className="float-start comment_img bg-info"
                    alt={comment.user_id}
                    />
                </div>
                <div className="col-8 col-sm-9 col-md-10 col-lg-9 border-bottom">
                    <h5 className="fs-4">{comment.username}</h5>
                    {store.user?.user_id === comment.user_id ? (
                    <div className="input-group border rounded comment_box">
                        <textarea className="form-control" aria-label="With textarea">
                        {comment.content}
                        </textarea>
                    </div>
                    ) : (
                    <p className="fs-5 comment_box my-4">{comment.content}</p>
                    )}
                </div>
            </div>
        );
    });    

    useEffect(() => {

        getAllComments()

    }, [props.recipe_id]);

    return(
        <div className="row comment_row">
            <h2 className="m-4">Comments</h2>
            {placeHolderImg}
        </div>
    );
}