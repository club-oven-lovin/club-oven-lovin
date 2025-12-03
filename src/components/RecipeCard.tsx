'use client';

import Image from 'next/image';
import { Card, Badge } from 'react-bootstrap';
import { StarFill } from 'react-bootstrap-icons';
import type { Recipe as MarketingRecipe } from '@/lib/recipeData';
import type { Recipe as PrismaRecipe } from '@prisma/client';

type RecipeCardRecipe = MarketingRecipe | PrismaRecipe;

interface RecipeCardProps {
  recipe: RecipeCardRecipe;
}

const hasMarketingFields = (recipe: RecipeCardRecipe): recipe is MarketingRecipe =>
  'rating' in recipe && 'time' in recipe && 'price' in recipe;

const hasDietaryData = (recipe: RecipeCardRecipe): recipe is PrismaRecipe =>
  'tags' in recipe && 'dietaryRestrictions' in recipe;

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const primaryOrange = '#ff6b35';

  const rating = hasMarketingFields(recipe) ? recipe.rating : 5;
  const time = hasMarketingFields(recipe) ? recipe.time : 'N/A';
  const price = hasMarketingFields(recipe) ? recipe.price : 'USD 0.00';
  const tags = hasDietaryData(recipe) ? recipe.tags : [];
  const dietaryRestrictions = hasDietaryData(recipe) ? recipe.dietaryRestrictions : [];

  return (
    <Card
      className="shadow-sm border-0 recipe-card-custom"
      data-testid={`recipe-card-${recipe.id}`}
    >
      <div className="recipe-card-image-container">
        <Image
          src={recipe.image || '/images/placeholder.png'}
          alt={recipe.name || 'Recipe'}
          width={150}
          height={150}
          className="card-img-top recipe-card-image"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <Card.Body>
        <Card.Title className="fw-bold fs-6 mb-1" style={{ color: '#343a40' }}>
          {recipe.name}
        </Card.Title>

        {/* Rating / Time */}
        <div className="d-flex align-items-center mb-3">
          {Array.from({ length: rating }).map((_, i) => (
            <StarFill key={i} size={14} className="me-1" style={{ color: primaryOrange }} />
          ))}
          <span className="text-muted ms-auto" style={{ fontSize: '0.9em' }}>
            {time}
          </span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-1">
            {tags.map((tag) => (
              <Badge key={tag} bg="warning" className="me-1 text-dark">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Dietary Restrictions */}
        {dietaryRestrictions.length > 0 && (
          <div className="mb-1">
            {dietaryRestrictions.map((d) => (
              <Badge key={d} bg="success" className="me-1">
                {d}
              </Badge>
            ))}
          </div>
        )}

        {/* Price */}
        <Card.Text className="fw-bold" style={{ color: primaryOrange }}>
          {price}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;
