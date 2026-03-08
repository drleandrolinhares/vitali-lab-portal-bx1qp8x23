import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Contact,
  Package,
  ShieldAlert,
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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
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
import { cn } from '@/lib/utils'

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

const ADMIN_MENUS = [
  {
    group: 'OPERACIONAL',
    items: [
      { id: 'inbox', title: 'Caixa de Entrada', icon: FileText, path: '/' },
      { id: 'new-request', title: 'Novo Pedido', icon: PlusCircle, path: '/new-request' },
      { id: 'kanban', title: 'Evolução dos Trabalhos', icon: KanbanSquare, path: '/kanban' },
      { id: 'history', title: 'Histórico Global', icon: History, path: '/history' },
    ],
  },
  {
    group: 'ADMINISTRATIVO',
    items: [
      { id: 'dentists', title: 'Dentistas', icon: Users, path: '/dentists' },
      { id: 'patients', title: 'Pacientes', icon: Contact, path: '/patients' },
    ],
  },
  {
    group: 'FINANCEIRO',
    items: [
      { id: 'dashboard', title: 'DASHBOARD', icon: BarChart3, path: '/dashboard' },
      { id: 'finances', title: 'Finanças', icon: TrendingUp, path: '/admin-financial' },
      {
        id: 'accounts-payable',
        title: 'Contas a Pagar',
        icon: DollarSign,
        path: '/accounts-payable',
      },
      { id: 'inventory', title: 'Estoque', icon: Package, path: '/inventory' },
      { id: 'prices', title: 'Tabela de Preços', icon: DollarSign, path: '/prices' },
    ],
  },
  {
    group: 'CONFIGURAÇÕES',
    items: [
      { id: 'settings', title: 'Configurações e Usuários', icon: Settings, path: '/settings' },
      { id: 'audit', title: 'Logs de Auditoria', icon: ShieldAlert, path: '/audit-logs' },
    ],
  },
]

function AppSidebar() {
  const { currentUser, appSettings, orders } = useAppStore()
  const { signOut } = useAuth()
  const location = useLocation()

  if (!currentUser) return null

  const permissions = currentUser.permissions || []
  const hasPerm = (id: string) =>
    currentUser.role === 'admin' && permissions.length === 0 ? true : permissions.includes(id)

  const dentistNavItems = [
    { title: 'Meu Painel', icon: LayoutDashboard, path: '/' },
    { title: 'Novo Pedido', icon: PlusCircle, path: '/new-request' },
    { title: 'Evolução dos Trabalhos', icon: KanbanSquare, path: '/kanban' },
    { title: 'Gestão Financeira', icon: DollarSign, path: '/financial' },
    { title: 'Histórico', icon: History, path: '/history' },
  ]

  let adminDynamicLink = appSettings?.whatsapp_group_link
  let viewingClient = false

  if (
    (currentUser.role === 'admin' || currentUser.role === 'receptionist') &&
    location.pathname.startsWith('/order/')
  ) {
    const orderId = location.pathname.split('/').pop()
    const order = orders.find((o: any) => o.id === orderId)
    if (order && order.dentistGroupLink) {
      adminDynamicLink = order.dentistGroupLink
      viewingClient = true
    }
  }

  const clinicName = currentUser.clinic?.trim()
  const groupTitle = clinicName ? `Grupo ${clinicName}/Vitali Lab` : 'Grupo Clínica/Vitali Lab'

  const commLinks =
    currentUser.role === 'dentist'
      ? [
          {
            title: groupTitle,
            icon: WhatsAppIcon,
            url: (currentUser as any).whatsapp_group_link || appSettings?.whatsapp_group_link,
          },
          { title: 'Vitali Lab Recepção', icon: WhatsAppIcon, url: appSettings?.whatsapp_lab_link },
        ]
      : [
          {
            title: viewingClient ? 'WhatsApp Cliente (Grupo)' : 'Vitali Lab Recepção',
            icon: WhatsAppIcon,
            url: viewingClient ? adminDynamicLink : appSettings?.whatsapp_lab_link,
          },
        ]

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="py-6 flex flex-col items-center justify-center">
        <Logo variant="square" size="lg" className="mb-2" />
      </SidebarHeader>
      <SidebarContent className="px-2">
        {currentUser.role === 'dentist' ? (
          <SidebarMenu>
            {dentistNavItems.map((item) => (
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
        ) : (
          ADMIN_MENUS.map((group) => {
            const visibleItems = group.items.filter((i) => hasPerm(i.id))
            if (visibleItems.length === 0) return null
            return (
              <SidebarGroup key={group.group} className="px-0 py-0 mb-4">
                <SidebarGroupLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-2">
                  {group.group}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {visibleItems.map((item) => (
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
                </SidebarGroupContent>
              </SidebarGroup>
            )
          })
        )}

        <SidebarMenu className="mt-4">
          <SidebarMenuItem className="mb-1 px-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Comunicação
            </span>
          </SidebarMenuItem>
          {commLinks.map((item) => {
            const isConfigured = Boolean(item.url && item.url.trim() !== '')
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10',
                    !isConfigured &&
                      'opacity-50 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent',
                  )}
                >
                  <a
                    href={isConfigured ? item.url : '#'}
                    target={isConfigured ? '_blank' : undefined}
                    rel={isConfigured ? 'noopener noreferrer' : undefined}
                    onClick={(e) => {
                      if (!isConfigured) e.preventDefault()
                    }}
                  >
                    <item.icon />
                    <span className="truncate">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
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
  const { currentUser, selectedLab, setSelectedLab } = useAppStore()
  const location = useLocation()

  if (!currentUser) return null

  const isFinancialRoute = [
    '/dashboard',
    '/admin-financial',
    '/accounts-payable',
    '/inventory',
    '/prices',
  ].includes(location.pathname)
  const showLabSelector =
    (currentUser.role === 'admin' || currentUser.role === 'receptionist') && isFinancialRoute

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white/95 dark:bg-background/95 px-4 backdrop-blur sm:px-6 print:hidden">
      <SidebarTrigger />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-sm font-semibold text-muted-foreground hidden sm:block">
          Portal Digital •{' '}
          <span className="text-foreground">{currentUser.clinic || 'Gestão Lab'}</span>
        </h1>
        <div className="flex items-center gap-4">
          {showLabSelector && (
            <Select value={selectedLab} onValueChange={setSelectedLab}>
              <SelectTrigger className="w-[190px] h-8 text-xs font-medium bg-muted/50 border-dashed focus:ring-0">
                <SelectValue placeholder="Selecione o Laboratório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Visão Consolidada</SelectItem>
                <SelectItem value="Soluções Cerâmicas">Soluções Cerâmicas</SelectItem>
                <SelectItem value="Studio Acrílico">Studio Acrílico</SelectItem>
              </SelectContent>
            </Select>
          )}
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
