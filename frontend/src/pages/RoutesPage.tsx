import React, { useState } from 'react';
import { RouteItem } from '../types';
import { 
  MapPin, 
  Plus, 
  Bus, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Clock,
  Sparkles,
  X
} from 'lucide-react';

interface RoutesPageProps {
  routes: RouteItem[];
  onAddRoute: (newRoute: Partial<RouteItem>) => Promise<RouteItem>;
}

export const RoutesPage: React.FC<RoutesPageProps> = ({ routes, onAddRoute }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteItem>(routes[0]);

  // Form state
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('NRI Institute of Technology (Pothavarappadu)');
  const [destination, setDestination] = useState('');
  const [capacity, setCapacity] = useState('50');
  const [stopsText, setStopsText] = useState('Pothavarappadu, Nunna Junction, Kandrika, Gunadala');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !destination) return;
    setIsSubmitting(true);

    const parsedStops = stopsText.split(',').map((s, idx) => ({
      id: `custom-s${idx + 1}`,
      name: s.trim(),
      km: idx * 4.5,
      demand: Math.floor(Math.random() * 18) + 5,
      waitingStudents: Math.floor(Math.random() * 18) + 5,
      predictedAddition: 4
    }));

    await onAddRoute({
      name,
      origin,
      destination,
      capacity: parseInt(capacity) || 50,
      stops: parsedStops
    });

    setName('');
    setDestination('');
    setIsSubmitting(false);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              Campus Transit Routes
            </h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
              Route-First Architecture
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Dynamic transit corridors designed for NRI Institute of Technology. Vehicles are flexibly assigned based on demand.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          id="btn-add-route"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold shadow-sm transition shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Route</span>
        </button>
      </div>

      {/* Notice Banner */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Architectural Principle: Route-First, Dynamic Vehicle Allocation</p>
          <p className="text-[11px] text-blue-800 mt-0.5 break-anywhere">
            Routes represent fixed corridors (e.g. Route 1 Mangalagiri, Route 2 Benz Circle). Buses are dynamically allocated from the fleet based on real-time AI demand forecasts rather than static vehicle numbers.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Route Cards / Right Selected Route Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Route Cards */}
        <div className="space-y-3.5 lg:col-span-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Configured Corridors ({routes.length})
          </div>

          {routes.map((r) => {
            const isSelected = r.id === selectedRoute.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedRoute(r)}
                className={`p-4 rounded-xl border cursor-pointer transition-all min-w-0 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                    Route {r.routeNumber}
                  </span>
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

                <h3 className="text-sm font-bold text-slate-900 mt-2 truncate">{r.name}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{r.origin} → {r.destination}</p>

                <div className="mt-3 flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
                  <span className="text-slate-500 font-mono text-[11px] truncate">{r.assignedVehicle}</span>
                  <span className="font-bold text-slate-800 font-mono text-[11px] shrink-0">
                    {r.predictedPassengers}/{r.capacity} pax ({r.predictedOccupancy}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Route Details & Stops Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-6 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
                CORRIDOR PROFILE
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-['Outfit'] mt-0.5 break-anywhere">
                {selectedRoute.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 break-anywhere">
                {selectedRoute.origin} ⇄ {selectedRoute.destination}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                selectedRoute.riskLevel === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {selectedRoute.riskLevel} OVERCROWDING RISK
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 min-w-0">
              <span className="text-slate-400 text-[10px] block">ASSIGNED VEHICLE</span>
              <span className="font-bold text-slate-900 truncate block mt-0.5">
                {selectedRoute.assignedVehicle}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 min-w-0">
              <span className="text-slate-400 text-[10px] block">SEATING CAPACITY</span>
              <span className="font-bold text-slate-900 font-mono text-sm block mt-0.5">
                {selectedRoute.capacity} Seats
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 min-w-0">
              <span className="text-slate-400 text-[10px] block">CURRENT LOAD</span>
              <span className="font-bold text-slate-900 font-mono text-sm block mt-0.5">
                {selectedRoute.currentPassengers} passengers
              </span>
            </div>
            <div className="bg-red-50 p-3 rounded-xl border border-red-200 min-w-0">
              <span className="text-red-600 text-[10px] block font-semibold">AI PREDICTED</span>
              <span className="font-bold text-red-700 font-mono text-sm block mt-0.5">
                {selectedRoute.predictedPassengers} pax ({selectedRoute.predictedOccupancy}%)
              </span>
            </div>
          </div>

          {/* Route 1 Special Specification Banner */}
          {selectedRoute.id === 'route-1' && (
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Primary Pilot Transit Corridor: Route 1 (Mangalagiri)</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed break-anywhere">
                Connects NRI Institute of Technology via Pedda Kakani, Numbur, Koppuravuru, Kaza, Chinna Kakani, Tenali Bypass to Mangalagiri. Stop concentration at Kaza and Chinna Kakani generates the morning passenger surge.
              </p>
            </div>
          )}

          {/* Stops Timeline */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-['Outfit'] mb-3">
              Corridor Waypoints & Stop Boarding Estimates
            </h4>

            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {selectedRoute.stops?.map((stop, idx) => (
                <div key={stop.id || idx} className="relative flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 sm:gap-0">
                  {/* Timeline dot */}
                  <span className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    idx === 0
                      ? 'bg-emerald-500'
                      : idx === (selectedRoute.stops?.length || 0) - 1
                      ? 'bg-blue-600'
                      : stop.demand >= 25
                      ? 'bg-red-500 ring-2 ring-red-200'
                      : 'bg-slate-400'
                  }`}></span>

                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-bold text-slate-900">{stop.name}</span>
                      {stop.demand >= 25 && (
                        <span className="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0">
                          Bottleneck Surge
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{stop.km} km marker</span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-[11px] text-slate-500">Waiting:</span>
                    <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {stop.demand} students
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Route Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Add New Transit Corridor
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Route Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Route 4 — Poranki & Penamaluru Hub"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-blue-600 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Origin Point</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-blue-600 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Destination Point</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Poranki Center"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-blue-600 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Vehicle Seating Capacity</label>
                <input
                  type="number"
                  min="20"
                  max="80"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-blue-600 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Intermediate Stops (comma-separated)
                </label>
                <textarea
                  rows={3}
                  value={stopsText}
                  onChange={(e) => setStopsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-blue-600 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 min-h-[44px] rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs flex items-center justify-center"
                >
                  {isSubmitting ? 'Saving...' : 'Add Route Corridor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
