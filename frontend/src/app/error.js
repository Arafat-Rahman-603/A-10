'use client';

import { motion } from 'framer-motion';
import { HiExclamationCircle } from 'react-icons/hi';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <HiExclamationCircle className="text-red-500 text-4xl" />
        </div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Something Went Wrong
        </h2>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button onClick={reset} className="btn-primary">
          Try Again
        </button>
      </motion.div>
    </div>
  );
}
