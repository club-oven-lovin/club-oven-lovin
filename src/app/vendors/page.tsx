import { getServerSession } from 'next-auth';
import { Container } from 'react-bootstrap';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import Vendor from '@/components/Vendor';

const VendorPage = async () => {
  const session = await getServerSession(authOptions);

  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const owner = session?.user?.email || '';

  // Fetch vendor profile for logged in user
  let vendor = null;
  let vendorFetchError: string | null = null;
  try {
    vendor = await prisma.vendor.findFirst({
      where: { owner },
      include: { ingredients: true },
    });
  } catch (err) {
    // In production (e.g. Vercel) missing DB env vars or network issues
    // can cause this to throw. Surface a friendly message instead of
    // crashing the whole route.
    // eslint-disable-next-line no-console
    console.error('Error fetching vendor profile:', err);
    vendorFetchError = 'Vendor data is currently unavailable.';
  }

  return (
    <main>
      <Container className="py-4">
        {vendorFetchError ? (
          <div className="alert alert-warning" role="alert">
            {vendorFetchError} Please check the deployment environment variables (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL).
          </div>
        ) : (
          <Vendor vendor={vendor} ingredients={vendor?.ingredients ?? []} />
        )}
      </Container>
    </main>
  );
};

export default VendorPage;