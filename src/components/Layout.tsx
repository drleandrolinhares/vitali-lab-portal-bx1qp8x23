import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/main'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase/client'
import { GlobalSearch } from '@/components/GlobalSearch'
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
  PieChart,
  UserPlus,
  Tags,
  Wallet,
  User,
  Building,
  ChevronRight,
  ScanLine,
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
  SidebarMenuBadge,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useAuth } from '@/hooks/use-auth'
import { NewOrderNotification } from '@/components/NewOrderNotification'
import { cn } from '@/lib/utils'

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

type MenuItem = {
  id: string
  title: string
  icon: any
  path?: string
  isCTA?: boolean
  isAccordion?: boolean
  subItems?: { id: string; title: string; path: string }[]
}

const ADMIN_MENUS: { group: string; items: MenuItem[] }[] = [
  {
    group: 'OPERACIONAL',
    items: [
      {
        id: 'new-request',
        title: 'NOVO PEDIDO',
        icon: PlusCircle,
        path: '/new-request',
        isCTA: true,
      },
      { id: 'scan-service', title: 'SCAN SERVICE', icon: ScanLine, path: '/scan-service' },
      { id: 'inbox', title: 'CAIXA DE ENTRADA', icon: FileText, path: '/app' },
      { id: 'kanban', title: 'EVOLUÇÃO DOS TRABALHOS', icon: KanbanSquare, path: '/kanban' },
      { id: 'history', title: 'HISTÓRICO GLOBAL', icon: History, path: '/history' },
      { id: 'inventory', title: 'ESTOQUE', icon: Package, path: '/inventory' },
    ],
  },
  {
    group: 'ADMINISTRATIVO',
    items: [
      { id: 'patients', title: 'PACIENTES', icon: Contact, path: '/patients' },
      { id: 'users', title: 'USUÁRIOS', icon: UserPlus, path: '/users' },
      { id: 'prices', title: 'TABELA DE PREÇOS', icon: DollarSign, path: '/prices' },
    ],
  },
  {
    group: 'FINANCEIRO',
    items: [
      {
        id: 'dashboards-group',
        title: 'DASHBOARDS',
        icon: BarChart3,
        isAccordion: true,
        subItems: [
          { id: 'dashboard', title: 'GERENCIAL', path: '/dashboard' },
          { id: 'finances', title: 'FINANCEIRO', path: '/dre' },
          { id: 'comparative-dashboard', title: 'COMPARATIVO', path: '/comparative-dashboard' },
        ],
      },
      { id: 'admin-financial', title: 'CONTAS A RECEBER', icon: Wallet, path: '/admin-financial' },
      {
        id: 'accounts-payable',
        title: 'CONTAS A PAGAR',
        icon: DollarSign,
        path: '/accounts-payable',
      },
    ],
  },
  {
    group: 'CONFIGURAÇÕES',
    items: [
      { id: 'settings', title: 'CONFIGURAÇÕES GERAIS', icon: Settings, path: '/settings' },
      { id: 'lab-profile', title: 'PERFIL VITALI LAB', icon: Building, path: '/lab-profile' },
      { id: 'dre-categories', title: 'CATEGORIAS DE DRE', icon: Tags, path: '/dre-categories' },
      { id: 'audit', title: 'LOG DE AUDITORIA', icon: ShieldAlert, path: '/audit-logs' },
    ],
  },
]

function useAdminBadges(currentUser: any) {
  const [lowStock, setLowStock] = useState(0)
  const [pendingPayables, setPendingPayables] = useState(0)
  const { selectedLab } = useAppStore()

  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'master')) return

    const fetchBadges = async () => {
      try {
        const { data: inv, error: invError } = await supabase
          .from('inventory_items')
          .select('quantity, minimum_stock_level')

        if (inv && !invError) {
          setLowStock(
            inv.filter((i: any) => Number(i.quantity) < Number(i.minimum_stock_level || 0)).length,
          )
        }

        let expQuery = supabase
          .from('expenses')
          .select('id', { count: 'exact' })
          .eq('status', 'pending')
          .is('order_id', null)

        if (selectedLab && selectedLab !== 'Todos') {
          expQuery = expQuery.eq('sector', selectedLab)
        }

        const { count: expCount, error: expError } = await expQuery

        if (expCount !== null && !expError) {
          setPendingPayables(expCount)
        }
      } catch (err) {
        console.error('Error fetching admin badges:', err)
      }
    }

    fetchBadges()

    const channel = supabase
      .channel('admin-badges')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventory_items' },
        fetchBadges,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventory_transactions' },
        fetchBadges,
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, fetchBadges)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser, selectedLab])

  return { lowStock, pendingPayables }
}

function AppSidebar() {
  const { currentUser, appSettings, orders, checkPermission } = useAppStore()
  const { signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const { lowStock, pendingPayables } = useAdminBadges(currentUser)

  if (!currentUser) return null

  const isMaster = currentUser.role === 'master'
  const isClientRole = currentUser.role === 'dentist' || currentUser.role === 'laboratory'

  const hasPerm = (id: string) => {
    if (isMaster) return true
    if (id === 'profile' || id === 'my-profile') return true
    if (id === 'lab-profile') return isMaster
    if (id === 'scan-service') return true

    if (id === 'new-request') {
      return checkPermission('inbox', 'create_order')
    }

    if (isClientRole && id === 'finances') {
      return checkPermission('individual_financial_dash')
    }

    if (isClientRole && id === 'my_panel') {
      return checkPermission('my_panel')
    }

    if (id === 'dashboard') return checkPermission('dashboards', 'view_general')
    if (id === 'finances') return checkPermission('dashboards', 'view_financial')
    if (id === 'comparative-dashboard') return checkPermission('dashboards', 'view_operational')

    const map: Record<string, string> = {
      inbox: 'inbox',
      kanban: 'kanban',
      history: 'history',
      'accounts-payable': 'finances',
      'admin-financial': 'finances',
      prices: 'finances',
      inventory: 'inventory',
      settings: 'settings',
      'dre-categories': 'settings',
      audit: 'settings',
      users: 'settings',
      patients: 'settings',
    }

    const moduleName = map[id]
    if (moduleName) {
      return checkPermission(moduleName)
    }
    return false
  }

  const dentistNavItems = [
    { id: 'my_panel', title: 'MEU PAINEL', icon: LayoutDashboard, path: '/app' },
    { id: 'new-request', title: 'NOVO PEDIDO', icon: PlusCircle, path: '/new-request' },
    { id: 'scan-service', title: 'SCAN SERVICE', icon: ScanLine, path: '/scan-service' },
    { id: 'kanban', title: 'EVOLUÇÃO DOS TRABALHOS', icon: KanbanSquare, path: '/kanban' },
    { id: 'history', title: 'HISTÓRICO GLOBAL', icon: History, path: '/history' },
    { id: 'finances', title: 'DASH FINANCEIRO', icon: DollarSign, path: '/financial' },
    { id: 'settings', title: 'MEU PERFIL', icon: User, path: '/settings' },
  ]

  let adminDynamicLink = (currentUser as any).whatsapp_group_link
  let viewingClient = false

  if (!isClientRole && location.pathname.startsWith('/order/')) {
    const orderId = location.pathname.split('/').pop()
    const order = orders.find((o: any) => o.id === orderId)
    if (order && order.dentistGroupLink) {
      adminDynamicLink = order.dentistGroupLink
      viewingClient = true
    }
  }

  const clinicName = currentUser.clinic?.trim()
  const groupTitle = clinicName
    ? `GRUPO ${clinicName.toUpperCase()}`
    : currentUser.role === 'laboratory'
      ? 'GRUPO DO LABORATÓRIO'
      : 'GRUPO DA CLÍNICA'

  const commLinks = isClientRole
    ? [
        {
          title: groupTitle,
          icon: WhatsAppIcon,
          url: (currentUser as any).whatsapp_group_link,
        },
        { title: 'VITALI LAB RECEPÇÃO', icon: WhatsAppIcon, url: appSettings?.whatsapp_lab_link },
      ]
    : [
        {
          title: viewingClient ? 'WHATSAPP CLIENTE (GRUPO)' : 'VITALI LAB RECEPÇÃO',
          icon: WhatsAppIcon,
          url: viewingClient ? adminDynamicLink : appSettings?.whatsapp_lab_link,
        },
      ]

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="py-6 flex flex-col items-center justify-center min-h-[80px]">
        <Link
          to={isClientRole ? '/app' : '/dashboard'}
          className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] w-full flex justify-center overflow-hidden"
          title="Ir para o Dashboard"
        >
          <div className="group-data-[collapsible=icon]:hidden flex w-full justify-center">
            <Logo variant="default" size="lg" className="mb-2" />
          </div>
          <div className="hidden group-data-[collapsible=icon]:flex w-full justify-center">
            <Logo variant="square" size="sm" className="w-8 h-8 rounded-lg" />
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2">
        {isClientRole ? (
          <SidebarMenu>
            {dentistNavItems.map((item) => {
              if (!hasPerm(item.id)) return null
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname === item.path ||
                      location.pathname + location.search === item.path
                    }
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        ) : (
          ADMIN_MENUS.map((group) => {
            const visibleItems = group.items
              .map((item) => {
                if (item.isAccordion) {
                  const hasVisibleSub = item.subItems?.some((sub) => hasPerm(sub.id))
                  if (!hasVisibleSub) return null
                  return item
                }
                if (!hasPerm(item.id)) return null
                return item
              })
              .filter(Boolean)

            if (visibleItems.length === 0) return null

            const renderItems = () => (
              <SidebarMenu>
                {visibleItems.map((item) => {
                  if (item.isAccordion) {
                    const visibleSubItems = item.subItems?.filter((sub) => hasPerm(sub.id))
                    if (!visibleSubItems?.length) return null

                    const isSubActive = visibleSubItems.some(
                      (sub) => location.pathname === sub.path,
                    )

                    return (
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={isSubActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                              <item.icon />
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {visibleSubItems.map((sub) => (
                                <SidebarMenuSubItem key={sub.path}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={location.pathname === sub.path}
                                  >
                                    <Link to={sub.path}>
                                      <span>{sub.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    )
                  }

                  let badgeCount = 0
                  let badgeColor = 'bg-primary'

                  if (item.id === 'inventory') {
                    badgeCount = lowStock
                    badgeColor = 'bg-red-500'
                  }
                  if (item.id === 'accounts-payable') {
                    badgeCount = pendingPayables
                    badgeColor = 'bg-slate-500 dark:bg-slate-600'
                  }
                  if (item.id === 'inbox') {
                    badgeCount = orders.filter((o: any) => !o.isAcknowledged).length
                    badgeColor = 'bg-emerald-500'
                  }

                  const isCTA = item.isCTA
                  const isActive =
                    location.pathname === item.path ||
                    location.pathname + location.search === item.path

                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          isCTA &&
                            'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-semibold border border-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90 data-[active=true]:hover:text-primary-foreground',
                        )}
                      >
                        <Link to={item.path!}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {badgeCount > 0 && (
                        <SidebarMenuBadge
                          className={cn(
                            'text-white rounded-full px-1.5 min-w-[20px] h-5 flex items-center justify-center text-[10px] font-bold shadow-sm',
                            badgeColor,
                          )}
                        >
                          {badgeCount}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            )

            return (
              <SidebarGroup key={group.group} className="px-0 py-0 mb-4">
                <SidebarGroupLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-2 group-data-[collapsible=icon]:hidden">
                  {group.group}
                </SidebarGroupLabel>
                <SidebarGroupContent>{renderItems()}</SidebarGroupContent>
              </SidebarGroup>
            )
          })
        )}

        <SidebarMenu className="mt-4">
          <SidebarMenuItem className="mb-1 px-2 group-data-[collapsible=icon]:hidden">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              COMUNICAÇÃO
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
                    <span>{item.title}</span>
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
              <div className="flex flex-col items-start text-xs truncate flex-1 group-data-[collapsible=icon]:hidden">
                <span className="font-medium truncate">{currentUser.name}</span>
                <span className="text-muted-foreground truncate text-[10px] uppercase tracking-wider">
                  {isClientRole
                    ? currentUser.role === 'laboratory'
                      ? 'LABORATÓRIO'
                      : 'DENTISTA'
                    : currentUser.role === 'master'
                      ? 'MASTER'
                      : currentUser.role === 'admin'
                        ? 'ADMINISTRADOR'
                        : 'RECEPÇÃO / LAB'}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>MINHA CONTA</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate('/settings?tab=profile')}
            >
              <User className="mr-2 h-4 w-4" /> MEU PERFIL
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" /> SAIR
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function MainHeader() {
  const { currentUser, selectedLab, setSelectedLab, appSettings, orders } = useAppStore()
  const location = useLocation()

  if (!currentUser) return null

  const isClientRole = currentUser.role === 'dentist' || currentUser.role === 'laboratory'

  const isFinancialRoute = [
    '/dashboard',
    '/admin-financial',
    '/accounts-payable',
    '/inventory',
    '/prices',
  ].includes(location.pathname)

  const showLabSelector =
    (currentUser.role === 'admin' ||
      currentUser.role === 'master' ||
      currentUser.role === 'receptionist') &&
    isFinancialRoute

  let adminDynamicLink = (currentUser as any).whatsapp_group_link
  let viewingClient = false

  if (!isClientRole && location.pathname.startsWith('/order/')) {
    const orderId = location.pathname.split('/').pop()
    const order = orders.find((o: any) => o.id === orderId)
    if (order && order.dentistGroupLink) {
      adminDynamicLink = order.dentistGroupLink
      viewingClient = true
    }
  }

  const clinicLink = isClientRole
    ? (currentUser as any).whatsapp_group_link
    : viewingClient
      ? adminDynamicLink
      : (currentUser as any).whatsapp_group_link

  const labLink = appSettings?.whatsapp_lab_link

  const hasClinicLink = Boolean(clinicLink && clinicLink.trim() !== '')
  const hasLabLink = Boolean(labLink && labLink.trim() !== '')

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white/95 dark:bg-background/95 px-4 backdrop-blur sm:px-6 print:hidden">
      <SidebarTrigger />
      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-sm font-semibold text-muted-foreground hidden xl:block whitespace-nowrap">
            PORTAL DIGITAL •{' '}
            <span className="text-foreground">{currentUser.clinic || 'GESTÃO LAB'}</span>
          </h1>
          <div className="w-full max-w-sm flex-1">
            <GlobalSearch />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
          <div className="flex items-center gap-2">
            {hasClinicLink ? (
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900/50 dark:hover:bg-emerald-900/20"
                asChild
              >
                <a href={clinicLink} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="w-4 h-4 mr-2" />
                  {viewingClient ? 'GRUPO DO CLIENTE' : 'GRUPO DA CLÍNICA'}
                </a>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex text-emerald-600/50 border-emerald-200/50 dark:border-emerald-900/30 cursor-not-allowed"
              >
                <WhatsAppIcon className="w-4 h-4 mr-2 opacity-50" />
                {viewingClient ? 'GRUPO DO CLIENTE' : 'GRUPO DA CLÍNICA'}
              </Button>
            )}

            {hasLabLink ? (
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900/50 dark:hover:bg-emerald-900/20"
                asChild
              >
                <a href={labLink} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="w-4 h-4 mr-2" />
                  CONTATO DO LABORATÓRIO
                </a>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex text-emerald-600/50 border-emerald-200/50 dark:border-emerald-900/30 cursor-not-allowed"
              >
                <WhatsAppIcon className="w-4 h-4 mr-2 opacity-50" />
                CONTATO DO LABORATÓRIO
              </Button>
            )}
          </div>

          {showLabSelector && (
            <Select value={selectedLab} onValueChange={setSelectedLab}>
              <SelectTrigger className="w-[190px] h-8 text-xs font-medium bg-muted/50 border-dashed focus:ring-0">
                <SelectValue placeholder="SELECIONE O LABORATÓRIO" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">VISÃO CONSOLIDADA</SelectItem>
                <SelectItem value="Soluções Cerâmicas">SOLUÇÕES CERÂMICAS</SelectItem>
                <SelectItem value="Studio Acrílico">STUDIO ACRÍLICO</SelectItem>
              </SelectContent>
            </Select>
          )}
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">LABORATÓRIO ONLINE</span>
            <span className="inline sm:hidden">ONLINE</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function Layout() {
  const { fetchError } = useAppStore()

  return (
    <SidebarProvider>
      <div className="print:hidden h-full flex z-20">
        <AppSidebar />
      </div>
      <div className="flex flex-1 flex-col min-w-0 bg-white dark:bg-background h-screen">
        <MainHeader />
        <main className="flex-1 p-4 sm:p-6 overflow-auto animate-fade-in print:p-0 print:overflow-visible relative z-0">
          {fetchError && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between border border-red-200 gap-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                <span className="font-medium text-sm">{fetchError}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="bg-white hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700 w-full sm:w-auto"
              >
                Recarregar a Página
              </Button>
            </div>
          )}
          <Outlet />
        </main>
      </div>
      <NewOrderNotification />
    </SidebarProvider>
  )
}
