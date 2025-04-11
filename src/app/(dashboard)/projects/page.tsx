'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Plus, Search, Filter, FileText, User, Calendar, Clock, 
  CheckCircle, Edit, Trash2, Eye, AlertCircle, MoreHorizontal,
  RefreshCw, ListFilter, ChevronDown, X, Tag, Briefcase, PenLine, PlusCircle, Edit2, Upload, FileUp, Paperclip, 
  File, Loader2, FileImage, FileCode, Download, Building2, Paintbrush, ShieldCheck
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

interface FileObject {
  name: string
  path: string
  type: string
  size: number
  url?: string
  file?: File | Blob
}

interface Project {
  id: string
  title: string
  description: string
  files: FileObject[]
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

const FileInput = ({ onChange, disabled, multiple = false }: { 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  disabled?: boolean,
  multiple?: boolean 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
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
        className="w-auto bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        <Paperclip className="mr-2 h-4 w-4" />
        Seleccionar archivos
      </Button>
    </div>
  );
};

const sanitizeFileName = (fileName: string): string => {

  let sanitized = fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^\w.-]/g, "_"); 
  
  return sanitized;
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
    files: [] as FileObject[]
  })
  
  const [titleStatus, setTitleStatus] = useState<{
    message: string;
    isError: boolean;
  } | null>(null)
  
  const [isTitleCheckPending, setIsTitleCheckPending] = useState(false)
  const [titleCheckTimeout, setTitleCheckTimeout] = useState<NodeJS.Timeout | null>(null)

  const { toast } = useToast()
  const { user } = useAuth()

  const creatorOptions = [...new Set(projects.map(p => p.created_by_email))].filter(Boolean) as string[]
  const designerOptions = [...new Set(projects.map(p => p.assigned_to_email))].filter(Boolean) as string[]

  const isDesigner = user?.role ? 
    ['diseñador', 'designer'].includes(user.role.toLowerCase()) : 
    false
  
  const isClient = user?.role ? 
    ['cliente', 'client'].includes(user.role.toLowerCase()) : 
    false
  
  const isProjectManager = user?.role ? 
    ['project manager', 'project_manager'].includes(user.role.toLowerCase()) : 
    false

  const canCreate = isProjectManager || isClient
  const canEdit = isProjectManager
  const canDelete = isProjectManager
  const canView = true

  const [dialogOpen, setDialogOpen] = useState(false);

  const [viewingProject, setViewingProject] = useState<Project | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    files: [] as FileObject[]
  })
  const [isEditingProject, setIsEditingProject] = useState(false)
  const [editProgress, setEditProgress] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [editTitleStatus, setEditTitleStatus] = useState<{
    message: string;
    isError: boolean;
  } | null>(null)
  
  const [isEditTitleCheckPending, setIsEditTitleCheckPending] = useState(false)
  const [editTitleCheckTimeout, setEditTitleCheckTimeout] = useState<NodeJS.Timeout | null>(null)

  const [newFile, setNewFile] = useState('')
  const [newEditFile, setNewEditFile] = useState('')

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [pendingEditChanges, setPendingEditChanges] = useState<any>(null)

  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [fileProgress, setFileProgress] = useState(0)

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
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('role', 'designer')
      
      if (usersError) {
        console.error('Error al buscar diseñadores:', usersError)
        setDesigners([])
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
      setDesigners([])
    }
  }

  const fetchProjects = async () => {
    try {
      setLoading(true)
      
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
          let transformedProjects = projectsData.map(project => ({
            ...project,
            created_by_email: project.creator?.email || project.created_by,
            created_by_role: project.creator?.role || 'Usuario',
            assigned_to_email: project.assignee?.email || project.assigned_to,
            assigned_to_role: project.assignee?.role || 'Usuario'
          }))
          
          transformedProjects = assignRandomStatuses(transformedProjects)
          
          console.log('Proyectos obtenidos con relaciones:', transformedProjects)
          setProjects(transformedProjects)
          setLoading(false)
          return
        }
      } catch (relationError) {
        console.error('Error al obtener proyectos con relaciones:', relationError)
      }
      
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
        setProjects([])
        return
      }

      let transformedProjects = await Promise.all(projectsData.map(async (project) => {
        let created_by_email = project.created_by;
        let created_by_role = 'Usuario';
        let assigned_to_email = project.assigned_to;
        let assigned_to_role = 'Diseñador';
        
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
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const createProject = async () => {
    try {
      setIsCreatingProject(true);

      if (formData.assigned_to === "unassigned") {
        toast({
          title: "Error",
          description: "Debe seleccionar un diseñador para el proyecto",
          variant: "destructive",
        });
        setIsCreatingProject(false);
        return;
      }
      
      console.log("Archivos a subir:", formData.files);
      
      const { data: projectData, error } = await supabase
        .from('projects')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            created_by: user?.id,
            assigned_to: formData.assigned_to === "unassigned" ? null : formData.assigned_to,
            files: [] 
          },
        ])
        .select();

      if (error) {
        console.error('Error creating project:', error)
        toast({
          title: "Error",
          description: error.message || "No se pudo crear el proyecto. Verifica los permisos de tu rol.",
          variant: "destructive",
        })
        throw error
      }
      
      const newProjectId = projectData?.[0]?.id;
      console.log("Proyecto creado con ID:", newProjectId);
      
      if (formData.files.length > 0 && newProjectId) {
        setUploadingFiles(true);
        
        const uploadedFiles = await Promise.all(
          formData.files.map(async (file, index) => {
            const progress = Math.round(((index + 1) / formData.files.length) * 100);
            setFileProgress(progress);
            
            if (file.url) return file;
            
            try {
             
              const safeFileName = sanitizeFileName(file.name);
              
             
              const filePath = `projects/${newProjectId}/${safeFileName}`;
              
              console.log('Intentando subir archivo a:', filePath);
              
              const { data, error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file.file instanceof Blob ? file.file : new Blob([]), {
                  cacheControl: '3600',
                  upsert: true
                });
              
              if (uploadError) {
                console.error('Error uploading file:', uploadError);
                toast({
                  title: "Error",
                  description: `Error al subir el archivo ${file.name}: ${uploadError.message}`,
                  variant: "destructive",
                });
                return null;
              }
              
              const fileUrl = supabase.storage.from('documents').getPublicUrl(filePath).data.publicUrl;
              
              console.log('Archivo subido exitosamente:', {
                name: file.name, 
                path: filePath,
                type: file.type,
                url: fileUrl
              });
              
              return {
                name: file.name, 
                path: filePath,
                type: file.type,
                size: file.size,
                url: fileUrl
              };
            } catch (err) {
              console.error('Error processing file:', err);
              return null;
            }
          })
        );
        
        const successfullyUploadedFiles = uploadedFiles.filter(Boolean) as FileObject[];
        
        console.log('Archivos subidos exitosamente:', successfullyUploadedFiles);
        
        if (successfullyUploadedFiles.length > 0) {
          const { error: updateError } = await supabase
            .from('projects')
            .update({
              files: successfullyUploadedFiles
            })
            .eq('id', newProjectId);
          
          if (updateError) {
            console.error('Error updating project with files:', updateError);
            toast({
              title: "Advertencia",
              description: "Se creó el proyecto pero hubo un problema al guardar los archivos",
              variant: "destructive",
            });
          } else {
            console.log('Proyecto actualizado con archivos:', successfullyUploadedFiles);
          }
        }
        
        setUploadingFiles(false);
      }

      console.log("Actualizando lista de proyectos")
   
      await fetchProjects()
 
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
      
      setDialogOpen(false)
    } catch (error: any) {
      console.error('Error creating project:', error)
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el proyecto. Verifica los permisos de tu rol.",
        variant: "destructive",
      })
    } finally {
      console.log("Finalizando proceso...")
      setTimeout(() => {
        setIsCreatingProject(false)
        setCreateProgress(0)
        setFileProgress(0)
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
    
    if (name === 'title' && value.trim()) {
      setTitleStatus(null)
      setIsTitleCheckPending(true)
      
      if (titleCheckTimeout) {
        clearTimeout(titleCheckTimeout)
      }
      
      const timeout = setTimeout(async () => {
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('id')
            .ilike('title', value.trim())
            .limit(1)
            
          if (error) {
            console.error("Error al verificar título:", error)
            setTitleStatus(null)
          } else if (data && data.length > 0) {
            setTitleStatus({
              message: "Ya existe un proyecto con este título",
              isError: true
            })
          } else {
            if (value.trim()) {
              setTitleStatus({
                message: "Título disponible",
                isError: false
              })
            } else {
              setTitleStatus(null)
            }
          }
        } catch (err) {
          console.error("Error en la comprobación:", err)
          setTitleStatus(null)
        } finally {
          setIsTitleCheckPending(false)
        }
      }, 500)
      
      setTitleCheckTimeout(timeout)
    } else if (name === 'title' && !value.trim()) {

      setTitleStatus(null)
      setIsTitleCheckPending(false)
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      assigned_to: value
    }))
  }

  const getStatusBadge = (status?: string) => {
    if (!status) {
      return (
        <Badge variant="outline" className="capitalize" title="Sin estado">
          <span className="w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
        </Badge>
      )
    }

    switch (status.toLowerCase()) {
      case 'pendiente':
        return (
          <Badge variant="outline" title="Pendiente" className="status-badge-pending capitalize bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400">
            <AlertCircle className="h-3 w-3" />
          </Badge>
        )
      case 'en progreso':
        return (
          <Badge variant="outline" title="En progreso" className="status-badge-in-progress capitalize bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
            <RefreshCw className="h-3 w-3 animate-spin" />
          </Badge>
        )
      case 'completado':
        return (
          <Badge variant="outline" title="Completado" className="status-badge-completed capitalize bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="h-3 w-3" />
          </Badge>
        )
      case 'retrasado':
        return (
          <Badge variant="outline" title="Retrasado" className="status-badge-delayed capitalize bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="h-3 w-3" />
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" title={status} className="capitalize">
            {status}
          </Badge>
        )
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchTerm.trim() || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      !statusFilter || 
      (project.status?.toLowerCase() === statusFilter.toLowerCase());
    
    const matchesCreator = 
      !creatorFilter || 
      project.created_by_email === creatorFilter;
    
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

  const getRoleMessage = () => {
    if (isDesigner) return <span className="block text-xs mt-1 text-accent">(Modo diseñador: solo visualización)</span>
    if (isProjectManager) return <span className="block text-xs mt-1 text-primary">(Project Manager: acceso completo)</span>
    if (isClient) return <span className="block text-xs mt-1 text-green-500">(Cliente: puedes crear proyectos)</span>
    return null
  }

  const viewProjectDetails = (project: Project) => {
    setViewingProject(project)
    setViewDialogOpen(true)
  }

  const deleteProject = async (projectId: string) => {
    if (!user) return
    
    try {
      setIsDeleting(true)
      
      if (!canDelete) {
        toast({
          title: "Error",
          description: "No tienes permisos para eliminar proyectos.",
          variant: "destructive",
        })
        return
      }
      
      const { data: projectData, error: fetchError } = await supabase
        .from('projects')
        .select('title')
        .eq('id', projectId)
        .single()
      
      if (fetchError) {
        throw fetchError
      }
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
      
      if (error) {
        throw error
      }
      
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
  
  const renderActionButtons = (project: Project) => {
    return (
      <div className="flex gap-1">
        {canView && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="icon-button text-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/20"
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
            className="icon-button text-indigo-700 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-900/20"
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
                className="icon-button text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/20"
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

  const assignRandomStatuses = (projectsList: Project[]) => {
    if (!projectsList || projectsList.length === 0) return projectsList
    
    const statusOptions = ['pendiente', 'en progreso', 'completado', 'retrasado']
    
    return projectsList.map((project, index) => {
      const statusIndex = index % statusOptions.length
      return {
        ...project,
        status: statusOptions[statusIndex]
      }
    })
  }

  const handleAddFile = (newFile: string) => {
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, {
        name: newFile,
        path: '',
        type: 'file',
        size: 0
      }]
    }))
  }

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const handleAddEditFile = (newEditFile: string) => {
    setEditFormData(prev => ({
      ...prev,
      files: [...prev.files, {
        name: newEditFile,
        path: '',
        type: 'file',
        size: 0
      }]
    }))
  }

  const handleRemoveEditFile = (index: number) => {
    setEditFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    const newFiles: FileObject[] = Array.from(selectedFiles).map(file => {

      let fileType = 'file';
      if (file.type.includes('image')) fileType = 'image';
      else if (file.type.includes('pdf')) fileType = 'pdf';
      else if (file.type.includes('html') || 
               file.type.includes('javascript') || 
               file.type.includes('css') || 
               file.type.includes('json')) fileType = 'code';
      else if (file.type.includes('text')) fileType = 'text';
      
      return {
        name: file.name,
        path: '',
        type: fileType,
        size: file.size,
        file: file 
      };
    });
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
    
    e.target.value = '';
  };

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    

    const newFiles: FileObject[] = Array.from(selectedFiles).map(file => {
  
      let fileType = 'file';
      if (file.type.includes('image')) fileType = 'image';
      else if (file.type.includes('pdf')) fileType = 'pdf';
      else if (file.type.includes('html') || 
               file.type.includes('javascript') || 
               file.type.includes('css') || 
               file.type.includes('json')) fileType = 'code';
      else if (file.type.includes('text')) fileType = 'text';
      
      return {
        name: file.name,
        path: '',
        type: fileType,
        size: file.size,
        file: file 
      };
    });
    
    setEditFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
    
    e.target.value = '';
  };

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

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (name === 'title' && value.trim() && editingProject) {
      setEditTitleStatus(null)
      setIsEditTitleCheckPending(true)
      
      if (editTitleCheckTimeout) {
        clearTimeout(editTitleCheckTimeout)
      }
      
      const timeout = setTimeout(async () => {
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('id')
            .ilike('title', value.trim())
            .neq('id', editingProject.id)
            .limit(1)
            
          if (error) {
            console.error("Error al verificar título:", error)
            setEditTitleStatus(null)
          } else if (data && data.length > 0) {
            setEditTitleStatus({
              message: "Ya existe otro proyecto con este título",
              isError: true
            })
          } else {
            setEditTitleStatus({
              message: "Título disponible",
              isError: false
            })
          }
        } catch (err) {
          console.error("Error en la comprobación:", err)
          setEditTitleStatus(null)
        } finally {
          setIsEditTitleCheckPending(false)
        }
      }, 500)
      
      setEditTitleCheckTimeout(timeout)
    }
  }

  const handleEditSelectChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const initiateProjectUpdate = () => {

    if (editFormData.assigned_to === "unassigned") {
      toast({
        title: "Error",
        description: "Debe seleccionar un diseñador para el proyecto",
        variant: "destructive",
      });
      return;
    }

    setPendingEditChanges({
      id: editingProject?.id,
      title: editFormData.title,
      description: editFormData.description,
      assigned_to: editFormData.assigned_to,
    });
    
    setConfirmDialogOpen(true);
  };

  const updateProject = async () => {
    if (!pendingEditChanges) return;
    
    try {
      setIsEditingProject(true);
      
      const allFiles = [...editFormData.files];
      const uploadedNewFiles: FileObject[] = [];
      
      for (const file of editFormData.files) {
        if (file.url) continue;
        
        try {
          if (file.file) {
   
            const safeFileName = sanitizeFileName(file.name);
            
            const filePath = `projects/${pendingEditChanges.id}/${safeFileName}`;
            
            console.log('Intentando subir archivo a:', filePath);
 
            const { data, error: uploadError } = await supabase.storage
              .from('documents')
              .upload(filePath, file.file instanceof Blob ? file.file : new Blob([]), {
                cacheControl: '3600',
                upsert: true
              });
            
            if (uploadError) {
              console.error('Error uploading file:', uploadError);
              continue;
            }
            
            const fileUrl = supabase.storage.from('documents').getPublicUrl(filePath).data.publicUrl;
            
            console.log('Archivo subido exitosamente durante actualización:', {
              name: file.name, 
              path: filePath,
              type: file.type || 'file',
              size: file.size || 0,
              url: fileUrl
            });
            
            uploadedNewFiles.push({
              name: file.name,
              path: filePath,
              type: file.type || 'file',
              size: file.size || 0,
              url: fileUrl
            });
          }
        } catch (err) {
          console.error('Error processing file:', err);
        }
      }
      const updatedFiles = allFiles.filter(file => file.url).concat(uploadedNewFiles);
      
      console.log('Actualizando proyecto con archivos:', updatedFiles);

      const { error: updateError } = await supabase
        .from('projects')
        .update({
          title: pendingEditChanges.title,
          description: pendingEditChanges.description,
          assigned_to: pendingEditChanges.assigned_to === "unassigned" ? null : pendingEditChanges.assigned_to,
          files: updatedFiles
        })
        .eq('id', pendingEditChanges.id);

      if (updateError) {
        console.error('Error updating project:', updateError);
        toast({
          title: "Error",
          description: "Hubo un problema al actualizar el proyecto",
          variant: "destructive",
        });
      } else {
        fetchProjects();
        setEditDialogOpen(false);
        setConfirmDialogOpen(false);
        toast({
          title: "Éxito",
          description: "Proyecto actualizado correctamente",
        });
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el proyecto",
        variant: "destructive",
      });
    } finally {
      setIsEditingProject(false);
    }
  };

  const onOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setPendingEditChanges(null);
    }
  };

  const renderFileCards = (files: FileObject[]) => {
    if (!files || files.length === 0) {
      return (
        <div className="text-center py-6 text-muted-foreground">
          No hay archivos adjuntos
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {files.map((file, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 flex justify-center items-center">
              {getFileIcon(file.type)}
            </div>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium truncate">{file.name}</CardTitle>
              <CardDescription className="text-xs">
                {file.size ? formatFileSize(file.size) : 'Desconocido'}
              </CardDescription>
            </CardHeader>
            <CardFooter className="py-2 bg-gray-50 dark:bg-gray-900 flex justify-end gap-2">
              {file.url && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-blue-600"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-green-600"
                    onClick={() => downloadFile(file.url!, file.name)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'image':
        return <FileImage className="h-6 w-6 text-purple-500" />;
      case 'code':
        return <FileCode className="h-6 w-6 text-blue-500" />;
      case 'text':
        return <FileText className="h-6 w-6 text-emerald-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadFile = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "No se pudo descargar el archivo",
        variant: "destructive",
      });
    }
  };

  const getRoleColorClass = (role?: string) => {
    if (!role) return '';
    
    const normalizedRole = role.toLowerCase();
    if (normalizedRole === 'cliente' || normalizedRole === 'client') 
      return 'text-blue-600 dark:text-blue-400';
    if (normalizedRole === 'diseñador' || normalizedRole === 'designer') 
      return 'text-purple-600 dark:text-purple-400';
    if (normalizedRole === 'project_manager' || normalizedRole === 'project manager' || normalizedRole === 'administrador') 
      return 'text-green-600 dark:text-green-400';
    
    return '';
  }

  const getRoleBackgroundClass = (role?: string) => {
    if (!role) return 'bg-white/50 dark:bg-gray-800/50';
    
    const normalizedRole = role.toLowerCase();
    if (normalizedRole === 'cliente' || normalizedRole === 'client') 
      return 'bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/20';
    if (normalizedRole === 'diseñador' || normalizedRole === 'designer') 
      return 'bg-gradient-to-br from-white/80 to-purple-50/80 dark:from-gray-800/80 dark:to-purple-900/20';
    if (normalizedRole === 'project_manager' || normalizedRole === 'project manager' || normalizedRole === 'administrador') 
      return 'bg-gradient-to-br from-white/80 to-green-50/80 dark:from-gray-800/80 dark:to-green-900/20';
    
    return 'bg-white/50 dark:bg-gray-800/50';
  }

  const getRoleBorderClass = (role?: string) => {
    if (!role) return 'border-t-gray-200 dark:border-t-gray-700';
    
    const normalizedRole = role.toLowerCase();
    if (normalizedRole === 'cliente' || normalizedRole === 'client') 
      return 'border-t-blue-300 dark:border-t-blue-700';
    if (normalizedRole === 'diseñador' || normalizedRole === 'designer') 
      return 'border-t-purple-300 dark:border-t-purple-700';
    if (normalizedRole === 'project_manager' || normalizedRole === 'project manager' || normalizedRole === 'administrador') 
      return 'border-t-green-300 dark:border-t-green-700';
    
    return 'border-t-gray-200 dark:border-t-gray-700';
  }

  const getRoleIcon = (role?: string) => {
    const normalizedRole = role?.toLowerCase() || '';
    if (normalizedRole === 'cliente' || normalizedRole === 'client') 
      return <Building2 className="h-3 w-3" />;
    if (normalizedRole === 'diseñador' || normalizedRole === 'designer') 
      return <Paintbrush className="h-3 w-3" />;
    if (normalizedRole === 'project_manager' || normalizedRole === 'project manager' || normalizedRole === 'administrador') 
      return <ShieldCheck className="h-3 w-3" />;
    
    return <User className="h-3 w-3" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Cargando proyectos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-100 via-slate-100 to-indigo-100 dark:from-gray-900 dark:via-black dark:to-gray-900 p-4 rounded-xl shadow-sm border border-gray-300 dark:border-gray-800">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse dark:bg-blue-900"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse dark:bg-indigo-900"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm dark:from-blue-900/20 dark:to-indigo-900/20"></div>
        
        <div className="relative flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left md:items-center">
          <div className="mx-auto md:mx-0">
            <h1 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 drop-shadow-sm tracking-tight dark:from-white dark:to-gray-300">
              Gestión de Proyectos
            </h1>
            
            <span className="inline-block bg-blue-200 text-blue-900 py-0.5 px-2 rounded-full text-xs mt-1 dark:bg-blue-900/40 dark:text-white font-medium">
              {isProjectManager && "Acceso completo"}
              {isClient && "Puedes crear proyectos"}
              {isDesigner && "Solo visualización"}
            </span>
          </div>

          <Button
            className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                className={`rounded-md ${titleStatus?.isError ? 'border-destructive focus-visible:ring-destructive' : titleStatus && !titleStatus.isError ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
              />
              {isTitleCheckPending && (
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <div className="animate-spin w-3 h-3 border border-muted-foreground rounded-full border-t-transparent mr-1"></div>
                  Verificando disponibilidad...
                </div>
              )}
              {titleStatus && (
                <p className={`text-xs ${titleStatus.isError ? 'text-destructive' : 'text-green-500'} mt-1`}>
                  {titleStatus.message}
                </p>
              )}
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
              <Label htmlFor="assigned_to-empty">Asignar a diseñador <span className="text-destructive">*</span></Label>
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
                  <p className="text-sm font-medium">Archivos seleccionados:</p>
                  <div className="bg-muted/50 rounded-md p-2 space-y-1">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-background rounded px-3 py-1.5 text-sm">
                        <div className="flex items-center">
                          {getFileIcon(file.type)}
                          <span className="ml-2">{file.name}</span>
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
              <Button variant="outline" disabled={isCreatingProject}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={createProject}
              disabled={isCreatingProject || titleStatus?.isError === true}
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

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                variant="default" 
                className="bg-black hover:bg-gray-900 text-white h-8 px-3 text-xs shadow-sm dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-3.5 w-3.5 text-white" />
                {(statusFilter || creatorFilter || designerFilter) && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-white text-black dark:bg-gray-800 dark:text-white">
                    {[statusFilter, creatorFilter, designerFilter].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              
              <div className="relative w-40 md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                <Input
                  placeholder="Buscar proyectos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-black"
                />
              </div>
            </div>

            <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="grid" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                <div className="flex items-center gap-2">
                  <div className="bg-pink-100 dark:bg-pink-900/30 w-5 h-5 flex items-center justify-center rounded-full">
                    <Tag className="h-3 w-3 text-pink-600 dark:text-pink-400" />
                  </div>
                  <span className="hidden sm:inline text-xs">Tarjetas</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="list" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                <div className="flex items-center gap-2">
                  <div className="bg-violet-100 dark:bg-violet-900/30 w-5 h-5 flex items-center justify-center rounded-full">
                    <ListFilter className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span className="hidden sm:inline text-xs">Lista</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          {showFilters && (
            <div className="bg-white dark:bg-gray-900 p-5 rounded-lg space-y-4 shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-sm tracking-tight">Filtrar proyectos</h3>
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
                  <p className="text-xs mb-2 font-medium text-gray-500 dark:text-gray-400">Estado</p>
                  <Select
                    value={statusFilter || "all"}
                    onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-full text-xs rounded-md h-9 border-gray-200 dark:border-gray-800">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pendiente">
                        <div className="flex items-center">
                          <AlertCircle className="h-3 w-3 mr-2 text-amber-500" />
                          <span className="text-xs">Pendiente</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="en progreso">
                        <div className="flex items-center">
                          <RefreshCw className="h-3 w-3 mr-2 text-blue-500" />
                          <span className="text-xs">En Progreso</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="completado">
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                          <span className="text-xs">Completado</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="retrasado">
                        <div className="flex items-center">
                          <AlertCircle className="h-3 w-3 mr-2 text-red-500" />
                          <span className="text-xs">Retrasado</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <p className="text-xs mb-2 font-medium text-gray-500 dark:text-gray-400">Creador</p>
                  <Select
                    value={creatorFilter || "all"}
                    onValueChange={(value) => setCreatorFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-full text-xs rounded-md h-9 border-gray-200 dark:border-gray-800">
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
                  <p className="text-xs mb-2 font-medium text-gray-500 dark:text-gray-400">Diseñador</p>
                  <Select
                    value={designerFilter || "all"}
                    onValueChange={(value) => setDesignerFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-full text-xs rounded-md h-9 border-gray-200 dark:border-gray-800">
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

        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="card-hover border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] max-w-xs flex flex-col"
                >
                  <div className="h-1 bg-gradient-to-r from-gray-800 to-black"></div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <CardTitle className="text-base font-medium overflow-hidden">{project.title}</CardTitle>
                      </div>
                      <div title={project.status} className="tooltip">
                        {getStatusBadge(project.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 pb-2 flex-grow">
                    <div className="p-4 rounded-md shadow-sm border border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
                      <h3 className="font-medium mb-2">Detalles del proyecto</h3>
                      <p className="text-sm text-gray-800 dark:text-gray-300">
                        {project.description || "Sin descripción"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="relative overflow-hidden flex items-center gap-1 text-xs bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 p-2 rounded-md border border-blue-200 dark:border-blue-800/30">
                        <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse dark:bg-blue-900"></div>
                        <User className="h-3 w-3 text-blue-800 dark:text-blue-400" />
                        <div>
                          <p className="font-medium text-[10px] text-gray-700 dark:text-gray-400">Creado por:</p>
                          <p className="text-gray-900 dark:text-gray-200 text-[10px] truncate">
                            {project.created_by_email ? project.created_by_email.split('@')[0] : 'No asignado'}
                          </p>
                        </div>
                      </div>
                      <div className="relative overflow-hidden flex items-center gap-1 text-xs bg-gradient-to-br from-indigo-50/80 via-blue-50/80 to-sky-50/80 dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-sky-900/20 p-2 rounded-md border border-indigo-100/50 dark:border-indigo-800/30">
                        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
                        <User className="h-3 w-3 text-indigo-700 dark:text-indigo-400" />
                        <div>
                          <p className="font-medium text-[10px] text-gray-600 dark:text-gray-400">Asignado a:</p>
                          <p className="text-gray-800 dark:text-gray-200 text-[10px] truncate">
                            {project.assigned_to_email ? project.assigned_to_email.split('@')[0] : 'No asignado'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-3 pt-2 border-t border-gray-100 dark:border-gray-800 mt-auto">
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3 text-gray-500 dark:text-white" />
                      <span className="text-[10px] text-gray-500 dark:text-white">
                        {project.files?.length || 0}
                      </span>
                      <Clock className="h-3 w-3 text-gray-500 dark:text-white ml-1" />
                      <span className="text-[10px] text-gray-500 dark:text-white">
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
                  <Button 
                    className="mt-4 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Crear primer proyecto
                  </Button>
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

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
          {viewingProject && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Briefcase className="h-6 w-6 text-primary" />
                  {viewingProject.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Descripción</h3>
                    <p className="text-sm text-muted-foreground bg-white/50 dark:bg-gray-800/50 p-4 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                      {viewingProject.description || "Sin descripción"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar actualización</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea actualizar este proyecto?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isEditingProject}
            >
              No, cancelar
            </Button>
            <Button 
              onClick={updateProject}
              disabled={isEditingProject}
            >
              Sí, confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Editar proyecto
            </DialogTitle>
            <DialogDescription>
              Modifica los detalles del proyecto y asígnalo a un diseñador.
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
                className={`rounded-md ${editTitleStatus?.isError ? 'border-destructive focus-visible:ring-destructive' : editTitleStatus && !editTitleStatus.isError ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
              />
              {isEditTitleCheckPending && (
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <div className="animate-spin w-3 h-3 border border-muted-foreground rounded-full border-t-transparent mr-1"></div>
                  Verificando disponibilidad...
                </div>
              )}
              {editTitleStatus && (
                <p className={`text-xs ${editTitleStatus.isError ? 'text-destructive' : 'text-green-500'} mt-1`}>
                  {editTitleStatus.message}
                </p>
              )}
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
              <Label htmlFor="edit-assigned_to">Asignar a diseñador <span className="text-destructive">*</span></Label>
              <Select
                disabled={isEditingProject}
                onValueChange={(value) => handleEditSelectChange('assigned_to', value)}
                value={editFormData.assigned_to}
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
                onChange={handleEditFileSelect}
                disabled={isEditingProject}
                multiple
              />
              {editFormData.files.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm font-medium">Archivos:</p>
                  <div className="bg-muted/50 rounded-md p-2 space-y-1">
                    {editFormData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-background rounded px-3 py-1.5 text-sm">
                        <div className="flex items-center">
                          {getFileIcon(file.type)}
                          <span className="ml-2">{file.name}</span>
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
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 flex justify-center sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" disabled={isEditingProject}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={initiateProjectUpdate}
              disabled={isEditingProject || editTitleStatus?.isError === true}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {isEditingProject ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Actualizar proyecto'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}