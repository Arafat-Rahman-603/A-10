'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiClock, HiBriefcase, HiCalendar, HiX, HiExternalLink, HiPaperAirplane } from 'react-icons/hi';
import { HiRocketLaunch } from 'react-icons/hi2';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function OpportunityCard({ opportunity, index = 0 }) {
  const { user, saveRedirectPath } = useAuth();
  const router = useRouter();
  const startup = opportunity.startup || opportunity.startup_id || {};
  const deadline = new Date(opportunity.deadline);
  const isExpired = deadline < new Date();
  const daysLeft = Math.max(0, Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)));

  const [showModal, setShowModal] = useState(false);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [motivation, setMotivation] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApplyClick = () => {
    if (!user) {
      if (typeof window !== 'undefined') {
        saveRedirectPath(window.location.pathname);
      }
      router.push('/login');
      return;
    }
    if (user.role !== 'collaborator') {
      toast.error('Only collaborators can apply to opportunities.');
      return;
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!motivation.trim()) {
      toast.error('Please add a motivation message.');
      return;
    }
    setApplying(true);
    try {
      await api.post('/applications', {
        opportunity_id: opportunity._id,
        portfolio_link: portfolioLink.trim(),
        motivation: motivation.trim(),
      });
      toast.success('Application submitted successfully! 🎉');
      setApplied(true);
      setShowModal(false);
      setPortfolioLink('');
      setMotivation('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application.';
      toast.error(msg);
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'var(--bg-tertiary)' }}>
                {startup.logo ? (
                  <img src={startup.logo} alt={startup.startup_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HiRocketLaunch style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-base line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                  {opportunity.role_title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  {startup.startup_name || 'Startup'}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                isExpired ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
              }`}
            >
              {isExpired ? 'Expired' : `${daysLeft}d left`}
            </span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(opportunity.required_skills || []).slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-medium"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
              >
                {skill}
              </span>
            ))}
            {(opportunity.required_skills || []).length > 4 && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                +{opportunity.required_skills.length - 4} more
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 mb-4 mt-auto" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-1.5 text-xs">
              <HiBriefcase className="text-sm" style={{ color: 'var(--gradient-start)' }} />
              {opportunity.work_type}
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <HiClock className="text-sm" style={{ color: 'var(--gradient-end)' }} />
              {opportunity.commitment_level}
            </div>
            <div className="flex items-center gap-1.5 text-xs" suppressHydrationWarning>
              <HiCalendar className="text-sm" />
              {deadline.toLocaleDateString()}
            </div>
          </div>

          {/* Industry + Apply Button */}
          <div
            className="pt-3 flex items-center justify-between gap-2"
            style={{ borderTop: '1px solid var(--border-color)' }}
          >
            {startup.industry ? (
              <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                {startup.industry}
              </span>
            ) : <span />}

            {applied ? (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                ✓ Applied
              </span>
            ) : isExpired ? (
              <span className="text-xs font-medium text-red-400">Deadline passed</span>
            ) : (
              <button
                onClick={handleApplyClick}
                className="btn-primary !py-1.5 !px-4 !text-xs !rounded-xl flex items-center gap-1.5"
              >
                <HiPaperAirplane className="text-sm" />
                Apply Now
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setShowModal(false)}
            />

            {/* Modal Card */}
            <motion.div
              className="relative w-full max-w-lg glass-card rounded-2xl p-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
              >
                <HiX />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <HiPaperAirplane className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
                      Apply for Role
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      {opportunity.role_title} · {startup.startup_name}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Portfolio Link */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Portfolio / LinkedIn URL
                    <span className="ml-1 font-normal" style={{ color: 'var(--text-tertiary)' }}>(optional)</span>
                  </label>
                  <div className="relative">
                    <HiExternalLink
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-base"
                      style={{ color: 'var(--text-tertiary)' }}
                    />
                    <input
                      type="url"
                      placeholder="https://yourportfolio.com"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      className="input-field !pl-9 !py-3"
                    />
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Why do you want to join?
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell the founder why you're a great fit, your relevant experience, and what excites you about this role..."
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    required
                    className="input-field !py-3 resize-none"
                    maxLength={1000}
                  />
                  <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-tertiary)' }}>
                    {motivation.length}/1000
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1 !py-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="btn-primary flex-1 !py-3 flex items-center justify-center gap-2"
                  >
                    {applying ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <HiPaperAirplane />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
