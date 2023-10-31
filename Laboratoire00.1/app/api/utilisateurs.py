from app.api import bp
from app.models import Utilisateur
from flask import jsonify, request
from app.api.auth import token_auth
from flask_cors import cross_origin
from PIL import Image, ImageDraw, ImageFont
import random
import base64
from io import BytesIO
from app import db

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

@bp.route('/utilisateurs/<int:id>', methods=['PUT'])
def modifier_utilisateur(id):
    return "modifier"

@bp.route('/utilisateurs/<int:id>', methods=['DELETE'])
def supprimer_utilisateur(id):
    return "supprimer"
