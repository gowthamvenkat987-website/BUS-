/// <reference types="@types/google.maps" />
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RouteItem, Stop } from '../types';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { 
  Bus, 
  Navigation, 
  MapPin, 
  Play, 
  Pause, 
  Compass, 
  Key, 
  MapPinOff,
  Layers
} from 'lucide-react';

interface InteractiveMapProps {
  route: RouteItem;
  allRoutes?: RouteItem[];
  onSelectRoute?: (r: RouteItem) => void;
}

// Sleek Dark Theme for Google Maps matching NRI University Bus design system
const GOOGLE_MAPS_DARK_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#e2e8f0' }]
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#94a3b8' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64748b' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#064e3b' }, { lightness: -20 }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#334155' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#cbd5e1' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#2563eb' }, { lightness: -30 }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1d4ed8' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#bfdbfe' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0369a1' }, { lightness: -50 }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#0f172a' }]
  }
];

// Helper to create custom SVG pin icons for Google Maps markers
const createStopPinSvg = (type: 'campus' | 'bottleneck' | 'destination' | 'regular', demand: number) => {
  let bg = '#0284c7';
  let stroke = '#38bdf8';
  let badgeColor = '#0369a1';

  if (type === 'campus') {
    bg = '#10b981';
    stroke = '#34d399';
    badgeColor = '#047857';
  } else if (type === 'bottleneck') {
    bg = '#ef4444';
    stroke = '#f87171';
    badgeColor = '#b91c1c';
  } else if (type === 'destination') {
    bg = '#6366f1';
    stroke = '#818cf8';
    badgeColor = '#4338ca';
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="48" viewBox="0 0 38 48">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.5"/>
        </filter>
      </defs>
      <path d="M19 0C8.5 0 0 8.5 0 19c0 14.2 17.1 27.8 17.8 28.4.7.5 1.7.5 2.4 0C20.9 46.8 38 33.2 38 19 38 8.5 29.5 0 19 0z" 
            fill="${bg}" stroke="${stroke}" stroke-width="2" filter="url(#shadow)"/>
      <circle cx="19" cy="18" r="13" fill="#ffffff" opacity="0.95"/>
      ${type === 'campus' 
        ? `<text x="19" y="22" font-family="'Outfit', sans-serif" font-size="11" font-weight="900" fill="#047857" text-anchor="middle">NRI</text>`
        : demand > 0 
          ? `<text x="19" y="22" font-family="monospace" font-size="11" font-weight="bold" fill="${badgeColor}" text-anchor="middle">${demand}</text>`
          : `<circle cx="19" cy="18" r="6" fill="${bg}"/>`
      }
    </svg>
  `;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
};

// Helper for animated Bus marker icon
const createBusMarkerSvg = (isHighRisk: boolean) => {
  const color = isHighRisk ? '#dc2626' : '#2563eb';
  const stroke = isHighRisk ? '#f87171' : '#60a5fa';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46">
      <defs>
        <filter id="busGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="${color}" flood-opacity="0.8"/>
        </filter>
      </defs>
      <circle cx="23" cy="23" r="21" fill="${color}" fill-opacity="0.25" stroke="${stroke}" stroke-width="1.5"/>
      <rect x="7" y="7" width="32" height="32" rx="9" fill="${color}" stroke="#ffffff" stroke-width="2.5" filter="url(#busGlow)"/>
      <g transform="translate(11, 11)" fill="#ffffff">
        <path d="M4 2c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h1v2c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-2h6v2c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-2h1c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4zm1 3h14v5H5V5zm1.5 12c-.8 0-1.5-.7-1.5-1.5S5.7 14 6.5 14s1.5.7 1.5 1.5S7.3 17 6.5 17zm11 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/>
      </g>
    </svg>
  `;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  route,
  allRoutes = [],
  onSelectRoute
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const fallbackPolylineRef = useRef<google.maps.Polyline | null>(null);
  const stopMarkersRef = useRef<google.maps.Marker[]>([]);
  const busMarkerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const roadCoordinatesRef = useRef<google.maps.LatLng[]>([]);

  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [busProgress, setBusProgress] = useState<number>(0.58);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [routeDistanceKm, setRouteDistanceKm] = useState<string>('28.0');
  const [routeDurationMin, setRouteDurationMin] = useState<string>('42');

  // Retrieve Google Maps API key from environment variable (Never hardcoded)
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim() || '';

  // Animate the simulated bus position along the route
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBusProgress((prev) => {
        const next = prev + 0.015;
        return next > 0.96 ? 0.08 : next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Initialize Google Maps instance using modern setOptions + importLibrary
  useEffect(() => {
    if (!apiKey) {
      setLoadError('Google Maps is unavailable. Configure a valid Google Maps API key.');
      setMapLoaded(false);
      return;
    }

    let isMounted = true;

    const initGoogleMap = async () => {
      try {
        setOptions({
          key: apiKey,
          v: 'weekly'
        });

        // Load modern Google Maps libraries
        await Promise.all([
          importLibrary('maps'),
          importLibrary('routes')
        ]);

        if (!isMounted || !mapContainerRef.current) return;
        const google = window.google;
        if (!google || !google.maps) return;

        // Initialize Map
        const map = new google.maps.Map(mapContainerRef.current, {
          center: { lat: 16.50, lng: 80.65 }, // Corridor center
          zoom: 11,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: GOOGLE_MAPS_DARK_STYLE,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true
        });

        // Initialize DirectionsRenderer with suppressed default markers
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#3b82f6',
            strokeWeight: 5,
            strokeOpacity: 0.9
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          disableAutoPan: false
        });

        mapInstanceRef.current = map;
        directionsRendererRef.current = directionsRenderer;
        infoWindowRef.current = infoWindow;

        setMapLoaded(true);
        setLoadError(null);
      } catch (err: unknown) {
        console.error('Google Maps initialization failed:', err);
        if (isMounted) {
          setLoadError('Google Maps is unavailable. Configure a valid Google Maps API key.');
          setMapLoaded(false);
        }
      }
    };

    initGoogleMap();

    // Trigger Google Maps resize upon viewport and orientation changes
    const handleMapResize = () => {
      if (mapInstanceRef.current && window.google?.maps) {
        window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
      }
    };

    window.addEventListener('resize', handleMapResize);
    window.addEventListener('orientationchange', handleMapResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleMapResize);
      window.removeEventListener('orientationchange', handleMapResize);
    };
  }, [apiKey]);

  // Calculate real road route using DirectionsService / Routes API & render stop markers
  const renderRouteOnGoogleMap = useCallback(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;
    const google = window.google;
    if (!google || !google.maps) return;

    const map = mapInstanceRef.current;
    const stops = route.stops || [];
    if (stops.length < 2) return;

    // Clear existing markers & fallback polyline
    stopMarkersRef.current.forEach((m) => m.setMap(null));
    stopMarkersRef.current = [];
    if (fallbackPolylineRef.current) {
      fallbackPolylineRef.current.setMap(null);
      fallbackPolylineRef.current = null;
    }

    const bounds = new google.maps.LatLngBounds();

    // Create markers for every stop
    stops.forEach((stop, idx) => {
      if (stop.lat === undefined || stop.lng === undefined) return;
      const pos = new google.maps.LatLng(stop.lat, stop.lng);
      bounds.extend(pos);

      const isCampus = idx === 0;
      const isDestination = idx === stops.length - 1;
      const isBottleneck = stop.name === 'Kaza' || stop.name === 'Chinna Kakani' || (stop.demand !== undefined && stop.demand >= 20);

      const pinType: 'campus' | 'bottleneck' | 'destination' | 'regular' = isCampus
        ? 'campus'
        : isDestination
        ? 'destination'
        : isBottleneck
        ? 'bottleneck'
        : 'regular';

      const marker = new google.maps.Marker({
        position: pos,
        map,
        title: `${stop.name} (${stop.demand} students - Demo Data)`,
        icon: {
          url: createStopPinSvg(pinType, stop.demand || 0),
          scaledSize: new google.maps.Size(34, 42),
          anchor: new google.maps.Point(17, 42)
        },
        zIndex: isCampus ? 100 : isBottleneck ? 90 : 50
      });

      // Interactive InfoWindow on click
      marker.addListener('click', () => {
        setSelectedStop(stop);
        if (infoWindowRef.current) {
          const riskLabel = isBottleneck ? 'HIGH RISK' : 'NORMAL DEMAND';
          const content = `
            <div style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; color: #0f172a; padding: 4px; min-width: 210px;">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
                <strong style="font-size: 13px; color: #0f172a;">${stop.name}</strong>
                <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${isBottleneck ? '#fee2e2; color: #991b1b;' : '#ecfdf5; color: #065f46;'}">
                  ${riskLabel}
                </span>
              </div>
              <div style="font-size: 12px; margin-bottom: 3px; display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Current Demand:</span>
                <strong style="color: #0f172a; font-family: monospace;">${stop.demand} students</strong>
              </div>
              <div style="font-size: 12px; margin-bottom: 3px; display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Distance from NRIIT:</span>
                <span style="color: #0f172a; font-family: monospace;">${stop.km} km</span>
              </div>
              <div style="font-size: 12px; margin-bottom: 4px; display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Predicted Boarding:</span>
                <strong style="color: #d97706; font-family: monospace;">+${stop.predictedAddition || Math.round(stop.demand * 0.3)}</strong>
              </div>
              <div style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed #cbd5e1; font-size: 10px; color: #64748b; display: flex; justify-content: space-between;">
                <span>${isCampus ? 'NRIIT Campus Anchor' : 'Bus Stop Node'}</span>
                <span style="font-weight: 600; color: #2563eb;">Demo Data</span>
              </div>
            </div>
          `;
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(map, marker);
        }
      });

      stopMarkersRef.current.push(marker);
    });

    // Request actual road route from DirectionsService
    const originStop = stops[0];
    const destinationStop = stops[stops.length - 1];

    if (originStop.lat === undefined || destinationStop.lat === undefined) return;

    const origin = new google.maps.LatLng(originStop.lat, originStop.lng!);
    const destination = new google.maps.LatLng(destinationStop.lat, destinationStop.lng!);

    // Intermediate waypoints
    const intermediateStops = stops.slice(1, -1);
    const waypoints: google.maps.DirectionsWaypoint[] = intermediateStops
      .filter((s) => s.lat !== undefined && s.lng !== undefined)
      .map((s) => ({
        location: new google.maps.LatLng(s.lat!, s.lng!),
        stopover: true
      }));

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false // Keep exact configured NRIIT stop sequence
      },
      (result: google.maps.DirectionsResult | null, status: any) => {
        if (status === google.maps.DirectionsStatus.OK && result && directionsRendererRef.current) {
          directionsRendererRef.current.setDirections(result);

          // Extract real road coordinates along the route for bus animation
          const overviewPath = result.routes[0]?.overview_path || [];
          roadCoordinatesRef.current = overviewPath;

          // Compute total distance & duration from Google Maps road network
          const totalDistanceMeters = result.routes[0]?.legs.reduce((acc: number, leg: google.maps.DirectionsLeg) => acc + (leg.distance?.value || 0), 0) || 0;
          const totalDurationSeconds = result.routes[0]?.legs.reduce((acc: number, leg: google.maps.DirectionsLeg) => acc + (leg.duration?.value || 0), 0) || 0;

          if (totalDistanceMeters > 0) {
            setRouteDistanceKm((totalDistanceMeters / 1000).toFixed(1));
          }
          if (totalDurationSeconds > 0) {
            setRouteDurationMin(Math.round(totalDurationSeconds / 60).toString());
          }

          if (result.routes[0]?.bounds) {
            map.fitBounds(result.routes[0].bounds);
          }
        } else {
          // Fallback: If DirectionsService is rate-limited or fails, connect stops via Google Maps Polyline
          console.warn('Google Maps DirectionsService status:', status, '- Using stop polyline fallback.');
          const pathPoints = stops
            .filter((s) => s.lat !== undefined && s.lng !== undefined)
            .map((s) => new google.maps.LatLng(s.lat!, s.lng!));

          roadCoordinatesRef.current = pathPoints;

          const polyline = new google.maps.Polyline({
            path: pathPoints,
            geodesic: true,
            strokeColor: '#3b82f6',
            strokeOpacity: 0.9,
            strokeWeight: 4,
            map
          });
          fallbackPolylineRef.current = polyline;
          map.fitBounds(bounds);
        }
      }
    );
  }, [mapLoaded, route]);

  useEffect(() => {
    renderRouteOnGoogleMap();
  }, [renderRouteOnGoogleMap]);

  // Update animated bus marker position along the Google Maps road path
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;
    const google = window.google;
    if (!google || !google.maps) return;

    const map = mapInstanceRef.current;
    const path = roadCoordinatesRef.current;

    let targetLatLng: google.maps.LatLng | null = null;

    if (path.length > 1) {
      const targetIndex = Math.min(
        Math.floor(busProgress * (path.length - 1)),
        path.length - 1
      );
      targetLatLng = path[targetIndex];
    } else {
      // Interpolate along route stops if road path is not yet ready
      const stops = (route.stops || []).filter((s) => s.lat !== undefined && s.lng !== undefined);
      if (stops.length > 1) {
        const rawIdx = busProgress * (stops.length - 1);
        const segIdx = Math.min(Math.floor(rawIdx), stops.length - 2);
        const segFrac = rawIdx - segIdx;
        const s1 = stops[segIdx];
        const s2 = stops[segIdx + 1];
        const lat = s1.lat! + (s2.lat! - s1.lat!) * segFrac;
        const lng = s1.lng! + (s2.lng! - s1.lng!) * segFrac;
        targetLatLng = new google.maps.LatLng(lat, lng);
      }
    }

    if (!targetLatLng) return;

    const isHighRisk = route.riskLevel === 'HIGH';

    if (!busMarkerRef.current) {
      const busMarker = new google.maps.Marker({
        position: targetLatLng,
        map,
        title: `${route.assignedVehicle} (Simulated GPS Data)`,
        icon: {
          url: createBusMarkerSvg(isHighRisk),
          scaledSize: new google.maps.Size(46, 46),
          anchor: new google.maps.Point(23, 23)
        },
        zIndex: 200
      });

      busMarker.addListener('click', () => {
        if (infoWindowRef.current) {
          const content = `
            <div style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; color: #0f172a; padding: 4px; min-width: 220px;">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
                <strong style="font-size: 13px; color: #1d4ed8;">${route.assignedVehicle}</strong>
                <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${isHighRisk ? '#fee2e2; color: #991b1b;' : '#ecfdf5; color: #065f46;'}">
                  ${route.riskLevel} RISK
                </span>
              </div>
              <div style="font-size: 12px; margin-bottom: 3px; display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Current Occupancy:</span>
                <strong style="color: #0f172a; font-family: monospace;">${route.currentPassengers} / ${route.capacity} (${Math.round((route.currentPassengers / route.capacity) * 100)}%)</strong>
              </div>
              <div style="font-size: 12px; margin-bottom: 3px; display: flex; justify-content: space-between;">
                <span style="color: #64748b;">AI Predicted Influx:</span>
                <strong style="color: #d97706; font-family: monospace;">${route.predictedPassengers} (${route.predictedOccupancy}%)</strong>
              </div>
              <div style="font-size: 12px; margin-bottom: 4px; display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Next Stop:</span>
                <span style="color: #2563eb; font-weight: 600;">${route.nextStop}</span>
              </div>
              <div style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed #cbd5e1; font-size: 10px; color: #64748b; display: flex; justify-content: space-between;">
                <span>GPS Telemetry Status:</span>
                <span style="font-weight: 700; color: #059669;">Simulated GPS Data</span>
              </div>
            </div>
          `;
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(map, busMarker);
        }
      });

      busMarkerRef.current = busMarker;
    } else {
      busMarkerRef.current.setPosition(targetLatLng);
      busMarkerRef.current.setIcon({
        url: createBusMarkerSvg(isHighRisk),
        scaledSize: new google.maps.Size(46, 46),
        anchor: new google.maps.Point(23, 23)
      });
    }
  }, [busProgress, mapLoaded, route]);

  const stops = route.stops || [];

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 overflow-hidden shadow-lg flex flex-col">
      {/* Map Control Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-['Outfit']">
                Live Transit Telemetry
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Simulated GPS Data
              </span>
              {mapLoaded && (
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  Google Maps API
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {route.name} • {route.assignedVehicle} • Road Corridor: {routeDistanceKm} km (~{routeDurationMin} min)
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
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition ${
                    r.id === route.id
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
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
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-xs px-2.5 py-1 rounded-lg border border-slate-700 text-slate-200 transition font-medium"
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

      {/* Main Map Container with Responsive Heights */}
      <div className="relative w-full h-[340px] sm:h-[400px] md:h-[450px] lg:h-[480px] bg-slate-950 overflow-hidden select-none min-w-0">
        {/* Real Google Map Element */}
        <div
          ref={mapContainerRef}
          className={`w-full h-full ${!mapLoaded ? 'hidden' : 'block'}`}
        />

        {/* Clean Fallback State if Google Maps API key is missing or invalid */}
        {(!mapLoaded || loadError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-center overflow-y-auto touch-scroll">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2 sm:mb-3 shadow-lg shrink-0">
              <MapPinOff className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white font-['Outfit'] mb-1">
              Google Maps is unavailable
            </h3>
            <p className="text-[11px] sm:text-xs text-amber-300 font-semibold mb-1.5 sm:mb-2 max-w-md">
              Configure a valid Google Maps API key and ensure the required Google Maps APIs are enabled.
            </p>
            <p className="text-[10px] sm:text-xs text-slate-400 max-w-md mb-3 sm:mb-4">
              Add <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300 font-mono text-[10px] sm:text-[11px]">VITE_GOOGLE_MAPS_API_KEY</code> in <code className="bg-slate-800 px-1 py-0.5 rounded text-blue-300 font-mono text-[10px] sm:text-[11px]">frontend/.env</code> to render real road networks, DirectionsService highway routing, and interactive transit tiles.
            </p>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 max-w-lg w-full text-left text-[11px] sm:text-xs mb-3 shadow-xl">
              <div className="flex items-center gap-2 pb-1.5 sm:pb-2 border-b border-slate-800 font-medium text-slate-200">
                <Key className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Environment Configuration Guide</span>
              </div>
              <div className="mt-2 space-y-1.5 text-[10px] sm:text-[11px] text-slate-400">
                <p>1. Open or create <code className="text-blue-300 font-mono">frontend/.env</code></p>
                <div className="p-1.5 sm:p-2 rounded bg-slate-950 font-mono text-emerald-400 text-[9.5px] sm:text-[10px] border border-slate-800 select-all overflow-x-auto">
                  VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
                </div>
                <p>2. Ensure <strong>Maps JavaScript API</strong> & <strong>Routes / Directions API</strong> are enabled in Google Cloud Console.</p>
                <p>3. Restart the frontend server to view live Google Maps visualization.</p>
              </div>
            </div>

            {/* Configured Route 1 Stop Coordinates Table */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-[9px] sm:text-[10px] text-slate-400 max-w-lg w-full flex items-center justify-between font-mono">
              <span className="truncate">Configured NRIIT Route 1 Corridor:</span>
              <span className="text-blue-400 shrink-0 ml-2">8 Real Waypoints Ready</span>
            </div>
          </div>
        )}

        {/* Live Overlay Telemetry HUD (Bottom Left) - Responsive */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-slate-950/92 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-slate-800 text-[11px] sm:text-xs shadow-2xl max-w-[calc(100%-1rem)] sm:max-w-xs pointer-events-auto z-10">
          <div className="flex items-center justify-between gap-3 pb-1 border-b border-slate-800">
            <span className="font-bold text-white flex items-center gap-1.5 truncate">
              <Bus className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{route.assignedVehicle}</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold shrink-0 ${
                route.riskLevel === 'HIGH'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {route.riskLevel} RISK
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] sm:text-[11px]">
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

        {/* Selected Stop Details Popover (Top Right) - Responsive */}
        {selectedStop && (
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-slate-950/95 backdrop-blur-md p-3 sm:p-3.5 rounded-xl border border-blue-500/50 text-xs shadow-2xl w-[calc(100%-1rem)] sm:w-64 max-w-xs animate-in fade-in z-20">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="font-bold text-blue-400 flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{selectedStop.name}</span>
              </span>
              <button
                onClick={() => setSelectedStop(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 min-h-[30px] min-w-[30px] flex items-center justify-center rounded"
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
              {selectedStop.lat !== undefined && selectedStop.lng !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="text-slate-300 font-mono text-[10px]">
                    {selectedStop.lat.toFixed(4)}°, {selectedStop.lng.toFixed(4)}°
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Commuter Risk:</span>
                <span
                  className={`font-bold ${
                    selectedStop.demand >= 20 ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {selectedStop.demand >= 20 ? 'Bottleneck Stop' : 'Normal Demand'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 italic">
                {selectedStop.demand >= 20
                  ? 'High student concentration during morning arrival timetable (Demo Data).'
                  : 'Regular passenger boarding pattern (Demo Data).'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Route Timeline Strip */}
      <div className="bg-slate-950 p-3 border-t border-slate-800 flex items-center justify-between text-xs overflow-x-auto gap-2">
        <div className="flex items-center gap-1 text-slate-400 shrink-0 font-medium">
          <Navigation className="w-3.5 h-3.5 text-blue-400" />
          <span>Stop Sequence:</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] shrink-0">
          {stops.map((s, idx) => (
            <React.Fragment key={s.id || idx}>
              <span
                onClick={() => {
                  setSelectedStop(s);
                  if (mapInstanceRef.current && s.lat !== undefined && s.lng !== undefined) {
                    mapInstanceRef.current.panTo({ lat: s.lat, lng: s.lng });
                    mapInstanceRef.current.setZoom(13);
                  }
                }}
                className={`cursor-pointer px-2 py-0.5 rounded transition ${
                  s.name === 'Kaza' || s.name === 'Chinna Kakani' || (s.demand !== undefined && s.demand >= 20)
                    ? 'bg-red-950/80 text-red-300 border border-red-800 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:text-white'
                }`}
              >
                {s.name}{' '}
                {s.demand > 0 && <span className="opacity-75 font-mono">({s.demand})</span>}
              </span>
              {idx < stops.length - 1 && <span className="text-slate-600">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
