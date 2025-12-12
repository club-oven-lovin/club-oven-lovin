
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

interface DeleteRecipeButtonProps {
  id: number;
}

type SessionUser = {
  email?: string;
  randomKey?: string; // role string: 'ADMIN', 'USER', etc.
};

export default function DeleteRecipeButton({ id }: DeleteRecipeButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as SessionUser | undefined;

  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // 🔒 Only admins even SEE this button
  if (!user || user.randomKey !== 'ADMIN') {
    return null;
  }

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
