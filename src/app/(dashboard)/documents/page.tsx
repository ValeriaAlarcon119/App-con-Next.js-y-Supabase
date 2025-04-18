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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
  const [userRole, setUserRole] = useState<string>('')

  const [selectedDoc, setSelectedDoc] = useState<FileObject | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)

      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { data: userRoleData } = await supabase
        .from('users')
        .select('role')
        .eq('id', userData.user.id)
        .single()

      if (!userRoleData) throw new Error('No se pudo obtener el rol del usuario')
      
      setUserRole(userRoleData.role)
      console.log("Rol del usuario:", userRoleData.role)

      let query = supabase
        .from('projects')
        .select(`
          id,
          title,
          files,
          created_by,
          assigned_to
        `)

      const role = userRoleData.role ? userRoleData.role.toLowerCase() : '';
      if (role === 'client' || role === 'cliente') {
        query = query.eq('created_by', userData.user.id)
      } else if (role === 'designer' || role === 'diseñador') {
        query = query.eq('assigned_to', userData.user.id)
      }


      const { data: projects, error } = await query
      
      if (error) {
        throw error
      }

      console.log("Proyectos obtenidos:", projects?.length || 0)

      const allFiles: FileObject[] = []
      
      projects?.forEach((project: any) => {
        if (!project.files || !Array.isArray(project.files)) {
          console.log(`Proyecto ${project.id} no tiene archivos o no es un array:`, project.files);
          return;
        }
        
        console.log(`Procesando archivos del proyecto ${project.title} (${project.id}):`, project.files.length);
        
          project.files.forEach((file: any) => {
          try {
         
            if (typeof file === 'string') {
              console.log(`Procesando archivo string: ${file}`);
              
              try {
                if (file.trim().startsWith('{') && file.trim().endsWith('}')) {
                  const jsonObj = JSON.parse(file);
                  console.log("Archivo JSON parseado:", jsonObj);
                  
                  if (jsonObj.url && typeof jsonObj.url === 'string' && jsonObj.url.startsWith('http')) {
                    console.log("Usando URL directa del JSON:", jsonObj.url);
                    
                    allFiles.push({
                      name: jsonObj.name || 'Archivo',
                      path: jsonObj.path || '',
                      type: jsonObj.type || 'file',
                      size: jsonObj.size || 0,
                      projectId: project.id,
                      projectTitle: project.title,
                      url: jsonObj.url 
                    });
                    
                    return; 
                  }
                }
              } catch (jsonError) {
                console.log("No se pudo parsear como JSON, tratando como string normal");
              }
              
              const cleanFileName = String(file).replace(/[\{\}\"\'\`]+/g, '').trim();
              const extension = cleanFileName.split('.').pop()?.toLowerCase() || '';
              
       
              let fileType = 'file';
              if (extension === 'pdf') fileType = 'pdf';
              else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) fileType = 'image';
              else if (['doc', 'docx'].includes(extension)) fileType = 'word';
              else if (['html', 'css', 'js', 'jsx', 'ts', 'tsx'].includes(extension)) fileType = 'code';
              else if (['txt', 'md'].includes(extension)) fileType = 'text';
              
              let fileUrl = file;
              
              if (!file.startsWith('http')) {
                try {
                  const publicUrlData = supabase.storage.from('documents').getPublicUrl(file);
                  if (publicUrlData && publicUrlData.data && publicUrlData.data.publicUrl) {
                    fileUrl = publicUrlData.data.publicUrl;
                    console.log(`URL construida para archivo string: ${fileUrl}`);
                  } else {
                    console.log(`No se pudo construir URL para archivo string: ${file}`);
                  }
                } catch (urlError) {
                  console.error(`Error al construir URL para archivo string: ${file}`, urlError);
                }
              } else {
                console.log(`El archivo string ya parece ser una URL: ${fileUrl}`);
              }
              
              console.log(`Archivo string procesado: ${cleanFileName}, URL: ${fileUrl}`);
              
              allFiles.push({
                name: cleanFileName,
                path: file,
                type: fileType,
                size: 0,
                projectId: project.id,
                projectTitle: project.title,
                url: fileUrl
              });
            }

            else if (file && typeof file === 'object') {

              let cleanFileName = String(file.name || 'Archivo').replace(/[\{\}\"\'\`]+/g, '').trim()
              
              if ((!cleanFileName || !cleanFileName.includes('.') || cleanFileName === 'Archivo') && file.path) {
                const pathParts = file.path.split('/');
                if (pathParts.length > 0) {
                  const nameFromPath = decodeURIComponent(pathParts[pathParts.length - 1]);
                  if (nameFromPath && nameFromPath.includes('.')) {
                    cleanFileName = nameFromPath;
                  }
                }
              }
              
              const extension = cleanFileName.split('.').pop()?.toLowerCase() || '';
              let fileType = file.type || 'file';
              
              if (fileType === 'file') {
                if (extension === 'pdf') fileType = 'pdf';
                else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) fileType = 'image';
                else if (['doc', 'docx'].includes(extension)) fileType = 'word';
                else if (['html', 'css', 'js', 'jsx', 'ts', 'tsx'].includes(extension)) fileType = 'code';
                else if (['txt', 'md'].includes(extension)) fileType = 'text';
              }
              
              let fileUrl = file.url;
              
              if (file.path && !fileUrl) {
                try {
                  const publicUrlData = supabase.storage.from('documents').getPublicUrl(file.path);
                  if (publicUrlData && publicUrlData.data && publicUrlData.data.publicUrl) {
                    fileUrl = publicUrlData.data.publicUrl;
                    console.log(`URL construida para ${file.path}:`, fileUrl);
                  } else {
                    console.log(`No se pudo construir URL para ${file.path}`);

                    if (file.path.startsWith('http')) {
                      fileUrl = file.path;
                      console.log(`Usando path como URL:`, fileUrl);
                    }
                  }
                } catch (urlError) {
                  console.error(`Error al construir URL para ${file.path}:`, urlError);
           
                  if (file.path.startsWith('http')) {
                    fileUrl = file.path;
                  }
                }
              }
              
              if (!fileUrl && file.path && file.path.startsWith('http')) {
                fileUrl = file.path;
              }
              
              console.log(`Archivo procesado: ${cleanFileName}, URL: ${fileUrl}`);
              
              allFiles.push({
                name: cleanFileName,
                path: file.path || '',
                type: fileType,
                size: file.size || 0,
                url: fileUrl,
                projectId: project.id,
                projectTitle: project.title
              })
            }
          } catch (error) {
            console.error('Error procesando archivo individual:', error, file);
        }
        })
      })
      
      console.log('Total de documentos procesados:', allFiles.length);
      setDocuments(allFiles);

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
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-red-100 to-red-200 dark:from-red-300/40 dark:to-red-400/30 border-2 border-red-300 dark:border-red-400/70 shadow-md group-hover:shadow-lg transition-all duration-300">
          <div className="absolute flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 rounded-sm shadow-sm">
            <div className="absolute inset-0 bg-red-500 dark:bg-red-400 opacity-20 rounded-sm"></div>
            <span className="text-lg font-bold text-red-600 dark:text-red-400">PDF</span>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 dark:bg-red-400 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
      );
    } 
 
    else if (['jpg', 'jpeg'].includes(extension)) {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-300/40 dark:to-purple-400/30 border-2 border-purple-300 dark:border-purple-400/70 shadow-md group-hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 m-3 rounded-md overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 dark:from-purple-300 dark:to-pink-400 opacity-40"></div>
            <FileImage className="absolute inset-0 m-auto h-8 w-8 text-purple-600 dark:text-purple-300" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 dark:bg-purple-400 rounded-full border-2 border-white dark:border-gray-800"></div>
          <div className="absolute bottom-1 right-1 text-xs font-medium text-purple-800 dark:text-purple-300">JPG</div>
        </div>
      );
    }
    else if (['png'].includes(extension)) {
      return (
        <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-300/40 dark:to-indigo-400/30 border-2 border-indigo-300 dark:border-indigo-400/70 shadow-md group-hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 m-3 rounded-md overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-blue-500 dark:from-indigo-300 dark:to-blue-400 opacity-40"></div>
            <FileImage className="absolute inset-0 m-auto h-8 w-8 text-indigo-600 dark:text-indigo-300" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 dark:bg-indigo-400 rounded-full border-2 border-white dark:border-gray-800"></div>
          <div className="absolute bottom-1 right-1 text-xs font-medium text-indigo-800 dark:text-indigo-300">PNG</div>
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
          <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-red-100 to-red-200 dark:from-red-300/40 dark:to-red-400/30 border-2 border-red-300 dark:border-red-400/70 shadow-md group-hover:shadow-lg transition-all duration-300">
            <div className="absolute flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 rounded-sm shadow-sm">
              <div className="absolute inset-0 bg-red-500 dark:bg-red-400 opacity-20 rounded-sm"></div>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">PDF</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 dark:bg-red-400 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
        );
      case 'image':
        return (
          <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-300/40 dark:to-purple-400/30 border-2 border-purple-300 dark:border-purple-400/70 shadow-md group-hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 m-3 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 dark:from-purple-300 dark:to-pink-400 opacity-30"></div>
              <div className="absolute w-3 h-3 rounded-full bg-purple-500 dark:bg-purple-400 left-1 top-1"></div>
              <div className="absolute right-0 bottom-0 left-3 top-3 rounded-tr-md border-t-2 border-r-2 border-purple-500 dark:border-purple-400"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 dark:bg-purple-400 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
        );
      case 'code':
        return (
          <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-300/40 dark:to-blue-400/30 border-2 border-blue-300 dark:border-blue-400/70 shadow-md group-hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 m-3 rounded-md overflow-hidden flex items-center justify-center">
              <div className="flex flex-col space-y-1.5 items-start">
                <div className="w-10 h-1 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                <div className="w-6 h-1 bg-blue-400 dark:bg-blue-300 rounded-full ml-3"></div>
                <div className="w-8 h-1 bg-blue-500 dark:bg-blue-400 rounded-full ml-2"></div>
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 dark:bg-blue-400 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
        );
      case 'text':
        return (
          <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-300/40 dark:to-emerald-400/30 border-2 border-emerald-300 dark:border-emerald-400/70 shadow-md group-hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 m-3 rounded-md overflow-hidden flex flex-col items-start justify-start p-2">
              <div className="w-full h-1 bg-emerald-500 dark:bg-emerald-400 rounded-full mb-1.5"></div>
              <div className="w-3/4 h-1 bg-emerald-500 dark:bg-emerald-400 rounded-full mb-1.5"></div>
              <div className="w-2/3 h-1 bg-emerald-500 dark:bg-emerald-400 rounded-full mb-1.5"></div>
              <div className="w-1/2 h-1 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 dark:bg-emerald-400 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
        );
      default:
        return (
          <div className="relative flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-300/40 dark:to-amber-400/30 border-2 border-amber-300 dark:border-amber-400/70 shadow-md group-hover:shadow-lg transition-all duration-300">
            <div className="absolute flex items-center justify-center w-10 h-14 bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-amber-300 dark:border-amber-400/70">
              <div className="absolute top-0 right-0 w-4 h-4 origin-bottom-left -rotate-12 bg-amber-200 dark:bg-amber-400/50"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 dark:bg-amber-400 rounded-full border-2 border-white dark:border-gray-800"></div>
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
    if (!url) {
      toast({
        title: "Error",
        description: "No hay URL disponible para este archivo",
        variant: "destructive",
      });
      return;
    }

    window.open(url, '_blank');
  };

  const handleViewDocument = (doc: FileObject) => {
    if (!doc.url) {
      toast({
        title: "Error",
        description: "No hay vista previa disponible para este archivo",
        variant: "destructive",
      });
      return;
    }
    setSelectedDoc(doc);
    setIsViewerOpen(true);
  };
  
  const handleDownload = async (doc: FileObject) => {
    try {
      if (!doc.url) {
        toast({
          title: "Error",
          description: "No hay URL disponible para este archivo",
          variant: "destructive",
        });
        return;
      }
      
      window.open(doc.url, '_blank');
      
      toast({
        title: "Éxito",
        description: `Descargando ${doc.name}...`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al descargar el archivo",
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

  const projectsMap = new Map();
  
  documents.forEach(doc => {
    if (doc.projectId && !projectsMap.has(doc.projectId)) {
      projectsMap.set(doc.projectId, {
        id: doc.projectId,
        title: doc.projectTitle || 'Sin proyecto'
      });
    }
  });
  const projects = Array.from(projectsMap.values()).filter(project => project.id !== '');

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7fff00]"></div>
        <p className="mt-4 text-black">Cargando documentos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 font-sans">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#7ee8ff] to-[#94e0ff] p-4 rounded-xl shadow-sm border-2 border-black">
        <div className="relative flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left md:items-center">
          <div className="mx-auto md:mx-0">
            <h1 className="text-3xl font-black text-black">
              Documentos
            </h1>
            
            <span className="inline-block bg-[#e8ffdb] text-black py-0.5 px-2 rounded-full text-xs mt-1 font-medium border border-black">
              {userRole === 'client' && "Cliente"}
              {userRole === 'designer' && "Diseñador"}
              {userRole === 'project_manager' && "Gerente de Proyecto"}
            </span>
          </div>

          <Button
            className="bg-[#7fff00] hover:bg-[#90ff20] text-black px-6 py-3 text-base font-bold rounded-full border-2 border-b-4 border-black"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 border-2 border-black">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block text-black">Tipo de documento</label>
              <select 
                className="w-full p-2 rounded-md border-2 border-black bg-white text-black"
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
              <label className="text-sm font-medium mb-1 block text-black">Proyecto</label>
              <select 
                className="w-full p-2 rounded-md border-2 border-black bg-white text-black"
                value={categoryFilter || ''}
                onChange={(e) => setCategoryFilter(e.target.value || null)}
              >
                <option value="">Todos los proyectos</option>
                {projects.map((project, index) => (
                  <option key={index} value={project.id}>{project.title}</option>
                ))}
              </select>
            </div>
            <Button 
              onClick={clearFilters} 
              className="h-10 bg-[#e8ffdb] hover:bg-[#d7ffb3] text-black border-2 border-black rounded-md"
            >
              <X className="mr-2 h-4 w-4" />
              Limpiar filtros
            </Button>
          </div>
        </div>
      )}
      
      {filteredDocuments.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc, index) => {
            const extension = getFileExtension(doc.name);
            const fileType = doc.type || getFileTypeFromName(doc.name);
            
            const displayName = getFileNameWithoutExtension(doc.name);
            
            const badgeText = extension ? extension.toUpperCase() : 
                              fileType === 'pdf' ? 'PDF' : 
                              fileType === 'image' ? 'IMAGEN' :
                              fileType === 'code' ? 'CÓDIGO' :
                              fileType === 'text' ? 'TEXTO' : 'ARCHIVO';
            
            const cleanBadgeText = badgeText.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ]/g, '');
            
            return (
              <Card key={index} className="relative group shadow-md transition-all duration-300 border-2 border-black rounded-xl overflow-hidden bg-white dark:bg-gray-900 h-[320px] flex flex-col hover:shadow-lg">
                <div className="absolute top-0 left-0 right-0 bottom-0">
 
                  <div className="absolute right-2 top-2">
                    <div className={`px-2 py-1 text-xs font-bold rounded-full shadow border border-black ${
                      fileType === 'pdf' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      fileType === 'image' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                      fileType === 'word' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      fileType === 'code' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      fileType === 'text' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      'bg-[#e8ffdb] text-black dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {cleanBadgeText}
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-2 flex flex-col items-center justify-center space-y-2 flex-grow">
                  <div className="w-20 h-20 flex items-center justify-center scale-[0.6]"> {/* Cambios aquí */}
                    {getDocumentIcon(fileType, extension)}
                  </div>
                  <div className="w-full text-center mt-2">
                    <CardTitle className="text-lg font-semibold line-clamp-2 text-black dark:text-white">
                      {displayName?.replace(/}/g, "") || 'Archivo sin nombre'}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 flex items-center mt-2 justify-center">
                      <Folder className="h-4 w-4 mr-1.5" /> 
                      {doc.projectTitle?.replace(/}/g, "") || 'Sin proyecto'}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-4 mt-auto bg-[#f9f9f9] dark:bg-gray-800">
                {doc.url ? (
                  <>
                    <button
                      onClick={() => handleViewDocument(doc)}
                      className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white border-2 border-black transition-colors"
                      type="button"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDownload(doc)}
                      className="h-10 w-10 rounded-full flex items-center justify-center bg-[#7fff00] hover:bg-[#90ff20] text-black border-2 border-black transition-colors"
                      type="button"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <button 
                    className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white border-2 border-black transition-colors"
                    onClick={() => 
                      toast({
                        title: "Error",
                        description: "Este archivo no tiene una URL de descarga",
                        variant: "destructive",
                      })
                    }
                    type="button"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                )}
              </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white border-2 border-black rounded-xl p-8">
          <File className="h-16 w-16 text-black mb-4" />
          <h3 className="text-lg font-medium mb-1 text-black">No se encontraron documentos</h3>
          <p className="text-gray-600">Intenta con otro término de búsqueda o crea un proyecto con archivos</p>
        </div>
      )}

      {isViewerOpen && selectedDoc && (
        <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>{selectedDoc.name}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-4">
              {selectedDoc.type === 'image' ? (
                <img 
                  src={selectedDoc.url} 
                  alt={selectedDoc.name}
                  className="w-full h-auto object-contain"
                />
              ) : selectedDoc.type === 'pdf' ? (
                <iframe
                  src={selectedDoc.url}
                  className="w-full h-full min-h-[60vh]"
                  title={selectedDoc.name}
                />
              ) : (
                <div className="flex items-center justify-center h-full min-h-[60vh]">
                  <p className="text-gray-500">Vista previa no disponible</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button 
                onClick={() => handleDownload(selectedDoc)} 
                className="bg-[#7fff00] hover:bg-[#90ff20] text-black"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
