"""empty message

Revision ID: ef853778ce93
Revises: 0d4b9f329fa4
Create Date: 2023-10-02 09:54:54.869152

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ef853778ce93'
down_revision = '0d4b9f329fa4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('utilisateur', schema=None) as batch_op:
        batch_op.add_column(sa.Column('jeton', sa.String(length=32), nullable=True))
        batch_op.add_column(sa.Column('jeton_expiration', sa.DateTime(), nullable=True))
        batch_op.create_index(batch_op.f('ix_utilisateur_jeton'), ['jeton'], unique=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('utilisateur', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_utilisateur_jeton'))
        batch_op.drop_column('jeton_expiration')
        batch_op.drop_column('jeton')

    # ### end Alembic commands ###
