from app.api import bp
from app.models import Utilisateur
from flask import jsonify, request
from app.api.auth import token_auth
from flask_cors import cross_origin

@bp.route('/utilisateurs2', methods=['GET'])
def get_utilisateurs2():
    return "utilisateurs2"

@bp.route('/utilisateurs/<int:id>', methods=['GET'])
@cross_origin()
@token_auth.login_required
def get_utilisateur(id):
    return jsonify(Utilisateur.query.get_or_404(id).to_dict())

@bp.route('/utilisateurs', methods=['GET'])
@cross_origin()
@token_auth.login_required
def get_utilisateurss():
    page = request.args.get('page', 1, type=int)
    par_page = min(request.args.get('par_page', 10, type=int), 100)
    data = Utilisateur.to_collection_dict(Utilisateur.query, page, par_page, 'api.get_publications')

    return jsonify(data)

@bp.route('/utilisateurs', methods=['POST'])
def creer_utilisateur():
	data = request.json  # Assuming you are sending JSON data in the request
	nom = data.get("Nom")
	courriel = data.get("Courriel")
	password = data.get("Password")

	if courriel is not None:
		u = Utilisateur(nom=nom, courriel=courriel)
	else:
		u = Utilisateur(nom=nom)

	u.enregister_mot_de_passe(password)
	db.session.add(u)
	db.session.commit()
	return "creer"

@bp.route('/utilisateurs/<int:id>', methods=['PUT'])
def modifier_utilisateur(id):
    return "modifier"

@bp.route('/utilisateurs/<int:id>', methods=['DELETE'])
def supprimer_utilisateur(id):
    return "supprimer"
