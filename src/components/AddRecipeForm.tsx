"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddRecipeSchema } from "@/lib/validationSchemas";
import { useRouter } from "next/navigation";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import LoadingSpinner from "./LoadingSpinner";
import ImageUploader from "./ImageUploader";
import { toast } from "sonner";

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
  }, [session, setValue]);

  // Track image URL separately for the ImageUploader
  const [imageUrl, setImageUrl] = useState('');

  // Sync imageUrl with form
  useEffect(() => {
    setValue('image', imageUrl);
  }, [imageUrl, setValue]);

  const owner = session?.user?.email ?? ""; // Kept for consistency if needed elsewhere, but setValue handles the form state

  if (status === "loading") return <LoadingSpinner />;
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  // Form submit handler (calls API route)
  const onSubmit = async (data: AddRecipeFormData) => {
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
      toast.success('Recipe created successfully!', {
        description: 'Redirecting to browse page...',
      });
      router.push('/browse-recipes');
    } catch (err) {
      console.error('Error creating recipe:', err);
      toast.error('Failed to create recipe', {
        description: 'Please try again.',
      });
    }
  };

  // Handle validation errors with toast
  const onFormError = () => {
    // Build error message list
    const errorMessages: string[] = [];
    if (errors.name) errorMessages.push('Recipe Name');
    if (errors.image || !imageUrl) errorMessages.push('Recipe Image');
    if (errors.ingredients) errorMessages.push('Ingredients');
    if (errors.steps) errorMessages.push('Steps');
    if (errors.tags) errorMessages.push('Tags');

    if (errorMessages.length > 0) {
      toast.error('Please check your input', {
        description: `Missing: ${errorMessages.join(', ')}`,
      });
    }
  };



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
                onSubmit={handleSubmit(onSubmit, onFormError)}
                data-testid="add-recipe-form"
              >
                {/* NAME */}
                <Form.Group data-testid="recipe-name-field" className="mb-3">
                  <Form.Label>Recipe Name</Form.Label>
                  <Form.Control type="text" {...register("name")} isInvalid={!!errors.name} />
                  <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                </Form.Group>

                {/* IMAGE UPLOAD */}
                <Form.Group data-testid="recipe-image-field" className="mb-3">
                  <Form.Label>Recipe Image</Form.Label>
                  <ImageUploader
                    value={imageUrl}
                    onChange={setImageUrl}
                    disabled={isSubmitting}
                  />
                  {errors.image && (
                    <div className="text-danger small mt-1">{errors.image.message}</div>
                  )}
                </Form.Group>

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
