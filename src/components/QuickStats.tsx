'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';

const stats = [
  { label: 'Recipes', value: '140', testId: 'stat-recipes' },
  { label: 'Visits', value: '5.4M', testId: 'stat-visits' },
  { label: 'Average price', value: '21.8K', testId: 'stat-average-price' },
  { label: 'Reviews', value: '4.2 ★', testId: 'stat-reviews' },
];

const QuickStats = () => {
  const creamColor = '#fff8f1';
  const orangeColor = '#ff6b35';

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
