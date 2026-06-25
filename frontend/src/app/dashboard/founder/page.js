'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';

import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { HiBriefcase, HiDocumentText, HiUserGroup, HiLockClosed, HiShieldCheck, HiSparkles, HiStar } from 'react-icons/hi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import toast from 'react-hot-toast';



const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

const PREMIUM_FEATURES = [
  { icon: HiSparkles, text: 'Unlimited opportunity postings' },
  { icon: HiShieldCheck, text: 'Priority support & visibility' },
  { icon: HiStar, text: 'Premium badge on your profile' },
];

function PaymentModal({ onSuccess, onClose }) {
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const { data } = await api.post('/payments/create-checkout-session');
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error('Failed to start checkout. Please try again.');
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
            Upgrade for unlimited posts and get full access.
          </p>
          <p className="text-3xl font-extrabold mt-4 text-gradient">$25.00</p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>One-time payment</p>
        </div>

        <div className="space-y-3 mb-6">
          {PREMIUM_FEATURES.map((feature, i) => (
            <div key={i} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              {feature.text}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleCheckout}
            disabled={processing}
            className="btn-primary w-full !py-3.5 disabled:opacity-60 flex items-center justify-center gap-2 text-base"
          >
            {processing ? (
              <><span className="animate-spin-slow inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Redirecting to Stripe...</>
            ) : (
              '💳 Pay with Stripe'
            )}
          </button>

          <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border-color)]">
            <button type="button" onClick={onClose} className="btn-secondary w-full !py-2.5">
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function FounderDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [statsRes, paymentRes] = await Promise.all([
        api.get('/stats/founder'),
        api.get('/payments/check').catch(() => ({ data: { hasPaid: false } }))
      ]);
      setStats(statsRes.data.stats);
      setHasPaid(paymentRes.data.hasPaid);
    } catch (error) {
      console.error('Failed to fetch stats/payment status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const statCards = [
    { title: 'My Opportunities', value: stats?.totalOpportunities || 0, icon: HiBriefcase, color: 'from-blue-500 to-indigo-600' },
    { title: 'Total Applications', value: stats?.totalApplications || 0, icon: HiDocumentText, color: 'from-emerald-500 to-teal-600' },
    { title: 'Team Size', value: stats?.acceptedMembers || 0, icon: HiUserGroup, color: 'from-purple-500 to-pink-600' },
  ];

  const chartData = stats?.applicationsOverTime || [];
  const statusData = [
    { name: 'Pending', value: stats?.pendingApplications || 0 },
    { name: 'Applications', value: stats?.totalApplications || 0 },
    { name: 'Accepted', value: stats?.acceptedMembers || 0 },
  ];

  return (
    <PrivateRoute allowedRoles={['founder']}>
      {showPayment && (
        <PaymentModal
          onSuccess={() => { setHasPaid(true); setShowPayment(false); fetchStats(); }}
          onClose={() => setShowPayment(false)}
        />
      )}

      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
            Founder Dashboard
          </h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Manage your startup, opportunities, and team applications.
          </p>
        </motion.div>

        {hasPaid ? (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <p className="text-sm font-bold text-emerald-500">Unlimited Plan Active 🚀</p>
                <p className="text-xs text-emerald-600/80 dark:text-emerald-400/60">You can post as many opportunities as you want.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-indigo-500/5 border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Free Plan</span>
                <span className="text-xs text-indigo-300">({stats?.totalOpportunities || 0} / 3 opportunities used)</span>
              </div>
              <h4 className="text-base font-bold text-[var(--text-primary)]">Upgrade to Unlimited Plan for $25</h4>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Unlock the power to recruit unlimited collaborators and grow your startup without bounds!</p>
            </div>
            <button 
              onClick={() => setShowPayment(true)}
              className="btn-primary !py-2 !px-4 text-xs font-semibold shrink-0 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-transform"
            >
              Upgrade Now
            </button>
          </div>
        )}

        {}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                  <stat.icon className="text-xl" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-3xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Overview</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="lineGradientFounder" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      color: 'var(--text-primary)'
                    }}
                    cursor={{ stroke: 'var(--border-color)', strokeWidth: 1 }}
                  />
                  <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: 12, paddingTop: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Count"
                    stroke="url(#lineGradientFounder)"
                    strokeWidth={3}
                    connectNulls
                    dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Distribution</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      color: 'var(--text-primary)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 -mt-4">
                {statusData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PrivateRoute>
  );
}
