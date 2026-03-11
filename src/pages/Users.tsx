import { useAppStore } from '@/stores/main'
import { UsersManagement } from '@/components/UsersManagement'
import { RolePermissionsPanel } from '@/components/RolePermissionsPanel'

export default function UsersPage() {
  const { currentUser } = useAppStore()
  const isMaster = currentUser?.role === ('master' as any)

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1 mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-primary uppercase">
          GESTÃO DE USUÁRIOS
        </h2>
        <p className="text-muted-foreground uppercase text-xs font-bold mt-1">
          GERENCIE ACESSOS, DENTISTAS E A EQUIPE DE COLABORADORES DO LABORATÓRIO.
        </p>
      </div>

      <UsersManagement />

      {isMaster && (
        <div className="pt-8 space-y-4 animate-fade-in-up">
          <RolePermissionsPanel />
        </div>
      )}
    </div>
  )
}
