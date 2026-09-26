import React, { useState } from 'react';
import { AIAlert } from '../types';
import { 
  AlertTriangle, 
  TrendingUp, 
  Bus, 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface AIAlertsPageProps {
  alerts: AIAlert[];
  onAcknowledge: (id: string) => Promise<boolean>;
  onNavigateTab: (tab: any) => void;
}

export const AIAlertsPage: React.FC<AIAlertsPageProps> = ({
  alerts,
  onAcknowledge,
  onNavigateTab
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              AI Alert Center
            </h1>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-200">
              Live Early Warning
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time proactive notifications predicting corridor overcrowding, timetable surges and capacity bottlenecks.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs">
          {(['all', 'active', 'acknowledged', 'resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition ${
                filter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Prominent High Overcrowding Alert Callout */}
      <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-red-600 text-white shadow-sm animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-red-950 font-['Outfit']">
                ⚠ HIGH OVERCROWDING RISK: Route 1
              </span>
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Simulated AI Prediction
              </span>
            </div>
            <p className="text-xs text-red-800 mt-0.5">
              Route 1 (Mangalagiri to NRIIT) is predicted to exceed seating capacity (116% occupancy) within 20 minutes due to 63 students queued at Kaza and Chinna Kakani.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('recommendations')}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 shadow-sm"
        >
          <span>View Recommended Relief Action</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-3.5">
        {filteredAlerts.map((alt) => {
          const isDanger = alt.severity === 'danger';
          const isWarning = alt.severity === 'warning';

          return (
            <div
              key={alt.id}
              className={`bg-white rounded-xl border p-4.5 shadow-xs transition hover:shadow-md ${
                isDanger
                  ? 'border-red-300 ring-1 ring-red-200'
                  : isWarning
                  ? 'border-amber-300'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${
                    isDanger ? 'bg-red-100 text-red-700' : isWarning ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {isDanger ? <AlertTriangle className="w-4 h-4" /> : isWarning ? <TrendingUp className="w-4 h-4" /> : <Bus className="w-4 h-4" />}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{alt.title}</h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    AI Prediction
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3 h-3" />
                    {alt.timestamp}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    alt.status === 'active'
                      ? 'bg-red-100 text-red-700 animate-pulse'
                      : alt.status === 'acknowledged'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {alt.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">
                {alt.message}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="text-[11px] text-slate-500 font-mono">
                  Affected Corridor: <strong className="text-slate-800">{alt.routeId}</strong>
                </div>

                <div className="flex items-center gap-2">
                  {alt.status === 'active' && (
                    <button
                      onClick={() => onAcknowledge(alt.id)}
                      className="px-3 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-[11px]"
                    >
                      Acknowledge Alert
                    </button>
                  )}
                  <button
                    onClick={() => onNavigateTab('recommendations')}
                    className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <span>View Prescriptive Action</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
