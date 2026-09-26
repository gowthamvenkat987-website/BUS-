import React from 'react';
import {
  LayoutDashboard,
  Radio,
  MapPin,
  TrendingUp,
  GraduationCap,
  QrCode,
  BrainCircuit,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Bus,
  ArrowRightLeft,
  Settings,
  ChevronRight
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'live-monitoring'
  | 'routes'
  | 'stops-demand'
  | 'attendance'
  | 'qr-attendance'
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadAlertsCount,
  pendingRecCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'live-monitoring', label: 'Live Bus Monitoring', icon: Radio, badge: 'Live', badgeColor: 'bg-emerald-100 text-emerald-700' },
    { id: 'routes', label: 'Routes', icon: MapPin, badge: '3 Active' },
    { id: 'stops-demand', label: 'Stops & Demand', icon: TrendingUp, badge: 'Bottleneck' },
    { id: 'attendance', label: 'Attendance', icon: GraduationCap, badge: '91%' },
    { id: 'qr-attendance', label: 'QR Attendance', icon: QrCode, badge: 'Scanner', badgeColor: 'bg-indigo-100 text-indigo-700' },
    { id: 'ai-predictions', label: 'AI Predictions', icon: BrainCircuit, badge: 'R² 0.95', badgeColor: 'bg-purple-100 text-purple-700' },
    { id: 'ai-alerts', label: 'AI Alerts', icon: AlertTriangle, badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : null, badgeColor: 'bg-red-100 text-red-700 animate-pulse font-bold' },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb, badge: pendingRecCount > 0 ? `${pendingRecCount} Action` : null, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'bus-management', label: 'Bus Management', icon: Bus, badge: 'Fleet' },
    { id: 'bus-allocation', label: 'Smart Bus Allocation', icon: ArrowRightLeft, badge: 'AI Action', badgeColor: 'bg-blue-100 text-blue-800 font-bold' },
    { id: 'settings', label: 'Settings & Scope', icon: Settings, badge: null }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
      {/* Brand Title Area */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
            NRIIT
          </div>
          <div className="text-sm font-extrabold text-white tracking-wide font-['Outfit']">
            SMART TRANSIT
          </div>
        </div>
        <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-mono">
          v1.0-NRIIT
        </span>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as NavTab)}
              id={`nav-${item.id}`}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-xs shadow-blue-500/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      item.badgeColor || (isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Notice */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800">
          <p className="text-[11px] font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            NRI Institute of Technology
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Pothavarappadu, Vijayawada • Demo Mode
          </p>
          <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>Model: RF Regressor</span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
