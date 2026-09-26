import React, { useState } from 'react';
import { 
  Building2, 
  Bell, 
  User, 
  ChevronDown, 
  Bus,
  CheckCircle2
} from 'lucide-react';
import { College, UserRole } from '../types';

interface HeaderProps {
  college: College;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  college,
  userRole,
  onChangeRole,
  unreadAlertsCount,
  onOpenAlerts
}) => {
  const [showNriitDropdown, setShowNriitDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1 text-xs flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-100">Campus Transport System:</span>
          <span>NRI Institute of Technology, Pothavarappadu, Vijayawada</span>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-amber-300 font-medium hidden md:inline">⚠ Demo / Simulated Transport & Attendance Data</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <span className="bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-700/50">NRIIT Campus Fleet</span>
          <span className="text-slate-400">AI Model R²: 0.954</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-900/20 border border-blue-600/40">
            <Bus className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-bold tracking-tight text-slate-900 font-['Outfit']">
                NRIIT <span className="text-blue-700 font-extrabold">Smart Transit</span>
              </h1>
              <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                NRIIT Official Pilot
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate max-w-[280px] sm:max-w-md">
              NRI INSTITUTE OF TECHNOLOGY • Pothavarappadu, Vijayawada
            </p>
          </div>
        </div>

        {/* Right: NRIIT dropdown | Role dropdown | Notification icon */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* NRIIT Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNriitDropdown(!showNriitDropdown);
                setShowRoleDropdown(false);
              }}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 transition"
              title="NRI Institute of Technology"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span className="font-semibold text-slate-900 max-w-[140px] sm:max-w-[200px] truncate">
                {college.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showNriitDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3.5 z-50 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{college.name}</p>
                    <p className="text-[10px] text-slate-500">Autonomous Institution • NAAC 'A' Grade</p>
                  </div>
                </div>

                <div className="mt-2.5 space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Campus Location:</span>
                    <span className="font-medium text-slate-800 text-right">Pothavarappadu, Vijayawada</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Campus Fleet:</span>
                    <span className="font-mono font-bold text-blue-700">{college.totalBuses} Total (4 Standby)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Environment:</span>
                    <span className="font-semibold text-emerald-700">Primary Pilot Environment</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>GPS Telemetry Active</span>
                  <span className="text-emerald-600 font-bold">Online</span>
                </div>
              </div>
            )}
          </div>

          {/* Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowNriitDropdown(false);
              }}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-slate-200"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline text-slate-500">Role:</span>
              <span className="font-semibold text-slate-800">{userRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] text-slate-400 uppercase font-semibold">
                  Switch Active Role
                </div>
                {(['ADMIN', 'FACULTY', 'STUDENT'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onChangeRole(r);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      userRole === r ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-700'
                    }`}
                  >
                    <span>
                      {r === 'ADMIN' && 'Transport Admin'}
                      {r === 'FACULTY' && 'Faculty (QR Generator)'}
                      {r === 'STUDENT' && 'Student (QR Scanner)'}
                    </span>
                    {userRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Icon */}
          <button
            onClick={onOpenAlerts}
            id="btn-alerts-header"
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            title="View AI Overcrowding Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
