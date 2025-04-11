'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  FileImage,
  Download,
  Eye,
  Filter,

  X,
  File,
  Folder,
  File as FilePdf
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

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


  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)

      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { data: userRole } = await supabase
        .from('users')
        .select('role')
        .eq('id', userData.user.id)
        .single()

      if (!userRole) throw new Error('No se pudo obtener el rol del usuario')

      let query = supabase
        .from('projects')
        .select(`
          id,
          title,
          files,
          created_by,
          assigned_to
        `)

      if (userRole.role === 'client') {
        query = query.eq('created_by', userData.user.id)
      } else if (userRole.role === 'designer') {
        query = query.eq('assigned_to', userData.user.id)
      }

      const { data: projects, error } = await query
      
      if (error) {
        throw error
      }

      console.log("Proyectos obtenidos:", projects)

      const allFiles: FileObject[] = []
      
      projects?.forEach((project: any) => {
        if (project.files && Array.isArray(project.files)) {
          project.files.forEach((file: any) => {
            if (typeof file === 'string') {
              const cleanFileName = String(file).replace(/[\{\}\"\'\`]+/g, '').trim()
              allFiles.push({
                name: cleanFileName,
                path: '',
                type: getFileTypeFromName(cleanFileName),
                size: 0,
                projectId: project.id,
                projectTitle: project.title
              })
            } else {
              const cleanFileName = String(file.name || 'Archivo').replace(/[\{\}\"\'\`]+/g, '').trim()
              allFiles.push({
                name: cleanFileName,
                path: file.path || '',
                type: file.type || getFileTypeFromName(cleanFileName),
                size: file.size || 0,
                url: file.path ? supabase.storage.from('documents').getPublicUrl(file.path).data.publicUrl : undefined,
                projectId: project.id,
                projectTitle: project.title
              })
            }
          })
        }
      })
      
      console.log('Total de documentos procesados:', allFiles.length)
      setDocuments(allFiles)

    } catch (error) {
      console.error('Error al cargar documentos:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los documentos. Por favor, intente nuevamente.",
        variant: "destructive",
      })
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const getFileTypeFromName = (filename: string) => {
    if (!filename) return 'file';
    
    const filenameStr = String(filename);
    
    const cleanName = filenameStr.toLowerCase().trim();
    
    const parts = cleanName.split('.');
    const extension = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
    
    
    if (['pdf'].includes(extension)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif', 'svg', 'ico'].includes(extension)) return 'image';
    if (['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'json', 'xml', 'py', 'java', 'c', 'cpp', 'cs', 'php', 'rb', 'go', 'swift', 'kotlin'].includes(extension)) return 'code';
    if (['txt', 'md', 'doc', 'docx', 'rtf', 'odt', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'pages', 'numbers', 'key', 'odf', 'ods', 'odp'].includes(extension)) return 'text';
    
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

  const getDocumentIcon = (type: string, extension: string) => {

    if (extension === 'pdf') {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-red-50 to-red-100 dark:from-red-200/40 dark:to-red-300/30 border border-red-200 dark:border-red-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
          <div className="absolute flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 rounded-sm shadow-sm">
            <div className="absolute inset-0 bg-red-500 dark:bg-red-300 opacity-10 rounded-sm"></div>
            <span className="text-lg font-bold text-red-600 dark:text-red-300">PDF</span>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 dark:bg-red-300 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
      );
    } 
 
    else if (['jpg', 'jpeg'].includes(extension)) {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-200/40 dark:to-purple-300/30 border border-purple-200 dark:border-purple-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
          <div className="absolute inset-0 m-3 rounded-md overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 dark:from-purple-300 dark:to-pink-300 opacity-30"></div>
            <FileImage className="absolute inset-0 m-auto h-8 w-8 text-purple-600 dark:text-purple-300" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 dark:bg-purple-300 rounded-full border-2 border-white dark:border-gray-800"></div>
          <div className="absolute bottom-1 right-1 text-xs font-medium text-purple-700 dark:text-purple-300">JPG</div>
        </div>
      );
    }
    else if (['png'].includes(extension)) {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-200/40 dark:to-indigo-300/30 border border-indigo-200 dark:border-indigo-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
          <div className="absolute inset-0 m-3 rounded-md overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-blue-500 dark:from-indigo-300 dark:to-blue-300 opacity-30"></div>
            <FileImage className="absolute inset-0 m-auto h-8 w-8 text-indigo-600 dark:text-indigo-300" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 dark:bg-indigo-300 rounded-full border-2 border-white dark:border-gray-800"></div>
          <div className="absolute bottom-1 right-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">PNG</div>
        </div>
      );
    }
    else if (['svg'].includes(extension)) {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-200/40 dark:to-cyan-300/30 border border-cyan-200 dark:border-cyan-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
          <div className="absolute inset-0 m-3 rounded-md overflow-hidden flex items-center justify-center">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 border-2 border-cyan-500 dark:border-cyan-300 rounded-full"></div>
              <div className="absolute inset-2 border-2 border-cyan-400 dark:border-cyan-200 rotate-45"></div>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 dark:bg-cyan-300 rounded-full border-2 border-white dark:border-gray-800"></div>
          <div className="absolute bottom-1 right-1 text-xs font-medium text-cyan-700 dark:text-cyan-300">SVG</div>
        </div>
      );
    }
    else if (['gif'].includes(extension)) {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-200/40 dark:to-pink-300/30 border border-pink-200 dark:border-pink-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
          <div className="absolute inset-0 m-3 rounded-md overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-pink-400 to-rose-500 dark:from-pink-300 dark:to-rose-300 opacity-30"></div>
            <FileImage className="absolute inset-0 m-auto h-8 w-8 text-pink-600 dark:text-pink-300" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 dark:bg-pink-300 rounded-full border-2 border-white dark:border-gray-800"></div>
          <div className="absolute bottom-1 right-1 text-xs font-medium text-pink-700 dark:text-pink-300">GIF</div>
        </div>
      );
    }
    // Código
    else if (['html'].includes(extension)) {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-200/40 dark:to-orange-300/30 border border-orange-200 dark:border-orange-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
          <div className="absolute flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 rounded-sm shadow-sm">
            <div className="absolute inset-0 bg-orange-500 dark:bg-orange-300 opacity-10 rounded-sm"></div>
            <span className="text-sm font-bold text-orange-600 dark:text-orange-300">&lt;/&gt;</span>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 dark:bg-orange-300 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
      );
    }
    else if (['js', 'jsx'].includes(extension)) {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-200/40 dark:to-yellow-300/30 border border-yellow-200 dark:border-yellow-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
          <div className="absolute flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-yellow-300 dark:border-yellow-300/70">
            <span className="text-lg font-bold text-yellow-600 dark:text-yellow-300">JS</span>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 dark:bg-yellow-300 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
      );
    }
    else if (['ts', 'tsx'].includes(extension)) {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-200/40 dark:to-blue-300/30 border border-blue-200 dark:border-blue-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
          <div className="absolute flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-blue-300 dark:border-blue-300/70">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-300">TS</span>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 dark:bg-blue-300 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
      );
    }
    else if (['css'].includes(extension)) {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-sky-50 to-sky-100 dark:from-sky-200/40 dark:to-sky-300/30 border border-sky-200 dark:border-sky-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
          <div className="absolute flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-sky-300 dark:border-sky-300/70">
            <span className="text-lg font-bold text-sky-600 dark:text-sky-300">CSS</span>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 dark:bg-sky-300 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
      );
    }
    else if (['json'].includes(extension)) {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-200/40 dark:to-amber-300/30 border border-amber-200 dark:border-amber-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
          <div className="absolute flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 rounded-sm shadow-sm">
            <div className="absolute inset-0 bg-amber-500 dark:bg-amber-300 opacity-10 rounded-sm"></div>
            <div className="text-xs font-mono text-amber-700 dark:text-amber-300">{`{...}`}</div>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 dark:bg-amber-300 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
      );
    }
    else if (['py'].includes(extension)) {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-200/40 dark:to-indigo-300/30 border border-blue-200 dark:border-blue-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
          <div className="absolute inset-0 m-3 rounded-md overflow-hidden flex items-center justify-center">
            <div className="text-2xl font-bold flex items-center justify-center text-blue-700 dark:text-blue-300">
              <span className="text-yellow-500 dark:text-yellow-300">Py</span>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 dark:bg-blue-300 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
      );
    }

    else if (['doc', 'docx'].includes(extension)) {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-200/40 dark:to-blue-300/30 border border-blue-200 dark:border-blue-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
          <div className="absolute inset-0 m-4 rounded-sm bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-300/70 overflow-hidden flex items-center justify-center">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 dark:bg-blue-300"></div>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-300 ml-1">W</span>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 dark:bg-blue-300 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
      );
    }
    else if (['txt'].includes(extension)) {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-gray-50 to-gray-100 dark:from-emerald-200/40 dark:to-emerald-300/30 border border-gray-200 dark:border-emerald-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
          <div className="absolute inset-0 m-4 rounded-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-emerald-300/70 overflow-hidden flex flex-col items-start justify-start p-1">
            <div className="w-full h-1 bg-gray-300 dark:bg-emerald-300 rounded-full mb-1"></div>
            <div className="w-2/3 h-1 bg-gray-300 dark:bg-emerald-300 rounded-full mb-1"></div>
            <div className="w-4/5 h-1 bg-gray-300 dark:bg-emerald-300 rounded-full"></div>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-500 dark:bg-emerald-300 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
      );
    }
    else if (['md'].includes(extension)) {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800/50 dark:to-neutral-800/60 border border-neutral-200 dark:border-neutral-700 shadow-sm group-hover:shadow-md transition-all duration-300">
          <div className="absolute inset-0 m-3 rounded-md overflow-hidden flex items-center justify-center">
            <div className="text-lg font-bold text-neutral-700 dark:text-neutral-300 flex items-center">
              <span>MD</span>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-neutral-500 dark:bg-neutral-400 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
      );
    }
    
    switch (type) {
      case 'pdf':
        return (
          <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-red-50 to-red-100 dark:from-red-200/40 dark:to-red-300/30 border border-red-200 dark:border-red-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
            <div className="absolute flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 rounded-sm shadow-sm">
              <div className="absolute inset-0 bg-red-500 dark:bg-red-300 opacity-10 rounded-sm"></div>
              <span className="text-lg font-bold text-red-600 dark:text-red-300">PDF</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 dark:bg-red-300 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
        );
      case 'image':
        return (
          <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-200/40 dark:to-purple-300/30 border border-purple-200 dark:border-purple-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 m-3 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 dark:from-purple-300 dark:to-pink-300 opacity-20"></div>
              <div className="absolute w-3 h-3 rounded-full bg-purple-400 dark:bg-purple-300 left-1 top-1"></div>
              <div className="absolute right-0 bottom-0 left-3 top-3 rounded-tr-md border-t-2 border-r-2 border-purple-400 dark:border-purple-300"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 dark:bg-purple-300 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
        );
      case 'code':
        return (
          <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-200/40 dark:to-blue-300/30 border border-blue-200 dark:border-blue-800/30 shadow-sm group-hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 m-3 rounded-md overflow-hidden flex items-center justify-center">
              <div className="flex flex-col space-y-1.5 items-start">
                <div className="w-10 h-1 bg-blue-400 dark:bg-blue-300 rounded-full"></div>
                <div className="w-6 h-1 bg-blue-300 dark:bg-blue-200 rounded-full ml-3"></div>
                <div className="w-8 h-1 bg-blue-400 dark:bg-blue-300 rounded-full ml-2"></div>
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 dark:bg-blue-300 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
        );
      case 'text':
        return (
          <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-200/40 dark:to-emerald-300/30 border border-emerald-200 dark:border-emerald-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 m-3 rounded-md overflow-hidden flex flex-col items-start justify-start p-2">
              <div className="w-full h-1 bg-emerald-300 dark:bg-emerald-300 rounded-full mb-1.5"></div>
              <div className="w-3/4 h-1 bg-emerald-300 dark:bg-emerald-300 rounded-full mb-1.5"></div>
              <div className="w-2/3 h-1 bg-emerald-300 dark:bg-emerald-300 rounded-full mb-1.5"></div>
              <div className="w-1/2 h-1 bg-emerald-300 dark:bg-emerald-300 rounded-full"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 dark:bg-emerald-300 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
        );
      default:
        return (
          <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-200/40 dark:to-amber-300/30 border border-amber-200 dark:border-amber-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
            <div className="absolute flex items-center justify-center w-10 h-14 bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-amber-200 dark:border-amber-300/70">
              <div className="absolute top-0 right-0 w-4 h-4 origin-bottom-left -rotate-12 bg-amber-100 dark:bg-amber-300/50"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 dark:bg-amber-300 rounded-full border-2 border-white dark:border-gray-800"></div>
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

    const matchesSearch = !searchTerm.trim() || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      !typeFilter || doc.type === typeFilter;
    
    const matchesCategory = 
      !categoryFilter || doc.projectId === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const projects = [...new Set(documents.map(doc => ({
    id: doc.projectId || '',
    title: doc.projectTitle || 'Sin proyecto'
  })))].filter(project => project.id !== '');

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Cargando documentos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 pt-24 px-4 bg-white dark:bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-900">Documentos</h1>
          <p className="text-gray-700 dark:text-gray-700">Accede y gestiona todos los documentos de tus proyectos</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-400" />
            <Input 
              type="text" 
              placeholder="Buscar documentos..." 
              className="pl-9 pr-4 text-gray-900 dark:text-white bg-white dark:bg-black border-gray-200 dark:border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="w-10 h-10 p-0 flex items-center justify-center bg-white hover:bg-gray-100 text-gray-700 dark:bg-black dark:hover:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white dark:bg-black p-4 rounded-lg shadow mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block dark:text-white">Tipo de documento</label>
              <select 
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-black dark:text-white"
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
              <label className="text-sm font-medium mb-1 block dark:text-white">Proyecto</label>
              <select 
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-black dark:text-white"
                value={categoryFilter || ''}
                onChange={(e) => setCategoryFilter(e.target.value || null)}
              >
                <option value="">Todos los proyectos</option>
                {projects.map((project, index) => (
                  <option key={index} value={project.id}>{project.title}</option>
                ))}
              </select>
            </div>
            <Button variant="ghost" onClick={clearFilters} className="h-10 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <X className="mr-2 h-4 w-4" />
              Limpiar filtros
            </Button>
          </div>
        </div>
      )}
      
      {filteredDocuments.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc, index) => {
            // Determinar el tipo y extensión del archivo
            const extension = getFileExtension(doc.name);
            const fileType = doc.type || getFileTypeFromName(doc.name);
            
            // Limpiar el nombre para mostrar
            const displayName = getFileNameWithoutExtension(doc.name);
            
            // Badge personalizado según extensión exacta
            const badgeText = extension ? extension.toUpperCase() : 
                              fileType === 'pdf' ? 'PDF' : 
                              fileType === 'image' ? 'IMAGEN' :
                              fileType === 'code' ? 'CÓDIGO' :
                              fileType === 'text' ? 'TEXTO' : 'ARCHIVO';
            
            // Limpiar cualquier carácter extraño en el badge
            const cleanBadgeText = badgeText.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ]/g, '');
            
            return (
              <Card key={index} className="relative group shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden bg-white dark:bg-black h-[280px] flex flex-col">
                <div className="absolute top-0 left-0 right-0 bottom-0">
                  {/* Badge de tipo de archivo */}
                  <div className="absolute right-2 top-2">
                    <div className={`px-2 py-1 text-xs font-bold rounded-full shadow ${
                      extension === 'pdf' ? 'bg-red-300 text-red-800 dark:bg-red-300 dark:text-red-900' :
                      ['jpg', 'jpeg'].includes(extension) ? 'bg-purple-300 text-purple-800 dark:bg-purple-300 dark:text-purple-900' :
                      extension === 'png' ? 'bg-indigo-300 text-indigo-800 dark:bg-indigo-300 dark:text-indigo-900' :
                      extension === 'svg' ? 'bg-cyan-300 text-cyan-800 dark:bg-cyan-300 dark:text-cyan-900' :
                      extension === 'gif' ? 'bg-pink-300 text-pink-800 dark:bg-pink-300 dark:text-pink-900' :
                      extension === 'html' ? 'bg-orange-300 text-orange-800 dark:bg-orange-300 dark:text-orange-900' :
                      ['js', 'jsx'].includes(extension) ? 'bg-yellow-300 text-yellow-800 dark:bg-yellow-300 dark:text-yellow-900' :
                      ['ts', 'tsx'].includes(extension) ? 'bg-blue-300 text-blue-800 dark:bg-blue-300 dark:text-blue-900' :
                      extension === 'css' ? 'bg-sky-300 text-sky-800 dark:bg-sky-300 dark:text-sky-900' :
                      extension === 'json' ? 'bg-amber-300 text-amber-800 dark:bg-amber-300 dark:text-amber-900' :
                      extension === 'py' ? 'bg-violet-300 text-violet-800 dark:bg-violet-300 dark:text-violet-900' :
                      ['doc', 'docx'].includes(extension) ? 'bg-blue-300 text-blue-800 dark:bg-blue-300 dark:text-blue-900' :
                      extension === 'txt' ? 'bg-emerald-300 text-emerald-800 dark:bg-emerald-300 dark:text-emerald-900' :
                      extension === 'md' ? 'bg-neutral-300 text-neutral-800 dark:bg-neutral-300 dark:text-neutral-900' :
                      fileType === 'pdf' ? 'bg-red-300 text-red-800 dark:bg-red-300 dark:text-red-900' :
                      fileType === 'image' ? 'bg-purple-300 text-purple-800 dark:bg-purple-300 dark:text-purple-900' :
                      fileType === 'code' ? 'bg-blue-300 text-blue-800 dark:bg-blue-300 dark:text-blue-900' :
                      fileType === 'text' ? 'bg-emerald-300 text-emerald-800 dark:bg-emerald-300 dark:text-emerald-900' :
                      'bg-slate-300 text-slate-800 dark:bg-slate-300 dark:text-slate-900'
                    }`}>
                      {cleanBadgeText}
                    </div>
                  </div>
                      </div>
                <CardHeader className="pb-4 flex flex-col items-center justify-center space-y-3 flex-grow">
                  {getDocumentIcon(fileType, extension)}
                  <div className="w-full text-center mt-4">
                    <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors text-gray-900 dark:text-white">
                      {displayName?.replace(/}/g, "") || 'Archivo sin nombre'}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-300 flex items-center mt-2 justify-center">
                      <Folder className="h-4 w-4 mr-1.5" /> 
                      {doc.projectTitle?.replace(/}/g, "") || 'Sin proyecto'}
                      </CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-center gap-3 mt-auto bg-gray-50/50 dark:bg-gray-900">
                  {doc.url ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 px-4 bg-white dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/80 shadow-sm"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Ver</span>
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="h-9 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 dark:hover:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800/30" 
                        onClick={() => downloadFile(doc.url!, doc.name)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        <span>Descargar</span>
                      </Button>
                    </>
                  ) : (
                    <Button variant="default" size="sm" className="h-9 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 dark:hover:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800/30" onClick={() => 
                      toast({
                        title: "Información",
                        description: "Este archivo no tiene una URL de descarga. Por favor, contacte al administrador.",
                      })
                    }>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Descargar</span>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <File className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-1 text-gray-900 dark:text-gray-900">No se encontraron documentos</h3>
          <p className="text-gray-600 dark:text-gray-600">Intenta con otro término de búsqueda o crea un proyecto con archivos</p>
        </div>
      )}
    </div>
  )
} 
