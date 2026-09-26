import React from 'react';
import { 
  Settings, 
  ShieldAlert, 
  Cpu, 
  Database, 
  MapPin, 
  CheckCircle2, 
  Radio, 
  Layers, 
  Sparkles,
  ExternalLink,
  LogOut,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

interface SettingsPageProps {
  onLogout?: () => void;
  currentUser?: any;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout, currentUser }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
          Settings, System Architecture & Future Scope
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Technical specifications, data disclaimers, and roadmap for real-world deployment at NRI Institute of Technology.
        </p>
      </div>

      {/* User Session & Logout Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 font-['Outfit']">
                Active User Session
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Supabase Authenticated
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Connected: <span className="font-mono font-semibold text-slate-800">{currentUser?.phone || currentUser?.email || '+91 98765 43210'}</span>
            </p>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            id="btn-settings-logout"
            className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs px-4 py-2.5 rounded-xl border border-red-200 transition cursor-pointer min-h-[44px] shrink-0"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span>Log Out from NRI University Bus</span>
          </button>
        )}
      </div>

      {/* Mandatory Data Disclaimer Banner (Section 34 of Prompt) */}
      <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-5 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>PROTOTYPE • SIMULATED TRANSPORT & ATTENDANCE DATA DISCLAIMER</span>
        </div>
        <p className="text-xs text-amber-950 leading-relaxed">
          This application is designed specifically around <strong>NRI Institute of Technology (NRIIT), Pothavarappadu, Via Nunna, Vijayawada, Andhra Pradesh</strong> as the primary pilot college.
        </p>
        <p className="text-xs text-amber-900 leading-relaxed">
          Publicly available information regarding NRIIT is utilized solely for visual identity, geographic location context, and campus transportation layout. <strong>No official college statistics, official bus numbers, actual student rosters, or proprietary administrative data are published or claimed.</strong> All passenger numbers, attendance percentages, vehicle capacities, and route telemetries shown in this prototype are strictly <strong>SIMULATED DEMO DATA</strong> for system evaluation.
        </p>
      </div>

      {/* Technical Architecture Overview (Section 36 of Prompt) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Layers className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900 font-['Outfit']">
            Project Architecture & Modular Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="font-bold text-blue-700 block mb-1">1. Frontend Layer</span>
            <p className="text-slate-600 leading-relaxed">
              React + Vite + Tailwind CSS + Lucide Icons + Recharts. Provides role-based portals for Transport Admins, Faculty QR generators, and Student mobile scanners.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="font-bold text-indigo-700 block mb-1">2. Backend Gateway</span>
            <p className="text-slate-600 leading-relaxed">
              Node.js Express REST API server running on port 5000. Manages cryptographic QR session tokens, duplicate rejection, and proxy caching.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="font-bold text-purple-700 block mb-1">3. AI Prediction Service</span>
            <p className="text-slate-600 leading-relaxed">
              Python scikit-learn microservice (Random Forest + Gradient Boosting). Generates demand forecasts, occupancy probabilities, and explainable feature weights.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="font-bold text-emerald-700 block mb-1">4. Database Schema</span>
            <p className="text-slate-600 leading-relaxed">
              Supabase / PostgreSQL compatible tables: colleges, routes, stops, buses, bus_locations, students, attendance_sessions, attendance_records, timetables, passenger_demand, predictions, alerts, and bus_allocations.
            </p>
          </div>
        </div>
      </div>

      {/* Future Real-World Integration Roadmap (Section 35 of Prompt) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900 font-['Outfit']">
            Future Scope & Real-World Campus Integration
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">AIS-140 Hardware GPS Trackers:</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Direct telemetry ingestion from onboard government-compliant AIS-140 GPS modules installed across NRIIT college buses.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Infrared Overhead Passenger Counting Sensors:</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Automated door-mounted optical sensors to measure actual passenger boarding and deboarding counts per stop without manual scanning.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">RFID Student ID & Turnstile Gate Sync:</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Integration with NRIIT biometric / RFID turnstiles at college entrance gates to sync physical campus departures with evening fleet dispatches.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">High-Precision Telemetry & GPS Tracking Engine:</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  High-frequency real-time bus telemetry updates across the Vijayawada-Mangalagiri-NRIIT corridor with corridor speed monitoring.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">College ERP & Examination Schedule Integration:</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Syncing NRIIT academic calendars, mid-term examinations, and cultural fests to automatically adjust fleet dispatch schedules.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Firebase Firestore Real-Time Subscriptions:</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Sub-second WebSocket state distribution ensuring drivers and dispatchers receive instant notifications on mobile apps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
