'use client'
import React from 'react';
import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  BarChart, 
  Users, 
  Files,
  BookOpen,
  Settings,
  Bell,
  Clock,
  RefreshCw,
  AlertCircle,
  FileImage,
  File,
  Briefcase,
  FileText
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
  title: string;
  description: string;
  status: string;
  created_at: string;
  created_by?: string;
  assigned_to?: string;
  files: FileObject[];
}

interface FileObject {
  name: string;
  path: string;
  type: string;
  size: number;
  url?: string;
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
  const [performance, setPerformance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const authResult = await supabase.auth.getUser()
        const authUser = authResult.data.user;
        if (!authUser) return;

        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()
        
        setUser(userData)

        let query = supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (userData?.role === 'client') {
          query = query.eq('created_by', authUser.id);
        } else if (userData?.role === 'designer') {
          query = query.eq('assigned_to', authUser.id);
        }

        const { data: projectsData, error: projectsError } = await query;
        if (projectsError) throw projectsError;

        const cleanProjects = projectsData?.map((project: any) => ({
          ...project,
          status: project.status || 'pendiente'
        })) || []

        setProjects(cleanProjects)
        setProjectCount(cleanProjects.length)

        // Rendimiento
        const completed = cleanProjects.filter(p => p.status === 'completado').length;
        const total = cleanProjects.length;
        setPerformance(total > 0 ? Math.round((completed / total) * 100) : 0)

        // Count logic based on Role
        if (userData?.role === 'client') {
          const distinctDesigners = new Set(cleanProjects.map(p => p.assigned_to).filter(Boolean));
          setUserCount(distinctDesigners.size);
        } else if (userData?.role === 'designer') {
          const distinctClients = new Set(cleanProjects.map(p => p.created_by).filter(Boolean));
          setUserCount(distinctClients.size);
        } else {
          // Project manager count all users
          const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
          setUserCount(usersCount || 0);
        }

        // Recent users (For PM show recent 10. For clients/designers show those they interact with maybe?)
        // Let's just fetch recent users all for visual on the widget for now or limit.
        const { data: recentUsers } = await supabase.from('users').select('*').limit(10).order('created_at', { ascending: false });
        setUsers(recentUsers || [])

        // Procesar documentos de los proyectos filtrados
        const allDocuments = cleanProjects.reduce((acc: Document[], project) => {
          if (project.files && Array.isArray(project.files)) {
            const projectDocs = project.files.map((file: any) => ({
              id: Math.random().toString(36).substr(2, 9),
              name: typeof file === 'string' ? file.split('/').pop() : file.name,
              type: getFileTypeFromName(typeof file === 'string' ? file : file.name),
              created_at: project.created_at
            }));
            return [...acc, ...projectDocs];
          }
          return acc;
        }, []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setDocuments(allDocuments)
        setDocumentCount(allDocuments.length)

      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="mt-4 text-sm text-muted-foreground">Cargando tu dashboard...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 font-sans transition-colors duration-300">
      {/* Header Banner */}
      <div className="page-header-card">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center z-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
              <BarChart className="h-8 w-8 text-primary" />
              Panel de Estadísticas
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1.5 bg-[#ccff00] text-black border border-black dark:border-transparent py-1 px-3 rounded-full text-xs font-bold shadow-sm transition-colors">
                <CheckCircle className="h-3 w-3" />
                {user?.role === 'client' ? "Cliente VIP" : user?.role === 'designer' ? "Diseñador" : "Gerente de Proyecto"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Documentos */}
        <Card className="transition-all hover:shadow-lg bg-card/60 backdrop-blur-sm border border-border/50 dark:border-border rounded-3xl overflow-hidden hover:-translate-y-1 hover:border-primary/50 dark:hover:border-primary/50 group">
          <CardContent className="p-6 flex gap-4 items-center h-full">
            <div className="rounded-2xl p-4 bg-muted border border-border group-hover:bg-primary/10 transition-colors">
              <Files className="h-7 w-7 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl mb-1 text-foreground">Documentos</CardTitle>
              <p className="text-3xl font-black text-foreground transition-colors">{documentCount}</p>
              <p className="text-xs text-muted-foreground">Archivos totales</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Proyectos */}
        <Card className="transition-all hover:shadow-lg bg-card/60 backdrop-blur-sm border border-border/50 dark:border-border rounded-3xl overflow-hidden hover:-translate-y-1 hover:border-primary/50 dark:hover:border-primary/50 group">
          <CardContent className="p-6 flex gap-4 items-center h-full">
            <div className="rounded-2xl p-4 bg-muted border border-border group-hover:bg-primary/10 transition-colors">
              <Briefcase className="h-7 w-7 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl mb-1 text-foreground">Proyectos</CardTitle>
              <p className="text-3xl font-black text-foreground transition-colors">{projectCount}</p>
              <p className="text-xs text-muted-foreground">
                {user?.role === 'client' ? 'Proyectos solicitados' : user?.role === 'designer' ? 'Proyectos asignados' : 'Proyectos activos'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Usuarios Interconectados */}
        <Card className="transition-all hover:shadow-lg bg-card/60 backdrop-blur-sm border border-border/50 dark:border-border rounded-3xl overflow-hidden hover:-translate-y-1 hover:border-primary/50 dark:hover:border-primary/50 group">
          <CardContent className="p-6 flex gap-4 items-center h-full">
            <div className="rounded-2xl p-4 bg-muted border border-border group-hover:bg-primary/10 transition-colors">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl mb-1 text-foreground">
                 {user?.role === 'project_manager' ? 'Usuarios Totales' : 'Conexiones'}
              </CardTitle>
              <p className="text-3xl font-black text-foreground transition-colors">{userCount}</p>
              <p className="text-xs text-muted-foreground">
                 {user?.role === 'client' ? 'Diseñadores asignados' : user?.role === 'designer' ? 'Clientes únicos' : 'Registrados'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Rendimiento */}
        <Card className="transition-all hover:shadow-lg bg-card/60 backdrop-blur-sm border border-border/50 dark:border-border rounded-3xl overflow-hidden hover:-translate-y-1 hover:border-primary/50 dark:hover:border-primary/50 group">
          <CardContent className="p-6 flex gap-4 items-center h-full">
            <div className="rounded-2xl p-4 bg-muted border border-border group-hover:bg-primary/10 transition-colors">
              <BarChart className="h-7 w-7 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl mb-1 text-foreground">Rendimiento</CardTitle>
              <p className="text-3xl font-black text-foreground transition-colors">{performance}%</p>
              <p className="text-xs text-muted-foreground">Proyectos completados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="resumen" className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="bg-muted p-1.5 rounded-xl border border-border shadow-inner">
            <TabsTrigger 
              value="resumen" 
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground transition-all font-medium"
            >
              Resumen
            </TabsTrigger>
            <TabsTrigger 
              value="guias" 
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground transition-all font-medium"
            >
              Guías
            </TabsTrigger>
            <TabsTrigger 
              value="tareas" 
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground transition-all font-medium"
            >
              Tareas
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="resumen" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-card/60 backdrop-blur-sm border border-border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                <CardTitle className="text-lg font-bold">Últimos Proyectos</CardTitle>
                <CardDescription className="text-xs">
                  Proyectos activos recientes
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {projects.length > 0 ? projects.slice(0, 4).map((project) => (
                    <div key={project.id} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status).replace('bg-','bg-')}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground">{project.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(project.created_at)}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border-transparent ${
                          project.status === 'pendiente' ? 'bg-yellow-500/10 text-yellow-500' :
                          project.status === 'en progreso' ? 'bg-blue-500/10 text-blue-500' :
                          project.status === 'completado' ? 'bg-emerald-500/10 text-emerald-500' :
                          project.status === 'retrasado' ? 'bg-red-500/10 text-red-500' :
                          'bg-muted text-muted-foreground'
                        }`}
                      >
                        {getDisplayStatus(project.status)}
                      </Badge>
                    </div>
                  )) : (
                     <p className="text-sm text-muted-foreground text-center py-4">No tienes proyectos asignados aún.</p>
                  )}
                </div>
                {projects.length > 4 && (
                  <Button variant="link" className="px-0 mt-4 text-xs font-bold text-primary hover:text-primary/80">
                    <Link href="/projects">Ver todos los proyectos →</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm border border-border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                <CardTitle className="text-lg font-bold">Usuarios Recientes</CardTitle>
                <CardDescription className="text-xs">
                  Interacciones en la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {users.length > 0 ? users.slice(0, 4).map((u) => (
                    <div key={u.id} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                          {u.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground">{u.email?.split("@")[0]}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">{u.role || "Usuario"}</p>
                      </div>
                    </div>
                  )) : (
                     <p className="text-sm text-muted-foreground text-center py-4">Sin usuarios recientes.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm border border-border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                <CardTitle className="text-lg font-bold">Documentos Recientes</CardTitle>
                <CardDescription className="text-xs">
                  Últimos archivos subidos
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {documents.length > 0 ? documents.slice(0, 4).map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3">
                      <div className="rounded-lg p-2 bg-muted border border-border">
                        {getFileIcon(getFileTypeFromName(doc.name))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(doc.created_at)}</p>
                      </div>
                    </div>
                  )): (
                     <p className="text-sm text-muted-foreground text-center py-4">No hay documentos aún.</p>
                  )}
                </div>
                {documents.length > 4 && (
                  <Button variant="link" className="px-0 mt-4 text-xs font-bold text-primary hover:text-primary/80">
                    <Link href="/documents">Ver todos los documentos →</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guias" className="space-y-6">
          <Card className="bg-card/60 backdrop-blur-sm border border-border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center bg-muted/20 border-b border-border/50 pb-8 pt-8">
              <CardTitle className="font-extrabold text-2xl">Guías de Uso</CardTitle>
              <CardDescription className="mx-auto max-w-md mt-2">
                Documentación para ayudarte a gestionar proyectos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="rounded-2xl border border-border p-5 hover:border-primary/50 transition-colors cursor-pointer bg-card/40 hover:bg-muted/30 group">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-3 text-foreground group-hover:text-primary">
                      <div className="rounded-xl p-2.5 bg-muted">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      Gestión de Proyectos
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Aprende a crear, editar y gestionar proyectos en la plataforma.
                    </p>
                  </div>
                </DialogTrigger>
                <DialogContent className="border border-border rounded-3xl bg-card/95 backdrop-blur-xl text-foreground font-sans">
                  <DialogHeader>
                    <DialogTitle className="font-bold text-xl">Guía de Gestión de Proyectos</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-5 mt-4">
                    <div className="space-y-2">
                      <h4 className="font-bold text-primary">Project Manager</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        <li>Crear y editar cualquier proyecto</li>
                        <li>Asignar diseñadores libremente</li>
                        <li>Eliminar proyectos de forma permanente</li>
                        <li>Visión global y métricas totales</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-primary">Cliente</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        <li>Crear solicitudes de diseño propias</li>
                        <li>Ver progreso de sus proyectos</li>
                        <li>Sugerir diseñadores desde la creación</li>
                      </ul>
                    </div>
                    <Button asChild className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl mt-4">
                      <Link href="/projects">Ir a Proyectos</Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tareas" className="space-y-6">
          <Card className="bg-card/60 backdrop-blur-sm border border-border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-muted/20 border-b border-border/50">
              <CardTitle className="font-extrabold text-xl">Tareas Pendientes del Sistema</CardTitle>
              <CardDescription>
                Lista de optimizaciones pendientes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="border border-border rounded-2xl p-5 bg-card hover:border-primary/30 transition-colors">
                  <h3 className="font-bold flex items-center gap-2 text-foreground">
                    <Settings className="h-5 w-5 text-primary" />
                    Gestión Avanzada de Usuarios
                  </h3>
                  <p className="text-sm mt-2 text-muted-foreground">
                    Ampliar el panel de configuraciones para delegar edición de credenciales
                  </p>
                </div>
                
                <div className="border border-border rounded-2xl p-5 bg-card hover:border-primary/30 transition-colors">
                  <h3 className="font-bold flex items-center gap-2 text-foreground">
                    <Bell className="h-5 w-5 text-primary" />
                    Centralización de Notificaciones
                  </h3>
                  <p className="text-sm mt-2 text-muted-foreground">
                    Conectar los triggers de Supabase con el drop-down de la navbar.
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
  switch (status?.toLowerCase()) {
    case "pendiente":
      return "bg-yellow-500";
    case "en progreso":
      return "bg-blue-500";
    case "completado":
      return "bg-emerald-500";
    case "retrasado":
      return "bg-red-500";
    default:
      return "bg-zinc-500";
  }
}

function getFileTypeFromName(fileName: string): string {
  if (!fileName) return 'file';
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const typeMap: Record<string, string> = {
    'pdf': 'pdf',
    'doc': 'word',
    'docx': 'word',
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'svg': 'image'
  };
  return typeMap[extension] || 'file';
}

function getFileIcon(type: string) {
  switch (type?.toLowerCase()) {
    case 'pdf':
      return <FileText className="h-4 w-4 text-red-500" />;
    case 'image':
      return <FileImage className="h-4 w-4 text-purple-500" />;
    case 'word':
      return <FileText className="h-4 w-4 text-blue-500" />;
    default:
      return <File className="h-4 w-4 text-zinc-500" />;
  }
}

function getDisplayStatus(status: string) {
  switch (status) {
    case "pendiente": return "Pendiente";
    case "en progreso": return "En Progreso";
    case "completado": return "Completado";
    case "retrasado": return "Retrasado";
    default: return "Desconocido";
  }
}

function formatDate(dateString: string) {
  if (!dateString) return "No disponible";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', { 
    day: '2-digit', month: '2-digit', year: 'numeric' 
  }).format(date);
}