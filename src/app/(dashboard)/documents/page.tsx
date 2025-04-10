'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  FileText,
  FileImage,
  FileCode,
  Clock,
  Calendar,
  Download,
  Eye,
  Filter,
  ChevronDown,
  X,
  File,
  Folder
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'

interface FileObject {
  name: string
  path: string
  type: string
  size: number
  url?: string
  file?: File | Blob
  projectId?: string
  projectTitle?: string
}

interface Project {
  id: string
  title: string
  files: FileObject[]
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [documents, setDocuments] = useState<FileObject[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Cargar documentos de todos los proyectos
  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      // Obtener todos los proyectos con sus archivos
      const { data: projects, error } = await supabase
        .from('projects')
        .select('id, title, files')
      
      if (error) {
        throw error
      }

      console.log("Proyectos obtenidos:", projects);

      // Extraer todos los archivos de los proyectos
      const allFiles: FileObject[] = []
      
      projects.forEach((project: Project) => {
        if (project.files && Array.isArray(project.files) && project.files.length > 0) {
          console.log(`Proyecto: ${project.title}, Archivos:`, project.files);
          
          // Procesar cada archivo del proyecto
          project.files.forEach((file: any) => {
            // Comprobar si el archivo es un string (solo el nombre) o un objeto
            if (typeof file === 'string') {
              // Si es solo un string, crear un objeto completo
              const fileName = file;
              const fileType = getFileTypeFromName(fileName);
              allFiles.push({
                name: fileName,
                path: '',
                type: fileType,
                size: 0,
                projectId: project.id,
                projectTitle: project.title
              });
            } else {
              // Si ya es un objeto, asegurarse de que tenga todos los campos
              const fileObj = {
                name: file.name || 'Archivo',
                path: file.path || '',
                type: file.type || getFileTypeFromName(file.name || ''),
                size: file.size || 0,
                url: file.url || '',
                projectId: project.id,
                projectTitle: project.title
              };
              
              console.log(`Procesando archivo: ${fileObj.name}, Tipo: ${fileObj.type}`);
              allFiles.push(fileObj);
            }
          });
        }
      })
      
      console.log('Total de documentos procesados:', allFiles.length);
      setDocuments(allFiles)
    } catch (error) {
      console.error('Error al cargar documentos:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los documentos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getFileTypeFromName = (filename: string) => {
    if (!filename) return 'file';
    
    console.log("Detectando tipo para:", filename);
    
    // Asegurarse de que filename es un string
    const filenameStr = String(filename);
    
    // Convertir a minúsculas y quitar espacios
    const cleanName = filenameStr.toLowerCase().trim();
    
    // Conseguir la extensión
    const parts = cleanName.split('.');
    const extension = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
    
    console.log("Extensión detectada:", extension);
    
    // Mapeo de extensiones a tipos
    if (['pdf'].includes(extension)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif'].includes(extension)) return 'image';
    if (['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'json', 'xml', 'py', 'java', 'c', 'cpp', 'cs', 'php', 'rb'].includes(extension)) return 'code';
    if (['txt', 'md', 'doc', 'docx', 'rtf', 'odt', 'xls', 'xlsx', 'csv', 'ppt', 'pptx'].includes(extension)) return 'text';
    
    return 'file';
  }

  const getFileNameWithoutExtension = (filename: string) => {
    if (!filename) return 'Archivo';
    
    // Asegurarse de que filename es un string
    const filenameStr = String(filename);
    
    // Eliminar cualquier parte de la ruta (para casos como "path/to/file.txt")
    const nameWithoutPath = filenameStr.split('/').pop() || filenameStr;
    
    // Si no tiene punto, mostrar el nombre completo
    if (!nameWithoutPath.includes('.')) return nameWithoutPath;
    
    // Extraer el nombre sin la extensión
    const parts = nameWithoutPath.split('.');
    if (parts.length <= 1) return nameWithoutPath;
    
    // Si tiene múltiples puntos, quitar solo la última extensión
    parts.pop();
    return parts.join('.');
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return (
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-400/20 to-red-300/10 shadow-sm border border-red-100 dark:border-red-900/20">
            <FileText className="h-8 w-8 text-red-500 drop-shadow-sm" />
          </div>
        );
      case 'image':
        return (
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-400/20 to-purple-300/10 shadow-sm border border-purple-100 dark:border-purple-900/20">
            <FileImage className="h-8 w-8 text-purple-500 drop-shadow-sm" />
          </div>
        );
      case 'code':
        return (
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-300/10 shadow-sm border border-blue-100 dark:border-blue-900/20">
            <FileCode className="h-8 w-8 text-blue-500 drop-shadow-sm" />
          </div>
        );
      case 'text':
        return (
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-300/10 shadow-sm border border-emerald-100 dark:border-emerald-900/20">
            <FileText className="h-8 w-8 text-emerald-500 drop-shadow-sm" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-300/10 to-indigo-200/10 shadow-md border border-blue-100 dark:border-blue-900/30">
            <File className="h-8 w-8 text-blue-400 drop-shadow-md" />
          </div>
        );
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

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
      
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: "Éxito",
        description: "Archivo descargado correctamente",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "No se pudo descargar el archivo",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setCategoryFilter(null)
    setTypeFilter(null)
  }

  const filteredDocuments = documents.filter(doc => {
    // Filtro de búsqueda
    const matchesSearch = !searchTerm.trim() || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de tipo
    const matchesType = 
      !typeFilter || doc.type === typeFilter;
    
    // Filtro de proyecto (categoría)
    const matchesCategory = 
      !categoryFilter || doc.projectId === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  // Obtener lista de proyectos únicos para el filtro
  const projects = [...new Set(documents.map(doc => ({
    id: doc.projectId || '',
    title: doc.projectTitle || 'Sin proyecto'
  })))].filter(project => project.id !== '');

  // Render cuando está cargando
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Cargando documentos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-900">Documentos</h1>
          <p className="text-gray-700 dark:text-gray-900">Accede y gestiona todos los documentos de tus proyectos</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-black" />
            <Input 
              type="text" 
              placeholder="Buscar documentos..." 
              className="pl-9 pr-4 text-gray-900 dark:text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="w-10 h-10 p-0 flex items-center justify-center text-blue-600 dark:text-blue-500 border-blue-200 dark:border-blue-800"
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">Tipo de documento</label>
              <select 
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                value={typeFilter || ''}
                onChange={(e) => setTypeFilter(e.target.value || null)}
              >
                <option value="">Todos los tipos</option>
                <option value="pdf">PDF</option>
                <option value="image">Imagen</option>
                <option value="code">Código</option>
                <option value="text">Texto</option>
                <option value="file">Otros</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">Proyecto</label>
              <select 
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                value={categoryFilter || ''}
                onChange={(e) => setCategoryFilter(e.target.value || null)}
              >
                <option value="">Todos los proyectos</option>
                {projects.map((project, index) => (
                  <option key={index} value={project.id}>{project.title}</option>
                ))}
              </select>
            </div>
            <Button variant="ghost" onClick={clearFilters} className="h-10">
              <X className="mr-2 h-4 w-4" />
              Limpiar filtros
            </Button>
          </div>
        </div>
      )}
      
      {filteredDocuments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc, index) => {
            // Determinar tipo si no está definido
            const fileType = doc.type || getFileTypeFromName(doc.name);
            // Obtener nombre sin extensión
            const displayName = getFileNameWithoutExtension(doc.name);
            
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950 hover:border-primary/20">
                <CardHeader className="pt-6 pb-4">
                  <div className="flex items-center gap-4">
                    {getDocumentIcon(fileType)}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-base font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {displayName || 'Archivo sin nombre'}
                        </CardTitle>
                        <Badge variant="outline" className={`shrink-0 text-xs ${
                          fileType === 'pdf' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400' :
                          fileType === 'image' ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400' :
                          fileType === 'code' ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' :
                          fileType === 'text' ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400'
                        }`}>
                          {fileType.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                        <Folder className="h-3 w-3 mr-1" /> 
                        {doc.projectTitle || 'Sin proyecto'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="pt-2 flex justify-center gap-2 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
                  {doc.url ? (
                    <>
                      <Button variant="outline" size="sm" className="w-24 bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => window.open(doc.url, '_blank')}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" className="w-24 bg-white dark:bg-gray-900 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-100 hover:border-blue-200" onClick={() => downloadFile(doc.url!, doc.name)}>
                        <Download className="mr-1 h-4 w-4" />
                        <span className="ml-0">Descargar</span>
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" className="w-24 bg-white dark:bg-gray-900 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-100 hover:border-blue-200" onClick={() => 
                      toast({
                        title: "Información",
                        description: "Este archivo no tiene una URL de descarga. Por favor, contacte al administrador.",
                      })
                    }>
                      <Download className="mr-1 h-4 w-4" />
                      <span className="ml-0">Descargar</span>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <File className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-1">No se encontraron documentos</h3>
          <p className="text-muted-foreground">Intenta con otro término de búsqueda o crea un proyecto con archivos</p>
        </div>
      )}
    </div>
  )
} 
