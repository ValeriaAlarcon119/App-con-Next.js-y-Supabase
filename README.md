# Grayola Premium - Plataforma de Gestión de Diseño as a Service (DaaS)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://appfullstack.netlify.app)

Esta es una aplicación fullstack empresarial diseñada para la gestión ágil de proyectos de diseño, optimizando la colaboración entre directores, creativos y clientes finales.

🔗 **[Acceder a la Plataforma en Producción (Netlify)](https://appfullstack.netlify.app)**

---

## 📋 Tabla de Contenidos
- [Propuesta de Valor](#-propuesta-de-valor)
- [Arquitectura y Stack Tecnológico](#-arquitectura-y-stack-tecnológico)
- [Gestión de Roles y Seguridad (RLS)](#-gestión-de-roles-y-seguridad-rls)
- [Experiencia de Usuario (UI/UX)](#-experiencia-de-usuario-uiux)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Credenciales de Acceso (Demo)](#-credenciales-de-acceso-demo)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Roadmap de Desarrollo](#-roadmap-de-desarrollo)

---

## 🎯 Propuesta de Valor

Grayola democratiza el acceso a servicios de diseño de alta calidad mediante un modelo de suscripción eficiente. A diferencia de agencias tradicionales, Grayola ofrece:
- **Colaboración Centralizada**: Todo el flujo de trabajo (brief, diseño, revisión) ocurre en un solo lugar.
- **Roles Definidos**: Permisos granulados para asegurar que cada parte vea solo lo que necesita.
- **Gestión Documental**: Repositorio seguro para assets de diseño vinculados a proyectos específicos.

---

## 🛠 Arquitectura y Stack Tecnológico

La aplicación ha sido construida siguiendo los estándares más modernos de desarrollo web para garantizar escalabilidad y rendimiento:

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) con App Router para renderizado optimizado por el servidor.
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) para un desarrollo robusto y tipado estricto.
- **Estética (UI)**: [Tailwind CSS](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/) + Dark Mode nativo.
- **Animaciones**: Micro-interacciones con Framer Motion y transiciones suaves de CSS.

### Backend & Seguridad
- **BaaS**: [Supabase](https://supabase.com/) para gestión de base de datos, auth y storage.
- **Data Layer**: PostgreSQL bajo políticas de **Row Level Security (RLS)**.
- **Auth**: Supabase Auth con soporte para metadatos personalizados de roles.
- **Storage**: Amazon S3 (vía Supabase) para almacenamiento de archivos pesados de diseño.

---

## 🛡 Gestión de Roles y Seguridad (RLS)

La seguridad es el núcleo de Grayola. Los datos están protegidos a nivel de base de datos, lo que significa que un usuario no puede acceder a información que no le pertenece, incluso si intenta manipular el frontend.

| Rol | Alcance de Permisos | Visibilidad de Datos |
|-----|-------------------|----------------------|
| **Project Manager** | Gestión total (CRUD) | Proyectos totales, usuarios y documentos globales. |
| **Diseñador** | Colaboración y Avances | Solo proyectos donde está explícitamente asignado. |
| **Cliente** | Solicitud y Revisión | Solo proyectos que él mismo ha creado. |

> **Nota Técnica**: El sistema utiliza políticas de Supabase RLS vinculadas al `auth.uid()`, garantizando que las consultas SQL solo devuelvan los registros permitidos para el usuario autenticado.

---

## ✨ Experiencia de Usuario (UI/UX)

La plataforma cuenta con una interfaz **Premium SaaS** diseñada para la claridad visual:
- **Dashboard Dinámico**: Estadísticas en tiempo real basadas en el rol del usuario conectado.
- **Vistas Duales**: Los proyectos se pueden visualizar en formato de tarjetas (Gallery) o Lista, adaptándose a la preferencia del usuario.
- **Feedback Continuo**: Sistema de notificaciones integradas para avisar sobre nuevos proyectos o cambios de estado.
- **Diseño Adaptativo**: Experiencia optimizada para móviles, tablets y monitores ultrawide.

---

## 🚀 Instalación y Configuración

Si deseas ejecutar este proyecto localmente:

### 1. Requisitos Previos
- Node.js v18+
- Un proyecto en Supabase con las tablas configuradas.

### 2. Clonado e Instalación
```bash
git clone https://github.com/ValeriaAlarcon119/App-con-Next.js-y-Supabase.git
cd aplicacion-fullstack
npm install
```

### 3. Variables de Entorno
Crea un archivo `.env.local` con las siguientes llaves (idénticas a las del despliegue en Netlify):
```env
NEXT_PUBLIC_SUPABASE_URL=https://qlrenpzpcwzbztnrzbfw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Lanzamiento
```bash
npm run dev
```

---

## 🔐 Credenciales de Acceso (Demo)

Para facilitar la revisión por parte de reclutadores y entusiastas, la aplicación cuenta con botones de **Auto-llenado** en la página de Login con los siguientes perfiles:

| Perfil | Email | Contraseña |
|-----|-------|------|
| **Project Manager** | `marian45@gmail.com` | `password123` |
| **Diseñador** | `designer3@grayola.com` | `password123` |
| **Cliente Externo** | `prueba1@gmail.com` | `password123` |

*Accede a [login](https://appfullstack.netlify.app/login) para probar la experiencia de cada rol.*

---

## 📁 Estructura del Proyecto

```
src/
├── app/               # App Router: Rutas, Layouts y Server Components
│   ├── (auth)/        # Login, Registro y Lógica de acceso
│   └── (dashboard)/   # Gestión de Proyectos, Documentos y Análisis
├── components/        # UI Atoms & Complex Molecules (Cards, Forms, Nav)
├── hooks/             # use-auth, use-projects y utilidades reactivas
├── lib/               # Configuración de Supabase Client y Helpers de Utils
└── storage/           # Lógica para la gestión de archivos en la nube
```

---

## 📅 Roadmap de Desarrollo

- [x] Implementación core de CRUD de Proyectos.
- [x] Gestión de Documentos vinculada a Proyectos.
- [x] Seguridad RLS robusta en Supabase.
- [x] Diseño Premium SaaS Responsivo.
- [ ] Implementación de Dashboards con gráficas avanzadas.
- [ ] Sistema de comentarios real-time en proyectos.
- [ ] Integración con Slack/WhatsApp para notificaciones de diseño.

---

## 📧 Contacto

Desarrollado con pasión por el diseño y la tecnología:

**Valeria Alarcón**  
*Front-end & Product Developer*  
📩 [valeriaalarocn119@gmail.com](mailto:valeriaalarocn119@gmail.com)  
🌎 [LinkedIn Portfolio](https://www.linkedin.com/in/valeria-alarcon-andrade-45663a233/)
