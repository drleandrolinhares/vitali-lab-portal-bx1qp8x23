import { Logo } from '@/components/Logo'

export function LandingFooter() {
  return (
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
  )
}
