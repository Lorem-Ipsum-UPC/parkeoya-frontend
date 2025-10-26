# 🔧 Troubleshooting - Problemas Detectados

## ❌ Problema 1: Formulario de registro muestra campos antiguos

### Síntoma
El formulario muestra:
- "Miguel Castro" (campo name)
- "+593 99 999 9999" (teléfono con código país)
- "Mínimo 8 caracteres" (contraseña)
- **Faltan**: city, country, companyName, ruc

### Causa
**Caché del navegador** está mostrando la versión anterior del formulario.

### Solución
1. **Limpiar caché del navegador**: Ctrl + Shift + R (Windows/Linux) o Cmd + Shift + R (Mac)
2. **Cerrar completamente el navegador** y volver a abrir
3. **Borrar caché manualmente**:
   - Chrome: DevTools → Application → Clear Storage → Clear site data
   - Firefox: Ctrl+Shift+Delete → Seleccionar "Cached Web Content"

### Verificación
El formulario actualizado debe mostrar estos campos EN ESTE ORDEN:
1. ✅ **Email** (Correo Electrónico)
2. ✅ **Password** (Contraseña) - Grid 2 columnas
3. ✅ **Confirm Password** (Confirmar Contraseña) - Grid 2 columnas
4. ✅ **Full Name** (Nombre Completo)
5. ✅ **City** (Ciudad) - Grid 2 columnas
6. ✅ **Country** (País) - Grid 2 columnas
7. ✅ **Phone** (Teléfono) - placeholder: "987654321", pattern: 9 dígitos
8. ✅ **Company Name** (Nombre de Empresa)
9. ✅ **RUC** - placeholder: "20123456789", pattern: 11 dígitos

---

## ❌ Problema 2: Los datos no se guardan en la BD

### Posibles Causas

#### A) Backend no está recibiendo las peticiones (CORS)

**Síntomas:**
- No aparecen logs en el terminal del backend cuando haces submit
- Error en DevTools Console: `Access to fetch at 'http://localhost:8080' has been blocked by CORS policy`

**Solución - Agregar CORS en Spring Boot:**

```java
// Crear archivo: src/main/java/upc/edu/pe/parkeoya/backend/shared/configuration/WebConfig.java
package upc.edu.pe.parkeoya.backend.shared.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:3001")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

Después reinicia el backend:
```bash
cd parkeoya-backend
# Detener con Ctrl+C
set -o allexport; source .env; set +o allexport
mvn spring-boot:run
```

#### B) Frontend usando URL incorrecta

**Verificar:**
```bash
cat frontend/.env.local
```

Debe contener:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Si cambias `.env.local`, **DEBES reiniciar** el servidor de Next.js:
```bash
# Detener con Ctrl+C
npm run dev
```

#### C) El backend está caído

**Verificar:**
```bash
# En Git Bash, desde parkeoya-backend/
ps aux | grep java

# O verificar manualmente en el navegador:
http://localhost:8080/swagger-ui/index.html
```

Si no funciona, iniciar backend:
```bash
cd parkeoya-backend
set -o allexport; source .env; set +o allexport
mvn spring-boot:run
```

---

## ❌ Problema 3: Error en `/onboarding/horarios`

### Síntoma
```
Application error: a client-side exception has occurred
```

### Causa Probable
`ProtectedRoute` está tratando de acceder a `localStorage` en el servidor (SSR).

### Solución - Verificar ProtectedRoute

```tsx
// components/forms/protected-route.tsx debe tener:
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return <>{children}</>
}
```

**IMPORTANTE:** El archivo DEBE tener `'use client'` al inicio.

---

## ❌ Problema 4: Onboarding no guarda datos del estacionamiento

### Causa
**No existe integración con el backend** para guardar los datos del estacionamiento.

### Endpoints Necesarios (Verificar en Backend)

#### ¿Existe POST /api/v1/parkings?

Verificar en Swagger: http://localhost:8080/swagger-ui/index.html

**Si NO existe:**
1. Crear entidad `Parking` en el backend
2. Crear repositorio, servicio y controlador
3. Endpoint debe recibir:
```json
{
  "name": "string",
  "description": "string",
  "address": "string",
  "city": "string",
  "province": "string",
  "zipCode": "string",
  "totalSpaces": 50,
  "hourlyRate": 2.5,
  "dailyRate": 15,
  "monthlyRate": 200,
  "schedule": {
    "monday": { "enabled": true, "start": "08:00", "end": "20:00" },
    ...
  },
  "parkingOwnerId": 1
}
```

**Si SÍ existe:**
Integrar en el frontend creando:
- `lib/api/types.ts` - Agregar interfaz `ParkingData`
- `lib/api/client.ts` - Agregar método `createParking(data)`
- `app/onboarding/layout.tsx` - Llamar al API en `handleNext()` del último paso

---

## 🧪 Cómo Probar Todo el Flujo

### 1. Verificar Backend
```bash
cd parkeoya-backend
set -o allexport; source .env; set +o allexport
mvn spring-boot:run

# Debe mostrar:
# Started ParkeoyaApplication in X.XXX seconds
```

### 2. Verificar Frontend
```bash
cd frontend
npm run dev

# Debe mostrar:
# Ready in XXXX ms
# Local: http://localhost:3000 (o 3001)
```

### 3. Limpiar Caché y Probar Registro

1. Abrir http://localhost:3000/register (o 3001)
2. **Ctrl + Shift + R** para limpiar caché
3. **Abrir DevTools** (F12) → Tab "Console"
4. **Abrir DevTools** → Tab "Network" → Filter "Fetch/XHR"
5. Llenar formulario:
   ```
   Email: test@example.com
   Password: 123
   Confirm Password: 123
   Nombre Completo: Juan Pérez
   Ciudad: Lima
   País: Perú
   Teléfono: 987654321 (9 dígitos)
   Nombre de Empresa: Estacionamientos ABC
   RUC: 20123456789 (11 dígitos)
   ```
6. Aceptar términos
7. Click "Crear Cuenta"

### 4. Verificar en DevTools Network

Debes ver 3 peticiones:
1. **POST** `http://localhost:8080/api/v1/authentication/sign-up/parking-owner`
   - Status: 201 Created
   - Response: `{ id, email, roles }`

2. **POST** `http://localhost:8080/api/v1/authentication/sign-in`
   - Status: 200 OK
   - Response: `{ id, email, token, roles }`

3. **GET** `http://localhost:8080/api/v1/profiles/parking-owner/{userId}`
   - Status: 200 OK
   - Response: `{ userId, parkingOwnerId, fullName, city, country, phone, companyName, ruc }`

Si ves errores **CORS**, aplica la solución del Problema 2A.

### 5. Verificar en Base de Datos

```sql
-- Conectar a MySQL
mysql -u root -p

USE parkeoya;

-- Ver usuario creado
SELECT * FROM users ORDER BY id DESC LIMIT 1;

-- Ver rol asignado
SELECT * FROM user_roles WHERE user_id = (SELECT MAX(id) FROM users);

-- Ver perfil de parking owner
SELECT * FROM parking_owners ORDER BY id DESC LIMIT 1;
```

Debe mostrar:
- **users**: email, password (hash), created_at (no NULL)
- **user_roles**: user_id, role_id
- **parking_owners**: user_id, full_name, city, country, phone, company_name, ruc

---

## 🔍 Checklist de Diagnóstico

Marca lo que funciona:

- [ ] Backend está corriendo (puerto 8080)
- [ ] Frontend está corriendo (puerto 3000 o 3001)
- [ ] Swagger accesible: http://localhost:8080/swagger-ui/index.html
- [ ] `.env.local` existe en `frontend/` con `NEXT_PUBLIC_API_URL=http://localhost:8080`
- [ ] Formulario de registro muestra **9 campos** (no 5)
- [ ] DevTools Network muestra las 3 peticiones al backend
- [ ] No hay errores CORS en la consola
- [ ] Base de datos tiene el usuario registrado
- [ ] Base de datos tiene el perfil parking_owner
- [ ] Login funciona con las mismas credenciales
- [ ] Redirección a `/dashboard` exitosa

---

## 📞 Si Nada Funciona

1. **Reiniciar TODO:**
   ```bash
   # Terminal 1 - Backend
   cd parkeoya-backend
   # Ctrl+C para detener
   set -o allexport; source .env; set +o allexport
   mvn clean install
   mvn spring-boot:run
   
   # Terminal 2 - Frontend
   cd frontend
   # Ctrl+C para detener
   rm -rf .next
   npm run dev
   ```

2. **Borrar localStorage:**
   - DevTools → Application → Local Storage → http://localhost:3001
   - Click derecho → Clear

3. **Verificar puertos:**
   ```bash
   netstat -ano | findstr :8080
   netstat -ano | findstr :3000
   netstat -ano | findstr :3001
   ```

4. **Ver logs del backend en tiempo real** mientras haces el registro

---

**Última actualización:** 26 de octubre de 2025
