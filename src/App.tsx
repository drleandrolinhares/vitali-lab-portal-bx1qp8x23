import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/stores/main'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import NewRequest from './pages/NewRequest'
import OrderDetails from './pages/OrderDetails'
import HistoryPage from './pages/History'
import DentistsPage from './pages/Dentists'
import AuthPage from './pages/Auth'
import AdminDashboard from './pages/AdminDashboard'
import AdminFinancial from './pages/AdminFinancial'
import KanbanPage from './pages/Kanban'
import PriceList from './pages/PriceList'
import FinancialPage from './pages/Financial'
import SettingsPage from './pages/Settings'
import AuditTrail from './pages/AuditTrail'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth()
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-medium">Carregando...</div>
    )
  if (!session) return <AuthPage />
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
            <Route
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/new-request" element={<NewRequest />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/kanban" element={<KanbanPage />} />
              <Route path="/dentists" element={<DentistsPage />} />
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/admin-financial" element={<AdminFinancial />} />
              <Route path="/prices" element={<PriceList />} />
              <Route path="/financial" element={<FinancialPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/audit-logs" element={<AuditTrail />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </AppProvider>
  </AuthProvider>
)

export default App
