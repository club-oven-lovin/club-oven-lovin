'use client';

import { useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-5 text-center">
      <h2 className="mb-3">Something went wrong</h2>
      <p className="text-muted mb-4">
        We hit an unexpected issue while rendering this page. Please try again.
      </p>
      <Button variant="primary" onClick={() => reset()}>
        Try again
      </Button>
      {error.digest && (
        <p className="mt-3 text-muted" style={{ fontSize: '0.85rem' }}>
          Error reference: {error.digest}
        </p>
      )}
    </Container>
  );
}
