
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, Badge } from 'react-bootstrap';
import { StarFill } from 'react-bootstrap-icons';
import type { Recipe as MarketingRecipe } from '@/lib/recipeData';
import type { Recipe as PrismaRecipe } from '@prisma/client';

type RecipeCardRecipe = MarketingRecipe | PrismaRecipe;

interface RecipeCardProps {
  recipe: RecipeCardRecipe;
}

const hasMarketingFields = (
  recipe: RecipeCardRecipe
): recipe is MarketingRecipe =>
  'rating' in recipe && 'time' in recipe;

const hasDietaryData = (recipe: RecipeCardRecipe): recipe is PrismaRecipe =>
  'tags' in recipe && 'dietaryRestrictions' in recipe;

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const primaryOrange = '#ff6b35';

  const rating = hasMarketingFields(recipe) ? recipe.rating ?? 5 : 5;
  const time = hasMarketingFields(recipe) ? recipe.time ?? 'N/A' : 'N/A';
  const tags = hasDietaryData(recipe) ? recipe.tags : [];
  const dietaryRestrictions = hasDietaryData(recipe)
    ? recipe.dietaryRestrictions
    : [];

  const href = `/recipes/${recipe.id}`;

  return (
    <Card
       as={Link}
      href={`/recipes/${recipe.id}`}
      className="h-100 shadow-sm border-0 recipe-card-custom text-decoration-none"
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

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold fs-6 mb-1" style={{ color: '#343a40' }}>
          {recipe.name}
        </Card.Title>

          {time !== 'N/A' && (
            <Card.Subtitle className="mb-2 text-muted">
              {time}
            </Card.Subtitle>
          )}

          {tags.length > 0 && (
            <div className="mb-2 d-flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge key={tag} bg="light" text="dark">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {dietaryRestrictions.length > 0 && (
            <div className="d-flex flex-wrap gap-1">
              {dietaryRestrictions.map((d) => (
                <Badge
                  key={d}
                  bg="light"
                  text="dark"
                  style={{
                    border: `1px solid ${primaryOrange}`,
                    color: primaryOrange,
                  }}
                >
                  {d}
                </Badge>
              ))}
            </div>
          )}
        </Card.Body>

        <Card.Footer className="bg-white border-0 small text-muted">
          By: {recipe.owner}
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default RecipeCard;
