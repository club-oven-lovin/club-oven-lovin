'use client';

import React, { useState } from 'react';
import { Table, Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill, PencilSquare, PlusCircle } from 'react-bootstrap-icons';

import type { Ingredient, Vendor as VendorType } from '@prisma/client';

export default function Vendor({
  vendor,
  ingredients: initialIngredients,
}: {
  vendor: VendorType | null;
  ingredients: Ingredient[];
}) {
  const [ingredients, setIngredients] = useState(initialIngredients);

  const [newIngredient, setNewIngredient] = useState({
    name: '',
    price: '',
    size: '',
    available: true,
  });

  const handleAddIngredient = () => {
    if (!newIngredient.name || !newIngredient.price) return;

    const ingredientToAdd = {
      id: crypto.randomUUID(),
      owner: vendor?.owner ?? '',
      vendorId: vendor?.id ?? null,
      name: newIngredient.name,
      price: parseFloat(newIngredient.price),
      size: newIngredient.size,
      available: newIngredient.available,
    };

    setIngredients([...ingredients, ingredientToAdd]);

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
      <Card className="greeting-card mb-4 shadow-sm">
        <Card.Body className="text-center">
          <Card.Title className="fs-2">
            Welcome, {vendor?.name || 'Vendor'}
          </Card.Title>
          <Card.Text>
            Location: <strong>{vendor?.address || 'N/A'}</strong><br />
            Hours: {vendor?.hours || 'N/A'}
          </Card.Text>
        </Card.Body>
      </Card>

      {/* Ingredients table */}
      <Table bordered hover responsive className="vendor-table mb-4">
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
          {ingredients.map((item) => (
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
                <Button className="orange-btn"
                 size="sm">
                  <PencilSquare />
                </Button>
              </td>
            </tr>
          ))}
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
              <Button className="orange-btn" onClick={handleAddIngredient}>
                <PlusCircle /> Add
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}