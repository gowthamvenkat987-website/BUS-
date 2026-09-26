import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  GraduationCap, 
  Users, 
  UserCheck, 
  UserX, 
  Percent, 
  TrendingUp, 
  Clock, 
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { AttendanceSimulator } from '../components/AttendanceSimulator';

interface AttendancePageProps {
  currentAttendance: number;
  onSimulateAttendance: (pct: number) => void;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({
  currentAttendance,
  onSimulateAttendance
}) => {
  // Department breakdown data
  const deptData = [
    { name: 'CSE', total: 360, present: Math.round(360 * (currentAttendance / 100)), pct: currentAttendance },
    { name: 'ECE', total: 300, present: Math.round(300 * (currentAttendance / 100) * 0.98), pct: Math.round(currentAttendance * 0.98) },
    { name: 'IT', total: 180, present: Math.round(180 * (currentAttendance / 100) * 0.96), pct: Math.round(currentAttendance * 0.96) },
    { name: 'AIML & DS', total: 180, present: Math.round(180 * (currentAttendance / 100) * 0.99), pct: Math.round(currentAttendance * 0.99) },
    { name: 'MECH & CIVIL', total: 180, present: Math.round(180 * (currentAttendance / 100) * 0.88), pct: Math.round(currentAttendance * 0.88) }
  ];

  // Class sessions data
  const classData = [
    { class: 'CSE-A', total: 60, present: Math.round(60 * (currentAttendance / 100)), subject: 'AI & Deep Learning (CS312)' },
    { class: 'CSE-B', total: 60, present: Math.round(60 * (currentAttendance / 100) * 0.96), subject: 'Cloud Computing (CS314)' },
    { class: 'ECE-A', total: 60, present: Math.round(60 * (currentAttendance / 100) * 0.95), subject: 'VLSI Design (EC308)' },
    { class: 'ECE-B', total: 60, present: Math.round(60 * (currentAttendance / 100) * 0.98), subject: 'Embedded IoT (EC314)' },
    { class: 'IT-A', total: 60, present: Math.round(60 * (currentAttendance / 100) * 0.93), subject: 'Web Technologies (IT204)' }
  ];

  // Hourly attendance vs predicted transit volume trend
  const hourlyTrend = [
    { time: '08:00 AM', attendance: 35, transitVolume: 380 },
    { time: '08:30 AM', attendance: 78, transitVolume: 820 },
    { time: '09:00 AM', attendance: currentAttendance, transitVolume: 1092 },
    { time: '11:00 AM', attendance: currentAttendance - 2, transitVolume: 140 },
    { time: '01:00 PM', attendance: currentAttendance - 4, transitVolume: 210 },
    { time: '03:45 PM', attendance: currentAttendance - 6, transitVolume: 980 },
    { time: '04:30 PM', attendance: currentAttendance - 12, transitVolume: 650 }
  ];

  const totalStudents = 1200;
  const totalPresent = Math.round((currentAttendance / 100) * totalStudents);
  const totalAbsent = totalStudents - totalPresent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              Attendance Intelligence
            </h1>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              Demo / Simulated Attendance Data
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time classroom presence analytics feeding the transit demand forecasting model at NRIIT.
          </p>
        </div>

        <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 text-xs">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-700">Current Session:</span>
          <span className="font-bold text-slate-900">Period 1 (08:45 AM - 09:45 AM)</span>
        </div>
      </div>

      {/* KPI Cards: Total, Present, Absent, Attendance % */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>TOTAL STUDENTS</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">{totalStudents}</div>
          <p className="text-[11px] text-slate-500 mt-1">Enrolled Inbound Cohort</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>PRESENT TODAY</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-600">{totalPresent}</div>
          <p className="text-[11px] text-emerald-600 mt-1">Verified via QR Scanner</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>ABSENT</span>
            <UserX className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-600">{totalAbsent}</div>
          <p className="text-[11px] text-slate-400 mt-1">{100 - currentAttendance}% Absenteeism</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>CAMPUS ATTENDANCE</span>
            <Percent className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-purple-700">{currentAttendance}%</div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">Transit Demand Driver</p>
        </div>
      </div>

      {/* Primary Pilot Class Banner: CSE-A */}
      <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-600 text-white shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 font-['Outfit']">
                Active Benchmark Class: CSE-A (3rd Year)
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                90% Present
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Subject: Deep Learning & AI Applications • Room 304, Abdul Kalam Block
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-center">
            <span className="text-slate-400 text-[10px] block">TOTAL</span>
            <span className="font-bold text-slate-900 text-sm">60</span>
          </div>
          <div className="bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 text-center">
            <span className="text-emerald-700 text-[10px] block font-bold">PRESENT</span>
            <span className="font-bold text-emerald-800 text-sm">54</span>
          </div>
          <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-center">
            <span className="text-slate-400 text-[10px] block">ABSENT</span>
            <span className="font-bold text-slate-600 text-sm">6</span>
          </div>
        </div>
      </div>

      {/* Simulator Component */}
      <AttendanceSimulator
        currentAttendance={currentAttendance}
        onSimulate={onSimulateAttendance}
        predictedDemand={Math.round(40 * 0.4 + 63 * 0.58 * Math.pow(currentAttendance / 85, 1.4))}
        capacity={50}
        riskLevel={currentAttendance >= 90 ? 'HIGH' : currentAttendance >= 75 ? 'MODERATE' : 'SAFE'}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Attendance Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs min-w-0">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                Department Attendance Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                CSE and ECE account for the majority of Route 1 Mangalagiri bus passengers
              </p>
            </div>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              Current Session
            </span>
          </div>

          <div className="mt-4 h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -10, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="total" name="Enrolled Students" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="present" name="Present Today" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Attendance vs Transit Demand */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs min-w-0">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                Attendance vs Predicted Transit Volume
              </h3>
              <p className="text-xs text-slate-500">
                Correlating classroom presence curve with morning and evening commute demand
              </p>
            </div>
            <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
              Timeline Correlation
            </span>
          </div>

          <div className="mt-4 h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyTrend} margin={{ top: 10, right: 15, left: -10, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Line yAxisId="left" type="monotone" dataKey="attendance" name="Attendance %" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="transitVolume" name="Transit Demand (Pax)" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
