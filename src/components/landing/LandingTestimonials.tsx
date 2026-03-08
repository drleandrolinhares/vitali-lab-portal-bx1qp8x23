import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Dr. Roberto Almeida',
    role: 'Especialista em Implantodontia',
    content:
      'O Vitali Lab transformou a previsibilidade dos meus casos. A qualidade das peças em zircônia e o atendimento próximo da equipe fazem toda a diferença na minha prática clínica diária.',
  },
  {
    name: 'Dra. Carolina Mendes',
    role: 'Odontologia Estética',
    content:
      'As lentes de contato dental produzidas por eles são verdadeiras obras de arte. A adaptação é sempre perfeita e a naturalidade impressiona meus pacientes.',
  },
  {
    name: 'Dr. Fernando Costa',
    role: 'Reabilitação Oral',
    content:
      'Ter um laboratório que entende não só da técnica, mas também da comunicação com o dentista é essencial. O portal digital facilitou muito a gestão dos meus pedidos.',
  },
]

export function LandingTestimonials() {
  return (
    <section id="depoimentos" className="py-24 bg-muted/20 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            O que dizem nossos parceiros
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A satisfação dos nossos dentistas parceiros é o reflexo do nosso compromisso com a
            excelência.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-3xl p-8 flex flex-col relative overflow-hidden group hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className="flex justify-center gap-1 text-yellow-500 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground text-center leading-relaxed flex-1 mb-8 italic text-lg">
                "{testimonial.content}"
              </p>
              <div className="flex flex-col items-center justify-center pt-6 border-t border-border/50 mt-auto">
                <h4 className="font-bold text-foreground text-base text-center">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-muted-foreground text-center">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
