'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <motion.div
        className={`${sizes[size]} rounded-full border-3 border-transparent`}
        style={{
          borderTopColor: 'var(--gradient-start)',
          borderRightColor: 'var(--gradient-end)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
          {text}
        </p>
      )}
    </div>
  );
}
