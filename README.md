# Grayola - Plataforma de Gestión de Proyectos de Diseño

<div align="center">
  <img src="public/logo.png" alt="Grayola Logo" height="100">
  <p><i>Democratizando el acceso a servicios de diseño en todo el mundo</i></p>
</div>

## 📋 Índice
- [Descripción](#descripción)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Características Implementadas](#características-implementadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Ejecución Local](#instalación-y-ejecución-local)
- [Configuración de Supabase](#configuración-de-supabase)
- [Validaciones Implementadas](#validaciones-implementadas)
- [Dashboard](#dashboard)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Despliegue Local](#despliegue-local)
- [Contacto](#contacto)

## 📝 Descripción

Grayola es una plataforma moderna diseñada para democratizar el acceso a servicios de diseño en todo el mundo. La aplicación facilita la gestión de proyectos de diseño permitiendo a clientes, project managers y diseñadores colaborar de manera eficiente en un entorno seguro.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS con ShadCN UI
- **Iconos**: Lucide React

### Backend
- **BaaS**: Supabase
- **Base de Datos**: PostgreSQL
- **Autenticación**: Supabase Auth
- **Almacenamiento**: Supabase Storage

## ✨ Características Implementadas

### Autenticación y Autorización
- Sistema de registro con selección de roles (Cliente, Project Manager, Diseñador)
- Login seguro con validación de credenciales
- Protección de rutas según roles de usuario

### Gestión de Proyectos
- Creación, edición y eliminación de proyectos
- Asignación de diseñadores (obligatoria)
- Estados de proyecto: pendiente, en progreso, completado, retrasado
- Filtros y búsqueda avanzada
- Confirmación para editar proyectos

### Gestión de Documentos
- Subida de documentos con validación estricta de formatos
- Organización por proyectos
- Filtrado por tipos de documento
- Sistema de almacenamiento seguro con Supabase Storage

## 📋 Requisitos Previos

- Node.js 18.x o superior
- npm 9.x o superior
- Cuenta en Supabase
- Git (opcional)

## 🚀 Instalación y Ejecución Local

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd aplicacion-fullstack
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env.local` en la raíz del proyecto con:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

5. Abrir el navegador en:
```
http://localhost:3000
```

## 🔧 Configuración de Supabase

### 1. Crear Tablas

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'designer', 'project_manager'))
);

-- Tabla de proyectos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  files TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pendiente',
  created_by UUID REFERENCES users(id) NOT NULL,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Configurar Bucket de Almacenamiento

1. Ir a "Storage" en el panel de Supabase
2. Crear un nuevo bucket llamado "documents"
3. Configurar acceso público: No
4. Establecer los CORS (Cross-Origin Resource Sharing):
   - Allowed Origins: http://localhost:3000, https://[tu-dominio-de-produccion].com

### 3. Configurar Políticas de Seguridad

```sql
-- Políticas para la tabla projects
CREATE POLICY "Product Managers pueden ver todos los proyectos"
ON projects FOR SELECT
USING (auth.role() = 'product_manager');

CREATE POLICY "Clientes pueden ver sus proyectos"
ON projects FOR SELECT
USING (auth.uid() = creator_id OR auth.role() = 'product_manager');

CREATE POLICY "Diseñadores pueden ver proyectos asignados"
ON projects FOR SELECT
USING (auth.uid() = designer_id OR auth.role() = 'product_manager');

CREATE POLICY "Product Managers pueden crear proyectos"
ON projects FOR INSERT
WITH CHECK (auth.role() = 'product_manager');

CREATE POLICY "Clientes pueden crear proyectos"
ON projects FOR INSERT
WITH CHECK (auth.role() = 'client');

CREATE POLICY "Product Managers pueden actualizar proyectos"
ON projects FOR UPDATE
USING (auth.role() = 'product_manager');

CREATE POLICY "Diseñadores pueden actualizar estados de proyectos"
ON projects FOR UPDATE
USING (auth.uid() = designer_id AND auth.role() = 'designer')
WITH CHECK (OLD.status IS DISTINCT FROM NEW.status);

-- Políticas para el bucket de documentos
CREATE POLICY "Usuarios autenticados pueden subir documentos"
ON storage.objects FOR INSERT
WITH CHECK (auth.role() IN ('client', 'designer', 'product_manager') AND bucket_id = 'documents');

CREATE POLICY "Usuarios relacionados con el proyecto pueden ver documentos"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND 
       (auth.uid() IN (SELECT created_by FROM projects WHERE id::text = (storage.foldername(name))[1]) OR 
        auth.uid() IN (SELECT assigned_to FROM projects WHERE id::text = (storage.foldername(name))[1]) OR
        auth.role() = 'product_manager'));

CREATE POLICY "Solo Product Managers pueden eliminar documentos"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents' AND auth.role() = 'product_manager');
```

## ✅ Validaciones Implementadas

### Validaciones de Proyectos
- **Validación de nombres únicos**: No permite crear proyectos con nombres duplicados
- **Campos requeridos**: 
  - Título del proyecto (mínimo 5 caracteres)
  - Descripción (mínimo 10 caracteres)
  - Diseñador asignado (obligatorio)
- **Prevención de edición accidental**: Confirmación antes de guardar cambios
- **Estados predefinidos**: Solo permite valores válidos (pendiente, en progreso, completado, retrasado)
- **Validación para edición**: Solo usuarios con permisos pueden editar ciertos campos

### Validaciones de Documentos
- **Validación de formatos permitidos**:
  - PDF (.pdf)
  - Imágenes (.jpg, .jpeg, .png, .gif)
  - Documentos (.doc, .docx, .txt)
  - Archivos de diseño (.ai, .psd, .xd, .sketch, .fig)
- **Tamaño máximo**: 10MB por archivo
- **Estructura de almacenamiento**: 
  - Organizado por carpetas según ID de proyecto
  - Nombres de archivo únicos mediante UUID
- **Restricciones de subida**:
  - Los clientes solo pueden subir a sus proyectos
  - Los diseñadores solo a proyectos asignados
  - Los Project Managers a cualquier proyecto

## 📊 Dashboard

El dashboard es el centro de control de la aplicación, diseñado para ofrecer una visión clara y completa del sistema.

### Componentes del Dashboard

1. **Panel de Estadísticas**:
   - Contador de proyectos totales
   - Contador de documentos subidos
   - Contador de usuarios registrados
   - Distribución de proyectos por estado

2. **Guías de Usuario**:
   - Guía de Gestión de Proyectos (con permisos por rol)
   - Guía de Subida de Documentos
   - Guía de Gestión de Usuarios

3. **Proyectos Recientes**:
   - Listado de últimos proyectos creados o editados
   - Indicador visual de estado
   - Acceso rápido a detalles

4. **Tareas Pendientes**:
   - Lista de tareas relacionadas con documentos
   - Mejoras de interfaz programadas
   - Sistema de alertas pendiente

### Navegación Principal

- **Proyectos**: Acceso a la gestión completa de proyectos
- **Documentos**: Sistema de gestión documental
- **Dashboard**: Visión general y estadísticas
- **Cambio de tema**: Alternancia entre modo claro y oscuro
- **Perfil de usuario**: Información y cierre de sesión

## 📁 Estructura del Proyecto

```
aplicacion-fullstack/
├── src/
│   ├── app/              # Rutas y páginas
│   │   ├── (auth)/       # Autenticación
│   │   └── (dashboard)/  # Área principal
│   ├── components/       # Componentes reutilizables
│   │   ├── ui/           # Componentes de interfaz
│   │   └── dashboard/    # Componentes específicos
│   ├── lib/              # Utilidades y configuración
│   └── types/            # Definiciones de tipos
├── public/              # Archivos estáticos
└── styles/              # Estilos globales
```

## 🚀 Despliegue Local

1. Asegúrate de tener todas las dependencias instaladas:
```bash
npm install
```

2. Configura las variables de entorno en `.env.local`

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Para producción:
```bash
npm run build
npm start
```

## 📞 Contacto

Para soporte técnico o preguntas:
- Email: valeriaalarocn119@gmail.com 