import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'

type AuthView = 'login' | 'register' | 'forgot_password'

export default function AuthPage() {
  const { signIn, signUp, resetPassword } = useAuth()
  const [view, setView] = useState<AuthView>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [clinic, setClinic] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

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
          <div className="flex items-center justify-center gap-2 font-display tracking-tight text-4xl md:text-5xl mb-2">
            <span className="font-extrabold text-[#E6007E]">VITALI</span>
            <span className="font-light text-[#E6007E]">LAB</span>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-[#E6007E]">
              REQUISIÇÃO DIGITAL
            </CardTitle>
            <CardDescription className="text-base">Acesse o portal do laboratório</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6 bg-card">
          {view === 'forgot_password' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-4 space-y-2">
                <h3 className="text-lg font-medium text-[#E6007E]">Recuperar Senha</h3>
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
                  <Button
                    type="submit"
                    className="bg-[#E6007E] hover:bg-[#C5006C] text-white"
                    disabled={loading}
                  >
                    Enviar Email
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="hover:text-[#E6007E]"
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
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:text-[#E6007E]">
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:text-[#E6007E]">
                  Cadastro
                </TabsTrigger>
              </TabsList>

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
                        className="p-0 h-auto text-xs font-normal text-muted-foreground hover:text-[#E6007E]"
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
                      className="data-[state=checked]:bg-[#E6007E] data-[state=checked]:border-[#E6007E]"
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
                  <Button
                    type="submit"
                    className="w-full bg-[#E6007E] hover:bg-[#C5006C] text-white"
                    disabled={loading}
                  >
                    Entrar
                  </Button>
                </form>
              </TabsContent>

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
                  <Button
                    type="submit"
                    className="w-full bg-[#E6007E] hover:bg-[#C5006C] text-white"
                    disabled={loading}
                  >
                    Criar Conta
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
