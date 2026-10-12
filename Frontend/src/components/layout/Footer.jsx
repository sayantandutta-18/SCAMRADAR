import React from 'react';
import { Shield, Lock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-500" />
              <span className="font-bold text-xl text-white">ScamRadar</span>
            </div>
            <p className="text-slate-400 max-w-sm">
              Empowering individuals and organizations to detect, report, and prevent digital fraud through advanced AI and community intelligence.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <Lock className="h-3.5 w-3.5" />
              AI + Blockchain Powered
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/check" className="text-slate-400 hover:text-white transition-colors">Verify Identifier</Link></li>
              <li><Link to="/report" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">Submit Scam Report</Link></li>
              <li><Link to="/scanner" className="text-slate-400 hover:text-cyan-300 transition-colors">OCR Message Scanner</Link></li>
              <li><Link to="/intelligence/patterns" className="text-slate-400 hover:text-cyan-300 transition-colors">Pattern Intelligence Graph</Link></li>
              <li><Link to="/intelligence/url-email" className="text-slate-400 hover:text-cyan-300 transition-colors">URL & Email Intel</Link></li>
              <li><Link to="/map" className="text-slate-400 hover:text-white transition-colors">3D Threat Map</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/safety" className="text-slate-400 hover:text-white transition-colors">Safety Guides</Link></li>
              <li><Link to="/emergency" className="text-red-400 hover:text-red-300 transition-colors font-medium">Emergency Help (1930)</Link></li>
              <li><Link to="/explorer" className="text-slate-400 hover:text-cyan-300 transition-colors">Blockchain Proof Explorer</Link></li>
              <li><Link to="/reports" className="text-slate-400 hover:text-white transition-colors">All Reports</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            &copy; {currentYear} ScamRadar. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="GitHub">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
            <a href="mailto:contact@scamradar.org" className="text-slate-400 hover:text-white transition-colors" aria-label="Email">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
