'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiCheck, HiX, HiMail, HiExternalLink } from 'react-icons/hi';

export default function FounderApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/founder');
      setApplications(res.data.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.patch(`/applications/${id}/${action}`);
      setApplications(prev => prev.map(app => 
        app._id === id ? { ...app, status: action === 'accept' ? 'accepted' : 'rejected' } : app
      ));
      toast.success(`Application ${action}ed`);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action}`);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const statusColors = {
    pending: 'bg-amber-500/10 text-amber-500',
    accepted: 'bg-emerald-500/10 text-emerald-500',
    rejected: 'bg-red-500/10 text-red-500'
  };

  return (
    <PrivateRoute allowedRoles={['founder']}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
          Applications
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          Review and manage applications for your opportunities.
        </p>

        {applications.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p style={{ color: 'var(--text-secondary)' }}>No applications received yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="glass-card rounded-2xl p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        {app.opportunity_id?.role_title || 'Unknown Role'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[app.status]}`}>
                        {app.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <HiMail style={{ color: 'var(--gradient-start)' }} />
                      {app.applicant_email}
                    </div>

                    {app.portfolio_link && (
                      <a href={app.portfolio_link} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center gap-1 text-sm mb-2 hover:underline" style={{ color: 'var(--gradient-start)' }}>
                        <HiExternalLink /> Portfolio
                      </a>
                    )}
                    
                    <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                      <strong>Motivation:</strong> {app.motivation}
                    </p>

                    <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }} suppressHydrationWarning>
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>

                  {app.status === 'pending' && (
                    <div className="flex sm:flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleAction(app._id, 'accept')}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                      >
                        <HiCheck /> Accept
                      </button>
                      <button
                        onClick={() => handleAction(app._id, 'reject')}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        <HiX /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </PrivateRoute>
  );
}
