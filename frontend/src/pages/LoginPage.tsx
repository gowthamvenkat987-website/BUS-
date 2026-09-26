import React, { useState } from 'react';
import { Bus, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@smarttransit.com');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState<UserRole>('ADMIN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(role);
  };

  const setRoleCredentials = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'ADMIN') {
      setEmail('admin@smarttransit.com');
      setPassword('admin123');
    } else if (selectedRole === 'FACULTY') {
      setEmail('faculty@nriit.edu.in');
      setPassword('faculty123');
    } else {
      setEmail('student@nriit.edu.in');
      setPassword('student123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-8 relative z-10 animate-in fade-in zoom-in-95">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-900/30 border border-blue-500/30">
            <Bus className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
              NRIIT <span className="text-blue-700">Smart Transit</span>
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Transport Administration & Mobility Portal
            </p>
          </div>
          <span className="inline-block bg-blue-50 text-blue-800 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-200">
            NRI Institute of Technology • Vijayawada
          </span>
        </div>

        {/* Demo Fast-Login Selector */}
        <div className="mt-6 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
            1-Click Demo Profiles
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setRoleCredentials('ADMIN')}
              className={`py-1.5 px-2 rounded-xl font-bold transition text-[11px] ${
                role === 'ADMIN'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRoleCredentials('FACULTY')}
              className={`py-1.5 px-2 rounded-xl font-bold transition text-[11px] ${
                role === 'FACULTY'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => setRoleCredentials('STUDENT')}
              className={`py-1.5 px-2 rounded-xl font-bold transition text-[11px] ${
                role === 'STUDENT'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Student
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-blue-600 text-xs text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-blue-600 text-xs text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            id="btn-login-submit"
            className="w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs"
          >
            <span>Sign In to NRIIT Smart Transit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Disclaimer */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            NRIIT Smart Transit Environment • Safe Demo Authentication
          </p>
        </div>
      </div>
    </div>
  );
};
