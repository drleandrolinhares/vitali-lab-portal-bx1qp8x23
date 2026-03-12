import { useState, useEffect } from 'react'
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
import { ShieldCheck, Loader2 } from 'lucide-react'

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
  { id: 'admin', label: 'ADMINISTRADOR' },
  { id: 'receptionist', label: 'RECEPCIONISTA' },
  { id: 'technical_assistant', label: 'AUX. TÉCNICO' },
  { id: 'financial', label: 'FINANCEIRO' },
  { id: 'relationship_manager', label: 'GESTÃO REL.' },
  { id: 'dentist', label: 'DENTISTA' },
]

export function RolePermissionsPanel() {
  const { appSettings, updateSetting } = useAppStore()
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
            {ROLES.map((r) => (
              <TabsTrigger
                key={r.id}
                value={r.id}
                className="uppercase text-xs font-bold whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 mr-2 rounded-md"
              >
                {r.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {ROLES.map((r) => (
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
                          checked={perms[r.id]?.[mod.id]?.access || false}
                          onCheckedChange={(c) => updateAccess(r.id, mod.id, c)}
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
                                checked={perms[r.id]?.[mod.id]?.actions?.[act.id] || false}
                                onCheckedChange={(c) => updateAction(r.id, mod.id, act.id, c)}
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
          disabled={saving}
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
