'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addRecipe } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddRecipeSchema } from '@/lib/validationSchemas';

type AddRecipeFormData = {
  name: string;
  image: string;
  ingredients: string;
  steps: string;
  tags: string;
  owner: string;
  dietaryRestrictions: string[];
};

export default function AddRecipeForm() {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email || '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddRecipeFormData>({
    resolver: yupResolver(AddRecipeSchema),
    defaultValues: {
      name: '',
      image: '',
      ingredients: '',
      steps: '',
      tags: '',
      dietaryRestrictions: [],
      owner: currentUser,
    },
  });

  const onSubmit: SubmitHandler<AddRecipeFormData> = async (data) => {
    const payload = {
      ...data,
      dietaryRestrictions: data.dietaryRestrictions ?? [],
      tags: data.tags ?? '',
      owner: data.owner ?? currentUser,
    };

    await addRecipe(payload);

    swal('Success', 'Your recipe has been added!', 'success', {
      timer: 2000,
    });
  };

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'unauthenticated') redirect('/auth/signin');

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10}>
          <h2 className="text-center mt-4 mb-2 display-5">
            Create Your Culinary Masterpiece
          </h2>

          <p className="text-center mb-4" style={{ fontSize: "1.1rem", color: "#555" }}>
            Tell us how you make your dish, including the ingredients, steps, and tips. Your recipe could be someone’s new favorite meal!
          </p>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                
                {/* NAME + IMAGE */}
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Recipe Name</Form.Label>
                      <input
                        type="text"
                        {...register('name')}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.name?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Picture URL</Form.Label>
                      <input
                        type="text"
                        {...register('image')}
                        className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.image?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>

                {/* INGREDIENTS */}
                <Form.Group>
                  <Form.Label>Ingredients</Form.Label>
                  <textarea
                    {...register('ingredients')}
                    className={`form-control ${errors.ingredients ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.ingredients?.message}</div>
                </Form.Group>

                {/* STEPS */}
                <Form.Group>
                  <Form.Label>Steps</Form.Label>
                  <textarea
                    {...register('steps')}
                    className={`form-control ${errors.steps ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.steps?.message}</div>
                </Form.Group>

                {/* TAGS */}
                <Form.Group>
                  <Form.Label>Tags (comma separated)</Form.Label>
                  <input
                    type="text"
                    {...register('tags')}
                    className={`form-control ${errors.tags ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.tags?.message}</div>
                </Form.Group>

                {/* DIETARY RESTRICTIONS */}
                <Form.Group>
                  <Form.Label>Dietary Restrictions</Form.Label>
                  <div className="ms-2">
                    {['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free'].map(label => (
                      <div key={label} className="form-check">
                        <input
                          value={label}
                          type="checkbox"
                          {...register('dietaryRestrictions')}
                          className="form-check-input"
                        />
                        <label className="form-check-label">{label}</label>
                      </div>
                    ))}
                  </div>
                </Form.Group>

                {/* OWNER (hidden) */}
                <input type="hidden" {...register('owner')} value={currentUser} />

                {/* ACTION BUTTONS */}
                <Row className="pt-3">
                  <Col>
                    <Button type="submit" className="add-recipe-submit-btn" variant="primary">Submit</Button>
                  </Col>
                  <Col>
                    <Button
                      type="button"
                      onClick={() => reset()}
                      variant="warning"
                      className="float-end add-recipe-reset-btn"
                    >
                      Reset
                    </Button>
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