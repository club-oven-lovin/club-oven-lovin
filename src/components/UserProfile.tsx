'use client';

import { Container, Row, Col, Card, Badge, Button, Image } from 'react-bootstrap';
import type { Recipe, User as UserType } from '@prisma/client';

export default function UserProfile({
  user,
  contributedRecipes,
  favoriteRecipes,
}: {
  user: UserType;
  contributedRecipes: Recipe[];
  favoriteRecipes: Recipe[];
}) {
  // Helper to get initials from name
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <main className="min-vh-100 d-flex flex-column">
      <Container
        style={{
          maxWidth: '1100px',
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          paddingTop: '20px',
          paddingBottom: '40px',
        }}
      >
        {/* PAGE TITLE */}
        <h1 className="text-center fw-bold mb-4 userprofile-title">Your Profile</h1>

        {/* PROFILE CARD */}
        <Card className="shadow-sm p-4 mb-5">
          <Row className="align-items-center">
            {/* Avatar */}
            <Col md="auto" className="text-center mb-3 mb-md-0">
              <div className="userprofile-avatar" style={{ width: 130, height: 130 }}>
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span className="fw-bold fs-2">{getInitials(user.name)}</span>
                )}
              </div>
            </Col>

            {/* Name / Email / Dietary Restrictions */}
            <Col>
              <h2 className="fw-bold mb-1 userprofile-name-text">{user.name ?? 'Unnamed User'}</h2>
              <p className="mb-3 userprofile-email-text">{user.email ?? 'Email not provided'}</p>

              <div className="mb-3">
                {user.dietaryRestrictions && user.dietaryRestrictions.length > 0 ? (
                  user.dietaryRestrictions.map((pref) => (
                    <Badge key={pref} className="me-2 mb-2 userprofile-diet-badge">
                      {pref}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted fst-italic">No dietary restrictions selected</span>
                )}
              </div>

              <Button href="/userprofile/edit" className="userprofile-edit-btn">
                Edit Profile
              </Button>
            </Col>
          </Row>
        </Card>

        {/* CONTRIBUTED RECIPES */}
        <h3 className="userprofile-section-title mb-3">Contributed Recipes</h3>
        {contributedRecipes.length === 0 ? (
          <p className="text-muted fst-italic mb-4">
            You haven&apos;t added any recipes yet.
          </p>
        ) : (
          <Row className="g-3 mb-4">
            {contributedRecipes.map((recipe) => (
              <Col key={recipe.id} xs={12} md={4}>
                <Card className="shadow-sm userprofile-card h-100">
                  <div
                    className="userprofile-card-accent d-flex align-items-center justify-content-center"
                    style={{ height: '120px' }}
                  >
                    {recipe.image ? (
                      <Image
                        src={recipe.image}
                        alt={recipe.name}
                        style={{ height: '120px', width: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <>Image of {recipe.name}</>
                    )}
                  </div>

                  <div className="p-3">
                    {recipe.tags.map((tag) => (
                      <Badge key={tag} className="me-2 mb-2 userprofile-tag-badge">
                        {tag}
                      </Badge>
                    ))}

                    {recipe.dietaryRestrictions.map((d) => (
                      <Badge key={d} className="me-2 mb-2 userprofile-diet-badge">
                        {d}
                      </Badge>
                    ))}

                    <h6 className="userprofile-card-title mt-2">{recipe.name}</h6>

                    <div className="d-flex gap-2 mt-3">
                      <Button href={`/recipes/${recipe.id}`} variant="outline-dark" size="sm">
                        View
                      </Button>

                      <Button href={`/recipes/${recipe.id}/edit`} size="sm" className="userprofile-edit-btn">
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* FAVORITE RECIPES */}
        <h3 className="userprofile-section-title mb-3">Favorite Recipes</h3>
        {favoriteRecipes.length === 0 ? (
          <p className="text-muted fst-italic">You haven&apos;t added any favorite recipes yet.</p>
        ) : (
          <Row className="g-3">
            {favoriteRecipes.map((recipe) => (
              <Col key={recipe.id} xs={12} md={4}>
                <Card className="shadow-sm userprofile-card h-100">
                  <div
                    className="userprofile-card-accent d-flex align-items-center justify-content-center"
                    style={{ height: '120px' }}
                  >
                    {recipe.image ? (
                      <Image
                        src={recipe.image}
                        alt={recipe.name}
                        style={{ height: '120px', width: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <>Image of {recipe.name}</>
                    )}
                  </div>

                  <div className="p-3">
                    {recipe.tags.map((tag) => (
                      <Badge key={tag} className="me-2 mb-2 userprofile-tag-badge">
                        {tag}
                      </Badge>
                    ))}

                    {recipe.dietaryRestrictions.map((d) => (
                      <Badge key={d} className="me-2 mb-2 userprofile-diet-badge">
                        {d}
                      </Badge>
                    ))}

                    <h6 className="userprofile-card-title mt-2">{recipe.name}</h6>

                    <Button href={`/recipes/${recipe.id}`} variant="outline-dark" size="sm" className="mt-2">
                      View
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </main>
  );
}