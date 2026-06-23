'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { HiExternalLink } from 'react-icons/hi';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/my-applications');
      setApplications(res.data.applications || []);
    } catch (error) {
      console.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const statusColors = {
    pending: 'bg-amber-500/10 text-amber-500',
    accepted: 'bg-emerald-500/10 text-emerald-500',
    rejected: 'bg-red-500/10 text-red-500'
  };

  return (
    <PrivateRoute allowedRoles={['collaborator']}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
          My Applications
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          Track the status of all your applications.
        </p>

        {applications.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p style={{ color: 'var(--text-secondary)' }}>You haven&apos;t applied to any opportunities yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Opportunity</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold hidden md:table-cell" style={{ color: 'var(--text-primary)' }}>Startup</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold hidden sm:table-cell" style={{ color: 'var(--text-primary)' }}>Applied</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="py-4 px-4">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {app.opportunity_id?.role_title || 'Unknown'}
                      </p>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {app.opportunity_id?.startup_id?.startup_name || 'N/A'}
                      </p>
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell" suppressHydrationWarning>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </PrivateRoute>
  );
}
