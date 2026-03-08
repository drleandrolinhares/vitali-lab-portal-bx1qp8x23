import { HeartHandshake } from 'lucide-react'
import purposeImg from '@/assets/design-sem-nome-7bcf6.jpg'

export function LandingPurpose() {
  return (
    <section id="diferenciais" className="py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-sm font-medium text-foreground shadow-sm">
              <HeartHandshake className="w-4 h-4 text-primary" /> Nosso Propósito
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight">
              Parceria muito além da bancada
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Acreditamos que a comunicação falha é o maior gargalo na prótese atual. Por isso, no
              Vitali Lab, o relacionamento vem em primeiro lugar.
            </p>
            <ul className="space-y-6 mt-8">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1 shadow-inner">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-sm" />
                </div>
                <div>
                  <h4 className="text-foreground text-lg font-bold mb-1">Gestão Humanizada</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Atendimento próximo via WhatsApp com um gerente dedicado para entender suas
                    preferências clínicas.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1 shadow-inner">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-sm" />
                </div>
                <div>
                  <h4 className="text-foreground text-lg font-bold mb-1">
                    Portal Digital Exclusivo
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Acompanhe seus pedidos em tempo real, gerencie cobranças e acesse o histórico de
                    pacientes de forma simples.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1 shadow-inner">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-sm" />
                </div>
                <div>
                  <h4 className="text-foreground text-lg font-bold mb-1">Consultoria de Casos</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Discussão prévia de planejamentos estéticos e reabilitações complexas
                    diretamente com nossos técnicos.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="relative z-10 rounded-3xl overflow-hidden border border-border aspect-square lg:aspect-auto bg-muted">
              <img
                src={purposeImg}
                alt="Atendimento Humanizado"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
