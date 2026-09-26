import React, { useState, useEffect } from 'react';
import { RouteItem } from '../types';
import { Bus, Navigation, MapPin, Play, Pause, Compass } from 'lucide-react';

interface InteractiveMapProps {
  route: RouteItem;
  allRoutes?: RouteItem[];
  onSelectRoute?: (r: RouteItem) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  route,
  allRoutes = [],
  onSelectRoute
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [busProgress, setBusProgress] = useState(0.58); // Progress along Route 1 (0 to 1)
  const [selectedStop, setSelectedStop] = useState<any>(null);

  // Animate the bus along the route when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBusProgress((prev) => {
        const next = prev + 0.015;
        return next > 0.95 ? 0.1 : next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const stops = route.stops || [];

  // Calculate approximate bus position along stylized path coordinates
  // SVG coordinates bounds: width=800, height=360
  const pathPoints = [
    { x: 80, y: 70, name: stops[0]?.name || 'NRI Institute of Technology' },
    { x: 170, y: 110, name: stops[1]?.name || 'Pedda Kakani' },
    { x: 260, y: 140, name: stops[2]?.name || 'Numbur' },
    { x: 360, y: 170, name: stops[3]?.name || 'Koppuravuru' },
    { x: 470, y: 200, name: stops[4]?.name || 'Kaza' }, // Kaza
    { x: 570, y: 230, name: stops[5]?.name || 'Chinna Kakani' }, // Chinna Kakani
    { x: 670, y: 270, name: stops[6]?.name || 'Tenali Bypass' },
    { x: 740, y: 310, name: stops[7]?.name || 'Mangalagiri' }
  ];

  // Interpolate bus point
  const totalSegments = pathPoints.length - 1;
  const rawIdx = busProgress * totalSegments;
  const segIdx = Math.min(Math.floor(rawIdx), totalSegments - 1);
  const segFraction = rawIdx - segIdx;
  const p1 = pathPoints[segIdx];
  const p2 = pathPoints[segIdx + 1] || pathPoints[segIdx];
  const busX = p1.x + (p2.x - p1.x) * segFraction;
  const busY = p1.y + (p2.y - p1.y) * segFraction;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 overflow-hidden shadow-lg flex flex-col w-full min-w-0">
      {/* Map Control Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-white font-['Outfit']">
                Live Transit Telemetry
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Simulated GPS Data
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
              {route.name} • {route.assignedVehicle}
            </p>
          </div>
        </div>

        {/* Route Selectors & Play/Pause */}
        <div className="flex items-center gap-2">
          {allRoutes.length > 0 && onSelectRoute && (
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
              {allRoutes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onSelectRoute(r)}
                  className={`text-[11px] px-2.5 py-1.5 min-h-[36px] rounded-md font-medium transition cursor-pointer ${
                    r.id === route.id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  R{r.routeNumber}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 min-h-[36px] rounded-lg border border-slate-700 text-slate-200 transition cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden select-none">
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }}
        ></div>

        {/* Geographic labels (Vijayawada - Guntur Highway Corridor) */}
        <div className="absolute top-3 left-4 text-[10px] text-slate-400 uppercase tracking-widest font-mono hidden sm:block">
          NH-16 Corridor • Vijayawada - Mangalagiri Expressway
        </div>
        <div className="absolute bottom-3 right-4 text-[10px] text-slate-400 uppercase tracking-wider font-mono hidden sm:block">
          Campus Geo-Fence: NRIIT Pothavarappadu
        </div>

        <svg viewBox="0 0 800 360" className="w-full h-full">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Route path line background base */}
          <path
            d={`M ${pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
            fill="none"
            stroke="#1e293b"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Animated route highlight */}
          <path
            d={`M ${pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            strokeDasharray="6 3"
          />

          {/* Stops Markers along the Highway */}
          {stops.map((stop, i) => {
            const pt = pathPoints[i] || { x: 100 + i * 80, y: 100 + i * 25 };
            const isBottleneck = stop.name === 'Kaza' || stop.name === 'Chinna Kakani';
            const isOrigin = i === 0;
            const isDestination = i === stops.length - 1;

            return (
              <g
                key={stop.id || i}
                className="cursor-pointer group"
                onClick={() => setSelectedStop(stop)}
              >
                {/* Ping circle for bottleneck stops */}
                {isBottleneck && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="16"
                    fill="rgba(239, 68, 68, 0.2)"
                    className="animate-ping"
                  />
                )}

                {/* Base circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isOrigin || isDestination ? 9 : 7}
                  fill={isOrigin ? '#10b981' : isDestination ? '#3b82f6' : isBottleneck ? '#ef4444' : '#64748b'}
                  stroke="#0f172a"
                  strokeWidth="2.5"
                  className="transition group-hover:r-10"
                />

                {/* Stop Name Label */}
                <text
                  x={pt.x}
                  y={i % 2 === 0 ? pt.y - 14 : pt.y + 22}
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="11"
                  fontWeight={isBottleneck ? 'bold' : 'normal'}
                  className="drop-shadow group-hover:fill-amber-300"
                >
                  {stop.name}
                </text>

                {/* Demand Badge */}
                {stop.demand > 0 && (
                  <g transform={`translate(${pt.x - 14}, ${i % 2 === 0 ? pt.y - 34 : pt.y + 26})`}>
                    <rect
                      width="28"
                      height="16"
                      rx="4"
                      fill={isBottleneck ? '#b91c1c' : '#1e3a8a'}
                      stroke={isBottleneck ? '#f87171' : '#60a5fa'}
                      strokeWidth="1"
                    />
                    <text
                      x="14"
                      y="11.5"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9.5"
                      fontWeight="bold"
                    >
                      {stop.demand}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Animated Bus Icon Marker */}
          <g transform={`translate(${busX - 18}, ${busY - 18})`} className="cursor-pointer">
            <circle
              cx="18"
              cy="18"
              r="22"
              fill={route.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}
              className="animate-pulse"
            />
            <rect
              x="2"
              y="2"
              width="32"
              height="32"
              rx="8"
              fill={route.riskLevel === 'HIGH' ? '#dc2626' : '#2563eb'}
              stroke="#ffffff"
              strokeWidth="2"
            />
            {/* Bus symbol */}
            <path
              d="M10 11c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v11c0 .55-.45 1-1 1h-1v2c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2h-6v2c0 .55-.45 1-1 1H8c-.55 0-1-.45-1-1v-2H6c-.55 0-1-.45-1-1V11zm2 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm12 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2-7H10v-3h16v3z"
              fill="#ffffff"
              transform="translate(-2, -3) scale(0.9)"
            />
          </g>
        </svg>

        {/* Live Overlay Telemetry HUD (Bottom Left) */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs shadow-xl max-w-[calc(100%-1.5rem)] sm:max-w-xs z-10">
          <div className="flex items-center justify-between gap-3 pb-1 border-b border-slate-800">
            <span className="font-bold text-white flex items-center gap-1.5 truncate">
              <Bus className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{route.assignedVehicle}</span>
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
              route.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {route.riskLevel} RISK
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
            <div>
              <span className="text-slate-400">Current Occupancy:</span>
              <p className="font-mono font-bold text-slate-200">
                {route.currentPassengers} / {route.capacity} ({Math.round((route.currentPassengers / route.capacity) * 100)}%)
              </p>
            </div>
            <div>
              <span className="text-slate-400">AI Predicted Influx:</span>
              <p className="font-mono font-bold text-amber-400">
                {route.predictedPassengers} ({route.predictedOccupancy}%)
              </p>
            </div>
            <div>
              <span className="text-slate-400">Current Zone:</span>
              <p className="text-slate-200 truncate">{route.currentLocation}</p>
            </div>
            <div>
              <span className="text-slate-400">Next Stop:</span>
              <p className="text-blue-400 font-semibold truncate">{route.nextStop}</p>
            </div>
          </div>
        </div>

        {/* Selected Stop Details Popover (Top Right) */}
        {selectedStop && (
          <div className="absolute top-4 right-4 bg-slate-950/95 backdrop-blur-md p-3.5 rounded-xl border border-blue-500/50 text-xs shadow-2xl max-w-[calc(100%-2rem)] sm:w-64 animate-in fade-in z-20">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="font-bold text-blue-400 flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{selectedStop.name}</span>
              </span>
              <button
                onClick={() => setSelectedStop(null)}
                className="text-slate-400 hover:text-white text-xs px-1 cursor-pointer"
                aria-label="Close Stop Popover"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Waiting Students:</span>
                <span className="font-bold text-amber-400 font-mono">{selectedStop.demand} students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Distance from Campus:</span>
                <span className="text-slate-200 font-mono">{selectedStop.km} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Commuter Risk:</span>
                <span className={`font-bold ${selectedStop.demand >= 20 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {selectedStop.demand >= 20 ? 'Bottleneck Stop' : 'Normal Demand'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 italic">
                {selectedStop.demand >= 20 
                  ? 'High student concentration during morning arrival timetable (Simulated Data).' 
                  : 'Regular passenger boarding pattern (Simulated Data).'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Route Timeline Strip */}
      <div className="bg-slate-950 p-3 border-t border-slate-800 flex items-center justify-between text-xs overflow-x-auto touch-scroll gap-2">
        <div className="flex items-center gap-1 text-slate-400 shrink-0 font-medium">
          <Navigation className="w-3.5 h-3.5 text-blue-400" />
          <span>Stop Sequence:</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] shrink-0">
          {stops.map((s, idx) => (
            <React.Fragment key={s.id || idx}>
              <span 
                onClick={() => setSelectedStop(s)}
                className={`cursor-pointer px-2 py-0.5 rounded transition ${
                  s.name === 'Kaza' || s.name === 'Chinna Kakani'
                    ? 'bg-red-950/80 text-red-300 border border-red-800 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:text-white'
                }`}
              >
                {s.name} {s.demand > 0 && <span className="opacity-75 font-mono">({s.demand})</span>}
              </span>
              {idx < stops.length - 1 && <span className="text-slate-600">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
