import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Camera, 
  CheckCircle, 
  XCircle, 
  Users, 
  Clock,
  Search,
  Download,
  RefreshCw,
  QrCode
} from 'lucide-react'
import Navigation from '../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
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
import { toast } from 'sonner'

interface QRScannerPageProps {
  user: any
}

// Mock data para el escáner
const mockEvent = {
  id: '1',
  title: 'Conferencia Tech Bogotá 2024',
  date: '2024-02-15',
  totalTickets: 245,
  checkedIn: 180,
  pending: 65
}

const mockAttendees = [
  {
    id: '1',
    name: 'María González',
    email: 'maria@example.com',
    ticketId: 'TKT-001',
    checkedIn: true,
    checkedInAt: '2024-02-15T09:15:00Z',
    ticketType: 'General'
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    ticketId: 'TKT-002',
    checkedIn: true,
    checkedInAt: '2024-02-15T09:22:00Z',
    ticketType: 'VIP'
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana@example.com',
    ticketId: 'TKT-003',
    checkedIn: false,
    checkedInAt: null,
    ticketType: 'General'
  }
]

export default function QRScannerPage({ user }: QRScannerPageProps) {
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('event') || '1'
  
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [attendees, setAttendees] = useState(mockAttendees)
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState(mockEvent)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const filteredAttendees = attendees.filter(attendee =>
    attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
      setIsScanning(true)
    } catch (error) {
      toast.error('No se pudo acceder a la cámara')
      console.error('Camera error:', error)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const simulateQRScan = () => {
    // Simular escaneo exitoso
    const mockScanResult = {
      ticketId: 'TKT-004',
      attendeeName: 'Juan Pérez',
      email: 'juan@example.com',
      valid: true,
      alreadyCheckedIn: false
    }
    
    setScanResult(mockScanResult)
    
    if (mockScanResult.valid && !mockScanResult.alreadyCheckedIn) {
      // Actualizar estadísticas
      setStats(prev => ({
        ...prev,
        checkedIn: prev.checkedIn + 1,
        pending: prev.pending - 1
      }))
      
      // Agregar a la lista de asistentes
      const newAttendee = {
        id: Date.now().toString(),
        name: mockScanResult.attendeeName,
        email: mockScanResult.email,
        ticketId: mockScanResult.ticketId,
        checkedIn: true,
        checkedInAt: new Date().toISOString(),
        ticketType: 'General'
      }
      
      setAttendees(prev => [newAttendee, ...prev])
      toast.success(`Check-in exitoso: ${mockScanResult.attendeeName}`)
    } else if (mockScanResult.alreadyCheckedIn) {
      toast.warning('Este ticket ya fue utilizado')
    } else {
      toast.error('Ticket inválido')
    }
    
    // Limpiar resultado después de 3 segundos
    setTimeout(() => setScanResult(null), 3000)
  }

  const manualCheckin = (attendeeId: string) => {
    setAttendees(prev => prev.map(attendee => 
      attendee.id === attendeeId 
        ? { ...attendee, checkedIn: true, checkedInAt: new Date().toISOString() }
        : attendee
    ))
    
    setStats(prev => ({
      ...prev,
      checkedIn: prev.checkedIn + 1,
      pending: prev.pending - 1
    }))
    
    toast.success('Check-in manual completado')
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Escáner QR</h1>
          <p className="text-muted-foreground">
            Gestiona el check-in de asistentes para: <strong>{stats.title}</strong>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="strike-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTickets}</div>
              <p className="text-xs text-muted-foreground">
                Tickets vendidos
              </p>
            </CardContent>
          </Card>

          <Card className="strike-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Check-in Completado</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.checkedIn}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.checkedIn / stats.totalTickets) * 100)}% del total
              </p>
            </CardContent>
          </Card>

          <Card className="strike-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Por hacer check-in
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="scanner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scanner">Escáner QR</TabsTrigger>
            <TabsTrigger value="attendees">Lista de Asistentes</TabsTrigger>
          </TabsList>

          {/* Scanner Tab */}
          <TabsContent value="scanner" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Camera Section */}
              <Card className="strike-card">
                <CardHeader>
                  <CardTitle>Cámara QR</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                    {isScanning ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-white">
                        <div className="text-center">
                          <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p>Cámara desactivada</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Scanning overlay */}
                    {isScanning && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 border-2 border-primary rounded-lg animate-pulse">
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary"></div>
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary"></div>
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {!isScanning ? (
                      <Button onClick={startCamera} className="flex-1">
                        <Camera className="w-4 h-4 mr-2" />
                        Iniciar Cámara
                      </Button>
                    ) : (
                      <>
                        <Button onClick={stopCamera} variant="outline" className="flex-1">
                          Detener
                        </Button>
                        <Button onClick={simulateQRScan} className="flex-1">
                          Simular Escaneo
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Scan Result Section */}
              <Card className="strike-card">
                <CardHeader>
                  <CardTitle>Resultado del Escaneo</CardTitle>
                </CardHeader>
                <CardContent>
                  {scanResult ? (
                    <div className={`p-6 rounded-lg border-2 ${
                      scanResult.valid && !scanResult.alreadyCheckedIn
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-center mb-4">
                        {scanResult.valid && !scanResult.alreadyCheckedIn ? (
                          <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                        ) : (
                          <XCircle className="w-8 h-8 text-red-600 mr-3" />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">
                            {scanResult.valid && !scanResult.alreadyCheckedIn 
                              ? 'Check-in Exitoso' 
                              : scanResult.alreadyCheckedIn 
                                ? 'Ticket Ya Utilizado'
                                : 'Ticket Inválido'
                            }
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Ticket: {scanResult.ticketId}
                          </p>
                        </div>
                      </div>
                      
                      {scanResult.valid && (
                        <div className="space-y-2">
                          <p><strong>Nombre:</strong> {scanResult.attendeeName}</p>
                          <p><strong>Email:</strong> {scanResult.email}</p>
                          <p><strong>Hora:</strong> {new Date().toLocaleTimeString('es-ES')}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Escanea un código QR para ver los resultados</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Attendees Tab */}
          <TabsContent value="attendees" className="space-y-6">
            <Card className="strike-card">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>Lista de Asistentes</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Buscar asistente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Actualizar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asistente</TableHead>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendees.map((attendee) => (
                      <TableRow key={attendee.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{attendee.name}</p>
                            <p className="text-sm text-muted-foreground">{attendee.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {attendee.ticketId}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant={attendee.ticketType === 'VIP' ? 'default' : 'secondary'}>
                            {attendee.ticketType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {attendee.checkedIn ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Confirmado
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              Pendiente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {attendee.checkedInAt ? (
                            <div className="text-sm">
                              <p>{new Date(attendee.checkedInAt).toLocaleDateString('es-ES')}</p>
                              <p className="text-muted-foreground">
                                {new Date(attendee.checkedInAt).toLocaleTimeString('es-ES')}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {!attendee.checkedIn && (
                            <Button 
                              size="sm" 
                              onClick={() => manualCheckin(attendee.id)}
                            >
                              Check-in Manual
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}