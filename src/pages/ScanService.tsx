import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'
import { Navigate } from 'react-router-dom'
import { format, startOfMonth, endOfMonth, subWeeks, addWeeks } from 'date-fns'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

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
  const [filters, setFilters] = useState<ScanFilters>({ showBookings: true, showBlocks: true })

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
        booking_date: booking.booking_date,
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
        description: 'Já existe um agendamento neste horário.',
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
    if (!blockForm.block_date && blockForm.recurrence !== 'daily')
      return toast({ title: 'Selecione a data', variant: 'destructive' })
    if (blockForm.start_time >= blockForm.end_time)
      return toast({ title: 'Horários inválidos', variant: 'destructive' })
    setSavingBlock(true)
    const { error } = await supabase.from('scan_service_blocks' as any).insert({
      start_time: blockForm.start_time + ':00',
      end_time: blockForm.end_time + ':00',
      block_date: blockForm.block_date || null,
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
    <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-6rem)] gap-4 md:gap-6 p-4 md:p-6 max-w-[1600px] mx-auto animate-fade-in pb-12">
      <ScanSidebar
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        filters={filters}
        setFilters={setFilters}
      />
      <div className="flex-1 flex flex-col min-w-0 bg-background rounded-xl border shadow-subtle overflow-hidden relative">
        <ScanHeader
          view={view}
          setView={setView}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          isAdmin={isAdmin}
          onNewBooking={() => handleOpenBooking()}
          onNewBlock={() => setBlockModal({ open: true })}
          onOpenSettings={() => setSettingsModalOpen(true)}
        />
        <div className="flex-1 overflow-x-auto overflow-y-hidden bg-muted/5 flex flex-col min-h-0">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <ScanCalendarViews
                view={view}
                currentDate={currentDate}
                bookings={bookings}
                blocks={blocks}
                settings={settings}
                filters={filters}
                isStaff={isStaff}
                currentUserId={currentUser?.id}
                onSlotClick={(date, start, end) => handleOpenBooking({ date, start, end })}
                onBookingClick={(b) => handleOpenBooking(null, b)}
                setCurrentDate={setCurrentDate}
                setView={setView}
              />
            </div>
          )}
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
