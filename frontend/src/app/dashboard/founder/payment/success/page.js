'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { HiCheckCircle, HiXCircle, HiArrowRight } from 'react-icons/hi';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('verifying');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setStatus('error');
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const { data } = await api.get(`/payments/verify-session?session_id=${sessionId}`);
      if (data.success && data.hasPaid) {
        setStatus('success');
        toast.success('Payment verified successfully!');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
      toast.error('Failed to verify payment.');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-12 max-w-lg w-full"
        >
          <div className="w-20 h-20 rounded-full bg-indigo-500/15 flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin-slow w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Verifying Payment...
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Please wait while we confirm your payment with Stripe.
          </p>
        </motion.div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-12 max-w-lg w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-6"
          >
            <HiXCircle className="w-12 h-12 text-red-500" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Payment Verification Failed
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            We couldn&apos;t verify your payment. If you were charged, please contact support.
          </p>
          <button
            onClick={() => router.push('/dashboard/founder')}
            className="btn-primary !py-3 !px-8 inline-flex items-center gap-2"
          >
            Back to Dashboard <HiArrowRight />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-12 max-w-lg w-full relative overflow-hidden"
      >
        {/* Animated background confetti effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'][i],
                left: `${15 + i * 14}%`,
                top: '-10px',
              }}
              animate={{
                y: [0, 400],
                x: [0, (i % 2 === 0 ? 30 : -30)],
                opacity: [1, 0],
                scale: [1, 0.5],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-6 relative"
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-500/10"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <HiCheckCircle className="w-14 h-14 text-emerald-500 relative z-10" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-extrabold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Payment Successful!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-sm mb-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          Your account has been upgraded to <span className="font-bold text-emerald-400">Premium</span>.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xs mb-8"
          style={{ color: 'var(--text-tertiary)' }}
        >
          You can now post unlimited opportunities and recruit top talent.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => router.push('/dashboard/founder')}
          className="btn-primary !py-3.5 !px-8 inline-flex items-center gap-2 text-base"
        >
          Go to Dashboard <HiArrowRight />
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <PrivateRoute allowedRoles={['founder']}>
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <PaymentSuccessContent />
      </Suspense>
    </PrivateRoute>
  );
}
