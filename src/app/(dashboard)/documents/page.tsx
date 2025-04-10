'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  FileText,
  FileImage,
  FilePlus,
  FileCode,
  Clock,
  Calendar,
  Download,
  Eye,
  Star,
  StarOff,
  Filter,
  ChevronDown,
  X,
  File
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

interface Document {
  id: string
  name: string
  type: 'pdf' | 'image' | 'code' | 'text'
  category: string
  size: string
  updated: string
  starred: boolean
  description: string
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Guía de estilo de marca',
      type: 'pdf',
      category: 'design',
      size: '2.4 MB',
      updated: '2023-04-15',
      starred: true,
      description: 'Guía completa de uso de la marca, colores, tipografía y aplicaciones.'
    },
    {
      id: '2',
      name: 'Mockups de la aplicación',
      type: 'image',
      category: 'design',
      size: '4.8 MB',
      updated: '2023-04-10',
      starred: false,
      description: 'Plantilla corporativa para presentaciones con diapositivas prediseñadas.'
    },
    {
      id: '3',
      name: 'Especificaciones técnicas',
      type: 'text',
      category: 'development',
      size: '1.2 MB',
      updated: '2023-04-08',
      starred: true,
      description: 'Estrategia de marketing para el último trimestre del año.'
    },
    {
      id: '4',
      name: 'Código fuente del componente',
      type: 'code',
      category: 'development',
      size: '0.8 MB',
      updated: '2023-04-05',
      starred: false,
      description: 'Informe financiero completo con análisis del año fiscal.'
    },
    {
      id: '5',
      name: 'Plan de marketing Q2',
      type: 'pdf',
      category: 'marketing',
      size: '3.1 MB',
      updated: '2023-03-28',
      starred: false,
      description: 'Colección de iconos, ilustraciones y gráficos para uso en comunicaciones.'
    },
    {
      id: '6',
      name: 'Calendario de contenido',
      type: 'text',
      category: 'marketing',
      size: '0.5 MB',
      updated: '2023-03-25',
      starred: true,
      description: 'Análisis detallado del mercado y la competencia.'
    },
    {
      id: '7',
      name: 'Planificación de proyecto',
      type: 'pdf',
      category: 'project',
      size: '1.7 MB',
      updated: '2023-03-22',
      starred: false,
      description: 'Guía completa de uso de la marca, colores, tipografía y aplicaciones.'
    },
    {
      id: '8',
      name: 'Informe de progreso',
      type: 'text',
      category: 'project',
      size: '0.9 MB',
      updated: '2023-03-18',
      starred: false,
      description: 'Plantilla corporativa para presentaciones con diapositivas prediseñadas.'
    }
  ])

  const toggleStar = (id: string) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? {...doc, starred: !doc.starred} : doc
    ))
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />
      case 'image':
        return <FileImage className="h-6 w-6 text-purple-500" />
      case 'code':
        return <FileCode className="h-6 w-6 text-blue-500" />
      case 'text':
      default:
        return <FileText className="h-6 w-6 text-emerald-500" />
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'design':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Diseño</Badge>
      case 'marketing':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Marketing</Badge>
      case 'development':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Desarrollo</Badge>
      case 'project':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Proyecto</Badge>
      default:
        return <Badge>Otro</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  const clearFilters = () => {
    setCategoryFilter(null)
    setTypeFilter(null)
  }

  const filteredDocuments = documents.filter(doc => {
    // Filtro de búsqueda
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filtro de categoría
    const matchesCategory = 
      !categoryFilter || doc.category === categoryFilter
    
    // Filtro de tipo
    const matchesType = 
      !typeFilter || doc.type === typeFilter
    
    return matchesSearch && matchesCategory && matchesType
  })

  // Tipos de documento y sus colores
  const getTypeColor = (type: string) => {
    const types: Record<string, string> = {
      'pdf': 'bg-red-500',
      'image': 'bg-purple-500',
      'code': 'bg-blue-500',
      'text': 'bg-emerald-500'
    }
    return types[type] || 'bg-gray-500'
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documentos</h1>
          <p className="text-muted-foreground">Accede y gestiona todos tus documentos desde un solo lugar</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Buscar documentos..." 
              className="pl-9 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <FilePlus className="mr-2 h-4 w-4" />
            Nuevo
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="design">Diseño</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="development">Desarrollo</TabsTrigger>
          <TabsTrigger value="project">Proyecto</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map(doc => (
                <Card key={doc.id} className="group hover:shadow-md transition-all duration-200 border">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(doc.type)}/10`}>
                          <FileText className={`h-5 w-5 text-${getTypeColor(doc.type).split('-')[1]}-500`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">{doc.name}</CardTitle>
                          <CardDescription>{doc.category}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {doc.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Tamaño: {doc.size}</span>
                      <span>Actualizado: {formatDate(doc.updated)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="ghost" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <File className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-1">No se encontraron documentos</h3>
                <p className="text-muted-foreground">Intenta con otro término de búsqueda</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="design" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments
              .filter(doc => doc.category === 'design')
              .map(doc => (
                <Card key={doc.id} className="group hover:shadow-md transition-all duration-200 border">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(doc.type)}/10`}>
                          <FileText className={`h-5 w-5 text-${getTypeColor(doc.type).split('-')[1]}-500`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">{doc.name}</CardTitle>
                          <CardDescription>{doc.category}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {doc.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Tamaño: {doc.size}</span>
                      <span>Actualizado: {formatDate(doc.updated)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="ghost" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="marketing" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments
              .filter(doc => doc.category === 'marketing')
              .map(doc => (
                <Card key={doc.id} className="group hover:shadow-md transition-all duration-200 border">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(doc.type)}/10`}>
                          <FileText className={`h-5 w-5 text-${getTypeColor(doc.type).split('-')[1]}-500`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">{doc.name}</CardTitle>
                          <CardDescription>{doc.category}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {doc.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Tamaño: {doc.size}</span>
                      <span>Actualizado: {formatDate(doc.updated)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="ghost" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="development" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments
              .filter(doc => doc.category === 'development')
              .map(doc => (
                <Card key={doc.id} className="group hover:shadow-md transition-all duration-200 border">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(doc.type)}/10`}>
                          <FileText className={`h-5 w-5 text-${getTypeColor(doc.type).split('-')[1]}-500`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">{doc.name}</CardTitle>
                          <CardDescription>{doc.category}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {doc.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Tamaño: {doc.size}</span>
                      <span>Actualizado: {formatDate(doc.updated)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="ghost" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="project" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments
              .filter(doc => doc.category === 'project')
              .map(doc => (
                <Card key={doc.id} className="group hover:shadow-md transition-all duration-200 border">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(doc.type)}/10`}>
                          <FileText className={`h-5 w-5 text-${getTypeColor(doc.type).split('-')[1]}-500`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">{doc.name}</CardTitle>
                          <CardDescription>{doc.category}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {doc.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Tamaño: {doc.size}</span>
                      <span>Actualizado: {formatDate(doc.updated)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="ghost" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 