import React from 'react';
import { RouteItem } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  CartesianGrid
} from 'recharts';
import { 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  ShieldAlert, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface StopsDemandPageProps {
  route1: RouteItem;
}

export const StopsDemandPage: React.FC<StopsDemandPageProps> = ({ route1 }) => {
  // Demo data from prompt:
  // Pedda Kakani — 8, Numbur — 14, Koppuravuru — 21, Kaza — 28, Chinna Kakani — 35, Tenali Bypass — 18, Mangalagiri — 12
  const demoStopsData = [
    { name: 'Pedda Kakani', demand: 8, predictedAddition: 3, risk: 'LOW', km: 8.5 },
    { name: 'Numbur', demand: 14, predictedAddition: 5, risk: 'MODERATE', km: 12.2 },
    { name: 'Koppuravuru', demand: 21, predictedAddition: 7, risk: 'MODERATE', km: 15.0 },
    { name: 'Kaza', demand: 28, predictedAddition: 9, risk: 'HIGH', km: 18.4 },
    { name: 'Chinna Kakani', demand: 35, predictedAddition: 11, risk: 'CRITICAL', km: 21.0 },
    { name: 'Tenali Bypass', demand: 18, predictedAddition: 6, risk: 'MODERATE', km: 24.3 },
    { name: 'Mangalagiri', demand: 12, predictedAddition: 4, risk: 'LOW', km: 28.0 }
  ];

  const totalWaiting = demoStopsData.reduce((acc, s) => acc + s.demand, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              Student Demand by Stop
            </h1>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              Demo / Simulated Data
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Corridor stop telemetry and bottleneck identification for Route 1 (Mangalagiri to NRIIT).
          </p>
        </div>

        {/* Total waiting banner */}
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 self-start sm:self-auto shrink-0">
          <div className="p-2 rounded-lg bg-red-50 text-red-600">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              Total Inbound Queue
            </span>
            <span className="text-base font-extrabold font-mono text-slate-900">
              {totalWaiting} Waiting Students
            </span>
          </div>
        </div>
      </div>

      {/* Bottleneck Warning Callout */}
      <div className="bg-red-50/80 border border-red-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-xs shrink-0">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-red-950 font-['Outfit']">
                Surge Bottleneck Detected: Kaza & Chinna Kakani
              </h3>
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shrink-0">
                63 Students Combined
              </span>
            </div>
            <p className="text-xs text-red-800 mt-0.5 break-anywhere">
              These two consecutive stops account for 46% of total corridor demand, causing the primary bus capacity overflow.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs self-start md:self-auto shrink-0">
          <span className="bg-white/80 text-red-900 px-3 py-1.5 rounded-lg border border-red-200 font-semibold">
            Action: Depot standby bus recommended
          </span>
        </div>
      </div>

      {/* Stop Demand Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-['Outfit']">
              Waiting Students Distribution by Transit Stop
            </h2>
            <p className="text-xs text-slate-500">
              Live count of students currently queued at stops along NH-16 Mangalagiri-NRIIT corridor
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-600 inline-block"></span>
              <span className="text-slate-600">Critical (≥25)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span>
              <span className="text-slate-600">Moderate (15-24)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-600 inline-block"></span>
              <span className="text-slate-600">Normal (&lt;15)</span>
            </div>
          </div>
        </div>

        <div className="mt-6 h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={demoStopsData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: '#475569' }} 
                angle={-20} 
                textAnchor="end" 
                interval={0}
              />
              <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-xl border border-slate-800">
                        <p className="font-bold text-blue-400">{data.name}</p>
                        <p className="mt-1 font-mono">Waiting Students: <strong className="text-amber-400">{data.demand}</strong></p>
                        <p className="font-mono text-slate-300">Predicted Add: +{data.predictedAddition}</p>
                        <p className="text-[10px] text-slate-400 mt-1">Distance: {data.km} km to campus</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="demand" radius={[6, 6, 0, 0]}>
                {demoStopsData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.demand >= 25 ? '#dc2626' : entry.demand >= 15 ? '#f59e0b' : '#2563eb'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stop Metrics Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
            Stop-Level Demand & Bottleneck Index
          </h3>
          <span className="text-[11px] text-slate-500 font-mono self-start sm:self-auto">
            Source: Bus Stop IR/QR Scans (Simulated)
          </span>
        </div>

        <div className="overflow-x-auto touch-scroll">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Stop Name</th>
                <th className="py-2.5 px-4">Distance (km)</th>
                <th className="py-2.5 px-4">Waiting Students</th>
                <th className="py-2.5 px-4">Predicted Additional Pax</th>
                <th className="py-2.5 px-4">Overcrowd Risk Level</th>
                <th className="py-2.5 px-4">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {demoStopsData.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{s.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono">{s.km} km</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                    {s.demand}
                  </td>
                  <td className="py-3 px-4 font-mono text-blue-600 font-semibold">
                    +{s.predictedAddition} passengers
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      s.risk === 'CRITICAL'
                        ? 'bg-red-100 text-red-700'
                        : s.risk === 'HIGH'
                        ? 'bg-orange-100 text-orange-700'
                        : s.risk === 'MODERATE'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {s.risk} RISK
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {s.demand >= 25 ? (
                      <span className="text-red-700 font-semibold">Deploy Standby Pickup Bus</span>
                    ) : s.demand >= 15 ? (
                      <span className="text-amber-700">Monitor boarding duration</span>
                    ) : (
                      <span className="text-slate-500">Standard stop timetable</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
