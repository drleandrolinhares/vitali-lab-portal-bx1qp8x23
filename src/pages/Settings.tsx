import { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/main'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Navigate } from 'react-router-dom'
import { MessageSquare, Phone } from 'lucide-react'

export default function SettingsPage() {
  const { currentUser, appSettings, updateSetting } = useAppStore()
  const [groupLink, setGroupLink] = useState('')
  const [labLink, setLabLink] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setGroupLink(appSettings?.whatsapp_group_link || '')
    setLabLink(appSettings?.whatsapp_lab_link || '')
  }, [appSettings])

  if (currentUser?.role !== 'admin') return <Navigate to="/" replace />

  const handleSave = async () => {
    setLoading(true)
    await updateSetting('whatsapp_group_link', groupLink)
    await updateSetting('whatsapp_lab_link', labLink)
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie as configurações gerais e links de comunicação do sistema.
        </p>
      </div>

      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle>Canais de Comunicação</CardTitle>
          <CardDescription>
            Defina os links do WhatsApp para acesso rápido pelo menu lateral.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-semibold">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              Grupo de WhatsApp Clínica/Vitali Lab
            </Label>
            <Input
              value={groupLink}
              onChange={(e) => setGroupLink(e.target.value)}
              placeholder="Ex: https://chat.whatsapp.com/..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Este link será exibido para dentistas e administradores.
            </p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-semibold">
              <Phone className="w-4 h-4 text-emerald-500" />
              WhatsApp Vitali Lab
            </Label>
            <Input
              value={labLink}
              onChange={(e) => setLabLink(e.target.value)}
              placeholder="Ex: https://wa.me/5511999999999"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Link direto para o número do laboratório.
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 border-t px-6 py-4 flex justify-end rounded-b-lg">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full sm:w-auto min-w-[150px]"
          >
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
