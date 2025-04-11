'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  BarChart, 
  Users, 
  Files,
  BookOpen,
  Upload,
  FileText,
  Settings,
  Bell
} from "lucide-react"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Project {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  role?: string;
}

interface Document {
  id: string;
  name: string;
  created_at: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [documentCount, setDocumentCount] = useState(0)
  const [projectCount, setProjectCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data: projectsData, count: projectsCount, error: projectsError } = await supabase
          .from('projects')
          .select('*', { count: 'exact' })
          .limit(10)
        
        if (projectsError) throw projectsError
        setProjects(projectsData || [])
        setProjectCount(projectsCount || 0)

        let totalDocuments = 0
        projectsData?.forEach(project => {
          if (project.files && Array.isArray(project.files)) {
            totalDocuments += project.files.length
          }
        })
        setDocumentCount(totalDocuments)
        
        const { data: usersData, count: usersCount, error: usersError } = await supabase
          .from('users')
          .select('*', { count: 'exact' })
          .limit(10)
        
        if (usersError) throw usersError
        setUsers(usersData || [])
        setUserCount(usersCount || 0)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary/70 to-primary bg-clip-text text-transparent">
          Panel de Control
        </h2>
        <p className="text-muted-foreground">
          Bienvenido a tu dashboard, aquí podrás ver un resumen de tus proyectos y actividades.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-900/80">
          <CardContent className="p-6 flex gap-4 items-center">
            <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900/30">
              <Files className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl mb-1">Documentos</CardTitle>
              <p className="text-3xl font-bold">{documentCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-900/80">
          <CardContent className="p-6 flex gap-4 items-center">
            <div className="rounded-full p-3 bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl mb-1">Proyectos</CardTitle>
              <p className="text-3xl font-bold">{projectCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-900/80">
          <CardContent className="p-6 flex gap-4 items-center">
            <div className="rounded-full p-3 bg-violet-100 dark:bg-violet-900/30">
              <Users className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <CardTitle className="text-xl mb-1">Usuarios</CardTitle>
              <p className="text-3xl font-bold">{userCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-900/80">
          <CardContent className="p-6 flex gap-4 items-center">
            <div className="rounded-full p-3 bg-amber-100 dark:bg-amber-900/30">
              <BarChart className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-xl mb-1">Rendimiento</CardTitle>
              <p className="text-3xl font-bold">87%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="resumen" className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-muted/60">
            <TabsTrigger value="resumen" className="data-[state=active]:bg-background">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="guias" className="data-[state=active]:bg-background">
              Guías
            </TabsTrigger>
            <TabsTrigger value="tareas" className="data-[state=active]:bg-background">
              Tareas
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="resumen" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Proyectos Activos</CardTitle>
                <CardDescription>
                  Detalles de los últimos proyectos activos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{project.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(project.created_at)}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getDisplayStatus(project.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
                {projects.length > 3 && (
                  <Button variant="link" className="px-0 mt-3 text-sm">
                    <Link href="/projects">Ver todos los proyectos</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Usuarios Recientes</CardTitle>
                <CardDescription>
                  Usuarios que han interactuado recientemente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-muted-foreground/20">
                          {user.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.email?.split("@")[0]}</p>
                        <p className="text-xs text-muted-foreground">{user.role || "Usuario"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Documentos Recientes</CardTitle>
                <CardDescription>
                  Últimos documentos subidos a la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3">
                      <div className="rounded-full p-2 bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(doc.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {documents.length > 3 && (
                  <Button variant="link" className="px-0 mt-3 text-sm">
                    <Link href="/documents">Ver todos los documentos</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guias" className="space-y-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Guías de Uso</CardTitle>
              <CardDescription className="mx-auto max-w-md">
                Documentación para ayudarte a utilizar la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="rounded-lg border p-4 hover:border-primary/50 transition-colors cursor-pointer">
                    <h3 className="font-medium text-lg mb-1 flex items-center gap-2">
                      <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30">
                        <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      Gestión de Proyectos
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Aprende a crear, editar y gestionar proyectos en la plataforma.
                    </p>
                    <Button variant="link" className="px-0 mt-2 text-sm">Ver guía</Button>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Guía de Gestión de Proyectos</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Product Manager</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        <li>Crear nuevos proyectos</li>
                        <li>Editar proyectos existentes</li>
                        <li>Eliminar proyectos</li>
                        <li>Asignar diseñadores</li>
                        <li>Gestionar todos los proyectos</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Cliente</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        <li>Ver proyectos creados</li>
                        <li>Crear nuevos proyectos</li>
                        <li>Asignar diseñadores a sus proyectos</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Diseñador</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        <li>Ver proyectos asignados</li>
                        <li>Actualizar estado de proyectos</li>
                        <li>Subir archivos a proyectos</li>
                      </ul>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/projects">Ir a Proyectos</Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <div className="rounded-lg border p-4 hover:border-primary/50 transition-colors cursor-pointer">
                    <h3 className="font-medium text-lg mb-1 flex items-center gap-2">
                      <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-900/30">
                        <Upload className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      Subida de Documentos
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Tutorial para subir y organizar documentos en el sistema.
                    </p>
                    <Button variant="link" className="px-0 mt-2 text-sm">Ver guía</Button>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Guía de Subida de Documentos</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Encuentra todos los documentos que se han subido en cada proyecto con su formato adecuado.
                      Próximamente se podrán descargar correctamente.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/documents">Ir a Documentos</Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <div className="rounded-lg border p-4 hover:border-primary/50 transition-colors cursor-pointer">
                    <h3 className="font-medium text-lg mb-1 flex items-center gap-2">
                      <div className="rounded-full p-2 bg-violet-100 dark:bg-violet-900/30">
                        <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      </div>
                      Gestión de Usuarios
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Aprende a administrar usuarios y permisos en la plataforma.
                    </p>
                    <Button variant="link" className="px-0 mt-2 text-sm">Ver guía</Button>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Guía de Gestión de Usuarios</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Tipos de Usuarios</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        <li>Product Manager: Gestión total de proyectos</li>
                        <li>Cliente: Creación y visualización de proyectos propios</li>
                        <li>Diseñador: Trabajo en proyectos asignados</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Permisos</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        <li>Product Manager: Acceso total</li>
                        <li>Cliente: Acceso limitado a sus proyectos</li>
                        <li>Diseñador: Acceso a proyectos asignados</li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tareas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tareas Pendientes</CardTitle>
              <CardDescription>
                Lista de tareas pendientes para completar el desarrollo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-amber-50 dark:bg-amber-950/20">
                  <h3 className="font-medium flex items-center gap-2 text-amber-800 dark:text-amber-400">
                    <CheckCircle className="h-5 w-5" />
                    Gestión de Estados de Proyectos
                  </h3>
                  <p className="text-sm mt-1 text-amber-700 dark:text-amber-300">
                    Implementar lógica completa del estado de cada proyecto, incluyendo notificaciones 
                    automáticas cuando un proyecto cambia de estado.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
                  <h3 className="font-medium flex items-center gap-2 text-blue-800 dark:text-blue-400">
                    <Settings className="h-5 w-5" />
                    Gestión de Usuarios
                  </h3>
                  <p className="text-sm mt-1 text-blue-700 dark:text-blue-300">
                    Mejorar la lógica en configuración para gestionar la edición de usuarios y sus permisos.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 bg-violet-50 dark:bg-violet-950/20">
                  <h3 className="font-medium flex items-center gap-2 text-violet-800 dark:text-violet-400">
                    <BookOpen className="h-5 w-5" />
                    Internacionalización
                  </h3>
                  <p className="text-sm mt-1 text-violet-700 dark:text-violet-300">
                    Implementar soporte completo para idioma inglés en toda la aplicación.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
                  <h3 className="font-medium flex items-center gap-2 text-green-800 dark:text-green-400">
                    <Bell className="h-5 w-5" />
                    Sistema de Notificaciones
                  </h3>
                  <p className="text-sm mt-1 text-green-700 dark:text-green-300">
                    Mejorar el funcionamiento de notificaciones para alertar sobre cambios en proyectos y 
                    asignaciones.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 bg-pink-50 dark:bg-pink-950/20">
                  <h3 className="font-medium flex items-center gap-2 text-pink-800 dark:text-pink-400">
                    <Bell className="h-5 w-5" />
                    Ajustes de Notificaciones
                  </h3>
                  <p className="text-sm mt-1 text-pink-700 dark:text-pink-300">
                    Implementar configuración de notificaciones para diseñadores cuando se actualizan o 
                    eliminan proyectos asignados. Crear panel de gestión de notificaciones completo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "pendiente":
      return "bg-yellow-500";
    case "en progreso":
      return "bg-blue-500";
    case "completado":
      return "bg-green-500";
    case "retrasado":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function getDisplayStatus(status: string) {
  switch (status) {
    case "pendiente":
      return "Pendiente";
    case "en progreso":
      return "En Progreso";
    case "completado":
      return "Completado";
    case "retrasado":
      return "Retrasado";
    default:
      return "Sin estado";
  }
}

function formatDate(dateString: string) {
  if (!dateString) return "Fecha no disponible";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }).format(date);
} 