'use client';

import Image from 'next/image';
import { Card } from 'react-bootstrap';
import { StarFill } from 'react-bootstrap-icons';
import { Recipe } from '@prisma/client';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const primaryOrange = '#ff6b35';

  // Default values for rating, time, price (since DB recipes don't have them)
  const rating = 5; // default max rating
  const time = 'N/A'; // optional: could calculate from steps
  const price = 'USD 0.00'; // placeholder

  return (
    <Card className="h-100 shadow-sm border-0 recipe-card-custom">
      <div className="recipe-card-image-container">
        <Card.Img
          src={recipe.image || '/images/placeholder.png'}
          alt={recipe.name}
          width={150}
          height={150}
  return (
    <Card className="h-100 shadow-sm border-0 recipe-card-custom">
      <div className="recipe-card-image-container">
        <Image
          src={recipe.image}
          alt={recipe.name}
          width={150} // Adjust as needed, but keep consistent for grid
          height={150} // Adjust as needed
          className="card-img-top recipe-card-image"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold fs-6 mb-1" style={{ color: '#343a40' }}>
          {recipe.name}
        </Card.Title>

        {/* Rating / Time */}
        <div className="d-flex align-items-center mb-2">
          {Array(rating)
            .fill(0)
            .map((_, i) => (
              <StarFill key={i} size={14} className="me-1" style={{ color: primaryOrange }} />
            ))}
          <span className="text-muted ms-auto" style={{ fontSize: '0.9em' }}>
            {time}
          </span>
        </div>

        {/* Tags */}
        <div className="mb-1">
          {recipe.tags.map((tag) => (
            <Badge key={tag} bg="warning" className="me-1 text-dark">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Dietary Restrictions */}
        <div className="mb-2">
          {recipe.dietaryRestrictions.map((d) => (
            <Badge key={d} bg="success" className="me-1">
              {d}
            </Badge>
          ))}
        </div>

        {/* Price */}
        <Card.Text className="mt-auto fw-bold" style={{ color: primaryOrange }}>
          {price}
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold fs-6 mb-1" style={{ color: '#343a40' }}>{recipe.name}</Card.Title>
        <div className="d-flex align-items-center mb-2">
          {Array(recipe.rating).fill(0).map((_, i) => (
            <StarFill key={i} size={14} className="me-1" style={{ color: primaryOrange }} />
          ))}
          <span className="text-muted ms-auto" style={{ fontSize: '0.9em' }}>{recipe.time}</span>
        </div>
        <Card.Text className="mt-auto fw-bold" style={{ color: primaryOrange }}>
          {recipe.price}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;
