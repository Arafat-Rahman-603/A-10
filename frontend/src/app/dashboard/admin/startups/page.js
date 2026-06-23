'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiCheck, HiTrash } from 'react-icons/hi';
import { HiRocketLaunch } from 'react-icons/hi2';

export default function ManageStartups() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      const res = await api.get('/startups/admin/all');
      setStartups(res.data.startups || []);
    } catch (error) {
      console.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/startups/${id}/approve`);
      setStartups(prev => prev.map(s => s._id === id ? { ...s, status: 'approved' } : s));
      toast.success('Startup approved');
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this startup and all related data?')) return;
    try {
      await api.delete(`/startups/${id}`);
      setStartups(prev => prev.filter(s => s._id !== id));
      toast.success('Startup deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const statusColors = {
    pending: 'bg-amber-500/10 text-amber-500',
    approved: 'bg-emerald-500/10 text-emerald-500',
    rejected: 'bg-red-500/10 text-red-500'
  };

  return (
    <PrivateRoute allowedRoles={['admin']}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
          Manage Startups
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>{startups.length} total startups</p>

        {startups.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p style={{ color: 'var(--text-secondary)' }}>No startups registered yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {startups.map((startup) => (
              <div key={startup._id} className="glass-card rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'var(--bg-tertiary)' }}>
                      {startup.logo ? (
                        <img src={startup.logo} alt={startup.startup_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HiRocketLaunch style={{ color: 'var(--text-tertiary)' }} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{startup.startup_name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{startup.industry}</span>
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>·</span>
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{startup.funding_stage}</span>
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>·</span>
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{startup.founder_email}</span>
                      </div>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[startup.status]}`}>
                        {startup.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {startup.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(startup._id)}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                      >
                        <HiCheck /> Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(startup._id)}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <HiTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </PrivateRoute>
  );
}
