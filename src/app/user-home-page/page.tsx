import { getServerSession } from 'next-auth';
import { Container, Row, Button, Col,  } from 'react-bootstrap';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';


const actionButtons = [
  { label: 'Search Recipes', href: '/recipes/search' },
  { label: 'Add New Recipe', href: '/add' },
  { label: 'My Saved Recipes', href: '/recipes/saved' },
];

const UserHomePage = async () => {
  const session = (await getServerSession(authOptions)) as {
    user: { email: string; id: string; randomKey: string; name?: string | null };
  } | null;

  loggedInProtectedPage(session);
  const displayName = session?.user?.name ?? 'Miron';

  return (
    <main>
      <section className="bg-primary-subtle text-center py-5">
        <Container>
          <p className="text-uppercase text-secondary mb-2">Welcome back</p>
          <h1 className="display-4 fw-bold mb-3">Hey, {displayName}!</h1>
          <p className="lead text-muted">Ready to dive back into your kitchen creations?</p>
        </Container>
      </section>

      <Container className="py-5">
        <Row className="g-4 justify-content-center">
          {actionButtons.map(({ label, href }) => (
            <Col key={label} xs={12} sm={6} md={4} className="d-flex">
              <Button
                href={href}
                size="lg"
                variant="dark"
                className="flex-fill py-3 text-uppercase fw-semibold shadow-sm"
              >
                {label}
              </Button>
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  );
};

export default UserHomePage;
