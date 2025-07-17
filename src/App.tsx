import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import blink from './blink/client'
import HomePage from './pages/HomePage'
import EventDetailsPage from './pages/EventDetailsPage'
import CreateEventPage from './pages/CreateEventPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import QRScannerPage from './pages/QRScannerPage'
import TodosPage from './pages/TodosPage'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/event/:id" element={<EventDetailsPage user={user} />} />
          <Route path="/create" element={<CreateEventPage user={user} />} />
          <Route path="/dashboard" element={<DashboardPage user={user} />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/scanner" element={<QRScannerPage user={user} />} />
          <Route path="/todos" element={<TodosPage user={user} />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </div>
    </Router>
  )
}

export default App