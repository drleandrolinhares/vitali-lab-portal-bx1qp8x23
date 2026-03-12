import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/stores/main'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { useAppStore } from '@/stores/main'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import LandingPage from './pages/LandingPage'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import NewRequest from './pages/NewRequest'
import OrderDetails from './pages/OrderDetails'
import HistoryPage from './pages/History'
import DentistsPage from './pages/Dentists'
import PatientsPage from './pages/Patients'
import AuthPage from './pages/Auth'
import AdminDashboard from './pages/AdminDashboard'
import AdminFinancial from './pages/AdminFinancial'
import KanbanPage from './pages/Kanban'
import PriceList from './pages/PriceList'
import FinancialPage from './pages/Financial'
import SettingsPage from './pages/Settings'
import AuditTrail from './pages/AuditTrail'
import AccountsPayable from './pages/AccountsPayable'
import Inventory from './pages/Inventory'
import ComparativeDashboard from './pages/ComparativeDashboard'
import PendingApproval from './pages/PendingApproval'
import PendingUsersPage from './pages/PendingUsers'
import DREPage from './pages/DRE'
import DRECategories from './pages/DRECategories'
import HourlyCost from './pages/HourlyCost'
import MaterialsPage from './pages/Materials'
import ForcePasswordChange from './components/ForcePasswordChange'
import UsersPage from './pages/Users'
import PublicGuide from './pages/PublicGuide'
import PublicOrderFull from './pages/PublicOrderFull'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth()
  const { currentUser } = useAppStore()
  const location = useLocation()

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-medium">Carregando...</div>
    )
  if (!session) return <AuthPage />

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

const App = () => (
  <AuthProvider>
    <AppProvider>
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<LandingPage />} />
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
              <Route path="/dentists" element={<DentistsPage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/comparative-dashboard" element={<ComparativeDashboard />} />
              <Route path="/admin-financial" element={<AdminFinancial />} />
              <Route path="/dre" element={<DREPage />} />
              <Route path="/dre-categories" element={<DRECategories />} />
              <Route path="/prices" element={<PriceList />} />
              <Route path="/financial" element={<FinancialPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/audit-logs" element={<AuditTrail />} />
              <Route path="/accounts-payable" element={<AccountsPayable />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/pending-users" element={<PendingUsersPage />} />
              <Route path="/hourly-cost" element={<HourlyCost />} />
              <Route path="/materials" element={<MaterialsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </AppProvider>
  </AuthProvider>
)

export default App
