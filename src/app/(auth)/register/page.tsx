'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from '@/lib/supabase/client'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }
    
    setPasswordError('')
    setLoading(true)

    try {
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
          },
        },
      })

      if (signUpError) throw signUpError

      if (user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              email: user.email,
              role: role,
            },
          ])

        if (profileError) throw profileError

        toast({
          title: "¡Registro exitoso!",
          description: "Tu cuenta ha sido creada correctamente",
        })

        router.push('/login')
      }
    } catch (error) {
      console.error('Error al registrarse:', error)
      toast({
        title: "Error",
        description: "No se pudo crear la cuenta",
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
            Crear una cuenta
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-2 mb-6">
            Regístrate para empezar a usar Grayola
          </p>
        </div>

        <div className="grayola-card p-8">
          <form onSubmit={handleRegister} className="space-y-6">
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
                  autoComplete="new-password"
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

            <div className="space-y-2 flex flex-col">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`h-12 text-base rounded-lg pr-10 ${passwordError ? 'border-red-500 focus:ring-red-500' : ''}`}
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-12 w-12 px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </Button>
              </div>
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-base">Rol</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Cliente</SelectItem>
                  <SelectItem value="designer">Diseñador</SelectItem>
                  <SelectItem value="project_manager">Project Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="bg-[#7fff00] hover:bg-[#90ff20] text-black px-6 py-3 text-base font-bold rounded-full border-2 border-b-4 border-black w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-black"></div>
                  <span className="ml-2">Creando cuenta...</span>
                </div>
              ) : (
                'Crear cuenta'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
            </span>
            <Link
              href="/login"
              className="text-black dark:text-white hover:text-grayola-lime dark:hover:text-grayola-lime font-medium transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 