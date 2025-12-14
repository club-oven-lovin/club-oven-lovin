import { getServerSession } from 'next-auth';
import { Container, Row, Col, Button } from 'react-bootstrap';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import KitchenTipsCard from '@/components/KitchenTipsCard';
import RecipeCard from '@/components/RecipeCard';
import { prisma } from '@/lib/prisma';

const kitchenTips = [
  {
    title: 'Season in layers',
    description: 'Salt proteins and veggies early, then finish with acid or herbs to wake flavors back up.',
    tag: 'Prep',
  },
  {
    title: 'Use your sheet pan',
    description: 'Warm tortillas, toast nuts, and reheat leftovers together for even heat and fewer dishes.',
    tag: 'Efficiency',
  },
  {
    title: 'Prep produce first',
    description: 'Rinse, dry, and chop greens when you unpack them so salads and sautés are ready when you are.',
    tag: 'Make-ahead',
  },
  {
    title: 'Save pasta water',
    description: 'A ladle of the starchy liquid gives sauces instant silkiness without heavy cream.',
    tag: 'Texture',
  },
  {
    title: 'Trust a thermometer',
    description: 'An oven or instant-read thermometer prevents guesswork so proteins stay juicy, never dry.',
    tag: 'Accuracy',
  },
];

const brandColor = '#ff6b35';
const brandAccentColor = '#ff9248';
const charcoal = '#2A2A2A';

const UserHomePage = async () => {
  const session = (await getServerSession(authOptions)) as {
    user: { email: string; id: string; randomKey: string; name?: string | null };
  } | null;

  loggedInProtectedPage(session);

  const sessionEmail = session?.user?.email ?? null;
  let displayName = session?.user?.name ?? '';

  if ((!displayName || displayName.trim().length === 0) && sessionEmail) {
    const userRecord = await prisma.user.findUnique({
      where: { email: sessionEmail },
      select: { name: true },
    });

    displayName = userRecord?.name ?? sessionEmail.split('@')[0] ?? 'user';
  }

  displayName = displayName?.trim() || 'user';

  // Fetch recipes with reviews for rating calculation
  const recipesWithReviews = await prisma.recipe.findMany({
    include: {
      reviews: {
        select: { rating: true },
      },
    },
  });

  // Calculate average rating and sort by rating (highest first)
  const recipesWithRating = recipesWithReviews.map((recipe) => {
    const { reviews, ...recipeData } = recipe;
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    return {
      ...recipeData,
      averageRating,
      reviewCount: reviews.length,
    };
  });

  // Sort by average rating descending and take top 3
  const topRatedRecipes = [...recipesWithRating]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 3);

  const hasRecommendations = topRatedRecipes.length > 0;

  return (
    <main className="bg-body-tertiary min-vh-100">
      <section
        className="text-white py-4 border-bottom"
        style={{ background: `linear-gradient(120deg, ${brandColor}, ${brandAccentColor})` }}
      >
        <Container>
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3">
            <div className="text-center text-lg-start">
              <p className="text-uppercase fw-semibold opacity-75 mb-2">Welcome back</p>
              <h1 className="display-5 fw-bold mb-2">Hey, {displayName}!</h1>
              <p className="lead opacity-75 mb-4">
                The oven is preheated and the community is buzzing—jump into something new or refine a favorite.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Button href="browse-recipes" variant="light" className="text-uppercase fw-semibold px-4">
                  Browse recipes
                </Button>
                <Button href="/add-recipe" variant="outline-light" className="text-uppercase fw-semibold px-4 text-white">
                  Share a new dish
                </Button>
                <Button
                  href="/userprofile"
                  variant="outline-light"
                  className="text-uppercase fw-semibold px-4 text-white"
                >
                  View profile
                </Button>
              </div>
            </div>

            <KitchenTipsCard tips={kitchenTips} accentColor={brandColor} />
          </div>
        </Container>
      </section>

      <section className="py-5" style={{ background: 'linear-gradient(180deg, #fff5ef, #fff0e5 60%, #ffe4d1)' }}>
        <Container>
          <div className="text-center mb-5">
            <p className="text-uppercase mb-2" style={{ color: 'rgba(42, 42, 42, 0.7)', letterSpacing: 1 }}>
              Recommended
            </p>
            <h2 className="fw-bold mb-3" style={{ color: charcoal }}>Fresh ideas curated for you</h2>
            <p className="mb-0" style={{ color: 'rgba(42, 42, 42, 0.65)' }}>
              Top-rated recipes loved by the community.
            </p>
          </div>

          {hasRecommendations ? (
            <>
              <Row className="g-4 justify-content-center">
                {topRatedRecipes.map((recipe) => (
                  <Col key={recipe.id} xs={12} sm={6} lg={4}>
                    <RecipeCard recipe={recipe} />
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-4">
                <Button
                  href="/browse-recipes"
                  size="lg"
                  className="text-uppercase fw-semibold px-5"
                  style={{ backgroundColor: brandColor, borderColor: brandColor }}
                >
                  Discover Delicious
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-muted mb-0">
              Add your first recipe to start seeing personalized recommendations here.
            </p>
          )}
        </Container>
      </section>

    </main>
  );
};

export default UserHomePage;

