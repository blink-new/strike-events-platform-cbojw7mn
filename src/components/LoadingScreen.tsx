import { Loader2 } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="strike-gradient w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <span className="text-2xl font-bold text-white">S</span>
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Strike Events</h2>
        <p className="text-muted-foreground">Cargando tu experiencia de eventos...</p>
      </div>
    </div>
  )
}