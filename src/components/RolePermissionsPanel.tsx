import { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/main'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { PERMISSION_OPTIONS } from '@/components/UsersManagement'

export function RolePermissionsPanel() {
  const { appSettings, updateSetting } = useAppStore()
  const [perms, setPerms] = useState<any>({ admin: [], receptionist: [], dentist: [] })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (appSettings?.role_permissions) {
      try {
        setPerms(JSON.parse(appSettings.role_permissions))
      } catch (e) {
        console.error('Failed to parse role_permissions', e)
      }
    }
  }, [appSettings])

  const handleToggle = (role: string, id: string) => {
    setPerms((prev: any) => {
      const rolePerms = prev[role] || []
      const has = rolePerms.includes(id)
      return {
        ...prev,
        [role]: has ? rolePerms.filter((p: string) => p !== id) : [...rolePerms, id],
      }
    })
  }

  const handleSelectAll = (role: string) => {
    setPerms((prev: any) => {
      const allIds = PERMISSION_OPTIONS.map((p) => p.id)
      const isAll = prev[role]?.length === allIds.length
      return {
        ...prev,
        [role]: isAll ? [] : allIds,
      }
    })
  }

  const save = async () => {
    setSaving(true)
    await updateSetting('role_permissions', JSON.stringify(perms))
    setSaving(false)
    toast({ title: 'PERMISSÕES SALVAS COM SUCESSO' })
  }

  return (
    <Card className="shadow-subtle">
      <CardHeader>
        <CardTitle className="uppercase">HIERARQUIA DE PERMISSÕES</CardTitle>
        <CardDescription className="uppercase text-xs font-semibold">
          DEFINA O ACESSO PADRÃO PARA CADA PERFIL DO SISTEMA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="uppercase text-xs font-bold">MÓDULO</TableHead>
              <TableHead className="text-center uppercase text-xs font-bold">
                <div className="flex flex-col items-center gap-2">
                  <span>ADMINISTRADOR</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAll('admin')}
                    className="uppercase text-[10px] h-6 px-2"
                  >
                    TUDO
                  </Button>
                </div>
              </TableHead>
              <TableHead className="text-center uppercase text-xs font-bold">
                <div className="flex flex-col items-center gap-2">
                  <span>RECEPÇÃO / PRODUÇÃO</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAll('receptionist')}
                    className="uppercase text-[10px] h-6 px-2"
                  >
                    TUDO
                  </Button>
                </div>
              </TableHead>
              <TableHead className="text-center uppercase text-xs font-bold">
                <div className="flex flex-col items-center gap-2">
                  <span>DENTISTA</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAll('dentist')}
                    className="uppercase text-[10px] h-6 px-2"
                  >
                    TUDO
                  </Button>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PERMISSION_OPTIONS.map((opt) => (
              <TableRow key={opt.id}>
                <TableCell className="font-bold text-xs uppercase">{opt.label}</TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={perms.admin?.includes(opt.id)}
                    onCheckedChange={() => handleToggle('admin', opt.id)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={perms.receptionist?.includes(opt.id)}
                    onCheckedChange={() => handleToggle('receptionist', opt.id)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={perms.dentist?.includes(opt.id)}
                    onCheckedChange={() => handleToggle('dentist', opt.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="bg-muted/20 border-t px-6 py-4 flex justify-end rounded-b-lg">
        <Button
          onClick={save}
          disabled={saving}
          className="min-w-[150px] uppercase font-bold text-xs"
        >
          {saving ? 'SALVANDO...' : 'SALVAR PERMISSÕES'}
        </Button>
      </CardFooter>
    </Card>
  )
}
