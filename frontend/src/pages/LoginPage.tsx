import React from 'react';
import { Bus, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const handleLogin = () => {
    onLoginSuccess({
      id: 'nri-transport-admin',
      email: 'admin@nriit.edu.in',
      user_metadata: {
        role: 'ADMIN',
        full_name: 'NRI Transport Administration'
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Header Pill */}
      <div className="mb-6 flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-xs font-semibold text-slate-700">NRI Institute of Technology • Vijayawada</span>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 w-full max-w-md p-6 sm:p-8 relative">
        {/* Brand Header */}
        <div className="text-center space-y-2 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md border border-slate-800">
            <Bus className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
              NRI <span className="text-blue-700">University Bus</span>
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Sign in to continue
            </p>
          </div>
        </div>

        {/* Transit Gate Information Panel */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 my-6 text-xs text-slate-600 space-y-2">
          <div className="flex items-center justify-between font-semibold text-slate-800 pb-2 border-b border-slate-200/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Transit Gate Access</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              System Online
            </span>
          </div>
          <p className="text-[12px] text-slate-600 leading-relaxed">
            Direct access to real-time fleet telemetries, corridor route monitoring, AI passenger demand forecasting, and automated vehicle dispatch.
          </p>
        </div>

        {/* Single Direct Login Action Button */}
        <div className="space-y-4">
          <button
            type="button"
            id="btn-login"
            onClick={handleLogin}
            className="w-full min-h-[48px] bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl transition duration-150 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <span>Login</span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            NRI Institute of Technology • Smart Campus Transit Operations
          </p>
        </div>
      </div>
    </div>
  );
};
