import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/stores/main'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import NewRequest from './pages/NewRequest'
import OrderDetails from './pages/OrderDetails'
import HistoryPage from './pages/History'
import DentistsPage from './pages/Dentists'

const App = () => (
  <AppProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/new-request" element={<NewRequest />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/dentists" element={<DentistsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AppProvider>
)

export default App
