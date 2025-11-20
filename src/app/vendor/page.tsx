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
  const vendor = await prisma.vendor.findFirst({
    where: { owner },
    include: { ingredients: true }
  });

  return (
    <main>
      <Container className="py-4">
        <Vendor
          vendor={vendor}
          ingredients={vendor?.ingredients ?? []}
        />
      </Container>
    </main>
  );
};

export default VendorPage;