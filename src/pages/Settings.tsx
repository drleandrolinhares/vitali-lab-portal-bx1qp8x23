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
import { Phone, User, Building, Camera, Loader2, Link as LinkIcon, Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { UsersManagement, PERMISSION_OPTIONS } from '@/components/UsersManagement'
import { WorkSchedule } from '@/components/WorkSchedule'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function RolePermissionsPanel() {
  const { appSettings, updateSetting } = useAppStore()
  const [perms, setPerms] = useState<any>({ admin: [], receptionist: [], dentist: [] })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (appSettings?.role_permissions) {
      try {
        setPerms(JSON.parse(appSettings.role_permissions))
      } catch (e) {
        console.error('Failed to parse role_permissions', e)
      }
    }
  }, [appSettings])

  const handleToggle = (role: string, id: string) => {
    setPerms((prev: any) => {
      const rolePerms = prev[role] || []
      const has = rolePerms.includes(id)
      return {
        ...prev,
        [role]: has ? rolePerms.filter((p: string) => p !== id) : [...rolePerms, id],
      }
    })
  }

  const handleSelectAll = (role: string) => {
    setPerms((prev: any) => {
      const allIds = PERMISSION_OPTIONS.map((p) => p.id)
      const isAll = prev[role]?.length === allIds.length
      return {
        ...prev,
        [role]: isAll ? [] : allIds,
      }
    })
  }

  const save = async () => {
    setSaving(true)
    await updateSetting('role_permissions', JSON.stringify(perms))
    setSaving(false)
    toast({ title: 'Permissões salvas com sucesso' })
  }

  return (
    <Card className="shadow-subtle">
      <CardHeader>
        <CardTitle>Hierarquia de Permissões</CardTitle>
        <CardDescription>Defina o acesso padrão para cada perfil do sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Módulo</TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center gap-2">
                  <span>Admin</span>
                  <Button variant="outline" size="sm" onClick={() => handleSelectAll('admin')}>
                    Tudo
                  </Button>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center gap-2">
                  <span>Recepção / Produção</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAll('receptionist')}
                  >
                    Tudo
                  </Button>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center gap-2">
                  <span>Dentista</span>
                  <Button variant="outline" size="sm" onClick={() => handleSelectAll('dentist')}>
                    Tudo
                  </Button>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PERMISSION_OPTIONS.map((opt) => (
              <TableRow key={opt.id}>
                <TableCell className="font-medium text-sm">{opt.label}</TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={perms.admin?.includes(opt.id)}
                    onCheckedChange={() => handleToggle('admin', opt.id)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={perms.receptionist?.includes(opt.id)}
                    onCheckedChange={() => handleToggle('receptionist', opt.id)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={perms.dentist?.includes(opt.id)}
                    onCheckedChange={() => handleToggle('dentist', opt.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="bg-muted/20 border-t px-6 py-4 flex justify-end rounded-b-lg">
        <Button onClick={save} disabled={saving} className="min-w-[150px]">
          {saving ? 'Salvando...' : 'Salvar Permissões'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function SettingsPage() {
  const { currentUser, appSettings, updateSetting, updateProfile } = useAppStore()

  const [labLink, setLabLink] = useState('')
  const [savingSystem, setSavingSystem] = useState(false)

  const [name, setName] = useState('')
  const [clinic, setClinic] = useState('')
  const [jobFunction, setJobFunction] = useState('')
  const [whatsappGroupLink, setWhatsappGroupLink] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const [scales, setScales] = useState<string[]>([])
  const [newScale, setNewScale] = useState('')

  useEffect(() => {
    setLabLink(appSettings?.whatsapp_lab_link || '')
    try {
      if (appSettings?.shade_scales) {
        setScales(JSON.parse(appSettings.shade_scales))
      }
    } catch (e) {
      console.error('Failed to parse shade scales', e)
    }
  }, [appSettings])

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '')
      setClinic(currentUser.clinic || '')
      setJobFunction(currentUser.job_function || '')
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
    toast({ title: 'Configurações salvas' })
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
      job_function: jobFunction,
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

  const handleAddScale = async () => {
    const trimmed = newScale.trim()
    if (!trimmed || scales.includes(trimmed)) return
    const updated = [...scales, trimmed]
    await updateSetting('shade_scales', JSON.stringify(updated))
    setNewScale('')
  }

  const handleRemoveScale = async (scale: string) => {
    const updated = scales.filter((s) => s !== scale)
    await updateSetting('shade_scales', JSON.stringify(updated))
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const isAdmin = currentUser.role === 'admin' || currentUser.role === ('master' as any)
  const isMaster = currentUser.role === ('master' as any)

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1 mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Configurações Gerais</h2>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 flex w-full max-w-full overflow-x-auto bg-transparent gap-2 h-auto p-0 pb-2 justify-start scrollbar-hide">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap"
          >
            Meu Perfil
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger
              value="system"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap"
            >
              Sistema
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap"
            >
              Usuários
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger
              value="work-schedule"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap"
            >
              Escala de Trabalho
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger
              value="scales"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap"
            >
              Escalas de Cor
            </TabsTrigger>
          )}
          {isMaster && (
            <TabsTrigger
              value="role-permissions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap"
            >
              Permissões (Master)
            </TabsTrigger>
          )}
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
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary/70" />
                        Função na Empresa
                      </Label>
                      <Input
                        value={jobFunction}
                        onChange={(e) => setJobFunction(e.target.value)}
                        placeholder="Ex: Ceramista, Recepção"
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

            <TabsContent value="work-schedule">
              <WorkSchedule />
            </TabsContent>

            <TabsContent value="scales" className="space-y-6">
              <Card className="shadow-subtle">
                <CardHeader>
                  <CardTitle>Escalas de Cor</CardTitle>
                  <CardDescription>
                    Gerencie as opções de escalas de cor disponíveis para os dentistas ao criar
                    novos pedidos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Nova escala (ex: VITA Clássica, BL, 3D Master)"
                      value={newScale}
                      onChange={(e) => setNewScale(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddScale()
                      }}
                      className="max-w-xs"
                    />
                    <Button onClick={handleAddScale}>Adicionar</Button>
                  </div>
                  <div className="space-y-2 mt-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Escalas Cadastradas
                    </h3>
                    {scales.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic p-4 bg-muted/20 rounded border border-dashed text-center">
                        Nenhuma escala cadastrada.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {scales.map((s, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-muted/10 hover:bg-muted/30 transition-colors rounded-lg border"
                          >
                            <span className="font-semibold text-sm">{s}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleRemoveScale(s)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}

        {isMaster && (
          <TabsContent value="role-permissions" className="space-y-6">
            <RolePermissionsPanel />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
