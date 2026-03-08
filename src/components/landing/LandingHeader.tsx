import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { ChevronRight } from 'lucide-react'

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 max-w-7xl">
        <Logo variant="default" size="lg" className="scale-90 sm:scale-100 origin-left" />
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#solucoes" className="hover:text-foreground transition-colors">
            Especialidades
          </a>
          <a href="#casos" className="hover:text-foreground transition-colors">
            Casos
          </a>
          <a href="#diferenciais" className="hover:text-foreground transition-colors">
            Propósito
          </a>
          <a href="#depoimentos" className="hover:text-foreground transition-colors">
            Depoimentos
          </a>
          <a href="#contatos" className="hover:text-foreground transition-colors">
            Contatos
          </a>
        </nav>
        <Button asChild className="rounded-full px-4 sm:px-6">
          <Link to="/app">
            Acessar Portal <ChevronRight className="w-4 h-4 ml-1 hidden sm:inline-block" />
          </Link>
        </Button>
      </div>
    </header>
  )
}
