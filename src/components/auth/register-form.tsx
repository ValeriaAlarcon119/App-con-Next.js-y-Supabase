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

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    try {
      await signUp(email, password)
      toast.success('¡Cuenta creada con éxito!')
      router.push('/login')
    } catch (error) {
      toast.error('Error al crear la cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Contraseña</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            className="h-12 text-base rounded-lg pr-10 focus:ring-grayola-lime"
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
      </div>
      <Button 
        type="submit"
        className="grayola-button w-full h-12 text-base font-medium"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-black"></div>
            <span className="ml-2">Creando cuenta...</span>
          </div>
        ) : (
          'Crear cuenta'
        )}
      </Button>
      <div className="text-center text-sm mt-4">
        <span className="text-gray-600 dark:text-gray-400">
          ¿Ya tienes una cuenta?{" "}
        </span>
        <Link
          href="/login"
          className="text-black dark:text-white hover:text-grayola-lime dark:hover:text-grayola-lime font-medium transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    </form>
  )
} 