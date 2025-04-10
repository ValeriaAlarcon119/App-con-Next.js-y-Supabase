'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { 
  LogOut, User, Settings, Sun, Moon, LayoutDashboard, 
  FileText, Briefcase, Home, Menu, X, ChevronDown, Github 
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

export function Navbar() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [userRole, setUserRole] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  
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

  // Función para traducir roles de inglés a español
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

  // Función para mostrar el rol de forma legible
  function getRoleDisplay(role?: string) {
    switch (role) {
      case 'project_manager':
        return 'Project Manager';
      case 'designer':
        return 'Diseñador';
      case 'client':
        return 'Cliente';
      default:
        return 'Usuario';
    }
  }

  return (
    <div className="border-b shadow-sm dark:shadow-gray-800/10 dark:bg-black">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center mr-6">
          <Image
            src="/logo.png"
            width={180}
            height={50}
            alt="Logo"
            priority
            className="shrink-0"
          />
        </Link>
        <nav className="mx-4 flex-1">
          <ul className="flex gap-2 text-sm font-medium">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors font-medium group",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/90"
                  )}
                >
                  <span className={cn(
                    pathname === item.href
                      ? "text-primary"
                      : "text-gray-700 dark:text-gray-200 group-hover:text-blue-600"
                  )}>
                    {item.icon}
                  </span>
                  <span className="group-hover:text-blue-600">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full h-10 w-10 hover:bg-gray-100/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-200 hover:text-blue-600"
            aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full h-10 px-3 hover:bg-gray-100/90 dark:hover:bg-gray-800/90 flex gap-3"
                >
                  <Avatar className="h-8 w-8 border shadow-sm">
                    <AvatarImage src="/avatar.png" alt="Avatar" />
                    <AvatarFallback className="text-xs">
                      {user.user_metadata?.name
                        ? user.user_metadata.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                        : user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-xs leading-none gap-1">
                    <span className="font-medium">
                      {user.user_metadata?.name
                        ? user.user_metadata.name
                        : user.email?.split("@")[0]}
                    </span>
                    <Badge variant="secondary" className="px-1.5 text-[10px] h-4 shadow-sm">
                      {displayRole}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-1.5" align="end" forceMount>
                <DropdownMenuLabel className="font-normal group">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">{user.user_metadata?.name}</p>
                    <p className="text-xs leading-none text-gray-600 dark:text-gray-400 group-hover:text-blue-600">
                      {user.email}
                    </p>
                    <Badge variant="outline" className={cn("mt-1.5", getRoleBadgeClass())}>
                      {displayRole}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center group">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center group">
                      <User className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600">Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center group">
                      <Settings className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600">Ajustes</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 hover:text-red-600 dark:text-red-400 hover:dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
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
                                  ? "bg-primary/10 text-primary font-medium"
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