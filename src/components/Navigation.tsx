import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Plus, Search, Calendar, User, QrCode, BarChart3, CheckSquare } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

interface NavigationProps {
  user: any
}

export default function Navigation({ user }: NavigationProps) {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Descubrir', icon: Search },
    { href: '/create', label: 'Crear Evento', icon: Plus },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/todos', label: 'Tareas', icon: CheckSquare },
    { href: '/scanner', label: 'Escáner QR', icon: QrCode },
    { href: '/profile', label: 'Perfil', icon: User },
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="strike-gradient w-10 h-10 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-white">S</span>
            </div>
            <span className="text-xl font-bold text-foreground">Strike Events</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Info */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </div>
            ) : (
              <Button onClick={() => window.location.reload()}>Iniciar Sesión</Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-2">
                      <div className="strike-gradient w-8 h-8 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-white">S</span>
                      </div>
                      <span className="text-lg font-bold">Strike Events</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>

                  {/* Mobile User Info */}
                  <div className="border-t border-border pt-4">
                    {user ? (
                      <div className="flex items-center space-x-3 px-4 py-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-foreground">
                            {user.email?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Usuario</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4">
                        <Button className="w-full" onClick={() => window.location.reload()}>
                          Iniciar Sesión
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}