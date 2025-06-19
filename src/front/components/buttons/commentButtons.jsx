import React, { useEffect, useRef, useState } from "react";

//hooks
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

//services
import commentServices from "../../services/recetea_API/commentServices.js"

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

export const CommentButtons = (props) =>{

    const { store, dispatch } = useGlobalReducer();
    const [style, setStyle] = useState({ display: 'none' });
    const [comment, setComment] = useState({
        content: "",
    });

    // Fetch of the comments by recipe_id
    const getAllComments = async () => commentServices.getCommentsByRecipe(props.recipe_id).then(data => {
        dispatch({ type: 'get_all_comments', payload: data });
    })

    //This will set the edit to false at the same time the display to none
    //Avoid to have active many edit boxes at the same time
    const edit = props.editingCommentId === props.comment_id;
    const setEdit = (bool) => {
        if (bool) {
            props.setEditingCommentId(props.comment_id);
            setStyle({ display: 'none' })
            console.log(props.editingCommentId);
        } else {
            props.setEditingCommentId(null);
        }
    };

    const handleChange = e => {
        setComment({
            ...comment, 
            [e.target.name]: e.target.value
        })
    }

    const handleEdit = async (e) =>{
        e.preventDefault();

        const data = await commentServices.editComment(props.recipe_id, props.comment_id, comment.content)
        
        await getAllComments();

        //is we can POST the comment
        if(data.success){

            dispatch({ type: 'edit_comment', payload: data.data[0] });

            //erases the data to start blank space
            setComment({content: ""});
            setEdit(false)

        }else{
            window.alert(data.error || "Could not post your comment, please try again.")
        }
    }

    const handleDelete = async () =>{

        const data = await commentServices.deleteComment(props.recipe_id, props.comment_id);
        await getAllComments();

        //is we can POST the comment
        if(data.success){

            dispatch({ type: 'delete_comment', payload: data});

        }else{
            window.alert(data.error || "Comment not deleted, please try again.")
        }
    }
    
    useEffect(() => {

        
    }, [props.recipe_id, store.comments]);

    return(
        <>
            {edit ? 
            <div className="col-8 col-sm-9 col-md-10 col-lg-9 border-bottom">
                <h5 className="fs-4">{props.username}</h5>
                <form onSubmit={handleEdit}>
                    <div className="input-group mb-4 text_box rounded">
                        <textarea 
                        className="form-control border-danger rounded"
                        name="content"
                        value={comment.content}
                        onChange={handleChange}
                        onInput={(e) => {
                            e.target.style.height = "auto";
                            //this will set a max-height for input box so it grows but without affectiing layout
                            //has to be in px or we would need to convert rem or % into px with a function
                            e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
                        }} 
                        aria-label="With textarea"></textarea>

                        <button type="submit" 
                        className="btn border-0">
                            <FontAwesomeIcon icon={faPaperPlane}  className="send_btn fs-3" />
                        </button>
                        <button 
                        className="btn fs-6 trash_btn fw-bold border-0" 
                        type="button"
                        onClick={() => setEdit(false)}>
                            CANCEL
                        </button>
                    </div>
                </form>
            </div>
            
            : 
            
            <div className="col-9 col-sm-10 col-md-11 col-lg-10 border-bottom">
                <h5 className="fs-4">{props.username}</h5>
                <div className="input-group mb-4 text_box rounded"
                onMouseEnter={e => setStyle({ display: 'block' })}
                onMouseLeave={e => setStyle({ display: 'none' })}>
                    <p className="fs-5 comment_box my-4 w-75">{props.content}</p>
                    <button 
                    className="btn me-md-2 border-0 me-auto" 
                    style={style}
                    type="button" 
                    onClick={() => { setComment({ content: props.content }); setEdit(true)}}>
                        <FontAwesomeIcon icon={faPenToSquare} className="fs-3 send_btn"/>
                    </button>
                    <button className="btn border-0"
                    style={style} 
                    type="button"
                    onClick={handleDelete}>
                        <FontAwesomeIcon icon={faTrash} className="fs-3 trash_btn"/>
                    </button>
                </div>
            </div>
            }
        </>
    );
}