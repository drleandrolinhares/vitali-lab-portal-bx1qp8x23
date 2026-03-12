import { useState, useEffect, useMemo } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { toast } from '@/hooks/use-toast'
import { ShieldCheck, Loader2, Info } from 'lucide-react'

export const MODULES = [
  {
    id: 'inbox',
    label: 'Caixa de Entrada / Início',
    actions: [
      { id: 'view_all', label: 'Ver Todos os Pedidos (Visão Global)' },
      { id: 'view_mine', label: 'Ver Apenas Meus Pedidos' },
      { id: 'create_order', label: 'Criar Novo Pedido' },
    ],
  },
  {
    id: 'kanban',
    label: 'Evolução dos Trabalhos (Kanban)',
    actions: [
      { id: 'move_cards', label: 'Mover Cards (Drag & Drop)' },
      { id: 'view_all', label: 'Ver Todos os Trabalhos' },
      { id: 'filter_dentist', label: 'Filtrar por Dentista' },
    ],
  },
  {
    id: 'history',
    label: 'Histórico Global',
    actions: [
      { id: 'select_dentist', label: 'Selecionar Dentistas' },
      { id: 'show_completed', label: 'Mostrar Concluídos' },
      { id: 'search', label: 'Busca por Paciente/ID' },
    ],
  },
  {
    id: 'dashboards',
    label: 'Dashboards',
    actions: [
      { id: 'view_general', label: 'Dashboard Gerencial' },
      { id: 'view_financial', label: 'Dashboard Financeiro' },
      { id: 'view_operational', label: 'Dashboard Comparativo Interno' },
    ],
  },
  {
    id: 'finances',
    label: 'Financeiro / Faturamento',
    actions: [],
  },
  {
    id: 'inventory',
    label: 'Estoque',
    actions: [],
  },
  {
    id: 'settings',
    label: 'Configurações / Usuários',
    actions: [],
  },
]

const ROLES = [
  { id: 'master', label: 'MASTER' },
  { id: 'admin', label: 'ADMINISTRADOR' },
  { id: 'receptionist', label: 'RECEPCIONISTA' },
  { id: 'technical_assistant', label: 'AUX. TÉCNICO' },
  { id: 'financial', label: 'FINANCEIRO' },
  { id: 'relationship_manager', label: 'GESTÃO REL.' },
  { id: 'dentist', label: 'DENTISTA' },
]

export function RolePermissionsPanel() {
  const { appSettings, updateSetting, currentUser } = useAppStore()
  const [activeTab, setActiveTab] = useState('admin')
  const [saving, setSaving] = useState(false)
  const [perms, setPerms] = useState<Record<string, any>>({})

  useEffect(() => {
    if (appSettings?.role_permissions_v2) {
      try {
        const parsed = JSON.parse(appSettings.role_permissions_v2)
        const initialPerms: any = {}
        ROLES.forEach((r) => {
          initialPerms[r.id] = parsed[r.id] || {}
        })
        setPerms(initialPerms)
      } catch (e) {
        console.error('Failed to parse role_permissions_v2', e)
      }
    } else {
      const initialPerms: any = {}
      ROLES.forEach((r) => {
        initialPerms[r.id] = {}
      })
      setPerms(initialPerms)
    }
  }, [appSettings])

  const updateAccess = (role: string, moduleId: string, checked: boolean) => {
    if (role === 'master') return
    setPerms((prev) => {
      const newRolePerms = { ...(prev[role] || {}) }
      if (!newRolePerms[moduleId]) {
        newRolePerms[moduleId] = { access: false, actions: {} }
      }
      newRolePerms[moduleId].access = checked
      return { ...prev, [role]: newRolePerms }
    })
  }

  const updateAction = (role: string, moduleId: string, actionId: string, checked: boolean) => {
    if (role === 'master') return
    setPerms((prev) => {
      const newRolePerms = { ...(prev[role] || {}) }
      if (!newRolePerms[moduleId]) {
        newRolePerms[moduleId] = { access: true, actions: {} }
      }
      newRolePerms[moduleId].actions = {
        ...newRolePerms[moduleId].actions,
        [actionId]: checked,
      }
      return { ...prev, [role]: newRolePerms }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    const permsString = JSON.stringify(perms)
    await updateSetting('role_permissions_v2', permsString)

    try {
      for (const role of ROLES.map((r) => r.id)) {
        if (role === 'master') continue
        await supabase.from('profiles').update({ permissions: perms[role] }).eq('role', role)
      }
      toast({ title: 'Permissões salvas e aplicadas a todos os usuários!' })
    } catch (e: any) {
      toast({
        title: 'Erro ao aplicar permissões nos perfis',
        description: e.message,
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const isAllActiveRolePermsSelected = useMemo(() => {
    if (activeTab === 'master') return true
    const activeRolePerms = perms[activeTab] || {}
    return MODULES.every((mod) => {
      const modPerm = activeRolePerms[mod.id]
      if (!modPerm?.access) return false
      if (mod.actions.length > 0) {
        return mod.actions.every((act) => modPerm.actions?.[act.id])
      }
      return true
    })
  }, [perms, activeTab])

  const handleToggleAllActiveRolePerms = (checked: boolean) => {
    if (activeTab === 'master') return
    setPerms((prev) => {
      const newPerms = { ...prev }
      if (checked) {
        const allForRole: Record<string, any> = {}
        MODULES.forEach((mod) => {
          allForRole[mod.id] = { access: true, actions: {} }
          mod.actions.forEach((act) => {
            allForRole[mod.id].actions[act.id] = true
          })
        })
        newPerms[activeTab] = allForRole
      } else {
        newPerms[activeTab] = {}
      }
      return newPerms
    })
  }

  const availableRoles =
    currentUser?.role === 'master' ? ROLES : ROLES.filter((r) => r.id !== 'master')

  return (
    <Card className="shadow-subtle">
      <CardHeader>
        <CardTitle className="uppercase flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          Configurações de Acesso (RBAC)
        </CardTitle>
        <CardDescription className="uppercase text-xs font-semibold">
          DEFINA O ACESSO PADRÃO AOS MENUS E AÇÕES ESPECÍFICAS PARA CADA FUNÇÃO DO SISTEMA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex w-full overflow-x-auto justify-start mb-6 pb-2 scrollbar-hide h-auto bg-transparent border-b rounded-none">
            {availableRoles.map((r) => (
              <TabsTrigger
                key={r.id}
                value={r.id}
                className={cn(
                  'uppercase text-xs font-bold whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 mr-2 rounded-md',
                  r.id === 'master' && 'data-[state=active]:bg-[#e76f51]',
                )}
              >
                {r.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {activeTab === 'master' && (
            <div className="mb-4 p-4 bg-[#e76f51]/10 border border-[#e76f51]/20 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-[#e76f51] mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#e76f51]">Acesso MASTER Irrestrito</h4>
                <p className="text-xs text-[#e76f51]/80 mt-1">
                  Este perfil possui acesso total ao sistema por padrão de sistema. As permissões
                  abaixo são apenas ilustrativas, pois o acesso não pode ser revogado.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center bg-muted/20 p-4 border rounded-xl mb-4">
            <div>
              <h4 className="text-sm font-bold uppercase">Permissões Globais do Perfil</h4>
              <p className="text-xs text-muted-foreground uppercase mt-0.5">
                Marcar todos os acessos disponíveis para este perfil.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-background px-3 py-1.5 rounded-lg border shadow-sm">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">
                MARCAR TODAS
              </span>
              <Switch
                checked={isAllActiveRolePermsSelected}
                onCheckedChange={handleToggleAllActiveRolePerms}
                disabled={activeTab === 'master'}
              />
            </div>
          </div>

          {availableRoles.map((r) => (
            <TabsContent key={r.id} value={r.id} className="space-y-4">
              <Accordion
                type="multiple"
                className="w-full space-y-2 border rounded-xl bg-muted/10 p-2"
              >
                {MODULES.map((mod) => (
                  <AccordionItem
                    value={mod.id}
                    key={mod.id}
                    className="border bg-background rounded-lg px-2 shadow-sm"
                  >
                    <div className="relative w-full">
                      <AccordionTrigger className="hover:no-underline py-3 group">
                        <div className="flex w-full pr-[140px] items-center text-left">
                          <span className="font-bold text-sm uppercase group-hover:text-primary transition-colors">
                            {mod.label}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10 bg-background pl-2 rounded-l-md">
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                          Acesso ao Menu
                        </span>
                        <Switch
                          checked={
                            r.id === 'master' ? true : perms[r.id]?.[mod.id]?.access || false
                          }
                          onCheckedChange={(c) => updateAccess(r.id, mod.id, c)}
                          disabled={r.id === 'master'}
                        />
                      </div>
                    </div>
                    {mod.actions.length > 0 && (
                      <AccordionContent className="pt-2 pb-4">
                        <div className="space-y-3 pl-4 border-l-2 border-primary/20 ml-2">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">
                            Permissões Específicas
                          </p>
                          {mod.actions.map((act) => (
                            <div className="flex justify-between items-center py-1.5" key={act.id}>
                              <span className="text-sm font-medium">{act.label}</span>
                              <Switch
                                checked={
                                  r.id === 'master'
                                    ? true
                                    : perms[r.id]?.[mod.id]?.actions?.[act.id] || false
                                }
                                onCheckedChange={(c) => updateAction(r.id, mod.id, act.id, c)}
                                disabled={r.id === 'master'}
                              />
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="bg-muted/20 border-t px-6 py-4 flex justify-end rounded-b-lg mt-4">
        <Button
          onClick={handleSave}
          disabled={saving || activeTab === 'master'}
          className="min-w-[150px] uppercase font-bold text-xs"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> SALVANDO...
            </>
          ) : (
            'SALVAR PERMISSÕES'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
