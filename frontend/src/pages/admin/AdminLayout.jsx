import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  Users,
  Calendar,
  Sparkles,
  Image,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react';

import { API_BASE } from '../../services/api';

export default function AdminLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');
  const [publicSlug, setPublicSlug] = React.useState('arun-priya');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetch(`${API_BASE}/weddings/public/current`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.slug) setPublicSlug(data.slug);
      })
      .catch(() => {});
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/wedding',   icon: Calendar,         label: 'Wedding Core' },
    { to: '/admin/couple',    icon: Heart,             label: 'Couple & Artwork' },
    { to: '/admin/family',    icon: Users,             label: 'Families & Lineage' },
    { to: '/admin/marriage',  icon: Sparkles,          label: 'Marriage Ceremony' },
    { to: '/admin/reception', icon: Sparkles,          label: 'Wedding Reception' },
    { to: '/admin/gallery',   icon: Image,             label: 'Editorial Gallery' },
    { to: '/admin/wishes',    icon: MessageSquare,     label: 'Blessings Manager' },
    { to: '/admin/settings',  icon: Settings,          label: 'Theme & Language' },
  ];

  return (
    <div className="min-h-screen bg-[#070c18] text-[#f7e7ce] flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-navy-950 border-r border-gold-500/20 p-4 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand Header */}
          <div className="pb-6 mb-6 border-b border-gold-500/20 text-center md:text-left">
            <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
              Management Portal
            </span>
            <h1 className="font-cinzel font-bold text-lg gold-text-gradient mt-0.5">
              ROYAL INVITATION
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-cinzel text-xs tracking-wider transition-all ${
                      isActive
                        ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-glow'
                        : 'text-gold-200/80 hover:bg-gold-500/10 hover:text-gold-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-gold-500/20 space-y-2 mt-6">
          <a
            href={`/invite/${publicSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-navy-900 border border-gold-500/30 text-gold-300 hover:text-white text-xs font-cinzel tracking-wider transition-colors"
          >
            <span>View Public Card</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-red-300 hover:bg-red-500/10 text-xs font-cinzel tracking-wider transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen bg-[#070c18]">
        <Outlet />
      </main>
    </div>
  );
}
