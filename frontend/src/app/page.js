'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import StartupCard from '@/components/StartupCard';
import OpportunityCard from '@/components/OpportunityCard';
import { 
  HiLightningBolt, HiUserGroup, HiGlobe, HiShieldCheck,
  HiTrendingUp, HiChatAlt2, HiChartBar, HiStar
} from 'react-icons/hi';
import { HiRocketLaunch, HiBriefcase } from 'react-icons/hi2';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 }
};

export default function HomePage() {
  const [featuredStartups, setFeaturedStartups] = useState([]);
  const [featuredOpportunities, setFeaturedOpportunities] = useState([]);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const [startupsRes, oppsRes] = await Promise.all([
        api.get('/startups/featured').catch(() => ({ data: { startups: [] } })),
        api.get('/opportunities/featured').catch(() => ({ data: { opportunities: [] } }))
      ]);
      setFeaturedStartups(startupsRes.data.startups || []);
      setFeaturedOpportunities(oppsRes.data.opportunities || []);
    } catch (error) {
      console.error('Failed to fetch featured data');
    }
  };

  const stats = [
    { label: 'Active Startups', value: '500+', icon: HiRocketLaunch },
    { label: 'Open Roles', value: '1,200+', icon: HiBriefcase },
    { label: 'Team Members', value: '3,000+', icon: HiUserGroup },
    { label: 'Success Rate', value: '94%', icon: HiTrendingUp },
  ];

  const features = [
    { 
      icon: HiRocketLaunch, 
      title: 'Launch Your Startup', 
      desc: 'Publish your startup idea and attract the best talent from around the world.',
      gradient: 'from-indigo-500 to-purple-500'
    },
    { 
      icon: HiUserGroup, 
      title: 'Build Dream Teams', 
      desc: 'Find developers, designers, marketers, and more who share your vision.',
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      icon: HiShieldCheck, 
      title: 'Verified Profiles', 
      desc: 'Every professional is verified to ensure quality and trust in the platform.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    { 
      icon: HiGlobe, 
      title: 'Global Network', 
      desc: 'Connect with startup enthusiasts and professionals worldwide.',
      gradient: 'from-amber-500 to-orange-500'
    },
  ];

  const successStories = [
    {
      name: 'Sarah Chen',
      role: 'Founder, TechNova',
      quote: 'StartupForge helped me find my CTO and lead designer in under two weeks. Our product launched 3 months later!',
      image: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=6366f1&color=fff&size=100'
    },
    {
      name: 'Marcus Johnson',
      role: 'Full-Stack Developer',
      quote: 'I found my dream startup through this platform. The process was smooth and the team I joined is incredible.',
      image: 'https://ui-avatars.com/api/?name=Marcus+Johnson&background=ec4899&color=fff&size=100'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Founder, GreenLeaf AI',
      quote: 'The quality of applicants on StartupForge is unmatched. Every hire we made has been a game-changer.',
      image: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=10b981&color=fff&size=100'
    }
  ];

  return (
    <div>
      {}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/15 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px]" />
        </div>

        {}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
                style={{ 
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: '#818cf8',
                  border: '1px solid rgba(99, 102, 241, 0.2)'
                }}
              >
                <HiLightningBolt className="text-amber-400" />
                The #1 Platform for Startup Teams
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Build Your Dream{' '}
              <span className="text-gradient">Startup Team</span>
              {' '}Today
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              Connect with world-class developers, designers, and business minds. 
              Turn your startup vision into reality with the perfect team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/register" className="btn-primary text-base !py-4 !px-8 !rounded-2xl">
                Get Started Free →
              </Link>
              <Link href="/opportunities" className="btn-secondary text-base !py-4 !px-8 !rounded-2xl">
                Browse Opportunities
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {}
      <section className="relative py-16" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/20">
                  <stat.icon className="text-white text-xl" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gradient mb-1">{stat.value}</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--gradient-start)' }}>
              Featured Startups
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-4" style={{ color: 'var(--text-primary)' }}>
              Discover Innovative Startups
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Explore startups across industries looking for talented individuals to join their journey.
            </p>
          </motion.div>

          {featuredStartups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStartups.map((startup, i) => (
                <StartupCard key={startup._id} startup={startup} index={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { _id: '1', startup_name: 'TechNova AI', industry: 'AI/ML', description: 'Building next-gen AI solutions for enterprise automation and intelligent decision-making.', funding_stage: 'Seed', status: 'approved', logo: '' },
                { _id: '2', startup_name: 'GreenLeaf', industry: 'CleanTech', description: 'Sustainable technology solutions for reducing carbon footprint in urban environments.', funding_stage: 'Series A', status: 'approved', logo: '' },
                { _id: '3', startup_name: 'EduFlow', industry: 'Education', description: 'Revolutionizing online learning with interactive and personalized education experiences.', funding_stage: 'Pre-seed', status: 'approved', logo: '' },
              ].map((startup, i) => (
                <StartupCard key={startup._id} startup={startup} index={i} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/startups" className="btn-secondary inline-flex items-center gap-2">
              View All Startups →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY JOIN ===== */}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--gradient-end)' }}>
              Why StartupForge
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-4" style={{ color: 'var(--text-primary)' }}>
              Everything You Need to Succeed
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <feature.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED OPPORTUNITIES ===== */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--gradient-start)' }}>
              Open Opportunities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-4" style={{ color: 'var(--text-primary)' }}>
              Find Your Perfect Role
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Browse exciting roles at fast-growing startups and take the next step in your career.
            </p>
          </motion.div>

          {featuredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredOpportunities.map((opp, i) => (
                <OpportunityCard key={opp._id} opportunity={opp} index={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { _id: '1', role_title: 'Senior React Developer', required_skills: ['React', 'Node.js', 'TypeScript'], work_type: 'Remote', commitment_level: 'Full-time', deadline: new Date(Date.now() + 30*24*60*60*1000), startup: { startup_name: 'TechNova', industry: 'AI/ML' } },
                { _id: '2', role_title: 'UI/UX Designer', required_skills: ['Figma', 'UI Design', 'Prototyping'], work_type: 'Hybrid', commitment_level: 'Full-time', deadline: new Date(Date.now() + 20*24*60*60*1000), startup: { startup_name: 'GreenLeaf', industry: 'CleanTech' } },
                { _id: '3', role_title: 'Growth Marketer', required_skills: ['SEO', 'Content', 'Analytics'], work_type: 'Remote', commitment_level: 'Part-time', deadline: new Date(Date.now() + 15*24*60*60*1000), startup: { startup_name: 'EduFlow', industry: 'Education' } },
              ].map((opp, i) => (
                <OpportunityCard key={opp._id} opportunity={opp} index={i} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/opportunities" className="btn-primary inline-flex items-center gap-2">
              Browse All Opportunities →
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--gradient-start)' }}>
              Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-4" style={{ color: 'var(--text-primary)' }}>
              Hear From Our Community
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story, i) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <HiStar key={j} className="text-amber-400 text-lg" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6 italic" style={{ color: 'var(--text-secondary)' }}>
                  &ldquo;{story.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="w-11 h-11 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{story.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{story.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-6" style={{ color: 'var(--text-primary)' }}>
              Ready to Build Something{' '}
              <span className="text-gradient">Amazing?</span>
            </h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Join thousands of founders and professionals who are building the future together on StartupForge.
            </p>
            <Link href="/register" className="btn-primary text-lg !py-4 !px-10 !rounded-2xl">
              Join StartupForge Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
