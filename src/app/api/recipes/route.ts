import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received recipe submission body:', body); // Debugging log

    if (!body || !body.name) {
      console.error('API /api/recipes error: Missing recipe data or name'); // Improved debugging log
      return new NextResponse('Missing recipe data', { status: 400 });
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        name: body.name,
        image: body.image ?? null,
        ingredients: body.ingredients ?? '',
        steps: body.steps ?? '',
        tags: body.tags ? body.tags.split(',').map((t: string) => t.trim()) : [],
        dietaryRestrictions: body.dietaryRestrictions ?? [],
        owner: body.owner ?? null,
      },
    });

    console.log('Successfully created new recipe with ID:', newRecipe.id); // Debugging log
    return NextResponse.json({ id: newRecipe.id }, { status: 201 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('API /api/recipes error during recipe creation:', err); // Improved debugging log
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
