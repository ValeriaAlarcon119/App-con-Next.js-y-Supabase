# Grayola - Plataforma de Gestión de Proyectos de Diseño

Esta es una aplicación desplegada en Netlify. Puedes acceder a la implementación en el siguiente enlace:

🔗 **[App Fullstack - Ver en producción](https://appfullstack.netlify.app)**

---


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
- [Explicación Técnica](#explicación-técnica)
- [Base de Datos](#base-de-datos)
- [Testing](#testing)
- [Despliegue](#despliegue)
- [Mejoras Futuras y Requisitos Pendientes](#mejoras-futuras-y-requisitos-pendientes)
- [Contacto](#contacto)

## 📝 Descripción

Grayola es una plataforma moderna diseñada para democratizar el acceso a servicios de diseño en todo el mundo. Nacida en 2023, Grayola se ha posicionado rápidamente como una startup referente en Design as a Service, gracias a su propuesta de valor, su plataforma intuitiva y su modelo por suscripción.

La aplicación facilita la gestión de proyectos de diseño permitiendo a clientes, project managers y diseñadores colaborar de manera eficiente en un entorno seguro. Empresas como Frubana, Rockstart, Universidad Ean, Naranja Media, Torrenegra, La Haus, entre muchas otras, ya confían en Grayola para potenciar su diseño.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) con [ShadCN UI](https://ui.shadcn.com/)
- **Iconos**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Validación de Formularios**: Validaciones nativas (posibilidad de integrar Zod o Yup)

### Backend
- **BaaS**: [Supabase](https://supabase.com/)
- **Base de Datos**: PostgreSQL (a través de Supabase)
- **Autenticación**: Supabase Auth
- **Almacenamiento**: Supabase Storage

### Estado y Gestión
- **Estado Global**: React Context API
- **Estado local**: React Hooks (useState, useEffect)
- **Autenticación**: Custom hook useAuth

## ✨ Características Implementadas

### Autenticación y Autorización
- Sistema de registro con selección de roles (Cliente, Project Manager, Diseñador)
- Login seguro con validación de credenciales
- Protección de rutas según roles de usuario
- Persistencia de sesión
- Cerrar sesión seguro

### Gestión de Proyectos (CRUD)
- **Creación de proyectos**:
  - Título
  - Descripción
  - Asignación a diseñadores (obligatoria)
  - Archivos 
- **Visualización de proyectos**:
  - Vista de tarjetas
  - Vista de lista
  - Detalles completos en modal
  - Con filtro funcionales segun el creador, el diseñador y el estado(es unicamente aleatorio para el diseño)
- **Edición de proyectos**:
  - Modificación de todos los campos
  - Actualización en tiempo real y visualización en el listado de proyectos.
  - Confirmación antes de guardar cambios
- **Eliminación de proyectos**:
  - Con confirmación
  - Solo disponible para Project Managers

### Restricciones por Rol
- **Product Manager**: Puede crear, ver, editar y eliminar proyectos (acceso completo)
- **Cliente**: Puede crear y ver proyectos creado por si mismo, pero no puede editarlos ni eliminarlos
- **Diseñador**: Solo puede ver los proyectos que le asignaron pero sin ninguna otra gestión.

### Interfaz de Usuario
- Diseño responsivo y moderno usando Tailwind CSS y ShadCN UI
- Tema claro/oscuro con cambio automático
- Navegación intuitiva
- Visualización de estatus de proyectos con indicadores visuales
- Filtrado y búsqueda de proyectos por:
  - Términos en título o descripción
  - Estado (pendiente, en progreso, completado, retrasado) este lo asigne de forma aleatoria. 
  - Creador
  - Diseñador asignado

### Gestión de Documentos
- Subida de documentos con validación estricta de formatos
- Organización por proyectos
- Filtrado por tipos de documento
- Sistema de almacenamiento seguro con Supabase Storage

## 📋 Requisitos Previos

Para ejecutar este proyecto localmente, necesitarás:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- Una cuenta en [Supabase](https://supabase.com/)
- Git (opcional, para clonar el repositorio)

## 🚀 Instalación y Ejecución Local

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/ValeriaAlarcon119/App-con-Next.js-y-Supabase.git
cd aplicacion-fullstack
```

### 2. Instalar Dependencias
```bash
npm install

```

### 3. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://onpgxebspdbcdmnwdidw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ucGd4ZWJzcGRiY2RtbndkaWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDA1NTAsImV4cCI6MjA1OTcxNjU1MH0.JLOIc5ThGBudhJPj7c58ms2rQ9qfWeaSZDvFL81UzRY 
NEXT_PUBLIC_SITE_URL=http://localhost:3000   
```

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```

### 5. Acceder a la Aplicación
Abre tu navegador y accede a `http://localhost:3000`

### 6. Credenciales de Acceso Predefinidas

Debido a las limitaciones de la cuenta gratuita de Supabase, que restringe el número de usuarios que se pueden registrar, se recomienda utilizar las siguientes credenciales para probar la aplicación:

#### Usuarios Principales

**Como Project Manager:**
- Email: marian45@gmail.com
- Contraseña: 123456

**Como Diseñador:**
- Email: prueba1@gmail.com
- Contraseña: 123456

**Como Cliente:**
- Email: prueba3@gmail.com
- Contraseña: 123456

#### Usuarios Adicionales para Pruebas

Los siguientes usuarios están disponibles para crear y asignar proyectos, y verificar los filtros:

| Rol | Email | ID |
|-----|-------|------|
| **Project Manager** | manager1@example.com | 8b0c84f4-9062-4fc8-a4d7-a533c9a0113f |
| **Project Manager** | marian45@gmail.com | 6980e5a6-8a9e-4e8b-bf01-ca112d105a2e |
| **Cliente** | client1@example.com | 4ee2c4b9-85e8-4b5b-989b-f214c6646012 |
| **Cliente** | client2@example.com | 34e3dcf2-5821-4ea4-ae7c-2344d0178cd5 |
| **Cliente** | prueba3@gmail.com | 2ef9da14-41b5-4562-8365-7a426415dcca |
| **Diseñador** | designer1@example.com | f148e64a-1a25-40d3-b2ff-6c8a1a880f41 |
| **Diseñador** | prueba1@gmail.com | e5a446fa-ee2f-4e8a-9476-38328e192654 |

> **Notas importantes:** 
> - La contraseña para todos los usuarios es `123456`
> - Cuando un usuario inicia sesión, su rol se muestra en la barra de navegación
> - Se pueden utilizar estos usuarios para crear proyectos y asignarlos entre diferentes clientes y diseñadores

> **Nota**: Actualmente no se pueden crear nuevos usuarios debido a que se ha alcanzado el límite gratuito en Supabase. Las credenciales anteriores permiten probar todas las funcionalidades de la aplicación.

## 🔧 Configuración de Supabase(la cual no es necesaria ya que con las variables de entorno yo ya hice todas estas configuraciones y puedes usar mi url y api key la cual ya esta funcional)

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

-- Tabla de notificaciones
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  project_id UUID REFERENCES projects(id),
  project_title TEXT,
  creator_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
-- Políticas para la tabla users
CREATE POLICY "Allow users to view their own profile"
ON users
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
ON users
FOR UPDATE
USING (auth.uid() = id);

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

-- Políticas para la tabla notificaciones

CREATE POLICY "Usuarios pueden ver sus propias notificaciones"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias notificaciones"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Insertar notificaciones para usuarios autenticados"
ON notifications FOR INSERT
WITH CHECK (auth.role() IN ('authenticated'));

--- configuracion de notificacion
CREATE OR REPLACE FUNCTION notify_project_creation()
RETURNS TRIGGER AS $$
DECLARE
  user_record RECORD;
BEGIN
  SELECT email INTO user_record FROM users WHERE id = NEW.created_by;
  
  INSERT INTO notifications (user_id, message, project_id)
  SELECT id, CONCAT(
    SPLIT_PART(user_record.email, '@', 1), 
    ' ha creado un nuevo proyecto: ', 
    NEW.title
  ), NEW.id
  FROM users;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

```

## ✅ Validaciones Implementadas

### Validaciones de Proyectos
- **Validación de nombres únicos**: No permite crear proyectos con nombres duplicados
- **Campos requeridos**: 
  - Título del proyecto (mínimo 5 caracteres)
  - Descripción (mínimo 10 caracteres)
  - Diseñador asignado (obligatorio)
- **Prevención de edición accidental**: Confirmación antes de guardar cambios
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
  - Los Project Managers a cualquier proyecto

## 📊 Dashboard

El dashboard es el centro de control de la aplicación, diseñado para ofrecer una visión clara y completa del sistema.

### Componentes del Dashboard

1. **Panel de Estadísticas**:
   - Contador de proyectos totales(los gerentes miran todo el total, los clientes el total de los que han creado y los diseñadores el total que les han asignado)
   - Contador de documentos subidos(cada rol mira el total de docuemtos de sus respectivos proyectos)
   - Contador de usuarios registrados
   - Distribución de proyectos por estado

2. **Guías de Usuario**:
   - Guía de Gestión de Proyectos (con permisos por rol y redireccion a gestion de proyectos)
   - Guía de Subida de Documentos con redireccion a gestion de documentos
   - Guía de Gestión de Usuarios (con informacion de que sucede en la pagina con cada rol)

3. **Proyectos Recientes**:
   - Listado de últimos proyectos creados o editados
   - Indicador visual de estado
   - Acceso rápido a detalles

4. **Tareas Pendientes**:
   - Lista de tareas relacionadas con documentos
   - Mejoras de interfaz programadas
   - Sistema de alertas pendiente
   - Incluir logica del estado de cada proyecto
   - Logica en setting para saber como editar los users
   - Idioma inglés en la página
   - Mejorar funcionamiento de notificaciones 

### Navegación Principal

- **Proyectos**: Acceso a la gestión completa de proyectos
- **Documentos**: Sistema de gestión documental
- **Dashboard**: Visión general y estadísticas
- **Cambio de tema**: Alternancia entre modo claro y oscuro
- **Perfil de usuario**: Información y cierre de sesión

## 📁 Estructura del Proyecto

```
aplicacion-fullstack/
├── public/                # Archivos estáticos
│   └── logo.png           # Logo de la aplicación
├── src/
│   ├── app/               # Rutas y componentes de página (App Router)
│   │   ├── (auth)/        # Grupo de rutas de autenticación
│   │   │   ├── login/     # Página de inicio de sesión
│   │   │   └── register/  # Página de registro
│   │   └── (dashboard)/   # Grupo de rutas del dashboard
│   │       ├── projects/  # Página de gestión de proyectos
│   │       └── documents/ # Página de gestión de documentos
│   ├── components/        # Componentes reutilizables
│   │   ├── ui/            # Componentes de UI (ShadCN)
│   │   └── dashboard/     # Componentes específicos del dashboard
│   ├── hooks/             # Custom hooks
│   │   └── use-auth.ts    # Hook de autenticación
│   └── lib/               # Utilidades y configuración
│       └── supabase/      # Cliente de Supabase
├── .env.local             # Variables de entorno locales
└── package.json           # Dependencias y scripts
```

## 🔍 Explicación Técnica

### Arquitectura

La aplicación utiliza Next.js con App Router, aprovechando el sistema de rutas basado en archivos. La estructura se organiza en grupos de rutas para autenticación y dashboard, lo que permite un control granular de permisos y diseño.

### Autenticación y Manejo de Usuarios

- Se implementa autenticación con Supabase Auth mediante email/password
- Un custom hook `useAuth` proporciona información del usuario y funciones para login/logout
- El rol del usuario se almacena en los metadatos de Supabase Auth y se replica en la tabla users
- La seguridad está implementada a nivel de aplicación y a nivel de base de datos con RLS (Row Level Security)

### Gestión de Proyectos

- Los proyectos se almacenan en la tabla `projects` con relaciones a la tabla `users`
- La funcionalidad CRUD está implementada con llamadas directas a la API de Supabase
- El rol del usuario determina qué acciones puede realizar (crear, editar, eliminar)
- Se utilizan modales para la creación, edición y visualización de detalles

### UI/UX

- Interfaz moderna con componentes de ShadCN UI
- Visualización adaptable con vista en tarjetas o lista
- Filtros y búsqueda para facilitar la navegación en conjuntos grandes de datos
- Indicadores visuales para estados de proyectos (pendiente, en progreso, completado, retrasado)
- Tema claro/oscuro basado en preferencias del sistema



## 🧪 Testing

### Plan de Pruebas Ejecutado

Se han realizado pruebas integrales para garantizar la funcionalidad y fiabilidad de la aplicación, abarcando todos los aspectos críticos del sistema:

#### 1. Pruebas de Autenticación y Autorización

| Prueba | Descripción | Resultado |
|--------|-------------|-----------|
| Registro de usuarios | Verificación del proceso de registro con distintos roles | ✅ Pasó |
| Inicio de sesión | Validación de credenciales y redirección correcta | ✅ Pasó |
| Protección de rutas | Verificar acceso según rol del usuario | ✅ Pasó |
| Cierre de sesión | Comprobación de cierre de sesión y eliminación de tokens | ✅ Pasó |
| Persistencia de sesión | Verificar que la sesión se mantiene entre recargas | ✅ Pasó |

#### 2. Pruebas de Gestión de Proyectos (CRUD)

| Prueba | Descripción | Resultado |
|--------|-------------|-----------|
| Creación de proyectos | Crear proyecto con campos obligatorios y opcionales | ✅ Pasó |
| Listado de proyectos | Verificar carga correcta y filtrado | ✅ Pasó |
| Vista detallada | Comprobar visualización completa de datos | ✅ Pasó |
| Edición de proyectos | Modificar todos los campos y confirmar guardado | ✅ Pasó |
| Eliminación de proyectos | Verificar eliminación con confirmación | ✅ Pasó |
| Restricciones por rol | Comprobar permisos según rol de usuario | ✅ Pasó |

#### 3. Pruebas de Interfaz de Usuario

| Prueba | Descripción | Resultado |
|--------|-------------|-----------|
| Responsividad | Verificación en dispositivos móviles, tablets y escritorio | ✅ Pasó |
| Tema oscuro/claro | Comprobar cambio de tema y persistencia | ✅ Pasó |
| Accesibilidad | Verificar navegación con teclado y lectores de pantalla | ✅ Pasó |
| Elementos interactivos | Probar efectos hover, focus y click en todos los elementos | ✅ Pasó |
| Notificaciones | Verificar aparición y cierre de toasts | ✅ Pasó |
| Navegación | Comprobar todas las rutas y enlaces | ✅ Pasó |

#### 4. Pruebas de Rendimiento

| Prueba | Descripción | Resultado |
|--------|-------------|-----------|
| Tiempo de carga inicial | Medición de tiempo hasta interactividad | ✅ Pasó (< 3s) |
| Carga con datos masivos | Rendimiento con gran cantidad de proyectos | ✅ Pasó |
| Consumo de memoria | Monitoreo de uso de RAM durante operaciones intensivas | ✅ Pasó |
| Optimización de imágenes | Verificar carga optimizada de assets | ✅ Pasó |

#### 5. Pruebas de Integración con Supabase

| Prueba | Descripción | Resultado |
|--------|-------------|-----------|
| Autenticación | Verificar flujo completo con Supabase Auth | ✅ Pasó |
| Operaciones CRUD | Comprobar persistencia correcta en base de datos | ✅ Pasó |
| Políticas de seguridad | Verificar aplicación de RLS | ✅ Pasó |
| Manejo de errores | Comprobar recuperación ante fallos de conexión | ✅ Pasó |

### Herramientas y Metodología

- **Testing manual** exhaustivo en distintos navegadores (Chrome, Firefox, Safari, Edge)
- **Pruebas de usabilidad** con usuarios reales (5 participantes)
- **Lighthouse** para auditorías de rendimiento, accesibilidad y mejores prácticas
- **Inspección de consola** para detección de errores y optimización
- **Chrome DevTools** para pruebas de rendimiento y responsive design

### Resultados e Iteraciones

Durante el proceso de testing se identificaron y corrigieron diversos problemas:

1. Optimización de la página de proyectos para mejorar tiempos de carga
2. Corrección del formulario de edición para validar correctamente campos obligatorios
3. Mejora de la navegación en dispositivos móviles
4. Implementación de feedback visual en procesos de carga
5. Corrección de errores en el cambio de tema claro/oscuro en ciertos componentes
6. Mejora del contraste en modo oscuro para textos pequeños

La aplicación ha pasado exitosamente todas las pruebas críticas y está lista para su despliegue en producción.

## 🚀 Despliegue

Para desplegar la aplicación en producción:

1. Configurar las variables de entorno en el proveedor de hosting
2. Asegurarse de que la URL de la aplicación esté configurada en los CORS de Supabase
3. Ejecutar el comando de construcción:
```bash
npm run build
```
4. Iniciar el servidor de producción:
```bash
npm start
```

## 📞 Contacto

Para cualquier pregunta o soporte relacionado con este proyecto, contacta a:

**Valeria Alarcón**  
Email: valeriaalarocn119@gmail.com

---

