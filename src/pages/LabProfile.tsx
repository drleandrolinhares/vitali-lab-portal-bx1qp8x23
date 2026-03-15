import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
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
import { toast } from '@/hooks/use-toast'
import { Building, Camera, Loader2, Save } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function LabProfile() {
  const { currentUser, appSettings, updateSettings } = useAppStore()

  const [formData, setFormData] = useState({
    lab_razao_social: '',
    lab_cnpj: '',
    lab_address: '',
    lab_phone: '',
    lab_email: '',
    lab_website: '',
    lab_instagram: '',
    lab_pix_key: '',
  })

  const [logoUrl, setLogoUrl] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setFormData({
      lab_razao_social: appSettings['lab_razao_social'] || '',
      lab_cnpj: appSettings['lab_cnpj'] || '',
      lab_address: appSettings['lab_address'] || '',
      lab_phone: appSettings['lab_phone'] || '',
      lab_email: appSettings['lab_email'] || '',
      lab_website: appSettings['lab_website'] || '',
      lab_instagram: appSettings['lab_instagram'] || '',
      lab_pix_key: appSettings['lab_pix_key'] || '',
    })
    setLogoUrl(appSettings['lab_logo_url'] || '')
  }, [appSettings])

  if (currentUser?.role !== 'master') return <Navigate to="/" replace />

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSettings(formData)
      toast({ title: 'Perfil do Laboratório atualizado com sucesso!' })
    } catch (e: any) {
      toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingLogo(true)
      const file = event.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const filePath = `lab-logo-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

      setLogoUrl(data.publicUrl)
      await updateSettings({ lab_logo_url: data.publicUrl })

      toast({ title: 'Logotipo atualizado com sucesso!' })
    } catch (error) {
      toast({
        title: 'Erro no Upload',
        description: 'Não foi possível fazer upload do logotipo.',
        variant: 'destructive',
      })
    } finally {
      setUploadingLogo(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Building className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary uppercase">
            Perfil Vitali Lab
          </h2>
          <p className="text-muted-foreground text-sm uppercase font-semibold">
            Informações institucionais para impressão de faturas e recibos.
          </p>
        </div>
      </div>

      <Card className="shadow-subtle">
        <CardHeader className="bg-muted/10 border-b pb-6">
          <CardTitle className="uppercase text-lg">Dados Cadastrais do Laboratório</CardTitle>
          <CardDescription className="uppercase text-xs font-semibold">
            ESTES DADOS SERÃO EXIBIDOS NOS CABEÇALHOS E RODAPÉS DOS DOCUMENTOS IMPRESSOS.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-3">
              <Label className="uppercase text-xs font-bold text-muted-foreground">
                Logotipo Oficial
              </Label>
              <div className="relative group">
                <Avatar className="w-32 h-32 border border-border shadow-sm rounded-xl">
                  <AvatarImage src={logoUrl} className="object-contain p-2 bg-white" />
                  <AvatarFallback className="text-3xl bg-muted text-muted-foreground rounded-xl">
                    VL
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="logo-upload"
                  className="absolute inset-0 flex flex-col gap-1 items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer"
                >
                  {uploadingLogo ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Camera className="w-6 h-6" />
                      <span className="text-[10px] font-bold uppercase">Trocar</span>
                    </>
                  )}
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                />
              </div>
            </div>

            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label className="uppercase text-xs font-bold">
                    Razão Social / Nome Fantasia
                  </Label>
                  <Input
                    name="lab_razao_social"
                    value={formData.lab_razao_social}
                    onChange={handleChange}
                    placeholder="Ex: Vitali Lab Prótese Dentária"
                    className="font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-xs font-bold">CNPJ</Label>
                  <Input
                    name="lab_cnpj"
                    value={formData.lab_cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-xs font-bold">Telefone (Contato Recibos)</Label>
                  <Input
                    name="lab_phone"
                    value={formData.lab_phone}
                    onChange={handleChange}
                    placeholder="(00) 0000-0000"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="uppercase text-xs font-bold">E-mail Institucional</Label>
                  <Input
                    name="lab_email"
                    type="email"
                    value={formData.lab_email}
                    onChange={handleChange}
                    placeholder="contato@vitalilab.com.br"
                    className="normal-case"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-xs font-bold">Site / Website</Label>
                  <Input
                    name="lab_website"
                    value={formData.lab_website}
                    onChange={handleChange}
                    placeholder="www.vitalilab.com.br"
                    className="normal-case"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-xs font-bold">Instagram</Label>
                  <Input
                    name="lab_instagram"
                    value={formData.lab_instagram}
                    onChange={handleChange}
                    placeholder="@vitalilab"
                    className="normal-case"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="uppercase text-xs font-bold">Endereço Completo</Label>
                  <Input
                    name="lab_address"
                    value={formData.lab_address}
                    onChange={handleChange}
                    placeholder="Rua Exemplo, 123 - Bairro - Cidade/UF - CEP"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2 pt-2">
                  <Label className="uppercase text-xs font-bold text-emerald-600">
                    Chave PIX (Para Pagamento)
                  </Label>
                  <Input
                    name="lab_pix_key"
                    value={formData.lab_pix_key}
                    onChange={handleChange}
                    placeholder="CNPJ, Celular, E-mail ou Aleatória"
                    className="border-emerald-200 focus-visible:ring-emerald-500 normal-case"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/10 border-t px-6 py-4 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="uppercase text-xs font-bold tracking-wide min-w-[150px]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Salvar Perfil
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
