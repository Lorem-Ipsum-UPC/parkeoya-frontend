# 🔧 Configuración de Entornos - Parkeoya Frontend

## 📋 Archivos de Entorno

Este proyecto usa diferentes archivos `.env` según el entorno:

### Archivos disponibles:

1. **`.env.example`** - Plantilla con todas las variables (commiteado en Git)
2. **`.env.development.local`** - Desarrollo local (NO commiteado)
3. **`.env.local`** - Sobreescribe en todos los entornos (NO commiteado)
4. **`.env.production.local`** - Build de producción local (NO commiteado)

## 🚀 Configuración según tu caso de uso

### 1️⃣ Desarrollo Local (Frontend + Backend Local)

**Usa:** `.env.development.local`

```bash
# Crea este archivo:
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.development.local
```

Luego ejecuta:
```bash
npm run dev
```

✅ El frontend apuntará a `http://localhost:8080`  
✅ Necesitas tener el backend corriendo localmente

---

### 2️⃣ Desarrollo Local + Backend de Producción

**Usa:** `.env.local`

```bash
# Ya existe con:
NEXT_PUBLIC_API_URL=https://parkeoya-backend-latest-1.onrender.com
```

Luego ejecuta:
```bash
npm run dev
```

✅ El frontend apuntará al backend en Render (producción)  
⚠️ Estarás trabajando con datos de producción

---

### 3️⃣ Build de Producción (Vercel)

**Vercel configurará automáticamente:**
- En el dashboard de Vercel, agrega la variable de entorno:
  - `NEXT_PUBLIC_API_URL` = `https://parkeoya-backend-latest-1.onrender.com`

O bien, el código tiene un fallback en `lib/api/client.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  'https://parkeoya-backend-latest-1.onrender.com'
```

---

## 🔍 Prioridad de Archivos

Next.js carga los archivos `.env` en este orden (el último sobreescribe):

1. `.env`
2. `.env.local`
3. `.env.development` / `.env.production` (según NODE_ENV)
4. `.env.development.local` / `.env.production.local`

---

## 🎯 Resumen Rápido

| Escenario | Archivo a usar | Backend que usa |
|-----------|---------------|----------------|
| Desarrollo local completo | `.env.development.local` | `localhost:8080` |
| Desarrollo local + API producción | `.env.local` | Render |
| Producción (Vercel) | Variables de Vercel | Render |

---

## ⚠️ Importante

- ✅ **NUNCA** subas archivos `.env*` a Git (excepto `.env.example`)
- ✅ El `.gitignore` ya excluye todos los `.env*`
- ✅ Cada desarrollador debe crear su propio `.env.development.local`
- ✅ En producción, configura las variables en el dashboard de Vercel

---

## 🐛 Troubleshooting

### Problema: "Me salta directo al dashboard sin registrar estacionamiento"

**Causa:** Estás usando `.env.local` que apunta a producción, y en producción ya tienes estacionamientos.

**Solución:**
1. Crea `.env.development.local` con `NEXT_PUBLIC_API_URL=http://localhost:8080`
2. Asegúrate de tener el backend corriendo en `localhost:8080`
3. Reinicia el frontend: `npm run dev`

### Problema: "Error de conexión al API"

**Verifica:**
1. ¿Qué archivo `.env` estás usando?
2. ¿El backend está corriendo en esa URL?
3. ¿Hay errores CORS? (revisa la consola del navegador)

Para ver qué URL está usando:
```bash
# En desarrollo
echo $NEXT_PUBLIC_API_URL

# O revisa en el navegador (F12 > Console):
console.log(process.env.NEXT_PUBLIC_API_URL)
```

---

## 📚 Referencias

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
