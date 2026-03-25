import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/stores/main'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { useAppStore } from '@/stores/main'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const Index = lazy(() => import('./pages/Index'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Layout = lazy(() => import('./components/Layout'))
const NewRequest = lazy(() => import('./pages/NewRequest'))
const OrderDetails = lazy(() => import('./pages/OrderDetails'))
const HistoryPage = lazy(() => import('./pages/History'))
const PatientsPage = lazy(() => import('./pages/Patients'))
const AuthPage = lazy(() => import('./pages/Auth'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminFinancial = lazy(() => import('./pages/AdminFinancial'))
const KanbanPage = lazy(() => import('./pages/Kanban'))
const PriceList = lazy(() => import('./pages/PriceList'))
const FinancialPage = lazy(() => import('./pages/Financial'))
const SettingsPage = lazy(() => import('./pages/Settings'))
const AuditTrail = lazy(() => import('./pages/AuditTrail'))
const AccountsPayable = lazy(() => import('./pages/AccountsPayable'))
const Inventory = lazy(() => import('./pages/Inventory'))
const ComparativeDashboard = lazy(() => import('./pages/ComparativeDashboard'))
const PendingApproval = lazy(() => import('./pages/PendingApproval'))
const DREPage = lazy(() => import('./pages/DRE'))
const DRECategories = lazy(() => import('./pages/DRECategories'))
const HourlyCost = lazy(() => import('./pages/HourlyCost'))
const MaterialsPage = lazy(() => import('./pages/Materials'))
const ForcePasswordChange = lazy(() => import('./components/ForcePasswordChange'))
const UsersPage = lazy(() => import('./pages/Users'))
const PublicGuide = lazy(() => import('./pages/PublicGuide'))
const PublicOrderFull = lazy(() => import('./pages/PublicOrderFull'))
const LabProfile = lazy(() => import('./pages/LabProfile'))
const ScanService = lazy(() => import('./pages/ScanService'))

const RouteGuard = ({
  children,
  module,
  action,
  adminOnly,
}: {
  children: React.ReactNode
  module?: string
  action?: string
  adminOnly?: boolean
}) => {
  const { currentUser, checkPermission } = useAppStore()
  if (!currentUser) return null

  const home = currentUser.role === 'admin' || currentUser.role === 'master' ? '/dashboard' : '/app'

  if (adminOnly && currentUser.role !== 'admin' && currentUser.role !== 'master') {
    return <Navigate to={home} replace />
  }

  if (module && !checkPermission(module, action)) {
    return <Navigate to={home} replace />
  }

  return <>{children}</>
}

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth()
  const { currentUser } = useAppStore()
  const location = useLocation()

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-medium">Carregando...</div>
    )
  if (!session) {
    if (location.pathname !== '/login') {
      return <Navigate to="/login" replace />
    }
    return <AuthPage />
  }

  const justLoggedIn = sessionStorage.getItem('vitali_just_logged_in') === 'true'
  if (justLoggedIn && currentUser) {
    sessionStorage.removeItem('vitali_just_logged_in')
    if (currentUser.role === 'admin' || currentUser.role === 'master') {
      if (location.pathname !== '/dashboard') {
        return <Navigate to="/dashboard" replace />
      }
    } else {
      if (location.pathname !== '/app') {
        return <Navigate to="/app" replace />
      }
    }
  }

  if (currentUser && currentUser.is_active === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-medium gap-4">
        <p className="text-xl font-semibold text-destructive">Acesso Bloqueado</p>
        <p className="text-muted-foreground">Sua conta foi desativada pelo administrador.</p>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}>
          Sair
        </Button>
      </div>
    )
  }

  if (
    currentUser &&
    currentUser.is_approved === false &&
    currentUser.role !== 'admin' &&
    currentUser.role !== 'master'
  ) {
    return <PendingApproval />
  }

  if (currentUser && currentUser.requires_password_change) {
    return <ForcePasswordChange />
  }

  return <>{children}</>
}

const SuspenseLoader = () => (
  <div className="min-h-screen flex items-center justify-center font-medium text-muted-foreground">
    Carregando...
  </div>
)

const App = () => (
  <AuthProvider>
    <AppProvider>
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Suspense fallback={<SuspenseLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/public/guide/:id" element={<PublicGuide />} />
              <Route path="/public/order/:id/full" element={<PublicOrderFull />} />
              <Route
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route path="/app" element={<Index />} />
                <Route path="/new-request" element={<NewRequest />} />
                <Route path="/order/:id" element={<OrderDetails />} />
                <Route
                  path="/history"
                  element={
                    <RouteGuard module="history">
                      <HistoryPage />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/kanban"
                  element={
                    <RouteGuard module="kanban">
                      <KanbanPage />
                    </RouteGuard>
                  }
                />
                <Route path="/dentists" element={<Navigate to="/users" replace />} />
                <Route path="/patients" element={<PatientsPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <RouteGuard module="dashboards" action="view_general">
                      <AdminDashboard />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/comparative-dashboard"
                  element={
                    <RouteGuard module="dashboards" action="view_operational">
                      <ComparativeDashboard />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/admin-financial"
                  element={
                    <RouteGuard module="finances">
                      <AdminFinancial />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/dre"
                  element={
                    <RouteGuard module="finances">
                      <DREPage />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/dre-categories"
                  element={
                    <RouteGuard module="settings">
                      <DRECategories />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/prices"
                  element={
                    <RouteGuard module="finances">
                      <PriceList />
                    </RouteGuard>
                  }
                />
                <Route path="/financial" element={<FinancialPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route
                  path="/lab-profile"
                  element={
                    <RouteGuard adminOnly>
                      <LabProfile />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <RouteGuard module="settings">
                      <UsersPage />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/audit-logs"
                  element={
                    <RouteGuard module="settings">
                      <AuditTrail />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/accounts-payable"
                  element={
                    <RouteGuard module="finances">
                      <AccountsPayable />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <RouteGuard module="inventory">
                      <Inventory />
                    </RouteGuard>
                  }
                />
                <Route path="/hourly-cost" element={<HourlyCost />} />
                <Route path="/materials" element={<MaterialsPage />} />
                <Route path="/scan-service" element={<ScanService />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </TooltipProvider>
      </BrowserRouter>
    </AppProvider>
  </AuthProvider>
)

export default App
