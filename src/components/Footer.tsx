import { Col, Container, Row } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-4" style={{ backgroundColor: '#ff6b35' }}> {/* Orange background */}
    <Container>
      <Row className="justify-content-center text-center">
        <Col xs={12} md={8} lg={6}>
          <h5 className="fw-bold" style={{ color: 'white' }}>Club Oven Lovin&#39;</h5> {/* White text */}
          <p className="mb-0" style={{ color: 'white' }}> {/* White text */}
            Department of Information and Computer Sciences
            <br />
            University of Hawaii
            <br />
            Honolulu, HI 96822
          </p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
