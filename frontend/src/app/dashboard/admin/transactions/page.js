'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { HiCurrencyDollar } from 'react-icons/hi';

export default function Transactions() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments');
      setPayments(res.data.payments || []);
    } catch (error) {
      console.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const totalRevenue = payments.filter(p => p.payment_status === 'succeeded').reduce((sum, p) => sum + p.amount, 0);

  const statusColors = {
    succeeded: 'bg-emerald-500/10 text-emerald-500',
    pending: 'bg-amber-500/10 text-amber-500',
    failed: 'bg-red-500/10 text-red-500'
  };

  return (
    <PrivateRoute allowedRoles={['admin']}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
          Transactions
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          Total Revenue: <span className="text-gradient font-bold">${totalRevenue.toFixed(2)}</span>
        </p>

        {payments.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <HiCurrencyDollar className="text-4xl mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No transactions yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>User</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Amount</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold hidden md:table-cell" style={{ color: 'var(--text-primary)' }}>Transaction ID</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold hidden sm:table-cell" style={{ color: 'var(--text-primary)' }}>Date</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className="transition-colors hover:bg-[var(--bg-card-hover)]" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="py-4 px-4 text-sm" style={{ color: 'var(--text-primary)' }}>{payment.user_email}</td>
                    <td className="py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>${payment.amount.toFixed(2)}</td>
                    <td className="py-4 px-4 text-xs font-mono hidden md:table-cell" style={{ color: 'var(--text-tertiary)' }}>
                      {payment.transaction_id?.slice(0, 20)}...
                    </td>
                    <td className="py-4 px-4 text-sm hidden sm:table-cell" style={{ color: 'var(--text-tertiary)' }} suppressHydrationWarning>
                      {new Date(payment.paid_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[payment.payment_status]}`}>
                        {payment.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </PrivateRoute>
  );
}
