import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'
import { Navigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ShieldCheck, Calendar, Activity, User, Info } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AuditLog } from '@/lib/types'

export default function AuditTrail() {
  const { currentUser } = useAppStore()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'master') return

    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profiles (name)
        `)
        .order('created_at', { ascending: false })
        .limit(200)

      if (!error && data) {
        setLogs(data as unknown as AuditLog[])
      }
      setLoading(false)
    }

    fetchLogs()
  }, [currentUser])

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'master') {
    return <Navigate to="/" replace />
  }

  const formatAction = (action: string) => {
    const map: Record<string, string> = {
      CREATE: 'Criação',
      DELETE: 'Exclusão',
      UPDATE_STATUS: 'Mudança de Status',
      MOVE_STAGE: 'Movimentação Kanban',
      CREATE_STAGE: 'Criação de Coluna',
      RENAME_STAGE: 'Renomear Coluna',
      DELETE_STAGE: 'Exclusão de Coluna',
      UPDATE_OBSERVATIONS: 'Observações Atualizadas',
      UPDATE_SETTING: 'Configuração Atualizada',
      UPDATE_PROFILE: 'Perfil Atualizado',
    }
    return map[action] || action
  }

  const renderDetails = (details: Record<string, any>) => {
    if (!details || Object.keys(details).length === 0) return '-'
    const items = []
    if (details.friendlyId) items.push(`Pedido: ${details.friendlyId}`)
    if (details.reason) items.push(`Motivo: ${details.reason}`)
    if (details.status) items.push(`Novo Status: ${details.status}`)
    if (details.to) items.push(`Destino: ${details.to}`)

    if (items.length > 0) return items.join(' | ')
    return (
      JSON.stringify(details).substring(0, 60) + (JSON.stringify(details).length > 60 ? '...' : '')
    )
  }

  const getActionColor = (action: string) => {
    if (action.includes('DELETE')) return 'text-destructive bg-destructive/10'
    if (action.includes('CREATE')) return 'text-emerald-600 bg-emerald-500/10'
    return 'text-blue-600 bg-blue-500/10'
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 uppercase">
            <ShieldCheck className="w-6 h-6" /> Log de Auditoria
          </h2>
          <p className="text-muted-foreground mt-1">
            Registro de segurança com histórico de ações sistêmicas.
          </p>
        </div>
      </div>

      <Card className="shadow-subtle">
        <CardHeader className="bg-muted/10 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Histórico Recente (últimos 200 eventos)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground animate-pulse">
              Carregando auditoria...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Data / Hora</TableHead>
                  <TableHead className="w-[200px]">Usuário</TableHead>
                  <TableHead className="w-[180px]">Ação</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="group">
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(log.created_at), 'dd MMM yyyy', { locale: ptBR })}
                      </span>
                      <span className="pl-4.5">{format(new Date(log.created_at), 'HH:mm:ss')}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium">
                        <User className="w-4 h-4 text-slate-400" />
                        {log.profiles?.name || 'Desconhecido'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getActionColor(log.action)}`}
                      >
                        {formatAction(log.action)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 text-slate-400 shrink-0 hidden sm:block" />
                        <span
                          className="break-words line-clamp-2"
                          title={renderDetails(log.details)}
                        >
                          {renderDetails(log.details)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      Nenhum registro encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
