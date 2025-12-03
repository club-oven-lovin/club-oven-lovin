"use client";

import { useEffect } from "react"; // Added useEffect
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddRecipeSchema } from "@/lib/validationSchemas";
import { useRouter } from "next/navigation";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import LoadingSpinner from "./LoadingSpinner";

type AddRecipeFormData = {
  name: string;
  image: string;
  ingredients: string;
  steps: string;
  tags: string;
  dietaryRestrictions: string[];
  owner: string;
};

export default function AddRecipeForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Added getValues and setValue to the destructuring
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, getValues, setValue } = useForm<AddRecipeFormData>({
    resolver: yupResolver(AddRecipeSchema),
    defaultValues: {
      name: "",
      image: "",
      ingredients: "",
      steps: "",
      tags: "",
      dietaryRestrictions: [],
      // Removed owner from defaultValues, it will be set by useEffect
    },
  });

  // Added console.log for Session Data
  console.log("Session Data:", session);

  // useEffect to set the owner field once session data is available
  useEffect(() => {
    if (session?.user?.email) {
      setValue("owner", session.user.email);
    }
  }, [session, setValue]); // Dependency array includes session and setValue

  const owner = session?.user?.email ?? ""; // Kept for consistency if needed elsewhere, but setValue handles the form state

  if (status === "loading") return <LoadingSpinner />;
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  // Form submit handler (calls API route)
  const onSubmit = async (data: AddRecipeFormData) => {
    console.log("onSubmit function called!"); // Debugging log
    try {
      const payload = { ...data, owner };
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to create recipe');
      }
      // Redirect to browse page after successful create
      router.push('/browse-recipes');
    } catch (err) {
      // Minimal error handling: log and alert
      // You can replace with a nicer UI notification later
      // eslint-disable-next-line no-console
      console.error('Error creating recipe:', err);
      // eslint-disable-next-line no-alert
      alert('Could not create recipe. See console for details.');
    }
  };

  // TEMPORARY DEBUGGING LOGS - REMOVE THESE LATER
  console.log("Form State:", { errors, isSubmitting });
  console.log("Current Form Values:", getValues());
  // END TEMPORARY DEBUGGING LOGS

  return (
    <Container className="py-4">
      <h2 className="text-center mt-4 mb-2 display-5">
        Create Your Culinary Masterpiece
      </h2>
      <p className="text-center mb-4" style={{ fontSize: "1.1rem", color: "#555" }}>
        Tell us how you make your dish, including the ingredients, steps, and tips.
      </p>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card>
            <Card.Body>
              <Form
                onSubmit={handleSubmit(onSubmit)}
                data-testid="add-recipe-form"
              >
                {/* NAME + IMAGE */}
                <Row>
                  <Col>
                    <Form.Group data-testid="recipe-name-field">
                      <Form.Label>Recipe Name</Form.Label>
                      <Form.Control type="text" {...register("name")} isInvalid={!!errors.name} />
                      <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group data-testid="recipe-image-field">
                      <Form.Label>Picture URL</Form.Label>
                      <Form.Control type="text" {...register("image")} isInvalid={!!errors.image} />
                      <Form.Control.Feedback type="invalid">{errors.image?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* INGREDIENTS */}
                <Form.Group className="mt-3" data-testid="recipe-ingredients-field">
                  <Form.Label>Ingredients</Form.Label>
                  <Form.Control as="textarea" rows={4} {...register("ingredients")} isInvalid={!!errors.ingredients} />
                  <Form.Control.Feedback type="invalid">{errors.ingredients?.message}</Form.Control.Feedback>
                </Form.Group>

                {/* STEPS */}
                <Form.Group className="mt-3" data-testid="recipe-steps-field">
                  <Form.Label>Steps</Form.Label>
                  <Form.Control as="textarea" rows={5} {...register("steps")} isInvalid={!!errors.steps} />
                  <Form.Control.Feedback type="invalid">{errors.steps?.message}</Form.Control.Feedback>
                </Form.Group>

                {/* TAGS */}
                <Form.Group className="mt-3" data-testid="recipe-tags-field">
                  <Form.Label>Tags (comma separated)</Form.Label>
                  <Form.Control type="text" {...register("tags")} isInvalid={!!errors.tags} />
                  <Form.Control.Feedback type="invalid">{errors.tags?.message}</Form.Control.Feedback>
                </Form.Group>

                {/* DIETARY RESTRICTIONS */}
                <Form.Group className="mt-3" data-testid="recipe-dietary-field">
                  <Form.Label>Dietary Restrictions</Form.Label>
                  {["vegan", "vegetarian", "gluten-free", "dairy-free", "nut-free"].map((d) => (
                    <Form.Check key={d} type="checkbox" value={d} label={d} {...register("dietaryRestrictions")} className="ms-2" />
                  ))}
                </Form.Group>

                {/* hidden owner - removed value={owner} */}
                <input type="hidden" {...register("owner")} />

                {/* BUTTONS */}
                <Row className="mt-4">
                  <Col>
                    <Button type="submit" variant="primary" className="add-recipe-submit-btn">Submit</Button>
                  </Col>
                  <Col className="text-end">
                    <Button variant="secondary" className="add-recipe-reset-btn" onClick={() => reset()}>Reset</Button>
                  </Col>
                </Row>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
