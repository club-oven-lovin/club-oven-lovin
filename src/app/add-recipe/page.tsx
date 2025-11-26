import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import AddRecipeForm from '@/components/AddRecipeForm';

const AddRecipePage = async () => {
  // Get the session for the currently logged-in user
  const session = await getServerSession(authOptions);

  // Protect the page; only allow logged-in users
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null
  );

  return (
    <main>
      <AddRecipeForm />
    </main>
  );
};

export default AddRecipePage;
