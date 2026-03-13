import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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
import {
  Phone,
  User,
  Building,
  Camera,
  Loader2,
  Link as LinkIcon,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { WorkSchedule } from '@/components/WorkSchedule'

function ResetPasswordTab() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast({ title: 'AS SENHAS NÃO COINCIDEM', variant: 'destructive' })
      return
    }
    if (newPassword.length < 6) {
      toast({ title: 'A SENHA DEVE TER PELO MENOS 6 CARACTERES', variant: 'destructive' })
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      if (
        error.message?.includes('Session from session_id claim in JWT does not exist') ||
        error.message?.includes('session_not_found') ||
        (error as any).code === 'session_not_found'
      ) {
        toast({
          title: 'SESSÃO EXPIRADA',
          description: 'SUA SESSÃO EXPIROU. POR FAVOR, FAÇA LOGIN NOVAMENTE.',
          variant: 'destructive',
        })
        await supabase.auth.signOut()
        window.location.href = '/'
        return
      }

      toast({
        title: 'ERRO AO ATUALIZAR SENHA',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({ title: 'SENHA ATUALIZADA COM SUCESSO!' })
      setNewPassword('')
      setConfirmPassword('')
    }
    setLoading(false)
  }

  return (
    <Card className="shadow-subtle max-w-md">
      <CardHeader>
        <CardTitle className="uppercase">REDEFINIR SENHA</CardTitle>
        <CardDescription className="uppercase text-xs font-semibold">
          ATUALIZE SUA SENHA DE ACESSO AO SISTEMA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="uppercase text-xs font-bold">NOVA SENHA</Label>
            <div className="relative">
              <Input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="pr-10 normal-case"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="uppercase text-xs font-bold">CONFIRMAR NOVA SENHA</Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pr-10 normal-case"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full uppercase text-xs font-bold">
            {loading ? 'ATUALIZANDO...' : 'ATUALIZAR SENHA'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  const { currentUser, appSettings, updateSetting, updateProfile } = useAppStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'profile'

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

  const [implantBrands, setImplantBrands] = useState<string[]>([])
  const [newBrand, setNewBrand] = useState('')

  useEffect(() => {
    setLabLink(appSettings?.whatsapp_lab_link || '')
    try {
      if (appSettings?.shade_scales) {
        setScales(
          JSON.parse(appSettings.shade_scales).sort((a: string, b: string) =>
            a.localeCompare(b, 'pt-BR'),
          ),
        )
      }
      if (appSettings?.implant_brands) {
        setImplantBrands(
          JSON.parse(appSettings.implant_brands).sort((a: string, b: string) =>
            a.localeCompare(b, 'pt-BR'),
          ),
        )
      }
    } catch (e) {
      console.error('Failed to parse settings JSON', e)
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
    toast({ title: 'CONFIGURAÇÕES SALVAS COM SUCESSO' })
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
        title: 'ERRO NO UPLOAD',
        description: 'NÃO FOI POSSÍVEL FAZER UPLOAD DA IMAGEM.',
        variant: 'destructive',
      })
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleAddScale = async () => {
    const trimmed = newScale.trim()
    if (!trimmed || scales.includes(trimmed)) return
    const updated = [...scales, trimmed].sort((a, b) => a.localeCompare(b, 'pt-BR'))
    await updateSetting('shade_scales', JSON.stringify(updated))
    setNewScale('')
  }

  const handleRemoveScale = async (scale: string) => {
    const updated = scales.filter((s) => s !== scale)
    await updateSetting('shade_scales', JSON.stringify(updated))
  }

  const handleAddBrand = async () => {
    const trimmed = newBrand.trim()
    if (!trimmed || implantBrands.includes(trimmed)) return
    const updated = [...implantBrands, trimmed].sort((a, b) => a.localeCompare(b, 'pt-BR'))
    await updateSetting('implant_brands', JSON.stringify(updated))
    setNewBrand('')
  }

  const handleRemoveBrand = async (brand: string) => {
    const updated = implantBrands.filter((b) => b !== brand)
    await updateSetting('implant_brands', JSON.stringify(updated))
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const isAdmin = currentUser.role === 'admin' || currentUser.role === ('master' as any)

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1 mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-primary uppercase">
          CONFIGURAÇÕES GERAIS
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setSearchParams({ tab: v })} className="w-full">
        <TabsList className="mb-6 flex w-full max-w-full overflow-x-auto bg-transparent gap-2 h-auto p-0 pb-2 justify-start scrollbar-hide">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap uppercase text-xs font-bold"
          >
            MEU PERFIL
          </TabsTrigger>
          <TabsTrigger
            value="reset-password"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap uppercase text-xs font-bold"
          >
            REDEFINIR SENHA
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger
              value="system"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap uppercase text-xs font-bold"
            >
              WHATSAPP
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger
              value="work-schedule"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap uppercase text-xs font-bold"
            >
              ESCALA DE TRABALHO
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger
              value="scales"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap uppercase text-xs font-bold"
            >
              ESCALAS DE COR
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger
              value="brands"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap uppercase text-xs font-bold"
            >
              MARCAS DE IMPLANTES
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle className="uppercase">DADOS PESSOAIS</CardTitle>
              <CardDescription className="uppercase text-xs font-semibold">
                ATUALIZE SUAS INFORMAÇÕES E FOTO DE PERFIL.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-2 border-border/50">
                    <AvatarImage src={avatarUrl} className="object-cover" />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary uppercase">
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
                      <Label className="flex items-center gap-2 uppercase text-xs font-bold">
                        <User className="w-4 h-4 text-primary/70" />
                        NOME COMPLETO
                      </Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="SEU NOME"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 uppercase text-xs font-bold">
                        <Building className="w-4 h-4 text-primary/70" />
                        CLÍNICA (OPCIONAL)
                      </Label>
                      <Input
                        value={clinic}
                        onChange={(e) => setClinic(e.target.value)}
                        placeholder="NOME DA SUA CLÍNICA"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 uppercase text-xs font-bold">
                        <User className="w-4 h-4 text-primary/70" />
                        FUNÇÃO NA EMPRESA
                      </Label>
                      <Input
                        value={jobFunction}
                        onChange={(e) => setJobFunction(e.target.value)}
                        placeholder="EX: CERAMISTA, RECEPÇÃO"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="flex items-center gap-2 uppercase text-xs font-bold">
                        <LinkIcon className="w-4 h-4 text-primary/70" />
                        LINK DO GRUPO DA CLÍNICA (WHATSAPP)
                      </Label>
                      <Input
                        value={whatsappGroupLink}
                        onChange={(e) => setWhatsappGroupLink(e.target.value)}
                        placeholder="EX: HTTPS://CHAT.WHATSAPP.COM/..."
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
                className="w-full sm:w-auto min-w-[150px] uppercase text-xs font-bold"
              >
                {savingProfile ? 'SALVANDO...' : 'SALVAR PERFIL'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="reset-password" className="space-y-6">
          <ResetPasswordTab />
        </TabsContent>

        {isAdmin && (
          <>
            <TabsContent value="system" className="space-y-6">
              <Card className="shadow-subtle">
                <CardHeader>
                  <CardTitle className="uppercase">CANAIS DE COMUNICAÇÃO</CardTitle>
                  <CardDescription className="uppercase text-xs font-semibold">
                    DEFINA OS LINKS DO WHATSAPP PARA ACESSO RÁPIDO PELO MENU LATERAL.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-bold uppercase text-xs">
                      <Phone className="w-4 h-4 text-emerald-500" />
                      WHATSAPP VITALI LAB (CONTATO LABORATÓRIO)
                    </Label>
                    <Input
                      value={labLink}
                      onChange={(e) => setLabLink(e.target.value)}
                      placeholder="EX: HTTPS://WA.ME/5511999999999"
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground uppercase font-semibold">
                      LINK GLOBAL DE CONTATO DIRETO PARA O NÚMERO DO LABORATÓRIO.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t px-6 py-4 flex justify-end rounded-b-lg">
                  <Button
                    onClick={handleSaveSystem}
                    disabled={savingSystem}
                    className="w-full sm:w-auto min-w-[150px] uppercase text-xs font-bold"
                  >
                    {savingSystem ? 'SALVANDO...' : 'SALVAR CONFIGURAÇÕES'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="work-schedule">
              <WorkSchedule />
            </TabsContent>

            <TabsContent value="scales" className="space-y-6">
              <Card className="shadow-subtle">
                <CardHeader>
                  <CardTitle className="uppercase">ESCALAS DE COR</CardTitle>
                  <CardDescription className="uppercase text-xs font-semibold">
                    GERENCIE AS OPÇÕES DE ESCALAS DE COR DISPONÍVEIS PARA OS DENTISTAS AO CRIAR
                    NOVOS PEDIDOS.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      placeholder="NOVA ESCALA (EX: VITA CLÁSSICA, BL, 3D MASTER)"
                      value={newScale}
                      onChange={(e) => setNewScale(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddScale()
                      }}
                      className="max-w-xs uppercase"
                    />
                    <Button onClick={handleAddScale} className="uppercase text-xs font-bold">
                      ADICIONAR
                    </Button>
                  </div>
                  <div className="space-y-2 mt-6">
                    <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase">
                      ESCALAS CADASTRADAS
                    </h3>
                    {scales.length === 0 ? (
                      <p className="text-xs text-muted-foreground uppercase font-semibold p-4 bg-muted/20 rounded border border-dashed text-center">
                        NENHUMA ESCALA CADASTRADA.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {scales.map((s, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-muted/10 hover:bg-muted/30 transition-colors rounded-lg border"
                          >
                            <span className="font-bold text-sm uppercase">{s}</span>
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

            <TabsContent value="brands" className="space-y-6">
              <Card className="shadow-subtle">
                <CardHeader>
                  <CardTitle className="uppercase">MARCAS DE COMPONENTES (IMPLANTES)</CardTitle>
                  <CardDescription className="uppercase text-xs font-semibold">
                    GERENCIE AS OPÇÕES DE MARCAS DISPONÍVEIS PARA SELEÇÃO EM TRABALHOS SOBRE
                    IMPLANTE.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      placeholder="NOVA MARCA (EX: NEODENT, STRAUMANN)"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddBrand()
                      }}
                      className="max-w-xs uppercase"
                    />
                    <Button onClick={handleAddBrand} className="uppercase text-xs font-bold">
                      ADICIONAR
                    </Button>
                  </div>
                  <div className="space-y-2 mt-6">
                    <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase">
                      MARCAS CADASTRADAS
                    </h3>
                    {implantBrands.length === 0 ? (
                      <p className="text-xs text-muted-foreground uppercase font-semibold p-4 bg-muted/20 rounded border border-dashed text-center">
                        NENHUMA MARCA CADASTRADA.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {implantBrands.map((b, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-muted/10 hover:bg-muted/30 transition-colors rounded-lg border"
                          >
                            <span className="font-bold text-sm uppercase">{b}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleRemoveBrand(b)}
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
      </Tabs>
    </div>
  )
}
