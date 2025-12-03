// src/app/browse-recipes/page.tsx
'use client';

import { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Modal,
  Button,
} from 'react-bootstrap';
import { Search, StarFill } from 'react-bootstrap-icons';
import RecipeCard from '@/components/RecipeCard';
import { marketingRecipes as recipes, type Recipe } from '@/lib/recipeData';

export default function RecipesPage() {
  /* ------------------------ SEARCH ------------------------ */
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.price.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ------------------------ MODAL ------------------------ */
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const handleOpenModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
    setReviewName('');
    setReviewRating(5);
    setReviewText('');
  };

  const handleSubmitReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Review Submitted! (DB connection coming soon)");
    handleCloseModal();
  };

  return (
    <Container className="py-5">
      <h1 className="text-center fw-bold mb-4" style={{ color: '#343a40' }}>
        Our Recipes
      </h1>

      {/* Search */}
      <Row className="justify-content-center mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text style={{ backgroundColor: '#e9ecef' }}>
              <Search color="#6c757d" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: '#e9ecef',
                borderColor: '#ced4da',
                color: '#495057',
              }}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Grid */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-5 pb-4">
        {filteredRecipes.map((recipe) => (
          <Col key={recipe.id}>
            <RecipeCard recipe={recipe} />

            {/* Add Review button */}
            <Button
              variant="outline-dark"
              size="sm"
              className="mt-2"
              onClick={() => handleOpenModal(recipe)}
            >
              Add Review
            </Button>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRecipe?.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ backgroundColor: 'var(--cream-color)' }}>
          {selectedRecipe && (
            <>
              <p>
                <strong>Cooking Time:</strong> {selectedRecipe.time}
              </p>
              <p>
                <strong>Rating:</strong> {selectedRecipe.rating}{' '}
                <StarFill color="#f4c430" />
              </p>
              <p>
                <strong>Price:</strong> {selectedRecipe.price}
              </p>

              <hr />
              <h5>Leave a Review</h5>

              <Form onSubmit={handleSubmitReview}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name (optional)</Form.Label>
                  <Form.Control
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <Form.Select
                    value={reviewRating}
                    onChange={(e) =>
                      setReviewRating(Number(e.target.value))
                    }
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Your Review</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Submit Review
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
