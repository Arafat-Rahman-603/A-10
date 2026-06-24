'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { uploadImage } from '@/lib/uploadImage';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiUser, HiPhotograph } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { HiRocketLaunch } from 'react-icons/hi2';
import Script from 'next/script';
import axios from 'axios';

export default function RegisterPage() {
  const { register: authRegister, googleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { role: 'collaborator' }
  });

  const initGoogleAuth = () => {
    if (window.google) {
      setGoogleLoaded(true);
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          scope: 'email profile',
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              setLoading(true);
              try {
                const userInfoRes = await axios.get(
                  `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
                );
                const { name, email, picture } = userInfoRes.data;
                const selectedRole = watch('role') || 'collaborator';
                await googleLogin({ name, email, image: picture, role: selectedRole });
                toast.success('Welcome back!');
              } catch (error) {
                console.error('Google login error:', error);
                toast.error(error.response?.data?.message || 'Google authentication failed');
              } finally {
                setLoading(false);
              }
            }
          },
        });
        setTokenClient(client);
      } catch (error) {
        console.error('Error initializing Google Auth Client:', error);
      }
    }
  };

  useEffect(() => {
    if (window.google && !tokenClient) {
      initGoogleAuth();
    }
  }, []);

  const handleGoogleSignup = () => {
    if (!tokenClient) {
      toast.error('Google Sign-In is still loading. Please try again.');
      return;
    }
    tokenClient.requestAccessToken();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch {
          toast.error('Image upload failed. Continuing without image.');
        }
      }

      await authRegister({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        image: imageUrl || undefined
      });
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script 
        src="https://accounts.google.com/gsi/client" 
        onLoad={initGoogleAuth}
        strategy="afterInteractive"
      />
      <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-pink-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-xl">
              <HiRocketLaunch className="text-white text-2xl" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
            Create Your Account
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Join StartupForge and start building your dream team
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8">
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading || !googleLoaded}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:shadow-md mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
            <FcGoogle className="text-xl" />
            {!googleLoaded ? 'Loading Google Sign-in...' : 'Sign up with Google'}
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {}
            <div className="flex justify-center">
              <label className="cursor-pointer group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden relative shadow-lg" style={{ background: 'var(--bg-tertiary)' }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 group-hover:bg-indigo-500/10 transition-all">
                      <HiPhotograph className="text-2xl" style={{ color: 'var(--text-tertiary)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Upload</span>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Name</label>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
                <input
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Your full name"
                  className="input-field !pl-11"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Email</label>
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className="input-field !pl-11"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                    validate: {
                      hasUpper: v => /[A-Z]/.test(v) || 'Must contain an uppercase letter',
                      hasLower: v => /[a-z]/.test(v) || 'Must contain a lowercase letter',
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field !pl-11 !pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              <p className="text-xs mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                Min 6 chars, 1 uppercase, 1 lowercase
              </p>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {['founder', 'collaborator'].map(role => (
                  <label
                    key={role}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl cursor-pointer text-sm font-medium transition-all ${
                      watch('role') === role ? 'bg-gradient-primary text-white shadow-lg' : ''
                    }`}
                    style={watch('role') !== role ? {
                      background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)'
                    } : {}}
                  >
                    <input
                      {...register('role')}
                      type="radio"
                      value={role}
                      className="hidden"
                    />
                    {role === 'founder' ? <HiRocketLaunch /> : <HiUser />}
                    <span className="capitalize">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3.5 !rounded-2xl text-base disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--gradient-start)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
    </>
  );
}
