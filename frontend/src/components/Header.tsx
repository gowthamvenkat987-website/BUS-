import React, { useState } from 'react';
import { 
  Building2, 
  Bell, 
  User, 
  ChevronDown, 
  Bus,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { College, UserRole } from '../types';

interface HeaderProps {
  college: College;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  college,
  userRole,
  onChangeRole,
  unreadAlertsCount,
  onOpenAlerts,
  isMobileMenuOpen = false,
  onToggleMobileMenu
}) => {
  const [showNriitDropdown, setShowNriitDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs w-full min-w-0">
      {/* Top Banner Notice - Responsive */}
      <div className="bg-slate-900 text-slate-200 px-3 sm:px-4 py-1 text-[11px] sm:text-xs flex items-center justify-between border-b border-slate-800 w-full overflow-hidden">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="font-semibold text-slate-100 hidden sm:inline">Campus Transport System:</span>
          <span className="truncate">NRIIT, Pothavarappadu, Vijayawada</span>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-amber-300 font-medium hidden md:inline">⚠ Demo Data</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-300 shrink-0 ml-2">
          <span className="bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700/50">
            NRIIT Fleet
          </span>
          <span className="text-slate-400 hidden sm:inline">AI R²: 0.954</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 w-full">
        {/* Left: Hamburger Button (Mobile/Tablet) & Branding */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Navigation Drawer Toggle */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 flex items-center justify-center transition shrink-0"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-900" />
              ) : (
                <Menu className="w-5 h-5 text-slate-900" />
              )}
            </button>
          )}

          {/* Logo Icon */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-md shadow-blue-900/20 border border-blue-600/40 shrink-0">
            <Bus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>

          {/* College & App Title */}
          <div className="min-w-0 truncate">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-slate-900 font-['Outfit'] truncate">
                NRIIT <span className="text-blue-700 font-extrabold">Smart Transit</span>
              </h1>
              <span className="hidden sm:inline-flex bg-blue-100 text-blue-800 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
                Pilot
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate hidden md:block">
              NRI INSTITUTE OF TECHNOLOGY • Pothavarappadu, Vijayawada
            </p>
          </div>
        </div>

        {/* Right: Controls (NRIIT dropdown, Role selector, Alerts notification) */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
          {/* NRIIT Dropdown (Hidden on small mobile, visible on sm+) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setShowNriitDropdown(!showNriitDropdown);
                setShowRoleDropdown(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 transition min-h-[40px]"
              title="NRI Institute of Technology"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span className="font-semibold text-slate-900 max-w-[110px] lg:max-w-[180px] truncate">
                {college.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
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
                    <span className="text-slate-400">Campus:</span>
                    <span className="font-medium text-slate-800 text-right">Pothavarappadu, Vijayawada</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fleet:</span>
                    <span className="font-mono font-bold text-blue-700">{college.totalBuses} Total (4 Standby)</span>
                  </div>
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
              className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 hover:bg-slate-200/80 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-slate-200 min-h-[44px] min-w-[44px] sm:min-w-0"
              aria-label={`Current Role: ${userRole}`}
            >
              <User className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span className="hidden sm:inline text-slate-500">Role:</span>
              <span className="font-semibold text-slate-900 text-[11px] sm:text-xs">{userRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] text-slate-400 uppercase font-semibold">
                  Switch Active Role
                </div>
                {(['ADMIN', 'FACULTY', 'STUDENT'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onChangeRole(r);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 min-h-[44px] ${
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

          {/* Notification Alert Bell Icon */}
          <button
            onClick={onOpenAlerts}
            id="btn-alerts-header"
            className="relative min-h-[44px] min-w-[44px] p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center justify-center shrink-0"
            title="View AI Overcrowding Alerts"
            aria-label={`View AI Alerts. ${unreadAlertsCount} unread`}
          >
            <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
