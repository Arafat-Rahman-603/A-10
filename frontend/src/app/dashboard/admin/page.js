'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import api from '@/lib/axios';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { HiUsers, HiOfficeBuilding, HiBriefcase, HiCurrencyDollar } from 'react-icons/hi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats/admin');
      setStats(res.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: HiUsers, color: '#6366f1' },
    { label: 'Total Startups', value: stats?.totalStartups || 0, icon: HiOfficeBuilding, color: '#ec4899' },
    { label: 'Total Opportunities', value: stats?.totalOpportunities || 0, icon: HiBriefcase, color: '#10b981' },
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, icon: HiCurrencyDollar, color: '#f59e0b' },
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const userChartData = months.map((m, i) => ({
    name: m,
    users: stats?.monthlyUsers?.find(mu => mu._id === i + 1)?.count || 0
  }));

  const startupChartData = months.map((m, i) => ({
    name: m,
    startups: stats?.monthlyStartups?.find(ms => ms._id === i + 1)?.count || 0
  }));

  return (
    <PrivateRoute allowedRoles={['admin']}>
      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
            Admin Dashboard
          </h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Platform overview and management.
          </p>
        </motion.div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
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
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>User Growth</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userChartData}>
                  <defs>
                    <linearGradient id="lineGradientUsers" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }}
                    cursor={{ stroke: 'var(--border-color)', strokeWidth: 1 }}
                  />
                  <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: 12, paddingTop: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="users"
                    name="Users"
                    stroke="url(#lineGradientUsers)"
                    strokeWidth={3}
                    connectNulls
                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: '#818cf8', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Startups per Month</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={startupChartData}>
                  <defs>
                    <linearGradient id="lineGradientStartups" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }}
                    cursor={{ stroke: 'var(--border-color)', strokeWidth: 1 }}
                  />
                  <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: 12, paddingTop: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="startups"
                    name="Startups"
                    stroke="url(#lineGradientStartups)"
                    strokeWidth={3}
                    connectNulls
                    dot={{ r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </PrivateRoute>
  );
}
