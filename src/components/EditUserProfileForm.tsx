'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditProfileSchema } from '@/lib/validationSchemas';
import { updateUserProfile } from '@/lib/dbActions';
import { User } from '@prisma/client';

export type EditProfileFormData = {
  id: string;
  name: string;
  email: string;
  image: string;
  dietaryRestrictions: string[];
};

const DIETARY_OPTIONS = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free'];

const EditUserProfileForm = ({ user }: { user: User & { dietaryRestrictions: string[] } }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: yupResolver(EditProfileSchema),
    defaultValues: {
      id: String(user.id),
      name: user.name ?? '',
      email: user.email ?? '',
      image: user.image ?? '',
      dietaryRestrictions: user.dietaryRestrictions ?? [],
    },
  });

  const onSubmit: SubmitHandler<EditProfileFormData> = async (data) => {
    await updateUserProfile(data);
    swal('Success', 'Your profile has been updated', 'success', { timer: 2000 });
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={6}>
          <Col className="text-center">
            <h2 className="mt-4 mb-2 display-5">Edit Your Profile</h2>
            <p className="text-muted mb-4" style={{ fontSize: "1.1rem" }}>Keep your profile up-to-date!</p>
          </Col>

          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('id')} />

                {/* NAME */}
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <input
                    type="text"
                    {...register('name')}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </Form.Group>

                {/* EMAIL */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </Form.Group>

                {/* IMAGE */}
                <Form.Group className="mb-3">
                  <Form.Label>Profile Image URL</Form.Label>
                  <input
                    type="text"
                    {...register('image')}
                    className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.image?.message}</div>
                </Form.Group>

                {/* DIETARY RESTRICTIONS */}
                <Form.Group className="mb-3">
                  <Form.Label>Dietary Restrictions</Form.Label>
                  <div className="ms-2">
                    {DIETARY_OPTIONS.map((label) => (
                      <div key={label} className="form-check">
                        <input
                          value={label}
                          type="checkbox"
                          {...register('dietaryRestrictions')}
                          className="form-check-input"
                          defaultChecked={user.dietaryRestrictions?.includes(label)}
                        />
                        <label className="form-check-label">{label}</label>
                      </div>
                    ))}
                  </div>
                  {errors.dietaryRestrictions && (
                    <div className="text-danger">{errors.dietaryRestrictions.message}</div>
                  )}
                </Form.Group>

                {/* BUTTONS */}
                <Row className="pt-2">
                  <Col>
                    <Button type="submit" variant="primary" className="edit-user-profile-save-btn">
                      Save
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="button"
                      variant="secondary"
                      className="float-end edit-user-profile-reset-btn"
                      onClick={() => reset()}
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
};

export default EditUserProfileForm;
