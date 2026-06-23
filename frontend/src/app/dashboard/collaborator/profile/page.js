'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { uploadImage } from '@/lib/uploadImage';
import api from '@/lib/axios';
import PrivateRoute from '@/components/PrivateRoute';
import toast from 'react-hot-toast';
import { HiPhotograph } from 'react-icons/hi';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.image || '');
  const [imageFile, setImageFile] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      skills: user?.skills?.join(', ') || '',
      bio: user?.bio || ''
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      let imageUrl = user?.image || '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: data.name,
        image: imageUrl,
        skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
        bio: data.bio
      };

      const res = await api.put('/users/profile', payload);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PrivateRoute allowedRoles={['collaborator']}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
          My Profile
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          Update your profile to stand out to founders.
        </p>

        <div className="glass-card rounded-2xl p-8 max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {}
            <div className="flex items-center gap-6">
              <label className="cursor-pointer group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg" style={{ background: 'var(--bg-tertiary)' }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center group-hover:bg-indigo-500/10 transition-all">
                      <HiPhotograph className="text-2xl" style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Profile Photo</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Click to upload a new photo</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Name</label>
              <input {...register('name', { required: 'Name is required' })} className="input-field" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Email</label>
              <input value={user?.email || ''} disabled className="input-field opacity-60 cursor-not-allowed" />
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Skills</label>
              <input {...register('skills')} className="input-field" placeholder="React, Node.js, Python (comma separated)" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Bio</label>
              <textarea {...register('bio', { maxLength: { value: 500, message: 'Max 500 characters' } })} className="input-field" rows={4} placeholder="Tell us about yourself..." />
              {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
            </div>

            <button type="submit" disabled={saving} className="btn-primary !py-3 !px-8 disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </motion.div>
    </PrivateRoute>
  );
}
