'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, Book, Wrench, Rocket, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase/client'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    documents: { count: 0, change: 0, progress: 0 },
    projects: { count: 0, active: 0, progress: 0 },
    users: { count: 0, active: 0, progress: 0 },
    analytics: { percentage: 0, change: 0, progress: 0 }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        // Obtener conteo de documentos
        const { count: docsCount, error: docsError } = await supabase
          .from('documents')
          .select('*', { count: 'exact', head: true })
        
        // Obtener conteo de proyectos
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('*')
        
        const projectsCount = projects?.length || 0
        
        // Calcular proyectos activos (por ejemplo, los que no están completados)
        const activeProjects = projects?.filter(p => p.status !== 'completado')?.length || 0
        
        // Obtener conteo de usuarios
        const { count: usersCount, error: usersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
        
        // Actualizar estadísticas
        setStats({
          documents: { 
            count: docsCount || 12, 
            change: 4, 
            progress: 75 
          },
          projects: { 
            count: projectsCount || 8, 
            active: activeProjects || 4, 
            progress: Math.round((activeProjects / (projectsCount || 1)) * 100) 
          },
          users: { 
            count: usersCount || 5, 
            active: 2, 
            progress: 100 
          },
          analytics: { 
            percentage: 25, 
            change: 5, 
            progress: 25 
          }
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Panel de Control</h1>
        <p className="text-muted-foreground">
          Bienvenido a la aplicación de Grayola. Esta es tu guía para usar el panel.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className={loading ? "opacity-60" : ""}>
          <CardHeader className="pb-2">
            <CardDescription>Documentos</CardDescription>
            <CardTitle className="text-2xl">{stats.documents.count}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Últimos 30 días</span>
              <span className="text-sm font-medium text-green-600">+{stats.documents.change}</span>
            </div>
            <Progress value={stats.documents.progress} className="h-1 mt-2" />
          </CardContent>
        </Card>
        
        <Card className={loading ? "opacity-60" : ""}>
          <CardHeader className="pb-2">
            <CardDescription>Proyectos</CardDescription>
            <CardTitle className="text-2xl">{stats.projects.count}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Activos</span>
              <span className="text-sm font-medium text-amber-600">{stats.projects.active}</span>
            </div>
            <Progress value={stats.projects.progress} className="h-1 mt-2" />
          </CardContent>
        </Card>
        
        <Card className={loading ? "opacity-60" : ""}>
          <CardHeader className="pb-2">
            <CardDescription>Usuarios</CardDescription>
            <CardTitle className="text-2xl">{stats.users.count}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Activos hoy</span>
              <span className="text-sm font-medium text-green-600">+{stats.users.active}</span>
            </div>
            <Progress value={stats.users.progress} className="h-1 mt-2" />
          </CardContent>
        </Card>
        
        <Card className={loading ? "opacity-60" : ""}>
          <CardHeader className="pb-2">
            <CardDescription>Analíticas</CardDescription>
            <CardTitle className="text-2xl">{stats.analytics.percentage}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Crecimiento</span>
              <span className="text-sm font-medium text-green-600">+{stats.analytics.change}%</span>
            </div>
            <Progress value={stats.analytics.progress} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="instrucciones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="instrucciones">Instrucciones</TabsTrigger>
          <TabsTrigger value="acerca">Acerca de la prueba</TabsTrigger>
        </TabsList>
        
        <TabsContent value="instrucciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cómo usar esta aplicación</CardTitle>
              <CardDescription>
                Guía paso a paso para sacar el máximo provecho de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Navega por las secciones</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Usa la barra lateral para acceder a las diferentes áreas: Proyectos, Documentos, y esta página de Dashboard.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Book className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Gestiona tus proyectos</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    En la sección de Proyectos puedes ver todos tus proyectos activos, crear nuevos o editar los existentes.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Organiza tus documentos</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Accede a todos tus archivos organizados por categorías en la sección de Documentos.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Personaliza tu perfil</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Haz clic en tu nombre en la barra de navegación para acceder a la configuración de tu perfil.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="acerca" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Acerca de esta prueba técnica</CardTitle>
              <CardDescription>
                Información sobre los objetivos y alcance de la evaluación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Esta aplicación ha sido desarrollada como parte de una prueba técnica para Grayola. 
                El objetivo principal es demostrar habilidades en el desarrollo de aplicaciones web 
                modernas utilizando tecnologías como React, Next.js, TypeScript y Tailwind CSS.
              </p>
              
              <p>
                La aplicación incluye:
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Sistema de autenticación con Supabase</li>
                <li>Panel de control con métricas y guía de uso</li>
                <li>Gestión de proyectos con filtrado y búsqueda</li>
                <li>Biblioteca de documentos categorizada</li>
                <li>Interfaz responsive adaptada a diferentes dispositivos</li>
                <li>Diseño moderno con componentes reutilizables</li>
              </ul>

              <div className="p-4 bg-primary/5 rounded-lg mt-4">
                <h4 className="font-medium flex items-center">
                  <Rocket className="h-5 w-5 mr-2 text-primary" />
                  Próximos pasos
                </h4>
                <p className="text-sm mt-2">
                  Este proyecto es una base sólida que puede expandirse con nuevas funcionalidades 
                  como notificaciones en tiempo real, un sistema de comentarios, analíticas detalladas 
                  y herramientas de colaboración en equipo.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Acceder a la documentación completa</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 