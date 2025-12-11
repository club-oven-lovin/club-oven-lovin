
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, Alert } from 'react-bootstrap';
import type { Recipe } from '@prisma/client';

interface EditRecipeFormProps {
  recipe: Recipe;
}

export default function EditRecipeForm({ recipe }: EditRecipeFormProps) {
  const router = useRouter();

  const [name, setName] = useState(recipe.name);
  const [image, setImage] = useState(recipe.image ?? '');
  const [ingredients, setIngredients] = useState(recipe.ingredients ?? '');
  const [steps, setSteps] = useState(recipe.steps ?? '');
  const [tags, setTags] = useState(recipe.tags.join(', '));
  const [dietaryRestrictions, setDietaryRestrictions] = useState(
    recipe.dietaryRestrictions.join(', ')
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          image,
          ingredients,
          steps,
          tags,
          dietaryRestrictions: dietaryRestrictions
            ? dietaryRestrictions.split(',').map((d) => d.trim())
            : [],
          owner: recipe.owner,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update recipe: ${res.status}`);
      }

      // Go back to the recipe detail page
      router.push(`/recipes/${recipe.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Something went wrong saving the recipe.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-3 mb-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Recipe Name</Form.Label>
        <Form.Control
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Image URL</Form.Label>
        <Form.Control
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/photo.jpg"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Ingredients</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Steps / Instructions</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Tags (comma-separated)</Form.Label>
        <Form.Control
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="dessert, easy, weeknight"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Dietary Restrictions (comma-separated)</Form.Label>
        <Form.Control
          value={dietaryRestrictions}
          onChange={(e) => setDietaryRestrictions(e.target.value)}
          placeholder="dairy-free, gluten-free"
        />
      </Form.Group>

      <Button type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save Changes'}
      </Button>
    </Form>
  );
}
