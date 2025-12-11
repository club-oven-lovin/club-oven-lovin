// src/components/DeleteRecipeButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';

interface DeleteRecipeButtonProps {
  id: number;
}

export default function DeleteRecipeButton({ id }: DeleteRecipeButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this recipe? This cannot be undone.'
    );
    if (!confirmed) return;

    setError(null);
    setDeleting(true);

    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok && res.status !== 204) {
        throw new Error(`Failed to delete recipe: ${res.status}`);
      }

      router.push('/browse-recipes');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Something went wrong deleting this recipe.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="danger" onClick={handleDelete} disabled={deleting}>
        {deleting ? 'Deleting…' : 'Delete Recipe'}
      </Button>
    </div>
  );
}
