
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
import { Recipe } from '@/lib/recipeData';

interface RecipeListClientProps {
  initialRecipes: Recipe[];
}

export default function RecipeListClient({ initialRecipes }: RecipeListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = initialRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tags.some((tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
            placeholder="Search by name, ingredient, or tag..."
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
            <Col key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
