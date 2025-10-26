# Integración de Autenticación Frontend-Backend

## Resumen de Cambios Implementados

### 📁 Estructura de Archivos Creados/Modificados

#### Nuevos Archivos (Infraestructura API)
1. **`lib/api/types.ts`** - Definiciones de tipos TypeScript
   - `User`, `AuthResponse`, `ParkingOwnerProfile`
   - `SignUpRequest`, `SignInRequest`, `ApiError`

2. **`lib/api/client.ts`** - Cliente HTTP centralizado
   - Clase `ApiClient` con métodos para todos los endpoints
   - Inyección automática de JWT token en headers
   - Manejo de errores y respuestas

3. **`lib/api/index.ts`** - Barrel export para imports limpios

4. **`hooks/use-auth.ts`** - Hook personalizado de React
   - `signUp()` - Registro con auto-login
   - `signIn()` - Login con obtención de perfil
   - `logout()` - Cierre de sesión
   - Estados: `isLoading`, `error`

5. **`.env.local`** - Variables de entorno
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

#### Archivos Actualizados

6. **`lib/auth.ts`** - Utilidades de autenticación
   - Cambio de mock a integración real con API
   - `setAuthData()`, `clearAuthData()`
   - `fetchUserProfile()`, `getCachedProfile()`

7. **`components/forms/registration-form.tsx`** - Formulario de registro
   - ✅ Agregado campo `fullName` (reemplazó `name`)
   - ✅ Agregado campo `city`
   - ✅ Agregado campo `country`
   - ✅ Agregado campo `companyName`
   - ✅ Agregado campo `ruc`
   - ✅ Validación: teléfono 9 dígitos
   - ✅ Validación: RUC 11 dígitos
   - ✅ Integrado con `useAuth` hook
   - ✅ Manejo de estados loading/error

8. **`components/forms/login-form.tsx`** - Formulario de login
   - ✅ Reemplazado mock setTimeout con `useAuth`
   - ✅ Integración real con backend
   - ✅ Manejo de estados loading/error

---

## 🔄 Flujo de Autenticación

### Registro de Usuario
```
Usuario completa formulario
  ↓
useAuth.signUp()
  ↓
apiClient.signUp() → POST /api/v1/authentication/sign-up/parking-owner
  ↓
apiClient.signIn() → POST /api/v1/authentication/sign-in (auto-login)
  ↓
setAuthData() → Guarda user + token en localStorage
  ↓
fetchUserProfile() → GET /api/v1/profiles/parking-owner/{userId}
  ↓
Guarda profile en localStorage
  ↓
Redirige a /dashboard
```

### Inicio de Sesión
```
Usuario ingresa email/password
  ↓
useAuth.signIn()
  ↓
apiClient.signIn() → POST /api/v1/authentication/sign-in
  ↓
setAuthData() → Guarda user + token en localStorage
  ↓
fetchUserProfile() → GET /api/v1/profiles/parking-owner/{userId}
  ↓
Guarda profile en localStorage
  ↓
Redirige a /dashboard
```

---

## 📦 LocalStorage Keys

| Key | Contenido | Ejemplo |
|-----|-----------|---------|
| `parkeoya_user` | Usuario básico | `{ id, email, roles }` |
| `parkeoya_token` | JWT token | `eyJhbGciOiJIUzI1Ni...` |
| `parkeoya_profile` | Perfil completo | `{ userId, parkingOwnerId, fullName, city, country, phone, companyName, ruc }` |

---

## 🧪 Cómo Probar

### 1. Iniciar Backend
```bash
cd parkeoya-backend
set -o allexport; source .env; set +o allexport
mvn spring-boot:run
```

### 2. Iniciar Frontend
```bash
cd frontend
npm run dev
```

### 3. Probar Flujo Completo
1. Ir a http://localhost:3000/register
2. Llenar formulario con datos válidos:
   - Email: `test@example.com`
   - Contraseña: `123` (mínimo 3 caracteres)
   - Nombre Completo: `Juan Pérez`
   - Ciudad: `Lima`
   - País: `Perú`
   - Teléfono: `987654321` (9 dígitos)
   - Nombre de Empresa: `Estacionamientos XYZ`
   - RUC: `20123456789` (11 dígitos)
3. Aceptar términos y crear cuenta
4. Verificar redirección a `/dashboard`
5. Abrir DevTools → Application → Local Storage
6. Verificar que existen las 3 keys: `parkeoya_user`, `parkeoya_token`, `parkeoya_profile`
7. Hacer logout
8. Ir a http://localhost:3000/login
9. Iniciar sesión con el mismo email/password
10. Verificar redirección exitosa

---

## 🔒 Seguridad Implementada

- ✅ JWT Bearer token en todas las peticiones autenticadas
- ✅ Tokens almacenados en localStorage (cliente)
- ✅ Headers `Authorization: Bearer <token>` automáticos
- ✅ Validación de formularios en frontend
- ✅ Manejo de errores de API
- ✅ Variables de entorno para URLs

---

## 🚀 Próximos Pasos (Opcionales)

1. **CORS**: Si hay problemas de CORS, agregar configuración en Spring Boot:
   ```java
   @Configuration
   public class WebConfig implements WebMvcConfigurer {
       @Override
       public void addCorsMappings(CorsRegistry registry) {
           registry.addMapping("/api/**")
                   .allowedOrigins("http://localhost:3000")
                   .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                   .allowedHeaders("*")
                   .allowCredentials(true);
       }
   }
   ```

2. **Refresh Token**: Implementar lógica de renovación automática de tokens

3. **Protected Routes**: Verificar autenticación en rutas del dashboard

4. **Error Boundaries**: Manejar errores de red/API de forma global

---

## ✅ Checklist de Integración

- [x] Tipos TypeScript creados
- [x] Cliente API implementado
- [x] Hook de autenticación creado
- [x] Formulario de registro actualizado (7 campos)
- [x] Formulario de login actualizado
- [x] Variables de entorno configuradas
- [x] Sin errores de compilación
- [x] Validaciones de formulario
- [x] Manejo de estados loading/error
- [ ] Prueba manual end-to-end
- [ ] Verificación de CORS (si es necesario)

---

**Branch actual**: `feature/auth-integration`

**Fecha**: $(date)
