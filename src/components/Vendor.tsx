'use client';

import React, { useState } from 'react';
import { Table, Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill, PencilSquare, PlusCircle } from 'react-bootstrap-icons';
import { addIngredient, updateIngredient } from '@/lib/dbActions';
import type { Ingredient, Vendor as VendorType } from '@prisma/client';

export default function Vendor({
  vendor,
  ingredients: initialIngredients,
}: {
  vendor: VendorType | null;
  ingredients: Ingredient[];
}) {
  const [ingredients, setIngredients] = useState(initialIngredients);

  // Track the row being edited
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    price: '',
    size: '',
    available: true,
  });

  const startEditing = (ingredient: Ingredient) => {
    setEditingId(ingredient.id);
    setEditForm({
      id: ingredient.id,
      name: ingredient.name,
      price: ingredient.price.toString(),
      size: ingredient.size,
      available: ingredient.available,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveChanges = async () => {
    await updateIngredient({
      id: editForm.id,
      name: editForm.name,
      price: parseFloat(editForm.price),
      size: editForm.size,
      available: editForm.available,
    });

    // update UI instantly
    setIngredients((prev) =>
      prev.map((i) =>
        i.id === editForm.id
          ? {
              ...i,
              name: editForm.name,
              price: parseFloat(editForm.price),
              size: editForm.size,
              available: editForm.available,
            }
          : i
      )
    );

    setEditingId(null);
  };

  const [newIngredient, setNewIngredient] = useState({
    name: '',
    price: '',
    size: '',
    available: true,
  });

  const handleAddIngredient = async () => {
    if (!newIngredient.name || !newIngredient.price) return;
    if (!vendor) return;

    // 1. Save to the database
    const created = await addIngredient({
      owner: vendor.owner,
      vendorId: vendor.id,
      name: newIngredient.name,
      price: parseFloat(newIngredient.price),
      size: newIngredient.size,
      available: newIngredient.available,
    });

    // 2. Update UI using the returned DB item
    setIngredients([...ingredients, created]);

    // 3. Reset input fields
    setNewIngredient({
      name: '',
      price: '',
      size: '',
      available: true,
    });
  };

  return (
    <Container className="py-4">

      {/* Greeting card */}
      <Card
        className="vendor-homepage-greeting-card mb-4 shadow-sm"
        data-testid="vendor-greeting-card"
      >
        <Card.Body className="text-center">
          <Card.Title className="fs-2">Welcome, {vendor?.name || 'Vendor'}</Card.Title>
          <Card.Text>
            Location: <strong>{vendor?.address || 'N/A'}</strong><br />
            Hours: {vendor?.hours || 'N/A'}
          </Card.Text>
        </Card.Body>
      </Card>

      {/* Ingredients table */}
      <Table
        bordered
        hover
        responsive
        className="vendor-homepage-table mb-4"
        data-testid="ingredients-table"
      >
        <thead className="table-secondary">
          <tr>
            <th>Ingredient</th>
            <th>Price</th>
            <th>Size</th>
            <th>Available?</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((item) =>
            editingId === item.id ? (
              // Editable Row
              <tr key={item.id}>
                <td>
                  <Form.Control
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                </td>

                <td>
                  <Form.Control
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                  />
                </td>

                <td>
                  <Form.Control
                    value={editForm.size}
                    onChange={(e) =>
                      setEditForm({ ...editForm, size: e.target.value })
                    }
                  />
                </td>

                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    checked={editForm.available}
                    onChange={(e) =>
                      setEditForm({ ...editForm, available: e.target.checked })
                    }
                  />
                </td>

                <td>
                  <Button size="sm" variant="success" onClick={saveChanges}>
                    Save
                  </Button>{' '}
                  <Button size="sm" variant="secondary" onClick={cancelEditing}>
                    Cancel
                  </Button>
                </td>
              </tr>
            ) : (
              // Normal display row
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.size}</td>
                <td className="text-center">
                  {item.available ? (
                    <CheckCircleFill className="text-success" />
                  ) : (
                    <XCircleFill className="text-danger" />
                  )}
                </td>
                <td className="text-center">
                  <Button
                    className="vendor-homepage-orange-btn"
                    size="sm"
                    onClick={() => startEditing(item)}
                  >
                    <PencilSquare />
                  </Button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>

      {/* Add Ingredient Form */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3">Add New Ingredient</Card.Title>
          <Row className="g-3">
            <Col md>
              <Form.Control
                placeholder="Name"
                value={newIngredient.name}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, name: e.target.value })
                }
              />
            </Col>

            <Col md>
              <Form.Control
                placeholder="Price"
                value={newIngredient.price}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, price: e.target.value })
                }
              />
            </Col>

            <Col md>
              <Form.Control
                placeholder="Size"
                value={newIngredient.size}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, size: e.target.value })
                }
              />
            </Col>

            <Col md>
              <Form.Select
                value={newIngredient.available ? 'true' : 'false'}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    available: e.target.value === 'true',
                  })
                }
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </Form.Select>
            </Col>

            <Col md="auto">
              <Button className="vendor-homepage-orange-btn" onClick={handleAddIngredient}>
                <PlusCircle /> Add
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
