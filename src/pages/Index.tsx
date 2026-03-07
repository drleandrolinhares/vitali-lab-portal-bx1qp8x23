import { useAppStore } from '@/stores/main'
import { DentistDashboard } from './dashboard/DentistDashboard'
import { LabDashboard } from './dashboard/LabDashboard'

const Index = () => {
  const { currentUser } = useAppStore()
  if (!currentUser) return null
  return currentUser.role === 'dentist' ? <DentistDashboard /> : <LabDashboard />
}

export default Index
