// src/lib/recipeData.ts

export interface Recipe {
  id: number;
  name: string;
  image: string;
  ingredients: string;
  steps: string;
  tags: string[];
  dietaryRestrictions: string[];
  owner: string;
  createdAt: Date;

  // The 'price' field is removed.
  // The 'rating' and 'time' fields are kept as optional if RecipeCard still uses them,
  // but they won't be populated from the database unless you add them to your Prisma schema.
  rating?: number; // 1-5
  time?: string; // e.g., "4-8 min"
}
