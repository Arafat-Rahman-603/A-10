'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiClock, HiBriefcase } from 'react-icons/hi';

export default function ManageOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const res = await api.get('/opportunities/founder/my-opportunities');
      setOpportunities(res.data.opportunities || []);
    } catch (error) {
      console.error('Failed to fetch opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this opportunity?')) return;
    try {
      await api.delete(`/opportunities/${id}`);
      setOpportunities(prev => prev.filter(o => o._id !== id));
      toast.success('Opportunity deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const startEdit = (opp) => {
    setEditingId(opp._id);
    setEditData({
      role_title: opp.role_title,
      required_skills: opp.required_skills.join(', '),
      work_type: opp.work_type,
      commitment_level: opp.commitment_level,
      deadline: new Date(opp.deadline).toISOString().split('T')[0]
    });
  };

  const handleUpdate = async (id) => {
    try {
      const payload = {
        ...editData,
        required_skills: editData.required_skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await api.put(`/opportunities/${id}`, payload);
      setOpportunities(prev => prev.map(o => o._id === id ? { ...o, ...res.data.opportunity } : o));
      setEditingId(null);
      toast.success('Opportunity updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <PrivateRoute allowedRoles={['founder']}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Manage Opportunities</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {opportunities.length} opportunities posted
            </p>
          </div>
          <Link href="/dashboard/founder/opportunities/create" className="btn-primary !py-2.5 !px-4 flex items-center gap-2 text-sm">
            <HiPlus /> Create New
          </Link>
        </div>

        {opportunities.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <HiBriefcase className="text-4xl mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Opportunities Yet</h3>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Create your first opportunity to start recruiting.</p>
            <Link href="/dashboard/founder/opportunities/create" className="btn-primary">
              Create Opportunity
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opp) => (
              <div key={opp._id} className="glass-card rounded-2xl p-6">
                {editingId === opp._id ? (
                                    <div className="space-y-4">
                    <input value={editData.role_title} onChange={e => setEditData({...editData, role_title: e.target.value})} className="input-field" placeholder="Role Title" />
                    <input value={editData.required_skills} onChange={e => setEditData({...editData, required_skills: e.target.value})} className="input-field" placeholder="Skills (comma separated)" />
                    <div className="grid grid-cols-2 gap-4">
                      <select value={editData.work_type} onChange={e => setEditData({...editData, work_type: e.target.value})} className="input-field">
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                      <select value={editData.commitment_level} onChange={e => setEditData({...editData, commitment_level: e.target.value})} className="input-field">
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                    <input type="date" value={editData.deadline} onChange={e => setEditData({...editData, deadline: e.target.value})} className="input-field" />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(opp._id)} className="btn-primary !py-2 !px-4 text-sm">Save</button>
                      <button onClick={() => setEditingId(null)} className="btn-secondary !py-2 !px-4 text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{opp.role_title}</h3>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {opp.required_skills.map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        <span className="flex items-center gap-1"><HiBriefcase /> {opp.work_type}</span>
                        <span className="flex items-center gap-1"><HiClock /> {opp.commitment_level}</span>
                        <span suppressHydrationWarning>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(opp)} className="btn-secondary !py-2 !px-3 text-sm">
                        <HiPencil />
                      </button>
                      <button onClick={() => handleDelete(opp._id)} className="btn-danger !py-2 !px-3 text-sm">
                        <HiTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </PrivateRoute>
  );
}
