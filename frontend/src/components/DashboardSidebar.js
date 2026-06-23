'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  HiViewGrid, HiMenu, HiX, HiLogout,
  HiOfficeBuilding, HiBriefcase, HiDocumentText,
  HiUsers, HiCreditCard, HiUser, HiChartBar,
  HiCog, HiCollection
} from 'react-icons/hi';
import { HiRocketLaunch } from 'react-icons/hi2';

const menuItems = {
  admin: [
    { href: '/dashboard/admin', label: 'Overview', icon: HiViewGrid },
    { href: '/dashboard/admin/users', label: 'Manage Users', icon: HiUsers },
    { href: '/dashboard/admin/startups', label: 'Manage Startups', icon: HiOfficeBuilding },
    { href: '/dashboard/admin/transactions', label: 'Transactions', icon: HiCreditCard },
  ],
  founder: [
    { href: '/dashboard/founder', label: 'Overview', icon: HiViewGrid },
    { href: '/dashboard/founder/startup', label: 'My Startup', icon: HiRocketLaunch },
    { href: '/dashboard/founder/opportunities', label: 'Opportunities', icon: HiBriefcase },
    { href: '/dashboard/founder/applications', label: 'Applications', icon: HiDocumentText },
  ],
  collaborator: [
    { href: '/dashboard/collaborator', label: 'Overview', icon: HiViewGrid },
    { href: '/dashboard/collaborator/opportunities', label: 'Opportunities', icon: HiBriefcase },
    { href: '/dashboard/collaborator/applications', label: 'My Applications', icon: HiCollection },
    { href: '/dashboard/collaborator/profile', label: 'Profile', icon: HiUser },
  ],
};

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const items = menuItems[user.role] || [];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-3">
          <img
            src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
            alt={user.name}
            className="w-11 h-11 rounded-xl object-cover shadow-md"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
            <p className="text-xs capitalize" style={{ color: 'var(--text-tertiary)' }}>{user.role}</p>
          </div>
        </div>
      </div>

      {}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-primary text-white shadow-lg shadow-indigo-500/20'
                  : 'hover:bg-gradient-subtle'
              }`}
              style={!isActive ? { color: 'var(--text-secondary)' } : {}}
            >
              <item.icon className="text-lg flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500"
        >
          <HiLogout className="text-lg" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-40 p-2.5 rounded-xl shadow-lg"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        {isOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
      </button>

      {}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 z-40 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          background: 'var(--sidebar-bg)', 
          borderRight: '1px solid var(--border-color)',
          paddingTop: '0'
        }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
