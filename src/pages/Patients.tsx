import { useState, useMemo } from 'react'
import { useAppStore } from '@/stores/main'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Contact, Search, Stethoscope, Activity } from 'lucide-react'
import { StatusBadge } from '@/components/StatusBadge'

export default function Patients() {
  const { orders } = useAppStore()
  const [search, setSearch] = useState('')
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)

  const patients = useMemo(() => {
    const map = new Map<string, any>()
    orders.forEach((o) => {
      const key = o.patientCpf
        ? `cpf_${o.patientCpf}`
        : `name_${o.patientName.toLowerCase().trim()}`
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: o.patientName,
          cpf: o.patientCpf,
          birthDate: o.patientBirthDate,
          dentists: new Map(),
          orders: [],
        })
      }
      const p = map.get(key)
      if (o.patientName.length > p.name.length) p.name = o.patientName
      if (o.patientCpf) p.cpf = o.patientCpf
      if (o.patientBirthDate) p.birthDate = o.patientBirthDate

      if (!p.dentists.has(o.dentistId)) {
        p.dentists.set(o.dentistId, { id: o.dentistId, name: o.dentistName })
      }
      p.orders.push(o)
    })
    return Array.from(map.values())
      .map((p) => ({
        ...p,
        dentists: Array.from(p.dentists.values()),
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [orders])

  const filteredPatients = patients.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.cpf?.includes(search),
  )

  const selectedPatient = selectedPatientId
    ? patients.find((p) => p.id === selectedPatientId)
    : null

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Contact className="w-6 h-6" /> Gestão de Pacientes
          </h1>
          <p className="text-muted-foreground">Listagem centralizada e histórico de pacientes.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="shadow-subtle border-muted/60">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Nascimento</TableHead>
              <TableHead className="text-center">Dentistas</TableHead>
              <TableHead className="text-center">Total Pedidos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Nenhum paciente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((p) => (
                <TableRow
                  key={p.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedPatientId(p.id)}
                >
                  <TableCell className="font-medium text-primary">{p.name}</TableCell>
                  <TableCell>
                    {p.cpf || <span className="text-muted-foreground/50">-</span>}
                  </TableCell>
                  <TableCell>
                    {p.birthDate ? (
                      format(new Date(p.birthDate + 'T00:00:00'), 'dd/MM/yyyy')
                    ) : (
                      <span className="text-muted-foreground/50">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-muted/50">
                      {p.dentists.length}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{p.orders.length}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Sheet
        open={!!selectedPatientId}
        onOpenChange={(open) => !open && setSelectedPatientId(null)}
      >
        {selectedPatient && (
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl">{selectedPatient.name}</SheetTitle>
              <SheetDescription>Detalhes e histórico consolidado deste paciente.</SheetDescription>
            </SheetHeader>

            <div className="space-y-6">
              <div className="flex gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-semibold uppercase">CPF</p>
                  <p className="font-medium text-base">{selectedPatient.cpf || 'Não informado'}</p>
                </div>
                <div className="w-px bg-border"></div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-semibold uppercase">
                    Data de Nascimento
                  </p>
                  <p className="font-medium text-base">
                    {selectedPatient.birthDate
                      ? format(new Date(selectedPatient.birthDate + 'T00:00:00'), 'dd/MM/yyyy')
                      : 'Não informada'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" /> Dentistas Vinculados
                </h3>
                <div className="grid gap-2">
                  {selectedPatient.dentists.map((d: any) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between p-3 border rounded-md bg-background"
                    >
                      <span className="font-medium text-sm">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Histórico de Pedidos (
                  {selectedPatient.orders.length})
                </h3>
                <div className="space-y-3">
                  {selectedPatient.orders.map((o: any) => (
                    <div key={o.id} className="p-4 border rounded-lg bg-background space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{o.friendlyId}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(o.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                          </p>
                        </div>
                        <StatusBadge status={o.status} className="text-[10px] px-2 py-0.5" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t">
                        <div className="text-xs">
                          <span className="text-muted-foreground block mb-0.5">Trabalho</span>
                          <span className="font-medium">{o.workType}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground block mb-0.5">Dentista</span>
                          <span className="font-medium">{o.dentistName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  )
}
