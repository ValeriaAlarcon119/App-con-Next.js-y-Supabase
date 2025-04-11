'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { 
  Bell, 
  Shield, 
  User, 
  Lock, 
  Smartphone, 
  Mail, 
  Github, 
  RefreshCw,
  CheckCircle,
  Save,
  ExternalLink
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function SettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('account')
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    role: '',
    notifications: {
      email: true,
      projects: true,
      security: true
    },
    theme: 'system',
    language: 'es'
  })
  
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (user) {
      setUserInfo(prev => ({
        ...prev,
        name: user.user_metadata?.name || user.email?.split('@')[0] || '',
        email: user.email || '',
        role: user.role || '',
        theme: theme || 'system'
      }))
    }
  }, [user, theme])

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
    
    const normalizedRole = role.toLowerCase()
    
    return roleMap[normalizedRole] || 
           roleMap[normalizedRole.replace('_', ' ')] || 
           role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
  }

  const handleSaveProfile = () => {
    setIsLoading(true)
    
    // Simulación de guardado
    setTimeout(() => {
      toast({
        title: "Perfil actualizado",
        description: "Tu información de perfil ha sido actualizada correctamente.",
      })
      setIsLoading(false)
    }, 1000)
  }

  const handleToggleNotification = (key: string) => {
    setUserInfo(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications]
      }
    }))
  }

  const handleThemeChange = (selectedTheme: string) => {
    setUserInfo({...userInfo, theme: selectedTheme});
    setTheme(selectedTheme);
  }

  const handleLanguageChange = (selectedLanguage: string) => {
    setUserInfo({...userInfo, language: selectedLanguage});
    toast({
      title: selectedLanguage === 'es' ? "Idioma cambiado" : "Language changed",
      description: selectedLanguage === 'es' 
        ? "El idioma se ha cambiado a Español" 
        : "Language has been changed to English",
    });
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-screen-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-900">Ajustes</h1>
          <p className="text-muted-foreground">Personaliza tu experiencia y administra tu cuenta</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Navegación</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-1">
              <Button 
                variant={activeTab === 'account' ? "default" : "ghost"} 
                className="justify-start" 
                onClick={() => setActiveTab('account')}
              >
                <User className="mr-2 h-4 w-4" />
                Cuenta
              </Button>
              <Button 
                variant={activeTab === 'notifications' ? "default" : "ghost"} 
                className="justify-start" 
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notificaciones
              </Button>
              <Button 
                variant={activeTab === 'security' ? "default" : "ghost"} 
                className="justify-start" 
                onClick={() => setActiveTab('security')}
              >
                <Shield className="mr-2 h-4 w-4" />
                Seguridad
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          {activeTab === 'account' && (
            <Card>
              <CardHeader>
                <CardTitle>Información de Cuenta</CardTitle>
                <CardDescription>
                  Actualiza tu información personal y preferencias
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="name">Nombre</Label>
                      <Input 
                        id="name" 
                        value={userInfo.name} 
                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={userInfo.email} 
                        disabled 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Rol</Label>
                    <div className="flex items-center">
                      <Badge variant="outline" className="py-1.5 px-3 text-sm font-medium">
                        {translateRole(userInfo.role)}
                      </Badge>
                      <p className="text-sm text-muted-foreground ml-3">Tu rol determina lo que puedes hacer en Grayola</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <h3 className="font-medium text-lg">Preferencias</h3>
                  
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <select 
                        id="language"
                        className="w-full p-2 rounded-md border border-input bg-background"
                        value={userInfo.language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="theme">Tema</Label>
                      <select 
                        id="theme"
                        className="w-full p-2 rounded-md border border-input bg-background"
                        value={userInfo.theme}
                        onChange={(e) => handleThemeChange(e.target.value)}
                      >
                        <option value="light">Claro</option>
                        <option value="dark">Oscuro</option>
                        <option value="system">Sistema</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6 px-6">
                <Button variant="outline" className="dark:bg-white dark:text-black dark:hover:bg-gray-200" onClick={() => router.push('/dashboard')}>Cancelar</Button>
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar cambios
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>
                  Configura cómo y cuándo quieres recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="space-y-0.5">
                      <h3 className="font-medium">Notificaciones por email</h3>
                      <p className="text-sm text-muted-foreground">Recibe actualizaciones importantes por correo electrónico</p>
                    </div>
                    <Switch 
                      checked={userInfo.notifications.email} 
                      onCheckedChange={() => handleToggleNotification('email')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="space-y-0.5">
                      <h3 className="font-medium">Actualizaciones de proyectos</h3>
                      <p className="text-sm text-muted-foreground">Notificaciones cuando se actualicen tus proyectos</p>
                    </div>
                    <Switch 
                      checked={userInfo.notifications.projects} 
                      onCheckedChange={() => handleToggleNotification('projects')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pb-4">
                    <div className="space-y-0.5">
                      <h3 className="font-medium">Alertas de seguridad</h3>
                      <p className="text-sm text-muted-foreground">Recibe alertas sobre cambios en tu cuenta</p>
                    </div>
                    <Switch 
                      checked={userInfo.notifications.security} 
                      onCheckedChange={() => handleToggleNotification('security')}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6 px-6">
                <Button variant="outline" className="dark:bg-white dark:text-black dark:hover:bg-gray-200" onClick={() => router.push('/dashboard')}>Cancelar</Button>
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar cambios
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>
                  Administra la seguridad de tu cuenta y tus opciones de inicio de sesión
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Cambiar contraseña</h3>
                    <div className="space-y-2 pt-2">
                      <Button variant="outline" className="w-full sm:w-auto flex gap-2">
                        <Lock className="h-4 w-4" />
                        Cambiar contraseña
                      </Button>
                    </div>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Métodos de inicio de sesión</h3>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{userInfo.email}</span>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Principal
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Github className="h-5 w-5" />
                          <span>GitHub</span>
                        </div>
                        <Button variant="ghost" size="sm">Conectar</Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Sesiones activas</h3>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Este dispositivo</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Última actividad: Ahora
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Activa
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                        Cerrar todas las sesiones
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 