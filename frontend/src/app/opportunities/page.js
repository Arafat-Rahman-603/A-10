'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import OpportunityCard from '@/components/OpportunityCard';
import SkeletonCard from '@/components/SkeletonCard';
import Pagination from '@/components/Pagination';
import { HiSearch, HiFilter, HiX } from 'react-icons/hi';

const workTypes = ['Remote', 'On-site', 'Hybrid'];
const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'AI/ML', 'SaaS', 'Social Media', 'Gaming', 'CleanTech', 'FoodTech', 'Other'];

export default function BrowseOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillsSearch, setSkillsSearch] = useState('');
  const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, [currentPage, search, skillsSearch, selectedWorkTypes, selectedIndustries]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage);
      params.set('limit', 9);
      if (search) params.set('search', search);
      if (skillsSearch) params.set('skills', skillsSearch);
      if (selectedWorkTypes.length > 0) params.set('work_type', selectedWorkTypes.join(','));
      if (selectedIndustries.length > 0) params.set('industry', selectedIndustries.join(','));

      const res = await api.get(`/opportunities?${params.toString()}`);
      setOpportunities(res.data.opportunities || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error('Failed to fetch opportunities');
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (value, selected, setSelected) => {
    setCurrentPage(1);
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSkillsSearch('');
    setSelectedWorkTypes([]);
    setSelectedIndustries([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = search || skillsSearch || selectedWorkTypes.length > 0 || selectedIndustries.length > 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-72 h-72 bg-purple-500/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>
              Browse <span className="text-gradient">Opportunities</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
              Find the perfect role at innovative startups. Filter by skills, work type, and industry.
            </p>

            {/* Search Bars */}
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="relative">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  placeholder="Search by role title..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="input-field !pl-12 !py-4 !rounded-2xl"
                />
              </div>
              <div className="relative">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  placeholder="Search by skills (e.g., React, Python, Design)..."
                  value={skillsSearch}
                  onChange={(e) => { setSkillsSearch(e.target.value); setCurrentPage(1); }}
                  className="input-field !pl-12 !py-4 !rounded-2xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Filter Toggle & Active Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary !py-2.5 !px-4 flex items-center gap-2 text-sm"
            >
              <HiFilter /> Filters
              {hasActiveFilters && (
                <span className="w-5 h-5 rounded-full bg-gradient-primary text-white text-xs flex items-center justify-center">
                  {selectedWorkTypes.length + selectedIndustries.length}
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm flex items-center gap-1 text-red-500 hover:text-red-400">
                <HiX /> Clear All
              </button>
            )}
          </div>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {total} {total === 1 ? 'opportunity' : 'opportunities'} found
          </p>
        </div>

        {}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-2xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {}
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Work Type</h3>
                <div className="flex flex-wrap gap-2">
                  {workTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => toggleFilter(type, selectedWorkTypes, setSelectedWorkTypes)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedWorkTypes.includes(type) ? 'bg-gradient-primary text-white shadow-md' : ''
                      }`}
                      style={!selectedWorkTypes.includes(type) ? {
                        background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)'
                      } : {}}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              {}
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Industry</h3>
                <div className="flex flex-wrap gap-2">
                  {industries.map(ind => (
                    <button
                      key={ind}
                      onClick={() => toggleFilter(ind, selectedIndustries, setSelectedIndustries)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        selectedIndustries.includes(ind) ? 'bg-gradient-primary text-white shadow-md' : ''
                      }`}
                      style={!selectedIndustries.includes(ind) ? {
                        background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)'
                      } : {}}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {}
        {loading ? (
          <SkeletonCard count={6} />
        ) : opportunities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp, i) => (
                <OpportunityCard key={opp._id} opportunity={opp} index={i} />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'var(--bg-tertiary)' }}>
              <HiSearch className="text-3xl" style={{ color: 'var(--text-tertiary)' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Opportunities Found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or search terms.</p>
          </motion.div>
        )}
      </section>
    </div>
  );
}
