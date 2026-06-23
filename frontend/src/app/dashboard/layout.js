'use client';

import DashboardSidebar from '@/components/DashboardSidebar';
import PrivateRoute from '@/components/PrivateRoute';

export default function DashboardLayout({ children }) {
  return (
    <PrivateRoute>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <main className="flex-1 lg:ml-0 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
            {children}
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}
