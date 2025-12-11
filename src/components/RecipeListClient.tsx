
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

interface RecipeListClientProps {
  initialRecipes: Recipe[];
}

export default function RecipeListClient({ initialRecipes }: RecipeListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const normalizedSearch = searchTerm.toLowerCase().trim();

  const filteredRecipes = initialRecipes.filter((recipe) => {
    if (!normalizedSearch) return true;

    const nameMatch = recipe.name.toLowerCase().includes(normalizedSearch);
    const ingredientsMatch = (recipe.ingredients ?? '')
      .toLowerCase()
      .includes(normalizedSearch);

    const tagsMatch = (recipe.tags ?? []).some((tag) =>
      tag.toLowerCase().includes(normalizedSearch)
    );

    // 🔎 NEW: allow searching by dietary restrictions
    const dietaryMatch = (recipe.dietaryRestrictions ?? []).some((restriction) =>
      restriction.toLowerCase().includes(normalizedSearch)
    );

    return nameMatch || ingredientsMatch || tagsMatch || dietaryMatch;
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

          {/* 🔎 Accessible name for Playwright: "Search recipes" */}
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
              // 🧪 for tests/recipes-page.spec.ts
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
