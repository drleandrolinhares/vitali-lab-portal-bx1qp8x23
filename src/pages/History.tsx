import { useAppStore } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/StatusBadge'
import { Input } from '@/components/ui/input'
import { Search, Loader2, MessageCircle } from 'lucide-react'
import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function HistoryPage() {
  const { orders, currentUser, checkPermission } = useAppStore()
  const [search, setSearch] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)
  const [dentistFilter, setDentistFilter] = useState<string>('all')

  const isCollaboratorOrAdmin = [
    'admin',
    'master',
    'receptionist',
    'technical_assistant',
    'financial',
    'relationship_manager',
  ].includes(currentUser?.role || '')

  const canSelectDentist = checkPermission('history', 'select_dentist') || isCollaboratorOrAdmin
  const canShowCompleted = checkPermission('history', 'show_completed') || isCollaboratorOrAdmin
  const canSearch = checkPermission('history', 'search') || isCollaboratorOrAdmin

  const availableDentists = useMemo(() => {
    const map = new Map<string, string>()
    orders.forEach((o) => {
      if (o.dentistId && o.dentistName) {
        map.set(o.dentistId, o.dentistName)
      }
    })
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [orders])

  if (!currentUser) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const filtered = orders.filter((o) => {
    if (canSearch && search.trim()) {
      const matchesSearch =
        o.patientName.toLowerCase().includes(search.toLowerCase()) ||
        o.friendlyId.toLowerCase().includes(search.toLowerCase())
      if (!matchesSearch) return false
    }

    if (canSelectDentist && dentistFilter !== 'all' && o.dentistId !== dentistFilter) return false

    const isFinished =
      o.status === 'completed' || o.status === 'delivered' || o.status === 'cancelled'

    if (isFinished && !showCompleted && (!canSearch || !search.trim())) {
      return false
    }

    return true
  })

  const showDentistCol = currentUser?.role !== 'dentist'

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary uppercase">
            {isCollaboratorOrAdmin ? 'Histórico Global' : 'Histórico de Pedidos'}
          </h2>
          <p className="text-muted-foreground">Consulte todos os casos registrados e arquivados.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {canSelectDentist && showDentistCol && (
            <Select value={dentistFilter} onValueChange={setDentistFilter}>
              <SelectTrigger className="w-full sm:w-[220px] h-10 bg-background shadow-sm border-border">
                <SelectValue placeholder="SELECIONAR DENTISTA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">TODOS OS DENTISTAS</SelectItem>
                {availableDentists.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {canShowCompleted && (
            <div className="flex items-center space-x-2 bg-background border px-3 py-2 rounded-md h-10 w-full sm:w-auto shadow-sm">
              <Switch
                id="show-completed"
                checked={showCompleted}
                onCheckedChange={setShowCompleted}
              />
              <Label
                htmlFor="show-completed"
                className="text-sm font-medium cursor-pointer whitespace-nowrap uppercase tracking-wider text-[10px]"
              >
                MOSTRAR CONCLUÍDOS
              </Label>
            </div>
          )}

          {canSearch && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="BUSCA POR PACIENTE/ID..."
                className="pl-9 h-10 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <Card className="shadow-subtle">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">ID</TableHead>
                {showDentistCol && <TableHead>Clínica/Dentista</TableHead>}
                <TableHead>Paciente</TableHead>
                <TableHead>Trabalho</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order, index) => (
                <TableRow key={`${order.id}-${index}`}>
                  <TableCell className="pl-6 font-medium">{order.friendlyId}</TableCell>
                  {showDentistCol && <TableCell>{order.dentistName}</TableCell>}
                  <TableCell>{order.patientName}</TableCell>
                  <TableCell>{order.workType}</TableCell>
                  <TableCell>{format(new Date(order.createdAt), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      {order.dentistGroupLink && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 hover:border-green-300"
                          asChild
                        >
                          <a
                            href={order.dentistGroupLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Contato via WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/order/${order.id}`}>Detalhes</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={showDentistCol ? 7 : 6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum pedido encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
