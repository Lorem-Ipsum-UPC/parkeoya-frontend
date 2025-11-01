# 🚗 ParkeoYa - Frontend

Sistema web para la gestión de estacionamientos con integración IoT, reservas en tiempo real y panel de administración completo.

## 📋 Descripción

ParkeoYa es una plataforma moderna que conecta a propietarios de estacionamientos con conductores, permitiendo la gestión eficiente de espacios de estacionamiento a través de tecnología IoT. El frontend está construido con Next.js 15 y ofrece una interfaz intuitiva y responsiva para administradores de estacionamientos.

### ✨ Características Principales

- 🔐 **Autenticación y Autorización**: Sistema completo de registro e inicio de sesión con roles
- 📊 **Dashboard Interactivo**: Panel de control con métricas en tiempo real
- 🏢 **Onboarding Guiado**: Proceso paso a paso para configurar nuevos estacionamientos
- 🌐 **Gestión IoT**: Monitoreo y control de espacios de estacionamiento en tiempo real
- 📅 **Sistema de Reservas**: Administración completa de reservas y disponibilidad
- 💰 **Módulo Financiero**: Reportes de ingresos, tarifas y comisiones
- ⭐ **Sistema de Reseñas**: Gestión de comentarios y calificaciones
- ⚙️ **Configuración Personalizable**: Ajustes de perfil, tarifas y horarios
- 🎨 **UI Moderna**: Diseño basado en shadcn/ui con Tailwind CSS
- 🌙 **Modo Oscuro**: Soporte completo para tema claro y oscuro

## � Instalación y Configuración

### Prerrequisitos

Asegúrate de tener instalado:
- **Node.js** 18.x o superior
- **npm** o **pnpm** (recomendado)
- **Git**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Lorem-Ipsum-UPC/parkeoya-frontend.git
cd parkeoya-frontend
```

### 2. Instalar Dependencias

Usando npm:
```bash
npm install
```

O usando pnpm (recomendado):
```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:8080

# Otras configuraciones opcionales
NEXT_PUBLIC_APP_NAME=ParkeoYa
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**⚠️ Importante:** Asegúrate de que el backend esté corriendo en `http://localhost:8080` o ajusta la URL según tu configuración.

### 4. Ejecutar en Modo Desarrollo

```bash
npm run dev
```

O con pnpm:
```bash
pnpm dev
```

La aplicación estará disponible en: **http://localhost:3000**

### 5. Compilar para Producción

```bash
npm run build
npm start
```

## 🏗️ Arquitectura

### Stack Tecnológico

**Frontend Framework:**
- ⚛️ **Next.js 15**: Framework de React con App Router
- ⚛️ **React 19**: Biblioteca de interfaz de usuario
- 📘 **TypeScript**: Tipado estático

**Estilos:**
- 🎨 **Tailwind CSS 4**: Framework de CSS utility-first
- 🎭 **shadcn/ui**: Componentes de UI accesibles y personalizables
- 🎨 **Lucide React**: Iconos modernos

**Gestión de Estado:**
- 🔄 **React Context**: Para estado de onboarding
- 🪝 **Custom Hooks**: Para lógica reutilizable

**Gráficos:**
- 📊 **Recharts**: Gráficos y visualizaciones de datos

**Calidad de Código:**
- ✅ **ESLint**: Linting de código
- 💅 **Prettier**: Formateo de código

### Estructura del Proyecto

```
parkeoya-frontend/
├── app/                          # App Router de Next.js 15
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout raíz
│   ├── page.tsx                 # Página principal
│   ├── login/                   # Página de inicio de sesión
│   ├── registro/                # Página de registro
│   ├── onboarding/              # Flujo de configuración inicial
│   │   ├── layout.tsx           # Layout compartido con contexto
│   │   ├── informacion-basica/ # Step 1: Información básica
│   │   ├── ubicacion/           # Step 2: Ubicación
│   │   ├── capacidad/           # Step 3: Capacidad
│   │   ├── tarifas/             # Step 4: Tarifas
│   │   └── horarios/            # Step 5: Horarios
│   └── dashboard/               # Panel de administración
│       ├── page.tsx             # Vista general
│       ├── espacios/            # Gestión de espacios IoT
│       ├── reservas/            # Gestión de reservas
│       ├── finanzas/            # Reportes financieros
│       ├── resenas/             # Gestión de reseñas
│       └── configuracion/       # Configuración
├── components/                   # Componentes React
│   ├── forms/                   # Componentes de formularios
│   │   ├── login-form.tsx
│   │   ├── registration-form.tsx
│   │   └── protected-route.tsx
│   ├── layouts/                 # Layouts reutilizables
│   │   └── dashboard-layout.tsx
│   ├── pages/                   # Componentes de páginas
│   │   ├── dashboard-overview.tsx
│   │   ├── space-management.tsx
│   │   └── ...
│   ├── steps/                   # Componentes de onboarding
│   │   ├── basic-info-step.tsx
│   │   ├── location-step.tsx
│   │   └── ...
│   └── ui/                      # Componentes de UI (shadcn/ui)
│       ├── button.tsx
│       ├── input.tsx
│       └── ... (50+ componentes)
├── hooks/                       # Custom React Hooks
│   ├── use-auth.ts             # Hook de autenticación
│   └── use-toast.ts            # Hook de notificaciones
├── lib/                         # Utilidades y configuración
│   ├── api/                    # Cliente API
│   │   ├── client.ts           # Configuración de fetch
│   │   ├── types.ts            # Tipos TypeScript
│   │   └── index.ts            # Exportaciones
│   ├── auth.ts                 # Funciones de autenticación
│   └── utils.ts                # Utilidades generales
├── styles/                      # Estilos CSS
│   └── globals.css             # Variables CSS y Tailwind
└── public/                      # Archivos estáticos
```

## 📝 Scripts disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Compila la aplicación para producción
npm run start    # Inicia el servidor de producción
npm run lint     # Ejecuta el linter
npm run format   # Formatea el código con Prettier
```

## 🎨 Paleta de Colores

El proyecto utiliza una paleta de colores personalizada:

- **Azul Principal** (`#1295c0`): Color primario de la aplicación
- **Verde Éxito** (`#34ca69`): Indicadores de éxito
- **Amarillo Warning** (`#FFC107`): Alertas y warnings
- **Rojo Danger** (`#DC3545`): Errores y acciones destructivas
- **Gris Secundario** (`#6C757D`): Elementos secundarios

Los colores están configurados en:
- `tailwind.config.ts`: Configuración de Tailwind
- `styles/globals.css`: Variables CSS (modo claro y oscuro)

## 🔐 Autenticación

### Flujo de Autenticación

1. **Registro**: Usuario completa formulario con datos personales y de empresa
2. **Validación**: Se validan RUC (11 dígitos), teléfono (9 dígitos), contraseñas
3. **Creación de Cuenta**: Se crea usuario y perfil en el backend
4. **Auto-login**: Inicio de sesión automático tras registro
5. **Onboarding**: Redirección al flujo de configuración inicial
6. **Dashboard**: Acceso al panel tras completar onboarding

### Rutas Protegidas

Las rutas protegidas usan el componente `ProtectedRoute`:
- Verifica token de autenticación
- Redirige al login si no está autenticado
- Carga perfil del usuario

## 🛣️ Rutas Principales

| Ruta | Descripción | Protegida |
|------|-------------|-----------|
| `/` | Página de inicio | ❌ |
| `/login` | Inicio de sesión | ❌ |
| `/registro` | Registro de usuarios | ❌ |
| `/onboarding/*` | Configuración inicial (5 steps) | ✅ |
| `/dashboard` | Panel de administración | ✅ |
| `/dashboard/espacios` | Gestión de espacios IoT | ✅ |
| `/dashboard/reservas` | Gestión de reservas | ✅ |
| `/dashboard/finanzas` | Reportes financieros | ✅ |
| `/dashboard/resenas` | Gestión de reseñas | ✅ |
| `/dashboard/configuracion` | Configuración | ✅ |

## 🎯 Flujo de Onboarding

El proceso de onboarding guía a nuevos usuarios a través de 5 pasos:

1. **Información Básica**: Nombre y descripción del estacionamiento
2. **Ubicación**: Dirección completa y coordenadas
3. **Capacidad**: Total de espacios y distribución
4. **Tarifas**: Precios por hora, día y mes
5. **Horarios**: Días y horas de operación

**Características:**
- Estado compartido entre pasos (React Context)
- Navegación con botones anterior/siguiente
- Validación en cada paso
- Indicador visual de progreso
- Redirección automática al dashboard al completar

## 🔌 Integración con Backend

### Endpoints Principales

```typescript
// Autenticación
POST /api/v1/authentication/sign-up/parking-owner
POST /api/v1/authentication/sign-in

// Usuarios
GET /api/v1/users
GET /api/v1/users/:id

// Perfiles
GET /api/v1/profiles/parking-owner/:userId

// Estacionamientos
POST /api/v1/parkings
GET /api/v1/parkings/:id
PUT /api/v1/parkings/:id
```

### Cliente API

El proyecto incluye un cliente API robusto (`lib/api/client.ts`) con:
- Manejo automático de autenticación (Bearer token)
- Gestión centralizada de errores
- Logging para debugging
- Tipos TypeScript para todas las peticiones

## 📦 Dependencias Principales

```json
{
  "next": "15.2.4",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^4.0.0",
  "lucide-react": "^0.469.0",
  "recharts": "^2.15.0",
  "date-fns": "^4.1.0"
}
```

## 🎨 Convenciones de código

- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Archivos**: kebab-case (`user-profile.tsx`)
- **Funciones/Variables**: camelCase (`getUserData`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Uso de 'use client'**: Solo en componentes que usan hooks o eventos del navegador

## 🔧 Configuración

El proyecto incluye configuraciones pre-establecidas para:

- **ESLint**: Reglas de Next.js y TypeScript
- **Prettier**: Formateo consistente con line-ending LF
- **TypeScript**: Paths configurados (`@/` para imports absolutos)
- **Tailwind CSS**: Variables personalizadas y modo oscuro

## 🌐 Características Responsivas

- **Mobile First**: Diseño optimizado para móviles
- **Sidebar Colapsable**: En móviles, sidebar con overlay
- **Grid Adaptable**: Layouts que se ajustan según pantalla
- **Touch Friendly**: Elementos táctiles optimizados

## 🧪 Desarrollo

### Agregar Componentes UI

Para agregar componentes de shadcn/ui:

```bash
npx shadcn@latest add [component-name]
```

Ejemplos:
```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add dialog
```

## 🐛 Solución de Problemas

### Error: "Column 'created_at' cannot be null"
**Solución**: Los timestamps se agregan automáticamente en el frontend (`hooks/use-auth.ts`). Asegúrate de que el backend los acepte o configura generación automática en el backend.

### Error: Cannot find module '@/...'
**Solución**: Verifica que `tsconfig.json` tenga configurado el path `@/*`.

### Servidor no inicia
**Solución**: 
1. Verifica que Node.js sea versión 18+
2. Elimina `node_modules` y `.next`
3. Reinstala dependencias: `npm install`
4. Ejecuta `npm run dev`


