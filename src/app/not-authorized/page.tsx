import { Col, Container, Row } from 'react-bootstrap';

/** Render a Not Authorized page if the user enters a URL that they don't have authorization for. */
const NotAuthorized = () => (
  <main>
    <Container className="py-3 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <Row className="justify-content-center text-center">
        <Col>
          <h2 className="mb-4">Not Authorized</h2>
          <p className="lead mb-4">You do not have permission to view this page.</p>
          <a href="/" className="btn btn-primary d-inline-block px-4 py-2">
            Return to Home
          </a>
        </Col>
      </Row>
    </Container>
  </main>
);

export default NotAuthorized;
