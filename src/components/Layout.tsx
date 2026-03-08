import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Users,
  LogOut,
  FileText,
  BarChart3,
  KanbanSquare,
  DollarSign,
  TrendingUp,
  Settings,
  MessageSquare,
  Phone,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { NewOrderNotification } from '@/components/NewOrderNotification'

function AppSidebar() {
  const { currentUser, appSettings } = useAppStore()
  const { signOut } = useAuth()
  const location = useLocation()

  if (!currentUser) return null

  const navItems =
    currentUser.role === 'dentist'
      ? [
          { title: 'Meu Painel', icon: LayoutDashboard, path: '/' },
          { title: 'Novo Pedido', icon: PlusCircle, path: '/new-request' },
          { title: 'Evolução dos Trabalhos', icon: KanbanSquare, path: '/kanban' },
          { title: 'Gestão Financeira', icon: DollarSign, path: '/financial' },
          { title: 'Histórico', icon: History, path: '/history' },
        ]
      : [
          ...(currentUser.role === 'admin'
            ? [{ title: 'DASHBOARD', icon: BarChart3, path: '/dashboard' }]
            : []),
          ...(currentUser.role === 'admin'
            ? [{ title: 'Painel Financeiro', icon: TrendingUp, path: '/admin-financial' }]
            : []),
          { title: 'Caixa de Entrada', icon: FileText, path: '/' },
          { title: 'Evolução dos Trabalhos', icon: KanbanSquare, path: '/kanban' },
          { title: 'Histórico Global', icon: History, path: '/history' },
          { title: 'Dentistas', icon: Users, path: '/dentists' },
          ...(currentUser.role === 'admin'
            ? [{ title: 'Tabela de Preços', icon: DollarSign, path: '/prices' }]
            : []),
          ...(currentUser.role === 'admin'
            ? [{ title: 'Configurações', icon: Settings, path: '/settings' }]
            : []),
        ]

  const commLinks = [
    {
      title: 'Grupo de WhatsApp Clínica/Vitali Lab',
      icon: MessageSquare,
      url: appSettings?.whatsapp_group_link,
    },
    { title: 'WhatsApp Vitali Lab', icon: Phone, url: appSettings?.whatsapp_lab_link },
  ].filter((l) => Boolean(l.url))

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-4 flex flex-row items-center">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.path}
                tooltip={item.title}
              >
                <Link to={item.path}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {commLinks.length > 0 && (
            <>
              <SidebarMenuItem className="mt-4 mb-1 px-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Comunicação
                </span>
              </SidebarMenuItem>
              {commLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                  >
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 px-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback>{currentUser.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-xs truncate flex-1">
                <span className="font-medium truncate">{currentUser.name}</span>
                <span className="text-muted-foreground truncate text-[10px] uppercase tracking-wider">
                  {currentUser.role === 'dentist'
                    ? 'Dentista'
                    : currentUser.role === 'admin'
                      ? 'Administrador'
                      : 'Recepção / Lab'}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function MainHeader() {
  const { currentUser } = useAppStore()
  if (!currentUser) return null
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white/95 dark:bg-background/95 px-4 backdrop-blur sm:px-6 print:hidden">
      <SidebarTrigger />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-sm font-semibold text-muted-foreground hidden sm:block">
          Portal Digital •{' '}
          <span className="text-foreground">{currentUser.clinic || 'Gestão Lab'}</span>
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Laboratório Online
          </div>
        </div>
      </div>
    </header>
  )
}

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="print:hidden h-full flex">
        <AppSidebar />
      </div>
      <div className="flex flex-1 flex-col min-w-0 bg-white dark:bg-background h-screen">
        <MainHeader />
        <main className="flex-1 p-4 sm:p-6 overflow-auto animate-fade-in print:p-0 print:overflow-visible">
          <Outlet />
        </main>
      </div>
      <NewOrderNotification />
    </SidebarProvider>
  )
}
