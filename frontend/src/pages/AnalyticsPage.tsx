import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Calendar, 
  Activity, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  // 1. Daily Passenger Demand (Weekly cycle)
  const dailyDemandData = [
    { day: 'Mon', historical: 1150, predicted: 1220, actual: 1205 },
    { day: 'Tue (Today)', historical: 1080, predicted: 1180, actual: 1160 },
    { day: 'Wed', historical: 1090, predicted: 1110, actual: null },
    { day: 'Thu', historical: 1040, predicted: 1060, actual: null },
    { day: 'Fri', historical: 1240, predicted: 1280, actual: null },
    { day: 'Sat (Half-Day)', historical: 720, predicted: 750, actual: null }
  ];

  // 2. Route-wise Occupancy Comparison
  const routeOccupancyData = [
    { route: 'Route 1 (Mangalagiri)', capacity: 50, current: 43, predicted: 58, occupancyPct: 116 },
    { route: 'Route 2 (Benz Circle)', capacity: 55, current: 38, predicted: 44, occupancyPct: 80 },
    { route: 'Route 3 (Gannavaram)', capacity: 45, current: 19, predicted: 22, occupancyPct: 49 },
    { route: 'Route 4 (City Shuttle)', capacity: 40, current: 24, predicted: 28, occupancyPct: 70 }
  ];

  // 3. Peak-Hour Demand Bell Curve
  const peakHourData = [
    { time: '07:00 AM', demand: 180, capacityLimit: 380 },
    { time: '07:30 AM', demand: 420, capacityLimit: 380 },
    { time: '08:00 AM', demand: 780, capacityLimit: 380 },
    { time: '08:30 AM', demand: 980, capacityLimit: 380 },
    { time: '09:00 AM (Class Start)', demand: 450, capacityLimit: 380 },
    { time: '11:00 AM', demand: 120, capacityLimit: 380 },
    { time: '01:00 PM (Lunch)', demand: 210, capacityLimit: 380 },
    { time: '03:45 PM (Departure)', demand: 890, capacityLimit: 380 },
    { time: '04:30 PM', demand: 540, capacityLimit: 380 }
  ];

  // 4. Historical vs AI Predicted Passengers
  const accuracyData = [
    { trip: 'Trip 1', actual: 44, predicted: 46 },
    { trip: 'Trip 2', actual: 49, predicted: 51 },
    { trip: 'Trip 3', actual: 38, predicted: 39 },
    { trip: 'Trip 4', actual: 52, predicted: 50 },
    { trip: 'Trip 5', actual: 41, predicted: 42 },
    { trip: 'Trip 6', actual: 55, predicted: 57 },
    { trip: 'Trip 7', actual: 36, predicted: 37 }
  ];

  // 5. Attendance % vs Route 1 Overcrowding probability
  const attVsDemandData = [
    { attendance: '70%', demand: 38, riskProb: 12 },
    { attendance: '75%', demand: 42, riskProb: 24 },
    { attendance: '80%', demand: 46, riskProb: 42 },
    { attendance: '85%', demand: 49, riskProb: 65 },
    { attendance: '90%', demand: 54, riskProb: 88 },
    { attendance: '94% (Today)', demand: 58, riskProb: 96 },
    { attendance: '98%', demand: 64, riskProb: 99 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              Transit Analytics & Performance Intelligence
            </h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
              Presentation Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Recharts-powered telemetry examining occupancy trends, peak hours and predictive AI accuracy for NRIIT.
          </p>
        </div>

        <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] block">DATA HORIZON</span>
            <span className="font-bold text-slate-800">30-Day Simulated Run</span>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="text-slate-400 text-[10px] block">AI VARIANCE</span>
            <span className="font-bold text-emerald-600">±2.17 Pax</span>
          </div>
        </div>
      </div>

      {/* Row 1: Daily Passenger Demand & Route-Wise Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Demand */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                Daily Passenger Demand Trend
              </h3>
              <p className="text-xs text-slate-500">
                Weekly commuter volume comparing historical baselines against AI forecasts
              </p>
            </div>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              Weekly Aggregate
            </span>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyDemandData} margin={{ top: 10, right: 10, left: -10, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="historical" name="Historical Baseline" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="predicted" name="AI Predicted Demand" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Route Occupancy Comparison */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                Corridor Occupancy vs Physical Capacity
              </h3>
              <p className="text-xs text-slate-500">
                Route 1 displays severe overcapacity (116%) while Route 3 retains 23 spare seats
              </p>
            </div>
            <span className="text-[10px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded">
              Corridor Comparison
            </span>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeOccupancyData} layout="vertical" margin={{ top: 10, right: 20, left: 35, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis dataKey="route" type="category" tick={{ fontSize: 10, fill: '#475569' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="capacity" name="Bus Capacity" fill="#94a3b8" radius={[0, 4, 4, 0]} />
                <Bar dataKey="predicted" name="AI Predicted Demand" fill="#dc2626" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Peak Hour Bell Curve & Attendance vs Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hour Curve */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                Peak-Hour Commuter Surge (Arrival & Departure)
              </h3>
              <p className="text-xs text-slate-500">
                Surge spikes at 08:30 AM arrival and 03:45 PM lab departure
              </p>
            </div>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
              Timetable Peaks
            </span>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={peakHourData} margin={{ top: 10, right: 15, left: -10, bottom: 15 }}>
                <defs>
                  <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Area type="monotone" dataKey="demand" name="Passenger Commute Volume" stroke="#2563eb" fillOpacity={1} fill="url(#peakGrad)" />
                <Line type="monotone" dataKey="capacityLimit" name="Fleet Threshold" stroke="#ef4444" strokeDasharray="4 4" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance vs Predicted Demand */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                Attendance % vs Overcrowding Probability
              </h3>
              <p className="text-xs text-slate-500">
                Correlating classroom presence rates with the likelihood of Route 1 exceeding capacity
              </p>
            </div>
            <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
              AI Sensitivity Analysis
            </span>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attVsDemandData} margin={{ top: 10, right: 15, left: -10, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="attendance" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Line yAxisId="left" type="monotone" dataKey="demand" name="Route 1 Pax Demand" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="riskProb" name="Overcrowd Probability %" stroke="#dc2626" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Model Accuracy: Historical vs Predicted */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
              AI Model Prediction Accuracy (Actual vs Predicted Across Trips)
            </h3>
            <p className="text-xs text-slate-500">
              Validating scikit-learn Random Forest model against actual turnstile boarding pings
            </p>
          </div>
          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
            R² = 0.9544 (High Fidelity)
          </span>
        </div>

        <div className="mt-4 h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={accuracyData} margin={{ top: 10, right: 10, left: -10, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="trip" tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="actual" name="Actual Boarded Passengers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="predicted" name="AI Model Prediction" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
