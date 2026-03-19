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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background font-sans relative overflow-hidden transition-colors duration-300">
      {/* Fondo Premium Saas - Destellos y desenfoque */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-pink-400/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-[420px] space-y-8 px-6 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center justify-center mb-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center translate-y-[10px]">
                <img 
                  src="/images/grayola-bird-logo.svg?v=2"
                  alt="Grayola Bird"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-4xl font-black tracking-tighter text-foreground">GRAYOLA</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2 transition-colors">
            Crea una cuenta
          </h1>
          <p className="text-sm text-muted-foreground transition-colors">
            Regístrate para empezar a usar Grayola
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-xl transition-colors duration-300">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5 flex flex-col">
              <Label htmlFor="email" className="text-sm font-medium text-foreground transition-colors">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary rounded-xl transition-all"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Label htmlFor="password" className="text-sm font-medium text-foreground transition-colors">Contraseña</Label>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary rounded-xl pr-10 transition-all"
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-11 w-12 px-3 text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  ) : (
                    <EyeIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground transition-colors">Confirmar contraseña</Label>
              <div className="relative group">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`h-11 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary rounded-xl pr-10 transition-all ${passwordError ? 'border-destructive focus:ring-destructive' : ''}`}
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-11 w-12 px-3 text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  ) : (
                    <EyeIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  )}
                </Button>
              </div>
              {passwordError && (
                <p className="text-sm text-destructive mt-1">{passwordError}</p>
              )}
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Label htmlFor="role" className="text-sm font-medium text-foreground transition-colors">Rol</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="h-11 bg-muted/50 border-border text-foreground focus:ring-primary focus:border-primary rounded-xl transition-all">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground rounded-xl">
                  <SelectItem value="client" className="hover:bg-muted">Cliente</SelectItem>
                  <SelectItem value="designer" className="hover:bg-muted">Diseñador</SelectItem>
                  <SelectItem value="project_manager" className="hover:bg-muted">Project Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 mt-4"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary-foreground"></div>
                  <span className="ml-3">Creando cuenta...</span>
                </div>
              ) : (
                'Crear cuenta'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center text-sm transition-colors">
            <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
            <Link
              href="/login"
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 