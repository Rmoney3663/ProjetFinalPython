from app.api import bp
from app.models import Utilisateur
from flask import jsonify, render_template, flash, redirect, url_for, request
from app.api.auth import token_auth
from flask_cors import cross_origin
from PIL import Image, ImageDraw, ImageFont
import random
import base64
from io import BytesIO
from app import app, db, socketio

@bp.route('/utilisateurs2', methods=['GET'])
def get_utilisateurs2():
    return "utilisateurs2"

@bp.route('/utilisateurs/<int:id>', methods=['GET'])
@cross_origin()
#@token_auth.login_required
def get_utilisateur(id):
   # return jsonify(Utilisateur.query.get_or_404(id).to_dict())
	utilisateur = Utilisateur.query.get(id)
	if utilisateur is None:
		return "", 404
	return jsonify(utilisateur.to_dict())

@bp.route('/utilisateurs', methods=['GET'])
@cross_origin()
@token_auth.login_required
def get_utilisateurss():
    page = request.args.get('page', 1, type=int)
    par_page = min(request.args.get('par_page', 10, type=int), 100)
    data = Utilisateur.to_collection_dict(Utilisateur.query, page, par_page, 'api.get_publications')

    return jsonify(data)



@bp.route('/utilisateurs', methods=['POST'])
@cross_origin()
def creer_utilisateur():
	print("creer utilisateur")
	try:
		data = request.get_json()  
	except:
		print("Erreur pour Json")
		return "Erreur pour Json", 400
	
	nom = data.get("Nom")
	courriel = data.get("Courriel")
	password = data.get("Password")
	
	existing_user = Utilisateur.query.filter_by(nom=nom).first()
	if existing_user:
		print("Ce nom existe déjà.")
		return "Ce nom existe déjà.", 400

	existing_courriel = Utilisateur.query.filter_by(courriel=courriel).first()
	if existing_courriel:
		print("Ce courriel existe déjà.")
		return "Ce courriel existe déjà.", 400
	
	fnt = ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf', 15)
	image = Image.new('RGB', (128, 128), color='black')
	for i in range(20):
		x = random.randint(0, 128)
		y = random.randint(0, 128)
		r = random.randint(0, 128)
		g = random.randint(0, 128)
		b = random.randint(0, 128)
		h = random.randint(0, 128)
		fnt = ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf', h)
		d = ImageDraw.Draw(image)
		d.text((x, y), nom, font=fnt, fill=(r, g, g))

	tampon = BytesIO()
	image.save(tampon, format="JPEG")

	image_base64 = base64.b64encode(tampon.getvalue()).decode("utf-8")

	utilisateur = Utilisateur(nom=nom, courriel=courriel)

	utilisateur.avatar = "data:image/jpg;base64," + image_base64

	utilisateur.enregister_mot_de_passe(password)

	db.session.add(utilisateur)
	db.session.commit()

	return "",204

@bp.route('/suivre/<int:id>', methods=['GET'])
@cross_origin()
@token_auth.login_required
def suivre(id):
	current_user = token_auth.current_user()
	utilisateur = Utilisateur.query.filter_by(id=id).first()
	current_user.devenir_partisan(utilisateur)
	db.session.commit()	
	socketio.emit('actualiser', {'bidon': "vide" }, namespace='/chat')
	return "",204

@bp.route('/ne_plus_suivre/<int:id>', methods=['GET'])
@cross_origin()
@token_auth.login_required
def nosuivre(id):
	current_user = token_auth.current_user()
	utilisateur = Utilisateur.query.filter_by(id=id).first()
	current_user.ne_plus_etre_partisan(utilisateur)
	db.session.commit()
	socketio.emit('actualiser', {'bidon': "vide" }, namespace='/chat')
	return "",204

@bp.route('/utilisateurs/<int:id>', methods=['PUT'])
@cross_origin()
@token_auth.login_required
def modifier_utilisateur(id):
	current_user = token_auth.current_user()
	try:
		data = request.get_json()  
	except:
		print("Erreur pour Json")
		return "Erreur pour Json", 400
	
	nom = data.get("nom")
	a_propos_de_moi = data.get("propos")

	current_user.nom= nom
	current_user.a_propos_de_moi = a_propos_de_moi
	db.session.commit()	
	return "",204

@bp.route('/utilisateurs/<int:id>', methods=['DELETE'])
def supprimer_utilisateur(id):
    return "supprimer"
