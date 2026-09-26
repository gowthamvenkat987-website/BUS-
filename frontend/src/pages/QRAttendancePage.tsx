import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  ShieldCheck, 
  RefreshCw, 
  BookOpen, 
  Calendar,
  Lock,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { AttendanceSession, UserRole } from '../types';

interface QRAttendancePageProps {
  sessions: AttendanceSession[];
  onGenerateSession: (sessionData: any) => Promise<AttendanceSession>;
  onScanAttendance: (payload: any) => Promise<{ success: boolean; message: string; sessionStats?: any }>;
  userRole: UserRole;
  onChangeRole: (r: UserRole) => void;
}

export const QRAttendancePage: React.FC<QRAttendancePageProps> = ({
  sessions,
  onGenerateSession,
  onScanAttendance,
  userRole,
  onChangeRole
}) => {
  // Mode selection: Faculty or Student
  const [activeMode, setActiveMode] = useState<'FACULTY' | 'STUDENT'>(
    userRole === 'STUDENT' ? 'STUDENT' : 'FACULTY'
  );

  // Sync role change
  useEffect(() => {
    if (userRole === 'STUDENT') setActiveMode('STUDENT');
  }, [userRole]);

  // Current selected active session for faculty
  const [selectedSession, setSelectedSession] = useState<AttendanceSession>(sessions[0] || null);

  // Countdown timer for active QR session
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(300); // 5 minutes default
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!selectedSession) return;
    const expiresAt = new Date(selectedSession.expiresAt).getTime();
    
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeLeftSeconds(diff);
      if (diff <= 0) {
        setIsExpired(true);
      } else {
        setIsExpired(false);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [selectedSession]);

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Faculty form state for generating new session
  const [department, setDepartment] = useState('CSE');
  const [year, setYear] = useState('III');
  const [section, setSection] = useState('A');
  const [subject, setSubject] = useState('Deep Learning & AI Applications (CS312)');
  const [period, setPeriod] = useState('Period 1 (08:45 AM - 09:45 AM)');
  const [expiryMinutes, setExpiryMinutes] = useState(8);
  const [isGenerating, setIsGenerating] = useState(false);

  // Student scan state
  const [scannedToken, setScannedToken] = useState(selectedSession?.sessionToken || 'NRIIT-ATT-2026-CSEA-9812');
  const [studentRoll, setStudentRoll] = useState('21NR1A0501');
  const [studentName, setStudentName] = useState('B. Sai Teja');
  const [studentDept, setStudentDept] = useState('CSE');
  const [studentSection, setStudentSection] = useState('A');
  const [scanResult, setScanResult] = useState<{ success?: boolean; message?: string; details?: any } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    const newSession = await onGenerateSession({
      department,
      year,
      section,
      subject,
      period,
      expiryMinutes
    });
    setSelectedSession(newSession);
    setScannedToken(newSession.sessionToken);
    setIsGenerating(false);
    setIsExpired(false);
    setTimeLeftSeconds(expiryMinutes * 60);
  };

  const handleStudentScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setScanResult(null);

    const res = await onScanAttendance({
      sessionToken: scannedToken,
      studentId: studentRoll,
      studentName,
      department: studentDept,
      section: studentSection
    });

    setIsScanning(false);
    if (res.success) {
      setScanResult({
        success: true,
        message: res.message,
        details: {
          student: studentName,
          roll: studentRoll,
          class: `${studentDept}-${studentSection}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Present'
        }
      });
    } else {
      setScanResult({
        success: false,
        message: res.message
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              QR-Based Attendance & Mobility Gateway
            </h1>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
              Primary Transit Input
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Secure, time-expiring QR system for NRIIT classrooms. Directly drives downstream AI bus allocation.
          </p>
        </div>

        {/* Mode Toggle Pills (Faculty vs Student) */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => {
              setActiveMode('FACULTY');
              onChangeRole('FACULTY');
            }}
            className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-bold transition ${
              activeMode === 'FACULTY'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Faculty Mode (Generate QR)</span>
          </button>
          <button
            onClick={() => {
              setActiveMode('STUDENT');
              onChangeRole('STUDENT');
            }}
            className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-bold transition ${
              activeMode === 'STUDENT'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Student Mode (Scan QR)</span>
          </button>
        </div>
      </div>

      {/* Security Architecture Callout */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs border border-slate-800">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-white">QR Security Protocol: </span>
            <span className="text-slate-300">
              No sensitive student PII is encoded in the QR. It holds only an ephemeral single-session cryptographic token validated on backend.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <span>Anti-Proxy</span>
          <span>•</span>
          <span>Duplicate-Rejection Active</span>
        </div>
      </div>

      {/* Mode A: FACULTY / ADMIN — GENERATE QR */}
      {activeMode === 'FACULTY' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Active QR Display */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="text-left">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  NRIIT Attendance
                </span>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                  Scan this QR to mark your attendance
                </h3>
              </div>
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                isExpired ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                {isExpired ? 'Session Expired' : `QR expires in ${formatCountdown(timeLeftSeconds)}`}
              </span>
            </div>

            {/* QR Code Container */}
            <div className="my-6 p-5 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 shadow-inner flex flex-col items-center relative">
              {isExpired ? (
                <div className="w-64 h-64 flex flex-col items-center justify-center text-red-600 bg-red-50/50 rounded-xl">
                  <AlertCircle className="w-12 h-12 mb-2" />
                  <p className="font-bold text-sm">Attendance session expired.</p>
                  <p className="text-xs text-red-500 mt-1 max-w-[200px]">
                    Temporary token has timed out. Please generate a fresh QR session below.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-white rounded-xl shadow-md border border-slate-200">
                  <QRCodeSVG 
                    value={selectedSession?.sessionToken || 'NRIIT-ATT-DEMO'}
                    size={220}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              )}

              <p className="text-[11px] font-mono text-slate-500 mt-3 bg-white px-3 py-1 rounded-full border border-slate-200">
                Token: <strong className="text-slate-800">{selectedSession?.sessionToken}</strong>
              </p>
            </div>

            {/* Session Metadata Summary */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-left bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] block">SESSION</span>
                <span className="font-bold text-slate-900">{selectedSession?.department}-{selectedSession?.section} ({selectedSession?.year} Year)</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">DATE</span>
                <span className="font-bold text-slate-900">{new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">PERIOD</span>
                <span className="font-bold text-slate-900 truncate block">Period 1</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">VERIFIED ATTENDANCE</span>
                <span className="font-bold text-emerald-600 font-mono">
                  {selectedSession?.presentCount || 0} / {selectedSession?.totalStudents || 60} ({selectedSession?.attendancePct || 0}%)
                </span>
              </div>
            </div>

            {/* Switch to Student scan CTA */}
            <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs">
              <span className="text-slate-500">Want to test the student scan experience?</span>
              <button
                onClick={() => setActiveMode('STUDENT')}
                className="text-blue-600 font-bold hover:underline flex items-center gap-1"
              >
                <span>Switch to Student Camera Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Faculty Generator Form */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Generate Temporary Attendance Session
              </h3>
              <p className="text-xs text-slate-500">
                Configure classroom department, period and time-to-live expiration.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-blue-600 bg-white"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="IT">IT</option>
                    <option value="AIML">AIML</option>
                    <option value="DS">DS</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-blue-600 bg-white"
                  >
                    <option value="I">I Year</option>
                    <option value="II">II Year</option>
                    <option value="III">III Year</option>
                    <option value="IV">IV Year</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Section</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-blue-600 bg-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject & Course Code</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-blue-600 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Period & Timetable</label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-blue-600 bg-white text-xs"
                  >
                    <option>Period 1 (08:45 AM - 09:45 AM)</option>
                    <option>Period 2 (09:45 AM - 10:45 AM)</option>
                    <option>Period 3 (11:00 AM - 12:00 PM)</option>
                    <option>Period 4 (01:00 PM - 02:00 PM)</option>
                    <option>Period 5 (02:00 PM - 03:00 PM)</option>
                    <option>Period 6 Lab (03:00 PM - 04:30 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Session Expiry Lifespan</label>
                  <select
                    value={expiryMinutes}
                    onChange={(e) => setExpiryMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-blue-600 bg-white text-xs"
                  >
                    <option value={5}>5 Minutes (Strict Security)</option>
                    <option value={8}>8 Minutes (Standard Lab)</option>
                    <option value={10}>10 Minutes (Extended)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                id="btn-generate-qr"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Generate New Attendance QR Session'}</span>
              </button>
            </form>

            {/* Recent Sessions list */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Active Classroom Sessions
              </span>
              <div className="space-y-2">
                {sessions.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedSession(s);
                      setScannedToken(s.sessionToken);
                    }}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                      s.id === selectedSession?.id
                        ? 'border-blue-600 bg-blue-50/60 font-semibold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-900">{s.department}-{s.section} • {s.subject}</p>
                      <p className="text-[11px] text-slate-500">{s.period}</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-emerald-700 font-bold">{s.presentCount}/{s.totalStudents}</span>
                      <span className="text-[10px] text-slate-400 block">{s.attendancePct}% Present</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode B: STUDENT — SCAN QR */}
      {activeMode === 'STUDENT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Camera Scanner Interface */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center">
            <div className="w-full pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  Student Check-In
                </span>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                  Scan Attendance QR
                </h3>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">
                Camera Live
              </span>
            </div>

            {/* Simulated Camera Viewfinder */}
            <div className="my-5 w-full max-w-sm h-64 bg-slate-950 rounded-2xl border-2 border-indigo-500 relative overflow-hidden flex flex-col items-center justify-center text-white shadow-lg">
              {/* Corner markers */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-indigo-400"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-indigo-400"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-indigo-400"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-indigo-400"></div>

              {/* Scanning red line animation */}
              <div className="absolute left-8 right-8 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></div>

              <Camera className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-200">Align QR Code within viewfinder</p>
              <p className="text-[10px] text-slate-400 mt-1">NRIIT Classroom Optical Scanner</p>
            </div>

            <p className="text-xs text-slate-500 text-center max-w-md">
              Point your camera at the faculty board. The token will be captured and authenticated with your NRIIT roll number.
            </p>
          </div>

          {/* Right: Student Authentication & Submit Form */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Student Attendance Verification
              </h3>
              <p className="text-xs text-slate-500">
                Confirm your student credentials to mark presence for today's session.
              </p>
            </div>

            <form onSubmit={handleStudentScan} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Captured QR Session Token
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={scannedToken}
                    onChange={(e) => setScannedToken(e.target.value)}
                    placeholder="e.g. NRIIT-ATT-2026-CSEA-9812"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-blue-600 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setScannedToken(selectedSession?.sessionToken || 'NRIIT-ATT-2026-CSEA-9812')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                    title="Load latest faculty token"
                  >
                    Paste Active QR
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Student Roll Number</label>
                  <input
                    type="text"
                    required
                    value={studentRoll}
                    onChange={(e) => setStudentRoll(e.target.value)}
                    placeholder="21NR1A0501"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={studentDept}
                    onChange={(e) => setStudentDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-blue-600 bg-white"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="IT">IT</option>
                    <option value="AIML">AIML</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Section</label>
                  <select
                    value={studentSection}
                    onChange={(e) => setStudentSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-blue-600 bg-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              {/* Duplicate Prevention Test notice */}
              <p className="text-[11px] text-slate-500 italic">
                * Note: Submitting multiple times with the same roll number will trigger the duplicate rejection security check.
              </p>

              <button
                type="submit"
                disabled={isScanning}
                id="btn-submit-attendance"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isScanning ? 'Verifying...' : 'Submit Attendance & Register Commute'}</span>
              </button>
            </form>

            {/* Scan Outcome Callout (Exact from Prompt Section 15) */}
            {scanResult && scanResult.success && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>✅ Attendance Marked</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1 text-[11px]">
                  <div>
                    <span className="text-slate-500">Student:</span>
                    <p className="font-bold text-slate-900">{scanResult.details?.student} ({scanResult.details?.roll})</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Class:</span>
                    <p className="font-bold text-slate-900">{scanResult.details?.class}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Time:</span>
                    <p className="font-bold text-slate-900">{scanResult.details?.time}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Status:</span>
                    <p className="font-bold text-emerald-700">Present</p>
                  </div>
                </div>
                <p className="text-[10px] text-emerald-800 pt-1 border-t border-emerald-200">
                  Data propagated to AI mobility engine: Morning transit index updated.
                </p>
              </div>
            )}

            {scanResult && !scanResult.success && (
              <div className="bg-red-50 border border-red-300 rounded-xl p-3.5 text-xs text-red-900 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Attendance Submission Rejected</p>
                  <p className="text-[11px] text-red-700 mt-0.5">{scanResult.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
