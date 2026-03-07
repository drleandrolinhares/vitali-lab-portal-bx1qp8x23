import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { ShieldAlert } from 'lucide-react'

type AuthView = 'login' | 'register' | 'forgot_password'

export default function AuthPage() {
  const { signIn, signUp, resetPassword } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isAdminView = location.pathname === '/dashboard'

  const [view, setView] = useState<AuthView>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [clinic, setClinic] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAdminView && view === 'register') {
      setView('login')
    }
  }, [isAdminView, view])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const { error } = await signIn(email, password, rememberMe)
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const { error } = await signUp(email, password, { name, clinic, role: 'dentist' })
    if (error) setError(error.message)
    else setMessage('Conta criada com sucesso! Você já pode fazer login.')
    setLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const { error } = await resetPassword(email)
    if (error) setError(error.message)
    else setMessage('Email de recuperação enviado! Verifique sua caixa de entrada.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-elevation overflow-hidden border-0">
        <CardHeader className="space-y-4 items-center text-center pb-8 bg-white pt-10">
          {isAdminView ? (
            <div className="flex items-center justify-center mb-2 bg-slate-900 text-white p-4 rounded-full shadow-lg">
              <ShieldAlert className="w-8 h-8" />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 font-display tracking-tight text-4xl md:text-5xl mb-2">
              <span className="font-extrabold text-primary">VITALI</span>
              <span className="font-light text-primary">LAB</span>
            </div>
          )}
          <div className="space-y-2">
            <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-primary">
              {isAdminView ? 'PAINEL ADMINISTRATIVO' : 'REQUISIÇÃO DIGITAL'}
            </CardTitle>
            <CardDescription className="text-base">
              {isAdminView
                ? 'Acesso restrito à gestão do laboratório'
                : 'Acesse o portal do laboratório'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6 bg-card">
          {view === 'forgot_password' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-4 space-y-2">
                <h3 className="text-lg font-medium text-primary">Recuperar Senha</h3>
                <p className="text-sm text-muted-foreground">
                  Digite seu email para receber um link de recuperação.
                </p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                {message && <p className="text-sm text-green-600 font-medium">{message}</p>}
                <div className="flex flex-col gap-2 pt-2">
                  <Button type="submit" disabled={loading}>
                    Enviar Email
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="hover:text-primary"
                    onClick={() => {
                      setView('login')
                      setError('')
                      setMessage('')
                    }}
                  >
                    Voltar para o Login
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <Tabs
              value={view}
              onValueChange={(v) => {
                setView(v as AuthView)
                setError('')
                setMessage('')
              }}
              className="w-full"
            >
              {!isAdminView && (
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="data-[state=active]:text-primary">
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:text-primary">
                    Cadastro
                  </TabsTrigger>
                </TabsList>
              )}
              {isAdminView && (
                <div className="mb-6 flex justify-center">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest bg-muted px-4 py-1.5 rounded-full">
                    Acesso Restrito
                  </span>
                </div>
              )}

              <TabsContent value="login" className="animate-fade-in">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-xs font-normal text-muted-foreground hover:text-primary"
                        onClick={() => setView('forgot_password')}
                      >
                        Esqueci minha senha
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(c) => setRememberMe(c as boolean)}
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm font-normal cursor-pointer text-muted-foreground"
                    >
                      Permanecer conectado
                    </Label>
                  </div>
                  {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                  {message && <p className="text-sm text-green-600 font-medium">{message}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    Entrar
                  </Button>
                </form>
              </TabsContent>

              {!isAdminView && (
                <TabsContent value="register" className="animate-fade-in">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Nome Completo</Label>
                      <Input
                        id="reg-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinic">Nome da Clínica</Label>
                      <Input
                        id="clinic"
                        value={clinic}
                        onChange={(e) => setClinic(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Senha</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                    {message && <p className="text-sm text-green-600 font-medium">{message}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                      Criar Conta
                    </Button>
                  </form>
                </TabsContent>
              )}
            </Tabs>
          )}

          <div className="mt-8 border-t pt-6 flex flex-col items-center">
            {!isAdminView ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-primary"
                onClick={() => navigate('/dashboard')}
              >
                Acesso Administrativo (Gestão)
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-primary"
                onClick={() => navigate('/')}
              >
                Voltar para Portal de Dentistas
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
