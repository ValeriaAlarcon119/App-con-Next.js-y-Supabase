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
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-muted-foreground transition-colors">
            Ingresa al portal de colaboración premium de Grayola
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-xl transition-colors duration-300">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground transition-colors">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@grayola.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary rounded-xl transition-all"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium text-foreground transition-colors">Contraseña</Label>
              </div>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary rounded-xl pr-10 transition-all"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-12 w-12 px-3 text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors"
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

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 mt-6"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary-foreground" />
                  <span className="ml-3">Verificando...</span>
                </div>
              ) : (
                'Ingresar a mi cuenta'
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="text-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Credenciales de Demo</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button 
                type="button"
                onClick={() => { setEmail('marian45@gmail.com'); setPassword('password123'); }}
                className="flex items-center justify-between p-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-all text-left group"
              >
                <div>
                  <p className="text-xs font-bold text-primary">Gerente de Proyecto</p>
                  <p className="text-[10px] text-muted-foreground">marian45@gmail.com</p>
                </div>
                <div className="text-[10px] font-mono bg-primary/10 px-2 py-1 rounded text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Auto-llenar
                </div>
              </button>
              
              <button 
                type="button"
                onClick={() => { setEmail('designer3@grayola.com'); setPassword('password123'); }}
                className="flex items-center justify-between p-3 rounded-xl bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/10 transition-all text-left group"
              >
                <div>
                  <p className="text-xs font-bold text-purple-500">Diseñador/Colaborador</p>
                  <p className="text-[10px] text-muted-foreground">designer3@grayola.com</p>
                </div>
                <div className="text-[10px] font-mono bg-purple-500/10 px-2 py-1 rounded text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Auto-llenar
                </div>
              </button>

              <button 
                type="button"
                onClick={() => { setEmail('prueba1@gmail.com'); setPassword('password123'); }}
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 transition-all text-left group"
              >
                <div>
                  <p className="text-xs font-bold text-emerald-500">Cliente Externo</p>
                  <p className="text-[10px] text-muted-foreground">prueba1@gmail.com</p>
                </div>
                <div className="text-[10px] font-mono bg-emerald-500/10 px-2 py-1 rounded text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Auto-llenar
                </div>
              </button>
            </div>
            
            <div className="mt-6 text-center text-xs text-muted-foreground leading-relaxed px-2">
              <p>Contraseña para todos: <span className="font-mono font-bold text-foreground">password123</span></p>
              <p className="mt-2 text-[10px] italic">
                * El PM ve todo, el Diseñador ve lo asignado y el Cliente ve lo que él mismo crea.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center text-sm transition-colors">
            <span className="text-muted-foreground">¿Problemas de acceso? </span>
            <Link
              href="/register"
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              Crea una cuenta aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * EXPLICACIÓN DE ROLES (Grayola Fullstack App):
 * 
 * 1. Project Manager (pm):
 *    - Es el rol administrativo principal.
 *    - Puede ver TODOS los proyectos, editarlos, asignarlos y eliminarlos.
 *    - Tiene acceso total a los documentos y configuración del dashboard.
 * 
 * 2. Designer (designer):
 *    - Rol de colaborador creativo.
 *    - Solo puede ver los proyectos que le han sido asignados explícitamente (`assigned_to`).
 *    - Puede subir archivos y actualizar el progreso de las tareas asignadas.
 * 
 * 3. Client (client):
 *    - Rol externo para revisión.
 *    - Solo puede ver los proyectos que él mismo ha creado (`created_by`).
 *    - Puede crear nuevos proyectos para solicitar servicios y comentar en ellos.
 * 
 * Este sistema se basa en RLS (Row Level Security) de Supabase, lo que garantiza que
 * la seguridad se mantenga incluso a nivel de base de datos, no solo en el frontend.
 */ 