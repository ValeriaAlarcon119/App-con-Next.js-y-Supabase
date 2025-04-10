'use client'

import { useRouter } from 'next/navigation'
import { Github, Instagram, Linkedin, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="grid gap-8 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary/50 bg-clip-text text-transparent animate-gradient mb-6">
            Bienvenido a Grayola
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Somos un estudio creativo especializado en diseño gráfico, branding y desarrollo web. 
            Transformamos ideas en experiencias visuales impactantes que conectan con tu audiencia.
          </p>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Button 
              size="lg" 
              className="w-full md:w-auto"
              onClick={() => router.push('/projects')}
            >
              Ver proyectos
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Contacto</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+52 55 1234 5678</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contacto@grayola.com</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Síguenos</h3>
              <div className="flex items-center gap-3">
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-pink-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20">
                    <Instagram className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-800 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800">
                    <Github className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative rounded-lg bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-8 shadow-sm border">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">Sobre Grayola</h2>
              <p className="text-muted-foreground">
                Fundada en 2023, Grayola nace con la misión de ofrecer soluciones creativas 
                que combinen estética y funcionalidad para empresas y emprendedores.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-medium">Nuestros servicios</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>Diseño gráfico y branding</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  <span>Desarrollo web y aplicaciones</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>Estrategia de contenidos</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  <span>Marketing digital</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="absolute -top-4 -right-4 h-24 w-24 bg-gradient-to-br from-primary to-accent rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 h-32 w-32 bg-gradient-to-br from-accent to-primary rounded-full opacity-10 blur-3xl"></div>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6 text-center">¿Por qué elegirnos?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="border rounded-lg p-6 bg-card">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2 text-center">Eficiencia</h3>
            <p className="text-muted-foreground text-center">
              Nuestro proceso de trabajo optimizado garantiza resultados en tiempo récord sin comprometer la calidad.
            </p>
          </div>
          
          <div className="border rounded-lg p-6 bg-card">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2 text-center">Innovación</h3>
            <p className="text-muted-foreground text-center">
              Combinamos las últimas tendencias con soluciones creativas para hacer destacar tu marca.
            </p>
          </div>
          
          <div className="border rounded-lg p-6 bg-card">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2 text-center">Personalización</h3>
            <p className="text-muted-foreground text-center">
              Cada proyecto es único y recibe atención personalizada adaptada a tus objetivos específicos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 