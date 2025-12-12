'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge, Card, Button } from 'react-bootstrap';
import StarRating from '@/components/StarRating';
import FavoriteHeart from '@/components/FavoriteHeart';
import type { Recipe as MarketingRecipe } from '@/lib/recipeData';
import type { Recipe as PrismaRecipe } from '@prisma/client';

// Extended recipe type with rating data
type RecipeWithRating = PrismaRecipe & {
  averageRating?: number;
  reviewCount?: number;
};

type RecipeCardRecipe = MarketingRecipe | RecipeWithRating;

interface RecipeCardProps {
  recipe: RecipeCardRecipe;
  // Favorite heart props
  userId?: number | null;
  isFavorited?: boolean;
  // Profile page props
  showEditButton?: boolean;
  hideOwner?: boolean;
}

const hasMarketingFields = (
  recipe: RecipeCardRecipe
): recipe is MarketingRecipe =>
  'rating' in recipe && 'time' in recipe;

const hasDietaryData = (recipe: RecipeCardRecipe): recipe is RecipeWithRating =>
  'tags' in recipe && 'dietaryRestrictions' in recipe;

const hasRatingData = (recipe: RecipeCardRecipe): recipe is RecipeWithRating =>
  'averageRating' in recipe && typeof recipe.averageRating === 'number';

// Maximum number of visible tags (combined tags + dietary restrictions)
const MAX_VISIBLE_TAGS = 4;

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  userId = null,
  isFavorited = false,
  showEditButton = false,
  hideOwner = false,
}) => {
  const time = hasMarketingFields(recipe) ? recipe.time ?? 'N/A' : 'N/A';
  const tags = hasDietaryData(recipe) ? recipe.tags : [];
  const dietaryRestrictions = hasDietaryData(recipe)
    ? recipe.dietaryRestrictions
    : [];

  const href = `/recipes/${recipe.id}`;

  // Combine all tags and calculate overflow
  const allTags = [
    ...tags.map((tag) => ({ label: tag, type: 'tag' as const })),
    ...dietaryRestrictions.map((d) => ({ label: d, type: 'dietary' as const })),
  ];
  const visibleTags = allTags.slice(0, MAX_VISIBLE_TAGS);
  const overflowCount = allTags.length - MAX_VISIBLE_TAGS;

  return (
    <Card
      className="h-100 shadow-sm border-0 recipe-card-custom text-decoration-none"
      data-testid={`recipe-card-${recipe.id}`}
    >
      {/* Image container with favorite heart */}
      <Link href={href} className="recipe-card-image-container position-relative d-block">
        <Image
          src={recipe.image || '/images/placeholder.png'}
          alt={recipe.name || 'Recipe'}
          width={150}
          height={150}
          className="card-img-top recipe-card-image"
          style={{ objectFit: 'cover' }}
        />
        {/* Favorite Heart Icon */}
        <FavoriteHeart
          recipeId={recipe.id}
          userId={userId}
          isFavorited={isFavorited}
        />
      </Link>

      <Card.Body as={Link} href={href} className="d-flex flex-column text-decoration-none">
        <Card.Title className="fw-bold fs-6 mb-1" style={{ color: '#343a40' }}>
          {recipe.name}
        </Card.Title>

        {time !== 'N/A' && (
          <Card.Subtitle className="mb-2 text-muted">{time}</Card.Subtitle>
        )}

        {/* Tags container with fixed height for consistent layout */}
        <div
          className="d-flex flex-wrap gap-1 align-content-start"
          style={{ minHeight: '52px' }} /* Fixed height for ~2 rows of badges */
        >
          {visibleTags.map((item) => (
            <Badge
              key={`${item.type}-${item.label}`}
              bg={item.type === 'tag' ? 'warning' : 'success'}
              text={item.type === 'tag' ? 'dark' : 'white'}
            >
              {item.label}
            </Badge>
          ))}
          {overflowCount > 0 && (
            <Badge bg="secondary" text="white">
              +{overflowCount}
            </Badge>
          )}
        </div>

        {/* Star Rating Display */}
        {hasRatingData(recipe) && (
          <div className="d-flex align-items-center gap-2 mt-2">
            <span className="fw-semibold" style={{ color: '#ffc107', fontSize: '0.9rem' }}>
              {recipe.averageRating!.toFixed(1)}
            </span>
            <StarRating rating={recipe.averageRating!} size={16} />
          </div>
        )}
      </Card.Body>

      <Card.Footer className="bg-white border-0 small text-muted">
        {showEditButton ? (
          <Button
            href={`/recipes/${recipe.id}/edit`}
            size="sm"
            variant="outline-primary"
            className="w-100"
            onClick={(e) => e.stopPropagation()}
          >
            Edit
          </Button>
        ) : hideOwner ? null : (
          <>By: {recipe.owner}</>
        )}
      </Card.Footer>
    </Card>
  );
};

export default RecipeCard;


