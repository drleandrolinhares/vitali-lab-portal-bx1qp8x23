import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const cases = [
  {
    title: 'Reabilitação Estética',
    description: 'Facetas em Dissilicato de Lítio (E.max)',
    before: 'https://img.usecurling.com/p/600/400?q=smile%20before&color=gray',
    after: 'https://img.usecurling.com/p/600/400?q=perfect%20smile',
  },
  {
    title: 'Protocolo Superior',
    description: 'Prótese Total Acrílica sobre Implantes',
    before: 'https://img.usecurling.com/p/600/400?q=teeth&color=gray',
    after: 'https://img.usecurling.com/p/600/400?q=dental%20implants',
  },
  {
    title: 'Coroas Posteriores',
    description: 'Zircônia Monolítica de Alta Translucidez',
    before: 'https://img.usecurling.com/p/600/400?q=decay&color=gray',
    after: 'https://img.usecurling.com/p/600/400?q=white%20teeth',
  },
  {
    title: 'Lentes de Contato',
    description: 'Transformação do Sorriso',
    before: 'https://img.usecurling.com/p/600/400?q=dental&color=gray',
    after: 'https://img.usecurling.com/p/600/400?q=veneer%20smile',
  },
]

export function LandingCases() {
  return (
    <section id="casos" className="py-24 bg-background border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Galeria de Casos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Confira a transformação e a precisão técnica entregues pelo Vitali Lab.
          </p>
        </div>

        <div className="px-4 md:px-12 relative">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {cases.map((clinicalCase, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full py-2">
                    <Card className="overflow-hidden border-border bg-card h-full flex flex-col shadow-sm hover:shadow-md transition-shadow group">
                      <CardContent className="p-0 flex-1 flex flex-col">
                        <div className="relative flex-1 flex flex-col bg-muted">
                          <div className="h-48 relative w-full border-b border-border/50 overflow-hidden">
                            <img
                              src={clinicalCase.before}
                              alt="Antes"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                            <Badge
                              variant="secondary"
                              className="absolute top-3 left-3 bg-black/60 hover:bg-black/60 text-white border-none backdrop-blur-md font-medium"
                            >
                              Antes
                            </Badge>
                          </div>
                          <div className="h-48 relative w-full border-b border-border/10 overflow-hidden">
                            <img
                              src={clinicalCase.after}
                              alt="Depois"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                            <Badge className="absolute bottom-3 right-3 bg-primary/90 hover:bg-primary/90 text-primary-foreground border-none backdrop-blur-md shadow-sm font-medium">
                              Depois
                            </Badge>
                          </div>
                        </div>
                        <div className="p-6 shrink-0 bg-card">
                          <h3 className="font-bold text-xl text-foreground mb-2">
                            {clinicalCase.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {clinicalCase.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-4 lg:-left-12 bg-background border-border hover:bg-accent text-foreground w-10 h-10 shadow-sm" />
              <CarouselNext className="-right-4 lg:-right-12 bg-background border-border hover:bg-accent text-foreground w-10 h-10 shadow-sm" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
