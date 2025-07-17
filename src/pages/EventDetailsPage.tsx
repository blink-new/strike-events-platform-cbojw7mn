import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Users, Share2, Heart, QrCode, CreditCard } from 'lucide-react'
import Navigation from '../components/Navigation'
import PaymentModal from '../components/PaymentModal'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'
import { getEventById } from '../data/mockEvents'

interface EventDetailsPageProps {
  user: any
}



export default function EventDetailsPage({ user }: EventDetailsPageProps) {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentData, setPaymentData] = useState(null)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const eventData = getEventById(id || '1')
      setEvent(eventData)
      setLoading(false)
    }, 800)
  }, [id])

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Gratis'
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleRegister = () => {
    if (event.price > 0) {
      setShowPaymentModal(true)
    } else {
      // Free event - direct registration
      setIsRegistered(true)
      setShowQR(true)
      toast.success('¡Registro exitoso! Tu entrada gratuita está lista.')
    }
  }

  const handlePaymentSuccess = (payment: any) => {
    setPaymentData(payment)
    setIsRegistered(true)
    setShowQR(true)
    setShowPaymentModal(false)
    toast.success('¡Pago exitoso! Tu ticket está confirmado.')
  }

  const qrValue = `strike-events://event/${id}/ticket/${user?.id || 'guest'}`

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation user={user} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded-xl mb-8"></div>
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2 w-2/3"></div>
            <div className="h-4 bg-muted rounded mb-8 w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation user={user} />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Evento no encontrado</h1>
          <Link to="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a eventos
        </Link>

        {/* Event Header */}
        <div className="relative mb-8">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 md:h-80 object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black/40 rounded-xl"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <Badge className="mb-3 bg-white/20 text-white border-white/30">
              {event.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
            <p className="text-lg text-white/90">{event.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <Card className="strike-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Detalles del evento</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="font-medium">{formatDate(event.date)}</p>
                      <p className="text-sm text-muted-foreground">{event.time} - {event.endTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="font-medium">{event.location}</p>
                      <p className="text-sm text-muted-foreground">{event.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="font-medium">{event.attendees} de {event.maxAttendees} asistentes</p>
                      <p className="text-sm text-muted-foreground">
                        {event.maxAttendees - event.attendees} cupos disponibles
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="strike-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Descripción</h2>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: event.longDescription }}
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="strike-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Etiquetas</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card className="strike-card">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPrice(event.price, event.currency)}
                  </div>
                  <p className="text-sm text-muted-foreground">por persona</p>
                </div>

                {!isRegistered ? (
                  <Button 
                    className="w-full mb-4" 
                    size="lg"
                    onClick={handleRegister}
                  >
                    {event.price > 0 ? (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Comprar Ticket
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4 mr-2" />
                        Registrarse Gratis
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-800 font-medium">¡Registrado exitosamente!</p>
                      <p className="text-green-600 text-sm">Tu ticket está listo</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowQR(!showQR)}
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      {showQR ? 'Ocultar' : 'Mostrar'} QR
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* QR Code */}
            {showQR && (
              <Card className="strike-card">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-4">Tu ticket QR</h3>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <QRCode value={qrValue} size={200} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Presenta este código en el evento
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Organizer */}
            <Card className="strike-card">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Organizador</h3>
                <div className="flex items-center space-x-3">
                  <img
                    src={event.organizerImage}
                    alt={event.organizer}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{event.organizer}</p>
                    <p className="text-sm text-muted-foreground">Organizador verificado</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <Button variant="outline" className="w-full">
                  Ver más eventos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        event={{
          id: event.id,
          title: event.title,
          price: event.price,
          currency: event.currency,
          date: event.date,
          image: event.image
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}