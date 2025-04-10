'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Plus, Search, Filter, FileText, User, Calendar, Clock, 
  CheckCircle, Edit, Trash2, Eye, AlertCircle, MoreHorizontal,
  RefreshCw, ListFilter, ChevronDown, X, Tag, Briefcase, PenLine, PlusCircle, Edit2, Upload, FileUp, Paperclip, File
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from '@/hooks/use-auth'
import { Progress } from '@/components/ui/progress'
import { format as dateFormat } from 'date-fns'
import { es as dateLocale } from 'date-fns/locale'

interface UserData {
  id: string
  email: string
  role: string
}

interface Project {
  id: string
  title: string
  description: string
  files: string[]
  created_by: string
  assigned_to: string
  created_at: string
  updated_at: string
  status?: string
  created_by_email?: string
  created_by_role?: string
  assigned_to_email?: string
  assigned_to_role?: string
}

// Crear componentes personalizados para el input de archivos
const FileInput = ({ onChange, disabled, multiple = false }: { 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  disabled?: boolean,
  multiple?: boolean 
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  return (
    <div className="w-full flex justify-start">
      <input
        type="file"
        ref={inputRef}
        onChange={onChange}
        disabled={disabled}
        multiple={multiple}
        className="hidden"
        accept="*/*"
      />
      <Button
        type="button"
        variant="outline"
        className="w-auto bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        <Paperclip className="mr-2 h-4 w-4" />
        Seleccionar archivos
      </Button>
    </div>
  );
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [creatorFilter, setCreatorFilter] = useState<string | null>(null)
  const [designerFilter, setDesignerFilter] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [designers, setDesigners] = useState<UserData[]>([])
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [createProgress, setCreateProgress] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: 'unassigned',
    files: [] as string[]
  })
  
  const { toast } = useToast()
  const { user } = useAuth()

  const creatorOptions = [...new Set(projects.map(p => p.created_by_email))].filter(Boolean) as string[]
  const designerOptions = [...new Set(projects.map(p => p.assigned_to_email))].filter(Boolean) as string[]

  // Definir roles de usuario con lógica más clara
  const isDesigner = user?.role ? 
    ['diseñador', 'designer'].includes(user.role.toLowerCase()) : 
    false
  
  const isClient = user?.role ? 
    ['cliente', 'client'].includes(user.role.toLowerCase()) : 
    false
  
  const isProjectManager = user?.role ? 
    ['project manager', 'project_manager'].includes(user.role.toLowerCase()) : 
    false

  // Actualizar las variables de permisos según los requisitos
  // Project Manager: Ver, crear, editar y eliminar proyectos
  // Cliente: Ver, crear proyectos, pero NO editar ni eliminar
  // Diseñador: Solo ver proyectos, no puede crear, editar o eliminar
  const canCreate = isProjectManager || isClient
  const canEdit = isProjectManager
  const canDelete = isProjectManager
  const canView = true // Todos pueden ver detalles

  // Variable para referencia al modal
  const [dialogOpen, setDialogOpen] = useState(false);

  // Añadir estado para el modal de detalles
  const [viewingProject, setViewingProject] = useState<Project | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  // Añadir estados para edición
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    files: [] as string[]
  })
  const [isEditingProject, setIsEditingProject] = useState(false)
  const [editProgress, setEditProgress] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const [newFile, setNewFile] = useState('')
  const [newEditFile, setNewEditFile] = useState('')

  useEffect(() => {
    fetchProjects()
    fetchDesigners()
    console.log("Rol del usuario:", user?.role)
    console.log("¿Es diseñador?:", isDesigner)
    console.log("¿Es cliente?:", isClient)
    console.log("¿Es project manager?:", isProjectManager)
    console.log("¿Puede crear?:", canCreate)
    console.log("¿Puede editar?:", canEdit)
    console.log("¿Puede eliminar?:", canDelete)
  }, [user?.role])

  const fetchDesigners = async () => {
    try {
      // Probar directamente con la tabla principal users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('role', 'designer')
      
      if (usersError) {
        console.error('Error al buscar diseñadores:', usersError)
        setDesigners([]) // Si hay error, establecer un array vacío
        return
      }
      
      if (usersData && usersData.length > 0) {
        console.log('Diseñadores encontrados:', usersData)
        setDesigners(usersData)
      } else {
        console.log('No se encontraron diseñadores')
        setDesigners([])
      }
    } catch (error) {
      console.error('Error fetching designers:', error)
      setDesigners([]) // Si hay error, establecer un array vacío
    }
  }

  const fetchProjects = async () => {
    try {
      setLoading(true)
      
      // Primero intentar con la consulta completa con relaciones
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select(`
            *,
            creator:users!created_by(email, role),
            assignee:users!assigned_to(email, role)
          `)
          .order('created_at', { ascending: false })
          
        if (!projectsError && projectsData) {
          // Transformar los proyectos para la visualización
          let transformedProjects = projectsData.map(project => ({
            ...project,
            created_by_email: project.creator?.email || project.created_by,
            created_by_role: project.creator?.role || 'Usuario',
            assigned_to_email: project.assignee?.email || project.assigned_to,
            assigned_to_role: project.assignee?.role || 'Usuario'
          }))
          
          // Asignar estados aleatorios para demo
          transformedProjects = assignRandomStatuses(transformedProjects)
          
          console.log('Proyectos obtenidos con relaciones:', transformedProjects)
          setProjects(transformedProjects)
          setLoading(false)
          return
        }
      } catch (relationError) {
        console.error('Error al obtener proyectos con relaciones:', relationError)
        // Si falla, continuamos con la consulta simplificada
      }
      
      // Consulta simplificada como fallback
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (projectsError) {
        console.error('Error de Supabase:', projectsError)
        toast({
          title: "Error",
          description: "No se pudieron cargar los proyectos: " + projectsError.message,
          variant: "destructive",
        })
        setProjects([]) // Establecer array vacío en caso de error
        return
      }

      // Buscar información de usuarios separadamente para cada proyecto
      let transformedProjects = await Promise.all(projectsData.map(async (project) => {
        let created_by_email = project.created_by;
        let created_by_role = 'Usuario';
        let assigned_to_email = project.assigned_to;
        let assigned_to_role = 'Diseñador';
        
        // Intentar obtener información del creador
        if (project.created_by) {
          try {
            const { data: creatorData } = await supabase
              .from('users')
              .select('email, role')
              .eq('id', project.created_by)
              .single();
            
            if (creatorData) {
              created_by_email = creatorData.email;
              created_by_role = creatorData.role;
            }
          } catch (error) {
            console.log('No se pudo obtener info del creador:', error);
          }
        }
        
        // Intentar obtener información del asignado
        if (project.assigned_to) {
          try {
            const { data: assigneeData } = await supabase
              .from('users')
              .select('email, role')
              .eq('id', project.assigned_to)
              .single();
            
            if (assigneeData) {
              assigned_to_email = assigneeData.email;
              assigned_to_role = assigneeData.role;
            }
          } catch (error) {
            console.log('No se pudo obtener info del asignado:', error);
          }
        }
        
        return {
          ...project,
          created_by_email,
          created_by_role,
          assigned_to_email,
          assigned_to_role
        };
      }));
      
      // Asignar estados aleatorios para demo
      transformedProjects = assignRandomStatuses(transformedProjects)

      console.log('Proyectos obtenidos:', transformedProjects)
      setProjects(transformedProjects)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los proyectos. Intente nuevamente.",
        variant: "destructive",
      })
      setProjects([]) // Establecer array vacío en caso de error
    } finally {
      setLoading(false)
    }
  }

  const createProject = async () => {
    if (!user) return
    
    try {
      setIsCreatingProject(true)
      
      // Animación de progreso
      setCreateProgress(25)
      console.log("Iniciando creación de proyecto", formData)
      
      // Validación
      if (!formData.title.trim()) {
        toast({
          title: "Error",
          description: "El título del proyecto es obligatorio",
          variant: "destructive",
        })
        throw new Error("Título obligatorio")
      }
      
      setCreateProgress(50)
      console.log("Validación completada, enviando a Supabase")
      
      // Crear el proyecto nuevo
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            created_by: user.id,
            assigned_to: formData.assigned_to === "unassigned" ? null : formData.assigned_to,
            files: formData.files,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
      
      setCreateProgress(75)
      console.log("Respuesta de Supabase:", { data, error })
      
      if (error) {
        console.error("Error detallado:", error)
        throw error
      }

      // Crear una notificación sobre la creación del proyecto
      const userName = user.email.split('@')[0] // Usar la parte del email antes del @
      console.log("Creando notificación")
      
      try {
        const { error: notifError } = await supabase
          .from('notifications')
          .insert([
            {
              message: `${userName} ha creado el proyecto "${formData.title}"`,
              timestamp: new Date().toISOString(),
              read: false,
              user_id: user.id,
              project_id: (data as any)?.[0]?.id || null
            }
          ])
        
        if (notifError) {
          console.error("Error al crear la notificación:", notifError)
          // No lanzamos error aquí para que el flujo continúe
        }
      } catch (notifErr) {
        console.error("Error en notificación:", notifErr)
        // Continuamos con el flujo aunque falle la notificación
      }
      
      console.log("Actualizando lista de proyectos")
      // Actualizar la lista de proyectos
      await fetchProjects()
      
      // Resetear el formulario
      setFormData({
        title: '',
        description: '',
        assigned_to: 'unassigned',
        files: []
      })
      
      toast({
        title: "Éxito",
        description: "Proyecto creado correctamente",
        className: "bg-green-100 border-green-500 text-green-800",
      })
      
      // Cerrar el modal después de crear el proyecto
      setDialogOpen(false)
    } catch (error: any) {
      console.error('Error creating project:', error)
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el proyecto. Verifica los permisos de tu rol.",
        variant: "destructive",
      })
    } finally {
      // Asegurar que siempre se resetee el estado de creación
      console.log("Finalizando proceso...")
      setTimeout(() => {
        setIsCreatingProject(false)
        setCreateProgress(0)
        console.log("Estado de creación reseteado")
      }, 500)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      assigned_to: value
    }))
  }

  const getStatusBadge = (status?: string) => {
    // Si no hay status, mostrar "Sin estado"
    if (!status) {
      return (
        <Badge variant="outline" className="capitalize">
          Sin estado
        </Badge>
      )
    }

    switch (status.toLowerCase()) {
      case 'pendiente':
        return (
          <Badge variant="outline" className="status-badge-pending capitalize bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400">
            <AlertCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        )
      case 'en progreso':
        return (
          <Badge variant="outline" className="status-badge-in-progress capitalize bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            {status}
          </Badge>
        )
      case 'completado':
        return (
          <Badge variant="outline" className="status-badge-completed capitalize bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        )
      case 'retrasado':
        return (
          <Badge variant="outline" className="status-badge-delayed capitalize bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="capitalize">
            {status}
          </Badge>
        )
    }
  }

  // Mejorar la lógica de los filtros
  const filteredProjects = projects.filter(project => {
    // Filtro de búsqueda
    const matchesSearch = !searchTerm.trim() || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    // Filtro de estado
    const matchesStatus = 
      !statusFilter || 
      (project.status?.toLowerCase() === statusFilter.toLowerCase());
    
    // Filtro de creador
    const matchesCreator = 
      !creatorFilter || 
      project.created_by_email === creatorFilter;
    
    // Filtro de diseñador asignado
    const matchesDesigner = 
      !designerFilter || 
      project.assigned_to_email === designerFilter;
    
    return matchesSearch && matchesStatus && matchesCreator && matchesDesigner;
  });

  const clearFilters = () => {
    setStatusFilter(null)
    setCreatorFilter(null)
    setDesignerFilter(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  // Mensaje específico para cada rol
  const getRoleMessage = () => {
    if (isDesigner) return <span className="block text-xs mt-1 text-accent">(Modo diseñador: solo visualización)</span>
    if (isProjectManager) return <span className="block text-xs mt-1 text-primary">(Project Manager: acceso completo)</span>
    if (isClient) return <span className="block text-xs mt-1 text-green-500">(Cliente: puedes crear proyectos)</span>
    return null
  }

  // Función para abrir el modal de detalles
  const viewProjectDetails = (project: Project) => {
    setViewingProject(project)
    setViewDialogOpen(true)
  }

  // Implementar la eliminación real de un proyecto
  const deleteProject = async (projectId: string) => {
    if (!user) return
    
    try {
      setIsDeleting(true)
      
      // Validar que el usuario tenga permisos para eliminar proyectos
      if (!canDelete) {
        toast({
          title: "Error",
          description: "No tienes permisos para eliminar proyectos.",
          variant: "destructive",
        })
        return
      }
      
      // Obtener información del proyecto antes de eliminarlo
      const { data: projectData, error: fetchError } = await supabase
        .from('projects')
        .select('title')
        .eq('id', projectId)
        .single()
      
      if (fetchError) {
        throw fetchError
      }
      
      // Eliminar el proyecto
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
      
      if (error) {
        throw error
      }
      
      // Crear notificación de eliminación
      const userName = user.email.split('@')[0]
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([
          {
            message: `${userName} ha eliminado el proyecto "${projectData.title}"`,
            timestamp: new Date().toISOString(),
            read: false,
            user_id: user.id,
            project_id: null
          }
        ])
      
      if (notifError) {
        console.error("Error al crear la notificación de eliminación:", notifError)
      }
      
      // Actualizar la lista de proyectos
      await fetchProjects()
      
      toast({
        title: "Éxito",
        description: "Proyecto eliminado correctamente",
        className: "bg-green-100 border-green-500 text-green-800",
      })
    } catch (error: any) {
      console.error('Error deleting project:', error)
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el proyecto.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }
  
  // Cambiar el estilo del botón del ojo a azul
  const renderActionButtons = (project: Project) => {
    return (
      <div className="flex gap-1">
        {canView && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="icon-button text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            onClick={() => viewProjectDetails(project)}
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        
        {canEdit && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="icon-button text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            onClick={() => handleEditProject(project)}
            title="Editar proyecto"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        
        {canDelete && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="icon-button text-destructive hover:bg-destructive/10"
                title="Eliminar proyecto"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Eliminar proyecto</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button 
                  variant="destructive"
                  onClick={() => deleteProject(project.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  };

  // Asignar estados aleatorios a los proyectos
  const assignRandomStatuses = (projectsList: Project[]) => {
    if (!projectsList || projectsList.length === 0) return projectsList
    
    const statusOptions = ['pendiente', 'en progreso', 'completado', 'retrasado']
    
    return projectsList.map((project, index) => {
      // En lugar de aleatorio, asignar en secuencia para asegurar que hay de todos los tipos
      const statusIndex = index % statusOptions.length
      return {
        ...project,
        status: statusOptions[statusIndex]
      }
    })
  }

  const handleAddFile = () => {
    if (newFile.trim() === '') return
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, newFile]
    }))
    
    setNewFile('')
  }
  
  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }
  
  const handleAddEditFile = () => {
    if (newEditFile.trim() === '') return
    
    setEditFormData(prev => ({
      ...prev,
      files: [...prev.files, newEditFile]
    }))
    
    setNewEditFile('')
  }
  
  const handleRemoveEditFile = (index: number) => {
    setEditFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  // Añadir estas funciones para manejar la selección de archivos
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    // Añadir nombres de archivos seleccionados al estado
    const fileNames = Array.from(selectedFiles).map(file => file.name);
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...fileNames]
    }));
    
    // Limpiar el input de archivos para permitir seleccionar los mismos archivos nuevamente
    e.target.value = '';
  };

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    // Añadir nombres de archivos seleccionados al estado
    const fileNames = Array.from(selectedFiles).map(file => file.name);
    
    setEditFormData(prev => ({
      ...prev,
      files: [...prev.files, ...fileNames]
    }));
    
    // Limpiar el input de archivos para permitir seleccionar los mismos archivos nuevamente
    e.target.value = '';
  };

  // Abrir modal de edición con datos del proyecto
  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setEditFormData({
      title: project.title,
      description: project.description || '',
      assigned_to: project.assigned_to || 'unassigned',
      files: project.files || []
    })
    setEditDialogOpen(true)
  }

  // Manejar cambios en el formulario de edición
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Manejar cambios en los selectores del formulario de edición
  const handleEditSelectChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Corregir función saveProjectChanges para evitar que se quede cargando
  const saveProjectChanges = async () => {
    if (!user || !editingProject) return
    
    try {
      setIsEditingProject(true)
      setEditProgress(25)
      
      // Validación
      if (!editFormData.title.trim()) {
        toast({
          title: "Error",
          description: "El título del proyecto es obligatorio",
          variant: "destructive",
        })
        setIsEditingProject(false)
        return
      }
      
      setEditProgress(50)
      
      // Validar que el usuario tenga permisos para editar proyectos
      if (!canEdit) {
        toast({
          title: "Error",
          description: "No tienes permisos para editar proyectos.",
          variant: "destructive",
        })
        setIsEditingProject(false)
        return
      }
      
      // Actualizar el proyecto
      const { error } = await supabase
        .from('projects')
        .update({
          title: editFormData.title,
          description: editFormData.description,
          assigned_to: editFormData.assigned_to === "" ? null : editFormData.assigned_to,
          files: editFormData.files,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingProject.id)
      
      setEditProgress(75)
      
      if (error) {
        throw error
      }
      
      // Crear notificación de edición
      const userName = user.email.split('@')[0]
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([
          {
            message: `${userName} ha actualizado el proyecto "${editFormData.title}"`,
            timestamp: new Date().toISOString(),
            read: false,
            user_id: user.id,
            project_id: editingProject.id
          }
        ])
      
      if (notifError) {
        console.error("Error al crear la notificación de edición:", notifError)
      }
      
      // Actualizar la lista de proyectos
      await fetchProjects()
      
      setEditProgress(100)
      
      toast({
        title: "Éxito",
        description: "Proyecto actualizado correctamente",
        className: "bg-green-100 border-green-500 text-green-800",
      })
      
      // Cerrar el modal después de editar el proyecto
      setEditDialogOpen(false)
    } catch (error: any) {
      console.error('Error updating project:', error)
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el proyecto.",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setIsEditingProject(false)
        setEditProgress(0)
      }, 500)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Cargando proyectos...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        {/* Efectos de brillo */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 backdrop-blur-sm"></div>
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-800 drop-shadow-sm">
              Gestion de Proyectos
            </h1>
            
            <span className="inline-block bg-blue-100 text-blue-800 py-0.5 px-1.5 rounded-full text-[9px] mt-1 dark:bg-blue-900/40 dark:text-blue-300">
              {isProjectManager && "Project Manager: acceso completo"}
              {isClient && "Cliente: puedes crear proyectos"}
              {isDesigner && "Diseñador: solo visualización"}
            </span>
          </div>
          
          {canCreate && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="relative overflow-hidden bg-black hover:bg-gray-800 shadow-sm hover:shadow-black/10 transition-all duration-300 border border-gray-800 h-8 px-3 text-xs text-white">
                  <Plus className="mr-1 h-3.5 w-3.5 text-white" />
                  <span className="font-medium">Nuevo Proyecto</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Crear nuevo proyecto
                  </DialogTitle>
                  <DialogDescription>
                    Completa los detalles del proyecto y asígnalo a un diseñador.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {isCreatingProject && (
                    <div className="mb-4">
                      <Progress value={createProgress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Título del proyecto <span className="text-destructive">*</span></Label>
                    <Input 
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Ej. Rediseño de marca"
                      disabled={isCreatingProject}
                      className="rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea 
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detalla los objetivos y requisitos del proyecto"
                      disabled={isCreatingProject}
                      className="rounded-md min-h-[120px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="assigned_to">Asignar a diseñador</Label>
                    <Select 
                      disabled={isCreatingProject} 
                      onValueChange={handleSelectChange}
                      value={formData.assigned_to}
                    >
                      <SelectTrigger className="rounded-md">
                        <SelectValue placeholder="Seleccionar diseñador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Sin asignar</SelectItem>
                        {designers.length > 0 ? (
                          designers.map(designer => (
                            <SelectItem key={designer.id} value={designer.id}>
                              {designer.email} (Diseñador)
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-designers" disabled>
                            No hay diseñadores disponibles
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Archivos del proyecto</Label>
                    <FileInput 
                      onChange={handleFileSelect}
                      disabled={isCreatingProject}
                      multiple
                    />
                    
                    {formData.files.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm font-medium">Archivos añadidos:</p>
                        <div className="bg-muted/50 rounded-md p-2 space-y-1">
                          {formData.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-background rounded px-3 py-1.5 text-sm">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{file}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-destructive"
                                onClick={() => handleRemoveFile(index)}
                                disabled={isCreatingProject}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <DialogFooter className="gap-2 flex justify-center sm:justify-center">
                  <DialogClose asChild>
                    <Button variant="destructive" disabled={isCreatingProject}>
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button 
                    onClick={createProject}
                    disabled={isCreatingProject}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    {isCreatingProject ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      'Crear proyecto'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                variant="default" 
                className="bg-blue-500 hover:bg-blue-600 text-white h-8 px-3 text-sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-3.5 w-3.5 text-white" />
                {(statusFilter || creatorFilter || designerFilter) && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {[statusFilter, creatorFilter, designerFilter].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              
              <div className="relative w-40 md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar proyectos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
            </div>

            <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="grid" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                <div className="flex items-center gap-2">
                  <div className="bg-pink-100 dark:bg-pink-900/30 w-6 h-6 flex items-center justify-center rounded-full">
                    <Tag className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <span className="hidden sm:inline">Tarjetas</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="list" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                <div className="flex items-center gap-2">
                  <div className="bg-violet-100 dark:bg-violet-900/30 w-6 h-6 flex items-center justify-center rounded-full">
                    <ListFilter className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span className="hidden sm:inline">Lista</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          {showFilters && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Filtrar por:</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-xs" 
                  onClick={clearFilters}
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpiar filtros
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm mb-2 font-medium">Estado</p>
                  <Select
                    value={statusFilter || "all"}
                    onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pendiente">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                          <span>Pendiente</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="en progreso">
                        <div className="flex items-center">
                          <RefreshCw className="h-4 w-4 mr-2 text-blue-500" />
                          <span>En Progreso</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="completado">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>Completado</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="retrasado">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                          <span>Retrasado</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <p className="text-sm mb-2 font-medium">Creador</p>
                  <Select
                    value={creatorFilter || "all"}
                    onValueChange={(value) => setCreatorFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar creador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los creadores</SelectItem>
                      {creatorOptions.length > 0 ? (
                        creatorOptions.map(email => (
                          <SelectItem key={email} value={email}>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-primary" />
                              <span>{email}</span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-creators" disabled>
                          No hay creadores disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <p className="text-sm mb-2 font-medium">Diseñador</p>
                  <Select
                    value={designerFilter || "all"}
                    onValueChange={(value) => setDesignerFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar diseñador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los diseñadores</SelectItem>
                      {designerOptions.length > 0 ? (
                        designerOptions.map(email => (
                          <SelectItem key={email} value={email || "unassigned"}>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-accent" />
                              <span>{email || 'Sin asignar'}</span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-designers" disabled>
                          No hay diseñadores disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="card-hover border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <div className="h-2 bg-gradient-to-r from-primary to-accent"></div>
                  <CardHeader className="pt-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 italic font-light">
                      {project.description}
                    </p>
                    <div className="space-y-2">
                      <div className="relative overflow-hidden flex items-center gap-1 text-sm bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 p-3 rounded-md border border-blue-100/50 dark:border-blue-800/30">
                        <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
                        <User className="h-4 w-4 text-black dark:text-gray-200" />
                        <div>
                          <p className="font-medium text-xs text-black dark:text-white">Creado por:</p>
                          <p className="text-black dark:text-gray-300 text-xs">
                            {project.created_by_email || 'No asignado'} 
                            {project.created_by_role ? ` (${project.created_by_role})` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="relative overflow-hidden flex items-center gap-1 text-sm bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-blue-50/80 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 p-3 rounded-md border border-purple-100/50 dark:border-purple-800/30">
                        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
                        <User className="h-4 w-4 text-black dark:text-gray-200" />
                        <div>
                          <p className="font-medium text-xs text-black dark:text-white">Asignado a:</p>
                          <p className="text-black dark:text-gray-300 text-xs">
                            {project.assigned_to_email || 'No asignado'}
                            {project.assigned_to_role ? ` (${project.assigned_to_role})` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center gap-0.5">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {project.files?.length || 0} archivos
                      </span>
                      <Clock className="h-4 w-4 text-muted-foreground ml-1" />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(project.updated_at)}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {renderActionButtons(project)}
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <Briefcase className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-1">No se encontraron proyectos</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter || creatorFilter || designerFilter 
                    ? "Intenta con otros filtros" 
                    : "Crea tu primer proyecto para comenzar"}
                </p>
                {canCreate && !searchTerm && !statusFilter && !creatorFilter && !designerFilter && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="mt-4 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                        <Plus className="mr-2 h-4 w-4" />
                        Crear primer proyecto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-primary" />
                          Crear nuevo proyecto
                        </DialogTitle>
                        <DialogDescription>
                          Completa los detalles del proyecto y asígnalo a un diseñador.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6 py-4">
                        {isCreatingProject && (
                          <div className="mb-4">
                            <Progress value={createProgress} className="h-2" />
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label htmlFor="title-empty">Título del proyecto <span className="text-destructive">*</span></Label>
                          <Input 
                            id="title-empty"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Ej. Rediseño de marca"
                            disabled={isCreatingProject}
                            className="rounded-md"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description-empty">Descripción</Label>
                          <Textarea 
                            id="description-empty"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Detalla los objetivos y requisitos del proyecto"
                            disabled={isCreatingProject}
                            className="rounded-md min-h-[120px]"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="assigned_to-empty">Asignar a diseñador</Label>
                          <Select 
                            disabled={isCreatingProject} 
                            onValueChange={handleSelectChange}
                            value={formData.assigned_to}
                          >
                            <SelectTrigger className="rounded-md">
                              <SelectValue placeholder="Seleccionar diseñador" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">Sin asignar</SelectItem>
                              {designers.length > 0 ? (
                                designers.map(designer => (
                                  <SelectItem key={designer.id} value={designer.id}>
                                    {designer.email} (Diseñador)
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-designers" disabled>
                                  No hay diseñadores disponibles
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <DialogFooter className="gap-2 flex justify-center sm:justify-center">
                        <DialogClose asChild>
                          <Button variant="outline" disabled={isCreatingProject}>
                            Cancelar
                          </Button>
                        </DialogClose>
                        <Button 
                          onClick={createProject}
                          disabled={isCreatingProject}
                          className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                        >
                          {isCreatingProject ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Creando...
                            </>
                          ) : (
                            'Crear proyecto'
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <div className="overflow-hidden rounded-lg border border-border/50 bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-4 py-3 text-center font-medium">Proyecto</th>
                  <th className="px-4 py-3 text-center font-medium">Estado</th>
                  <th className="px-4 py-3 text-center font-medium hidden md:table-cell">Creado por</th>
                  <th className="px-4 py-3 text-center font-medium hidden md:table-cell">Asignado a</th>
                  <th className="px-4 py-3 text-center font-medium hidden lg:table-cell">Archivos</th>
                  <th className="px-4 py-3 text-center font-medium hidden lg:table-cell">Última actualización</th>
                  <th className="px-4 py-3 text-center font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-xs text-muted-foreground italic line-clamp-1">{project.description}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs text-center">
                        {project.created_by_email || 'No asignado'}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs text-center">
                        {project.assigned_to_email || 'No asignado'}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs text-center">
                        {project.files?.length || 0} archivos
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs text-center">
                        {formatDate(project.updated_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {renderActionButtons(project)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Briefcase className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium mb-1">No se encontraron proyectos</h3>
                        <p className="text-muted-foreground">
                          {searchTerm || statusFilter || creatorFilter || designerFilter 
                            ? "Intenta con otros filtros" 
                            : "Crea tu primer proyecto para comenzar"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de detalles del proyecto - Mejorado */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[650px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
          {viewingProject && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Briefcase className="h-6 w-6 text-primary" />
                  {viewingProject.title}
                </DialogTitle>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    Creado el {formatDate(viewingProject.created_at)}
                  </span>
                  <div className="sm:ml-auto">
                    {getStatusBadge(viewingProject.status)}
                  </div>
                </div>
              </DialogHeader>
              
              <div className="py-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Descripción</h3>
                    <p className="text-sm text-muted-foreground bg-white/50 dark:bg-gray-800/50 p-4 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                      {viewingProject.description || "Sin descripción"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                      <h3 className="font-medium mb-2">Creado por</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-primary" />
                        <span>
                          {viewingProject.created_by_email || 'No asignado'} 
                          {viewingProject.created_by_role ? ` (${viewingProject.created_by_role})` : ''}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                      <h3 className="font-medium mb-2">Asignado a</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-accent" />
                        <span>
                          {viewingProject.assigned_to_email || 'No asignado'}
                          {viewingProject.assigned_to_role ? ` (${viewingProject.assigned_to_role})` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Archivos del proyecto</h3>
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                      {viewingProject.files && viewingProject.files.length > 0 ? (
                        <div className="space-y-2">
                          {viewingProject.files.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>{file}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay archivos adjuntos</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Información adicional</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-white/50 dark:bg-gray-800/50 p-4 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{viewingProject.files?.length || 0} archivos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Actualizado: {formatDate(viewingProject.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="gap-2 flex justify-center sm:justify-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="destructive" 
                  onClick={() => setViewDialogOpen(false)}
                >
                  Cerrar
                </Button>
                {canEdit && (
                  <Button 
                    variant="outline"
                    className="text-indigo-700 border-indigo-700 hover:bg-indigo-100 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-900/20"
                    onClick={() => {
                      setViewDialogOpen(false)
                      handleEditProject(viewingProject)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modal de edición de proyecto */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
          {editingProject && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit2 className="h-5 w-5 text-primary" />
                  Editar proyecto
                </DialogTitle>
                <DialogDescription>
                  Actualiza los detalles del proyecto.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {isEditingProject && (
                  <div className="mb-4">
                    <Progress value={editProgress} className="h-2" />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Título del proyecto <span className="text-destructive">*</span></Label>
                  <Input 
                    id="edit-title"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditInputChange}
                    placeholder="Ej. Rediseño de marca"
                    disabled={isEditingProject}
                    className="rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Descripción</Label>
                  <Textarea 
                    id="edit-description"
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditInputChange}
                    placeholder="Detalla los objetivos y requisitos del proyecto"
                    disabled={isEditingProject}
                    className="rounded-md min-h-[120px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-assigned_to">Asignar a diseñador</Label>
                  <Select 
                    disabled={isEditingProject} 
                    onValueChange={(value) => handleEditSelectChange('assigned_to', value)}
                    value={editFormData.assigned_to || "unassigned"}
                  >
                    <SelectTrigger className="rounded-md">
                      <SelectValue placeholder="Seleccionar diseñador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Sin asignar</SelectItem>
                      {designers.length > 0 ? (
                        designers.map(designer => (
                          <SelectItem key={designer.id} value={designer.id}>
                            {designer.email} (Diseñador)
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-designers" disabled>
                          No hay diseñadores disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Archivos del proyecto</Label>
                <FileInput 
                  onChange={handleEditFileSelect}
                  disabled={isEditingProject}
                  multiple
                />
                
                {editFormData.files.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm font-medium">Archivos del proyecto:</p>
                    <div className="bg-muted/50 rounded-md p-2 space-y-1">
                      {editFormData.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-background rounded px-3 py-1.5 text-sm">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{file}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-destructive"
                            onClick={() => handleRemoveEditFile(index)}
                            disabled={isEditingProject}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">No hay archivos adjuntos</p>
                )}
              </div>
              
              <DialogFooter className="gap-2 flex justify-center sm:justify-center border-t border-gray-200 dark:border-gray-700 pt-4">
                <Button 
                  variant="destructive" 
                  onClick={() => setEditDialogOpen(false)}
                  disabled={isEditingProject}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={saveProjectChanges}
                  disabled={isEditingProject}
                  className="bg-indigo-700 hover:bg-indigo-800 text-white"
                >
                  {isEditingProject ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar cambios'
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 