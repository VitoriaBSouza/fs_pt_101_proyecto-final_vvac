"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Recipe, Ingredient, Comment, Media, UserStatus, Collection
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select, delete
from datetime import datetime, timezone
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# From here starts all user related endpoints
# GET method for all users (use for test, comment it out after)
@api.route('/users', methods=['GET'])
def get_users():

    statement = select(User)

    users = db.session.execute(statement).scalars().all()

    return jsonify([user.serialize() for user in users]), 200

# POST to create a new user
@api.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json

        if not data["email"] or not data["password"] or not data["username"]: 
            return jsonify({"error": "Missing required information"}), 400
        
        #Check if user is registered
        stm = select(User).where(User.email==data["email"])
        user = db.session.execute(stm).scalar_one_or_none()

        if user:
            return jsonify({"error": "This email is already registered, please log in"}), 409
        
        #hash password to not show to others
        hashed_password = generate_password_hash(data["password"])

        new_user = User(
            username=data["username"],
            email=data["email"],
            password=hashed_password,
            status= UserStatus.active, #Default status
            created_at=datetime.now(timezone.utc),
            #we will update this field on PUT method, created_at remains the same
            updated_at=datetime.now(timezone.utc)
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"success": True}), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# POST to make authentication to log in
@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.json

        if not data["email"] or not data["password"]: 
            return jsonify({"error": "Missing required information"}), 400
        
        #Check if the user has an account
        stmt = select(User).where(User.email==data["email"])
        user = db.session.execute(stmt).scalar_one_or_none()

        if user is None:
            return jsonify({"error": "User not found, please sign up"}), 405
        
        #Check if the password matches the user
        if not check_password_hash(user.password, data["password"]):
            return jsonify({"error": "Email or password not valid"}), 401

       #Generate str token as it's not possible to be a number
        token = create_access_token(identity=str(user.id))
  

        return jsonify({"success": True, "token": token}), 200
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


# GET to access the profile after logging in
@api.route('/user', methods=['GET'])
@jwt_required() # Obliga a enviar el token desde el front
def get_user_profile():

    id = get_jwt_identity()
    stm = select(User).where(User.id == id)
    user = db.session.execute(stm).scalar_one_or_none()
    
    if not user:
        return jsonify({"success": False, 'msg': 'Something went wrong, try again.'})

    return jsonify({"success": True, 'user':user.serialize()})

#DELETE user account (we keep recipes posted and soft delete the user personal data and comments)
@api.route("/user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    stmt = select(User).where(User.id == user_id)
    user = db.session.execute(stmt).scalar_one_or_none()
    if user is None:
        return jsonify({"error": "User not found"}), 404

    # Anonymize personal data but keep the recipes on the dabase.
    user.username = f"deleted_user_{user_id}"  # or set to a placeholder like "Deleted User"
    user.email =  f"deleted_user_{user_id}@example.com" # or set to a placeholder
    user.password = generate_password_hash("User{user_id}NoLongerExists")
    user.status = UserStatus.deleted  # Optionally mark as deleted
    user.updated_at = datetime.now(timezone.utc)

    # We also delete the comments and fav list.
    delete_comment = delete(Comment).where(Comment.user_id == user_id)
    delete_collection = delete(Collection).where(Collection.user_id == user_id)
    db.session.execute(delete_comment, delete_collection)

    db.session.commit()

    return jsonify({"message": "You account has been successfully erased"}), 200

@api.route("/user/<int:user_id>", methods=["PUT"]) #ruta dinamica para decir el id del registro a modificar
def update_user(user_id):

    data = request.get_json()

    stmt = select(User).where(User.id == user_id)
    user = db.session.execute(stmt).scalar_one_or_none()

    if user is None:
        return jsonify({"error": "User not found"}), 404
   
   # The update does not requiere to add all fields on the body, just what you need to change
   # Sistem will not allow same email or username
    user.email = data.get("email", user.email)
    user.password = data.get("password", user.password)
    user.username = data.get("username", user.username)
    user.updated_at = datetime.now(timezone.utc)
    
    db.session.commit()
    return jsonify(user.serialize()), 200

#End of user endpoints

#From here all recipe related endpoints





# From here all comments related endpoints

# GET all comments

@app.route('/comments', methods=['GET'])
def get_all_comments():
    comments = Comment.query.all()
    return jsonify([comment.serialize() for comment in comments]), 200

# GET comment by ID

@app.route('/comments/<int:comment_id>', methods=['GET'])
def get_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if comment is None:
        return jsonify({"error": "Comment not found"}), 404
    return jsonify(comment.serialize()), 200


#POST new comment

@app.route('/comments', methods=['POST'])
def create_comment():
    data = request.get_json()

    if not all(key in data for key in ("user_id", "recipe_id", "content")):
        return jsonify({"error": "Missing data"}), 400

    new_comment = Comment(
        user_id=data["user_id"],
        recipe_id=data["recipe_id"],
        content=data["content"]
    )

    db.session.add(new_comment)
    db.session.commit()

    return jsonify(new_comment.serialize()), 201

#PUT(edit) existing comment

@app.route('/comments/<int:comment_id>', methods=['PUT'])
def update_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if comment is None:
        return jsonify({"error": "Comment not found"}), 404

    data = request.get_json()
    if "content" in data:
        comment.content = data["content"]

    db.session.commit()
    return jsonify(comment.serialize()), 200


#DELETE a comment

@app.route('/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if comment is None:
        return jsonify({"error": "Comment not found"}), 404

    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message": "Comment deleted"}), 200


# end of comment endpoints