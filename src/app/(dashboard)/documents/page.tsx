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
  FileText,
  FileVideo,
  FileCode,
  AlertCircle
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ListFilter, LayoutGrid } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
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
    const fileType = extension || type?.toLowerCase() || 'file';
    
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-10 w-10 text-red-500" />;
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return <FileImage className="h-10 w-10 text-purple-500" />;
      case 'video':
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'mkv':
      case 'webm':
        return <FileVideo className="h-10 w-10 text-blue-500" />;
      case 'word':
      case 'doc':
      case 'docx':
        return <FileText className="h-10 w-10 text-blue-500" />;
      case 'code':
      case 'html':
      case 'css':
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
      case 'json':
        return <FileCode className="h-10 w-10 text-emerald-500" />;
      case 'text':
      case 'txt':
      case 'md':
        return <FileText className="h-10 w-10 text-zinc-500" />;
      default:
        return <File className="h-10 w-10 text-zinc-400" />;
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-black">Cargando documentos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 font-sans">
      <div className="page-header-card">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center z-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
              <Folder className="h-8 w-8 text-primary" />
              Documentos
            </h1>
            
            <div className="flex items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1.5 bg-primary/20 text-black border border-black dark:border-transparent py-1 px-3 rounded-full text-xs font-bold shadow-sm transition-colors">
                {userRole === 'client' && "Cliente"}
                {userRole === 'designer' && "Diseñador"}
                {userRole === 'project_manager' && "Gerente de Proyecto"}
              </span>
            </div>
          </div>

          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-base font-bold rounded-full shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
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
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-muted p-1.5 rounded-xl border border-border shadow-inner h-12">
              <TabsTrigger value="grid" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground transition-all font-medium h-full">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Tarjetas
              </TabsTrigger>
              <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground transition-all font-medium h-full">
                <ListFilter className="h-4 w-4 mr-2" />
                Lista
              </TabsTrigger>
            </TabsList>
            
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">
              {filteredDocuments.length} documentos encontrados
            </p>
          </div>

          <TabsContent value="grid" className="mt-0">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredDocuments.map((doc, index) => {
                const extension = getFileExtension(doc.name);
                const fileType = doc.type || getFileTypeFromName(doc.name);
                const displayName = getFileNameWithoutExtension(doc.name);
                
                return (
                  <Card key={index} className="bg-card border border-border rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/50 transition-all group flex flex-col h-[280px]">
                    <CardContent className="p-5 flex flex-col items-center justify-center flex-grow relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="mb-4 bg-muted p-5 rounded-2xl group-hover:scale-110 transition-transform duration-300 relative z-10">
                        {getDocumentIcon(fileType, extension)}
                      </div>
                      <div className="w-full text-center mt-2 px-2 relative z-10">
                        <CardTitle className="text-sm font-bold line-clamp-1 text-foreground" title={displayName?.replace(/}/g, "") || 'Archivo'}>
                          {displayName?.replace(/}/g, "") || 'Archivo'}
                        </CardTitle>
                        <CardDescription className="text-[10px] text-muted-foreground flex items-center mt-2 justify-center truncate uppercase tracking-widest font-bold">
                          <Folder className="h-3 w-3 mr-1.5 shrink-0 text-primary" /> 
                          <span className="truncate">{doc.projectTitle?.replace(/}/g, "") || 'Sin proyecto'}</span>
                        </CardDescription>
                      </div>
                    </CardContent>
                    <CardFooter className="p-3 bg-muted/30 border-t border-border flex justify-between gap-2 mt-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-[10px] font-bold h-9"
                        onClick={() => handleViewDocument(doc)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        VER
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-all text-[10px] font-bold h-9"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        BAJAR
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </motion.div>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-[1.5rem] overflow-hidden shadow-sm"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-bold tracking-widest border-b border-border">
                    <tr>
                      <th className="px-6 py-4">Nombre del Documento</th>
                      <th className="px-6 py-4">Proyecto Asociado</th>
                      <th className="px-6 py-4 hidden sm:table-cell">Tamaño</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredDocuments.map((doc, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-muted p-2 rounded-lg">
                              {getDocumentIcon(doc.type, getFileExtension(doc.name))}
                            </div>
                            <div>
                              <p className="font-bold text-foreground line-clamp-1">
                                {getFileNameWithoutExtension(doc.name).replace(/}/g, "")}
                              </p>
                              <p className="text-[10px] text-muted-foreground uppercase">{getFileExtension(doc.name)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="bg-muted/50 border-border text-[10px] uppercase font-bold text-muted-foreground">
                            {doc.projectTitle?.replace(/}/g, "") || 'General'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell text-xs text-muted-foreground">
                          {formatFileSize(doc.size)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={() => handleViewDocument(doc)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-500" onClick={() => handleDownload(doc)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-card border border-border rounded-3xl p-8 shadow-sm">
          <div className="bg-muted p-6 rounded-full mb-4">
            <File className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground">No se encontraron documentos</h3>
          <p className="text-muted-foreground text-sm">Intenta con otro término de búsqueda o crea un proyecto con archivos</p>
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
                className="bg-primary hover:bg-primary/90 text-black"
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
