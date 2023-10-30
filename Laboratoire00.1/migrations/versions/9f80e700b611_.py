"""empty message

Revision ID: 9f80e700b611
Revises: 54ede05ee80a
Create Date: 2023-09-18 14:45:29.105235

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9f80e700b611'
down_revision = '54ede05ee80a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('utilisateur',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nom', sa.String(length=64), nullable=True),
    sa.Column('courriel', sa.String(length=120), nullable=True),
    sa.Column('mot_de_passe_hash', sa.String(length=128), nullable=True),
    sa.Column('avatar', sa.Text(length=131072), nullable=True),
    sa.Column('a_propos_de_moi', sa.String(length=140), nullable=True),
    sa.Column('dernier_acces', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('utilisateur', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_utilisateur_courriel'), ['courriel'], unique=True)
        batch_op.create_index(batch_op.f('ix_utilisateur_nom'), ['nom'], unique=True)

    op.create_table('partisans',
    sa.Column('partisan_id', sa.Integer(), nullable=True),
    sa.Column('utilisateur_qui_est_suivi_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['partisan_id'], ['utilisateur.id'], ),
    sa.ForeignKeyConstraint(['utilisateur_qui_est_suivi_id'], ['utilisateur.id'], )
    )
    op.create_table('publication',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('corps', sa.String(length=140), nullable=True),
    sa.Column('horodatage', sa.DateTime(), nullable=True),
    sa.Column('utilisateur_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['utilisateur_id'], ['utilisateur.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('publication', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_publication_horodatage'), ['horodatage'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('publication', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_publication_horodatage'))

    op.drop_table('publication')
    op.drop_table('partisans')
    with op.batch_alter_table('utilisateur', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_utilisateur_nom'))
        batch_op.drop_index(batch_op.f('ix_utilisateur_courriel'))

    op.drop_table('utilisateur')
    # ### end Alembic commands ###
