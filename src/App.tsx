import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/stores/main'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { useAppStore } from '@/stores/main'
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

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth()
  const { currentUser } = useAppStore()

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-medium">Carregando...</div>
    )
  if (!session) return <AuthPage />

  if (currentUser && currentUser.is_approved === false && currentUser.role !== 'admin') {
    return <PendingApproval />
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
              <Route path="/prices" element={<PriceList />} />
              <Route path="/financial" element={<FinancialPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/audit-logs" element={<AuditTrail />} />
              <Route path="/accounts-payable" element={<AccountsPayable />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/pending-users" element={<PendingUsersPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </AppProvider>
  </AuthProvider>
)

export default App
