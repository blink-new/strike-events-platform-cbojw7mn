import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  QrCode,
  Plus,
  MoreHorizontal,
  Download,
  Share2
} from 'lucide-react'
import Navigation from '../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import { Progress } from '../components/ui/progress'

interface DashboardPageProps {
  user: any
}

// Mock data para el dashboard
const mockStats = {
  totalEvents: 12,
  totalRevenue: 2450000,
  totalAttendees: 1250,
  avgAttendance: 85
}

const mockEvents = [
  {
    id: '1',
    title: 'Conferencia Tech Bogotá 2024',
    date: '2024-02-15',
    status: 'active',
    attendees: 245,
    maxAttendees: 500,
    revenue: 36750000,
    price: 150000,
    checkedIn: 180
  },
  {
    id: '2',
    title: 'Workshop React Avanzado',
    date: '2024-02-20',
    status: 'draft',
    attendees: 45,
    maxAttendees: 50,
    revenue: 2250000,
    price: 50000,
    checkedIn: 0
  },
  {
    id: '3',
    title: 'Networking Startups Medellín',
    date: '2024-01-28',
    status: 'completed',
    attendees: 120,
    maxAttendees: 150,
    revenue: 0,
    price: 0,
    checkedIn: 115
  }
]

const mockRecentActivity = [
  {
    id: '1',
    type: 'registration',
    message: 'Nueva inscripción en Conferencia Tech Bogotá',
    time: '2 min',
    amount: 150000
  },
  {
    id: '2',
    type: 'payment',
    message: 'Pago confirmado - Workshop React',
    time: '15 min',
    amount: 50000
  },
  {
    id: '3',
    type: 'checkin',
    message: 'Check-in completado - Networking Startups',
    time: '1 hora',
    amount: null
  }
]

export default function DashboardPage({ user }: DashboardPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      draft: 'secondary',
      completed: 'outline'
    }
    const labels = {
      active: 'Activo',
      draft: 'Borrador',
      completed: 'Completado'
    }
    return (
      <Badge variant={variants[status] as any}>
        {labels[status]}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Gestiona tus eventos y analiza el rendimiento
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Link to="/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Crear Evento
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="strike-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                +2 desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card className="strike-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockStats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                +15% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card className="strike-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Asistentes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalAttendees}</div>
              <p className="text-xs text-muted-foreground">
                +8% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card className="strike-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencia Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.avgAttendance}%</div>
              <p className="text-xs text-muted-foreground">
                +3% desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events">Mis Eventos</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card className="strike-card">
              <CardHeader>
                <CardTitle>Eventos Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evento</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Asistentes</TableHead>
                      <TableHead>Ingresos</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {event.price === 0 ? 'Gratis' : formatCurrency(event.price)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(event.date).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(event.status)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{event.attendees}/{event.maxAttendees}</span>
                              <span>{Math.round((event.attendees / event.maxAttendees) * 100)}%</span>
                            </div>
                            <Progress 
                              value={(event.attendees / event.maxAttendees) * 100} 
                              className="h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(event.revenue)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{event.checkedIn}</span>
                            <Link to={`/scanner?event=${event.id}`}>
                              <Button size="sm" variant="outline">
                                <QrCode className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/event/${event.id}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver evento
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="w-4 h-4 mr-2" />
                                Compartir
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Exportar datos
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="strike-card">
                <CardHeader>
                  <CardTitle>Ventas por Mes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Gráfico de ventas próximamente
                  </div>
                </CardContent>
              </Card>

              <Card className="strike-card">
                <CardHeader>
                  <CardTitle>Eventos por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Tecnología</span>
                      <div className="flex items-center gap-2">
                        <Progress value={60} className="w-20 h-2" />
                        <span className="text-sm text-muted-foreground">60%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Networking</span>
                      <div className="flex items-center gap-2">
                        <Progress value={25} className="w-20 h-2" />
                        <span className="text-sm text-muted-foreground">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Educación</span>
                      <div className="flex items-center gap-2">
                        <Progress value={15} className="w-20 h-2" />
                        <span className="text-sm text-muted-foreground">15%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="strike-card">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'registration' ? 'bg-blue-500' :
                          activity.type === 'payment' ? 'bg-green-500' : 'bg-orange-500'
                        }`} />
                        <div>
                          <p className="font-medium">{activity.message}</p>
                          <p className="text-sm text-muted-foreground">Hace {activity.time}</p>
                        </div>
                      </div>
                      {activity.amount && (
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            +{formatCurrency(activity.amount)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}