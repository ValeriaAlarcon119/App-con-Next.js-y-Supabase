'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { 
  LogOut, User, Settings, Sun, Moon, Bell, LayoutDashboard, 
  FileText, Briefcase, Home, Menu, X, ChevronDown 
} from 'lucide-react'
import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from 'next/image'
import React from 'react'

// Definir interfaz para las notificaciones
interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export function Navbar() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [userRole, setUserRole] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const getUserRole = async () => {
      setIsLoading(true)
      console.log('[DEBUG] Usuario actual completo:', user)

      if (!user?.id) {
        console.log('[DEBUG] No hay usuario autenticado')
        setUserRole('Usuario')
        setIsLoading(false)
        return
      }

      console.log('[DEBUG] Email del usuario:', user.email)
      console.log('[DEBUG] ID del usuario:', user.id)

    

      if (user.role) {
        console.log('[DEBUG] Rol detectado desde user.role:', user.role)
        const translatedRole = translateRole(user.role)
        setUserRole(translatedRole)
        setIsLoading(false)
        return
      }

      try {
        console.log('[DEBUG] Consultando rol directamente desde users')
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        console.log('[DEBUG] Resultado de users:', userData, error)

        if (userData?.role) {
          console.log('[DEBUG] Rol obtenido de users:', userData.role)
          const translatedRole = translateRole(userData.role)
          setUserRole(translatedRole)
        } else {
          console.log('[DEBUG] Usando rol por defecto')
          setUserRole('Project Manager') // Default role
        }
      } catch (error) {
        console.error('[DEBUG] Error al obtener el rol:', error)
        setUserRole('Project Manager') // Default fallback
      } finally {
        setIsLoading(false)
      }
    }

    getUserRole()
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Efecto para obtener notificaciones de Supabase
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(5)
        
        if (data) {
          setNotifications(data)
        }
      } catch (error) {
        console.error('Error al obtener notificaciones:', error)
      }
    }

    fetchNotifications()

    // Suscripción a nuevas notificaciones
    const subscription = supabase
      .channel('public:notifications')
      .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications' 
        }, payload => {
          setNotifications(prev => [payload.new as Notification, ...prev.slice(0, 4)])
        })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Función para traducir roles de inglés a espa
  const translateRole = (role: string): string => {
    if (!role || typeof role !== 'string') {
      return 'Usuario';
    }
    
    const roleMap: Record<string, string> = {
      'designer': 'Diseñador',
      'client': 'Cliente',
      'project_manager': 'Project Manager',
      'project manager': 'Project Manager',
      'admin': 'Administrador',
      'administrator': 'Administrador'
    }
    
    // Normaliza el rol a minúsculas para hacer una búsqueda insensible a mayúsculas/minúsculas
    const normalizedRole = role.toLowerCase()
    
    // Busca la traducción en el mapa o capitaliza el rol original
    return roleMap[normalizedRole] || 
           roleMap[normalizedRole.replace('_', ' ')] || 
           role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  // Si está cargando, muestra "Cargando...", de lo contrario muestra el rol
  const displayRole = isLoading ? 'Cargando...' : userRole

  // Determina el color del badge basado en el rol
  const getRoleBadgeClass = () => {
    const role = userRole.toLowerCase()
    if (role === 'cliente') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    if (role === 'diseñador') return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    if (role === 'administrador' || role === 'project manager') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    return 'bg-primary/5 text-primary hover:bg-primary/10'
  }
  
  const navigationItems = [
    { name: 'Inicio', href: '/home', icon: <Home className="h-5 w-5" /> },
    { name: 'Proyectos', href: '/projects', icon: <Briefcase className="h-5 w-5" /> },
    { name: 'Documentos', href: '/documents', icon: <FileText className="h-5 w-5" /> },
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  ]

  // Efecto para detectar clics fuera del menú de notificaciones
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Función para marcar notificación como leída
  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      )
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error)
    }
  }

  // Contar notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.read).length

  // Formatear fecha relativa
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffMinutes < 1) return 'hace un momento'
    if (diffMinutes < 60) return `hace ${diffMinutes} min`
    
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `hace ${diffHours} h`
    
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `hace ${diffDays} d`
    
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/home" className="flex items-center transition-transform hover:scale-105">
            <div className="relative h-10 w-40">
              <Image
                src="/logo.png"
                alt="Grayola Logo"
                width={160}
                height={40}
                className="object-contain"
                priority
              />
            </div>
          </Link>
          
          {/* Mostrar menú de navegación en escritorio */}
          <div className="hidden md:flex items-center gap-1 ml-6">
            {navigationItems.map((item) => (
              <Button 
                key={item.name}
                variant="ghost" 
                size="sm"
                className="flex items-center gap-2 hover:bg-primary/5 text-black dark:text-white font-semibold transition-colors hover:text-black dark:hover:text-white"
                onClick={() => router.push(item.href)}
              >
                {React.cloneElement(item.icon, { className: "h-5 w-5 text-black dark:text-white" })}
                <span>{item.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={`capitalize ${getRoleBadgeClass()}`}>
            {displayRole}
          </Badge>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 hover:bg-primary/5" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Cambiar tema</span>
          </Button>

          {/* Reemplazar DropdownMenu con un componente personalizado basado en estado */}
          <div className="relative hidden md:block">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 hover:bg-primary/5 hidden md:flex"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <Avatar className="h-8 w-8 border border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-medium">
                  {user && user.email ? user.email[0].toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium line-clamp-1">
                  {user && user.email ? user.email.split('@')[0] : 'Usuario'}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {displayRole}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
            
            {userMenuOpen && (
              <div 
                ref={userMenuRef}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700 py-1 text-sm"
              >
              
                <div 
                  className="flex items-center px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    handleSignOut()
                    setUserMenuOpen(false)
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Menú móvil */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="py-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-10 w-10 border border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                        {user && user.email ? user.email[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium truncate">{user && user.email ? user.email : 'Usuario'}</p>
                      <Badge className={`capitalize mt-1 ${getRoleBadgeClass()}`}>
                        {displayRole}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <Button 
                        key={item.name}
                        variant="ghost" 
                        size="sm"
                        className="w-full justify-start py-6 text-black dark:text-white font-semibold hover:text-black dark:hover:text-white"
                        onClick={() => router.push(item.href)}
                      >
                        {React.cloneElement(item.icon, { className: "h-5 w-5 text-black dark:text-white" })}
                        <span className="ml-2">{item.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start py-3 px-3 h-auto text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
} 