'use client';

import { signOut } from 'next-auth/react';
import { Button, Col, Row, Container, Card } from 'react-bootstrap';

/** After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => (
  <main className="signout-page">
    <Container>
      <Row className="justify-content-center">
        <Col xs={6}>
          <Card className="text-center p-4">
            <h2>Do you want to sign out?</h2>

            <Row className="mt-4">
              <Col>
                <Button
                  variant="danger"
                  onClick={() => signOut({ callbackUrl: '/', redirect: true })}
                >
                  Sign Out
                </Button>
              </Col>
              <Col>
                <Button variant="secondary" href="/">
                  Cancel
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  </main>
);

export default SignOut;
