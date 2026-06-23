'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiClock, HiBriefcase, HiCalendar } from 'react-icons/hi';
import { HiRocketLaunch } from 'react-icons/hi2';

export default function OpportunityCard({ opportunity, index = 0, linkPrefix = '/opportunities' }) {
  const startup = opportunity.startup || opportunity.startup_id || {};
  const deadline = new Date(opportunity.deadline);
  const isExpired = deadline < new Date();
  const daysLeft = Math.max(0, Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
        {}
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

        {}
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

        {}
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

        {}
        {startup.industry && (
          <div className="pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
              {startup.industry}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
