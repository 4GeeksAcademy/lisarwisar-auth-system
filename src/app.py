"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
import datetime
from datetime import timedelta
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_bcrypt import Bcrypt 


# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False


# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = "ULTRA_SECRET_PASSWORD"
app.config["SECRET_KEY"] = "SECRET_WORD"
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

@app.route("/login", methods=["POST"])
def login():
    login_email = request.json.get("email")
    password = request.json.get("password")
    user = User.query.filter_by(email=login_email).first()
  

    if user is not None:
        if bcrypt.check_password_hash(user.password, password):
            expire = datetime.timedelta(days=3)
            token = create_access_token(identity = user.id, expires_delta=expire)

            return jsonify({
                "token": token,
                "status": "success",
                "user" : user.serialize(),
                "msg":"Login accepted"
            }) , 201
        else:
            return jsonify({
            "msg":"Invalid email or password"
        }), 401
    else:
        return jsonify({
        "msg":"Invalid email or password"
    }), 401

@app.route("/signup", methods=["POST"])
def register():
  register_email = request.json.get("email")
  usuario = User()
  existing_user = User.query.filter_by(email=register_email).first()
  if existing_user is not None:
    return jsonify({
      "msg":"User already exists"
    })
  else:
    usuario.email = request.json.get("email")
    password = request.json.get("password")
    #crypt password 
    passwordHash = bcrypt.generate_password_hash(password)
    usuario.password = passwordHash

    db.session.add(usuario)
    db.session.commit()

  return jsonify({
    "msg":"User created",
    "data": "done"
  }) , 201


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
