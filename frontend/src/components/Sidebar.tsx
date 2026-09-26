import React from 'react';
import {
  LayoutDashboard,
  Radio,
  MapPin,
  TrendingUp,
  GraduationCap,
  QrCode,
  ScanLine,
  BrainCircuit,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Bus,
  ArrowRightLeft,
  Settings,
  X
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'live-monitoring'
  | 'routes'
  | 'stops-demand'
  | 'attendance'
  | 'qr-attendance'
  | 'bus-boarding'
  | 'ai-predictions'
  | 'ai-alerts'
  | 'recommendations'
  | 'analytics'
  | 'bus-management'
  | 'bus-allocation'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadAlertsCount: number;
  pendingRecCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadAlertsCount,
  pendingRecCount,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'live-monitoring', label: 'Live Bus Monitoring', icon: Radio, badge: 'Live', badgeColor: 'bg-emerald-100 text-emerald-700' },
    { id: 'routes', label: 'Routes', icon: MapPin, badge: '3 Active' },
    { id: 'stops-demand', label: 'Stops & Demand', icon: TrendingUp, badge: 'Bottleneck' },
    { id: 'attendance', label: 'Attendance', icon: GraduationCap, badge: '91%' },
    { id: 'qr-attendance', label: 'QR Attendance', icon: QrCode, badge: 'Faculty', badgeColor: 'bg-indigo-100 text-indigo-700' },
    { id: 'bus-boarding', label: 'Bus Boarding', icon: ScanLine, badge: 'Student', badgeColor: 'bg-teal-100 text-teal-800 font-bold' },
    { id: 'ai-predictions', label: 'AI Predictions', icon: BrainCircuit, badge: 'R² 0.95', badgeColor: 'bg-purple-100 text-purple-700' },
    { id: 'ai-alerts', label: 'AI Alerts', icon: AlertTriangle, badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : null, badgeColor: 'bg-red-100 text-red-700 animate-pulse font-bold' },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb, badge: pendingRecCount > 0 ? `${pendingRecCount} Action` : null, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'bus-management', label: 'Bus Management', icon: Bus, badge: 'Fleet' },
    { id: 'bus-allocation', label: 'NRI University Bus Allocation', icon: ArrowRightLeft, badge: 'AI Action', badgeColor: 'bg-blue-100 text-blue-800 font-bold' },
    { id: 'settings', label: 'Settings & Scope', icon: Settings, badge: null }
  ];

  const handleTabClick = (tabId: NavTab) => {
    onSelectTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navContent = (
    <>
      {/* Brand Title Area */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
            NRI
          </div>
          <div className="text-sm font-extrabold text-white tracking-wide font-['Outfit']">
            UNIVERSITY BUS
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-mono">
            v1.0
          </span>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden min-h-[36px] min-w-[36px] p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              aria-label="Close Mobile Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Nav List with smooth touch scrolling */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 touch-scroll">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id as NavTab)}
              id={`nav-${item.id}`}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group min-h-[44px] ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-xs shadow-blue-500/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 active:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                <span className="truncate text-left">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      item.badgeColor || (isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Info in Sidebar */}
      <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center shrink-0">
        NRIIT Pilot • Vijayawada
      </div>
    </>
  );

  return (
    <>
      {/* 1. Desktop & Tablet Sidebar (Hidden on small mobile < lg) */}
      <aside className="hidden lg:flex w-60 xl:w-64 bg-slate-900 text-slate-300 flex-col border-r border-slate-800 shrink-0 h-full">
        {navContent}
      </aside>

      {/* 2. Mobile / Tablet Navigation Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-200"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <aside
            className="relative z-50 w-72 max-w-[85vw] bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-2xl h-full animate-in slide-in-from-left duration-200"
            role="dialog"
            aria-label="Mobile Navigation Drawer"
          >
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};
