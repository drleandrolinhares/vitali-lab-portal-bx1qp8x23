import { useState, useEffect } from 'react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Phone, User, Building, Camera, Loader2, Link as LinkIcon } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { UsersManagement } from '@/components/UsersManagement'

export default function SettingsPage() {
  const { currentUser, appSettings, updateSetting, updateProfile } = useAppStore()

  const [labLink, setLabLink] = useState('')
  const [savingSystem, setSavingSystem] = useState(false)

  const [name, setName] = useState('')
  const [clinic, setClinic] = useState('')
  const [whatsappGroupLink, setWhatsappGroupLink] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  useEffect(() => {
    setLabLink(appSettings?.whatsapp_lab_link || '')
  }, [appSettings])

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '')
      setClinic(currentUser.clinic || '')
      setWhatsappGroupLink((currentUser as any).whatsapp_group_link || '')
      setAvatarUrl(currentUser.avatar_url || '')
    }
  }, [currentUser])

  const handleSaveSystem = async () => {
    setSavingSystem(true)
    let finalLink = labLink.trim()
    if (finalLink && !finalLink.startsWith('http://') && !finalLink.startsWith('https://')) {
      finalLink = `https://${finalLink}`
    }
    await updateSetting('whatsapp_lab_link', finalLink)
    setLabLink(finalLink)
    setSavingSystem(false)
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    let finalGroupLink = whatsappGroupLink.trim()
    if (
      finalGroupLink &&
      !finalGroupLink.startsWith('http://') &&
      !finalGroupLink.startsWith('https://')
    ) {
      finalGroupLink = `https://${finalGroupLink}`
    }

    await updateProfile({
      name,
      clinic,
      avatar_url: avatarUrl,
      whatsapp_group_link: finalGroupLink,
    } as any)

    setWhatsappGroupLink(finalGroupLink)
    setSavingProfile(false)
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!currentUser) return

      setUploadingAvatar(true)
      const file = event.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const filePath = `${currentUser.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

      setAvatarUrl(data.publicUrl)
      await updateProfile({ avatar_url: data.publicUrl })
    } catch (error) {
      toast({
        title: 'Erro no upload',
        description: 'Não foi possível fazer upload da imagem.',
        variant: 'destructive',
      })
    } finally {
      setUploadingAvatar(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const isAdmin = currentUser.role === 'admin'

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1 mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Configurações Gerais</h2>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
          <TabsTrigger value="system" disabled={!isAdmin}>
            Sistema
          </TabsTrigger>
          <TabsTrigger value="users" disabled={!isAdmin}>
            Usuários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>Atualize suas informações e foto de perfil.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-2 border-border/50">
                    <AvatarImage src={avatarUrl} className="object-cover" />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {name.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6" />
                    )}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary/70" />
                        Nome Completo
                      </Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-primary/70" />
                        Clínica (Opcional)
                      </Label>
                      <Input
                        value={clinic}
                        onChange={(e) => setClinic(e.target.value)}
                        placeholder="Nome da sua clínica"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-primary/70" />
                        Link do Grupo da Clínica (WhatsApp)
                      </Label>
                      <Input
                        value={whatsappGroupLink}
                        onChange={(e) => setWhatsappGroupLink(e.target.value)}
                        placeholder="Ex: https://chat.whatsapp.com/..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t px-6 py-4 flex justify-end rounded-b-lg">
              <Button
                onClick={handleSaveProfile}
                disabled={savingProfile || uploadingAvatar}
                className="w-full sm:w-auto min-w-[150px]"
              >
                {savingProfile ? 'Salvando...' : 'Salvar Perfil'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {isAdmin && (
          <>
            <TabsContent value="system" className="space-y-6">
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
                      <Phone className="w-4 h-4 text-emerald-500" />
                      WhatsApp Vitali Lab (Contato Laboratório)
                    </Label>
                    <Input
                      value={labLink}
                      onChange={(e) => setLabLink(e.target.value)}
                      placeholder="Ex: https://wa.me/5511999999999"
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Link global de contato direto para o número do laboratório.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t px-6 py-4 flex justify-end rounded-b-lg">
                  <Button
                    onClick={handleSaveSystem}
                    disabled={savingSystem}
                    className="w-full sm:w-auto min-w-[150px]"
                  >
                    {savingSystem ? 'Salvando...' : 'Salvar Configurações'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <UsersManagement />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
