import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';

const cleanIngredient = (ingredient: string) =>
  ingredient
    .replace(/^[-•\d\.\)\s]+/, '')
    .trim();

const parseIngredients = (ingredients: string) =>
  ingredients
    .split(/\r?\n|,/)
    .map((item) => cleanIngredient(item))
    .filter((item) => item.length > 0);

const parseSteps = (steps: string) =>
  steps
    .split(/\r?\n/)
    .map((step) => step.trim())
    .filter((step) => step.length > 0);

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
  const recipeId = Number(params.id);

  if (Number.isNaN(recipeId)) {
    return notFound();
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) {
    return notFound();
  }

  const parsedIngredients = parseIngredients(recipe.ingredients);

  const vendorIngredients = parsedIngredients.length
    ? await prisma.ingredient.findMany({
        where: {
          available: true,
          OR: parsedIngredients.map((name) => ({
            name: {
              equals: name,
              mode: 'insensitive',
            },
          })),
        },
        include: { vendor: true },
      })
    : [];

  const vendorByIngredient = parsedIngredients.map((ingredientName) => ({
    name: ingredientName,
    offers: vendorIngredients.filter(
      (item) => item.name.toLowerCase() === ingredientName.toLowerCase(),
    ),
  }));

  return (
    <main className="py-5">
      <Container>
        <Row className="align-items-start gy-4">
          <Col md={5} lg={4}>
            <Card className="shadow-sm border-0">
              <div className="position-relative" style={{ height: 280 }}>
                <Image
                  src={recipe.image || '/images/placeholder.png'}
                  alt={recipe.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-fit-cover rounded-top"
                />
              </div>
              <Card.Body>
                <Card.Title className="fw-bold mb-2">{recipe.name}</Card.Title>
                <Card.Subtitle className="text-muted mb-3">By {recipe.owner}</Card.Subtitle>

                <h6 className="fw-semibold">Tags</h6>
                <div className="mb-3">
                  {recipe.tags.length === 0 ? (
                    <span className="text-muted">No tags provided.</span>
                  ) : (
                    recipe.tags.map((tag) => (
                      <Badge key={tag} bg="warning" text="dark" className="me-1 mb-1">
                        {tag}
                      </Badge>
                    ))
                  )}
                </div>

                <h6 className="fw-semibold">Dietary Restrictions</h6>
                <div>
                  {recipe.dietaryRestrictions.length === 0 ? (
                    <span className="text-muted">None specified.</span>
                  ) : (
                    recipe.dietaryRestrictions.map((restriction) => (
                      <Badge key={restriction} bg="success" className="me-1 mb-1">
                        {restriction}
                      </Badge>
                    ))
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={7} lg={8}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <Card.Title className="fw-bold mb-3">Ingredients</Card.Title>
                <ListGroup variant="flush" className="mb-1">
                  {parsedIngredients.map((ingredient, index) => (
                    <ListGroup.Item key={`${ingredient}-${index}`} className="ps-0">
                      {ingredient}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <Card.Title className="fw-bold mb-3">Steps</Card.Title>
                <ol className="mb-0 ps-3">
                  {parseSteps(recipe.steps).map((step, index) => (
                    <li key={`step-${index}`} className="mb-2">
                      {step}
                    </li>
                  ))}
                </ol>
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title className="fw-bold mb-3">Where to buy ingredients</Card.Title>
                {vendorByIngredient.every((item) => item.offers.length === 0) ? (
                  <p className="text-muted mb-0">No vendor listings are available for these ingredients yet.</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {vendorByIngredient.map((ingredient) => (
                      <div key={ingredient.name}>
                        <h6 className="fw-semibold mb-2">{ingredient.name}</h6>
                        {ingredient.offers.length === 0 ? (
                          <p className="text-muted mb-0">No vendors currently offer this ingredient.</p>
                        ) : (
                          <ListGroup>
                            {ingredient.offers.map((offer) => (
                              <ListGroup.Item key={offer.id} className="d-flex align-items-center justify-content-between">
                                <div>
                                  <div className="fw-semibold">{offer.vendor?.name ?? 'Vendor'}</div>
                                  {offer.vendor?.address ? (
                                    <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                                      {offer.vendor.address}
                                    </div>
                                  ) : null}
                                  {offer.size ? (
                                    <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                                      Size: {offer.size}
                                    </div>
                                  ) : null}
                                </div>
                                <div className="fw-bold" style={{ color: '#ff6b35' }}>
                                  ${offer.price.toFixed(2)}
                                </div>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            <div className="mt-4">
              <Link href="/browse-recipes" className="text-decoration-none">&larr; Back to recipes</Link>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
