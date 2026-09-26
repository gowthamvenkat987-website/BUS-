const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory state initialized from seed data
const DB_DIR = path.join(__dirname, '..', 'database');

function loadJson(file, fallback) {
  try {
    const fullPath = path.join(DB_DIR, file);
    if (fs.existsSync(fullPath)) {
      return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
  return fallback;
}

let colleges = loadJson('colleges.json', []);
let routes = loadJson('routes.json', []);
let vehicles = loadJson('vehicles.json', []);
let attendanceData = loadJson('attendance_sessions.json', { activeSessions: [], demoStudents: [] });

// Attendance records list
let attendanceRecords = [
  {
    id: "rec-001",
    sessionId: "sess-cse-a-01",
    studentId: "21NR1A0501",
    studentName: "B. Sai Teja",
    department: "CSE",
    section: "A",
    markedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    status: "Present"
  },
  {
    id: "rec-002",
    sessionId: "sess-cse-a-01",
    studentId: "21NR1A0502",
    studentName: "Ch. Mounika",
    department: "CSE",
    section: "A",
    markedAt: new Date(Date.now() - 20 * 60000).toISOString(),
    status: "Present"
  }
];

// Current Simulated Attendance State
let simulatedAttendance = {
  overallPercentage: 91,
  totalStudents: 1200,
  presentStudents: 1092,
  departmentBreakdown: [
    { name: "CSE", total: 360, present: 338, pct: 93.8 },
    { name: "ECE", total: 300, present: 279, pct: 93.0 },
    { name: "IT", total: 180, present: 162, pct: 90.0 },
    { name: "AIML & DS", total: 180, present: 164, pct: 91.1 },
    { name: "MECH & CIVIL", total: 180, present: 149, pct: 82.7 }
  ]
};

// AI Recommendations state
let recommendations = [
  {
    id: "rec-r1-deploy",
    routeId: "route-1",
    routeName: "Route 1 — Mangalagiri to NRIIT",
    title: "Deploy Standby Assigned Vehicle D",
    category: "CAPACITY_ADDITION",
    riskTarget: "HIGH (116% Predicted)",
    explanation: "Route 1 is predicted to exceed passenger capacity by 8 passengers due to surge boarding at Kaza (28) and Chinna Kakani (35) combined with 94% CSE/ECE morning attendance.",
    action: "Deploy 35-seat Standby Assigned Vehicle D from NRIIT campus depot to intercept Chinna Kakani stop at 08:35 AM.",
    urgency: "Immediate",
    status: "pending", // "pending" | "applied"
    impact: "Reduces Route 1 occupancy from 116% to 68% (SAFE)"
  },
  {
    id: "rec-r3-reallocate",
    routeId: "route-3",
    routeName: "Route 3 — Gannavaram to NRIIT",
    title: "Reallocate Spare Capacity",
    category: "LOAD_BALANCING",
    riskTarget: "LOW (49% Predicted)",
    explanation: "Route 3 has 23 vacant seats. Dynamic rebalancing can shift 12 boarding passes from Tenali Bypass corridor to feeder minibus.",
    action: "Activate feeder micro-shuttle for Tenali Bypass junction.",
    urgency: "Moderate",
    status: "pending",
    impact: "Optimizes network utilization across eastern corridor"
  }
];

// AI Alerts state
let alerts = [
  {
    id: "alt-01",
    type: "CRITICAL_OVERCROWDING",
    severity: "danger",
    routeId: "route-1",
    title: "High Overcrowding Alert: Route 1",
    message: "Route 1 (Mangalagiri) predicted to reach 116% capacity (58/50 passengers) within 25 minutes. High boarding demand at Kaza & Chinna Kakani.",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    status: "active"
  },
  {
    id: "alt-02",
    type: "ATTENDANCE_SURGE",
    severity: "warning",
    routeId: "route-1",
    title: "Attendance Spike Detected",
    message: "CSE & ECE 3rd Year morning attendance registered at 93.8%, increasing inbound travel index by +19.4% above Tuesday baseline.",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    status: "active"
  },
  {
    id: "alt-03",
    type: "CAPACITY_WARNING",
    severity: "info",
    routeId: "route-2",
    title: "Moderate Influx on Route 2",
    message: "Route 2 approaching 80% occupancy near Ramavarappadu Ring. Within operating tolerance.",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    status: "acknowledged"
  }
];

// Helper: Calculate AI predictions dynamically based on attendance and route parameters
function recalculatePredictions(attPct) {
  const ratio = attPct / 85.0;
  
  routes.forEach(route => {
    if (route.id === 'route-1') {
      const basePass = 40;
      const waitingSum = route.stops.reduce((sum, s) => sum + (s.demand || 0), 0);
      const predicted = Math.round(basePass * 0.4 + (waitingSum * 0.58 * Math.pow(ratio, 1.4)));
      route.predictedPassengers = predicted;
      route.predictedOccupancy = Math.round((predicted / route.capacity) * 100);
      route.riskLevel = route.predictedOccupancy >= 100 ? 'HIGH' : (route.predictedOccupancy >= 75 ? 'MODERATE' : 'SAFE');
      
      route.explanation = `Passenger demand is predicted at ${route.predictedPassengers} (${route.predictedOccupancy}%) based on ${attPct}% campus attendance, ${waitingSum} waiting passengers across stops (peak at Kaza & Chinna Kakani), and morning peak timetable.`;
      
      // Update stops dynamically
      route.stops.forEach(s => {
        if (s.name === 'Kaza') s.demand = Math.round(28 * ratio);
        if (s.name === 'Chinna Kakani') s.demand = Math.round(35 * ratio);
        if (s.name === 'Koppuravuru') s.demand = Math.round(21 * ratio);
      });
    } else if (route.id === 'route-2') {
      const predicted = Math.round(34 + 10 * ratio);
      route.predictedPassengers = predicted;
      route.predictedOccupancy = Math.round((predicted / route.capacity) * 100);
      route.riskLevel = route.predictedOccupancy >= 100 ? 'HIGH' : (route.predictedOccupancy >= 75 ? 'MODERATE' : 'SAFE');
    } else if (route.id === 'route-3') {
      const predicted = Math.round(18 + 4 * ratio);
      route.predictedPassengers = predicted;
      route.predictedOccupancy = Math.round((predicted / route.capacity) * 100);
      route.riskLevel = route.predictedOccupancy >= 100 ? 'HIGH' : (route.predictedOccupancy >= 75 ? 'MODERATE' : 'SAFE');
    }
  });

  // Update KPI alerts
  const r1 = routes.find(r => r.id === 'route-1');
  if (r1 && r1.riskLevel === 'HIGH') {
    const existing = alerts.find(a => a.id === 'alt-01');
    if (existing) {
      existing.message = `Route 1 (Mangalagiri) predicted to reach ${r1.predictedOccupancy}% capacity (${r1.predictedPassengers}/${r1.capacity} passengers) based on current ${attPct}% attendance.`;
      existing.status = 'active';
    }
  }
}

// Initial calculation
recalculatePredictions(simulatedAttendance.overallPercentage);

// ================= ROUTES =================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'NRI University Bus API',
    pilotCollege: 'NRI Institute of Technology, Pothavarappadu, Vijayawada',
    version: '1.0.0-hackathon',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/colleges', (req, res) => {
  res.json({ success: true, colleges });
});

app.get('/api/routes', (req, res) => {
  res.json({ success: true, routes });
});

app.post('/api/routes', (req, res) => {
  const { name, origin, destination, capacity, stops } = req.body;
  const newRoute = {
    id: `route-${routes.length + 1}`,
    routeNumber: routes.length + 1,
    name: name || `Route ${routes.length + 1}`,
    collegeId: 'nriit-pilot',
    origin: origin || 'NRI Institute of Technology',
    destination: destination || 'City Center',
    assignedVehicle: `Assigned Vehicle ${String.fromCharCode(65 + routes.length)}`,
    capacity: parseInt(capacity) || 50,
    currentPassengers: 0,
    predictedPassengers: 0,
    predictedOccupancy: 0,
    riskLevel: 'SAFE',
    status: 'Scheduled',
    currentLocation: 'Campus Depot',
    nextStop: stops && stops[0] ? stops[0].name : 'Campus',
    etaMinutes: 15,
    stops: stops || [
      { id: `r${routes.length + 1}-s1`, name: "NRI Institute of Technology", km: 0, demand: 0 }
    ],
    explanation: "New route initialized.",
    recommendation: "Monitor student registrations."
  };
  routes.push(newRoute);
  res.status(201).json({ success: true, route: newRoute });
});

app.get('/api/vehicles', (req, res) => {
  res.json({ success: true, vehicles });
});

// ================= QR ATTENDANCE =================
app.get('/api/attendance/sessions', (req, res) => {
  const now = new Date();
  const activeSessions = (attendanceData.activeSessions || []).map(s => {
    const expired = new Date(s.expiresAt) <= now;
    return { ...s, isExpired: expired, status: expired ? 'Expired' : 'Active' };
  });
  res.json({ success: true, sessions: activeSessions });
});

app.post('/api/attendance/generate-session', (req, res) => {
  const { department, year, section, subject, period, expiryMinutes = 8 } = req.body;
  const sessionToken = `NRIIT-ATT-${Date.now().toString().slice(-4)}-${(department || 'CSE').toUpperCase()}${section || 'A'}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (parseInt(expiryMinutes) || 8) * 60000);

  const newSession = {
    id: `sess-${Date.now()}`,
    sessionToken,
    department: department || 'CSE',
    year: year || 'III',
    section: section || 'A',
    subject: subject || 'AI & Machine Learning (CS304)',
    period: period || 'Period 1 (08:45 AM - 09:45 AM)',
    room: 'Room 304, Abdul Kalam Block',
    facultyName: 'Dr. K. Srinivas (Demo)',
    totalStudents: 60,
    presentCount: 0,
    attendancePct: 0,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: 'Active'
  };

  if (!attendanceData.activeSessions) attendanceData.activeSessions = [];
  attendanceData.activeSessions.unshift(newSession);

  res.status(201).json({
    success: true,
    message: 'Attendance QR Session generated successfully',
    session: newSession
  });
});

app.post('/api/attendance/scan', (req, res) => {
  const { sessionToken, studentId, studentName, department, section } = req.body;

  if (!sessionToken || !studentId) {
    return res.status(400).json({ success: false, error: 'Session token and student roll number are required.' });
  }

  // Find session
  const session = (attendanceData.activeSessions || []).find(s => s.sessionToken === sessionToken);
  if (!session) {
    return res.status(404).json({ success: false, error: 'Invalid or unrecognized Attendance QR Code.' });
  }

  if (new Date(session.expiresAt) <= new Date()) {
    return res.status(410).json({ success: false, error: 'This attendance QR session has expired. Please ask faculty to generate a fresh QR.' });
  }

  // Duplicate check
  const duplicate = attendanceRecords.find(r => r.sessionId === session.id && r.studentId === studentId);
  if (duplicate) {
    return res.status(409).json({
      success: false,
      error: `Attendance already recorded for ${studentId} in this session! Duplicate submission rejected.`
    });
  }

  // Record attendance
  const newRecord = {
    id: `rec-${Date.now()}`,
    sessionId: session.id,
    studentId,
    studentName: studentName || 'Verified NRIIT Student',
    department: department || session.department,
    section: section || session.section,
    markedAt: new Date().toISOString(),
    status: 'Present'
  };

  attendanceRecords.unshift(newRecord);
  session.presentCount += 1;
  session.attendancePct = Math.round((session.presentCount / session.totalStudents) * 100);

  // Trigger real-time attendance update
  if (session.attendancePct >= 90) {
    simulatedAttendance.overallPercentage = Math.min(96, simulatedAttendance.overallPercentage + 1);
    recalculatePredictions(simulatedAttendance.overallPercentage);
  }

  res.json({
    success: true,
    message: 'Attendance Marked Successfully',
    record: newRecord,
    sessionStats: {
      present: session.presentCount,
      total: session.totalStudents,
      attendancePct: session.attendancePct
    }
  });
});

app.get('/api/attendance/records', (req, res) => {
  res.json({ success: true, records: attendanceRecords });
});

app.get('/api/attendance/stats', (req, res) => {
  res.json({
    success: true,
    attendance: simulatedAttendance,
    totalSessionsToday: (attendanceData.activeSessions || []).length,
    totalRecordsToday: attendanceRecords.length
  });
});

// Simulator endpoint: Changes simulated attendance and recalculates bus demand live!
app.post('/api/attendance/simulate', (req, res) => {
  const { percentage } = req.body;
  const pct = Math.max(50, Math.min(99, parseInt(percentage) || 90));
  
  simulatedAttendance.overallPercentage = pct;
  simulatedAttendance.presentStudents = Math.round((pct / 100) * simulatedAttendance.totalStudents);
  simulatedAttendance.departmentBreakdown.forEach(dept => {
    dept.present = Math.round((pct / 100) * dept.total);
    dept.pct = pct;
  });

  recalculatePredictions(pct);

  res.json({
    success: true,
    message: `Attendance updated to ${pct}%. AI demand predictions refreshed across all NRIIT routes.`,
    simulatedAttendance,
    routes
  });
});

// ================= RECOMMENDATIONS & ALERTS =================
app.get('/api/recommendations', (req, res) => {
  res.json({ success: true, recommendations });
});

app.post('/api/recommendations/:id/apply', (req, res) => {
  const rec = recommendations.find(r => r.id === req.params.id);
  if (!rec) {
    return res.status(404).json({ success: false, error: 'Recommendation not found' });
  }

  rec.status = 'applied';
  
  if (rec.id === 'rec-r1-deploy') {
    // Relieve Route 1 overcrowding
    const r1 = routes.find(r => r.id === 'route-1');
    if (r1) {
      r1.capacity = 85; // Additional 35 seats added
      r1.predictedOccupancy = Math.round((r1.predictedPassengers / r1.capacity) * 100);
      r1.riskLevel = 'SAFE';
      r1.assignedVehicle = 'Assigned Vehicle A + Standby Vehicle D (Fleet Deployed)';
      r1.explanation = 'Standby Vehicle D (35 seats) successfully dispatched from depot. Predicted capacity utilization dropped to safe 68%.';
    }

    // Resolve alert
    const a1 = alerts.find(a => a.id === 'alt-01');
    if (a1) a1.status = 'resolved';

    // Update vehicle D
    const vehD = vehicles.find(v => v.id === 'veh-demo-d');
    if (vehD) {
      vehD.status = 'Dispatched to Route 1';
      vehD.assignedRouteId = 'route-1';
      vehD.currentLocation = 'En route to Chinna Kakani';
    }
  }

  res.json({
    success: true,
    message: `Action applied successfully: ${rec.title}`,
    recommendations,
    routes,
    vehicles
  });
});

app.get('/api/alerts', (req, res) => {
  res.json({ success: true, alerts });
});

app.post('/api/alerts/:id/acknowledge', (req, res) => {
  const alt = alerts.find(a => a.id === req.params.id);
  if (alt) {
    alt.status = 'acknowledged';
    return res.json({ success: true, alert: alt });
  }
  res.status(404).json({ success: false, error: 'Alert not found' });
});

// Fallback AI Predict endpoint
app.get('/api/predict/all', (req, res) => {
  res.json({
    success: true,
    pilotCollege: 'NRI Institute of Technology (NRIIT)',
    location: 'Pothavarappadu, Via Nunna, Vijayawada',
    currentAttendance: simulatedAttendance.overallPercentage,
    predictions: routes.map(r => ({
      routeId: r.id,
      routeName: r.name,
      capacity: r.capacity,
      currentPassengers: r.currentPassengers,
      predictedPassengers: r.predictedPassengers,
      predictedOccupancy: r.predictedOccupancy,
      riskLevel: r.riskLevel,
      explanation: r.explanation,
      recommendation: r.recommendation,
      stops: r.stops
    }))
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`NRI University Bus Backend API Server`);
  console.log(`Primary Pilot: NRI Institute of Technology, Vijayawada`);
  console.log(`Listening on http://localhost:${PORT}`);
  console.log(`====================================================`);
});
