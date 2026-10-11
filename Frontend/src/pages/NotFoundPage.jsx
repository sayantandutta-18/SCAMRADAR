import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="bg-white/5 border border-white/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
          <ShieldOff className="w-12 h-12 text-slate-500" />
        </div>
        <h1 className="text-6xl font-extrabold text-white mb-4 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-slate-300 mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8">
          The page you are looking for doesn't exist or has been moved. 
          It seems you've wandered into an uncharted digital territory.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
