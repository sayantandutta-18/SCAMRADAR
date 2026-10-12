import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  Menu,
  X,
  Home,
  Search,
  LayoutDashboard,
  Globe,
  ShieldAlert,
  Database,
  LifeBuoy,
  Scan,
  Network,
  FolderLock,
  Bell,
  Scale,
  User,
  LogOut,
  LogIn,
  ChevronDown,
  FileText,
  Link2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getUnreadAlertCount } from '../../api/alerts.api';

const primaryNavLinks = [
  { name: 'Verify', path: '/check', icon: Search },
  { name: 'Threat Map', path: '/map', icon: Globe, badge: '3D' },
  { name: 'Scanner', path: '/scanner', icon: Scan, badge: 'OCR' },
  { name: 'Analytics', path: '/dashboard', icon: LayoutDashboard },
];

const secondaryNavLinks = [
  { name: 'Incident Database', path: '/reports', icon: FileText },
  { name: 'URL & Email Intel', path: '/intelligence/url-email', icon: Link2 },
  { name: 'Patterns', path: '/intelligence/patterns', icon: Network },
  { name: 'Vault', path: '/vault', icon: FolderLock, badge: 'Private' },
  { name: 'Alerts', path: '/alerts', icon: Bell },
  { name: 'Safety', path: '/safety', icon: ShieldAlert },
  { name: 'Blockchain Proof', path: '/explorer', icon: Database },
];

const allMobileLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Report Incident', path: '/report', icon: ShieldAlert },
  ...primaryNavLinks,
  ...secondaryNavLinks,
  { name: 'Emergency Help', path: '/emergency', icon: LifeBuoy, highlight: true },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isModerator, logout } = useAuth();
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => {
    setIsOpen(false);
    setIsToolsOpen(false);
  };

  // Close tools dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Poll unread alert count if authenticated
  useEffect(() => {
    let timer;
    const fetchUnread = async () => {
      if (isAuthenticated) {
        try {
          const res = await getUnreadAlertCount();
          if (res.success && res.data) {
            setUnreadCount(res.data.unreadCount || 0);
          }
        } catch (err) {
          // ignore network failure in polling
        }
      } else {
        setUnreadCount(0);
      }
    };

    fetchUnread();
    if (isAuthenticated) {
      timer = setInterval(fetchUnread, 30000);
    }
    return () => timer && clearInterval(timer);
  }, [isAuthenticated, location.pathname]);

  const isSecondaryActive = secondaryNavLinks.some(
    (l) => location.pathname === l.path
  );

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <NavLink to="/" className="flex items-center gap-2.5 group" onClick={closeMenu}>
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 group-hover:border-cyan-400 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.35)]">
                <Shield className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  SCAMRADAR
                </span>
                <span className="text-[9px] uppercase tracking-widest text-cyan-400/80 font-mono -mt-1 font-semibold">
                  Threat Intel
                </span>
              </div>
            </NavLink>
          </div>

          {/* Desktop Nav (Responsive from lg up to 4k) */}
          <div className="hidden lg:flex items-center space-x-1">
            {primaryNavLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`relative px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}
                  />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 font-mono">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {/* Tools Dropdown for Secondary Features */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                  isSecondaryActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Intel Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
                {unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {isToolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-52 rounded-xl bg-slate-950/95 border border-white/10 shadow-2xl backdrop-blur-xl p-1.5 z-50 space-y-0.5"
                  >
                    {secondaryNavLinks.map((link) => {
                      const isActive = location.pathname === link.path;
                      const Icon = link.icon;
                      return (
                        <NavLink
                          key={link.name}
                          to={link.path}
                          onClick={() => setIsToolsOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-cyan-500/15 text-cyan-300'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                            <span>{link.name}</span>
                          </div>
                          {link.badge && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 font-mono">
                              {link.badge}
                            </span>
                          )}
                          {link.path === '/alerts' && unreadCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-red-500 text-white">
                              {unreadCount}
                            </span>
                          )}
                        </NavLink>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Report Scam Button */}
            <NavLink
              to="/report"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                location.pathname === '/report'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'text-cyan-400 hover:text-white hover:bg-cyan-500/15 border border-cyan-500/30 bg-cyan-500/5'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <span>Report Scam</span>
            </NavLink>

            {/* Emergency Help Button */}
            <NavLink
              to="/emergency"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                location.pathname === '/emergency'
                  ? 'bg-red-500/25 text-red-300 border border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                  : 'text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 bg-red-500/5'
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>Emergency Help</span>
            </NavLink>

            {isModerator && (
              <NavLink
                to="/moderation"
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  location.pathname === '/moderation'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Moderation</span>
              </NavLink>
            )}
          </div>

          {/* User Auth & Actions */}
          <div className="flex items-center gap-2.5">
            {/* Alert Bell Pill */}
            {isAuthenticated && (
              <NavLink
                to="/alerts"
                className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-teal-400 hover:border-slate-700 transition-colors"
                title="Threat Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </NavLink>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/vault"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 hover:border-teal-500/40 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </NavLink>

                <button
                  type="button"
                  onClick={logout}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <NavLink
                to="/auth"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </NavLink>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors cursor-pointer"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 pt-3 pb-4 space-y-1">
              {allMobileLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={closeMenu}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : link.highlight
                        ? 'text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/15'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 ${
                          link.highlight ? 'text-red-400' : isActive ? 'text-cyan-400' : 'text-slate-400'
                        }`}
                      />
                      <span>{link.name}</span>
                    </div>
                    {link.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 font-mono">
                        {link.badge}
                      </span>
                    )}
                    {link.path === '/alerts' && unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                        {unreadCount} unread
                      </span>
                    )}
                  </NavLink>
                );
              })}

              {isModerator && (
                <NavLink
                  to="/moderation"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-cyan-400 bg-cyan-950/30 border border-cyan-800/40"
                >
                  <Scale className="h-4 w-4" />
                  <span>Moderation Console</span>
                </NavLink>
              )}

              {/* Mobile Auth button */}
              <div className="pt-2 border-t border-slate-800">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-500/30 text-red-400 text-sm font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out ({user?.name})
                  </button>
                ) : (
                  <NavLink
                    to="/auth"
                    onClick={closeMenu}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-500 text-slate-950 text-sm font-bold"
                  >
                    <LogIn className="w-4 h-4" /> Sign In / Register
                  </NavLink>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
