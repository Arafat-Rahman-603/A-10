'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import StartupCard from '@/components/StartupCard';
import SkeletonCard from '@/components/SkeletonCard';
import Pagination from '@/components/Pagination';
import { HiSearch } from 'react-icons/hi';

export default function BrowseStartups() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStartups();
  }, [currentPage, search]);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/startups?page=${currentPage}&limit=9&search=${search}`);
      setStartups(res.data.startups);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch startups');
      setStartups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen">
      {}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-72 h-72 bg-indigo-500/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-20 w-72 h-72 bg-pink-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-5xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>
              Browse <span className="text-gradient">Startups</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
              Discover innovative startups and find the perfect one to join or collaborate with.
            </p>

            {}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  placeholder="Search startups by name or industry..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="input-field !pl-12 !pr-24 !py-4 !rounded-2xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-2.5 !px-5 !rounded-xl text-sm"
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <SkeletonCard count={6} />
        ) : startups.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startups.map((startup, i) => (
                <StartupCard key={startup._id} startup={startup} index={i} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'var(--bg-tertiary)' }}>
              <HiSearch className="text-3xl" style={{ color: 'var(--text-tertiary)' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Startups Found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search terms.</p>
          </motion.div>
        )}
      </section>
    </div>
  );
}
