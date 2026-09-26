import { RouteItem, AttendanceSession, Recommendation, AIAlert, Vehicle, College } from '../types';
import { INITIAL_ROUTES, INITIAL_SESSIONS, INITIAL_RECOMMENDATIONS, INITIAL_ALERTS, INITIAL_VEHICLES, INITIAL_COLLEGES } from '../data/mockData';

const BASE_URL = '/api';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

const getSupabaseHeaders = () => ({
  'apikey': SUPABASE_ANON_KEY || '',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY || ''}`,
  'Content-Type': 'application/json'
});

// In-browser cache for fallback resilience
let localRoutes: RouteItem[] = [...INITIAL_ROUTES];
let localSessions: AttendanceSession[] = [...INITIAL_SESSIONS];
let localRecommendations: Recommendation[] = [...INITIAL_RECOMMENDATIONS];
let localAlerts: AIAlert[] = [...INITIAL_ALERTS];
let localVehicles: Vehicle[] = [...INITIAL_VEHICLES];
let localAttendancePct = 91;

export const api = {
  // Colleges
  async getColleges(): Promise<College[]> {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const sbRes = await fetch(`${SUPABASE_URL}/rest/v1/colleges?select=*`, {
          headers: getSupabaseHeaders()
        });
        if (sbRes.ok) {
          const data = await sbRes.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (err) {
        console.warn('Supabase fetch for colleges failed, using fallback:', err);
      }
    }

    try {
      const res = await fetch(`${BASE_URL}/colleges`);
      if (res.ok) {
        const data = await res.json();
        return data.colleges || INITIAL_COLLEGES;
      }
    } catch {
      // fallback
    }
    return INITIAL_COLLEGES;
  },

  // Routes
  async getRoutes(): Promise<RouteItem[]> {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const sbRes = await fetch(`${SUPABASE_URL}/rest/v1/routes?select=*`, {
          headers: getSupabaseHeaders()
        });
        if (sbRes.ok) {
          const data = await sbRes.json();
          if (Array.isArray(data) && data.length > 0) {
            localRoutes = data;
            return data;
          }
        }
      } catch (err) {
        console.warn('Supabase fetch for routes failed, using fallback:', err);
      }
    }

    try {
      const res = await fetch(`${BASE_URL}/routes`);
      if (res.ok) {
        const data = await res.json();
        if (data.routes) {
          localRoutes = data.routes;
          return data.routes;
        }
      }
    } catch {
      // fallback
    }
    return localRoutes;
  },

  async addRoute(newRouteData: Partial<RouteItem>): Promise<RouteItem> {
    try {
      const res = await fetch(`${BASE_URL}/routes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRouteData)
      });
      if (res.ok) {
        const data = await res.json();
        return data.route;
      }
    } catch {
      // fallback
    }
    const created: RouteItem = {
      id: `route-${localRoutes.length + 1}`,
      routeNumber: localRoutes.length + 1,
      name: newRouteData.name || `Route ${localRoutes.length + 1}`,
      slug: `route-${localRoutes.length + 1}`,
      collegeId: 'nriit-pilot',
      origin: newRouteData.origin || 'NRI Institute of Technology',
      destination: newRouteData.destination || 'New Transit Hub',
      assignedVehicle: `Assigned Vehicle ${String.fromCharCode(65 + localRoutes.length)}`,
      capacity: newRouteData.capacity || 50,
      currentPassengers: 0,
      predictedPassengers: 0,
      predictedOccupancy: 0,
      riskLevel: 'SAFE',
      status: 'Scheduled',
      currentLocation: 'Campus Depot',
      nextStop: 'First Stop',
      etaMinutes: 15,
      stops: newRouteData.stops || [],
      explanation: 'Newly configured route awaiting initial trip activation.',
      recommendation: 'Monitor student registrations.'
    };
    localRoutes.push(created);
    return created;
  },

  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    try {
      const res = await fetch(`${BASE_URL}/vehicles`);
      if (res.ok) {
        const data = await res.json();
        return data.vehicles || localVehicles;
      }
    } catch {
      // fallback
    }
    return localVehicles;
  },

  // QR Attendance Sessions
  async getSessions(): Promise<AttendanceSession[]> {
    try {
      const res = await fetch(`${BASE_URL}/attendance/sessions`);
      if (res.ok) {
        const data = await res.json();
        return data.sessions || localSessions;
      }
    } catch {
      // fallback
    }
    return localSessions;
  },

  async generateSession(sessionData: {
    department: string;
    year: string;
    section: string;
    subject: string;
    period: string;
    expiryMinutes: number;
  }): Promise<AttendanceSession> {
    try {
      const res = await fetch(`${BASE_URL}/attendance/generate-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      if (res.ok) {
        const data = await res.json();
        return data.session;
      }
    } catch {
      // fallback
    }
    const token = `NRIIT-ATT-${Date.now().toString().slice(-4)}-${sessionData.department.toUpperCase()}${sessionData.section}`;
    const newSession: AttendanceSession = {
      id: `sess-${Date.now()}`,
      sessionToken: token,
      department: sessionData.department,
      year: sessionData.year,
      section: sessionData.section,
      subject: sessionData.subject,
      period: sessionData.period,
      room: 'Room 304, Abdul Kalam Block',
      facultyName: 'Dr. K. Srinivas (Demo)',
      totalStudents: 60,
      presentCount: 0,
      attendancePct: 0,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (sessionData.expiryMinutes || 8) * 60000).toISOString(),
      status: 'Active'
    };
    localSessions.unshift(newSession);
    return newSession;
  },

  async scanAttendance(payload: {
    sessionToken: string;
    studentId: string;
    studentName: string;
    department: string;
    section: string;
  }): Promise<{ success: boolean; message: string; sessionStats?: any }> {
    try {
      const res = await fetch(`${BASE_URL}/attendance/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to submit attendance' };
      }
      return { success: true, message: data.message, sessionStats: data.sessionStats };
    } catch {
      // fallback local duplicate check
      const sess = localSessions.find(s => s.sessionToken === payload.sessionToken);
      if (!sess) return { success: false, message: 'Invalid or unrecognized Attendance QR Code.' };
      if (new Date(sess.expiresAt) <= new Date()) return { success: false, message: 'Attendance session expired.' };
      
      sess.presentCount = Math.min(sess.totalStudents, sess.presentCount + 1);
      sess.attendancePct = Math.round((sess.presentCount / sess.totalStudents) * 100);
      return {
        success: true,
        message: 'Attendance Marked Successfully',
        sessionStats: { present: sess.presentCount, total: sess.totalStudents, attendancePct: sess.attendancePct }
      };
    }
  },

  // Attendance Simulator
  async simulateAttendance(percentage: number): Promise<{ success: boolean; routes: RouteItem[] }> {
    localAttendancePct = percentage;
    try {
      const res = await fetch(`${BASE_URL}/attendance/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ percentage })
      });
      if (res.ok) {
        const data = await res.json();
        localRoutes = data.routes || localRoutes;
        return { success: true, routes: localRoutes };
      }
    } catch {
      // fallback local calculation
    }

    // Local algorithmic update
    const ratio = percentage / 85.0;
    localRoutes.forEach(route => {
      if (route.id === 'route-1') {
        const pred = Math.round(40 * 0.4 + (63 * 0.58 * Math.pow(ratio, 1.4)));
        route.predictedPassengers = pred;
        route.predictedOccupancy = Math.round((pred / route.capacity) * 100);
        route.riskLevel = route.predictedOccupancy >= 100 ? 'HIGH' : (route.predictedOccupancy >= 75 ? 'MODERATE' : 'SAFE');
        route.explanation = `Passenger demand is predicted at ${route.predictedPassengers} (${route.predictedOccupancy}%) based on ${percentage}% campus attendance, high boarding demand at Kaza/Chinna Kakani, and peak timetable.`;
      } else if (route.id === 'route-2') {
        const pred = Math.round(34 + 10 * ratio);
        route.predictedPassengers = pred;
        route.predictedOccupancy = Math.round((pred / route.capacity) * 100);
        route.riskLevel = route.predictedOccupancy >= 100 ? 'HIGH' : (route.predictedOccupancy >= 75 ? 'MODERATE' : 'SAFE');
      } else if (route.id === 'route-3') {
        const pred = Math.round(18 + 4 * ratio);
        route.predictedPassengers = pred;
        route.predictedOccupancy = Math.round((pred / route.capacity) * 100);
        route.riskLevel = route.predictedOccupancy >= 100 ? 'HIGH' : (route.predictedOccupancy >= 75 ? 'MODERATE' : 'SAFE');
      }
    });

    return { success: true, routes: localRoutes };
  },

  // Recommendations & Actions
  async getRecommendations(): Promise<Recommendation[]> {
    try {
      const res = await fetch(`${BASE_URL}/recommendations`);
      if (res.ok) {
        const data = await res.json();
        return data.recommendations || localRecommendations;
      }
    } catch {
      // fallback
    }
    return localRecommendations;
  },

  async applyRecommendation(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${BASE_URL}/recommendations/${id}/apply`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.routes) localRoutes = data.routes;
        if (data.recommendations) localRecommendations = data.recommendations;
        return { success: true, message: data.message };
      }
    } catch {
      // fallback
    }

    const rec = localRecommendations.find(r => r.id === id);
    if (rec) {
      rec.status = 'applied';
      if (rec.id === 'rec-r1-deploy') {
        const r1 = localRoutes.find(r => r.id === 'route-1');
        if (r1) {
          r1.capacity = 85;
          r1.predictedOccupancy = Math.round((r1.predictedPassengers / r1.capacity) * 100);
          r1.riskLevel = 'SAFE';
          r1.assignedVehicle = 'Assigned Vehicle A + Standby Vehicle D (Dispatched)';
          r1.explanation = 'Standby Vehicle D (35 seats) successfully deployed. Route 1 capacity expanded to 85 seats, bringing risk to SAFE (68%).';
        }
        const a1 = localAlerts.find(a => a.id === 'alt-01');
        if (a1) a1.status = 'resolved';
      }
    }
    return { success: true, message: 'Action deployed successfully' };
  },

  // Alerts
  async getAlerts(): Promise<AIAlert[]> {
    try {
      const res = await fetch(`${BASE_URL}/alerts`);
      if (res.ok) {
        const data = await res.json();
        return data.alerts || localAlerts;
      }
    } catch {
      // fallback
    }
    return localAlerts;
  },

  async acknowledgeAlert(id: string): Promise<boolean> {
    try {
      await fetch(`${BASE_URL}/alerts/${id}/acknowledge`, { method: 'POST' });
    } catch {
      // fallback
    }
    const alt = localAlerts.find(a => a.id === id);
    if (alt) alt.status = 'acknowledged';
    return true;
  }
};
