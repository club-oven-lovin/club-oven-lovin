import { getServerSession } from 'next-auth';
import { Container } from 'react-bootstrap';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';


const UserHomePage = async () => {
  const session = (await getServerSession(authOptions)) as {
    user: { email: string; id: string; randomKey: string; name?: string | null };
  } | null;

  loggedInProtectedPage(session);
  const displayName = session?.user?.name ?? session?.user?.email ?? 'friend';

  return (
    <main>
      <section className="bg-primary-subtle text-center py-5">
        <Container>
          <p className="text-uppercase text-secondary mb-2">Welcome back</p>
          <h1 className="display-4 fw-bold mb-3">Hey, {displayName}!</h1>
          <p className="lead text-muted">Ready to dive back into your kitchen creations?</p>
        </Container>
      </section>
    </main>
  );
};

export default UserHomePage;
