import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { RoutesPage } from './pages/RoutesPage';
import { StopsDemandPage } from './pages/StopsDemandPage';
import { AttendancePage } from './pages/AttendancePage';
import { QRAttendancePage } from './pages/QRAttendancePage';
import { AIPredictionsPage } from './pages/AIPredictionsPage';
import { AIAlertsPage } from './pages/AIAlertsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { BusManagementPage } from './pages/BusManagementPage';
import { BusAllocationPage } from './pages/BusAllocationPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { api } from './services/api';
import { College, RouteItem, Vehicle, AttendanceSession, AIAlert, Recommendation, UserRole } from './types';
import { INITIAL_COLLEGES, INITIAL_ROUTES, INITIAL_VEHICLES, INITIAL_SESSIONS, INITIAL_ALERTS, INITIAL_RECOMMENDATIONS } from './data/mockData';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<UserRole>('ADMIN');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Data state (NRIIT Only)
  const [college] = useState<College>(INITIAL_COLLEGES[0]);
  const [routes, setRoutes] = useState<RouteItem[]>(INITIAL_ROUTES);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [sessions, setSessions] = useState<AttendanceSession[]>(INITIAL_SESSIONS);
  const [alerts, setAlerts] = useState<AIAlert[]>(INITIAL_ALERTS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [currentAttendance, setCurrentAttendance] = useState<number>(91);

  // Initial load
  useEffect(() => {
    async function loadData() {
      const [routeRes, vehRes, sessRes, altRes, recRes] = await Promise.all([
        api.getRoutes(),
        api.getVehicles(),
        api.getSessions(),
        api.getAlerts(),
        api.getRecommendations()
      ]);
      if (routeRes) setRoutes(routeRes);
      if (vehRes) setVehicles(vehRes);
      if (sessRes) setSessions(sessRes);
      if (altRes) setAlerts(altRes);
      if (recRes) setRecommendations(recRes);
    }
    loadData();
  }, []);

  // Handlers
  const handleSimulateAttendance = async (pct: number) => {
    setCurrentAttendance(pct);
    const res = await api.simulateAttendance(pct);
    if (res.routes) {
      setRoutes([...res.routes]);
    }
  };

  const handleApplyRecommendation = async (id: string) => {
    const res = await api.applyRecommendation(id);
    const [updatedRecs, updatedRoutes, updatedVehs, updatedAlts] = await Promise.all([
      api.getRecommendations(),
      api.getRoutes(),
      api.getVehicles(),
      api.getAlerts()
    ]);
    if (updatedRecs) setRecommendations([...updatedRecs]);
    if (updatedRoutes) setRoutes([...updatedRoutes]);
    if (updatedVehs) setVehicles([...updatedVehs]);
    if (updatedAlts) setAlerts([...updatedAlts]);
    return res;
  };

  const handleGenerateSession = async (sessionData: any) => {
    const newSession = await api.generateSession(sessionData);
    setSessions(prev => [newSession, ...prev]);
    return newSession;
  };

  const handleScanAttendance = async (payload: any) => {
    const res = await api.scanAttendance(payload);
    const updated = await api.getSessions();
    if (updated) setSessions([...updated]);
    return res;
  };

  const handleAcknowledgeAlert = async (id: string) => {
    await api.acknowledgeAlert(id);
    const updated = await api.getAlerts();
    if (updated) setAlerts([...updated]);
    return true;
  };

  const handleAddRoute = async (newRoute: Partial<RouteItem>) => {
    const created = await api.addRoute(newRoute);
    setRoutes(prev => [...prev, created]);
    return created;
  };

  const route1 = routes.find(r => r.id === 'route-1') || routes[0];
  const unreadAlertsCount = alerts.filter(a => a.status === 'active').length;
  const pendingRecCount = recommendations.filter(r => r.status === 'pending').length;

  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLoginSuccess={(role) => {
          setUserRole(role);
          setIsAuthenticated(true);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased w-full overflow-x-hidden">
      {/* Universal Header (NRIIT Only) with Mobile Menu Toggle */}
      <Header
        college={college}
        userRole={userRole}
        onChangeRole={(r) => setUserRole(r)}
        unreadAlertsCount={unreadAlertsCount}
        onOpenAlerts={() => setActiveTab('ai-alerts')}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* Universal Sidebar & Mobile Drawer with NRI University Bus Allocation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(t) => {
            if (t === 'bus-boarding') {
              setUserRole('STUDENT');
              setActiveTab('qr-attendance');
            } else {
              setActiveTab(t);
            }
            setIsMobileMenuOpen(false);
          }}
          unreadAlertsCount={unreadAlertsCount}
          pendingRecCount={pendingRecCount}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-5 lg:p-7 min-w-0 touch-scroll">
          <div className="max-w-[1600px] w-full mx-auto min-w-0">
            {activeTab === 'dashboard' && (
              <Dashboard
                routes={routes}
                currentAttendance={currentAttendance}
                onSimulateAttendance={handleSimulateAttendance}
                onNavigateTab={(t) => setActiveTab(t)}
                onApplyRecommendation={handleApplyRecommendation}
              />
            )}

            {activeTab === 'live-monitoring' && (
              <LiveMonitoring routes={routes} />
            )}

            {activeTab === 'routes' && (
              <RoutesPage
                routes={routes}
                onAddRoute={handleAddRoute}
              />
            )}

            {activeTab === 'stops-demand' && (
              <StopsDemandPage route1={route1} />
            )}

            {activeTab === 'attendance' && (
              <AttendancePage
                currentAttendance={currentAttendance}
                onSimulateAttendance={handleSimulateAttendance}
              />
            )}

            {(activeTab === 'qr-attendance' || activeTab === 'bus-boarding') && (
              <QRAttendancePage
                sessions={sessions}
                onGenerateSession={handleGenerateSession}
                onScanAttendance={handleScanAttendance}
                userRole={userRole}
                onChangeRole={(r) => setUserRole(r)}
                initialMode={activeTab === 'bus-boarding' ? 'BUS_BOARDING' : undefined}
              />
            )}

            {activeTab === 'ai-predictions' && (
              <AIPredictionsPage
                routes={routes}
                currentAttendance={currentAttendance}
                onSimulateAttendance={handleSimulateAttendance}
                onNavigateTab={(t) => setActiveTab(t)}
              />
            )}

            {activeTab === 'ai-alerts' && (
              <AIAlertsPage
                alerts={alerts}
                onAcknowledge={handleAcknowledgeAlert}
                onNavigateTab={(t) => setActiveTab(t)}
              />
            )}

            {activeTab === 'recommendations' && (
              <RecommendationsPage
                recommendations={recommendations}
                onApplyRecommendation={handleApplyRecommendation}
                onNavigateTab={(t) => setActiveTab(t)}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsPage />
            )}

            {activeTab === 'bus-management' && (
              <BusManagementPage vehicles={vehicles} />
            )}

            {activeTab === 'bus-allocation' && (
              <BusAllocationPage
                routes={routes}
                vehicles={vehicles}
                onApplyRecommendation={handleApplyRecommendation}
                onNavigateTab={(t) => setActiveTab(t)}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsPage />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
