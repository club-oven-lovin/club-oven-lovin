import { getServerSession } from 'next-auth';
import { Container, Row, Col, Button } from 'react-bootstrap';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';

const actionButtons = [
  {
    label: 'Search Recipes',
    href: '/recipes/search',
    description: 'Dial in on cuisines, ingredients, and dietary filters instantly.',
  },
  {
    label: 'Add New Recipe',
    href: '/add',
    description: 'Document your latest win with smart fields and auto-tagging.',
  },
  {
    label: 'My Saved Recipes',
    href: '/recipes/saved',
    description: 'Jump back into your curated list whenever inspiration hits.',
  },
];

const recommendedRecipes = [
  {
    title: 'Classic Margherita Pizza',
    description: 'Fresh basil, creamy mozzarella, and charred crust for an easy crowd-pleaser.',
    href: '/recipes/1',
    tag: 'Trending',
  },
  {
    title: 'Smoky Chipotle Tacos',
    description: 'Bright lime slaw and chipotle peppers bring serious flavor to weeknight tacos.',
    href: '/recipes/2',
    tag: '30 min',
  },
  {
    title: 'Creamy Garlic Pasta',
    description: 'Silky sauce in under 20 minutes when you crave comfort without the hassle.',
    href: '/recipes/3',
    tag: 'Comfort',
  },
  {
    title: 'Berry Oat Breakfast Bars',
    description: 'Sweet-tart berries baked into chewy, grab-and-go breakfast squares.',
    href: '/recipes/4',
    tag: 'Meal prep',
  },
];

const brandColor = '#ff6b35';
const brandAccentColor = '#ff9248';

const UserHomePage = async () => {
  const session = (await getServerSession(authOptions)) as {
    user: { email: string; id: string; randomKey: string; name?: string | null };
  } | null;

  loggedInProtectedPage(session);
  const displayName = session?.user?.name ?? 'user';

  return (
    <main className="bg-body-tertiary min-vh-100">
      <section
        className="text-white py-5 border-bottom"
        style={{ background: `linear-gradient(120deg, ${brandColor}, ${brandAccentColor})` }}
      >
        <Container>
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-4">
            <div className="text-center text-lg-start">
              <p className="text-uppercase fw-semibold opacity-75 mb-2">Welcome back</p>
              <h1 className="display-4 fw-bold mb-3">Hey, {displayName}!</h1>
              <p className="lead opacity-75 mb-4">
                The oven is preheated and the community is buzzing—jump into something new or refine a favorite.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Button href="/recipes/search" variant="light" className="text-uppercase fw-semibold px-4">
                  Browse recipes
                </Button>
                <Button href="/add" variant="outline-light" className="text-uppercase fw-semibold px-4 text-white">
                  Share a new dish
                </Button>
              </div>
            </div>

            <div className="bg-white text-dark rounded-4 p-4 shadow-lg w-100" style={{ maxWidth: 360 }}>
              <p className="text-uppercase text-muted fw-semibold mb-3">Your kitchen pulse</p>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <span className="text-muted text-uppercase small">Saved recipes</span>
                  <h3 className="display-6 fw-bold mb-0" style={{ color: brandColor }}>48</h3>
                </div>
                <span className="badge bg-body-secondary text-dark py-2 px-3 rounded-pill">+4 this week</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-uppercase"
                  style={{ backgroundColor: 'rgba(255, 107, 53, 0.15)', color: brandColor, width: 56, height: 56 }}
                >
                  Hot
                </div>
                <div>
                  <p className="fw-semibold mb-1">Tonight&apos;s inspiration</p>
                  <p className="text-muted small mb-0">
                    Smoky chipotle tacos are trending—give them a whirl or pick your next hero recipe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-5 bg-white">
        <Container>
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
            <div>
              <p className="text-uppercase text-secondary mb-2">Quick actions</p>
              <h2 className="fw-bold mb-2">Stay in flow with one-tap tasks</h2>
              <p className="text-muted mb-0">Launch into your most common workflows from polished tiles.</p>
            </div>
            <Button href="/recipes/search" variant="outline-dark" className="mt-3 mt-md-0">
              See all tools
            </Button>
          </div>

          <Row className="g-4">
            {actionButtons.map(({ label, href, description }) => (
              <Col key={label} xs={12} md={4}>
                <div className="h-100 border rounded-4 p-4 shadow-sm">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-3 bg-body-secondary text-dark mb-3" style={{ width: 48, height: 48 }}>
                    <span className="fw-bold">{label.charAt(0)}</span>
                  </div>
                  <h3 className="h5 fw-semibold">{label}</h3>
                  <p className="text-muted mb-4">{description}</p>
                  <Button href={href} variant="dark" size="sm">
                    Open
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5 bg-body-tertiary">
        <Container>
          <div className="text-center mb-5">
            <p className="text-uppercase text-secondary mb-2">Recommended</p>
            <h2 className="fw-bold mb-3">Fresh ideas curated for you</h2>
            <p className="text-muted mb-0">
              Based on your saved tags, pantry staples, and what the community cannot stop cooking.
            </p>
          </div>

          <Row className="g-4">
            {recommendedRecipes.map(({ title, description, href, tag }) => (
              <Col key={title} xs={12} md={6} lg={3}>
                <div className="h-100 rounded-4 p-4 bg-white shadow-sm border">
                  <span className="badge text-bg-dark mb-3">{tag}</span>
                  <h3 className="h5 fw-semibold">{title}</h3>
                  <p className="text-muted mb-4">{description}</p>
                  <Button href={href} variant="outline-dark" size="sm">
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
