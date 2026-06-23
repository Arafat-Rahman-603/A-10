'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import api from '@/lib/axios';
import OpportunityCard from '@/components/OpportunityCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { HiArrowLeft, HiCurrencyDollar, HiCalendar, HiMail } from 'react-icons/hi';
import { HiRocketLaunch } from 'react-icons/hi2';

export default function StartupDetails({ params }) {
  const { id } = use(params);
  const [startup, setStartup] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStartupDetails();
  }, [id]);

  const fetchStartupDetails = async () => {
    try {
      const [startupRes, oppsRes] = await Promise.all([
        api.get(`/startups/${id}`),
        api.get(`/opportunities/startup/${id}`)
      ]);
      setStartup(startupRes.data.startup);
      setOpportunities(oppsRes.data.opportunities || []);
    } catch (error) {
      console.error('Failed to fetch startup details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading startup details..." />;
  if (!startup) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Startup Not Found</h2>
        <Link href="/startups" className="btn-primary">Back to Startups</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      {}
      <div className="relative h-64 sm:h-80 overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
        {startup.logo ? (
          <img src={startup.logo} alt={startup.startup_name} className="w-full h-full object-cover opacity-40" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/startups" className="inline-flex items-center gap-2 text-sm mb-6 hover:text-[var(--gradient-start)] transition-colors" style={{ color: 'var(--text-secondary)' }}>
            <HiArrowLeft /> Back to Startups
          </Link>

          <div className="glass-card rounded-2xl p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl" style={{ background: 'var(--bg-tertiary)' }}>
                {startup.logo ? (
                  <img src={startup.logo} alt={startup.startup_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HiRocketLaunch className="text-3xl" style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {startup.startup_name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                    {startup.industry}
                  </span>
                  <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <HiCurrencyDollar className="text-emerald-500" /> {startup.funding_stage}
                  </span>
                  <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }} suppressHydrationWarning>
                    <HiCalendar /> {new Date(startup.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                startup.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {startup.status}
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>About</h2>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{startup.description}</p>
            </div>

            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              <HiMail className="text-lg" style={{ color: 'var(--gradient-start)' }} />
              {startup.founder_email}
            </div>
          </div>

          {}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Open Opportunities ({opportunities.length})
            </h2>
            {opportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {opportunities.map((opp, i) => (
                  <OpportunityCard key={opp._id} opportunity={{ ...opp, startup }} index={i} />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-10 text-center">
                <p style={{ color: 'var(--text-secondary)' }}>No open opportunities at the moment.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
