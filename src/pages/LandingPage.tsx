import { LandingHeader } from '@/components/landing/LandingHeader'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingSpecialties } from '@/components/landing/LandingSpecialties'
import { LandingPurpose } from '@/components/landing/LandingPurpose'
import { LandingContact } from '@/components/landing/LandingContact'
import { LandingFooter } from '@/components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingSpecialties />
        <LandingPurpose />
        <LandingContact />
      </main>
      <LandingFooter />
    </div>
  )
}
