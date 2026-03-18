import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription as DialogDesc,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Switch } from '@/components/ui/switch'
import { CalendarIcon, Loader2, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { ScanBlock } from './types'

export function BookingModal({
  open,
  mode,
  formData,
  setFormData,
  saving,
  onClose,
  onSave,
  onDelete,
  dentists,
  isStaff,
}: any) {
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const start_time = e.target.value
    let end_time = formData.end_time

    if (start_time && start_time.includes(':')) {
      const [hStr, mStr] = start_time.split(':')
      const h = parseInt(hStr, 10)
      const m = parseInt(mStr, 10)

      if (!isNaN(h) && !isNaN(m)) {
        const endH = (h + 1) % 24
        end_time = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      }
    }

    setFormData({ ...formData, start_time, end_time })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="uppercase">
            {mode === 'create' ? 'Nova Reserva de Scan' : 'Detalhes da Reserva'}
          </DialogTitle>
          <DialogDesc>Preencha os dados abaixo para agendar o serviço de escaneamento.</DialogDesc>
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
                  {dentists.map((d: any) => (
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
                <Input type="time" value={formData.start_time} onChange={handleStartTimeChange} />
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
          {mode === 'edit' && (
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={saving}
              className="mr-auto w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Excluir
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={saving} className="w-full sm:w-auto">
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {mode === 'create' ? 'Confirmar' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function BlockModal({
  open,
  form,
  setForm,
  saving,
  onClose,
  onSave,
  blocks,
  onDelete,
}: any) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="uppercase">Gerenciar Bloqueios</DialogTitle>
          <DialogDesc>Defina horários indisponíveis para o serviço de Scan.</DialogDesc>
        </DialogHeader>
        <div className="space-y-4 py-4 border-b border-border/50">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label className="uppercase text-[10px] font-bold">Recorrência</Label>
              <Select
                value={form.recurrence}
                onValueChange={(v) => setForm({ ...form, recurrence: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unique">Data Única</SelectItem>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label className="uppercase text-[10px] font-bold">Data Base</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal px-3',
                      !form.block_date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    {form.block_date ? (
                      format(new Date(form.block_date + 'T00:00:00'), 'dd/MM/yyyy')
                    ) : (
                      <span>Selecione</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.block_date ? new Date(form.block_date + 'T00:00:00') : undefined}
                    onSelect={(d) => d && setForm({ ...form, block_date: format(d, 'yyyy-MM-dd') })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-bold">Início</Label>
              <Input
                type="time"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-bold">Fim</Label>
              <Input
                type="time"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={onSave} disabled={saving} className="w-full mt-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Adicionar Bloqueio
          </Button>
        </div>
        <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
          <h4 className="text-xs font-bold uppercase text-muted-foreground">Bloqueios Ativos</h4>
          {blocks.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-2">Nenhum bloqueio.</div>
          ) : (
            blocks.map((b: ScanBlock) => (
              <div
                key={b.id}
                className="flex justify-between items-center bg-muted/30 border border-border/50 p-2 rounded-md"
              >
                <div>
                  <p className="text-xs font-bold">
                    {b.start_time.substring(0, 5)} às {b.end_time.substring(0, 5)}
                  </p>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    {b.recurrence}{' '}
                    {b.block_date ? format(new Date(b.block_date + 'T00:00:00'), 'dd/MM/yyyy') : ''}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive h-7 w-7"
                  onClick={() => onDelete(b.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ScanSettingsModal({ open, settings, setSettings, saving, onClose, onSave }: any) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="uppercase">Horários de Atendimento</DialogTitle>
          <DialogDesc>
            Configure os dias e horários em que o serviço de Scan está disponível.
          </DialogDesc>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          {settings.map((s: any, idx: number) => (
            <div
              key={s.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-muted/10"
            >
              <div className="w-full sm:w-32 flex items-center gap-3">
                <Switch
                  checked={s.is_available}
                  onCheckedChange={(v) => {
                    const n = [...settings]
                    n[idx].is_available = v
                    setSettings(n)
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
                      const n = [...settings]
                      n[idx].start_time = e.target.value + ':00'
                      setSettings(n)
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
                      const n = [...settings]
                      n[idx].end_time = e.target.value + ':00'
                      setSettings(n)
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
                    value={s.slot_duration_minutes}
                    onChange={(e) => {
                      const n = [...settings]
                      n[idx].slot_duration_minutes = parseInt(e.target.value) || 60
                      setSettings(n)
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Salvar Configurações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
