'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row, Alert } from 'react-bootstrap';

/** The sign in page. */
const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    // Ask NextAuth to not redirect automatically so we can inspect the result
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (!result) {
      setErrorMessage('No response from authentication endpoint.');
      console.error('signIn returned undefined/null', result);
      return;
    }

    // result.error contains server-provided error string (eg. "CredentialsSignin")
    if (result.error) {
      setErrorMessage(`Sign in failed: ${result.error}`);
      console.error('Sign in failed:', result);
      return;
    }

    // Successful sign-in: either use the returned URL or fallback
    const dest = (result as any).url || '/user-home-page';
    // If you want to redirect client-side:
    window.location.href = dest;
  };

  return (
    <main className="signin-page">
      <Container>
        <Row className="justify-content-center">
          <Col xs={5}>
            <h1 className="text-center">Sign In</h1>
            <Card>
              <Card.Body>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form method="post" onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <input name="email" type="text" className="form-control" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <input name="password" type="password" className="form-control" />
                  </Form.Group>
                  <Button type="submit" className="mt-3" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer>
                Don&apos;t have an account?
                <a href="/auth/signup">Sign up</a>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignIn;
