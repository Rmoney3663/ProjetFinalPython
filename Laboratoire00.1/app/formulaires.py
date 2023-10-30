from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField
from wtforms.validators import DataRequired, ValidationError, DataRequired,Email,EqualTo, Length
from app.models import Utilisateur



class LoginForm(FlaskForm):
    nom = StringField('Username', validators=[DataRequired(message="Nom est un champ obligatoire")])
    mot_de_passe = PasswordField('Password', validators=[DataRequired(message="Mode de passe est un champ obligatoire")])
    se_souvenir_de_moi = BooleanField('Remember Me')
    soumettre = SubmitField('Sign In')

class FormulaireEnregistrement(FlaskForm):
    nom = StringField('Username', validators=[DataRequired()])
    courriel = StringField('Courriel', validators=[DataRequired(), Email()])
    mot_de_passe = PasswordField('Password', validators=[DataRequired()])
    mot_de_passe2 = PasswordField('Password (retype password)', validators=[DataRequired(), EqualTo('mot_de_passe')])
    soumettre = SubmitField('Sign In')

    def validate_nom(self, nom):
        utilisateur = Utilisateur.query.filter_by(nom=nom.data).first()
        if utilisateur is not None:
            raise ValidationError("Ce nom existe déjà.")

    def validate_courriel(self, courriel):
        utilisateur = Utilisateur.query.filter_by(courriel=courriel.data).first()
        if utilisateur is not None:
            raise ValidationError("Ce courriel existe déjà.")

class FormulaireEditerProfil(FlaskForm):
    nom = StringField('Nom', validators=[DataRequired()])
    a_propos_de_moi= TextAreaField('A propos de moi', validators=[Length(min=0,max=140)])
    soumettre = SubmitField('Soumettre')

    def __init__(self, nom_original, *args, **kwargs):
        super(FormulaireEditerProfil, self).__init__(*args, **kwargs)
        self.nom_original = nom_original

    def validate_nom(self, nom):
        if nom.data != self.nom_original:
            utilisateur = Utilisateur.query.filter_by(nom=self.nom.data).first()
            if utilisateur is not None:
                raise ValidationError('Ce nom existe déjà dans la base de données.')

class FormulaireVide(FlaskForm):
    soumettre = SubmitField('Enregistrer')

class FormulairePublication(FlaskForm):
    publication = TextAreaField('Dite quelque chose...', validators=[
        DataRequired(), Length(min=1, max=140)])
    soumettre = SubmitField('Soumettre')


