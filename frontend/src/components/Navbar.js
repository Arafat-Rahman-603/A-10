'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  HiMenu, HiX, HiSun, HiMoon, HiLogout, 
  HiViewGrid, HiChevronDown 
} from 'react-icons/hi';
import { 
  HiRocketLaunch, HiBriefcase, HiUserCircle 
} from 'react-icons/hi2';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/startups', label: 'Startups' },
    { href: '/opportunities', label: 'Opportunities' },
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav 
      className={`fixed top-0 left-0 right-100 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2 shadow-lg' 
          : 'py-4'
      }`}
      style={{ 
        background: 'var(--navbar-bg)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid var(--border-color)' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <HiRocketLaunch className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:block">StartupForge</span>
          </Link>

          {}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-gradient-subtle'
                    : 'hover:bg-gradient-subtle'
                }`}
                style={{ color: isActive(link.href) ? undefined : 'var(--text-secondary)' }}
              >
                {isActive(link.href) ? (
                  <span className="text-gradient">{link.label}</span>
                ) : (
                  link.label
                )}
              </Link>
            ))}
          </div>

          {}
          <div className="hidden md:flex items-center gap-3">
            {}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <HiSun className="text-lg" /> : <HiMoon className="text-lg" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
                  style={{ background: 'var(--bg-tertiary)' }}
                >
                  <img
                    src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <HiChevronDown className={`text-sm transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-tertiary)' }} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl overflow-hidden z-50"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                    >
                      <div className="p-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                        <p className="text-xs capitalize mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{user.role}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          href={`/dashboard/${user.role}`}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-gradient-subtle"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          <HiViewGrid className="text-lg" />
                          Dashboard
                        </Link>
                        <button
                          onClick={logout}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm w-full text-left transition-all hover:bg-red-50 text-red-500 dark:hover:bg-red-500/10"
                        >
                          <HiLogout className="text-lg" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-secondary text-sm !py-2 !px-4">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm !py-2 !px-4">
                  Register
                </Link>
              </div>
            )}
          </div>

          {}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              {theme === 'dark' ? <HiSun /> : <HiMoon />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              {isOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? 'bg-gradient-subtle'
                      : ''
                  }`}
                  style={{ color: isActive(link.href) ? undefined : 'var(--text-secondary)' }}
                >
                  {isActive(link.href) ? (
                    <span className="text-gradient">{link.label}</span>
                  ) : (
                    link.label
                  )}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    href={`/dashboard/${user.role}`}
                    className="block px-4 py-3 rounded-xl text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link href="/login" className="btn-secondary text-sm flex-1 text-center">Login</Link>
                  <Link href="/register" className="btn-primary text-sm flex-1 text-center">Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
