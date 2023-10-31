from flask import render_template, flash, redirect, url_for, request
from app import app, db, socketio
from app.formulaires import LoginForm, FormulaireEnregistrement, FormulaireEditerProfil, FormulaireVide, FormulairePublication
from flask_login import current_user, login_user, logout_user, login_required
from app.models import Utilisateur, Publication
from werkzeug.urls import url_parse
from PIL import Image, ImageDraw, ImageFont
import random
import base64
from io import BytesIO
from datetime import datetime


@app.before_request
def before_request():
    if current_user.is_authenticated:
        current_user.dernier_acces = datetime.utcnow()
        db.session.commit()


@app.route('/websocket')
def websocket():
    print ("websocket")
    return render_template('websocket.html')

@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
@login_required
def index():    
    formulaire = FormulairePublication()
    if formulaire.validate_on_submit():
        publication = Publication(corps=formulaire.publication.data, auteur=current_user)
        db.session.add(publication)
        db.session.commit()
        #socketio.emit('nouveau_message', {'msg':'NOUVEAU-MESSAGE' }, room='1', namespace='/chat')
        id= publication.id
        socketio.emit('nouvelle_publication', {'id':id }, namespace='/chat')
        flash('Votre publication est en ligne!')
        return redirect(url_for('index'))

    utilisateur = current_user
    page = request.args.get('page',1, type = int)
    publications = current_user.liste_publications_dont_je_suis_partisan().paginate(
        page=page, per_page = app.config['PUBLICATIONS_PAR_PAGE'], error_out = False)  

    suivant = url_for('index', page = publications.next_num) \
        if publications.has_next else None
    precedent = url_for('index', page = publications.prev_num) \
        if publications.has_prev else None

    return render_template('index.html', titre='Accueil', suivant=suivant, precedent=precedent, utilisateur=utilisateur, publications=publications.items, formulaire=formulaire )

@app.route('/explorer')
@login_required
def explorer():
    page = request.args.get('page',1, type = int)
    publications = Publication.query.order_by(Publication.horodatage.desc()).paginate(
        page=page, per_page = app.config['PUBLICATIONS_PAR_PAGE'], error_out = False)

    suivant = url_for('index', page = publications.next_num) \
        if publications.has_next else None
    precedent = url_for('index', page = publications.prev_num) \
        if publications.has_prev else None
    return render_template('index.html', titre='Explorer', suivant=suivant, precedent=precedent, publications=publications.items)


@app.route('/utilisateur/<nom>')
@login_required
def utilisateur(nom):
    utilisateur = Utilisateur.query.filter_by(nom=nom).first_or_404()
    page = request.args.get('page',1, type = int)

    publications = utilisateur.publications.paginate(
        page=page, per_page = app.config['PUBLICATIONS_PAR_PAGE'], error_out = False)  

    suivant = url_for('utilisateur', nom = utilisateur.nom, page = publications.next_num) \
        if publications.has_next else None
    precedent = url_for('utilisateur', nom = utilisateur.nom, page = publications.prev_num) \
        if publications.has_prev else None
    
    formulaire = FormulaireVide()

    return render_template('utilisateur.html', utilisateur=utilisateur, suivant=suivant, precedent=precedent, publications=publications.items, formulaire=formulaire)

@app.route('/enregistrer', methods=['GET', 'POST'])
def enregistrer():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    formulaire = FormulaireEnregistrement()
    if formulaire.validate_on_submit():
        utilisateur = Utilisateur(nom=formulaire.nom.data, courriel=formulaire.courriel.data)
        utilisateur.enregister_mot_de_passe(formulaire.mot_de_passe.data)
        fnt = ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf', 15)
        image = Image.new('RGB', (128,128), color='black')
        for i in range(20):
            x = random.randint(0, 128)
            y = random.randint(0, 128)
            r = random.randint(0, 128)
            g = random.randint(0, 128)
            b = random.randint(0, 128)
            h = random.randint(0, 128)
            fnt = ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf', h)
            d = ImageDraw.Draw(image)
            d.text((x,y), utilisateur.nom, font=fnt, fill=(r,g,g))
        
        tampon = BytesIO()
        image.save(tampon, format="JPEG")
    # "data:image/jpg;base64,"
        image_base64 = base64.b64encode(tampon.getvalue()).decode("utf-8")
        utilisateur.avatar = "data:image/jpg;base64," + image_base64
        print ("data:image/jpg;base64," + image_base64)

        db.session.add(utilisateur)
        db.session.commit()
        flash('Félicitations, vous êtes maintenant enregistrer!')
        return redirect(url_for('etablir_session'))
    return render_template('enregistrement.html', title='Enregistrer', formulaire=formulaire)

 
@app.route('/etablir_session', methods=['GET', 'POST'])
def etablir_session():
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    formulaire = LoginForm()
    if formulaire.validate_on_submit():
        utilisateur = Utilisateur.query.filter_by(nom=formulaire.nom.data).first()
        if utilisateur is None or not utilisateur.valider_mot_de_passe(formulaire.mot_de_passe.data):
            flash('Nom utilisateur ou mot de passe invalide(s)')
            return redirect(url_for('etablir_session'))
        login_user(utilisateur, remember=formulaire.se_souvenir_de_moi.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            return redirect(url_for('index'))
        return redirect(next_page)    
    return render_template('etablir_session.html', titre='Etablir une session', formulaire=formulaire)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/editer_profil', methods=['GET', 'POST'])
@login_required
def editer_profil():
    formulaire = FormulaireEditerProfil(current_user.nom)
    if formulaire.validate_on_submit():
        current_user.nom= formulaire.nom.data
        current_user.a_propos_de_moi = formulaire.a_propos_de_moi.data
        db.session.commit()
        flash('Vos modifications on été sauvegardées.')
        return redirect(url_for('editer_profil'))
    elif request.method == 'GET':
        formulaire.nom.data = current_user.nom
        formulaire.a_propos_de_moi.data = current_user.a_propos_de_moi
    return render_template('editer_profil.html', title='Editer Profil', formulaire=formulaire)


@app.route('/suivre/<nom>', methods=['POST'])
@login_required 
def suivre(nom):
    formulaire = FormulaireVide()
    if formulaire.validate_on_submit():
        utilisateur = Utilisateur.query.filter_by(nom=nom).first()
        if utilisateur is None:
            flash('Utilisateur {} n\'existe pas.'.format(nom))
            return redirect(url_for('index'))
        if utilisateur == current_user:
            flash('Vous ne pouvez pas suivre vous-même!')
            return redirect(url_for('utilisateur', nom=nom))
        current_user.devenir_partisan(utilisateur)
        db.session.commit()
        socketio.emit('actualiser', {'bidon': "vide" }, namespace='/chat')
        flash('Vous suivez maintenant {}!'.format(nom))
        return redirect(url_for('utilisateur', nom=nom))
    else:
        return redirect(url_for('index'))


@app.route('/ne_plus_suivre/<nom>', methods=['POST'])
@login_required
def ne_plus_suivre(nom):
    formulaire = FormulaireVide()
    if formulaire.validate_on_submit():
        utilisateur = Utilisateur.query.filter_by(nom=nom).first()
        if utilisateur is None:
            flash('Utilisateur {} n\'existe pas.'.format(nom))
            return redirect(url_for('index'))
        if utilisateur == current_user:
            flash('Vous ne pouvez pas ne plus vous suivre!')
            return redirect(url_for('utilisateur', nom=nom))
        current_user.ne_plus_etre_partisan(utilisateur)
        db.session.commit()
        socketio.emit('actualiser', {'bidon':'vide'}, namespace='/chat')
        flash('Vous ne suivez plus {}.'.format(nom))
        return redirect(url_for('utilisateur', nom=nom))
    else:
        return redirect(url_for('index'))

