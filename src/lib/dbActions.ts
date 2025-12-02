'use server';

import { Stuff, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

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
