import { LandingHeader } from '@/components/landing/LandingHeader'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingSpecialties } from '@/components/landing/LandingSpecialties'
import { LandingPurpose } from '@/components/landing/LandingPurpose'
import { LandingTestimonials } from '@/components/landing/LandingTestimonials'
import { LandingContact } from '@/components/landing/LandingContact'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { FloatingWhatsApp } from '@/components/landing/FloatingWhatsApp'
import { useAuth } from '@/hooks/use-auth'
import { useAppStore } from '@/stores/main'
import { Navigate } from 'react-router-dom'

export default function LandingPage() {
  const { session } = useAuth()
  const { currentUser } = useAppStore()

  if (session) {
    if (currentUser) {
      if (currentUser.role === 'admin' || currentUser.role === 'master') {
        return <Navigate to="/dashboard" replace />
      }
      return <Navigate to="/app" replace />
    }
    return null // Prevent flash while profile is loading
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingSpecialties />
        <LandingPurpose />
        <LandingTestimonials />
        <LandingContact />
      </main>
      <LandingFooter />
      <FloatingWhatsApp />
    </div>
  )
}
