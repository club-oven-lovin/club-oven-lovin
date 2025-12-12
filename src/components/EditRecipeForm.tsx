
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button } from 'react-bootstrap';
import type { Recipe } from '@prisma/client';
import ImageUploader from './ImageUploader';
import { toast } from 'sonner';

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
  const [saving, setSaving] = useState(false);

  const validateForm = (): boolean => {
    const missingFields: string[] = [];

    if (!name.trim()) missingFields.push('Recipe Name');
    if (!image.trim()) missingFields.push('Recipe Image');
    if (!ingredients.trim()) missingFields.push('Ingredients');
    if (!steps.trim()) missingFields.push('Steps');
    if (!tags.trim()) missingFields.push('Tags');

    if (missingFields.length > 0) {
      toast.error('Please check your input', {
        description: `Missing: ${missingFields.join(', ')}`,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update recipe: ${res.status}`);
      }

      toast.success('Recipe updated successfully!', {
        description: 'Redirecting to recipe page...',
      });
      router.push(`/recipes/${recipe.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update recipe', {
        description: 'Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/recipes/${recipe.id}`);
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-3 mb-4">
      <Form.Group className="mb-3">
        <Form.Label>Recipe Name <span className="text-danger">*</span></Form.Label>
        <Form.Control
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter recipe name"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Recipe Image <span className="text-danger">*</span></Form.Label>
        <ImageUploader
          value={image}
          onChange={setImage}
          disabled={saving}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Ingredients <span className="text-danger">*</span></Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter ingredients"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Steps / Instructions <span className="text-danger">*</span></Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          placeholder="Enter cooking steps"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Tags (comma-separated) <span className="text-danger">*</span></Form.Label>
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

      <div className="d-flex gap-2">
        <Button
          type="button"
          variant="outline-secondary"
          onClick={handleCancel}
          disabled={saving}
          style={{
            backgroundColor: 'white',
            color: '#333',
            borderColor: '#ccc',
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </Form>
  );
}


