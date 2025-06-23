"""empty message

Revision ID: 200e236f4966
Revises: 
Create Date: 2025-06-21 22:07:00.979428

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '200e236f4966'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Usa directamente el tipo existente 'mealtype' (no lo vuelvas a declarar como nuevo)
    op.create_table(
        'meal_plan_entries',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('recipe_id', sa.Integer(), nullable=False),
        sa.Column('meal_type', postgresql.ENUM(
            'BREAKFAST', 'MORNING_SNACK', 'BRUNCH', 'LUNCH',
            'AFTERNOON_SNACK', 'DINNER', 'SUPPER', 'SNACK',
            'PRE_WORKOUT', 'POST_WORKOUT', 'OTHER',
            name='mealtype', create_type=False  # <- evita recrear el ENUM
        ), nullable=False),
        sa.Column('date', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('meal_plan_entries')
    # No eliminamos el tipo ENUM porque puede estar en uso
