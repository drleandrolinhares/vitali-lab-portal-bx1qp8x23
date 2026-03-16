import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'
import { Link } from 'react-router-dom'
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  addMinutes,
  isBefore,
  parse,
  addWeeks,
  subWeeks,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription as DialogDesc,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from '@/hooks/use-toast'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ScanLine,
  Loader2,
  Trash2,
  Clock,
  CalendarIcon,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Booking {
  id: string
  dentist_id: string
  patient_name: string
  booking_date: string
  start_time: string
  end_time: string
  status: string
  notes: string
  profiles?: { name: string }
}

interface ScanSetting {
  id: string
  day_of_week: number
  is_available: boolean
  start_time: string
  end_time: string
  slot_duration_minutes: number
}

interface ScanBlock {
  id: string
  start_time: string
  end_time: string
  block_date: string | null
  recurrence: 'unique' | 'daily' | 'weekly' | 'monthly'
}

export default function ScanService() {
  const { currentUser } = useAppStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [settings, setSettings] = useState<ScanSetting[]>([])
  const [blocks, setBlocks] = useState<ScanBlock[]>([])
  const [dentists, setDentists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const isStaff = [
    'admin',
    'master',
    'receptionist',
    'technical_assistant',
    'financial',
    'relationship_manager',
  ].includes(currentUser?.role || '')

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === ('master' as any)

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i))

  const fetchAgenda = async () => {
    setLoading(true)
    const start = format(days[0], 'yyyy-MM-dd')
    const end = format(days[6], 'yyyy-MM-dd')

    const [bookRes, setRes, dentRes, blockRes] = await Promise.all([
      supabase
        .from('scan_service_bookings' as any)
        .select('*, profiles(name)')
        .gte('booking_date', start)
        .lte('booking_date', end),
      supabase
        .from('scan_service_settings' as any)
        .select('*')
        .order('day_of_week'),
      isStaff
        ? supabase
            .from('profiles')
            .select('id, name')
            .in('role', ['dentist', 'laboratory'])
            .eq('is_active', true)
            .order('name')
        : Promise.resolve({ data: [] }),
      supabase.from('scan_service_blocks' as any).select('*'),
    ])

    if (bookRes.data) setBookings(bookRes.data as Booking[])
    if (setRes.data) setSettings(setRes.data as ScanSetting[])
    if (dentRes.data) setDentists(dentRes.data)
    if (blockRes.data) setBlocks(blockRes.data as ScanBlock[])
    setLoading(false)
  }

  useEffect(() => {
    fetchAgenda()
  }, [currentDate, isStaff])

  const [modal, setModal] = useState({ open: false, mode: 'create', booking: null as any })
  const [formData, setFormData] = useState({
    dentist_id: currentUser?.id || '',
    patient_name: '',
    booking_date: '',
    start_time: '',
    end_time: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)

  const checkBlockOverlap = (slotStart: string, slotEnd: string, dateStr: string) => {
    return blocks.find((b) => {
      const bStart = b.start_time.substring(0, 5)
      const bEnd = b.end_time.substring(0, 5)
      const timeOverlap = bStart < slotEnd && bEnd > slotStart

      if (!timeOverlap) return false

      if (b.recurrence === 'daily') return true
      if (b.recurrence === 'unique' && b.block_date === dateStr) return true

      if (b.block_date) {
        const targetDate = new Date(dateStr + 'T00:00:00')
        const blockDate = new Date(b.block_date + 'T00:00:00')

        if (b.recurrence === 'weekly' && targetDate.getDay() === blockDate.getDay()) return true
        if (b.recurrence === 'monthly' && targetDate.getDate() === blockDate.getDate()) return true
      }
      return false
    })
  }

  const handleOpenModal = (slot?: any, booking?: any) => {
    if (booking) {
      if (!isStaff && booking.dentist_id !== currentUser?.id) return
      setFormData({
        dentist_id: booking.dentist_id,
        patient_name: booking.patient_name,
        booking_date: booking.booking_date,
        start_time: booking.start_time.substring(0, 5),
        end_time: booking.end_time.substring(0, 5),
        notes: booking.notes || '',
      })
      setModal({ open: true, mode: 'edit', booking })
    } else if (slot) {
      setFormData({
        dentist_id: isStaff ? '' : currentUser?.id || '',
        patient_name: '',
        booking_date: slot.date,
        start_time: slot.start,
        end_time: slot.end,
        notes: '',
      })
      setModal({ open: true, mode: 'create', booking: null })
    } else {
      setFormData({
        dentist_id: isStaff ? '' : currentUser?.id || '',
        patient_name: '',
        booking_date: format(new Date(), 'yyyy-MM-dd'),
        start_time: '08:00',
        end_time: '09:00',
        notes: '',
      })
      setModal({ open: true, mode: 'create', booking: null })
    }
  }

  const checkOverlap = (start: string, end: string, date: string, excludeId?: string) => {
    const dayBookings = bookings.filter((b) => b.booking_date === date && b.id !== excludeId)
    return dayBookings.some(
      (b) => b.start_time.substring(0, 5) < end && b.end_time.substring(0, 5) > start,
    )
  }

  const handleSaveBooking = async () => {
    if (
      !formData.patient_name ||
      !formData.booking_date ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.dentist_id
    ) {
      return toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' })
    }

    if (formData.start_time >= formData.end_time) {
      return toast({ title: 'O horário de fim deve ser após o início', variant: 'destructive' })
    }

    if (
      checkOverlap(formData.start_time, formData.end_time, formData.booking_date, modal.booking?.id)
    ) {
      return toast({
        title: 'Horário Indisponível',
        description: 'Já existe um agendamento neste horário.',
        variant: 'destructive',
      })
    }

    if (checkBlockOverlap(formData.start_time, formData.end_time, formData.booking_date)) {
      return toast({
        title: 'Horário Indisponível',
        description: 'SCAN SERVICE INDISPONÍVEL NESTE HORÁRIO.',
        variant: 'destructive',
      })
    }

    setSaving(true)
    const payload = {
      dentist_id: formData.dentist_id,
      patient_name: formData.patient_name,
      booking_date: formData.booking_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      notes: formData.notes,
    }

    if (modal.mode === 'edit') {
      await supabase
        .from('scan_service_bookings' as any)
        .update(payload)
        .eq('id', modal.booking.id)
      toast({ title: 'Agendamento atualizado!' })
    } else {
      await supabase.from('scan_service_bookings' as any).insert(payload)
      toast({ title: 'Agendamento confirmado!' })
    }
    setSaving(false)
    setModal({ open: false, mode: 'create', booking: null })
    fetchAgenda()
  }

  const handleDeleteBooking = async () => {
    if (!confirm('Deseja excluir este agendamento?')) return
    setSaving(true)
    await supabase
      .from('scan_service_bookings' as any)
      .delete()
      .eq('id', modal.booking.id)
    toast({ title: 'Agendamento excluído!' })
    setSaving(false)
    setModal({ open: false, mode: 'create', booking: null })
    fetchAgenda()
  }

  const generateTimeSlots = (setting: ScanSetting) => {
    const slots = []
    if (!setting || !setting.is_available) return slots

    let current = parse(setting.start_time, 'HH:mm:ss', new Date())
    const end = parse(setting.end_time, 'HH:mm:ss', new Date())

    while (isBefore(current, end)) {
      const next = addMinutes(current, setting.slot_duration_minutes)
      slots.push({
        start: format(current, 'HH:mm'),
        end: format(next, 'HH:mm'),
      })
      current = next
    }
    return slots
  }

  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1))
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1))

  const [configSettings, setConfigSettings] = useState<ScanSetting[]>([])
  const [savingConfig, setSavingConfig] = useState(false)

  const [blockForm, setBlockForm] = useState({
    block_date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '08:00',
    end_time: '12:00',
    recurrence: 'unique',
  })
  const [savingBlock, setSavingBlock] = useState(false)

  useEffect(() => {
    if (settings.length > 0) setConfigSettings([...settings])
  }, [settings])

  const handleSaveConfig = async () => {
    setSavingConfig(true)
    for (const s of configSettings) {
      await supabase
        .from('scan_service_settings' as any)
        .update({
          is_available: s.is_available,
          start_time: s.start_time,
          end_time: s.end_time,
          slot_duration_minutes: s.slot_duration_minutes,
        })
        .eq('id', s.id)
    }
    toast({ title: 'Configurações salvas!' })
    setSavingConfig(false)
    fetchAgenda()
  }

  const handleAddBlock = async () => {
    if (!blockForm.block_date && blockForm.recurrence !== 'daily') {
      return toast({ title: 'Selecione a data de referência.', variant: 'destructive' })
    }
    if (blockForm.start_time >= blockForm.end_time) {
      return toast({ title: 'O horário de fim deve ser após o início.', variant: 'destructive' })
    }
    setSavingBlock(true)
    const { error } = await supabase.from('scan_service_blocks' as any).insert({
      start_time: blockForm.start_time + ':00',
      end_time: blockForm.end_time + ':00',
      block_date: blockForm.block_date || null,
      recurrence: blockForm.recurrence,
    })
    setSavingBlock(false)
    if (error) {
      toast({ title: 'Erro ao criar bloqueio', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Bloqueio criado com sucesso!' })
      fetchAgenda()
    }
  }

  const handleDeleteBlock = async (id: string) => {
    if (!confirm('Deseja remover este bloqueio?')) return
    await supabase
      .from('scan_service_blocks' as any)
      .delete()
      .eq('id', id)
    fetchAgenda()
  }

  const recurrenceLabels: Record<string, string> = {
    unique: 'Único',
    daily: 'Diário',
    weekly: 'Semanal',
    monthly: 'Mensal',
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-12 print:max-w-none">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <ScanLine className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary uppercase">
              Scan Service
            </h2>
            <p className="text-muted-foreground text-sm">
              Agende e gerencie o serviço de escaneamento intraoral.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
          <Button
            asChild
            variant="outline"
            className="border-yellow-500 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-600/50 dark:text-yellow-500 dark:hover:bg-yellow-950/30 gap-2 w-full sm:w-auto"
          >
            <Link to="/new-request?type=adjustment">
              <RefreshCw className="w-4 h-4" />
              Retorno <span className="hidden md:inline">para Ajustes</span>
            </Link>
          </Button>
          <Button onClick={() => handleOpenModal()} className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Nova Reserva
          </Button>
        </div>
      </div>

      <div className="hidden print:block mb-6">
        <h2 className="text-2xl font-bold">Agenda Scan Service</h2>
        <p className="text-muted-foreground">
          Semana: {format(days[0], 'dd/MM/yyyy')} a {format(days[6], 'dd/MM/yyyy')}
        </p>
      </div>

      <Tabs defaultValue="agenda" className="w-full">
        <TabsList className="mb-4 print:hidden">
          <TabsTrigger value="agenda" className="uppercase text-xs font-bold tracking-wider">
            Agenda Semanal
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="config" className="uppercase text-xs font-bold tracking-wider">
              Configurações
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="agenda">
          <Card className="shadow-subtle border-muted/60 overflow-hidden print:shadow-none print:border-none">
            <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between print:hidden">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={prevWeek}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex flex-col items-center min-w-[150px]">
                  <span className="font-bold text-lg uppercase">
                    {format(weekStart, 'MMMM yyyy', { locale: ptBR })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(days[0], 'dd/MM')} - {format(days[6], 'dd/MM')}
                  </span>
                </div>
                <Button variant="outline" size="icon" onClick={nextWeek}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                onClick={() => setCurrentDate(new Date())}
                className="text-xs uppercase font-bold"
              >
                Hoje
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto print:overflow-visible">
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="min-w-[900px] grid grid-cols-7 divide-x divide-border print:min-w-full">
                  {days.map((day, idx) => {
                    const isToday = isSameDay(day, new Date())
                    const dateStr = format(day, 'yyyy-MM-dd')
                    const dayBookings = bookings.filter((b) => b.booking_date === dateStr)
                    const setting = settings.find((s) => s.day_of_week === day.getDay())
                    const slots = setting ? generateTimeSlots(setting) : []

                    return (
                      <div
                        key={idx}
                        className={cn('flex flex-col print:border-r', isToday && 'bg-primary/5')}
                      >
                        <div
                          className={cn(
                            'p-3 text-center border-b border-border',
                            isToday && 'border-primary/20 bg-primary/10',
                          )}
                        >
                          <p
                            className={cn(
                              'text-xs font-bold uppercase',
                              isToday ? 'text-primary' : 'text-muted-foreground print:text-black',
                            )}
                          >
                            {format(day, 'EEEE', { locale: ptBR })}
                          </p>
                          <p
                            className={cn(
                              'text-xl font-black mt-1',
                              isToday ? 'text-primary' : 'text-foreground print:text-black',
                            )}
                          >
                            {format(day, 'dd')}
                          </p>
                        </div>
                        <div className="p-2 space-y-2 flex-1 min-h-[400px]">
                          {!setting?.is_available ? (
                            <div className="h-full flex items-center justify-center text-xs text-muted-foreground uppercase text-center opacity-50 p-4 font-bold border-2 border-dashed border-border rounded-lg bg-muted/20 print:border-none">
                              Fechado
                            </div>
                          ) : (
                            slots.map((slot, sIdx) => {
                              const overlappingBlock = checkBlockOverlap(
                                slot.start,
                                slot.end,
                                dateStr,
                              )
                              if (overlappingBlock) {
                                return (
                                  <div
                                    key={sIdx}
                                    title="SCAN SERVICE INDISPONÍVEL NESTE HORÁRIO"
                                    className="text-[10px] p-2 rounded-md shadow-sm bg-slate-800 text-white flex items-center justify-center text-center font-bold uppercase leading-tight cursor-not-allowed opacity-90 print:hidden"
                                  >
                                    Indisponível
                                    <br />
                                    Neste Horário
                                  </div>
                                )
                              }

                              const overlappingBooking = dayBookings.find(
                                (b) =>
                                  (b.start_time.substring(0, 5) <= slot.start &&
                                    b.end_time.substring(0, 5) > slot.start) ||
                                  (b.start_time.substring(0, 5) < slot.end &&
                                    b.end_time.substring(0, 5) >= slot.end) ||
                                  (b.start_time.substring(0, 5) >= slot.start &&
                                    b.end_time.substring(0, 5) <= slot.end),
                              )

                              if (overlappingBooking) {
                                const isMine = overlappingBooking.dentist_id === currentUser?.id
                                const canViewDetails = isStaff || isMine

                                return (
                                  <div
                                    key={sIdx}
                                    onClick={() => handleOpenModal(null, overlappingBooking)}
                                    className={cn(
                                      'text-xs p-2 rounded-md border shadow-sm select-none transition-colors relative group print:shadow-none print:border-black',
                                      canViewDetails
                                        ? 'bg-primary/10 text-primary-foreground border-primary/20 cursor-pointer hover:bg-primary/20'
                                        : 'bg-muted text-muted-foreground border-border cursor-not-allowed opacity-80',
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        'absolute left-0 top-0 bottom-0 w-1 rounded-l-md',
                                        canViewDetails ? 'bg-primary' : 'bg-slate-300',
                                      )}
                                    />
                                    <div className="pl-1">
                                      <p className="font-bold text-foreground flex items-center gap-1 mb-0.5">
                                        <Clock className="w-3 h-3 opacity-70" />
                                        {slot.start} - {slot.end}
                                      </p>
                                      <p className="font-semibold text-slate-800 truncate">
                                        {canViewDetails
                                          ? overlappingBooking.patient_name
                                          : 'INDISPONÍVEL'}
                                      </p>
                                      {canViewDetails && isStaff && (
                                        <p className="truncate text-slate-500 text-[10px] mt-0.5 font-medium uppercase">
                                          {overlappingBooking.profiles?.name}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )
                              }

                              return (
                                <div
                                  key={sIdx}
                                  onClick={() =>
                                    handleOpenModal({
                                      date: dateStr,
                                      start: slot.start,
                                      end: slot.end,
                                    })
                                  }
                                  className="text-xs p-2 rounded-md border border-dashed border-border bg-transparent text-muted-foreground hover:bg-primary/5 hover:border-primary/30 hover:text-primary cursor-pointer transition-colors text-center font-medium print:hidden"
                                >
                                  {slot.start} - {slot.end}
                                </div>
                              )
                            })
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="config">
            <Card className="shadow-subtle max-w-4xl mx-auto mb-6">
              <CardHeader>
                <CardTitle className="uppercase">Horários de Atendimento</CardTitle>
                <CardDescription>
                  Configure os dias e horários em que o serviço de Scan está disponível.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {configSettings.map((s, idx) => (
                  <div
                    key={s.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-muted/10"
                  >
                    <div className="w-full sm:w-32 flex items-center gap-3">
                      <Switch
                        checked={s.is_available}
                        onCheckedChange={(v) => {
                          const newArr = [...configSettings]
                          newArr[idx].is_available = v
                          setConfigSettings(newArr)
                        }}
                      />
                      <Label className="font-bold uppercase text-sm">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][s.day_of_week]}
                      </Label>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                          Início
                        </Label>
                        <Input
                          type="time"
                          disabled={!s.is_available}
                          value={s.start_time.substring(0, 5)}
                          onChange={(e) => {
                            const newArr = [...configSettings]
                            newArr[idx].start_time = e.target.value + ':00'
                            setConfigSettings(newArr)
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                          Fim
                        </Label>
                        <Input
                          type="time"
                          disabled={!s.is_available}
                          value={s.end_time.substring(0, 5)}
                          onChange={(e) => {
                            const newArr = [...configSettings]
                            newArr[idx].end_time = e.target.value + ':00'
                            setConfigSettings(newArr)
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                          Duração (Min)
                        </Label>
                        <Input
                          type="number"
                          disabled={!s.is_available}
                          placeholder="Minutos"
                          value={s.slot_duration_minutes}
                          onChange={(e) => {
                            const newArr = [...configSettings]
                            newArr[idx].slot_duration_minutes = parseInt(e.target.value) || 60
                            setConfigSettings(newArr)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="bg-muted/20 border-t py-4">
                <Button onClick={handleSaveConfig} disabled={savingConfig} className="ml-auto">
                  {savingConfig ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-subtle max-w-4xl mx-auto border-slate-300">
              <CardHeader className="bg-slate-50/50">
                <CardTitle className="uppercase text-slate-800">Bloquear Agendamentos</CardTitle>
                <CardDescription>
                  Defina horários indisponíveis para o serviço de Scan (ex: Almoço, Manutenções,
                  Feriados).
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end mb-8 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="space-y-2 sm:col-span-1">
                    <Label className="uppercase text-[10px] font-bold text-slate-500">
                      Recorrência
                    </Label>
                    <Select
                      value={blockForm.recurrence}
                      onValueChange={(v) => setBlockForm({ ...blockForm, recurrence: v as any })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unique">Data Única</SelectItem>
                        <SelectItem value="daily">Diário (Todos os dias)</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-1">
                    <Label className="uppercase text-[10px] font-bold text-slate-500">
                      Data Base
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal bg-background px-3',
                            !blockForm.block_date && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                          {blockForm.block_date ? (
                            format(new Date(blockForm.block_date + 'T00:00:00'), 'dd/MM/yyyy')
                          ) : (
                            <span>Selecione</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            blockForm.block_date
                              ? new Date(blockForm.block_date + 'T00:00:00')
                              : undefined
                          }
                          onSelect={(d) =>
                            d && setBlockForm({ ...blockForm, block_date: format(d, 'yyyy-MM-dd') })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2 sm:col-span-1">
                    <Label className="uppercase text-[10px] font-bold text-slate-500">
                      Hora Início
                    </Label>
                    <Input
                      type="time"
                      value={blockForm.start_time}
                      onChange={(e) => setBlockForm({ ...blockForm, start_time: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-1">
                    <Label className="uppercase text-[10px] font-bold text-slate-500">
                      Hora Fim
                    </Label>
                    <Input
                      type="time"
                      value={blockForm.end_time}
                      onChange={(e) => setBlockForm({ ...blockForm, end_time: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Button onClick={handleAddBlock} disabled={savingBlock} className="w-full">
                      {savingBlock ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      Adicionar
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase text-slate-600 mb-2">
                    Bloqueios Ativos
                  </h4>
                  {blocks.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-400 bg-slate-50 rounded-lg border border-dashed">
                      Nenhum bloqueio cadastrado.
                    </div>
                  ) : (
                    blocks.map((b) => (
                      <div
                        key={b.id}
                        className="flex justify-between items-center bg-white border border-slate-200 p-3 sm:p-4 rounded-lg shadow-sm"
                      >
                        <div>
                          <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                            {recurrenceLabels[b.recurrence]}
                            <span className="text-muted-foreground font-normal">•</span>
                            {b.start_time.substring(0, 5)} às {b.end_time.substring(0, 5)}
                          </p>
                          {b.block_date && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              Data Ref: {format(new Date(b.block_date + 'T00:00:00'), 'dd/MM/yyyy')}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteBlock(b.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={modal.open} onOpenChange={(o) => !o && setModal({ ...modal, open: false })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="uppercase">
              {modal.mode === 'create' ? 'Nova Reserva de Scan' : 'Detalhes da Reserva'}
            </DialogTitle>
            <DialogDesc>
              Preencha os dados abaixo para agendar o serviço de escaneamento.
            </DialogDesc>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {isStaff && (
              <div className="space-y-2">
                <Label className="uppercase text-xs font-bold">
                  Dentista / Clínica <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.dentist_id}
                  onValueChange={(v) => setFormData({ ...formData, dentist_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dentista" />
                  </SelectTrigger>
                  <SelectContent>
                    {dentists.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label className="uppercase text-xs font-bold">
                Nome do Paciente <span className="text-destructive">*</span>
              </Label>
              <Input
                value={formData.patient_name}
                onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                placeholder="Ex: João Silva"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="uppercase text-xs font-bold">
                  Data <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  value={formData.booking_date}
                  onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 col-span-2 sm:col-span-1">
                <div className="space-y-2">
                  <Label className="uppercase text-xs font-bold">
                    Início <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-xs font-bold">
                    Fim <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="uppercase text-xs font-bold">Observações</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Instruções adicionais..."
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {modal.mode === 'edit' && (
              <Button
                variant="destructive"
                onClick={handleDeleteBooking}
                disabled={saving}
                className="mr-auto w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Excluir
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setModal({ ...modal, open: false })}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveBooking} disabled={saving} className="w-full sm:w-auto">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {modal.mode === 'create' ? 'Confirmar Reserva' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
