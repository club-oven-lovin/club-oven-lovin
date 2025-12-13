import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import authOptions from '@/lib/authOptions';
import FavoriteButton from '@/components/FavoriteButton';
import ReviewModal from '@/components/ReviewModal';
import ReviewsList from '@/components/ReviewsList';
import StarRating from '@/components/StarRating';

const measurementWords = new Set([
  'cup',
  'cups',
  'tbsp',
  'tablespoon',
  'tablespoons',
  'tsp',
  'teaspoon',
  'teaspoons',
  'oz',
  'ounce',
  'ounces',
  'pound',
  'pounds',
  'lb',
  'lbs',
  'gram',
  'grams',
  'kg',
  'kilogram',
  'kilograms',
  'ml',
  'milliliter',
  'milliliters',
  'liter',
  'liters',
  'pinch',
  'dash',
  'clove',
  'cloves',
  'slice',
  'slices',
  'can',
  'cans',
  'package',
  'packages',
  'bunch',
  'bunches',
  'stick',
  'sticks',
]);

const descriptorWords = new Set([
  'fresh',
  'large',
  'small',
  'medium',
  'diced',
  'chopped',
  'minced',
  'grated',
  'shredded',
  'optional',
  'ripe',
  'peeled',
  'sliced',
  'boneless',
  'skinless',
  'ground',
  'softened',
  'room',
  'temperature',
  'warm',
  'hot',
  'cold',
  'cooked',
  'raw',
  'crushed',
  'toasted',
  'whole',
  'halved',
  'divided',
  'plus',
  'each',
  'or',
  'and',
  'of',
  'with',
  'to',
  'for',
]);

const cleanIngredient = (ingredient: string) =>
  ingredient
    .replace(/^[-•]\s*/, '')
    .trim();

const parseIngredients = (ingredients: string) =>
  ingredients
    .split(/\r?\n|,/)
    .map((item) => cleanIngredient(item))
    .filter((item) => item.length > 0);

const normalizeIngredientName = (ingredient: string) =>
  ingredient
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[\d]+(?:\/[\d]+)?/g, ' ')
    .replace(/[.,-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word && !measurementWords.has(word) && !descriptorWords.has(word))
    .join(' ')
    .trim();

const buildIngredientMetadata = (ingredient: string) => {
  const normalizedName = normalizeIngredientName(ingredient);
  const tokens = new Set<string>();

  if (normalizedName) {
    tokens.add(normalizedName);
    normalizedName.split(/\s+/).forEach((token) => {
      if (token.length > 2) {
        tokens.add(token);
      }
    });
  }

  if (!tokens.size) {
    const fallback = ingredient.toLowerCase();
    if (fallback) {
      tokens.add(fallback);
    }
  }

  return {
    displayName: ingredient,
    normalizedName,
    searchTokens: Array.from(tokens),
  };
};

const matchesVendorIngredient = (
  searchTokens: string[],
  vendorNormalizedName: string,
  vendorOriginalName: string,
) => {
  const vendorLower = vendorOriginalName.toLowerCase();

  return searchTokens.some((token) => {
    if (!token) return false;
    if (vendorNormalizedName) {
      if (
        vendorNormalizedName.includes(token) ||
        token.includes(vendorNormalizedName)
      ) {
        return true;
      }
    }

    if (!vendorLower) return false;
    return vendorLower.includes(token) || token.includes(vendorLower);
  });
};

const parseSteps = (steps: string) =>
  steps
    .split(/\r?\n/)
    .map((step) => step.trim())
    .filter((step) => step.length > 0);

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  // Get role from session (assuming randomKey holds role as per analysis)
  interface CustomUser {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    randomKey?: string;
  }

  const user = session?.user as CustomUser | undefined;
  const currentUserEmail = user?.email ?? null;
  const isAdmin = user?.randomKey === 'ADMIN';

  const recipeId = Number(params.id);

  if (Number.isNaN(recipeId)) {
    return notFound();
  }

  const userId = user?.id ? Number(user.id) : null;

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: { reviews: { orderBy: { createdAt: 'desc' } } },
  });

  if (!recipe) {
    return notFound();
  }

  const canEdit = !!currentUserEmail && recipe.owner === currentUserEmail;

  // Calculate Aggregates
  const totalRating = recipe.reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = recipe.reviews.length > 0 ? totalRating / recipe.reviews.length : 0;
  const reviewCount = recipe.reviews.length;

  const parsedIngredients = parseIngredients(recipe.ingredients ?? '');
  const ingredientMetadata = parsedIngredients.map((ingredient) => buildIngredientMetadata(ingredient));
  const parsedSteps = parseSteps(recipe.steps ?? '');
  const tags = Array.isArray(recipe.tags) ? recipe.tags : [];
  const dietaryRestrictions = Array.isArray(recipe.dietaryRestrictions)
    ? recipe.dietaryRestrictions
    : [];
  const searchTerms = Array.from(
    new Set(
      ingredientMetadata.flatMap((ingredient) => ingredient.searchTokens),
    ),
  ).filter((term) => term.length > 0);

  const vendorIngredientResults = searchTerms.length
    ? await prisma.ingredient.findMany({
      where: {
        available: true,
        OR: searchTerms.map((term) => ({
          name: {
            contains: term,
            mode: 'insensitive',
          },
        })),
      },
      include: { vendor: true },
    })
    : [];

  const vendorIngredientEntries = vendorIngredientResults.map((ingredient) => ({
    ingredient,
    normalizedName: normalizeIngredientName(ingredient.name),
  }));

  const vendorByIngredient = ingredientMetadata.map((ingredient) => ({
    name: ingredient.displayName,
    offers: vendorIngredientEntries
      .filter(({ normalizedName, ingredient: offer }) =>
        matchesVendorIngredient(ingredient.searchTokens, normalizedName, offer.name),
      )
      .map(({ ingredient: offer }) => offer),
  }));

  let isFavorited = false;
  if (userId) {
    const favorite = await prisma.favorite.findFirst({
      where: { userId, recipeId },
    });
    isFavorited = Boolean(favorite);
  }

  return (
    <main className="py-5">
      <div className="container">
        <div className="row align-items-start gy-4">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="position-relative" style={{ height: 280 }}>
                <Image
                  src={recipe.image || '/images/placeholder.png'}
                  alt={recipe.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-fit-cover rounded-top"
                />
              </div>
              <div className="card-body">
                <h2 className="fw-bold fs-4 mb-2">{recipe.name}</h2>
                <p className="text-muted mb-3">
                  By {recipe.owner || 'Unknown chef'}
                </p>

                {/* Star Rating Header */}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="fw-bold fs-5">{averageRating.toFixed(1)}</span>
                  <StarRating rating={averageRating} size={20} />
                  <span className="text-muted small">({reviewCount.toLocaleString()} reviews)</span>
                </div>

                {canEdit && (
                  <Link
                    href={`/recipes/${recipe.id}/edit`}
                    className="btn btn-outline-primary w-100 mb-3"
                  >
                    Edit recipe
                  </Link>
                )}

                {userId && (
                  <div className="d-flex justify-content-center mb-3">
                    <FavoriteButton
                      recipeId={recipe.id}
                      userId={userId}
                      isFavorited={isFavorited}
                      className="w-100"
                    />
                  </div>
                )}

                <h6 className="fw-semibold">Tags</h6>
                <div className="mb-3">
                  {tags.length === 0 ? (
                    <span className="text-muted">No tags provided.</span>
                  ) : (
                    tags.map((tag) => (
                      <span key={tag} className="badge bg-warning text-dark me-1 mb-1">
                        {tag}
                      </span>
                    ))
                  )}
                </div>

                <h6 className="fw-semibold">Dietary Restrictions</h6>
                <div>
                  {dietaryRestrictions.length === 0 ? (
                    <span className="text-muted">None specified.</span>
                  ) : (
                    dietaryRestrictions.map((restriction) => (
                      <span key={restriction} className="badge bg-success me-1 mb-1">
                        {restriction}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
            {/* Review Button positioned per request */}
            <div className="mt-4">
              <ReviewModal recipeId={recipe.id} recipeName={recipe.name} />
            </div>
          </div>

          <div className="col-md-7 col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h3 className="fw-bold fs-5 mb-3">Ingredients</h3>
                <ul className="list-group list-group-flush mb-1">
                  {parsedIngredients.map((ingredient, index) => (
                    <li key={`${ingredient}-${index}`} className="list-group-item ps-0">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h3 className="fw-bold fs-5 mb-3">Steps</h3>
                <ol className="mb-0 ps-3">
                  {parsedSteps.map((step, index) => (
                    <li key={`step-${index}`} className="mb-2">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h3 className="fw-bold fs-5 mb-3">Where to buy ingredients</h3>
                {vendorByIngredient.every((item) => item.offers.length === 0) ? (
                  <p className="text-muted mb-0">
                    No vendor listings are available for these ingredients yet.
                  </p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {vendorByIngredient.map((ingredient) => (
                      <div key={ingredient.name}>
                        <h6 className="fw-semibold mb-2">{ingredient.name}</h6>
                        {ingredient.offers.length === 0 ? (
                          <p className="text-muted mb-0">
                            No vendors currently offer this ingredient.
                          </p>
                        ) : (
                          <ul className="list-group">
                            {ingredient.offers.map((offer) => (
                              <li
                                key={offer.id}
                                className="list-group-item d-flex align-items-center justify-content-between"
                              >
                                <div>
                                  <div className="fw-semibold">{offer.vendor?.name ?? 'Vendor'}</div>
                                  {offer.vendor?.address ? (
                                    <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                                      {offer.vendor.address}
                                    </div>
                                  ) : null}
                                  {offer.size ? (
                                    <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                                      Size: {offer.size}
                                    </div>
                                  ) : null}
                                </div>
                                <div className="fw-bold" style={{ color: '#ff6b35' }}>
                                  ${offer.price.toFixed(2)}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="card shadow-sm border-0 mt-4 mb-4">
              <div className="card-body">
                <h3 className="fw-bold fs-5 mb-3">Reviews</h3>
                <ReviewsList
                  reviews={recipe.reviews}
                  currentUserEmail={currentUserEmail}
                  isAdmin={isAdmin}
                />
              </div>
            </div>

            <div className="mt-4">
              <Link href="/browse-recipes" className="text-decoration-none">&larr; Back to recipes</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
