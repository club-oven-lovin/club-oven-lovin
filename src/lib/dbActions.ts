'use server';

import { Stuff, Condition, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

/**
 * Updates a user's role (Admin only).
 * @param userId - The ID of the user to update
 * @param role - The new role (USER, VENDOR, or ADMIN)
 */
export async function updateUserRole(userId: number, role: Role) {
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}

/**
 * Deletes a user from the database (Admin only).
 * @param userId - The ID of the user to delete
 */
export async function deleteUser(userId: number) {
  await prisma.user.delete({
    where: { id: userId },
  });
}

/**
 * Deletes a vendor from the database (Admin only).
 * @param vendorId - The ID of the vendor to delete
 */
export async function deleteVendor(vendorId: string) {
  // First delete all ingredients associated with this vendor
  await prisma.ingredient.deleteMany({
    where: { vendorId },
  });
  // Then delete the vendor
  await prisma.vendor.delete({
    where: { id: vendorId },
  });
}

/**
 * Adds a new stuff to the database.
 * @param stuff, an object with the following properties: name, quantity, owner, condition.
 */
export async function addStuff(stuff: { name: string; quantity: number; owner: string; condition: string }) {
  // console.log(`addStuff data: ${JSON.stringify(stuff, null, 2)}`);
  let condition: Condition = 'good';
  if (stuff.condition === 'poor') {
    condition = 'poor';
  } else if (stuff.condition === 'excellent') {
    condition = 'excellent';
  } else {
    condition = 'fair';
  }
  await prisma.stuff.create({
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition,
    },
  });
  // After adding, redirect to the list page
  redirect('/list');
}

/**
 * Add ingredient to vendor list.
 */
export async function addIngredient(data: {
  owner: string;
  vendorId: string;
  name: string;
  price: number;
  size: string;
  available: boolean;
}) {
  return prisma.ingredient.create({
    data,
  });
}

/**
 * Creates a new recipe.
 */
export async function addRecipe(recipe: {
  name: string;
  image: string;
  ingredients: string;
  steps: string;
  tags: string;
  dietaryRestrictions: string[];
  owner: string;
}) {
  await prisma.recipe.create({
    data: {
      name: recipe.name,
      image: recipe.image,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      tags: recipe.tags.split(",").map(t => t.trim()),
      dietaryRestrictions: recipe.dietaryRestrictions,
      owner: recipe.owner,
    },
  });

  redirect("/browse-recipes");
}

/**
 * Edits an existing stuff in the database.
 * @param stuff, an object with the following properties: id, name, quantity, owner, condition.
 */
export async function editStuff(stuff: Stuff) {
  // console.log(`editStuff data: ${JSON.stringify(stuff, null, 2)}`);
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });
  // After updating, redirect to the list page
  redirect('/list');
}

/**
 * Edits ingredients on vendor page.
 */
export async function updateIngredient(data: {
  id: string;
  name: string;
  price: number;
  size: string;
  available: boolean;
}) {
  await prisma.ingredient.update({
    where: { id: data.id },
    data: {
      name: data.name,
      price: data.price,
      size: data.size,
      available: data.available,
    },
  });
}

/**
 * Edits user profile in the database.
 */
export async function updateUserProfile(data: {
  id: string;
  name: string;
  email: string;
  image: string;
  dietaryRestrictions: string[];
}) {
  return prisma.user.update({
    where: { id: Number(data.id) },
    data: {
      name: data.name,
      email: data.email,
      image: data.image,
      dietaryRestrictions: data.dietaryRestrictions,
    },
  });
}

/**
 * Deletes an existing stuff from the database.
 * @param id, the id of the stuff to delete.
 */
export async function deleteStuff(id: number) {
  // console.log(`deleteStuff id: ${id}`);
  await prisma.stuff.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/list');
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

export async function addFavorite(userId: number, recipeId: number) {
  return prisma.favorite.create({
    data: { userId, recipeId },
  });
}

export async function removeFavorite(userId: number, recipeId: number) {
  return prisma.favorite.deleteMany({
    where: { userId, recipeId },
  });
}

export async function toggleFavorite(userId: number, recipeId: number) {
  const existing = await prisma.favorite.findFirst({
    where: { userId, recipeId },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { favorited: false };
  }

  await prisma.favorite.create({
    data: { userId, recipeId },
  });

  return { favorited: true };
}
/**
 * Updates vendor profile information.
 */
export async function updateVendorProfile(data: {
  id: string;
  name: string;
  address: string;
  hours: string;
  owner: string; // needed for uniqueness check logic
}) {
  // Check if name is already taken by another vendor
  const existing = await prisma.vendor.findFirst({
    where: {
      name: data.name,
      id: { not: data.id }, // exclude self
    },
  });

  if (existing) {
    throw new Error('This vendor name is already taken.');
  }

  return prisma.vendor.update({
    where: { id: data.id },
    data: {
      name: data.name,
      address: data.address,
      hours: data.hours,
    },
  });
}

