'use client';

import { useEffect } from 'react';
import { Button } from 'react-bootstrap';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="d-flex min-vh-100 align-items-center justify-content-center bg-body-tertiary">
        <main className="text-center p-4 bg-white rounded shadow-sm">
          <h2 className="mb-3">We’re working on it</h2>
          <p className="text-muted mb-4">
            An unexpected error occurred before we could load the page. Refresh to try again.
          </p>
          <Button variant="primary" onClick={() => reset()}>
            Reload page
          </Button>
          {error.digest && (
            <p className="mt-3 text-muted" style={{ fontSize: '0.85rem' }}>
              Error reference: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
