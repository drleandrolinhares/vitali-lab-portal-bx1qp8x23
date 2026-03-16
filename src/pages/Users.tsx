import { useAppStore } from '@/stores/main'
import { UsersManagement } from '@/components/UsersManagement'
import { RolePermissionsPanel } from '@/components/RolePermissionsPanel'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function UsersPage() {
  const { currentUser } = useAppStore()
  const isMaster = currentUser?.role === 'master'

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1 mb-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground uppercase">RH</h2>
        <p className="text-muted-foreground uppercase text-sm font-semibold mt-1">
          GESTÃO CONSOLIDADA DE EQUIPE E USUÁRIOS DO SISTEMA.
        </p>
      </div>

      <Tabs defaultValue="equipe" className="w-full">
        <TabsList className="bg-transparent h-auto p-0 flex gap-2 overflow-x-auto scrollbar-hide mb-6">
          <TabsTrigger
            value="equipe"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border rounded-md px-6 py-2.5 font-semibold text-sm transition-all"
          >
            SISTEMA E USUÁRIOS
          </TabsTrigger>
          <TabsTrigger
            value="onboarding"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border rounded-md px-6 py-2.5 font-semibold text-sm text-muted-foreground transition-all"
          >
            ONBOARDING
          </TabsTrigger>
          <TabsTrigger
            value="rotinas"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border rounded-md px-6 py-2.5 font-semibold text-sm text-muted-foreground transition-all"
          >
            ROTINAS / POPS
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <UsersManagement />

      {isMaster && (
        <div className="pt-8 space-y-4 animate-fade-in-up">
          <RolePermissionsPanel />
        </div>
      )}
    </div>
  )
}
