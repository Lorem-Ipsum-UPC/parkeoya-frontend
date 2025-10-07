# Parkeoya Frontend

Una plataforma moderna para la gestión y reserva de espacios de estacionamiento.

## 🚀 Tecnologías

- **Framework**: Next.js 15
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: Radix UI
- **Formularios**: React Hook Form + Zod
- **Estado**: React Context / Zustand (próximo)
- **Base de datos**: (Por definir)

## 📦 Instalación

```bash
# Clonar el repositorio
git clone [URL_DEL_REPO]
cd parkeoya-frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## 🏗️ Estructura del proyecto

```
├── app/                    # App Router de Next.js
│   ├── dashboard/         # Páginas del dashboard
│   ├── auth/             # Páginas de autenticación
│   └── onboarding/       # Proceso de onboarding
├── components/           # Componentes React
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── auth/            # Componentes de autenticación
│   ├── dashboard/       # Componentes del dashboard
│   └── onboarding/      # Componentes de onboarding
├── hooks/               # Custom React hooks
├── lib/                 # Utilidades y configuraciones
├── types/               # Definiciones de tipos TypeScript
└── styles/              # Estilos globales
```

## 📝 Scripts disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Ejecutar ESLint
- `npm run lint:fix` - Corregir errores de ESLint
- `npm run format` - Formatear código con Prettier
- `npm run type-check` - Verificar tipos TypeScript

## 🎨 Convenciones de código

- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Archivos**: kebab-case (`user-profile.tsx`)
- **Funciones/Variables**: camelCase (`getUserData`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)

## 🔧 Configuración

El proyecto incluye configuraciones pre-establecidas para:

- ESLint con reglas de Next.js y TypeScript
- Prettier para formateo consistente
- TypeScript con paths configurados
- Tailwind CSS con componentes personalizados

## 🚧 Estado del desarrollo

Este proyecto está en desarrollo activo. Las funcionalidades principales incluyen:

- ✅ Estructura base del proyecto
- ✅ Configuración de herramientas de desarrollo
- 🔄 Sistema de autenticación
- 🔄 Dashboard para propietarios
- 🔄 Sistema de reservas
- 🔄 Gestión de espacios
- ⏳ Pasarela de pagos
- ⏳ Sistema de notificaciones

## 📄 Licencia

[Tipo de licencia por definir]
