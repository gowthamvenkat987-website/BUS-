import React from 'react';
import { Vehicle } from '../types';
import { 
  Bus, 
  Users, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  Phone, 
  Gauge, 
  Sparkles,
  Plus
} from 'lucide-react';

interface BusManagementPageProps {
  vehicles: Vehicle[];
}

export const BusManagementPage: React.FC<BusManagementPageProps> = ({ vehicles }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              Campus Fleet & Vehicle Management
            </h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
              Dynamic Assignment
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Assigned fleet inventory for NRI Institute of Technology. Vehicles are flexibly mapped to route corridors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 font-mono">
            Fleet: 12 Vehicles (4 Standby Depot)
          </span>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((v) => {
          const isStandby = v.status.includes('Standby');
          const isDispatched = v.status.includes('Dispatched');
          const occupancyPct = Math.round((v.currentOccupancy / v.capacity) * 100);

          return (
            <div
              key={v.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition hover:shadow-md ${
                isDispatched
                  ? 'border-emerald-300 ring-2 ring-emerald-100'
                  : isStandby
                  ? 'border-slate-200'
                  : 'border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2.5 rounded-xl ${
                    isDispatched ? 'bg-emerald-600 text-white' : isStandby ? 'bg-slate-700 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                      {v.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-500">{v.plateDemo}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                  isDispatched
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : isStandby
                    ? 'bg-slate-100 text-slate-700 border border-slate-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {v.status}
                </span>
              </div>

              {/* Vehicle Specs */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">SEATING</span>
                  <span className="font-bold text-slate-900 font-mono text-sm mt-0.5 block">
                    {v.capacity} Seats
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">CURRENT LOAD</span>
                  <span className="font-bold text-slate-900 font-mono text-sm mt-0.5 block">
                    {v.currentOccupancy} pax ({occupancyPct}%)
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">SPEED</span>
                  <span className="font-bold text-slate-900 font-mono text-sm mt-0.5 block">
                    {v.speedKmph} km/h
                  </span>
                </div>
              </div>

              {/* Assignment & Location */}
              <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Assigned Corridor:</span>
                  <strong className="text-slate-800">
                    {v.routeNumber ? `Route ${v.routeNumber}` : 'Depot Standby (Unassigned)'}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Position:</span>
                  <strong className="text-blue-700">{v.currentLocation}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Driver Contact:</span>
                  <span className="font-mono text-slate-700">{v.driverName} ({v.phoneDemo})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
