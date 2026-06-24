'use client';

import Link from 'next/link';
import { HiRocketLaunch } from 'react-icons/hi2';
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa';
import { HiMail, HiLocationMarker, HiPhone } from 'react-icons/hi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/startups', label: 'Browse Startups' },
    { href: '/opportunities', label: 'Opportunities' },
    { href: '/register', label: 'Join Now' },
  ];

  const resourceLinks = [
    { href: '#', label: 'How It Works' },
    { href: '#', label: 'For Founders' },
    { href: '#', label: 'For Collaborators' },
    { href: '#', label: 'Success Stories' },
  ];

  const socialLinks = [
    { href: 'https://github.com', icon: FaGithub, label: 'GitHub' },
    { href: 'https://twitter.com', icon: FaTwitter, label: 'Twitter' },
    { href: 'https://linkedin.com', icon: FaLinkedin, label: 'LinkedIn' },
    { href: '#', icon: FaDiscord, label: 'Discord' },
  ];

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                <HiRocketLaunch className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-gradient">StartupForge</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              The ultimate platform for startup founders and talented professionals to connect, collaborate, and build the future together.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                  aria-label={social.label}
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-[var(--gradient-start)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>
              Resources
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-[var(--gradient-start)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <HiMail className="text-lg flex-shrink-0" style={{ color: 'var(--gradient-start)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>hello@startupforge.com</span>
              </li>
              <li className="flex items-center gap-3">
                <HiPhone className="text-lg flex-shrink-0" style={{ color: 'var(--gradient-start)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <HiLocationMarker className="text-lg flex-shrink-0 mt-0.5" style={{ color: 'var(--gradient-start)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  123 Innovation Street,<br />
                  San Francisco, CA 94105
                </span>
              </li>
            </ul>
          </div>
        </div>

        {}
        <div 
          className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            © {currentYear} StartupForge. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs hover:text-[var(--gradient-start)]" style={{ color: 'var(--text-tertiary)' }}>
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs hover:text-[var(--gradient-start)]" style={{ color: 'var(--text-tertiary)' }}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
