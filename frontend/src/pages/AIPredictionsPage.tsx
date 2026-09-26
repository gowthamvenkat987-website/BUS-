import React, { useState } from 'react';
import { RouteItem } from '../types';
import { 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  Layers,
  Database,
  Sliders
} from 'lucide-react';
import { AttendanceSimulator } from '../components/AttendanceSimulator';

interface AIPredictionsPageProps {
  routes: RouteItem[];
  currentAttendance: number;
  onSimulateAttendance: (pct: number) => void;
  onNavigateTab: (tab: any) => void;
}

export const AIPredictionsPage: React.FC<AIPredictionsPageProps> = ({
  routes,
  currentAttendance,
  onSimulateAttendance,
  onNavigateTab
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-1');
  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  const isOvercrowded = activeRoute.predictedOccupancy >= 100;
  const isModerate = activeRoute.predictedOccupancy >= 75 && !isOvercrowded;

  // ML Feature Importances from trained model
  const featureImportances = [
    { name: 'Upcoming Stop Waiting Queue', weight: 70.8, desc: 'Accumulated passengers waiting at Kaza & Chinna Kakani' },
    { name: 'Current Vehicle Baseline Occupancy', weight: 13.4, desc: '43/50 seats already boarded on Route 1' },
    { name: 'Classroom QR Attendance Rate', weight: 6.4, desc: `${currentAttendance}% attendance registered across morning labs` },
    { name: 'Timetable Peak Window (08:00 - 09:00)', weight: 4.3, desc: 'Arrival bell curve multiplier for 1st period' },
    { name: 'Day of Week Profile (Tuesday/Monday)', weight: 2.7, desc: 'Commuter volume distribution factor' },
    { name: 'Corridor Route Dynamics', weight: 2.4, desc: 'Specific highway transit velocity & distance' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              AI Demand Forecast & Explainable AI (XAI)
            </h1>
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
              Scikit-Learn ML Core
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Multivariate predictive regression trained on simulated NRIIT historical transit, timetable, and attendance datasets.
          </p>
        </div>

        {/* Model Metrics pill */}
        <div className="flex flex-wrap items-center gap-3 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs text-xs font-mono self-start sm:self-auto shrink-0">
          <div>
            <span className="text-slate-400 text-[10px] block">R² SCORE</span>
            <span className="font-bold text-purple-700">0.9544</span>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="text-slate-400 text-[10px] block">MEAN ABS ERROR</span>
            <span className="font-bold text-slate-800">2.17 pax</span>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="text-slate-400 text-[10px] block">ESTIMATORS</span>
            <span className="font-bold text-slate-800">100 Trees</span>
          </div>
        </div>
      </div>

      {/* Corridor Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 shrink-0">Corridor under inspection:</span>
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs overflow-x-auto max-w-full touch-scroll">
          {routes.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`text-xs px-3.5 py-2 min-h-[44px] rounded-lg font-bold transition whitespace-nowrap flex items-center justify-center ${
                r.id === activeRoute.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Forecast Card */}
      <div className={`p-4 sm:p-6 rounded-2xl border-2 transition-all min-w-0 ${
        isOvercrowded
          ? 'bg-red-50/50 border-red-300 ring-2 ring-red-100'
          : isModerate
          ? 'bg-amber-50/50 border-amber-300'
          : 'bg-emerald-50/50 border-emerald-300'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/60">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              PREDICTIVE DISPATCH OUTCOME
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-['Outfit'] mt-0.5 break-anywhere">
              {activeRoute.name}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-start sm:self-auto">
            <span className={`text-xs font-extrabold px-3 py-1 rounded-lg ${
              isOvercrowded
                ? 'bg-red-600 text-white animate-pulse'
                : isModerate
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-600 text-white'
            }`}>
              {activeRoute.riskLevel} OVERCROWDING RISK
            </span>
            <span className="text-[11px] bg-white text-slate-700 font-mono px-2.5 py-1 rounded-md border border-slate-200">
              Horizon: 25 mins
            </span>
          </div>
        </div>

        {/* 4 Metrics from Prompt (1 col on mobile, 2 on tablet, 4 on desktop) */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs font-mono">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 min-w-0">
            <span className="text-slate-400 text-[10px] block">CURRENT LOAD</span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">
              {activeRoute.currentPassengers} passengers
            </span>
            <span className="text-[11px] text-slate-500">
              Physical Headroom: {Math.max(0, activeRoute.capacity - activeRoute.currentPassengers)} seats
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border min-w-0 ${isOvercrowded ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
            <span className={`${isOvercrowded ? 'text-red-700' : 'text-slate-400'} text-[10px] block font-bold`}>
              AI PREDICTED DEMAND
            </span>
            <span className={`text-xl font-bold mt-1 block ${isOvercrowded ? 'text-red-700' : 'text-slate-900'}`}>
              {activeRoute.predictedPassengers} passengers
            </span>
            <span className="text-[11px] text-slate-500">
              +{activeRoute.predictedPassengers - activeRoute.currentPassengers} expected influx
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 min-w-0">
            <span className="text-slate-400 text-[10px] block">BUS SEATING CAPACITY</span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">
              {activeRoute.capacity} seats
            </span>
            <span className="text-[11px] text-slate-500 truncate block">
              {activeRoute.assignedVehicle}
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border min-w-0 ${isOvercrowded ? 'bg-red-100/70 border-red-300' : 'bg-white border-slate-200'}`}>
            <span className={`${isOvercrowded ? 'text-red-700' : 'text-slate-400'} text-[10px] block font-bold`}>
              PREDICTED OCCUPANCY
            </span>
            <span className={`text-xl font-bold mt-1 block ${isOvercrowded ? 'text-red-700' : 'text-slate-900'}`}>
              {activeRoute.predictedOccupancy}%
            </span>
            <span className={`text-[11px] font-bold ${isOvercrowded ? 'text-red-600' : 'text-emerald-600'}`}>
              {isOvercrowded ? 'Exceeds max threshold' : 'Within operating safety'}
            </span>
          </div>
        </div>
      </div>

      {/* AI Explanation (WHY IS ROUTE 1 HIGH RISK?) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                AI Explanation: Why is Route 1 High Risk?
              </h3>
              <p className="text-xs text-slate-500">
                Transparent Explainable AI (XAI) feature attribution breakdown
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded self-start sm:self-auto shrink-0">
            Multivariate Attribution
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Contributing Factors (Model Attribution)
            </span>
            <div className="space-y-2.5 text-slate-700 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                  1
                </span>
                <p>
                  <strong>Current occupancy is already high:</strong> Assigned Vehicle A currently carries 43 passengers (86% full) with only 7 remaining seats.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                  2
                </span>
                <p>
                  <strong>High student demand predicted at upcoming stops:</strong> 28 students are waiting at Kaza and 35 students at Chinna Kakani along the NH-16 corridor.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                  3
                </span>
                <p>
                  <strong>Historical morning demand is higher during this time:</strong> Commute telemetry for 08:30–09:00 AM demonstrates peak arrival velocity for Period 1.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                  4
                </span>
                <p>
                  <strong>Attendance indicates increased travel demand:</strong> Morning classroom attendance registered at {currentAttendance}%, driving a +19.4% passenger influx.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                Prescriptive Transportation Recommendation
              </span>
              <p className="text-xs text-slate-800 mt-2 leading-relaxed font-semibold break-anywhere">
                “Deploy additional vehicle capacity or reallocate capacity from a lower-demand route.”
              </p>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed break-anywhere">
                The model prescribes deploying <strong>Standby Assigned Vehicle D</strong> (35 seats) from the NRIIT campus depot to intercept Chinna Kakani stop, absorbing the 35-student queue and bringing Route 1 occupancy down to a safe 68%.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] text-emerald-800 font-medium">Confidence: 94.6%</span>
              <button
                onClick={() => onNavigateTab('recommendations')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 min-h-[44px] rounded-xl text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>Execute Recommendation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Model Feature Weights Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Scikit-Learn Random Forest Feature Importances
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated weights illustrating which signals most heavily drive passenger demand predictions.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500">n_estimators=100</span>
        </div>

        <div className="space-y-3">
          {featureImportances.map((item, idx) => (
            <div key={idx} className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{item.name}</span>
                <span className="font-mono font-bold text-purple-700">{item.weight}% weight</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                  style={{ width: `${item.weight}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 italic">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Simulator Component for What-If Testing */}
      <AttendanceSimulator
        currentAttendance={currentAttendance}
        onSimulate={onSimulateAttendance}
        predictedDemand={activeRoute.predictedPassengers}
        capacity={activeRoute.capacity}
        riskLevel={activeRoute.riskLevel}
      />
    </div>
  );
};
