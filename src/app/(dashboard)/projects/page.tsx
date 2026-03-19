'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Plus, Search, Filter, FileText, User, Calendar, Clock, 
  CheckCircle, Edit, Trash2, Eye, AlertCircle, MoreHorizontal,
  RefreshCw, ListFilter, ChevronDown, X, Tag, Briefcase, PenLine, PlusCircle, Edit2, Upload, FileUp, Paperclip, 
  File, Loader2, FileImage, FileVideo, FileCode, Download, Building2, Paintbrush, ShieldCheck, FolderOpen, Pencil, Files, Save
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
import { cn } from '@/lib/utils'

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
  tags?: string[]
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
function getFileTypeFromName(fileName: string): string {
  if (!fileName) return 'file';
  
  let cleanFileName = fileName
    .replace(/['"{}]/g, '')
    .split('"}')[0]
    .trim();
  
  const extension = cleanFileName.split('.').pop()?.toLowerCase() || '';
  
  const typeMap: Record<string, string> = {
 
    'pdf': 'pdf',
    'doc': 'word',
    'docx': 'word',
    
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'svg': 'image',
    
    'mp4': 'video',
    'mov': 'video',
    'avi': 'video',
    'mkv': 'video',
    'webm': 'video',
    
    'html': 'code',
    'css': 'code',
    'js': 'code',
    'jsx': 'code',
    'ts': 'code',
    'tsx': 'code',
    
    'txt': 'text',
    'md': 'text'
  };
  
  return typeMap[extension] || 'file';
}

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
  const { user, isLoading: authLoading } = useAuth()

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
  const canEdit = isProjectManager || isClient
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
    if (authLoading) return; // FIX BÚG DE RECARGA: Esperar a que la sesión cargue
    fetchProjects()
    fetchDesigners()
    console.log("Rol del usuario:", user?.role)
    console.log("¿Es diseñador?:", isDesigner)
    console.log("¿Es cliente?:", isClient)
    console.log("¿Es project manager?:", isProjectManager)
    console.log("¿Puede crear?:", canCreate)
    console.log("¿Puede editar?:", canEdit)
    console.log("¿Puede eliminar?:", canDelete)
  }, [user?.role, user?.id, authLoading])

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
    setLoading(true);
    
    // Obtenemos todos los usuarios para mapear creadores y diseñadores y evitar errores de Foreing Key en Supabase Cloud
    const { data: usersData } = await supabase.from('users').select('id, email, role');
    const usersMap = new Map();
    if (usersData) {
      usersData.forEach(u => usersMap.set(u.id, u));
    }
    
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    // Aplicar filtros según rol - ahora más robusto con el ID de usuario resuelto
    if (isClient && user?.id) {
      query = query.eq('created_by', user.id);
    } else if (isDesigner && user?.id) {
      query = query.eq('assigned_to', user.id);
    }

    const { data: projectsData, error: projectsError } = await query;
    
    if (projectsError) throw projectsError;
    
    if (projectsData) {
      const projectsWithStatus = projectsData.map(project => {
        const creator = usersMap.get(project.created_by);
        const assignee = usersMap.get(project.assigned_to);
        
        return {
          ...project,
          created_by_email: creator?.email || 'Usuario Creador',
          created_by_role: creator?.role || 'Usuario',
          assigned_to_email: assignee?.email || 'No asignado',
          assigned_to_role: assignee?.role || 'Ninguno',
          status: ['pendiente', 'en progreso', 'completado', 'retrasado'][Math.floor(Math.random() * 4)]
        }
      });

      console.log('Proyectos cargados exitosamente:', projectsWithStatus);
      setProjects(projectsWithStatus);
    }
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    toast({
      title: "Error al cargar proyectos",
      description: error.message || "No se pudieron obtener los datos de proyecto.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};
  const createProject = async () => {
    try {
      setIsCreatingProject(true);
      setCreateProgress(10);

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
      setCreateProgress(20);
      
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
      
      setCreateProgress(40);
      const newProjectId = projectData?.[0]?.id;
      console.log("Proyecto creado con ID:", newProjectId);
      
      if (formData.files.length > 0 && newProjectId) {
        setUploadingFiles(true);
        setCreateProgress(50);
        
        const successfullyUploadedFiles = await Promise.all(formData.files.map(async (file) => {
          const safeFileName = sanitizeFileName(file.name);
          const filePath = `projects/${newProjectId}/${safeFileName}`;
          
          try {
            const { data, error: uploadError } = await supabase.storage
              .from('documents')
              .upload(filePath, file.file instanceof Blob ? file.file : new Blob([]), {
                cacheControl: '3600',
                upsert: true
              });
            
            if (uploadError) throw uploadError;

            const fileUrl = supabase.storage.from('documents').getPublicUrl(filePath).data.publicUrl;
            
            return {
              name: file.name,
              path: filePath,
              type: getFileTypeFromName(file.name),
              size: file.size,
              url: fileUrl
            };
          } catch (err) {
            console.error('Error uploading file:', err);
            return null;
          }
        }));

        const validFiles = successfullyUploadedFiles.filter(Boolean);

        const { error: updateError } = await supabase
          .from('projects')
          .update({
            files: validFiles
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
          console.log('Proyecto actualizado con archivos:', validFiles);
        }
        
        setUploadingFiles(false);
      }

      setCreateProgress(95);
      console.log("Actualizando lista de proyectos");
      await fetchProjects();
      setCreateProgress(100);
      
      setFormData({
        title: '',
        description: '',
        assigned_to: 'unassigned',
        files: []
      });
      
      toast({
        title: "Éxito",
        description: "Proyecto creado correctamente",
        className: "bg-green-100 border-green-500 text-green-800",
      });
      
      setDialogOpen(false);
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el proyecto. Verifica los permisos de tu rol.",
        variant: "destructive",
      });
    } finally {
      console.log("Finalizando proceso...");
      setTimeout(() => {
        setIsCreatingProject(false);
        setCreateProgress(0);
        setFileProgress(0);
        console.log("Estado de creación reseteado");
      }, 500);
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
  console.log("Ver detalles del proyecto:", project);
  console.log("Archivos sin procesar:", project.files);

  // Los permisos básicos ya están funcionando bien para ver el proyecto
  const canViewDetails = 
    isProjectManager || 
    (isClient && project.created_by === user?.id) || 
    (isDesigner && project.assigned_to === user?.id);

  if (!canViewDetails) {
    toast({
      title: "Acceso Denegado",
      description: "No tienes permisos para ver los detalles de este proyecto.",
      variant: "destructive",
    });
    return;
  }

  // Procesar archivos sin restricciones adicionales
  const processedFiles = project.files?.map((file: any) => {
    console.log("Procesando archivo:", file);

    // Si el archivo ya es un objeto completo
    if (file && typeof file === 'object' && file.name && file.url) {
      return {
        name: file.name,
        path: file.path || '',
        type: getFileTypeFromName(file.name),
        size: file.size || 0,
        url: file.url
      };
    }

    // Si el archivo es un string que contiene JSON
    if (typeof file === 'string' && file.includes('{')) {
      try {
        const parsedFile = JSON.parse(file);
        return {
          name: parsedFile.name || 'Archivo',
          path: parsedFile.path || '',
          type: getFileTypeFromName(parsedFile.name),
          size: parsedFile.size || 0,
          url: parsedFile.url || null
        };
      } catch (e) {
        console.error('Error parsing file JSON:', e);
      }
    }

    // Si es un string simple
    if (typeof file === 'string') {
      const fileName = file.split('/').pop() || 'Archivo';
      return {
        name: fileName,
        path: file,
        type: getFileTypeFromName(fileName),
        size: 0,
        url: file
      };
    }

    // Si el archivo es un objeto pero necesita procesamiento
    return {
      name: file.name || 'Archivo sin nombre',
      path: file.path || '',
      type: getFileTypeFromName(file.name || ''),
      size: file.size || 0,
      url: file.url || (file.path ? supabase.storage.from('documents').getPublicUrl(file.path).data.publicUrl : null)
    };
  }).filter(Boolean) || [];

  console.log("Archivos procesados final:", processedFiles);

  setViewingProject({
    ...project,
    files: processedFiles
  });

  setViewDialogOpen(true);
};

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
      <div className="flex gap-1.5">
        {canView && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100/80 dark:hover:bg-blue-900/30 hover:border-blue-300 transition-colors shadow-sm"
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
            className="h-8 w-8 rounded-lg border border-primary/20 dark:border-primary/20 bg-primary/5 dark:bg-primary/5 text-primary dark:text-primary hover:bg-primary/15 dark:hover:bg-primary/10 hover:border-primary/30 transition-colors shadow-sm"
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
                className="h-8 w-8 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100/80 dark:hover:bg-red-900/30 hover:border-red-300 transition-colors shadow-sm"
                title="Eliminar proyecto"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] font-sans bg-card/95 backdrop-blur-xl border border-border text-foreground rounded-3xl shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Confirmar eliminación</DialogTitle>
                <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                  ¿Está seguro que desea eliminar este proyecto? Esta acción no se puede deshacer y borrará permanentemente todos sus archivos adjuntos.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-6 flex justify-end gap-3">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    disabled={isDeleting}
                    className="rounded-xl px-6 transition-colors"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button 
                  onClick={() => deleteProject(project.id)}
                  disabled={isDeleting}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-6 shadow-md transition-all rounded-xl"
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-inherit border-t-transparent"></div>
                      <span className="ml-2">Eliminando...</span>
                    </div>
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
      else if (file.type.includes('word') || file.type.includes('document')) fileType = 'word';
      else if (file.type.includes('html') || 
               file.type.includes('javascript') || 
               file.type.includes('css') || 
               file.type.includes('json')) fileType = 'code';
      else if (file.type.includes('text')) fileType = 'text';
      
      if (fileType === 'file') {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension) {
          if (extension === 'pdf') fileType = 'pdf';
          else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) fileType = 'image';
          else if (['doc', 'docx'].includes(extension)) fileType = 'word';
          else if (['html', 'css', 'js', 'jsx', 'ts', 'tsx'].includes(extension)) fileType = 'code';
          else if (['txt', 'md'].includes(extension)) fileType = 'text';
        }
      }
      
      return {
        name: file.name,
        path: '',
        type: fileType,
        size: file.size,
        file: file 
      };
    });
    
    console.log('Archivos seleccionados:', newFiles);
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
    
    e.target.value = '';
  };

  const handleEditFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;

      const newFiles = Array.from(e.target.files).map(file => {
        const fileName = file.name;
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        
      let fileType = 'file';
      if (file.type.includes('image')) fileType = 'image';
      else if (file.type.includes('pdf')) fileType = 'pdf';
      else if (file.type.includes('word') || file.type.includes('document')) fileType = 'word';
      else if (file.type.includes('html') || 
               file.type.includes('javascript') || 
               file.type.includes('css') || 
               file.type.includes('json')) fileType = 'code';
      else if (file.type.includes('text')) fileType = 'text';
        
        if (fileType === 'file') {
          if (extension === 'pdf') fileType = 'pdf';
          else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) fileType = 'image';
          else if (['doc', 'docx'].includes(extension)) fileType = 'word';
          else if (['html', 'css', 'js', 'jsx', 'ts', 'tsx'].includes(extension)) fileType = 'code';
          else if (['txt', 'md'].includes(extension)) fileType = 'text';
        }
      
      return {
          name: fileName,
        type: fileType,
        size: file.size,
          path: URL.createObjectURL(file),
          file: file
      };
    });
    
    setEditFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
    
    e.target.value = '';
      setNewEditFile('');
    } catch (error) {
      console.error('Error al seleccionar archivos:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al procesar los archivos seleccionados",
        variant: "destructive"
      });
    }
  };

const handleEditProject = async (project: Project) => {
  try {
    setEditingProject(project);
    setEditDialogOpen(true);
    
    console.log('⭐ Archivos originales del proyecto:', project.files);
    
    let processedFiles = [];
    
    if (project.files && Array.isArray(project.files)) {
      processedFiles = project.files.map((file: any) => {
      
        if (typeof file === 'string') {
          try {
            return JSON.parse(file);
          } catch (e) {
            console.error('Error parsing file:', e);
            return null;
          }
        }
        
        return {
          name: file.name,
          path: file.path,
          type: file.type || getFileTypeFromName(file.name),
          size: file.size,
          url: file.url
        };
      }).filter(Boolean); 
    }

    console.log('⭐ Archivos procesados:', processedFiles);

    setEditFormData({
      title: project.title,
      description: project.description || '',
      assigned_to: project.assigned_to || '',
      files: processedFiles
    });
  } catch (error) {
    console.error('Error al preparar la edición del proyecto:', error);
    toast({
      title: "Error",
      description: "Hubo un problema al cargar los datos del proyecto",
      variant: "destructive"
    });
  }
};
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
      
      const { data: currentProject, error: fetchError } = await supabase
        .from('projects')
        .select('files')
        .eq('id', pendingEditChanges.id)
        .single();
      
      if (fetchError) {
        console.error('Error al obtener archivos actuales:', fetchError);
        toast({
          title: "Error",
          description: "No se pudieron recuperar los archivos actuales del proyecto",
          variant: "destructive",
        });
        throw fetchError;
      }
      
      console.log('⭐ Archivos actuales del proyecto en la base de datos:', currentProject.files);
      
      const existingFiles = editFormData.files.filter(file => file.url);
      const newFiles = editFormData.files.filter(file => !file.url && file.file);
      
      console.log('⭐ Archivos existentes en el formulario:', existingFiles.length);
      console.log('⭐ Archivos nuevos a subir:', newFiles.length);
      
      const uploadedNewFiles: FileObject[] = [];
      
      setFileProgress(0);
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        
        try {
          if (file.file) {
            const progress = Math.round(((i + 1) / newFiles.length) * 100);
            setFileProgress(progress);
            
            const safeFileName = sanitizeFileName(file.name);
            const filePath = `projects/${pendingEditChanges.id}/${safeFileName}`;
            
            console.log('Intentando subir archivo nuevo a:', filePath);
            
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
              continue;
            }
            
            const fileUrl = supabase.storage.from('documents').getPublicUrl(filePath).data.publicUrl;
            
            console.log('Archivo nuevo subido exitosamente:', {
              name: file.name, 
              path: filePath,
              type: file.type || getFileTypeFromName(file.name),
              size: file.size || 0,
              url: fileUrl
            });
            
            uploadedNewFiles.push({
              name: file.name,
              path: filePath,
              type: file.type || getFileTypeFromName(file.name),
              size: file.size || 0,
              url: fileUrl
            });
          }
        } catch (err) {
          console.error('Error processing file:', err);
        }
      }
      
      const combinedFiles = [...existingFiles, ...uploadedNewFiles];
      
      console.log('⭐ Actualizando proyecto con archivos:', combinedFiles);
      console.log('⭐ - Archivos existentes mantenidos:', existingFiles.length);
      console.log('⭐ - Archivos nuevos subidos:', uploadedNewFiles.length);
      console.log('⭐ - Total archivos:', combinedFiles.length);

      const { error: updateError } = await supabase
        .from('projects')
        .update({
          title: pendingEditChanges.title,
          description: pendingEditChanges.description,
          assigned_to: pendingEditChanges.assigned_to === "unassigned" ? null : pendingEditChanges.assigned_to,
          files: combinedFiles
        })
        .eq('id', pendingEditChanges.id);

      if (updateError) {
        throw updateError;
      }
      
      await fetchProjects();
      
      if (viewingProject && viewingProject.id === pendingEditChanges.id) {
        console.log('⭐ Actualizando vista de detalles con la información más reciente');
        
        const { data: updatedProjectData, error: getError } = await supabase
          .from('projects')
          .select(`
            *,
            creator:users!created_by(email, role),
            assignee:users!assigned_to(email, role)
          `)
          .eq('id', pendingEditChanges.id)
          .single();
        
        if (getError) {
          console.error('Error al obtener proyecto actualizado:', getError);
        } else if (updatedProjectData) {
          console.log('⭐ Proyecto actualizado para vista detalle:', updatedProjectData);
          
          let processedFiles: FileObject[] = [];
          
          if (updatedProjectData.files && Array.isArray(updatedProjectData.files)) {
            processedFiles = updatedProjectData.files.map((file: any) => {
              try {
         
                if (typeof file === 'string') {
                  const fileName = String(file).trim();
                  const fileType = getFileTypeFromName(fileName);
                  return {
                    name: fileName,
                    path: file,
                    type: fileType,
                    size: 0,
                    url: file
                  };
                }
                
                if (!file || typeof file !== 'object') {
                  return {
                    name: 'Archivo desconocido',
                    path: '',
                    type: 'file',
                    size: 0
                  };
                }
                
                let fileName = '';
                if (file.name) {
                  fileName = file.name;
                } else if (file.path) {
                  const pathParts = file.path.split('/');
                  fileName = pathParts[pathParts.length - 1];
                } else if (file.originalName) {
                  fileName = file.originalName;
                } else {
                  fileName = 'Archivo';
                }
                
                const fileType = file.type || getFileTypeFromName(fileName);
                
                return {
                  name: fileName,
                  path: file.path || '',
                  type: fileType,
                  size: file.size || 0,
                  url: file.path ? supabase.storage.from('documents').getPublicUrl(file.path).data.publicUrl : file.url
                };
              } catch (error) {
                console.error('Error procesando archivo:', error, file);
                return null;
              }
            }).filter(Boolean) as FileObject[];
          }
          
          const updatedProject = {
            ...updatedProjectData,
            created_by_email: updatedProjectData.creator?.email,
            created_by_role: updatedProjectData.creator?.role,
            assigned_to_email: updatedProjectData.assignee?.email,
            assigned_to_role: updatedProjectData.assignee?.role,
            files: processedFiles
          };
          
          setViewingProject(updatedProject);
          console.log('⭐ Vista detalle actualizada con nuevos archivos:', updatedProject.files);
        }
      }
      
      toast({
        title: "Éxito",
        description: "Proyecto actualizado correctamente",
        className: "bg-green-100 border-green-500 text-green-800",
      });
      
      setPendingEditChanges(null);
      setEditDialogOpen(false);
      setConfirmDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el proyecto. Verifica los permisos de tu rol.",
        variant: "destructive",
      });
    } finally {
      setIsEditingProject(false);
      setFileProgress(0);
    }
  };

  const onOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setPendingEditChanges(null);
    }
  };

  const renderFileCards = (files: FileObject[]) => {
  console.log("Renderizando tarjetas de archivos:", files);
  
  if (!files || files.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No hay archivos adjuntos
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {files.map((file, index) => {
        const fileType = getFileTypeFromName(file.name);
        const fileName = getFileNameWithoutExtension(file.name);
        
        return (
          <Card key={index} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-all group">
            <CardContent className="p-5 flex flex-col items-center justify-center">
              <div className="mb-4 bg-muted p-4 rounded-2xl group-hover:bg-primary/10 transition-colors">
                {getFileIcon(fileType)}
              </div>
              <div className="text-center">
                <h3 className="text-sm font-bold mb-1 text-foreground line-clamp-1" title={fileName}>
                  {fileName}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </CardContent>
            <CardFooter className="p-3 bg-muted/40 border-t border-border flex justify-center gap-2">
              {file.url && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground hover:scale-105"
                    onClick={() => window.open(file.url, '_blank')}
                    title="Ver archivo"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors text-muted-foreground hover:scale-105"
                    onClick={() => downloadFile(file.url!, file.name)}
                    title="Descargar archivo"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

function getFileIcon(type: string) {
  const fileType = type?.toLowerCase() || 'file';
  
  switch (fileType) {
    case 'pdf':
      return <FileText className="h-7 w-7 text-red-500" />;
    case 'image':
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return <FileImage className="h-7 w-7 text-purple-500" />;
    case 'video':
    case 'mp4':
    case 'mov':
    case 'avi':
    case 'mkv':
    case 'webm':
      return <FileVideo className="h-7 w-7 text-blue-500" />;
    case 'word':
    case 'doc':
    case 'docx':
      return <FileText className="h-7 w-7 text-blue-500" />;
    case 'code':
    case 'html':
    case 'css':
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <FileCode className="h-7 w-7 text-emerald-500" />;
    case 'text':
    case 'txt':
    case 'md':
      return <FileText className="h-7 w-7 text-zinc-500" />;
    default:
      return <File className="h-8 w-8 text-gray-400" />;
  }
} 



  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadFile = async (url: string, fileName: string) => {
    try {
      if (!url) {
        toast({
          title: "Error",
          description: "No se puede descargar el archivo: URL no disponible",
          variant: "destructive",
        });
        return;
      }
      
      if (typeof url === 'string' && url.startsWith('{') && url.includes('"url":')) {
        try {
          const fileObject = JSON.parse(url);
          url = fileObject.url || url;
          console.log("URL extraída de JSON:", url);
        } catch (e) {
          console.error('Error parsing JSON URL:', e);
       
        }
      }
      
      console.log("Intentando descargar archivo desde:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 100);
      
      toast({
        title: "Éxito",
        description: "Archivo descargado correctamente",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "No se pudo descargar el archivo: " + (error instanceof Error ? error.message : "Error desconocido"),
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

  const getFileTypeFromName = (filename: string) => {
    if (!filename) return 'file';
    
    const filenameStr = String(filename);
    const cleanName = filenameStr.toLowerCase().trim();
    const parts = cleanName.split('.');
    const extension = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
    
    if (['pdf'].includes(extension)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) return 'image';
    if (['doc', 'docx'].includes(extension)) return 'word';
    if (['html', 'css', 'js', 'jsx', 'ts', 'tsx'].includes(extension)) return 'code';
    if (['txt', 'md'].includes(extension)) return 'text';
    return 'file';
  }

  const getFileNameWithoutExtension = (filename: string) => {
    if (!filename) return 'Archivo';
    
    const filenameStr = String(filename);
    const nameWithoutPath = filenameStr.split('/').pop() || filenameStr;
    let formattedName = nameWithoutPath.replace(/_/g, ' ');
    formattedName = formattedName.replace(/\}+$/g, '');
    formattedName = formattedName.replace(/['"]+/g, '');
    
    return formattedName;
  }

  const getFileExtension = (filename: string) => {
    if (!filename) return '';
    
    const filenameStr = String(filename);
    const parts = filenameStr.split('.');
    if (parts.length <= 1) return '';
    
    return parts[parts.length - 1].toLowerCase();
  }

  const getStatusText = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En Progreso';
      case 'completed':
        return 'Completado';
      default:
        return 'Desconocido';
    }
  };

  const renderProjectCards = () => {
    if (filteredProjects.length === 0) {
      return (
        <div className="text-center py-20 text-muted-foreground">
          <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground opacity-25 mb-4" />
          <h3 className="text-xl font-medium mb-2">No se encontraron proyectos</h3>
          <p className="text-muted-foreground">No hay proyectos que coincidan con los criterios de búsqueda.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="project-card overflow-hidden group bg-white dark:bg-gray-900">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs font-medium uppercase mb-1">
                    {project.created_by_email}
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                    {project.title}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(project.status)}
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {project.description}
              </div>
            </div>
            
            <div className="bg-muted/30 dark:bg-muted/10 px-6 py-3 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => viewProjectDetails(project)}
                className="rounded-full text-grayola-teal hover:text-grayola-teal hover:bg-grayola-teal/10"
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver
              </Button>
              
              {isProjectManager && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditProject(project)}
                  className="rounded-full text-grayola-teal hover:text-grayola-teal hover:bg-grayola-teal/10"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background font-sans transition-colors duration-300">
        <div className="relative">
          <div className="absolute inset-0 bg-primary blur-xl opacity-20 rounded-full animate-pulse" />
          <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" />
        </div>
        <p className="mt-6 text-muted-foreground font-medium tracking-wide">Iniciando entorno de proyectos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background font-sans text-foreground pb-20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header Premium SaaS */}
        <div className="page-header-card">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center z-10">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2 flex items-center gap-3 transition-colors">
                <Briefcase className="h-8 w-8 text-primary" />
                Panel de Proyectos
              </h1>
              
              <div className="flex items-center gap-3 mt-3">
                <Badge className="bg-muted text-muted-foreground hover:bg-muted/80 border-none px-3 py-1 transition-colors">
                  {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'} totales
                </Badge>
                <span className="inline-flex items-center gap-1.5 bg-[#ccff00] text-black py-1 px-3 rounded-full text-xs font-bold shadow-sm transition-colors border border-black dark:border-transparent">
                  <ShieldCheck className="h-3 w-3" />
                  {isProjectManager ? "Gerente de Proyecto" : isClient ? "Cliente VIP" : "Diseñador"}
                </span>
              </div>
            </div>

            {canCreate && (
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-6 text-sm font-bold rounded-2xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Nuevo Proyecto
              </Button>
            )}
          </div>
        </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto font-sans bg-card/95 backdrop-blur-xl border border-border text-foreground rounded-3xl shadow-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                  <Briefcase className="h-5 w-5 text-green-600 dark:text-[#ccff00]" />
                  Crear nuevo proyecto
                </DialogTitle>
                <DialogDescription className="text-zinc-500 dark:text-zinc-400">
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
                      <div className="space-y-2">
                        {formData.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 text-sm shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="bg-muted p-2 rounded-lg">
                                {getFileIcon(file.type)}
                              </div>
                              <span className="font-medium">{file.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
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

              <DialogFooter className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={isCreatingProject}
                  className="rounded-xl px-6 transition-colors"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={createProject}
                  disabled={isCreatingProject}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-md transition-all hover:-translate-y-0.5"
                >
                  {isCreatingProject ? (
                    <div className="flex items-center justify-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      <span className="ml-2">Creando...</span>
                    </div>
                  ) : (
                    'Crear proyecto'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <Button 
                variant="outline" 
                className="bg-card border border-border hover:bg-muted text-foreground h-12 px-4 rounded-xl shadow-sm transition-all"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 text-primary" />
                <span className="ml-2 font-medium">Filtros</span>
                {(statusFilter || creatorFilter || designerFilter) && (
                  <Badge variant="secondary" className="ml-2 px-1.5 py-0 min-w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground">
                    {[statusFilter, creatorFilter, designerFilter].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar proyectos por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 h-12 w-full bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary rounded-xl transition-all shadow-inner"
                />
              </div>
            </div>

            <TabsList className="bg-muted p-1.5 rounded-xl border border-border shadow-inner h-12 hidden md:flex">
              <TabsTrigger value="grid" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground transition-all font-medium h-full">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span className="hidden sm:inline">Tarjetas</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground transition-all font-medium h-full">
                <div className="flex items-center gap-2">
                  <ListFilter className="h-4 w-4" />
                  <span className="hidden sm:inline">Lista</span>
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

        <TabsContent value="grid" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="group relative bg-card/60 backdrop-blur-sm border-none rounded-[1.5rem] shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full card-gradient-border"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>
                  
                  <div className="p-6 flex-grow flex flex-col relative z-10">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="bg-muted p-3 rounded-2xl backdrop-blur-md border border-border shadow-inner">
                        <FolderOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div className="transform transition-transform duration-300 group-hover:scale-105">
                        {getStatusBadge(project.status)}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 leading-tight transition-colors">{project.title}</h3>
                    
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed flex-grow">
                      {project.description || "Sin descripción proporcionada para este proyecto."}
                    </p>

                    <div className="space-y-3 mt-auto pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium tracking-wide uppercase text-[10px]">Responsable</span>
                        <div className="flex items-center gap-1.5 text-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border">
                          <User className="h-3 w-3 text-primary" />
                          <span className="truncate max-w-[120px] font-medium">{project.assigned_to_email ? project.assigned_to_email.split('@')[0] : 'Sin asignar'}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium tracking-wide uppercase text-[10px]">Creado por</span>
                        <span className="text-muted-foreground truncate max-w-[140px] font-medium">{project.created_by_email ? project.created_by_email.split('@')[0] : 'Anónimo'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between mt-auto z-20 relative">
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      <Paperclip className="h-3.5 w-3.5" />
                      <span>{project.files?.length || 0} adjuntos</span>
                    </div>
                    
                    <div className="flex gap-1.5">
                      {renderActionButtons(project)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-24 text-center bg-muted/30 rounded-3xl border border-border backdrop-blur-sm">
                <div className="bg-muted p-6 rounded-full mb-6 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-50"></div>
                  <Briefcase className="h-10 w-10 text-muted-foreground relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No se encontraron proyectos</h3>
                <p className="text-muted-foreground max-w-md">
                  {searchTerm || statusFilter || creatorFilter || designerFilter 
                    ? "Al parecer ningún proyecto coincide con los filtros aplicados." 
                    : "Aún no hay proyectos en el sistema. Crea tu primer proyecto para comenzar a colaborar."}
                </p>
                {canCreate && !searchTerm && !statusFilter && !creatorFilter && !designerFilter && (
                  <Button 
                    className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(204,255,0,0.15)] transition-all hover:-translate-y-1 hover:shadow-lg"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Crear nuevo proyecto
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <div className="overflow-hidden rounded-3xl border border-border/50 dark:border-border bg-card/60 backdrop-blur-sm shadow-sm transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/60 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-5">Proyecto</th>
                    <th className="px-6 py-5 text-center">Estado</th>
                    <th className="px-6 py-5 hidden md:table-cell text-center">Creador</th>
                    <th className="px-6 py-5 hidden md:table-cell text-center">Asignado a</th>
                    <th className="px-6 py-5 hidden lg:table-cell text-center">Archivos</th>
                    <th className="px-6 py-5 hidden lg:table-cell text-center">Apertura</th>
                    <th className="px-6 py-5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-muted/50 transition-colors group">
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-bold text-foreground transition-colors">{project.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{project.description || "Sin descripción"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex justify-center">{getStatusBadge(project.status)}</div>
                        </td>
                        <td className="px-6 py-5 hidden md:table-cell text-center">
                          <span className="bg-muted text-foreground px-2.5 py-1 rounded-md text-xs font-medium border border-border">
                            {project.created_by_email ? project.created_by_email.split('@')[0] : 'S/A'}
                          </span>
                        </td>
                        <td className="px-6 py-5 hidden md:table-cell text-center">
                          <span className="bg-muted text-foreground px-2.5 py-1 rounded-md text-xs font-medium border border-border">
                            {project.assigned_to_email ? project.assigned_to_email.split('@')[0] : 'S/A'}
                          </span>
                        </td>
                        <td className="px-6 py-5 hidden lg:table-cell text-center">
                          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                            {project.files?.length || 0} adjuntos
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden lg:table-cell text-muted-foreground text-xs text-center font-medium">
                          {formatDate(project.created_at || project.updated_at)}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-1.5 z-20 relative">
                            {renderActionButtons(project)}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="bg-muted p-6 rounded-full mb-6 relative">
                            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-50"></div>
                            <Briefcase className="h-10 w-10 text-muted-foreground relative z-10" />
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">No se encontraron proyectos</h3>
                          <p className="text-muted-foreground max-w-sm">
                            {searchTerm || statusFilter || creatorFilter || designerFilter 
                              ? "Cero coincidencias con tus filtros actuales." 
                              : "Tu lista está vacía actualmente. Comienza agregando uno nuevo."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto font-sans bg-card/95 backdrop-blur-xl border border-border text-foreground rounded-3xl shadow-2xl">
          {viewingProject && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                  <Briefcase className="h-6 w-6 text-green-600 dark:text-[#ccff00]" />
                  {viewingProject.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(viewingProject.status)}
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    Última actualización: {formatDate(viewingProject.updated_at)}
                  </span>
                </div>
              </DialogHeader>
              
              <div className="py-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold mb-2 text-foreground">Descripción</h3>
                    <p className="text-sm text-muted-foreground bg-muted p-4 rounded-2xl shadow-sm border border-border">
                      {viewingProject.description || "Sin descripción"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-2xl shadow-sm border border-border">
                      <h3 className="font-bold mb-3 text-foreground">Creado por</h3>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-border">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{viewingProject.created_by_email || 'No asignado'}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest">{viewingProject.created_by_role || 'Usuario'}</p>
                        </div>
                      </div>
                    </div>
              
                    <div className="bg-muted p-4 rounded-2xl shadow-sm border border-border">
                      <h3 className="font-bold mb-3 text-foreground">Asignado a</h3>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-border">
                          <User className="h-5 w-5 text-primary" />
                          </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{viewingProject.assigned_to_email || 'No asignado'}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest">{viewingProject.assigned_to_role || 'Diseñador'}</p>
                        </div>
                    </div>
                  </div>
              </div>
              
                  <div>
                    <h3 className="font-bold mb-3 text-foreground">Archivos del proyecto</h3>
                    {viewingProject.files && viewingProject.files.length > 0 ? (
                      renderFileCards(viewingProject.files)
                    ) : (
                      <div className="text-center py-6 text-muted-foreground bg-muted p-4 rounded-2xl shadow-sm border border-border">
                        No hay archivos adjuntos
                      </div>
                    )}
                </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px] font-sans bg-card/95 backdrop-blur-xl border border-border text-foreground rounded-3xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirmar actualización</DialogTitle>
            <DialogDescription className="text-zinc-500 dark:text-zinc-400">
              ¿Está seguro que desea actualizar los datos de este proyecto?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isEditingProject}
              className="rounded-xl px-6 transition-colors"
            >
              Cancelar
            </Button>
            <Button 
              onClick={updateProject}
              disabled={isEditingProject}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto font-sans bg-card/95 backdrop-blur-xl border border-border text-foreground rounded-3xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Edit className="h-5 w-5 text-green-600 dark:text-[#ccff00]" />
              Editar proyecto
              </DialogTitle>
              <DialogDescription className="text-zinc-500 dark:text-zinc-400">
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

            <div className="space-y-4">
  <div>
    <Label htmlFor="edit-files">Archivos</Label>
    <div className="mt-2">
      <FileInput
        onChange={handleEditFileSelect}
        disabled={isEditingProject}
        multiple
      />
      {editFormData.files.length > 0 && (
        <div className="mt-2 space-y-2">
          <p className="text-sm font-medium">Archivos seleccionados:</p>
          <div className="space-y-2">
            {editFormData.files.map((file, index) => {
              // Procesar el archivo si viene como string JSON
              let fileData = file;
              if (typeof file === 'string') {
                try {
                  fileData = JSON.parse(file);
                } catch (e) {
                  console.error('Error parsing file:', e);
                }
              }

              const fileName = fileData.name || 'Archivo';
              const fileType = fileData.type || getFileTypeFromName(fileName);

              return (
                <div key={index} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 text-sm shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded-lg">
                      {getFileIcon(fileType)}
                    </div>
                    <span className="font-medium">{fileName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                    onClick={() => handleRemoveEditFile(index)}
                    disabled={isEditingProject}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  </div>
</div>
            </div>

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isEditingProject}
              className="rounded-xl px-6 transition-colors"
            >
              Cancelar
            </Button>
            <Button 
              onClick={initiateProjectUpdate}
              disabled={isEditingProject || editTitleStatus?.isError === true}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all"
            >
              {isEditingProject ? (
                <div className="flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  <span className="ml-2">Actualizando...</span>
                </div>
              ) : (
                'Actualizar proyecto'
              )}
            </Button>
          </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}