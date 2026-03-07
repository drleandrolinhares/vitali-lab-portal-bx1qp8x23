import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Users,
  LogOut,
  FileText,
  Menu,
  RefreshCcw,
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
  useSidebar,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function AppSidebar() {
  const { currentUser, switchRole } = useAppStore()
  const location = useLocation()

  const navItems =
    currentUser.role === 'dentist'
      ? [
          { title: 'Meu Painel', icon: LayoutDashboard, path: '/' },
          { title: 'Novo Pedido', icon: PlusCircle, path: '/new-request' },
          { title: 'Histórico', icon: History, path: '/history' },
        ]
      : [
          { title: 'Caixa de Entrada', icon: FileText, path: '/' },
          { title: 'Histórico Global', icon: History, path: '/history' },
          { title: 'Dentistas', icon: Users, path: '/dentists' },
        ]

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
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 px-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-xs truncate flex-1">
                <span className="font-medium truncate">{currentUser.name}</span>
                <span className="text-muted-foreground truncate">
                  {currentUser.role === 'dentist' ? 'Dentista' : 'Laboratório'}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Modo de Demonstração</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => switchRole('dentist')}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Alternar para Dentista
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchRole('lab')}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Alternar para Laboratório
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
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
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
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
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0 bg-muted/30">
        <MainHeader />
        <main className="flex-1 p-4 sm:p-6 overflow-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
