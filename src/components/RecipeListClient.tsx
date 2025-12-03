// src/components/RecipeListClient.tsx

'use client';

import { useState } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import RecipeCard from '@/components/RecipeCard'; // Assuming RecipeCard exists and uses the Recipe interface
import { Recipe } from '@/lib/recipeData'; // Import the updated Recipe interface

// Define props for this client component
interface RecipeListClientProps {
  initialRecipes: Recipe[];
}

export default function RecipeListClient({ initialRecipes }: RecipeListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter recipes based on search term
  const filteredRecipes = initialRecipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by ingredients
    recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) // Search by tags
    // Removed filtering by recipe.time and recipe.price as they are not in the database model
  );

  return (
    <Container className="py-5">
      <h1 className="text-center fw-bold mb-4" style={{ color: '#343a40' }}>Our Recipes</h1>
      
      <Row className="justify-content-center mb-4">
        <Col md={6}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="search-addon" style={{ backgroundColor: '#e9ecef', borderColor: '#ced4da' }}>
              <Search color="#6c757d" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search recipes by name, ingredient, or tag..."
              aria-label="Search recipes"
              aria-describedby="search-addon"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ backgroundColor: '#e9ecef', borderColor: '#ced4da', color: '#495057' }}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {filteredRecipes.map(recipe => (
          <Col key={recipe.id}>
            {/* Pass the database-fetched recipe to RecipeCard */}
            <RecipeCard recipe={recipe} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
