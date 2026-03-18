import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'
import { Navigate } from 'react-router-dom'
import { format, startOfMonth, endOfMonth, subWeeks, addWeeks } from 'date-fns'
import { toast } from '@/hooks/use-toast'
import { Loader2, Plus, UserMinus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { Booking, ScanSetting, ScanBlock, ViewType, ScanFilters } from '@/components/scan/types'
import { checkBlockOverlap, checkBookingOverlap } from '@/components/scan/utils'
import { ScanSidebar } from '@/components/scan/ScanSidebar'
import { ScanHeader } from '@/components/scan/ScanHeader'
import { ScanCalendarViews } from '@/components/scan/ScanCalendarViews'
import { BookingModal, BlockModal, ScanSettingsModal } from '@/components/scan/ScanModals'

export default function ScanService() {
  const { currentUser, appSettings } = useAppStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewType>('week')
  const [activeTab, setActiveTab] = useState('AGENDAMENTOS MARCADOS')
  const [filters, setFilters] = useState<ScanFilters>({
    showBookings: true,
    showBlocks: true,
    dentistId: 'all',
  })

  const [bookings, setBookings] = useState<Booking[]>([])
  const [settings, setSettings] = useState<ScanSetting[]>([])
  const [blocks, setBlocks] = useState<ScanBlock[]>([])
  const [dentists, setDentists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  const [blockModal, setBlockModal] = useState({ open: false })
  const [blockForm, setBlockForm] = useState({
    block_date: format(new Date(), 'yyyy-MM-dd'),
    day_of_week: new Date().getDay().toString(),
    start_time: '08:00',
    end_time: '12:00',
    recurrence: 'unique',
  })
  const [savingBlock, setSavingBlock] = useState(false)

  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [configSettings, setConfigSettings] = useState<ScanSetting[]>([])
  const [savingSettings, setSavingSettings] = useState(false)

  const isStaff = [
    'admin',
    'master',
    'receptionist',
    'technical_assistant',
    'financial',
    'relationship_manager',
  ].includes(currentUser?.role || '')
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === ('master' as any)
  const scanServiceEnabled = appSettings['scan_service_enabled'] === 'true'

  const fetchAgenda = async () => {
    setLoading(true)
    const start = format(subWeeks(startOfMonth(currentDate), 1), 'yyyy-MM-dd')
    const end = format(addWeeks(endOfMonth(currentDate), 1), 'yyyy-MM-dd')

    const [bookRes, setRes, dentRes, blockRes] = await Promise.all([
      supabase
        .from('vw_secure_scan_bookings' as any)
        .select('*')
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

    if (bookRes.data)
      setBookings(
        bookRes.data.map((b: any) => ({ ...b, profiles: { name: b.dentist_name } })) as Booking[],
      )
    if (setRes.data) {
      setSettings(setRes.data as ScanSetting[])
      setConfigSettings(JSON.parse(JSON.stringify(setRes.data)))
    }
    if (dentRes.data) setDentists(dentRes.data)
    if (blockRes.data) setBlocks(blockRes.data as ScanBlock[])
    setLoading(false)
  }

  useEffect(() => {
    if (!isAdmin && !scanServiceEnabled) return
    fetchAgenda()
  }, [format(startOfMonth(currentDate), 'yyyy-MM'), isStaff, isAdmin, scanServiceEnabled])

  if (!isAdmin && !scanServiceEnabled) return <Navigate to="/app" replace />

  const handleOpenBooking = (slot?: any, booking?: any) => {
    if (booking) {
      if (!isStaff && booking.dentist_id !== currentUser?.id) return
      setFormData({
        dentist_id: booking.dentist_id,
        patient_name: booking.patient_name,
        booking_date: booking.booking_date.substring(0, 10),
        start_time: booking.start_time.substring(0, 5),
        end_time: booking.end_time.substring(0, 5),
        notes: booking.notes || '',
      })
      setModal({ open: true, mode: 'edit', booking })
    } else {
      setFormData({
        dentist_id: isStaff ? '' : currentUser?.id || '',
        patient_name: '',
        booking_date: slot ? slot.date : format(currentDate, 'yyyy-MM-dd'),
        start_time: slot ? slot.start : '08:00',
        end_time: slot ? slot.end : '09:00',
        notes: '',
      })
      setModal({ open: true, mode: 'create', booking: null })
    }
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
    if (formData.start_time >= formData.end_time)
      return toast({ title: 'O horário de fim deve ser após o início', variant: 'destructive' })
    if (
      checkBookingOverlap(
        formData.start_time,
        formData.end_time,
        formData.booking_date,
        bookings,
        modal.booking?.id,
      )
    ) {
      return toast({
        title: 'Horário Indisponível',
        description: 'Este horário já foi reservado por outro profissional.',
        variant: 'destructive',
      })
    }
    if (checkBlockOverlap(formData.start_time, formData.end_time, formData.booking_date, blocks)) {
      return toast({
        title: 'Horário Indisponível',
        description: 'O serviço está bloqueado administrativamente.',
        variant: 'destructive',
      })
    }

    setSaving(true)

    const formattedStart =
      formData.start_time.length === 5 ? `${formData.start_time}:00` : formData.start_time
    const formattedEnd =
      formData.end_time.length === 5 ? `${formData.end_time}:00` : formData.end_time

    let overlapQuery = supabase
      .from('scan_service_bookings' as any)
      .select('id')
      .eq('booking_date', formData.booking_date)
      .lt('start_time', formattedEnd)
      .gt('end_time', formattedStart)

    if (modal.mode === 'edit' && modal.booking?.id) {
      overlapQuery = overlapQuery.neq('id', modal.booking.id)
    }

    const { data: overlappingBookings, error: overlapError } = await overlapQuery

    if (overlapError) {
      setSaving(false)
      return toast({
        title: 'Erro ao verificar disponibilidade',
        description: overlapError.message,
        variant: 'destructive',
      })
    }

    if (overlappingBookings && overlappingBookings.length > 0) {
      setSaving(false)
      fetchAgenda()
      return toast({
        title: 'Horário Indisponível',
        description: 'Este horário já foi reservado por outro profissional.',
        variant: 'destructive',
      })
    }

    const payload = { ...formData }
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

  const handleAddBlock = async () => {
    if (blockForm.recurrence === 'unique' || blockForm.recurrence === 'monthly') {
      if (!blockForm.block_date) return toast({ title: 'Selecione a data', variant: 'destructive' })
    }
    if (blockForm.start_time >= blockForm.end_time)
      return toast({ title: 'Horários inválidos', variant: 'destructive' })

    setSavingBlock(true)
    const { error } = await supabase.from('scan_service_blocks' as any).insert({
      start_time: blockForm.start_time + ':00',
      end_time: blockForm.end_time + ':00',
      block_date:
        blockForm.recurrence === 'unique' || blockForm.recurrence === 'monthly'
          ? blockForm.block_date
          : null,
      day_of_week: blockForm.recurrence === 'weekly' ? parseInt(blockForm.day_of_week) : null,
      recurrence: blockForm.recurrence,
    })
    setSavingBlock(false)
    if (error)
      toast({ title: 'Erro ao criar bloqueio', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Bloqueio criado!' })
      fetchAgenda()
    }
  }

  const handleDeleteBlock = async (id: string) => {
    if (!confirm('Deseja remover este bloqueio?')) return
    await supabase
      .from('scan_service_blocks' as any)
      .delete()
      .eq('id', id)
    toast({ title: 'Bloqueio removido!' })
    fetchAgenda()
  }

  const handleSaveSettings = async () => {
    setSavingSettings(true)
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
    setSavingSettings(false)
    setSettingsModalOpen(false)
    fetchAgenda()
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full max-w-[1600px] mx-auto">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1A233A] tracking-tighter uppercase">
            Agenda e Pedidos
          </h1>
          <p className="text-xs md:text-sm font-bold text-slate-500 uppercase mt-1 tracking-wide">
            Gerencie compromissos e acompanhe pedidos delegados.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <>
              <Button
                variant="outline"
                onClick={() => setSettingsModalOpen(true)}
                className="text-slate-600 font-bold uppercase text-xs h-11 px-4 gap-2 bg-white border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
                title="Configurações"
              >
                <Settings className="w-4 h-4" /> <span className="hidden sm:inline">Configs</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setBlockModal({ open: true })}
                className="text-[#E11D48] border-[#E11D48]/20 hover:bg-[#E11D48]/10 font-bold uppercase text-xs h-11 px-5 gap-2 bg-white shadow-sm transition-colors"
              >
                <UserMinus className="w-4 h-4" /> Bloqueio de Agendamentos
              </Button>
            </>
          )}
          <Button
            onClick={() => handleOpenBooking()}
            className="bg-[#E11D48] text-white hover:bg-[#BE123C] font-bold uppercase text-xs h-11 px-6 gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Novo Registro
          </Button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto w-full flex-1 min-h-0 pb-12">
        <ScanSidebar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          onDateSelect={(date) => {
            setCurrentDate(date)
            setActiveTab('AGENDAMENTOS MARCADOS')
          }}
          bookings={bookings}
          isStaff={isStaff}
          currentUserId={currentUser?.id}
          filters={filters}
        />
        <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <ScanHeader
            view={view}
            setView={setView}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filters={filters}
            setFilters={setFilters}
            dentists={dentists}
            isStaff={isStaff}
          />
          <div className="flex-1 bg-slate-50/30 p-4 md:p-6 flex flex-col min-h-[400px]">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#1A233A]" />
              </div>
            ) : (
              <ScanCalendarViews
                view={view}
                currentDate={currentDate}
                bookings={bookings}
                blocks={blocks}
                settings={settings}
                filters={filters}
                isStaff={isStaff}
                currentUserId={currentUser?.id}
                activeTab={activeTab}
                onSlotClick={(date, start, end) => handleOpenBooking({ date, start, end })}
                onBookingClick={(b) => handleOpenBooking(null, b)}
                setCurrentDate={setCurrentDate}
                setView={setView}
              />
            )}
          </div>
        </div>
      </div>
      <BookingModal
        open={modal.open}
        mode={modal.mode}
        formData={formData}
        setFormData={setFormData}
        saving={saving}
        onClose={() => setModal({ ...modal, open: false })}
        onSave={handleSaveBooking}
        onDelete={handleDeleteBooking}
        dentists={dentists}
        isStaff={isStaff}
      />
      <BlockModal
        open={blockModal.open}
        form={blockForm}
        setForm={setBlockForm}
        saving={savingBlock}
        onClose={() => setBlockModal({ open: false })}
        onSave={handleAddBlock}
        blocks={blocks}
        onDelete={handleDeleteBlock}
      />
      <ScanSettingsModal
        open={settingsModalOpen}
        settings={configSettings}
        setSettings={setConfigSettings}
        saving={savingSettings}
        onClose={() => setSettingsModalOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  )
}
