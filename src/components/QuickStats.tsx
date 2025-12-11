
import { prisma } from '@/lib/prisma';

type StatCardProps = {
  label: string;
  value: string | number;
  testId: string;
};

const orangeColor = '#ff6b35';
const creamColor = '#fff8f1';

function StatCard({ label, value, testId }: StatCardProps) {
  return (
    <div
      data-testid={testId}
      className="rounded-xl bg-white shadow-sm px-6 py-5 flex flex-col items-center justify-center"
    >
      <div
        className="text-3xl md:text-4xl font-extrabold"
        style={{ color: orangeColor }}
      >
        {value}
      </div>
      <div className="mt-1 text-sm text-slate-600">{label}</div>
    </div>
  );
}

// NOTE: no "use client" here — this stays a SERVER component.
export default async function QuickStats() {
  // 1) Log a page visit (but never crash the build if this fails)
  try {
    await prisma.pageVisit.create({
      data: {
        path: '/',
      },
    });
  } catch (err) {
    console.error('Error logging page visit in QuickStats', err);
  }

  // 2) Fetch counts (again, don’t let errors kill the build)
  let recipeCount = 0;
  let visitCount = 0;
  let userCount = 0;

  try {
    recipeCount = await prisma.recipe.count();
    visitCount = await prisma.pageVisit.count();
    userCount = await prisma.user.count();
  } catch (err) {
    console.error('Error fetching quick stats', err);
  }

  return (
    <section
      className="w-full py-10 px-6 md:px-10"
      style={{ backgroundColor: creamColor }}
      data-testid="quick-stats-section"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center mb-6 text-2xl md:text-3xl font-bold text-orange-500">
          Quick Stats
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
          <StatCard
            label="Recipes"
            value={recipeCount}
            testId="stat-recipes"
          />
          <StatCard
            label="Visits"
            value={visitCount}
            testId="stat-visits"
          />
          <StatCard
            label="User Profiles"
            value={userCount}
            testId="stat-users"
          />
          <StatCard
            label="Reviews"
            value="4.2 ★"
            testId="stat-reviews"
          />
        </div>
      </div>
    </section>
  );
}
