
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
    <Link href={href} className="text-decoration-none text-reset">
      <Card className="h-100 shadow-sm border-0">
        {recipe.image && (
          <div className="position-relative" style={{ height: 200 }}>
            <Image
              src={recipe.image}
              alt={recipe.name}
              fill
              className="object-fit-cover rounded-top"
            />
          </div>
        )}

        <Card.Body>
          <Card.Title className="d-flex justify-content-between align-items-start">
            <span>{recipe.name}</span>
            <span className="d-flex align-items-center gap-1">
              {Array.from({ length: rating }).map((_, i) => (
                <StarFill key={i} size={14} color={primaryOrange} />
              ))}
            </span>
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
