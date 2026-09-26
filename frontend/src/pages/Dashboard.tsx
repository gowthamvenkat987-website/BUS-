import React from 'react';
import { 
  Bus, 
  Users, 
  AlertTriangle, 
  Activity, 
  GraduationCap, 
  TrendingUp, 
  ArrowUpRight, 
  BrainCircuit, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { RouteItem } from '../types';
import { AttendanceSimulator } from '../components/AttendanceSimulator';
import { InteractiveMap } from '../components/InteractiveMap';

interface DashboardProps {
  routes: RouteItem[];
  currentAttendance: number;
  onSimulateAttendance: (pct: number) => void;
  onNavigateTab: (tab: any) => void;
  onApplyRecommendation: (recId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  routes,
  currentAttendance,
  onSimulateAttendance,
  onNavigateTab,
  onApplyRecommendation
}) => {
  const route1 = routes.find(r => r.id === 'route-1') || routes[0];
  const highRiskRoutes = routes.filter(r => r.riskLevel === 'HIGH');
  const totalBuses = 12;
  const activeBuses = 8;
  const totalTravelling = routes.reduce((sum, r) => sum + r.currentPassengers, 0) + 980; // Total network estimate
  const networkOccupancy = Math.round(
    (routes.reduce((sum, r) => sum + r.currentPassengers, 0) /
      routes.reduce((sum, r) => sum + r.capacity, 0)) * 100
  );

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
              NRIIT Transport Command Center
            </h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
              Live Pilot
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            AI-powered visibility into campus bus demand and overcrowding • NRI Institute of Technology, Vijayawada
          </p>
        </div>

        {/* Status pill */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-700">AI Predictive Engine:</span>
          <span className="font-bold text-emerald-700">Operational (R² 0.954)</span>
        </div>
      </div>

      {/* Top KPI Cards (6 cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* TOTAL BUSES */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>TOTAL BUSES</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">{totalBuses}</div>
          <div className="mt-1 flex items-center text-[11px] text-slate-500 font-medium">
            <span className="text-blue-600 font-semibold">Campus Fleet</span>
            <span className="mx-1">•</span>
            <span>NRIIT Depot</span>
          </div>
        </div>

        {/* ACTIVE BUSES */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>ACTIVE BUSES</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-600">{activeBuses}</div>
          <div className="mt-1 flex items-center text-[11px] text-emerald-600 font-medium">
            <span>67% Deployed</span>
            <span className="mx-1">•</span>
            <span>4 Standby</span>
          </div>
        </div>

        {/* STUDENTS TRAVELLING */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>STUDENTS TRAVELLING</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">{totalTravelling}</div>
          <div className="mt-1 flex items-center text-[11px] text-indigo-600 font-medium">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            <span>+14.2% Morning</span>
          </div>
        </div>

        {/* HIGH-RISK ROUTES */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>HIGH-RISK ROUTES</span>
            <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-red-600">
            {highRiskRoutes.length}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-red-600 font-medium">
            <span className="truncate">{highRiskRoutes.length > 0 ? 'Route 1 (Mangalagiri)' : 'All Safe'}</span>
          </div>
        </div>

        {/* NETWORK OCCUPANCY */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>NETWORK OCCUPANCY</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-600">{networkOccupancy}%</div>
          <div className="mt-1 flex items-center text-[11px] text-slate-500 font-medium">
            <span>Peak Hour Multiplier</span>
          </div>
        </div>

        {/* TODAY'S ATTENDANCE */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>TODAY'S ATTENDANCE</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-purple-600">{currentAttendance}%</div>
          <div className="mt-1 flex items-center text-[11px] text-purple-600 font-medium">
            <span className="truncate">High Transit Driver</span>
          </div>
        </div>
      </div>

      {/* Large Premium Card: AI OVERCROWDING INTELLIGENCE */}
      <div className="bg-white rounded-2xl border-2 border-red-200 p-6 shadow-sm relative overflow-hidden">
        {/* Top tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600 text-white shadow-xs">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  AI Overcrowding Intelligence
                </h2>
                <span className="bg-red-100 text-red-800 text-[11px] font-bold px-2 py-0.5 rounded border border-red-300 animate-pulse">
                  HIGH OVERCROWDING RISK
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Predictive risk synthesized from classroom QR attendance, stop sensors & historical bus demand.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-slate-100 text-slate-600 font-mono px-2.5 py-1 rounded-md border border-slate-200">
              Prediction Window: Next 30 minutes
            </span>
            <span className="text-[11px] bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-md border border-amber-200">
              DEMO / SIMULATED DATA
            </span>
          </div>
        </div>

        {/* Route 1 Demonstration Banner */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Left: Route 1 Metrics */}
          <div className="space-y-4 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Target Route
              </div>
              <div className="text-xl font-extrabold text-slate-900 font-['Outfit'] mt-0.5">
                Route 1 — Mangalagiri
              </div>
              <div className="text-xs text-slate-500 font-medium">
                NRIIT Pothavarappadu → Chinna Kakani → Mangalagiri
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500">Current Occupancy</span>
                <p className="text-xl font-bold font-mono text-slate-800 mt-0.5">
                  {route1.currentPassengers} / {route1.capacity}
                  <span className="text-xs ml-1 text-slate-500 font-normal">
                    ({Math.round((route1.currentPassengers / route1.capacity) * 100)}%)
                  </span>
                </p>
              </div>

              <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                <span className="text-[11px] text-red-700 font-semibold">Predicted Occupancy</span>
                <p className="text-xl font-bold font-mono text-red-700 mt-0.5">
                  {route1.predictedPassengers} / {route1.capacity}
                  <span className="text-xs ml-1 text-red-600 font-bold">
                    ({route1.predictedOccupancy}%)
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs bg-slate-100 p-2.5 rounded-lg">
              <span className="text-slate-600">Assigned Vehicle:</span>
              <span className="font-semibold text-slate-900">{route1.assignedVehicle}</span>
            </div>
          </div>

          {/* Center: AI Explanation */}
          <div className="space-y-3 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI EXPLANATION (WHY IS ROUTE 1 HIGH RISK?)
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              “Passenger demand is expected to exceed available capacity based on current occupancy (86%), historical route demand, high morning attendance (94%) and predicted students waiting at upcoming stops (notably Kaza and Chinna Kakani).”
            </p>
            <div className="space-y-1 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>Kaza Junction: 28 waiting students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>Chinna Kakani Hub: 35 waiting students</span>
              </div>
            </div>
          </div>

          {/* Right: Recommendation & 1-Click Action */}
          <div className="space-y-3 lg:col-span-1">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
              AI ACTIONABLE RECOMMENDATION
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl text-xs text-slate-800">
              <p className="font-semibold text-emerald-900">
                “Deploy additional vehicle capacity or reallocate available capacity.”
              </p>
              <p className="text-[11px] text-slate-600 mt-1">
                Dispatch 35-seat Standby Assigned Vehicle D from NRIIT campus depot to relieve the Chinna Kakani corridor.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onApplyRecommendation('rec-r1-deploy')}
                id="btn-deploy-standby"
                className="flex-1 bg-gradient-to-r from-red-600 to-indigo-700 hover:from-red-700 hover:to-indigo-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Bus className="w-4 h-4" />
                <span>Deploy Standby Bus Now</span>
              </button>
              <button
                onClick={() => onNavigateTab('ai-predictions')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2.5 rounded-xl text-xs font-semibold transition"
              >
                Explain AI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Flow Pipeline: ATTENDANCE -> STUDENT COUNT -> DEMAND -> OVERCROWD -> RECOMMENDATION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
              Attendance-to-Transit AI Pipeline
            </h3>
            <p className="text-[11px] text-slate-500">
              How classroom attendance feeds into predictive transit dispatching at NRIIT
            </p>
          </div>
          <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
            End-to-End Decision Flow
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          {/* Step 1 */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400">INPUT 1</span>
            <p className="font-extrabold text-blue-700 mt-1">ATTENDANCE</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{currentAttendance}% Present</p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400">INPUT 2</span>
            <p className="font-extrabold text-indigo-700 mt-1">STUDENT COUNT</p>
            <p className="text-[10px] text-slate-500 mt-0.5">1,092 Commuters</p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400">ML ENGINE</span>
            <p className="font-extrabold text-purple-700 mt-1">DEMAND PREDICT</p>
            <p className="text-[10px] text-slate-500 mt-0.5">RF + Gradient Boost</p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400">CORRIDOR</span>
            <p className="font-extrabold text-slate-800 mt-1">ROUTE DEMAND</p>
            <p className="text-[10px] text-slate-500 mt-0.5">58 on Route 1</p>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400">SUPPLY</span>
            <p className="font-extrabold text-slate-800 mt-1">BUS CAPACITY</p>
            <p className="text-[10px] text-slate-500 mt-0.5">50 Available Seats</p>
          </div>

          {/* Step 6 */}
          <div className="bg-red-50 p-2.5 rounded-xl border border-red-200">
            <span className="text-[10px] font-bold text-red-500">RISK</span>
            <p className="font-extrabold text-red-700 mt-1">AI ALERT</p>
            <p className="text-[10px] text-red-600 mt-0.5">116% Overcrowd</p>
          </div>

          {/* Step 7 */}
          <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-600">ACTION</span>
            <p className="font-extrabold text-emerald-800 mt-1">RECOMMENDED</p>
            <p className="text-[10px] text-emerald-700 mt-0.5">Deploy Standby D</p>
          </div>
        </div>
      </div>

      {/* Attendance Simulator Widget */}
      <AttendanceSimulator
        currentAttendance={currentAttendance}
        onSimulate={onSimulateAttendance}
        predictedDemand={route1.predictedPassengers}
        capacity={route1.capacity}
        riskLevel={route1.riskLevel}
      />

      {/* Interactive Transit Map Overview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
            Live Route Fleet & Telemetry Map
          </h3>
          <button
            onClick={() => onNavigateTab('live-monitoring')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Full Screen Monitoring</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <InteractiveMap route={route1} allRoutes={routes} />
      </div>

      {/* Active Routes Cards (Route 1, Route 2, Route 3) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Active College Routes (Route-First Architecture)
            </h3>
            <p className="text-xs text-slate-500">
              Vehicles are assigned dynamically to route corridors rather than fixed bus numbers.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('routes')}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-semibold transition"
          >
            Manage Routes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {routes.map((r) => (
            <div
              key={r.id}
              className={`bg-white rounded-xl border p-4 shadow-xs transition hover:shadow-md ${
                r.riskLevel === 'HIGH' ? 'border-red-300 ring-1 ring-red-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Route {r.routeNumber}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    r.riskLevel === 'HIGH'
                      ? 'bg-red-100 text-red-700'
                      : r.riskLevel === 'MODERATE'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {r.riskLevel} RISK
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-1 truncate">{r.name}</h4>
              <p className="text-[11px] text-slate-500 truncate">{r.assignedVehicle}</p>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400">Current Occupancy</span>
                  <p className="font-bold text-slate-800 font-mono mt-0.5">
                    {r.currentPassengers} / {r.capacity} ({Math.round((r.currentPassengers / r.capacity) * 100)}%)
                  </p>
                </div>

                <div className={`p-2 rounded-lg ${r.riskLevel === 'HIGH' ? 'bg-red-50' : 'bg-slate-50'}`}>
                  <span className={`text-[10px] ${r.riskLevel === 'HIGH' ? 'text-red-700' : 'text-slate-400'}`}>
                    Predicted
                  </span>
                  <p className={`font-bold font-mono mt-0.5 ${r.riskLevel === 'HIGH' ? 'text-red-700' : 'text-slate-800'}`}>
                    {r.predictedPassengers} ({r.predictedOccupancy}%)
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Next: <strong className="text-slate-800">{r.nextStop}</strong></span>
                <span className="text-blue-600 font-semibold font-mono">{r.etaMinutes} mins ETA</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
