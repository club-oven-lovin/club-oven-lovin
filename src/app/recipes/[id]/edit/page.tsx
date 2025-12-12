import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Container } from 'react-bootstrap';
import EditRecipeForm from '@/components/EditRecipeForm';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';

interface EditRecipePageProps {
  params: { id: string };
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { email?: string } | undefined;

  if (!user?.email) {
    // send non-logged users away
    redirect('/login'); // or '/user-home-page', up to you
  }

  const recipeId = Number(params.id);
  if (Number.isNaN(recipeId)) {
    notFound();
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) {
    notFound();
  }

  // 🔒 Only owner can SEE this page
  if (recipe.owner !== user.email) {
    redirect('/not-authorized'); // or `/recipes/${recipe.id}` if you prefer
  }

  return (
    <Container className="py-4">
      <h1>Edit Recipe</h1>
      <EditRecipeForm recipe={recipe} />
    </Container>
  );
}
