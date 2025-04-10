'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUserWithRole = async (userId: string) => {
    try {
      // Primero intentamos obtener el rol de la tabla users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, email')
        .eq('id', userId)
        .single()

      if (userData?.role) {
        console.log("Rol encontrado en users:", userData.role)
        return userData.role
      } else {
        console.log("Usuario no encontrado en tabla users o no tiene rol")
      }

      // Si no se encuentra en users, intentamos con la tabla profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (profile?.role) {
        console.log("Rol encontrado en profiles:", profile.role)
        return profile.role
      } else {
        console.log("Usuario no encontrado en tabla profiles o no tiene rol")
      }

      // Si no encontramos el rol en ninguna tabla, consultamos la metadata del usuario
      const { data: { user: authUser } } = await supabase.auth.getUser(userId)
      
      if (authUser?.user_metadata?.role) {
        console.log("Rol encontrado en user_metadata:", authUser.user_metadata.role)
        return authUser.user_metadata.role
      }

      // Si no encontramos el rol en ninguna tabla, devolvemos un valor por defecto
      console.log("No se encontró ningún rol para el usuario, asignando 'client' por defecto")
      return 'client'
    } catch (error) {
      console.error("Error al buscar el rol del usuario:", error)
      return 'client'
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const role = await fetchUserWithRole(session.user.id)
        setUser({
          ...session.user,
          role: role
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    // Cargar usuario inicial
    const loadUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (currentUser) {
        const role = await fetchUserWithRole(currentUser.id)
        setUser({
          ...currentUser,
          role: role
        })
      }
      setLoading(false)
    }

    loadUser()
    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    if (data.user) {
      const role = await fetchUserWithRole(data.user.id)
      setUser({
        ...data.user,
        role: role
      })
    }
  }

  const signUp = async (email: string, password: string) => {
    const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })
    if (signUpError) throw signUpError

    if (newUser) {
      // Crear el perfil con el rol
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: newUser.id,
            role: 'cliente', // Por defecto asignamos el rol de cliente
            email: email
          }
        ])
      if (profileError) throw profileError

      setUser({
        ...newUser,
        role: 'cliente'
      })
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    router.push('/login')
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
} 