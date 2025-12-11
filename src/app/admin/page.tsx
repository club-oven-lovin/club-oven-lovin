import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { BarChartFill, BookFill, EnvelopeFill, PatchCheckFill, PeopleFill } from 'react-bootstrap-icons';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import QuickActionButton from '@/components/admin/QuickActionButton';
import RecentReportItem from '@/components/admin/RecentReportItem';
import StatCard from '@/components/admin/StatCard';
import { adminProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type QuickAction = {
  title: string;
  detail: string;
  icon: ReactNode;
  href?: string;
};

const statCards = [
  { label: 'Total Users', value: 342, backgroundClass: 'bg-blue-600' },
  { label: 'Total Recipes', value: 156, backgroundClass: 'bg-rose-500' },
  { label: 'Total Vendors', value: 28, backgroundClass: 'bg-emerald-500' },
  { label: 'Pending Reviews', value: 7, backgroundClass: 'bg-orange-500' },
];

const quickActionItems: QuickAction[] = [
  {
    title: 'Review Flagged Content',
    detail: '3 items awaiting review',
    icon: <EnvelopeFill size={20} />,
  },
  {
    title: 'Manage Vendors',
    detail: 'View & manage vendor profiles',
    icon: <PatchCheckFill size={20} />,
    href: '/admin/vendors',
  },
  {
    title: 'Manage User Roles',
    detail: 'Update permissions & roles',
    icon: <PeopleFill size={20} />,
    href: '/admin/users',
  },
  {
    title: 'Manage Recipes',
    detail: 'Edit or remove recipes',
    icon: <BookFill size={20} />,
    href: '/admin/recipes',
  },
  {
    title: 'View Site Analytics',
    detail: 'Check traffic & KPI trends',
    icon: <BarChartFill size={20} />,
  },
];

const recentReports = [
  {
    title: 'Recipe flagged for inappropriate content',
    detail: 'Auto-flagged via moderation filters, needs admin review.',
  },
  {
    title: 'Vendor price update needed: KTA Super Stores',
    detail: 'KTA requested approval for their updated pricing sheet.',
  },
  {
    title: 'User reported broken image link',
    detail: 'Submitted by @studentchef inside "Microwave Brownies" post.',
  },
];

const userPreview = [
  { handle: '@studentchef', role: 'Student', status: 'Active' },
  { handle: '@foodmart', role: 'Vendor', status: 'Active' },
];

const pendingRecipes = [{ title: '"Microwave Brownies"', author: '@studentchef' }];

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  return (
    <AdminDashboardLayout>
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">Control Center</p>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-base text-slate-600">
          Monitor the Toaster Oven Lovin&apos; platform, respond to recent reports, and jump into frequent admin tasks.
        </p>
      </section>

      <section aria-label="System overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">System Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3" aria-label="Admin actions and reports">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900">Quick Admin Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickActionItems.map((action) => (
              <QuickActionButton key={action.title} {...action} />
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Recent Reports</h2>
          <ul className="space-y-4">
            {recentReports.map((report) => (
              <RecentReportItem key={report.title} {...report} />
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Mock features: Static admin dashboard, approve/remove buttons (non-functional)
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Users</h3>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</span>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Handle</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {userPreview.map((user) => (
                    <tr key={user.handle}>
                      <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-900">{user.handle}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-slate-600">{user.role}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-emerald-600">{user.status}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm">
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-500"
                          aria-disabled="true"
                        >
                          Edit
                        </button>
                        <span className="px-2 text-slate-300">|</span>
                        <button
                          type="button"
                          className="text-rose-500 hover:text-rose-400"
                          aria-disabled="true"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Recipes Pending Review</h3>
            <div className="mt-4 space-y-4">
              {pendingRecipes.map((recipe) => (
                <div
                  key={recipe.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-inner"
                >
                  <p className="font-semibold text-slate-900">{recipe.title}</p>
                  <p className="text-sm text-slate-600">Submitted by {recipe.author}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
                      aria-disabled="true"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-rose-200 px-4 py-1.5 text-sm font-semibold text-rose-500 shadow-sm hover:bg-rose-50"
                      aria-disabled="true"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AdminDashboardLayout>
  );
};

export default AdminPage;
