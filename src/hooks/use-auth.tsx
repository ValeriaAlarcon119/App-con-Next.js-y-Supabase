'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: any | null
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Obtener la sesión activa
    const getInitialSession = async () => {
      setIsLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          await getUserData(session.user.id)
        }
        
        // Establecer escucha para cambios en la autenticación
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(async (event, session) => {
          if (session) {
            await getUserData(session.user.id)
          } else {
            setUser(null)
          }
        })
        
        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()
  }, [])

  // Obtener los datos de usuario de la tabla users
  const getUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
        
      if (error) {
        console.error("Error obteniendo datos de usuario:", error.message)
        return null
      }
      
      if (data) {
        // Obtener datos de sesión para combinar con datos de la tabla users
        const { data: sessionData } = await supabase.auth.getSession()
        setSession(sessionData.session)
        
        // Combinar datos de ambas fuentes
        const userWithRole = {
          ...sessionData.session?.user,
          role: data.role,
        }
        
        console.log("Usuario con rol:", userWithRole)
        setUser(userWithRole)
        return userWithRole
      }
      
      return null
    } catch (error) {
      console.error("Error en getUserData:", error)
      setUser(null)
      return null
    }
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      if (data.user) {
        await getUserData(data.user.id)
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      // Error silencioso al cerrar sesión
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
} 