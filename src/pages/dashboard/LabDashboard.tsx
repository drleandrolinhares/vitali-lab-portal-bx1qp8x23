import { useState } from 'react'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Eye, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

export function LabDashboard() {
  const { orders, deleteOrder, currentUser } = useAppStore()
  const activeOrders = orders.filter((o) => o.status === 'pending')

  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null)
  const [deleteReason, setDeleteReason] = useState('')

  const handleDeleteConfirm = async () => {
    if (deleteOrderId && deleteReason.trim()) {
      await deleteOrder(deleteOrderId, deleteReason.trim())
      setDeleteOrderId(null)
      setDeleteReason('')
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-border/50">
        <Logo variant="square" size="lg" className="hidden sm:flex" />
        <div>
          <Logo variant="square" size="sm" className="sm:hidden mb-4" />
          <h2 className="text-3xl font-bold tracking-tight">Caixa de Entrada</h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Gerenciamento central de pedidos recebidos das clínicas (Visão Consolidada).
          </p>
        </div>
      </div>

      <Card className="shadow-subtle">
        <CardHeader className="pb-3">
          <CardTitle>Fila de Produção</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Clínica/Dentista</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Trabalho</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeOrders.map((order) => (
                <TableRow key={order.id} className="group cursor-default">
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-1">
                      <span>{order.friendlyId}</span>
                      <Badge
                        variant="outline"
                        className={`w-fit text-[9px] uppercase leading-none tracking-wider px-1.5 py-0.5 ${order.sector === 'Studio Acrílico' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
                      >
                        {order.sector}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{order.dentistName}</TableCell>
                  <TableCell>{order.patientName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.workType}</span>
                      <span className="text-xs text-muted-foreground">{order.material}</span>
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(order.createdAt), 'dd/MM HH:mm')}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/order/${order.id}`}
                            className="flex items-center w-full cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                          </Link>
                        </DropdownMenuItem>
                        {currentUser?.role === 'admin' && (
                          <DropdownMenuItem
                            onClick={() => {
                              setDeleteOrderId(order.id)
                              setDeleteReason('')
                            }}
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir Pedido
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {activeOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Fila de produção vazia.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!deleteOrderId} onOpenChange={(o) => !o && setDeleteOrderId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão de Pedido</DialogTitle>
            <DialogDescription>
              Esta ação removerá o pedido permanentemente e excluirá seus dados de todas as métricas
              do sistema. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Motivo da Exclusão <span className="text-destructive">*</span>
            </h4>
            <Textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Ex: Lançamento duplicado, cancelado pelo dentista antes do envio..."
              className="min-h-[100px] resize-none"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOrderId(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={!deleteReason.trim()}
            >
              Excluir Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
