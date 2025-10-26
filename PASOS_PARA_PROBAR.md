# 🚀 Instrucciones de Prueba - SIGUE ESTOS PASOS

## ⚠️ IMPORTANTE: Problemas Detectados

### 1. El formulario que ves está en CACHÉ
El navegador está mostrando la **versión vieja** del formulario. Los cambios SÍ están hechos en el código.

### 2. Probablemente hay un problema de CORS o conexión con el backend

### 3. El error en onboarding/horarios es porque NO estás autenticado

---

## 📋 PASOS PARA PROBAR TODO

### PASO 1: Verificar que Backend esté corriendo

```bash
# En Git Bash - Terminal 1
cd "c:\Users\Juan\Desktop\Ciclo-8\Desarrollo de Soluciones IOT - Presencial\soft\parkeoya-backend"

# Cargar variables de entorno
set -o allexport; source .env; set +o allexport

# Iniciar backend
mvn spring-boot:run
```

**✅ VERIFICAR:** Debe decir `Started ParkeoyaApplication in X.XXX seconds`

**✅ VERIFICAR EN NAVEGADOR:** http://localhost:8080/swagger-ui/index.html debe abrir

---

### PASO 2: Verificar que Frontend esté corriendo

```bash
# En Git Bash - Terminal 2
cd "c:\Users\Juan\Desktop\Ciclo-8\Desarrollo de Soluciones IOT - Presencial\soft\frontend"

# Iniciar frontend (está usando puerto 3001)
npm run dev
```

**✅ VERIFICAR:** Debe decir `Ready in XXXXms` y mostrar `Local: http://localhost:3001`

---

### PASO 3: Limpiar TODO el caché

1. **Abrir navegador** → http://localhost:3001/register

2. **Abrir DevTools (F12)**

3. **Ir a la pestaña "Application"**

4. **En el menú izquierdo:**
   - Click en "Local Storage" → http://localhost:3001
   - Click derecho → **"Clear"**
   
   - Click en "Session Storage" → http://localhost:3001
   - Click derecho → **"Clear"**

5. **Cerrar DevTools**

6. **Presionar Ctrl + Shift + R** (limpia caché y recarga)

7. **O mejor aún:**
   - Click derecho en el botón de recargar del navegador
   - Seleccionar **"Vaciar caché y volver a cargar de forma forzada"**

---

### PASO 4: Verificar que el formulario se actualizó

El formulario **DEBE mostrar ESTOS CAMPOS EN ESTE ORDEN:**

```
┌─────────────────────────────────────────┐
│  Correo Electrónico                     │
│  tu@empresa.com                         │
└─────────────────────────────────────────┘

┌────────────────────┬────────────────────┐
│  Contraseña        │ Confirmar          │
│  Mínimo 3 caract.  │ Repite contraseña  │
└────────────────────┴────────────────────┘

┌─────────────────────────────────────────┐
│  Nombre Completo                        │
│  Juan Pérez                             │
└─────────────────────────────────────────┘

┌────────────────────┬────────────────────┐
│  Ciudad            │ País               │
│  Lima              │ Perú               │
└────────────────────┴────────────────────┘

┌─────────────────────────────────────────┐
│  Teléfono                               │
│  987654321                              │
│  9 dígitos                              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Nombre de Empresa                      │
│  Estacionamientos XYZ                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  RUC                                    │
│  20123456789                            │
│  11 dígitos                             │
└─────────────────────────────────────────┘

☐ Acepto los términos...

[  Crear Cuenta  ]
```

**❌ SI NO VES ESTO**, significa que el caché no se limpió. **CIERRA TODO EL NAVEGADOR** y vuelve a abrir.

---

### PASO 5: Probar el registro COMPLETO

1. **Abrir DevTools (F12)**

2. **Ir a la pestaña "Console"** (para ver errores)

3. **Ir a la pestaña "Network"**
   - Filtrar por "Fetch/XHR"

4. **Llenar el formulario:**
   ```
   Email: test123@example.com
   Contraseña: 123
   Confirmar Contraseña: 123
   Nombre Completo: Juan Pérez
   Ciudad: Lima
   País: Perú
   Teléfono: 987654321
   Nombre de Empresa: Estacionamientos ABC
   RUC: 20123456789
   ```

5. **Marcar el checkbox** de términos

6. **Click en "Crear Cuenta"**

7. **OBSERVAR la pestaña Network:**

   **✅ DEBE APARECER:**
   ```
   POST sign-up/parking-owner    Status: 201 Created
   POST sign-in                  Status: 200 OK
   GET  parking-owner/{id}       Status: 200 OK
   ```

   **❌ SI APARECE ERROR CORS:**
   ```
   Access to fetch at 'http://localhost:8080...' has been blocked by CORS policy
   ```
   
   **SOLUCIÓN:** El backend YA tiene configuración CORS, pero tal vez necesitas reiniciarlo:
   ```bash
   # En el terminal del backend: Ctrl+C para detener
   set -o allexport; source .env; set +o allexport
   mvn spring-boot:run
   ```

8. **Si todo funciona:**
   - Debe redirigir a http://localhost:3001/dashboard
   - En DevTools → Application → Local Storage debe aparecer:
     - `parkeoya_user`
     - `parkeoya_token`
     - `parkeoya_profile`

---

### PASO 6: Verificar en la Base de Datos

```bash
# Conectar a MySQL
mysql -u root -p
# Password: Cali,128
```

```sql
USE parkeoya;

-- Ver el último usuario creado
SELECT * FROM users ORDER BY id DESC LIMIT 1;

-- Ver el perfil
SELECT * FROM parking_owners ORDER BY id DESC LIMIT 1;
```

**✅ DEBE MOSTRAR:**
- users: email, password (hash), created_at (no NULL)
- parking_owners: full_name, city, country, phone, company_name, ruc

---

### PASO 7: Probar el Login

1. **Ir a:** http://localhost:3001/login

2. **Llenar con las MISMAS credenciales:**
   ```
   Email: test123@example.com
   Contraseña: 123
   ```

3. **Click en "Iniciar Sesión"**

4. **Debe redirigir a:** http://localhost:3001/dashboard

---

## ⚠️ Sobre el Error en Onboarding

El error en `/onboarding/horarios` es porque **NO ESTÁS AUTENTICADO**.

Para acceder al onboarding:
1. Primero **registrarte** o **hacer login**
2. Solo entonces puedes ir a http://localhost:3001/onboarding/horarios

El `ProtectedRoute` redirige a `/login` si no hay token en localStorage.

---

## 🔍 Si Algo No Funciona

### A) El formulario SIGUE mostrando campos viejos

**Solución:**
```bash
# Eliminar todo el build de Next.js
cd frontend
rm -rf .next
npm run dev
```

Luego Ctrl+Shift+R en el navegador

### B) Errores CORS en la consola

**Verificar en el código del backend:**
`WebSecurityConfiguration.java` debe tener:
```java
cors.setAllowedOrigins(List.of("*"));
```

Ya lo tiene, pero si sigue dando error, reinicia el backend.

### C) No se guardan datos en BD

**Revisar logs del backend** cuando haces submit del formulario.

**SI NO APARECE NADA en los logs:**
- Problema de conexión frontend → backend
- Verificar `.env.local` tiene `NEXT_PUBLIC_API_URL=http://localhost:8080`
- Verificar en Network tab si las peticiones llegan

**SI APARECE ERROR en los logs:**
- Copiar el error completo
- Probablemente falta algún campo o hay problema con Lombok/JPA

---

## 📸 Capturas que necesito para diagnosticar

Si algo no funciona, envíame capturas de:

1. **Formulario completo** (para ver si se actualizó)
2. **DevTools → Console** (errores JavaScript)
3. **DevTools → Network → Fetch/XHR** (peticiones al backend)
4. **Terminal del backend** (logs cuando haces submit)
5. **MySQL** resultado de:
   ```sql
   SELECT COUNT(*) FROM users;
   SELECT * FROM users ORDER BY id DESC LIMIT 1;
   ```

---

## ✅ Resumen de lo que DEBE pasar

1. ✅ Formulario muestra **9 campos** (no 5)
2. ✅ Al hacer submit aparecen **3 peticiones** en Network tab
3. ✅ Backend muestra logs de las peticiones
4. ✅ Se guarda en BD (users + parking_owners)
5. ✅ Redirige a `/dashboard`
6. ✅ Login funciona con las mismas credenciales
7. ✅ Onboarding solo accesible después de login

---

**¿LISTO PARA PROBAR?** Sigue los pasos EN ORDEN y dime en cuál te atoras.
