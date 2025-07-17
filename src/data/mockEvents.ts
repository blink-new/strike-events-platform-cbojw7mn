export const mockEvents = [
  {
    id: '1',
    title: 'Conferencia Tech Bogotá 2024',
    description: 'El evento de tecnología más importante de Colombia. Únete a nosotros para una experiencia increíble con los mejores speakers de la industria tech latinoamericana.',
    longDescription: `
      <p>La Conferencia Tech Bogotá 2024 es el evento más esperado del año para profesionales de tecnología, emprendedores y estudiantes.</p>
      
      <h3>¿Qué incluye?</h3>
      <ul>
        <li>15+ charlas magistrales</li>
        <li>Workshops prácticos</li>
        <li>Networking con líderes de la industria</li>
        <li>Almuerzo y coffee breaks</li>
        <li>Certificado de participación</li>
      </ul>
      
      <h3>Speakers confirmados:</h3>
      <ul>
        <li>María González - CTO de Rappi</li>
        <li>Carlos Rodríguez - Founder de Platzi</li>
        <li>Ana Martínez - VP Engineering Google LATAM</li>
      </ul>
    `,
    date: '2024-02-15',
    time: '09:00',
    endTime: '18:00',
    location: 'Centro de Convenciones Ágora',
    address: 'Calle 24 #38-47, Bogotá',
    city: 'Bogotá',
    price: 150000,
    currency: 'COP',
    attendees: 245,
    maxAttendees: 500,
    category: 'Tecnología',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    organizer: 'TechColombia',
    organizerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    tags: ['Tecnología', 'Networking', 'Startups', 'AI', 'Web3']
  },
  {
    id: '2',
    title: 'Meetup React Medellín - Gratis',
    description: 'Encuentro mensual de la comunidad React en Medellín. Charlas, networking y pizza gratis para todos los asistentes.',
    longDescription: `
      <p>Únete a la comunidad más activa de React en Medellín para una noche de aprendizaje y networking.</p>
      
      <h3>Agenda:</h3>
      <ul>
        <li>18:00 - Registro y networking</li>
        <li>18:30 - "React Server Components en la práctica"</li>
        <li>19:15 - "Optimización de performance con React 18"</li>
        <li>20:00 - Pizza y networking</li>
      </ul>
      
      <h3>Speakers:</h3>
      <ul>
        <li>Andrés Pérez - Senior Frontend Developer</li>
        <li>Laura Gómez - React Specialist</li>
      </ul>
    `,
    date: '2024-02-20',
    time: '18:00',
    endTime: '21:00',
    location: 'Ruta N',
    address: 'Calle 67 #52-20, Medellín',
    city: 'Medellín',
    price: 0,
    currency: 'COP',
    attendees: 85,
    maxAttendees: 120,
    category: 'Tecnología',
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop',
    organizer: 'React Medellín',
    organizerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    tags: ['React', 'JavaScript', 'Frontend', 'Gratis', 'Networking']
  },
  {
    id: '3',
    title: 'Workshop Node.js Avanzado',
    description: 'Taller intensivo de Node.js para desarrolladores con experiencia. Aprende técnicas avanzadas y mejores prácticas.',
    longDescription: `
      <p>Un workshop intensivo de 8 horas diseñado para desarrolladores que quieren llevar sus habilidades de Node.js al siguiente nivel.</p>
      
      <h3>Temario:</h3>
      <ul>
        <li>Arquitectura de microservicios</li>
        <li>Performance y optimización</li>
        <li>Testing avanzado</li>
        <li>Deployment y DevOps</li>
        <li>Seguridad en aplicaciones Node.js</li>
      </ul>
      
      <h3>Incluye:</h3>
      <ul>
        <li>Material del workshop</li>
        <li>Almuerzo y coffee breaks</li>
        <li>Certificado de participación</li>
        <li>Acceso a repositorio privado</li>
      </ul>
    `,
    date: '2024-02-25',
    time: '08:00',
    endTime: '17:00',
    location: 'Universidad EAFIT',
    address: 'Carrera 49 #7 Sur-50, Medellín',
    city: 'Medellín',
    price: 280000,
    currency: 'COP',
    attendees: 28,
    maxAttendees: 30,
    category: 'Educación',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    organizer: 'DevEducation',
    organizerImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
    tags: ['Node.js', 'Backend', 'Workshop', 'Avanzado', 'Certificación']
  }
]

export const getEventById = (id: string) => {
  return mockEvents.find(event => event.id === id)
}