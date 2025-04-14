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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#b6f8ff]/20 dark:from-black dark:to-grayola-darkblue font-sans">
      <div className="w-full max-w-md space-y-8 px-4">
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
          <h1 className="text-2xl font-bold mt-4 text-black dark:text-white">
            Iniciar sesión
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-2 mb-6">
            Inicia sesión para continuar a tu cuenta
          </p>
        </div>

        <div className="grayola-card p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="email" className="text-sm font-medium">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base rounded-lg focus:ring-grayola-lime"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base rounded-lg pr-10 focus:ring-grayola-lime"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-12 w-12 px-3"
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
              className="bg-[#7fff00] hover:bg-[#90ff20] text-black px-6 py-3 text-base font-bold rounded-full border-2 border-b-4 border-black w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-black"></div>
                  <span className="ml-2">Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600 dark:text-gray-400">
              ¿No tienes una cuenta?{' '}
            </span>
            <Link
              href="/register"
              className="text-black dark:text-white hover:text-grayola-lime dark:hover:text-grayola-lime font-medium transition-colors"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 