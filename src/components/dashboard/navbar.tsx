'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { 
  LogOut, User, Settings, Sun, Moon, LayoutDashboard, 
  FileText, Briefcase, Home, Menu, X, ChevronDown, Github,
  Bell
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from 'next/image'
import React from 'react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from 'uuid'

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  projectId?: string;
  projectTitle?: string;
  creatorName?: string;
}

export function Navbar() {
  const router = useRouter()
  const { user, signOut, isLoading } = useAuth()
  const { theme, setTheme } = useTheme()
  const [userRole, setUserRole] = useState<string>('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { toast } = useToast()
  
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setUserRole(data?.role || '')
      } catch (error) {
        console.error('Error fetching user role:', error)
      }
    }

    if (user) {
      fetchUserRole()
    }
  }, [user])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false)
      }
      
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node) &&
        showNotifications
      ) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [showNotifications])

  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        const transformedData = data?.map(item => ({
          id: item.id,
          message: item.message,
          read: item.read,
          createdAt: item.created_at,
          projectId: item.project_id,
          projectTitle: item.project_title,
          creatorName: item.creator_name
        })) || [];
        setNotifications(transformedData)
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    fetchNotifications()

    const projectSubscription = supabase
      .channel('public:projects')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'projects'
        },
        async (payload) => {
          console.log('Nuevo proyecto detectado:', payload.new);
          
          const projectData = payload.new;

          try {
            const createdBy = projectData.created_by || projectData.createdBy;
            const projectTitle = projectData.title || 'Nuevo proyecto';
            const projectId = projectData.id;

            if (!createdBy) {
              console.error('No se pudo determinar el creador del proyecto:', projectData);
              return;
            }

            const { data: creatorData } = await supabase
              .from('users')
              .select('email')
              .eq('id', createdBy)
              .single();

            const creatorEmail = creatorData?.email || 'usuario@example.com';
            const creatorName = creatorEmail.split('@')[0];
            
            console.log('Creando notificación para:', {creatorName, projectTitle, userId: user.id});
            
            const newNotification: Notification = {
              id: uuidv4(),
              message: `${creatorName} ha creado un nuevo proyecto: ${projectTitle}`,
              read: false,
              createdAt: new Date().toISOString(),
              projectId: projectId,
              projectTitle,
              creatorName
            };

            toast({
              title: "Nueva notificación",
              description: newNotification.message,
              variant: "default",
            });

            setNotifications(prev => [newNotification, ...prev]);
            
            const { error, data } = await supabase
              .from('notifications')
              .insert([{
                id: newNotification.id,
                user_id: user.id,
                message: newNotification.message,
                read: false,
                project_id: projectId,
                project_title: projectTitle,
                creator_name: creatorName,
                created_at: new Date().toISOString()
              }]);

            if (error) {
              console.error('Error al guardar notificación:', error);
              throw error;
            }
            
            console.log('Notificación guardada exitosamente:', data);
            
          } catch (error) {
            console.error('Error creating notification:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('Estado de suscripción a proyectos:', status);
      });

    return () => {
      projectSubscription.unsubscribe()
    }
  }, [user, toast])

  const translateRole = (role: string): string => {
    if (!role || typeof role !== 'string') {
      return 'Usuario';
    }
    
    const roleMap: Record<string, string> = {
      'designer': 'Diseñador',
      'client': 'Cliente',
      'project_manager': 'Gerente de Proyecto',
      'project manager': 'Gerente de Proyecto',
      'admin': 'Administrador',
      'administrator': 'Administrador',
      'Project Manager': 'Gerente de Proyecto',
      'Designer': 'Diseñador',
      'Client': 'Cliente'
    }
    
    const normalizedRole = role.toLowerCase()
    return roleMap[normalizedRole] || 
           roleMap[normalizedRole.replace('_', ' ')] || 
           'Usuario'
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const displayRole = isLoading ? 'Cargando...' : userRole

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

  function getRoleDisplay(role?: string) {
    switch (role) {
      case 'project_manager':
        return 'Gerente de Proyecto';
      case 'designer':
        return 'Diseñador';
      case 'client':
        return 'Cliente';
      default:
        return 'Usuario';
    }
  }

  return (
    <div className="border-b shadow-sm dark:shadow-gray-800/10 dark:bg-black font-sans">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center mr-6">
          <Image
            src="/logo.png"
            width={180}
            height={50}
            alt="Logo"
            priority
            className="shrink-0 h-auto"
          />
        </Link>
        <nav className="mx-4 flex-1">
          <ul className="flex gap-2 text-sm font-medium">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "px-4 py-2.5 rounded-full inline-flex items-center gap-2 transition-colors font-medium group no-underline",
                    pathname === item.href
                      ? "bg-[#7fff00]/20 text-black dark:text-white"
                      : "text-black dark:text-white hover:bg-[#7fff00]/20"
                  )}
                >
                  <span className={cn(
                    pathname === item.href
                      ? "text-black dark:text-white"
                      : "text-black dark:text-white"
                  )}>
                    {item.icon}
                  </span>
                  <span className={pathname === item.href ? "text-black dark:text-white" : "text-black dark:text-white"}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">

          {user && (
            <div className="relative" ref={notificationsRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="rounded-full h-8 w-8 bg-[#7fff00] hover:bg-[#7fff00] dark:bg-[#7fff00] dark:hover:bg-[#7fff00] text-black dark:text-black border border-black flex items-center justify-center"
                aria-label="Mostrar notificaciones"
              >
                <Bell className="h-4 w-4" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white font-bold border border-black">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-grayola-darkblue rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-medium">Notificaciones</h3>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-7 hover:text-grayola-teal"
                        onClick={async () => {
                     
                          setNotifications(prev => 
                            prev.map(n => ({ ...n, read: true }))
                          );
                      
                          if (user) {
                            await supabase
                              .from('notifications')
                              .update({ read: true })
                              .eq('user_id', user.id)
                              .eq('read', false);
                          }
                        }}
                      >
                        Marcar todas como leídas
                      </Button>
                    )}
                  </div>
                  
                  <ScrollArea className="max-h-[300px]">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No tienes notificaciones
                      </div>
                    ) : (
                      <div className="py-1">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${notification.read ? 'opacity-70' : 'bg-grayola-teal/10 dark:bg-grayola-teal/5'}`}
                            onClick={async () => {
                           
                              if (!notification.read) {
                                setNotifications(prev => 
                                  prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
                                );
                         
                                await supabase
                                  .from('notifications')
                                  .update({ read: true })
                                  .eq('id', notification.id);
                              }
                              
                              if (notification.projectTitle) {
                                router.push(`/projects`);
                                setShowNotifications(false);
                              }
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <div className="h-8 w-8 rounded-full bg-grayola-teal/20 dark:bg-grayola-teal/10 flex items-center justify-center">
                                <Briefcase className="h-4 w-4 text-grayola-teal dark:text-grayola-turquoise" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.createdAt).toLocaleDateString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-grayola-teal"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full h-8 w-8 bg-[#7fff00] hover:bg-[#7fff00] dark:bg-[#7fff00] dark:hover:bg-[#7fff00] text-black dark:text-black border border-black flex items-center justify-center"
            aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full h-10 px-3 hover:bg-gray-100/90 dark:hover:bg-gray-800/90 flex gap-3 group"
                >
                  <Avatar className="h-8 w-8 border border-black">
                    <AvatarImage src="/avatar.png" alt="Avatar" />
                    <AvatarFallback className="text-sm bg-[#7fff00] text-black uppercase">
                      {user.user_metadata?.name
                        ? user.user_metadata.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                        : user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-xs leading-none gap-1">
                    <span className="font-medium group-hover:text-gray-900 dark:group-hover:text-white">
                      {user.user_metadata?.name
                        ? user.user_metadata.name
                        : user.email?.split("@")[0]}
                    </span>
                    <Badge variant="secondary" className="px-1.5 text-[10px] h-4 shadow-sm">
                      {translateRole(displayRole)}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 rounded-xl font-sans">
                <DropdownMenuLabel className="group flex flex-col items-center space-y-1 text-center font-sans">
                  <p className="text-sm font-medium leading-none font-sans">
                    {user?.user_metadata?.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-sans">
                    {user?.email || 'usuario@ejemplo.com'}
                  </p>
                  <div className="mt-1">
                    {displayRole && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "px-1.5 text-[10px] h-4 shadow-sm font-sans",
                          getRoleBadgeClass()
                        )}
                      >
                        {getRoleDisplay(userRole)}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  asChild
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  asChild
                >
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Ajustes</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 md:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-2 mb-6 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  width={200}
                  height={60}
                  alt="Logo"
                  priority
                  className="h-auto"
                />
              </div>
              <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
                <div className="pl-4 pr-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue="item-1"
                  >
                    <AccordionItem value="item-1" className="border-none">
                      <AccordionTrigger className="py-2 text-sm hover:no-underline hover:bg-gray-100 dark:hover:bg-gray-800 px-2 rounded-md">Navegación</AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-1 pl-2">
                          {navigationItems.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={cn(
                                "pl-6 pr-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                                pathname === item.href
                                  ? "bg-grayola-lime/20 text-black dark:text-white font-medium"
                                  : "text-gray-700 dark:text-gray-200"
                              )}
                            >
                              <div className="flex items-center">
                                {item.icon && <div className="mr-2 h-4 w-4">{item.icon}</div>}
                                <span>{item.name}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}