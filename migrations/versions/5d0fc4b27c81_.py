"""empty message

Revision ID: 5d0fc4b27c81
Revises: 
Create Date: 2025-06-25 11:58:52.422306

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5d0fc4b27c81'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('ingredients',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('allergens', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=30), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('photo_url', sa.String(), nullable=True),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('status', sa.Enum('active', 'suspended', 'deleted', name='userstatus'), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('recipes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('author', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=100), nullable=False),
    sa.Column('difficulty_type', sa.Enum('EASY', 'MODERATE', 'HARD', name='difficultytype'), nullable=False),
    sa.Column('portions', sa.Integer(), nullable=False),
    sa.Column('total_grams', sa.Float(), nullable=True),
    sa.Column('prep_time', sa.Integer(), nullable=True),
    sa.Column('steps', sa.Text(), nullable=False),
    sa.Column('published', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('diet_label', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['author'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('shopping_list_items',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('ingredient_name', sa.String(length=255), nullable=False),
    sa.Column('total_quantity', sa.Float(), nullable=False),
    sa.Column('unit', sa.String(length=50), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('collections',
    sa.Column('recipe_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('recipe_id', 'user_id')
    )
    op.create_table('comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('recipe_id', sa.Integer(), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('published', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('meal_plan_entries',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('recipe_id', sa.Integer(), nullable=False),
    sa.Column('meal_type', sa.Enum('BREAKFAST', 'MORNING_SNACK', 'BRUNCH', 'LUNCH', 'AFTERNOON_SNACK', 'DINNER', 'SUPPER', 'SNACK', 'PRE_WORKOUT', 'POST_WORKOUT', 'OTHER', name='mealtype'), nullable=False),
    sa.Column('date', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('medias',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('recipe_id', sa.Integer(), nullable=False),
    sa.Column('type_media', sa.Enum('IMAGE', name='mediatype'), nullable=False),
    sa.Column('url', sa.Text(), nullable=False),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('recipe_ingredients',
    sa.Column('recipe_id', sa.Integer(), nullable=False),
    sa.Column('ingredient_id', sa.Integer(), nullable=False),
    sa.Column('quantity', sa.Float(), nullable=False),
    sa.Column('unit', sa.String(length=50), nullable=False),
    sa.Column('calories', sa.Float(), nullable=False),
    sa.Column('fat', sa.Float(), nullable=False),
    sa.Column('saturated_fat', sa.Float(), nullable=False),
    sa.Column('carbs', sa.Float(), nullable=False),
    sa.Column('sugars', sa.Float(), nullable=False),
    sa.Column('fiber', sa.Float(), nullable=False),
    sa.Column('protein', sa.Float(), nullable=False),
    sa.Column('salt', sa.Float(), nullable=False),
    sa.Column('sodium', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['ingredient_id'], ['ingredients.id'], ),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], ),
    sa.PrimaryKeyConstraint('recipe_id', 'ingredient_id')
    )
    op.create_table('recipe_scores',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('recipe_id', sa.Integer(), nullable=False),
    sa.Column('score', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'recipe_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('recipe_scores')
    op.drop_table('recipe_ingredients')
    op.drop_table('medias')
    op.drop_table('meal_plan_entries')
    op.drop_table('comments')
    op.drop_table('collections')
    op.drop_table('shopping_list_items')
    op.drop_table('recipes')
    op.drop_table('users')
    op.drop_table('ingredients')
    # ### end Alembic commands ###
