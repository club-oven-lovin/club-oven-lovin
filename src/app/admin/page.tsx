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
  { label: 'Total Users', value: 342, accentStart: '#fff3ec', accentEnd: '#ffd1b8' },
  { label: 'Total Recipes', value: 156, accentStart: '#fff1ea', accentEnd: '#ffc8a5' },
  { label: 'Total Vendors', value: 28, accentStart: '#fff5ee', accentEnd: '#ffd9c0' },
  { label: 'Pending Reviews', value: 7, accentStart: '#fff0e7', accentEnd: '#ffcba6' },
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
      <section
        className="rounded-3xl p-8 text-white shadow-lg"
        style={{ background: `linear-gradient(120deg, #ff6b35, #ff9248)` }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Control Center</p>
        <h1 className="mt-2 text-4xl font-bold">Admin Dashboard</h1>
        <p className="mt-3 max-w-2xl text-lg opacity-90">
          Monitor the Toaster Oven Lovin&apos; platform, respond to recent reports, and jump into frequent admin tasks.
        </p>
      </section>

      <section aria-label="System overview" className="space-y-6">
        <h2 className="text-2xl font-bold" style={{ color: '#2A2A2A' }}>
          System Overview
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3" aria-label="Admin actions and reports">
        <div className="space-y-6 lg:col-span-2">
          <h2 className="text-2xl font-bold" style={{ color: '#2A2A2A' }}>
            Quick Admin Actions
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {quickActionItems.map((action) => (
              <QuickActionButton key={action.title} {...action} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: '#2A2A2A' }}>
            Recent Reports
          </h2>
          <ul className="space-y-6">
            {recentReports.map((report) => (
              <RecentReportItem key={report.title} {...report} />
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Mock features: Static admin dashboard preview
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold" style={{ color: '#2A2A2A' }}>
                Latest Users
              </h3>
              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Preview</span>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-orange-100 text-sm">
                <thead className="text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="pb-3">Handle</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {userPreview.map((user) => (
                    <tr key={user.handle}>
                      <td className="whitespace-nowrap py-4 font-bold" style={{ color: '#2A2A2A' }}>
                        {user.handle}
                      </td>
                      <td className="whitespace-nowrap py-4 text-slate-600">{user.role}</td>
                      <td className="whitespace-nowrap py-4 font-medium text-emerald-600">{user.status}</td>
                      <td className="whitespace-nowrap py-4 text-sm">
                        <button
                          type="button"
                          className="font-semibold text-[#2A2A2A] hover:underline"
                          aria-disabled="true"
                        >
                          Edit
                        </button>
                        <span className="px-3 text-slate-300">|</span>
                        <button
                          type="button"
                          className="font-semibold text-rose-500 hover:text-rose-600"
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

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold" style={{ color: '#2A2A2A' }}>
              Recipes Pending Review
            </h3>
            <div className="mt-6 space-y-4">
              {pendingRecipes.map((recipe) => (
                <div
                  key={recipe.title}
                  className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5 transition hover:bg-orange-50"
                >
                  <p className="font-bold text-[#2A2A2A]">{recipe.title}</p>
                  <p className="text-sm text-slate-600">Submitted by {recipe.author}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-full px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
                      style={{ backgroundColor: '#2A2A2A' }}
                      aria-disabled="true"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-rose-200 px-5 py-2 text-sm font-bold text-rose-500 transition hover:bg-rose-50"
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
