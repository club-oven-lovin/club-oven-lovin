"use client";

import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";

const UserProfile = () => {
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    dietaryPreferences: ["Vegan"],
  };

  const contributedRecipes = [
    { title: "Toaster Veggie Melt", id: 1, tag: "Vegan" },
    { title: "Garlic Toast Pasta", id: 2, tag: "30 min" },
    { title: "Cheesy Quesadilla", id: 3, tag: "15 min" },
  ];

  const favoriteRecipes = [
    { title: "Berry Oat Bars", id: 4, tag: "Breakfast" },
    { title: "Chipotle Tacos", id: 5, tag: "Trending" },
    { title: "Creamy Garlic Pasta", id: 6, tag: "Comfort" },
  ];

  return (
    <main className="min-vh-100 d-flex flex-column">
      <Container
        style={{
          maxWidth: "1100px",
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        {/* PROFILE CARD */}
        <Card className="shadow-sm p-4 mb-4 userprofile-card">
          <Row className="align-items-center">
            <Col md="auto" className="text-center mb-3 mb-md-0">
              <div
                className="userprofile-avatar"
                style={{ width: 120, height: 120 }}
              >
                Image of {user.name}
              </div>
            </Col>

            <Col>
              <h2 className="fw-bold mb-2">{user.name}</h2>
              <p className="text-muted mb-2">{user.email}</p>

              <div className="mb-3">
                {user.dietaryPreferences.map((pref) => (
                  <Badge key={pref} className="me-2 mb-2 userprofile-badge">
                    {pref}
                  </Badge>
                ))}
              </div>

              <Button href="/userprofile/edit" className="userprofile-primary-accent">
                Edit Profile
              </Button>
            </Col>
          </Row>
        </Card>

        {/* CONTRIBUTED RECIPES */}
        <h5 className="userprofile-section-title mb-3">Contributed Recipes</h5>

        <Row className="g-3 mb-4">
          {contributedRecipes.map((recipe) => (
            <Col key={recipe.id} xs={12} md={4}>
              <Card className="shadow-sm userprofile-card h-100">
                <div
                  className="userprofile-card-accent d-flex align-items-center justify-content-center"
                  style={{ height: "120px" }}
                >
                  Image of {recipe.title}
                </div>

                <div className="p-3">
                  <Badge className="mb-2 userprofile-badge">{recipe.tag}</Badge>

                  <h6 className="userprofile-card-title mt-1">{recipe.title}</h6>

                  <div className="d-flex gap-2 mt-2">
                    <Button href={`/recipes/${recipe.id}`} variant="outline-dark" size="sm">
                      View
                    </Button>

                    <Button
                      href={`/recipes/${recipe.id}/edit`}
                      size="sm"
                      className="userprofile-primary-accent border-0"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* FAVORITE RECIPES */}
        <h5 className="userprofile-section-title mb-3">Favorite Recipes</h5>

        <Row className="g-3">
          {favoriteRecipes.map((recipe) => (
            <Col key={recipe.id} xs={12} md={4}>
              <Card className="shadow-sm userprofile-card h-100">
                <div
                  className="userprofile-card-accent d-flex align-items-center justify-content-center"
                  style={{ height: "120px" }}
                >
                  Image of {recipe.title}
                </div>

                <div className="p-3">
                  <Badge className="mb-2 userprofile-badge">{recipe.tag}</Badge>

                  <h6 className="userprofile-card-title mt-1">{recipe.title}</h6>

                  <Button
                    href={`/recipes/${recipe.id}`}
                    variant="outline-dark"
                    size="sm"
                    className="mt-2"
                  >
                    View
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  );
};

export default UserProfile;