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
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/kanban" element={<KanbanPage />} />
                <Route path="/dentists" element={<Navigate to="/users" replace />} />
                <Route path="/patients" element={<PatientsPage />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/comparative-dashboard" element={<ComparativeDashboard />} />
                <Route path="/admin-financial" element={<AdminFinancial />} />
                <Route path="/dre" element={<DREPage />} />
                <Route path="/dre-categories" element={<DRECategories />} />
                <Route path="/prices" element={<PriceList />} />
                <Route path="/financial" element={<FinancialPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/lab-profile" element={<LabProfile />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/audit-logs" element={<AuditTrail />} />
                <Route path="/accounts-payable" element={<AccountsPayable />} />
                <Route path="/inventory" element={<Inventory />} />
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
