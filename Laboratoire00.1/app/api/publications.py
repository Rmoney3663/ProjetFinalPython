from app.api import bp
from app.models import Publication
from flask import jsonify
from flask import request 
from app.api.auth import token_auth
from flask_cors import cross_origin

@bp.route('/publications2', methods=['GET'])
def get_publications2():
    return "publications2"

@bp.route('/publications/<int:id>', methods=['GET'])
@token_auth.login_required
def get_publication(id):
    return jsonify(Publication.query.get_or_404(id).to_dict())

@bp.route('/publications', methods=['GET'])
@cross_origin()
@token_auth.login_required
def get_publications():
    page = request.args.get('page', 1, type=int)
    par_page = min(request.args.get('par_page', 10, type=int), 100)
    data = Publication.to_collection_dict(Publication.query, page, par_page, 'api.get_publications')

    return jsonify(data)

@bp.route('/publications', methods=['POST'])
def creer_publication():
    return "creer"

@bp.route('/publications/<int:id>', methods=['PUT'])
def modifier_publication(id):
    return "modifier"

@bp.route('/publications/<int:id>', methods=['DELETE'])
def supprimer_publication(id):
    return "supprimer"