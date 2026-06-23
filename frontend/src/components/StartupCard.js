'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiCurrencyDollar } from 'react-icons/hi';
import { HiRocketLaunch } from 'react-icons/hi2';

export default function StartupCard({ startup, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/startups/${startup._id}`}>
        <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col group cursor-pointer">
          {}
          <div 
            className="h-48 flex items-center justify-center relative overflow-hidden"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            {startup.logo ? (
              <img
                src={startup.logo}
                alt={startup.startup_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <HiRocketLaunch className="text-5xl" style={{ color: 'var(--text-tertiary)' }} />
            )}
            <div className="absolute top-3 right-3">
              <span 
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ 
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#818cf8'
                }}
              >
                {startup.industry}
              </span>
            </div>
          </div>

          {}
          <div className="p-5 flex flex-col flex-1">
            <h3 
              className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-[var(--gradient-start)] transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              {startup.startup_name}
            </h3>
            
            <p 
              className="text-sm mb-4 line-clamp-2 flex-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              {startup.description}
            </p>

            <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-1.5">
                <HiCurrencyDollar className="text-emerald-500" />
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {startup.funding_stage}
                </span>
              </div>
              <span 
                className="text-xs font-medium px-3 py-1 rounded-full"
                style={{ 
                  background: startup.status === 'approved' 
                    ? 'rgba(16, 185, 129, 0.1)' 
                    : 'rgba(245, 158, 11, 0.1)',
                  color: startup.status === 'approved' ? '#10b981' : '#f59e0b'
                }}
              >
                {startup.status}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
