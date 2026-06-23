'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import PrivateRoute from '@/components/PrivateRoute';
import OpportunityCard from '@/components/OpportunityCard';
import SkeletonCard from '@/components/SkeletonCard';
import Pagination from '@/components/Pagination';
import { HiSearch } from 'react-icons/hi';

export default function CollaboratorOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOpportunities();
  }, [currentPage, search]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/opportunities?page=${currentPage}&limit=9&search=${search}`);
      setOpportunities(res.data.opportunities || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateRoute allowedRoles={['collaborator']}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
          Browse Opportunities
        </h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Find the perfect role for your skills.</p>

        <div className="relative max-w-lg mb-8">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="input-field !pl-11"
          />
        </div>

        {loading ? (
          <SkeletonCard count={6} />
        ) : opportunities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {opportunities.map((opp, i) => (
                <OpportunityCard key={opp._id} opportunity={opp} index={i} />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p style={{ color: 'var(--text-secondary)' }}>No opportunities found.</p>
          </div>
        )}
      </motion.div>
    </PrivateRoute>
  );
}
