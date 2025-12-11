import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import UserRoleManager from '@/components/admin/UserRoleManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const AdminUsersPage = async () => {
    const session = await getServerSession(authOptions);
    adminProtectedPage(
        session as {
            user: { email: string; id: string; randomKey: string };
        } | null,
    );

    const sessionUser = session?.user as { id?: string } | undefined;
    const currentAdminId = sessionUser?.id ? Number(sessionUser.id) : 0;

    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            name: true,
        },
        orderBy: { id: 'asc' },
    });

    return (
        <AdminDashboardLayout>
            <section className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/admin" className="hover:text-indigo-600">
                        Admin
                    </Link>
                    <span>/</span>
                    <span className="text-slate-900">Users</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
                <p className="text-base text-slate-600">
                    View all users, change their roles, or delete user accounts.
                </p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">All Users</h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                        {users.length} users
                    </span>
                </div>
                <UserRoleManager users={users} currentAdminId={currentAdminId} />
            </section>
        </AdminDashboardLayout>
    );
};

export default AdminUsersPage;
