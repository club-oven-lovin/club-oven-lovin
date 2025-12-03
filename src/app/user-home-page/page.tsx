import { getServerSession } from 'next-auth';
import { Container, Row, Col, Button } from 'react-bootstrap';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import KitchenTipsCard from '@/components/KitchenTipsCard';

const actionButtons = [
  {
    label: 'Search Recipes',
    href: '/recipes/search',
    description: 'Dial in on cuisines, ingredients, and dietary filters instantly.',
    accentStart: '#fff3ec',
    accentEnd: '#ffd1b8',
  },
  {
    label: 'Add New Recipe',
    href: "/add-recipe",
    description: 'Document your latest win with smart fields and auto-tagging.',
    accentStart: '#fff1ea',
    accentEnd: '#ffc8a5',
  },
  {
    label: 'My Saved Recipes',
    href: '/userprofile',
    description: 'Jump back into your curated list whenever inspiration hits.',
    accentStart: '#fff5ee',
    accentEnd: '#ffd9c0',
  },
];

const recommendedRecipes = [
  {
    title: 'Classic Margherita Pizza',
    description: 'Fresh basil, creamy mozzarella, and charred crust for an easy crowd-pleaser.',
    href: '/recipes/1',
    accentStart: '#fff3ec',
    accentEnd: '#ffd1b8',
  },
  {
    title: 'Smoky Chipotle Tacos',
    description: 'Bright lime slaw and chipotle peppers bring serious flavor to weeknight tacos.',
    href: '/recipes/2',
    accentStart: '#fff1ea',
    accentEnd: '#ffc8a5',
  },
  {
    title: 'Creamy Garlic Pasta',
    description: 'Silky sauce in under 20 minutes when you crave comfort without the hassle.',
    href: '/recipes/3',
    accentStart: '#fff5ee',
    accentEnd: '#ffd9c0',
  },
  {
    title: 'Berry Oat Breakfast Bars',
    description: 'Sweet-tart berries baked into chewy, grab-and-go breakfast squares.',
    href: '/recipes/4',
    accentStart: '#fff0e7',
    accentEnd: '#ffcba6',
  },
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
        </Container>
      </section>

    </main>
  );
};

export default UserHomePage;
