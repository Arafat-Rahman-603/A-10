'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '@/lib/axios';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiLockClosed } from 'react-icons/hi';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_')
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function PaymentModal({ onSuccess, onClose, stripeEnabled }) {
  const stripe = stripeEnabled ? useStripe() : null;
  const elements = stripeEnabled ? useElements() : null;
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    
    setProcessing(true);
    try {
      const { data } = await api.post('/payments/create-payment-intent', { amount: 2500 });
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        await api.post('/payments/confirm', {
          transaction_id: paymentIntent.id,
          amount: paymentIntent.amount
        });
        toast.success('Payment successful! You can now create unlimited opportunities.');
        onSuccess();
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleMockPayment = async () => {
    setProcessing(true);
    try {
      const randomTxId = 'ch_mock_' + Math.random().toString(36).substring(2, 15);
      await api.post('/payments/confirm', {
        transaction_id: randomTxId,
        amount: 2500
      });
      toast.success('Mock payment successful! You can now create unlimited opportunities.');
      onSuccess();
    } catch (error) {
      toast.error('Mock payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
            <HiLockClosed className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Upgrade to Premium</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            You&apos;ve reached the free limit of 3 opportunities. Upgrade for unlimited posts.
          </p>
          <p className="text-3xl font-extrabold mt-4 text-gradient">$25.00</p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>One-time payment</p>
        </div>

        <form onSubmit={stripeEnabled ? handlePayment : (e) => e.preventDefault()} className="space-y-4">
          {stripeEnabled ? (
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <CardElement
                options={{
                  style: {
                    base: { fontSize: '16px', color: 'var(--text-primary)' },
                    invalid: { color: '#ef4444' }
                  }
                }}
              />
            </div>
          ) : (
            <div className="text-center p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs">
              ⚠️ Stripe Test Keys not configured (Publishable Key must start with pk_test_).
              Please use the developer mock payment option below to unlock your account.
            </div>
          )}

          {stripeEnabled ? (
            <button type="submit" disabled={!stripe || processing} className="btn-primary w-full !py-3 disabled:opacity-60">
              {processing ? 'Processing...' : 'Pay $25.00'}
            </button>
          ) : (
            <button type="button" disabled className="w-full !py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-tertiary)] text-xs font-semibold cursor-not-allowed">
              Real Payment Disabled
            </button>
          )}
          
          <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={handleMockPayment}
              disabled={processing}
              className="w-full !py-2.5 rounded-xl border border-dashed border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-xs font-semibold text-indigo-400"
            >
              Simulate Mock Payment (Dev Mode)
            </button>
            <button type="button" onClick={onClose} className="btn-secondary w-full !py-2.5">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function CreateOpportunityForm() {
  const router = useRouter();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    fetchStartup();
  }, []);

  const fetchStartup = async () => {
    try {
      const res = await api.get('/startups/user/my-startup');
      setStartup(res.data.startup);
    } catch (error) {
      console.error('Failed to fetch startup');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!startup) {
      toast.error('Please create a startup first');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...data,
        startup_id: startup._id,
        required_skills: data.required_skills.split(',').map(s => s.trim()).filter(Boolean)
      };

      await api.post('/opportunities', payload);
      toast.success('Opportunity created!');
      router.push('/dashboard/founder/opportunities');
    } catch (error) {
      if (error.response?.status === 402) {
        setShowPayment(true);
      } else {
        toast.error(error.response?.data?.message || 'Failed to create');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  if (!startup) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Startup Found</h3>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Create a startup before posting opportunities.</p>
        <button onClick={() => router.push('/dashboard/founder/startup')} className="btn-primary">Create Startup</button>
      </div>
    );
  }

  return (
    <>
      {showPayment && (
        stripePromise ? (
          <Elements stripe={stripePromise}>
            <PaymentModal
              onSuccess={() => { setShowPayment(false); }}
              onClose={() => setShowPayment(false)}
              stripeEnabled={true}
            />
          </Elements>
        ) : (
          <PaymentModal
            onSuccess={() => { setShowPayment(false); }}
            onClose={() => setShowPayment(false)}
            stripeEnabled={false}
          />
        )
      )}


      <div className="glass-card rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Create New Opportunity</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Role Title</label>
            <input {...register('role_title', { required: 'Required' })} className="input-field" placeholder="e.g., Senior React Developer" />
            {errors.role_title && <p className="text-red-500 text-xs mt-1">{errors.role_title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Required Skills</label>
            <input {...register('required_skills', { required: 'Required' })} className="input-field" placeholder="React, Node.js, TypeScript (comma separated)" />
            {errors.required_skills && <p className="text-red-500 text-xs mt-1">{errors.required_skills.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Work Type</label>
              <select {...register('work_type', { required: 'Required' })} className="input-field">
                <option value="">Select</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              {errors.work_type && <p className="text-red-500 text-xs mt-1">{errors.work_type.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Commitment Level</label>
              <select {...register('commitment_level', { required: 'Required' })} className="input-field">
                <option value="">Select</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
              {errors.commitment_level && <p className="text-red-500 text-xs mt-1">{errors.commitment_level.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Deadline</label>
            <input type="date" {...register('deadline', { required: 'Required' })} className="input-field" />
            {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={submitting} className="btn-primary !py-3 !px-6 disabled:opacity-60">
              {submitting ? 'Creating...' : 'Create Opportunity'}
            </button>
            <button type="button" onClick={() => router.back()} className="btn-secondary !py-3 !px-6">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default function CreateOpportunityPage() {
  return (
    <PrivateRoute allowedRoles={['founder']}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-8" style={{ color: 'var(--text-primary)' }}>
          Create Opportunity
        </h1>
        <CreateOpportunityForm />
      </motion.div>
    </PrivateRoute>
  );
}
