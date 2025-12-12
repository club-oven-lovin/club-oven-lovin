import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';

type SessionUser = {
  email?: string;
  randomKey?: string;
};

export async function POST(req: Request) {
  // 🔒 require login
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;

  if (!user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    console.log('Received recipe submission body:', body);

    if (!body || !body.name) {
      console.error('API /api/recipes error: Missing recipe data or name');
      return new NextResponse('Missing recipe data', { status: 400 });
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        name: body.name,
        image: body.image || '',
        ingredients: body.ingredients || '',
        steps: body.steps || '',
        tags: body.tags
          ? body.tags.split(',').map((t: string) => t.trim())
          : [],
        dietaryRestrictions: body.dietaryRestrictions ?? [],
        owner: user.email,
      },
    });

    console.log('Successfully created new recipe with ID:', newRecipe.id);
    return NextResponse.json({ id: newRecipe.id }, { status: 201 });
  } catch (err) {
    console.error('API /api/recipes error during recipe creation:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
