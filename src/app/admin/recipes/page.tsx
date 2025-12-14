import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import RecipeManager from '@/components/admin/RecipeManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const AdminRecipesPage = async () => {
    const session = await getServerSession(authOptions);
    adminProtectedPage(
        session as {
            user: { email: string; id: string; randomKey: string };
        } | null,
    );

    const recipes = await prisma.recipe.findMany({
        select: {
            id: true,
            name: true,
            owner: true,
            createdAt: true,
            tags: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <AdminDashboardLayout>
            <section className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/admin" className="hover:text-indigo-600">
                        Admin
                    </Link>
                    <span>/</span>
                    <span className="text-slate-900">Recipes</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Recipe Management</h1>
                <p className="text-base text-slate-600">
                    View all recipes, edit content, or remove inappropriate/inaccurate recipes.
                </p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">All Recipes</h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                        {recipes.length} recipes
                    </span>
                </div>
                <RecipeManager recipes={recipes} />
            </section>
        </AdminDashboardLayout>
    );
};

export default AdminRecipesPage;
