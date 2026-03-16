import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useAppStore } from '@/stores/main'

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { currentUser } = useAppStore()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  const isClientRole = currentUser?.role === 'dentist' || currentUser?.role === 'laboratory'

  const items = isClientRole
    ? [
        { title: 'Meu Painel', path: '/app' },
        { title: 'Novo Pedido', path: '/new-request' },
        { title: 'Scan Service', path: '/scan-service' },
        { title: 'Evolução dos Trabalhos', path: '/kanban' },
        { title: 'Histórico Global', path: '/history' },
        { title: 'Dash Financeiro', path: '/financial' },
        { title: 'Meu Perfil', path: '/settings' },
      ]
    : [
        { title: 'Novo Pedido', path: '/new-request' },
        { title: 'Scan Service', path: '/scan-service' },
        { title: 'Caixa de Entrada', path: '/app' },
        { title: 'Evolução dos Trabalhos', path: '/kanban' },
        { title: 'Histórico Global', path: '/history' },
        { title: 'Estoque', path: '/inventory' },
        { title: 'Pacientes', path: '/patients' },
        { title: 'Usuários e Equipe', path: '/users' },
        { title: 'Laboratórios Parceiros', path: '/users?tab=laboratories' },
        { title: 'Tabela de Preços', path: '/prices' },
        { title: 'Dashboard Gerencial', path: '/dashboard' },
        { title: 'Dashboard Financeiro', path: '/dre' },
        { title: 'Dashboard Comparativo', path: '/comparative-dashboard' },
        { title: 'Contas a Receber', path: '/admin-financial' },
        { title: 'Contas a Pagar', path: '/accounts-payable' },
        { title: 'Configurações Gerais', path: '/settings' },
        { title: 'Perfil Vitali Lab', path: '/lab-profile' },
        { title: 'Categorias de DRE', path: '/dre-categories' },
        { title: 'Log de Auditoria', path: '/audit-logs' },
      ]

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-full bg-muted/40 text-sm font-normal text-muted-foreground shadow-sm border-border hover:bg-muted/80 focus-visible:ring-1 focus-visible:ring-[#0f172a] transition-all"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4 shrink-0 text-[#eab308]" />
        <span className="hidden lg:inline-flex">Buscar módulos e páginas...</span>
        <span className="inline-flex lg:hidden">Buscar...</span>
        <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex text-muted-foreground shadow-sm">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Digite para buscar páginas e módulos..."
          className="focus-visible:ring-[#0f172a]"
        />
        <CommandList className="scrollbar-hide">
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação do Sistema">
            {items.map((item) => (
              <CommandItem
                key={item.path}
                value={item.title}
                onSelect={() => runCommand(() => navigate(item.path))}
                className="cursor-pointer aria-selected:bg-[#0f172a]/5 aria-selected:text-[#0f172a]"
              >
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
