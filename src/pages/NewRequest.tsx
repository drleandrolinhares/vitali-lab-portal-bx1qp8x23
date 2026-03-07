import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { TeethSelector } from '@/components/TeethSelector'

export default function NewRequest() {
  const { addOrder, currentUser } = useAppStore()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    patientName: '',
    workType: '',
    material: '',
    shade: '',
    shippingMethod: 'lab_pickup',
    observations: '',
  })
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.patientName || !formData.workType) return

    addOrder({
      dentistName: currentUser.name,
      patientName: formData.patientName,
      workType: formData.workType,
      material: formData.material || 'Padrão',
      shade: formData.shade,
      shippingMethod: formData.shippingMethod,
      observations: formData.observations,
      teeth: selectedTeeth,
    })
    navigate('/')
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Card className="shadow-elevation border-muted/60">
        <CardHeader className="bg-muted/30 border-b pb-6">
          <CardTitle className="text-2xl">Novo Pedido de Laboratório</CardTitle>
          <CardDescription>
            Preencha os detalhes clínicos do paciente e especificações do trabalho.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8 pt-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="patientName">Nome do Paciente *</Label>
                <Input
                  id="patientName"
                  required
                  placeholder="Ex: João da Silva"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Cor/Escala</Label>
                <Input
                  placeholder="Ex: A2, BL1..."
                  value={formData.shade}
                  onChange={(e) => setFormData({ ...formData, shade: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo de Trabalho *</Label>
                <Select
                  value={formData.workType}
                  onValueChange={(v) => setFormData({ ...formData, workType: v })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coroa">Coroa Total</SelectItem>
                    <SelectItem value="Faceta">Faceta/Lente</SelectItem>
                    <SelectItem value="Inlay/Onlay">Inlay/Onlay</SelectItem>
                    <SelectItem value="Protocolo">Protocolo</SelectItem>
                    <SelectItem value="Placa">Placa de Bruxismo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Material Preferencial</Label>
                <Select
                  value={formData.material}
                  onValueChange={(v) => setFormData({ ...formData, material: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Zircônia">Zircônia</SelectItem>
                    <SelectItem value="Porcelana">Porcelana E-max</SelectItem>
                    <SelectItem value="Resina">Resina Acrílica</SelectItem>
                    <SelectItem value="Metalocerâmica">Metalocerâmica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Seleção de Elementos (Odontograma)</Label>
              <TeethSelector value={selectedTeeth} onChange={setSelectedTeeth} />
            </div>

            <div className="space-y-3 bg-muted/20 p-4 rounded-lg border">
              <Label className="text-base">Método de Envio do Molde/Escaneamento</Label>
              <RadioGroup
                value={formData.shippingMethod}
                onValueChange={(v) => setFormData({ ...formData, shippingMethod: v })}
                className="flex flex-col space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lab_pickup" id="r1" />
                  <Label htmlFor="r1" className="font-normal cursor-pointer">
                    Solicitar motoboy do laboratório
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dentist_send" id="r2" />
                  <Label htmlFor="r2" className="font-normal cursor-pointer">
                    Vou enviar / Arquivo STL via portal
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="obs">Observações Adicionais</Label>
              <Textarea
                id="obs"
                placeholder="Instruções sobre textura, formato, ponto de contato..."
                className="min-h-[100px]"
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 border-t px-6 py-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" className="min-w-[150px]">
              Enviar Pedido
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
