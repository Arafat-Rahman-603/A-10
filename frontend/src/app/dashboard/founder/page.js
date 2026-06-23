'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import Navbar from '@/components/Navbar';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { HiBriefcase, HiDocumentText, HiUserGroup } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

export default function FounderDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats/founder');
      setStats(res.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const statCards = [
    { label: 'Total Opportunities', value: stats?.totalOpportunities || 0, icon: HiBriefcase, color: '#6366f1' },
    { label: 'Total Applications', value: stats?.totalApplications || 0, icon: HiDocumentText, color: '#ec4899' },
    { label: 'Accepted Members', value: stats?.acceptedMembers || 0, icon: HiUserGroup, color: '#10b981' },
  ];

  const chartData = [
    { name: 'Opportunities', value: stats?.totalOpportunities || 0 },
    { name: 'Applications', value: stats?.totalApplications || 0 },
    { name: 'Accepted', value: stats?.acceptedMembers || 0 },
  ];

  return (
    <PrivateRoute allowedRoles={['founder']}>
    <Navbar/>
      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
            Founder Dashboard
          </h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Manage your startup, opportunities, and team applications.
          </p>
        </motion.div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Overview</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
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
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((_, i) => (
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
                {chartData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
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
