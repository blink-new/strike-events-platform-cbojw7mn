import Navigation from '../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

interface CreateEventPageProps {
  user: any
}

export default function CreateEventPage({ user }: CreateEventPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="strike-card">
          <CardHeader>
            <CardTitle>Crear Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Funcionalidad de creación de eventos próximamente...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}