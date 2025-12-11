import { prisma } from '@/lib/prisma';
import { Container, Row, Col, Card } from 'react-bootstrap';

/**
 * This component:
 * - Records a page visit to "/"
 * - Fetches counts for recipes, visits, and user profiles
 * - Renders the Quick Stats cards with dynamic values
 */
const QuickStats = async () => {
  const creamColor = '#fff8f1';
  const orangeColor = '#ff6b35';

  // 1) Record this page visit
  await prisma.pageVisit.create({
    data: {
      path: '/', // landing page
    },
  });

  // 2) Fetch counts for stats
  const [recipesCount, visitsCount, userProfilesCount] = await prisma.$transaction([
    prisma.recipe.count(),
    prisma.pageVisit.count(),
    prisma.user.count(),
  ]);

  const stats = [
    {
      label: 'Recipes',
      value: recipesCount.toString(),
      testId: 'stat-recipes',
    },
    {
      label: 'Visits',
      value: visitsCount.toString(),
      testId: 'stat-visits',
    },
    {
      // Keeping the same testId so existing tests don’t break
      label: 'User Profiles',
      value: userProfilesCount.toString(),
      testId: 'stat-average-price',
    },
    {
      // Leave reviews static for now (you said you’ll handle it later)
      label: 'Reviews',
      value: '4.2 ★',
      testId: 'stat-reviews',
    },
  ];

  return (
    <Container
      fluid
      className="py-5"
      style={{ backgroundColor: creamColor }}
      data-testid="quick-stats-section"
    >
      <h2 className="text-center mb-5 fw-bold" style={{ color: orangeColor }}>
        Quick Stats
      </h2>
      <Row className="text-center">
        {stats.map((stat) => (
          <Col key={stat.testId} md={3} sm={6} className="mb-4">
            <Card className="border-0 shadow-sm h-100" data-testid={stat.testId}>
              <Card.Body>
                <h3 className="display-5 fw-bold" style={{ color: orangeColor }}>
                  {stat.value}
                </h3>
                <p className="text-muted">{stat.label}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default QuickStats;
