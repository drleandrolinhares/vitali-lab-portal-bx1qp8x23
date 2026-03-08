import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { ChevronRight, HeartHandshake, Diamond, ShieldCheck } from 'lucide-react'
import allanImg from '@/assets/allan-queiroz-25-13390.jpeg'
import acrilicoImg from '@/assets/allan-queiroz-52-abae6.jpeg'
import heroBgImg from '@/assets/allan-queiroz-64-c1e37.jpeg'

export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 max-w-7xl">
          <Logo variant="default" size="lg" className="scale-90 sm:scale-100 origin-left" />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#solucoes" className="hover:text-foreground transition-colors">
              Especialidades
            </a>
            <a href="#diferenciais" className="hover:text-foreground transition-colors">
              Nosso Propósito
            </a>
          </nav>
          <Button asChild className="rounded-full px-6">
            <Link to="/app">
              Acessar Portal <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 z-0 opacity-[0.55]">
            <img
              src={heroBgImg}
              alt="Premium dental laboratory"
              className="w-full h-full object-cover object-right"
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
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 h-14 text-base w-full sm:w-auto"
              >
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

        {/* Nossas Especialidades */}
        <section id="solucoes" className="py-24 bg-muted/20 border-y border-border/50">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                Nossas Especialidades
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Dois laboratórios em um só propósito: entregar a solução ideal para cada caso
                clínico com o mais alto padrão de qualidade.
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
                    Focado na alta estética e precisão. Produzimos facetas, lentes de contato,
                    coroas e próteses sobre implante utilizando os materiais mais nobres do mercado,
                    como dissilicato de lítio e zircônia.
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
                    Especializado em reabilitações extensas e funcionais. Próteses totais,
                    protocolos acrílicos e placas oclusais desenvolvidas com máximo conforto e
                    durabilidade para o seu paciente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nosso Propósito */}
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
                  Acreditamos que a comunicação falha é o maior gargalo na prótese atual. Por isso,
                  no Vitali Lab, o relacionamento vem em primeiro lugar.
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
                        Acompanhe seus pedidos em tempo real, gerencie cobranças e acesse o
                        histórico de pacientes de forma simples.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1 shadow-inner">
                      <div className="w-3 h-3 rounded-full bg-primary shadow-sm" />
                    </div>
                    <div>
                      <h4 className="text-foreground text-lg font-bold mb-1">
                        Consultoria de Casos
                      </h4>
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
                    src="https://img.usecurling.com/p/800/800?q=dentist%20consultation&dpr=2"
                    alt="Atendimento Humanizado"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-3">
            <Logo
              variant="default"
              size="sm"
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
            <p className="text-muted-foreground text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Vitali Lab. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Termos de Uso
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Política de Privacidade
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
