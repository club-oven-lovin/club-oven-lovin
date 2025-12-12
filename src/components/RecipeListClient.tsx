'use client';

import { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import RecipeCard from '@/components/RecipeCard';
import type { Recipe } from '@prisma/client';

// Extended recipe type with average rating data
type RecipeWithRating = Recipe & {
  averageRating: number;
  reviewCount: number;
};

interface RecipeListClientProps {
  initialRecipes: RecipeWithRating[];
}

export default function RecipeListClient({ initialRecipes }: RecipeListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const normalizedSearch = searchTerm.toLowerCase().trim();

  const searchWords = normalizedSearch
    ? normalizedSearch
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 2)
    : [];

  const filteredRecipes = initialRecipes.filter((recipe) => {
    if (!normalizedSearch || searchWords.length === 0) return true;

    const haystack = [
      recipe.name,
      recipe.ingredients ?? '',
      ...(recipe.tags ?? []),
      ...(recipe.dietaryRestrictions ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    // ✅ ALL search words must appear somewhere in the recipe
    return searchWords.every((word) => haystack.includes(word));
  });

  return (
    <Container className="py-4">
      <h1 className="mb-2">Our Recipes</h1>
      <p className="text-muted mb-4">
        Browse all recipes created by the Club Oven Lovin&apos; community.
      </p>

      <Form className="mb-4">
        <InputGroup>
          <InputGroup.Text>
            <Search />
          </InputGroup.Text>

          <Form.Control
            id="recipe-search"
            aria-label="Search recipes"
            placeholder="Search recipes by name, ingredient, tag, or dietary restriction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Form>

      {filteredRecipes.length === 0 ? (
        <p className="text-muted">No recipes match that search yet.</p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredRecipes.map((recipe) => (
            <Col
              key={recipe.id}
              data-testid={`recipe-card-${recipe.id}`}
            >
              <RecipeCard recipe={recipe} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
