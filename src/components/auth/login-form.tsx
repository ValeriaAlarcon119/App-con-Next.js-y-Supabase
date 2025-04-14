'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import Link from 'next/link'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn(email, password)
      router.push('/projects')
      toast.success('¡Bienvenido!')
    } catch (error) {
      toast.error('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="h-12 text-base rounded-lg focus:ring-grayola-lime"
            placeholder="tu@ejemplo.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
              className="h-12 text-base rounded-lg pr-10 focus:ring-grayola-lime"
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
          className="grayola-button w-full h-12 text-base font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-black"></div>
              <span className="ml-2">Iniciando sesión...</span>
            </div>
          ) : (
            'Iniciar sesión'
          )}
        </Button>
      </form>
      <div className="text-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          ¿No tienes una cuenta?{" "}
        </span>
        <Link
          href="/register"
          className="text-black dark:text-white hover:text-grayola-lime dark:hover:text-grayola-lime font-medium transition-colors"
        >
          Regístrate
        </Link>
      </div>
    </div>
  )
} 