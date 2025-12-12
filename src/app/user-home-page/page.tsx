import { getServerSession } from 'next-auth';
import { Container, Row, Col, Button } from 'react-bootstrap';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import KitchenTipsCard from '@/components/KitchenTipsCard';
import { prisma } from '@/lib/prisma';

const actionButtons = [
  {
    label: 'Search Recipes',
    href: '/recipes/search',
    description: 'Dial in on cuisines, ingredients, and dietary filters instantly.',
    accentStart: '#fffdfa',
    accentEnd: '#f4efe7',
  },
  {
    label: 'Add New Recipe',
    href: "/add-recipe",
    description: 'Document your latest win with smart fields and auto-tagging.',
    accentStart: '#fff9f2',
    accentEnd: '#f2ece3',
  },
  {
    label: 'My Saved Recipes',
    href: '/userprofile',
    description: 'Jump back into your curated list whenever inspiration hits.',
    accentStart: '#fff8f0',
    accentEnd: '#f1ebe2',
  },
];

const recommendationAccents = [
  { accentStart: '#fffdfa', accentEnd: '#f4efe7' },
  { accentStart: '#fff9f2', accentEnd: '#f2ece3' },
  { accentStart: '#fff8f0', accentEnd: '#f1ebe2' },
  { accentStart: '#fff7ee', accentEnd: '#efe9e0' },
];

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
  const displayName = session?.user?.name ?? 'user';
  const allRecipes = await prisma.recipe.findMany({
    select: {
      id: true,
      name: true,
      steps: true,
      ingredients: true,
      owner: true,
    },
  });

  const shuffledRecipes = [...allRecipes];
  for (let i = shuffledRecipes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledRecipes[i], shuffledRecipes[j]] = [shuffledRecipes[j], shuffledRecipes[i]];
  }

  const selectedRecipes = shuffledRecipes.slice(0, 4);
  const recommendedRecipes = selectedRecipes.map((recipe, index) => {
    const descriptionSource = recipe.steps || recipe.ingredients || '';
    const normalized = descriptionSource.replace(/\s+/g, ' ').trim();
    const description =
      normalized.length > 0
        ? normalized.slice(0, 110).concat(normalized.length > 110 ? '…' : '')
        : 'Jump in to see the steps, ingredients, and community notes.';
    const { accentStart, accentEnd } = recommendationAccents[index % recommendationAccents.length];

    return {
      title: recipe.name,
      description,
      href: `/recipes/${recipe.id}`,
      accentStart,
      accentEnd,
    };
  });
  const hasRecommendations = recommendedRecipes.length > 0;

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
              </div>
            </div>

            <KitchenTipsCard tips={kitchenTips} accentColor={brandColor} />
          </div>
        </Container>
      </section>

      <section className="py-5" style={{ backgroundColor: '#fff7f3' }}>
        <Container>
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
            <div>
              <p className="text-uppercase mb-2" style={{ color: 'rgba(42, 42, 42, 0.7)', letterSpacing: 1 }}>
                Quick actions
              </p>
              <h2 className="fw-bold mb-2" style={{ color: charcoal }}>
                Stay in flow with one-tap tasks
              </h2>
              <p className="mb-0" style={{ color: 'rgba(42, 42, 42, 0.65)' }}>
                Launch into your most common workflows from polished tiles.
              </p>
            </div>
          </div>

          <Row className="g-4">
            {actionButtons.map(({ label, href, description, accentStart, accentEnd }) => (
              <Col key={label} xs={12} md={4}>
                <div
                  className="h-100 rounded-4 p-4 text-dark shadow-sm position-relative overflow-hidden border-0"
                  style={{
                    background: `linear-gradient(135deg, ${accentStart}, ${accentEnd})`,
                    boxShadow: '0 1.25rem 2.5rem rgba(255, 107, 53, 0.12)',
                  }}
                >
                  <h3 className="h5 fw-semibold mt-2" style={{ color: charcoal }}>{label}</h3>
                  <p className="mb-4" style={{ color: 'rgba(42,42,42,0.75)' }}>
                    {description}
                  </p>
                  <div className="d-flex align-items-center justify-content-between">
                    <Button
                      href={href}
                      size="sm"
                      className="text-uppercase fw-semibold px-3"
                      style={{ backgroundColor: charcoal, borderColor: charcoal, color: '#fff' }}
                    >
                      Launch
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
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
              Based on your saved tags, pantry staples, and what the community cannot stop cooking.
            </p>
          </div>

          {hasRecommendations ? (
            <Row className="g-4">
              {recommendedRecipes.map(({ title, description, href, accentStart, accentEnd }) => (
                <Col key={title} xs={12} md={6} lg={3}>
                  <div
                    className="h-100 rounded-4 p-4 text-dark shadow-sm border-0 position-relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${accentStart}, ${accentEnd})`,
                      boxShadow: '0 1.25rem 2rem rgba(255, 107, 53, 0.1)',
                    }}
                  >
                    <h3 className="h5 fw-semibold" style={{ color: charcoal }}>{title}</h3>
                    <p className="mb-4" style={{ color: 'rgba(42, 42, 42, 0.7)' }}>
                      {description}
                    </p>
                    <Button
                      href={href}
                      variant="light"
                      size="sm"
                      className="text-uppercase fw-semibold px-3"
                      style={{ color: charcoal, borderColor: charcoal }}
                    >
                      View recipe
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
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
