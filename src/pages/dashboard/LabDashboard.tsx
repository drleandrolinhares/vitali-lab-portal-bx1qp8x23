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
import { MoreHorizontal, Eye, Play, Check, Package } from 'lucide-react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { OrderStatus } from '@/lib/types'

export function LabDashboard() {
  const { orders, updateOrderStatus } = useAppStore()
  const activeOrders = orders.filter((o) => o.status !== 'delivered')

  const changeStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status, `Status atualizado para ${status} pela recepção.`)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Caixa de Entrada</h2>
        <p className="text-muted-foreground">
          Gerenciamento central de pedidos recebidos das clínicas.
        </p>
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
                  <TableCell className="font-medium">{order.friendlyId}</TableCell>
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
                        {order.status === 'pending' && (
                          <DropdownMenuItem onClick={() => changeStatus(order.id, 'in_production')}>
                            <Play className="mr-2 h-4 w-4" /> Iniciar Produção
                          </DropdownMenuItem>
                        )}
                        {order.status === 'in_production' && (
                          <DropdownMenuItem onClick={() => changeStatus(order.id, 'completed')}>
                            <Check className="mr-2 h-4 w-4" /> Marcar Concluído
                          </DropdownMenuItem>
                        )}
                        {order.status === 'completed' && (
                          <DropdownMenuItem onClick={() => changeStatus(order.id, 'delivered')}>
                            <Package className="mr-2 h-4 w-4" /> Registrar Entrega
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
    </div>
  )
}
