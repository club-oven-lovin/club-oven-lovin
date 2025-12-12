import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';

type SessionUser = {
  email?: string;
  randomKey?: string;
};

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;

  if (!user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const recipeId = Number(params.id);
    if (Number.isNaN(recipeId)) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const existing = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!existing) {
      return new NextResponse('Not found', { status: 404 });
    }

    if (existing.owner !== user.email) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const body = await req.json();
    console.log('Updating recipe', recipeId, 'with body:', body);

    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        name: body.name ?? existing.name,
        image: body.image ?? existing.image,
        ingredients: body.ingredients ?? existing.ingredients,
        steps: body.steps ?? existing.steps,
        tags: body.tags
          ? body.tags.split(',').map((t: string) => t.trim())
          : existing.tags,
        dietaryRestrictions:
          body.dietaryRestrictions ?? existing.dietaryRestrictions,
      },
    });

    return NextResponse.json(updatedRecipe, { status: 200 });
  } catch (err) {
    console.error('Error updating recipe:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;

  if (!user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (user.randomKey !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 });
  }

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
