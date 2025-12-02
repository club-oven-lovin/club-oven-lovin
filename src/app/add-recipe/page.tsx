import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { loggedInProtectedPage } from "@/lib/page-protection";
import AddRecipeForm from "@/components/AddRecipeForm";

export default async function AddRecipePage() {
  // Fetch session on the server
  const session = await getServerSession(authOptions);

  // Protect page (redirects or throws if user is not logged in)
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string };
    } | null
  );

  // Render the form (which is a client component)
  return (
    <main>
      <AddRecipeForm />
    </main>
  );
}