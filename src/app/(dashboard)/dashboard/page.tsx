'use client'
import React from 'react';
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
  Bell,
  Sun,
  Moon
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
  const [user, setUser] = useState<User | null>(null)
  const [theme, setTheme] = useState("dark")
  const [showNotifications, setShowNotifications] = useState(false)
  
  const notificationsRef = React.useRef<HTMLDivElement>(null)

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

        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')
        
        if (userData && userData.length > 0) {
          setUser(userData[0])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 font-sans">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#7ee8ff] to-[#94e0ff] p-4 rounded-xl shadow-sm border-2 border-black">
        <div className="relative flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left md:items-center">
          <div className="mx-auto md:mx-0">
            <h1 className="text-3xl font-black text-black">
              Dashboard
            </h1>
            
            <span className="inline-block bg-[#e8ffdb] text-black py-0.5 px-2 rounded-full text-xs mt-1 font-medium border border-black">
              {user?.role === 'client' && "Cliente"}
              {user?.role === 'designer' && "Diseñador"}
              {user?.role === 'project_manager' && "Gerente de Proyecto"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-md bg-white dark:bg-black border-2 border-black rounded-xl overflow-hidden">
          <CardContent className="p-6 flex gap-4 items-center">
            <div className="rounded-full p-3 bg-[#e8ffdb]">
              <Files className="h-6 w-6 text-black" />
            </div>
            <div>
              <CardTitle className="text-xl mb-1 dark:text-white">Documentos</CardTitle>
              <p className="text-3xl font-bold dark:text-white">{documentCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md bg-white dark:bg-black border-2 border-black rounded-xl overflow-hidden">
          <CardContent className="p-6 flex gap-4 items-center">
            <div className="rounded-full p-3 bg-[#e8ffdb]">
              <CheckCircle className="h-6 w-6 text-black" />
            </div>
            <div>
              <CardTitle className="text-xl mb-1">Proyectos</CardTitle>
              <p className="text-3xl font-bold">{projectCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md bg-white dark:bg-black border-2 border-black rounded-xl overflow-hidden">
          <CardContent className="p-6 flex gap-4 items-center">
            <div className="rounded-full p-3 bg-[#e8ffdb]">
              <Users className="h-6 w-6 text-black" />
            </div>
            <div>
              <CardTitle className="text-xl mb-1">Usuarios</CardTitle>
              <p className="text-3xl font-bold">{userCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md bg-white dark:bg-black border-2 border-black rounded-xl overflow-hidden">
          <CardContent className="p-6 flex gap-4 items-center">
            <div className="rounded-full p-3 bg-[#e8ffdb]">
              <BarChart className="h-6 w-6 text-black" />
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
          <TabsList className="bg-white/60 dark:bg-black/60 border-2 border-black rounded-lg p-1">
            <TabsTrigger 
              value="resumen" 
              className="data-[state=active]:bg-[#7fff00] rounded-md data-[state=active]:text-black data-[state=inactive]:text-black dark:data-[state=inactive]:text-white font-bold"
            >
              Resumen
            </TabsTrigger>
            <TabsTrigger 
              value="guias" 
              className="data-[state=active]:bg-[#7fff00] rounded-md data-[state=active]:text-black data-[state=inactive]:text-black dark:data-[state=inactive]:text-white font-bold"
            >
              Guías
            </TabsTrigger>
            <TabsTrigger 
              value="tareas" 
              className="data-[state=active]:bg-[#7fff00] rounded-md data-[state=active]:text-black data-[state=inactive]:text-black dark:data-[state=inactive]:text-white font-bold"
            >
              Tareas
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="resumen" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 border-black rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2 bg-gradient-to-r from-[#c9efb3]/20 to-[#7ee8ff]/20">
                <CardTitle className="text-lg font-black">Proyectos Activos</CardTitle>
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
                      <Badge variant="outline" className="text-xs border border-black">
                        {getDisplayStatus(project.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
                {projects.length > 3 && (
                  <Button variant="link" className="px-0 mt-3 text-sm text-black dark:text-white font-bold">
                    <Link href="/projects">Ver todos los proyectos</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-black rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2 bg-gradient-to-r from-[#c9efb3]/20 to-[#7ee8ff]/20">
                <CardTitle className="text-lg font-black">Usuarios Recientes</CardTitle>
                <CardDescription>
                  Usuarios que han interactuado recientemente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-black">
                        <AvatarFallback className="text-xs bg-[#e8ffdb] text-black font-bold">
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

            <Card className="border-2 border-black rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2 bg-gradient-to-r from-[#c9efb3]/20 to-[#7ee8ff]/20">
                <CardTitle className="text-lg font-black">Documentos Recientes</CardTitle>
                <CardDescription>
                  Últimos documentos subidos a la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3">
                      <div className="rounded-full p-2 bg-[#e8ffdb]">
                        <FileText className="h-4 w-4 text-black" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(doc.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {documents.length > 3 && (
                  <Button variant="link" className="px-0 mt-3 text-sm text-black font-bold">
                    <Link href="/documents">Ver todos los documentos</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guias" className="space-y-4">
          <Card className="border-2 border-black rounded-xl overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-r from-[#c9efb3]/20 to-[#7ee8ff]/20">
              <CardTitle className="font-black">Guías de Uso</CardTitle>
              <CardDescription className="mx-auto max-w-md">
                Documentación para ayudarte a utilizar la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="rounded-lg border-2 border-black p-4 hover:border-[#7fff00] transition-colors cursor-pointer bg-white dark:bg-black dark:text-white hover:shadow-md">
                    <h3 className="font-medium text-lg mb-1 flex items-center gap-2 dark:text-white">
                      <div className="rounded-full p-2 bg-[#e8ffdb]">
                        <BookOpen className="h-4 w-4 text-black" />
                      </div>
                      Gestión de Proyectos
                    </h3>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Aprende a crear, editar y gestionar proyectos en la plataforma.
                    </p>
                    <Button variant="link" className="px-0 mt-2 text-sm text-black dark:text-white font-bold">Ver guía</Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="border-2 border-black rounded-xl bg-white">
                  <DialogHeader>
                    <DialogTitle className="font-black">Guía de Gestión de Proyectos</DialogTitle>
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
                    <Button asChild className="w-full bg-[#7fff00] hover:bg-[#90ff20] text-black font-bold border-2 border-b-4 border-black rounded-full">
                      <Link href="/projects">Ir a Proyectos</Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <div className="rounded-lg border-2 border-black p-4 hover:border-[#7fff00] transition-colors cursor-pointer bg-white dark:bg-black dark:text-white hover:shadow-md">
                    <h3 className="font-medium text-lg mb-1 flex items-center gap-2 dark:text-white">
                      <div className="rounded-full p-2 bg-[#e8ffdb]">
                        <Upload className="h-4 w-4 text-black" />
                      </div>
                      Subida de Documentos
                    </h3>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Tutorial para subir y organizar documentos en el sistema.
                    </p>
                    <Button variant="link" className="px-0 mt-2 text-sm text-black dark:text-white font-bold">Ver guía</Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="border-2 border-black rounded-xl bg-white">
                  <DialogHeader>
                    <DialogTitle className="font-black">Guía de Subida de Documentos</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Encuentra todos los documentos que se han subido en cada proyecto con su formato adecuado.
                      Próximamente se podrán descargar correctamente.
                    </p>
                    <Button asChild className="w-full bg-[#7fff00] hover:bg-[#90ff20] text-black font-bold border-2 border-b-4 border-black rounded-full">
                      <Link href="/documents">Ir a Documentos</Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <div className="rounded-lg border-2 border-black p-4 hover:border-[#7fff00] transition-colors cursor-pointer bg-white dark:bg-black dark:text-white hover:shadow-md">
                    <h3 className="font-medium text-lg mb-1 flex items-center gap-2 dark:text-white">
                      <div className="rounded-full p-2 bg-[#e8ffdb]">
                        <Users className="h-4 w-4 text-black" />
                      </div>
                      Gestión de Usuarios
                    </h3>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Aprende a administrar usuarios y permisos en la plataforma.
                    </p>
                    <Button variant="link" className="px-0 mt-2 text-sm text-black dark:text-white font-bold">Ver guía</Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="border-2 border-black rounded-xl bg-white">
                  <DialogHeader>
                    <DialogTitle className="font-black">Guía de Gestión de Usuarios</DialogTitle>
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
          <Card className="border-2 border-black rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#c9efb3]/20 to-[#7ee8ff]/20">
              <CardTitle className="font-black">Tareas Pendientes</CardTitle>
              <CardDescription>
                Lista de tareas pendientes para completar el desarrollo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-black rounded-lg p-4 bg-[#e8ffdb]">
                  <h3 className="font-medium flex items-center gap-2 text-black">
                    <CheckCircle className="h-5 w-5" />
                    Gestión de Estados de Proyectos
                  </h3>
                  <p className="text-sm mt-1 text-black">
                    Implementar lógica completa del estado de cada proyecto, incluyendo notificaciones 
                    automáticas cuando un proyecto cambia de estado.
                  </p>
                </div>
                
                <div className="border-2 border-black rounded-lg p-4 bg-[#e8ffdb]">
                  <h3 className="font-medium flex items-center gap-2 text-black">
                    <Settings className="h-5 w-5" />
                    Gestión de Usuarios
                  </h3>
                  <p className="text-sm mt-1 text-black">
                    Mejorar la lógica en configuración para gestionar la edición de usuarios y sus permisos.
                  </p>
                </div>
                
                <div className="border-2 border-black rounded-lg p-4 bg-[#e8ffdb]">
                  <h3 className="font-medium flex items-center gap-2 text-black">
                    <BookOpen className="h-5 w-5" />
                    Internacionalización
                  </h3>
                  <p className="text-sm mt-1 text-black">
                    Implementar soporte completo para idioma inglés en toda la aplicación.
                  </p>
                </div>
                
                <div className="border-2 border-black rounded-lg p-4 bg-[#e8ffdb]">
                  <h3 className="font-medium flex items-center gap-2 text-black">
                    <Bell className="h-5 w-5" />
                    Sistema de Notificaciones
                  </h3>
                  <p className="text-sm mt-1 text-black">
                    Mejorar el funcionamiento de notificaciones para alertar sobre cambios en proyectos y 
                    asignaciones.
                  </p>
                </div>
                
                <div className="border-2 border-black rounded-lg p-4 bg-[#e8ffdb]">
                  <h3 className="font-medium flex items-center gap-2 text-black">
                    <Bell className="h-5 w-5" />
                    Ajustes de Notificaciones
                  </h3>
                  <p className="text-sm mt-1 text-black">
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