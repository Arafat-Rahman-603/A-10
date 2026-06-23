'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import api from '@/lib/axios';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { HiDocumentText, HiClock, HiCheck } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#10b981'];

export default function CollaboratorDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats/collaborator');
      setStats(res.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const statCards = [
    { label: 'Total Applications', value: stats?.totalApplications || 0, icon: HiDocumentText, color: '#6366f1' },
    { label: 'Pending', value: stats?.pendingApplications || 0, icon: HiClock, color: '#f59e0b' },
    { label: 'Accepted', value: stats?.acceptedApplications || 0, icon: HiCheck, color: '#10b981' },
  ];

  const chartData = statCards.map(s => ({ name: s.label.split(' ').pop(), value: s.value }));

  return (
    <PrivateRoute allowedRoles={['collaborator']}>
    <Navbar/>
      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
            Collaborator Dashboard
          </h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Track your applications and find new opportunities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${stat.color}15` }}>
                <stat.icon className="text-xl" style={{ color: stat.color }} />
              </div>
              <p className="text-3xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Applications Overview</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Status Distribution</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value">
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }} />
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
