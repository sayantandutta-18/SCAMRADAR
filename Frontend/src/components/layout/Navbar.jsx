import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getUnreadAlertCount } from '../../api/alerts.api';

const navLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Verify', path: '/check', icon: Search },
  { name: 'Threat Map', path: '/map', icon: Globe, badge: '3D' },
  { name: 'Scanner', path: '/scanner', icon: Scan, badge: 'OCR' },
  { name: 'Analytics', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Patterns', path: '/intelligence/patterns', icon: Network },
  { name: 'Vault', path: '/vault', icon: FolderLock, badge: 'Private' },
  { name: 'Alerts', path: '/alerts', icon: Bell },
  { name: 'Safety', path: '/safety', icon: ShieldAlert },
  { name: 'Emergency', path: '/emergency', icon: LifeBuoy, highlight: true },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isModerator, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

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

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`relative px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : link.highlight
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/25 bg-red-500/5'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      link.highlight ? 'text-red-400' : isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 font-mono">
                      {link.badge}
                    </span>
                  )}
                  {link.path === '/alerts' && unreadCount > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-red-500 text-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              );
            })}

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
                  onClick={logout}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                  title="Sign Out"
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

            {/* Mobile Hamburger */}
            <button
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              className="xl:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors"
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
            className="xl:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 pt-3 pb-4 space-y-1">
              {navLinks.map((link) => {
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
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-500/30 text-red-400 text-sm font-semibold"
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
