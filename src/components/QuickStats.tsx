'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';

const QuickStats = () => {
  const creamColor = '#fff8f1';
  const orangeColor = '#ff6b35';

  return (
    <Container fluid className="py-5" style={{ backgroundColor: creamColor }}> {/* Cream background */}
      <h2 className="text-center mb-5 fw-bold" style={{ color: orangeColor }}>Quick Stats</h2>
      <Row className="text-center">
        <Col md={3} sm={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h3 className="display-5 fw-bold" style={{ color: orangeColor }}>140</h3> {/* Orange text */}
              <p className="text-muted">Recipes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h3 className="display-5 fw-bold" style={{ color: orangeColor }}>5.4M</h3> {/* Orange text */}
              <p className="text-muted">Visits</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h3 className="display-5 fw-bold" style={{ color: orangeColor }}>21.8K</h3> {/* Orange text */}
              <p className="text-muted">Average price</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h3 className="display-5 fw-bold" style={{ color: orangeColor }}>4.2 ★</h3> {/* Orange text */}
              <p className="text-muted">Reviews</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QuickStats;
