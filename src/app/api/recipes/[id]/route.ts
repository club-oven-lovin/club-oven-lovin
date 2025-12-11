
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Update a recipe
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = Number(params.id);
    if (Number.isNaN(recipeId)) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const body = await req.json();
    console.log('Updating recipe', recipeId, 'with body:', body);

    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        name: body.name,
        image: body.image || '',
        ingredients: body.ingredients || '',
        steps: body.steps || '',
        tags: body.tags
          ? body.tags.split(',').map((t: string) => t.trim())
          : [],
        dietaryRestrictions: body.dietaryRestrictions ?? [],
        owner: body.owner || 'anonymous',
      },
    });

    return NextResponse.json(updatedRecipe, { status: 200 });
  } catch (err) {
    console.error('Error updating recipe:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Delete a recipe
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = Number(params.id);
    if (Number.isNaN(recipeId)) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    await prisma.recipe.delete({
      where: { id: recipeId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Error deleting recipe:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
