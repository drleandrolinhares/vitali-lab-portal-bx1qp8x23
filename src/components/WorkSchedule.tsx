import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Loader2, Save } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function WorkSchedule() {
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const fetchStaff = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'dentist')
      .eq('is_active', true)
      .order('name', { ascending: true })
    if (data) setStaff(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleUpdate = (id: string, field: string, value: string) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const saveSchedule = async (user: any) => {
    setSaving(user.id)
    const { error } = await supabase
      .from('profiles')
      .update({
        work_start: user.work_start || null,
        lunch_start: user.lunch_start || null,
        lunch_end: user.lunch_end || null,
        work_end: user.work_end || null,
      })
      .eq('id', user.id)

    if (error) {
      toast({ title: 'Erro ao salvar escala', variant: 'destructive' })
    } else {
      toast({ title: 'Escala salva com sucesso' })
    }
    setSaving(null)
  }

  const calculateHours = (u: any) => {
    if (!u.work_start || !u.lunch_start || !u.lunch_end || !u.work_end) return '--'
    const toMins = (t: string) => {
      const [h, m] = t.split(':').map(Number)
      return h * 60 + (m || 0)
    }
    const wStart = toMins(u.work_start)
    const lStart = toMins(u.lunch_start)
    const lEnd = toMins(u.lunch_end)
    const wEnd = toMins(u.work_end)

    const total = wEnd - wStart - (lEnd - lStart)
    if (total <= 0 || isNaN(total)) return '--'
    const h = Math.floor(total / 60)
    const m = total % 60
    return `${h}h ${m.toString().padStart(2, '0')}m`
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Gerencie a jornada de trabalho da equipe do laboratório (exclui dentistas e usuários
          inativos).
        </p>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Ida Almoço</TableHead>
              <TableHead>Volta Almoço</TableHead>
              <TableHead>Saída</TableHead>
              <TableHead className="text-center">Total Diário</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Carregando equipe...
                </TableCell>
              </TableRow>
            ) : staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Nenhum colaborador encontrado.
                </TableCell>
              </TableRow>
            ) : (
              staff.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium whitespace-nowrap">{user.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {user.job_function || user.role}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.personal_phone ||
                        (user.email?.includes('@vitalilab.local') ? 'Sem email' : user.email)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={user.work_start || ''}
                      onChange={(e) => handleUpdate(user.id, 'work_start', e.target.value)}
                      className="w-[110px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={user.lunch_start || ''}
                      onChange={(e) => handleUpdate(user.id, 'lunch_start', e.target.value)}
                      className="w-[110px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={user.lunch_end || ''}
                      onChange={(e) => handleUpdate(user.id, 'lunch_end', e.target.value)}
                      className="w-[110px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={user.work_end || ''}
                      onChange={(e) => handleUpdate(user.id, 'work_end', e.target.value)}
                      className="w-[110px]"
                    />
                  </TableCell>
                  <TableCell className="text-center font-semibold text-primary whitespace-nowrap">
                    {calculateHours(user)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => saveSchedule(user)}
                      disabled={saving === user.id}
                    >
                      {saving === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 text-emerald-600" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
