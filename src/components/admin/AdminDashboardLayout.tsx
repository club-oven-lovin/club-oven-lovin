import React from 'react';

type AdminDashboardLayoutProps = {
  children: React.ReactNode;
};

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children }) => (
  <main className="flex-1 bg-slate-50 py-8 sm:py-12">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">{children}</div>
  </main>
);

export default AdminDashboardLayout;
