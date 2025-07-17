import { useState } from 'react'
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Check,
  ArrowLeft,
  Lock,
  AlertCircle
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Card, CardContent } from './ui/card'
import { toast } from 'sonner'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  event: {
    id: string
    title: string
    price: number
    currency: string
    date: string
    image: string
  }
  onSuccess: (paymentData: any) => void
}

const paymentMethods = [
  {
    id: 'card',
    name: 'Tarjeta de Crédito/Débito',
    icon: CreditCard,
    description: 'Visa, Mastercard, American Express',
    fees: 'Sin comisión adicional'
  },
  {
    id: 'pse',
    name: 'PSE',
    icon: Building2,
    description: 'Pago Seguro en Línea',
    fees: 'COP $3,500 por transacción'
  },
  {
    id: 'nequi',
    name: 'Nequi',
    icon: Smartphone,
    description: 'Pago con tu cuenta Nequi',
    fees: 'Sin comisión adicional'
  },
  {
    id: 'mercadopago',
    name: 'MercadoPago',
    icon: CreditCard,
    description: 'Tarjetas y efectivo',
    fees: '2.9% + COP $900'
  }
]

export default function PaymentModal({ isOpen, onClose, event, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success'>('method')
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    document: ''
  })

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  const calculateTotal = () => {
    const basePrice = event.price
    const method = paymentMethods.find(m => m.id === selectedMethod)
    
    let fees = 0
    if (selectedMethod === 'pse') {
      fees = 3500
    } else if (selectedMethod === 'mercadopago') {
      fees = basePrice * 0.029 + 900
    }
    
    return basePrice + fees
  }

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
  }

  const handleContinue = () => {
    setStep('details')
  }

  const handlePayment = async () => {
    setLoading(true)
    setStep('processing')
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setStep('success')
    setLoading(false)
    
    // Call success callback
    setTimeout(() => {
      onSuccess({
        paymentId: 'pay_' + Date.now(),
        method: selectedMethod,
        amount: calculateTotal(),
        currency: event.currency
      })
      onClose()
      setStep('method') // Reset for next time
    }, 2000)
  }

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Selecciona tu método de pago</h3>
        <p className="text-sm text-muted-foreground">
          Elige cómo quieres pagar tu ticket para {event.title}
        </p>
      </div>

      <RadioGroup value={selectedMethod} onValueChange={handleMethodSelect}>
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <div key={method.id} className="flex items-center space-x-3">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label 
                  htmlFor={method.id} 
                  className="flex-1 cursor-pointer"
                >
                  <Card className={`p-4 transition-colors ${
                    selectedMethod === method.id ? 'border-primary bg-primary/5' : ''
                  }`}>
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                        <p className="text-xs text-green-600 mt-1">{method.fees}</p>
                      </div>
                    </div>
                  </Card>
                </Label>
              </div>
            )
          })}
        </div>
      </RadioGroup>

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleContinue}>
          Continuar
        </Button>
      </div>
    </div>
  )

  const renderPaymentDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setStep('method')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold">Información de pago</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Juan Pérez"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="juan@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+57 300 123 4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="document">Documento</Label>
            <Input
              id="document"
              value={formData.document}
              onChange={(e) => setFormData(prev => ({ ...prev, document: e.target.value }))}
              placeholder="12345678"
            />
          </div>
        </div>

        {selectedMethod === 'card' && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número de tarjeta</Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Fecha de vencimiento</Label>
                  <Input
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    placeholder="MM/AA"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={formData.cvv}
                    onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={() => setStep('method')}>
          Volver
        </Button>
        <Button onClick={handlePayment} disabled={loading}>
          <Lock className="w-4 h-4 mr-2" />
          Pagar {formatPrice(calculateTotal(), event.currency)}
        </Button>
      </div>
    </div>
  )

  const renderProcessing = () => (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
      <h3 className="text-lg font-semibold mb-2">Procesando pago...</h3>
      <p className="text-muted-foreground">
        Por favor no cierres esta ventana
      </p>
    </div>
  )

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2">¡Pago exitoso!</h3>
      <p className="text-muted-foreground mb-4">
        Tu ticket ha sido confirmado
      </p>
      <Badge className="bg-green-100 text-green-800">
        Ticket confirmado
      </Badge>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Pago Seguro
          </DialogTitle>
        </DialogHeader>

        {/* Event Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <img
                src={event.image}
                alt={event.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{event.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm">Subtotal:</span>
                  <span className="font-medium">{formatPrice(event.price, event.currency)}</span>
                </div>
                {calculateTotal() > event.price && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Comisión:</span>
                    <span className="text-sm">{formatPrice(calculateTotal() - event.price, event.currency)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(calculateTotal(), event.currency)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Steps */}
        {step === 'method' && renderMethodSelection()}
        {step === 'details' && renderPaymentDetails()}
        {step === 'processing' && renderProcessing()}
        {step === 'success' && renderSuccess()}

        {/* Security Notice */}
        {step !== 'success' && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
            <Lock className="w-4 h-4" />
            <span>
              Tus datos están protegidos con encriptación SSL de 256 bits
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}