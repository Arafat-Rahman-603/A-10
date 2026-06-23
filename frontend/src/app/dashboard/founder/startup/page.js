'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import api from '@/lib/axios';
import { uploadImage } from '@/lib/uploadImage';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiPencil, HiTrash, HiPhotograph } from 'react-icons/hi';
import { HiRocketLaunch } from 'react-icons/hi2';

const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'AI/ML', 'SaaS', 'Social Media', 'Gaming', 'CleanTech', 'FoodTech', 'Other'];
const fundingStages = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Bootstrapped'];

export default function MyStartupPage() {
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    fetchMyStartup();
  }, []);

  const fetchMyStartup = async () => {
    try {
      const res = await api.get('/startups/user/my-startup');
      if (res.data.startup) {
        setStartup(res.data.startup);
        setLogoPreview(res.data.startup.logo);
      }
    } catch (error) {
      console.error('Failed to fetch startup');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    if (startup) {
      reset({
        startup_name: startup.startup_name,
        industry: startup.industry,
        description: startup.description,
        funding_stage: startup.funding_stage,
      });
    }
    setEditing(true);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      let logoUrl = startup?.logo || '';
      if (logoFile) {
        logoUrl = await uploadImage(logoFile);
      }

      const payload = { ...data, logo: logoUrl };

      if (startup) {
        const res = await api.put(`/startups/${startup._id}`, payload);
        setStartup(res.data.startup);
        toast.success('Startup updated!');
      } else {
        const res = await api.post('/startups', payload);
        setStartup(res.data.startup);
        toast.success('Startup created! Awaiting admin approval.');
      }
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure? This will delete your startup and all related data.')) return;
    try {
      await api.delete(`/startups/${startup._id}`);
      setStartup(null);
      setEditing(false);
      setLogoPreview(null);
      reset({});
      toast.success('Startup deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <PrivateRoute allowedRoles={['founder']}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>My Startup</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {startup ? 'Manage your startup details' : 'Create your startup to get started'}
            </p>
          </div>
          {startup && !editing && (
            <div className="flex gap-2">
              <button onClick={startEditing} className="btn-primary !py-2 !px-4 flex items-center gap-2 text-sm">
                <HiPencil /> Edit
              </button>
              <button onClick={handleDelete} className="btn-danger !py-2 !px-4 flex items-center gap-2 text-sm">
                <HiTrash /> Delete
              </button>
            </div>
          )}
        </div>

        {}
        {startup && !editing ? (
          <div className="glass-card rounded-2xl p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
              <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0" style={{ background: 'var(--bg-tertiary)' }}>
                {startup.logo ? (
                  <img src={startup.logo} alt={startup.startup_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HiRocketLaunch className="text-4xl" style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{startup.startup_name}</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                    {startup.industry}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    {startup.funding_stage}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    startup.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {startup.status}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>{startup.description}</p>
              </div>
            </div>
          </div>
        ) : (
                    <div className="glass-card rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              {startup ? 'Edit Startup' : 'Create Startup'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
              {}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Logo</label>
                <label className="cursor-pointer">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden" style={{ background: 'var(--bg-tertiary)', border: '2px dashed var(--border-color)' }}>
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <HiPhotograph className="text-2xl" style={{ color: 'var(--text-tertiary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Upload Logo</span>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Startup Name</label>
                <input {...register('startup_name', { required: 'Required' })} className="input-field" placeholder="Your startup name" />
                {errors.startup_name && <p className="text-red-500 text-xs mt-1">{errors.startup_name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Industry</label>
                <select {...register('industry', { required: 'Required' })} className="input-field">
                  <option value="">Select Industry</option>
                  {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
                {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Description</label>
                <textarea {...register('description', { required: 'Required' })} className="input-field" rows={4} placeholder="Describe your startup..." />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Funding Stage</label>
                <select {...register('funding_stage', { required: 'Required' })} className="input-field">
                  <option value="">Select Stage</option>
                  {fundingStages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.funding_stage && <p className="text-red-500 text-xs mt-1">{errors.funding_stage.message}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={submitting} className="btn-primary !py-3 !px-6 disabled:opacity-60">
                  {submitting ? 'Saving...' : startup ? 'Update Startup' : 'Create Startup'}
                </button>
                {editing && startup && (
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary !py-3 !px-6">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </PrivateRoute>
  );
}
