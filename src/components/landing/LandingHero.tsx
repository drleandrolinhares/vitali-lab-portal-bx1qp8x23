import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import heroBgImg from '@/assets/allan-queiroz-17-bb76a.jpeg'

export function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0 opacity-[0.45]">
        <img
          src={heroBgImg}
          alt="Premium dental laboratory"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center lg:text-left max-w-7xl flex flex-col items-center lg:items-start">
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-foreground leading-tight max-w-4xl">
          Excelência técnica com <span className="text-primary italic">toque humano.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
          O Vitali Lab redefine a prótese odontológica integrando dois segmentos especializados,
          unidos por um atendimento próximo e focado na experiência do dentista.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button asChild size="lg" className="rounded-full px-8 h-14 text-base w-full sm:w-auto">
            <Link to="/app">Acessar Portal do Dentista</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full px-8 h-14 text-base w-full sm:w-auto bg-background/50 backdrop-blur-sm hover:bg-muted text-foreground border-border"
          >
            <a href="#solucoes">Conhecer Segmentos</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
