import { LandingHeader } from '@/components/landing/LandingHeader'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingSpecialties } from '@/components/landing/LandingSpecialties'
import { LandingCases } from '@/components/landing/LandingCases'
import { LandingPurpose } from '@/components/landing/LandingPurpose'
import { LandingTestimonials } from '@/components/landing/LandingTestimonials'
import { LandingContact } from '@/components/landing/LandingContact'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { FloatingWhatsApp } from '@/components/landing/FloatingWhatsApp'

export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingSpecialties />
        <LandingCases />
        <LandingPurpose />
        <LandingTestimonials />
        <LandingContact />
      </main>
      <LandingFooter />
      <FloatingWhatsApp />
    </div>
  )
}
