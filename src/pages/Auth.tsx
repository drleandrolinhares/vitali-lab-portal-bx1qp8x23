import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { ShieldAlert, Eye, EyeOff } from 'lucide-react'

type AuthView = 'login' | 'register' | 'forgot_password'

const PasswordInput = ({
  id,
  value,
  onChange,
  showPassword,
  onToggle,
}: {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showPassword: boolean
  onToggle: () => void
}) => (
  <div className="relative">
    <Input
      id={id}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      required
      minLength={6}
    />
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
      onClick={onToggle}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  </div>
)

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
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAdminView && view === 'register') setView('login')
  }, [isAdminView, view])

  const handleAction = async (e: React.FormEvent, action: () => Promise<{ error: any }>) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const { error } = await action()
    if (error) setError(error.message)
    else setMessage('Ação concluída com sucesso.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-elevation border-0">
        <CardHeader className="space-y-4 items-center text-center pb-8 bg-white pt-10 rounded-t-lg">
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
              {isAdminView ? 'Acesso restrito' : 'Acesse o portal do laboratório'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6 bg-card rounded-b-lg border-t border-border">
          {view === 'forgot_password' ? (
            <form
              onSubmit={(e) => handleAction(e, () => resetPassword(email))}
              className="space-y-4 animate-fade-in"
            >
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
              <Button type="submit" disabled={loading} className="w-full">
                Enviar Email
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setView('login')}
              >
                Voltar para Login
              </Button>
            </form>
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
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Cadastro</TabsTrigger>
                </TabsList>
              )}
              <TabsContent value="login" className="animate-fade-in">
                <form
                  onSubmit={(e) => handleAction(e, () => signIn(email, password, rememberMe))}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Senha</Label>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-xs"
                        onClick={() => setView('forgot_password')}
                      >
                        Esqueci minha senha
                      </Button>
                    </div>
                    <PasswordInput
                      id="login-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      showPassword={showPassword}
                      onToggle={() => setShowPassword(!showPassword)}
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
                  <Button type="submit" className="w-full" disabled={loading}>
                    Entrar
                  </Button>
                </form>
              </TabsContent>
              {!isAdminView && (
                <TabsContent value="register" className="animate-fade-in">
                  <form
                    onSubmit={(e) =>
                      handleAction(e, () =>
                        signUp(email, password, { name, clinic, role: 'dentist' }),
                      )
                    }
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label>Nome Completo</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Clínica</Label>
                      <Input value={clinic} onChange={(e) => setClinic(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Senha</Label>
                      <PasswordInput
                        id="reg-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        showPassword={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
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
          <div className="mt-8 border-t pt-6 flex flex-col items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-primary"
              onClick={() => navigate(isAdminView ? '/app' : '/dashboard')}
            >
              {isAdminView ? 'Voltar para Portal' : 'Acesso Administrativo'}
            </Button>

            <Button
              type="button"
              variant="link"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => navigate('/')}
            >
              &larr; Voltar para o Site Institucional
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
