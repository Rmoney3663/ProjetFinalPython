from app.api import bp
from flask import jsonify
from app import db
from app.api.auth import basic_auth
from app.api.auth import token_auth
from flask_cors import cross_origin
from app.models import Utilisateur

@bp.route('/jeton2', methods=['GET'])
def get_jeton2():
    return "jeton2"

@bp.route('/jeton', methods=['GET'])
@cross_origin()
@basic_auth.login_required
def get_jeton():
    print("get_jeton")
    utilisateur = basic_auth.current_user()  
    # jeton = basic_auth.current_user().get_jeton()
    if utilisateur:
        jeton = utilisateur.get_jeton()
        db.session.commit()
        return jsonify(jeton)
    else:
        return "Utilisateur non trouvé", 404

@bp.route('/jeton', methods=['DELETE'])
@token_auth.login_required
def effacer_jeton():
    token_auth.current_user().revoquer_jeton()
    db.session.commit()
    return '', 204

@bp.route('/jeton_user/<leJeton>', methods=['GET'])
@cross_origin()
@token_auth.login_required
def jeton_user(leJeton):  
    return jsonify(Utilisateur.query.filter_by(jeton=leJeton).first_or_404().to_dict())
