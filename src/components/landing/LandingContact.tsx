import { Instagram, MessageCircle } from 'lucide-react'

export function LandingContact() {
  return (
    <section id="contatos" className="py-24 bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Fale Conosco
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Estamos prontos para atender você e transformar seus planejamentos em realidade. Entre
            em contato pelos nossos canais oficiais.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* WhatsApp */}
          <a
            href="https://wa.me/5527999466655"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-3xl bg-card border border-border p-8 md:p-10 transition-all hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 shadow-inner group-hover:scale-110 transition-transform">
              <MessageCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">WhatsApp</h3>
            <p className="text-muted-foreground mb-4">Envie uma mensagem ou ligue para nós</p>
            <span className="text-xl font-medium text-emerald-500 group-hover:text-emerald-400 transition-colors mt-auto">
              27 99946-6655
            </span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/vitali_lab/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-3xl bg-card border border-border p-8 md:p-10 transition-all hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/10 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 border border-pink-500/20 shadow-inner group-hover:scale-110 transition-transform">
              <Instagram className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">Instagram</h3>
            <p className="text-muted-foreground mb-4">Acompanhe nosso dia a dia e casos reais</p>
            <span className="text-xl font-medium text-pink-500 group-hover:text-pink-400 transition-colors mt-auto">
              @vitali_lab
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
