import { Diamond, ShieldCheck } from 'lucide-react'
import allanImg from '@/assets/allan-queiroz-25-13390.jpeg'
import acrilicoImg from '@/assets/allan-queiroz-52-abae6.jpeg'

export function LandingSpecialties() {
  return (
    <section id="solucoes" className="py-24 bg-muted/20 border-y border-border/50">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Nossas Especialidades
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Dois laboratórios em um só propósito: entregar a solução ideal para cada caso clínico
            com o mais alto padrão de qualidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Cerâmicas */}
          <div className="group relative overflow-hidden rounded-3xl bg-card border border-border transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 flex flex-col">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={allanImg}
                alt="Soluções Cerâmicas"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-8 md:p-10 flex-1 flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 shadow-inner">
                <Diamond className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                Vitali Lab Soluções Cerâmicas
              </h3>
              <p className="text-muted-foreground leading-relaxed flex-1">
                Focado na alta estética e precisão. Produzimos facetas, lentes de contato, coroas e
                próteses sobre implante utilizando os materiais mais nobres do mercado, como
                dissilicato de lítio e zircônia.
              </p>
            </div>
          </div>

          {/* Acrílico */}
          <div className="group relative overflow-hidden rounded-3xl bg-card border border-border transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 flex flex-col">
            <div className="aspect-[4/3] overflow-hidden bg-black">
              <img
                src={acrilicoImg}
                alt="Studio Acrílico Protocolo"
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-8 md:p-10 flex-1 flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 shadow-inner">
                <ShieldCheck className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                Vitali Lab Studio Acrílico
              </h3>
              <p className="text-muted-foreground leading-relaxed flex-1">
                Especializado em reabilitações extensas e funcionais. Próteses totais, protocolos
                acrílicos e placas oclusais desenvolvidas com máximo conforto e durabilidade para o
                seu paciente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
