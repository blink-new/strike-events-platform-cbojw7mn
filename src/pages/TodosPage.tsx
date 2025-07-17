import { useState, useEffect } from 'react'
import { Plus, Calendar, CheckCircle2, Circle, Trash2, Edit3, Filter, Search } from 'lucide-react'
import Navigation from '../components/Navigation'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Label } from '../components/ui/label'
import { toast } from 'sonner'

interface TodosPageProps {
  user: any
}

interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: 'general' | 'event-planning' | 'marketing' | 'logistics'
  dueDate?: string
  eventId?: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'strike-events-todos'

export default function TodosPage({ user }: TodosPageProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: 'general' as const,
    dueDate: '',
    eventId: ''
  })

  // Load todos from localStorage on mount
  useEffect(() => {
    if (user?.id) {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${user.id}`)
      if (stored) {
        try {
          setTodos(JSON.parse(stored))
        } catch (error) {
          console.error('Error loading todos:', error)
        }
      }
    }
  }, [user?.id])

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (user?.id && todos.length >= 0) {
      localStorage.setItem(`${STORAGE_KEY}-${user.id}`, JSON.stringify(todos))
    }
  }, [todos, user?.id])

  const generateId = () => `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const createTodo = () => {
    if (!formData.title.trim()) {
      toast.error('El título es requerido')
      return
    }

    const newTodo: Todo = {
      id: generateId(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      completed: false,
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate || undefined,
      eventId: formData.eventId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setTodos(prev => [newTodo, ...prev])
    resetForm()
    setIsCreateDialogOpen(false)
    toast.success('Tarea creada exitosamente')
  }

  const updateTodo = () => {
    if (!editingTodo || !formData.title.trim()) {
      toast.error('El título es requerido')
      return
    }

    setTodos(prev => prev.map(todo => 
      todo.id === editingTodo.id 
        ? {
            ...todo,
            title: formData.title.trim(),
            description: formData.description.trim(),
            priority: formData.priority,
            category: formData.category,
            dueDate: formData.dueDate || undefined,
            eventId: formData.eventId || undefined,
            updatedAt: new Date().toISOString()
          }
        : todo
    ))

    resetForm()
    setEditingTodo(null)
    toast.success('Tarea actualizada exitosamente')
  }

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
        : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
    toast.success('Tarea eliminada')
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'general',
      dueDate: '',
      eventId: ''
    })
  }

  const openEditDialog = (todo: Todo) => {
    setEditingTodo(todo)
    setFormData({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      category: todo.category,
      dueDate: todo.dueDate || '',
      eventId: todo.eventId || ''
    })
  }

  const closeDialogs = () => {
    setIsCreateDialogOpen(false)
    setEditingTodo(null)
    resetForm()
  }

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         todo.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority
    const matchesCategory = filterCategory === 'all' || todo.category === filterCategory
    
    return matchesSearch && matchesPriority && matchesCategory
  })

  const completedTodos = filteredTodos.filter(todo => todo.completed)
  const pendingTodos = filteredTodos.filter(todo => !todo.completed)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      'general': 'General',
      'event-planning': 'Planificación',
      'marketing': 'Marketing',
      'logistics': 'Logística'
    }
    return labels[category as keyof typeof labels] || category
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation user={user} />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Inicia sesión para ver tus tareas</h1>
          <Button onClick={() => window.location.reload()}>Iniciar Sesión</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mis Tareas</h1>
            <p className="text-muted-foreground">
              Organiza y gestiona tus tareas de eventos
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Tarea
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Crear Nueva Tarea</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título de la tarea"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descripción opcional"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Prioridad</Label>
                    <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="event-planning">Planificación</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="logistics">Logística</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="dueDate">Fecha límite</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={createTodo} className="flex-1">
                    Crear Tarea
                  </Button>
                  <Button variant="outline" onClick={closeDialogs}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="strike-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todos.length}</div>
            </CardContent>
          </Card>

          <Card className="strike-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingTodos.length}</div>
            </CardContent>
          </Card>

          <Card className="strike-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedTodos.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar tareas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="event-planning">Planificación</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="logistics">Logística</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Todos Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              Pendientes ({pendingTodos.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completadas ({completedTodos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingTodos.length === 0 ? (
              <Card className="strike-card">
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">¡No hay tareas pendientes!</h3>
                  <p className="text-muted-foreground mb-4">
                    Todas tus tareas están completadas o puedes crear una nueva.
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Tarea
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {pendingTodos.map((todo) => (
                  <Card key={todo.id} className="strike-card hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTodo(todo.id)}
                          className="mt-1 p-0 h-auto"
                        >
                          <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                        </Button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="font-medium text-foreground mb-1">{todo.title}</h3>
                              {todo.description && (
                                <p className="text-sm text-muted-foreground mb-2">{todo.description}</p>
                              )}
                              
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className={getPriorityColor(todo.priority)}>
                                  {todo.priority === 'high' ? 'Alta' : todo.priority === 'medium' ? 'Media' : 'Baja'}
                                </Badge>
                                <Badge variant="outline">
                                  {getCategoryLabel(todo.category)}
                                </Badge>
                                {todo.dueDate && (
                                  <Badge variant={isOverdue(todo.dueDate) ? "destructive" : "secondary"}>
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {formatDate(todo.dueDate)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(todo)}
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTodo(todo.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedTodos.length === 0 ? (
              <Card className="strike-card">
                <CardContent className="py-12 text-center">
                  <Circle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay tareas completadas</h3>
                  <p className="text-muted-foreground">
                    Las tareas completadas aparecerán aquí.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {completedTodos.map((todo) => (
                  <Card key={todo.id} className="strike-card opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTodo(todo.id)}
                          className="mt-1 p-0 h-auto"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </Button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="font-medium text-foreground mb-1 line-through">{todo.title}</h3>
                              {todo.description && (
                                <p className="text-sm text-muted-foreground mb-2 line-through">{todo.description}</p>
                              )}
                              
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className={getPriorityColor(todo.priority)}>
                                  {todo.priority === 'high' ? 'Alta' : todo.priority === 'medium' ? 'Media' : 'Baja'}
                                </Badge>
                                <Badge variant="outline">
                                  {getCategoryLabel(todo.category)}
                                </Badge>
                                {todo.dueDate && (
                                  <Badge variant="secondary">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {formatDate(todo.dueDate)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTodo(todo.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTodo} onOpenChange={(open) => !open && closeDialogs()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Tarea</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Título *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Título de la tarea"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción opcional"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-priority">Prioridad</Label>
                <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-category">Categoría</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="event-planning">Planificación</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="logistics">Logística</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-dueDate">Fecha límite</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={updateTodo} className="flex-1">
                Actualizar
              </Button>
              <Button variant="outline" onClick={closeDialogs}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}