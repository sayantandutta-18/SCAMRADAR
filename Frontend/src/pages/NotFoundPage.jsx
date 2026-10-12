import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft, Home } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl"></div>
          <div className="relative bg-slate-900/80 border border-white/10 rounded-full w-24 h-24 flex items-center justify-center shadow-xl">
            <ShieldOff className="w-12 h-12 text-cyan-400/80" />
          </div>
        </div>

        <div>
          <span className="font-mono text-cyan-400 text-xs uppercase tracking-widest block mb-1">
            HTTP 404 — UNRESOLVED ROUTE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Threat Record Not Found
          </h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            The page or telemetry endpoint you are attempting to access does not exist or has been archived.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Previous Page</span>
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-950" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
