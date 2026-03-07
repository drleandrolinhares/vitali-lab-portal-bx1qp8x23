import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

const mockDentists = [
  {
    id: 'd1',
    name: 'Dra. Ana Souza',
    clinic: 'Sorriso Clínica',
    email: 'ana@sorriso.com',
    phone: '(11) 9999-8888',
    activeCases: 2,
  },
  {
    id: 'd2',
    name: 'Dr. João Pedro',
    clinic: 'OdontoPrime',
    email: 'joao@odontoprime.com',
    phone: '(11) 7777-6666',
    activeCases: 5,
  },
  {
    id: 'd3',
    name: 'Dra. Camila Lima',
    clinic: 'Vitalitá',
    email: 'camila@vitalita.com',
    phone: '(11) 5555-4444',
    activeCases: 0,
  },
]

export default function DentistsPage() {
  const { currentUser } = useAppStore()

  if (currentUser.role !== 'lab') {
    return <div className="p-8 text-center text-red-500">Acesso negado. Apenas laboratório.</div>
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Diretório de Dentistas</h2>
        <p className="text-muted-foreground">Gerencie seus clientes e clínicas parceiras.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockDentists.map((dentist) => (
          <Card key={dentist.id} className="shadow-subtle hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
              <Avatar className="w-12 h-12 border-2 border-primary/10">
                <AvatarFallback className="bg-primary/5 text-primary text-lg font-semibold">
                  {dentist.name.charAt(4) || dentist.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-lg">{dentist.name}</CardTitle>
                <CardDescription>{dentist.clinic}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" /> {dentist.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" /> {dentist.phone}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" /> São Paulo, SP
              </div>
              <div className="pt-4 flex items-center justify-between border-t mt-4">
                <span className="font-medium text-foreground">
                  Casos Ativos: <span className="text-primary">{dentist.activeCases}</span>
                </span>
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-primary">
                  Ver Histórico <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
