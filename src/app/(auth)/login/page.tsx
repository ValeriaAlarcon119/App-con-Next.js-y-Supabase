'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase/client'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Iniciando sesión con:', { email, password: '******' })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Error de autenticación:', error)
        throw error
      }
      
      console.log('Inicio de sesión exitoso, datos:', data)
      
      // Mostrar mensaje de éxito
      toast({
        title: "Inicio de sesión exitoso",
        description: "Redirigiendo a proyectos...",
      })
      
      // Pequeño retraso antes de redireccionar
      setTimeout(() => {
        console.log('Redirigiendo a /projects')
        window.location.href = '/projects'
      }, 500)
      
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      toast({
        title: "Error de inicio de sesión",
        description: "Credenciales inválidas. Por favor, verifica tu correo y contraseña.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-white">
      <div className="w-full max-w-md space-y-6 px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative h-20 w-40 mb-2">
            <Image
              src="/logo.png"
              alt="Grayola Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-base text-gray-800 dark:text-gray-800 font-medium">
            Inicia sesión para continuar
          </p>
        </div>

        <div className="bg-white dark:bg-black border rounded-xl shadow-lg p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 flex flex-col items-center">
              <Label htmlFor="email" className="text-base w-full">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 text-base w-full"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2 flex flex-col items-center">
              <Label htmlFor="password" className="text-base w-full">Contraseña</Label>
              <div className="relative w-full">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 text-base w-full pr-10"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-11 w-11 px-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium bg-black hover:bg-gray-900 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                  <span className="ml-2">Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-muted-foreground">
              ¿No tienes una cuenta?{' '}
            </span>
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 