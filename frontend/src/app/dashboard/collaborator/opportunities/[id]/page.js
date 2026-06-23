'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import api from '@/lib/axios';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiBriefcase, HiClock, HiCalendar } from 'react-icons/hi';
import { HiRocketLaunch } from 'react-icons/hi2';
import Link from 'next/link';

export default function OpportunityDetailsPage({ params }) {
  const { id } = use(params);
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      const res = await api.get(`/opportunities/${id}`);
      setOpportunity(res.data.opportunity);
    } catch (error) {
      console.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setApplying(true);
    try {
      await api.post('/applications', {
        opportunity_id: id,
        ...data
      });
      toast.success('Application submitted!');
      setShowForm(false);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!opportunity) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Opportunity Not Found</h2>
      <Link href="/dashboard/collaborator/opportunities" className="btn-primary">Back to Opportunities</Link>
    </div>
  );

  const startup = opportunity.startup_id || {};
  const deadline = new Date(opportunity.deadline);
  const isExpired = deadline < new Date();

  return (
    <PrivateRoute allowedRoles={['collaborator']}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/collaborator/opportunities" className="inline-flex items-center gap-2 text-sm mb-6 hover:text-[var(--gradient-start)]" style={{ color: 'var(--text-secondary)' }}>
          <HiArrowLeft /> Back to Opportunities
        </Link>

        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0" style={{ background: 'var(--bg-tertiary)' }}>
              {startup.logo ? (
                <img src={startup.logo} alt={startup.startup_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <HiRocketLaunch className="text-2xl" style={{ color: 'var(--text-tertiary)' }} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
                {opportunity.role_title}
              </h1>
              <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
                at {startup.startup_name || 'Startup'} · {startup.industry}
              </p>

              <div className="flex flex-wrap gap-4 mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1"><HiBriefcase style={{ color: 'var(--gradient-start)' }} /> {opportunity.work_type}</span>
                <span className="flex items-center gap-1"><HiClock style={{ color: 'var(--gradient-end)' }} /> {opportunity.commitment_level}</span>
                <span className="flex items-center gap-1" suppressHydrationWarning><HiCalendar /> {deadline.toLocaleDateString()}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {opportunity.required_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {!isExpired && !showForm && (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Apply Now
            </button>
          )}
          {isExpired && (
            <p className="text-sm text-red-500 font-medium">This opportunity has expired.</p>
          )}
        </div>

        {}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Apply for this Role</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Portfolio Link</label>
                <input
                  {...register('portfolio_link', { required: 'Portfolio link is required' })}
                  className="input-field"
                  placeholder="https://your-portfolio.com"
                />
                {errors.portfolio_link && <p className="text-red-500 text-xs mt-1">{errors.portfolio_link.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Motivation Message</label>
                <textarea
                  {...register('motivation', { required: 'Motivation is required', maxLength: { value: 1000, message: 'Max 1000 characters' } })}
                  className="input-field"
                  rows={5}
                  placeholder="Tell us why you'd be a great fit..."
                />
                {errors.motivation && <p className="text-red-500 text-xs mt-1">{errors.motivation.message}</p>}
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={applying} className="btn-primary !py-3 !px-6 disabled:opacity-60">
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary !py-3 !px-6">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </motion.div>
    </PrivateRoute>
  );
}
