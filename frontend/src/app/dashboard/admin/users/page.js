'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiShieldCheck, HiBan, HiSearch } from 'react-icons/hi';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.users || []);
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (id) => {
    try {
      await api.patch(`/users/${id}/block`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: true } : u));
      toast.success('User blocked');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to block');
    }
  };

  const handleUnblock = async (id) => {
    try {
      await api.patch(`/users/${id}/unblock`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: false } : u));
      toast.success('User unblocked');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unblock');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <PrivateRoute allowedRoles={['admin']}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
          Manage Users
        </h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{users.length} total users</p>

        <div className="relative max-w-md mb-6">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field !pl-11"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>User</th>
                <th className="text-left py-4 px-4 text-sm font-semibold hidden md:table-cell" style={{ color: 'var(--text-primary)' }}>Email</th>
                <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Role</th>
                <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="transition-colors hover:bg-[var(--bg-card-hover)]" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                        alt={user.name}
                        className="w-9 h-9 rounded-lg object-cover"
                      />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.email}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.isBlocked ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {user.role !== 'admin' && (
                      user.isBlocked ? (
                        <button
                          onClick={() => handleUnblock(user._id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                        >
                          <HiShieldCheck /> Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlock(user._id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          <HiBan /> Block
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </PrivateRoute>
  );
}
