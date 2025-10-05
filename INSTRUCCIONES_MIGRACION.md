# 📋 Instrucciones para Ejecutar la Migración Manual

## 🎯 Problema Identificado

Los comandos de Prisma (`prisma db push` y `prisma migrate`) se cuelgan al intentar conectarse al pooler de Supabase. Esto es un problema conocido con conexiones remotas a Supabase.

## ✅ Solución: Ejecución Manual de SQL

### Paso 1: Acceder a Supabase Dashboard

1. Abre tu navegador y ve a: https://supabase.com/dashboard
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto: **xuuihbuaszqieizyetxh**

### Paso 2: Abrir SQL Editor

1. En el menú lateral izquierdo, haz clic en **"SQL Editor"**
2. Haz clic en **"New query"** para crear una nueva consulta

### Paso 3: Ejecutar Script de Migración

1. Abre el archivo: [`prisma/manual-migration.sql`](./prisma/manual-migration.sql)
2. **Copia TODO el contenido** del archivo
3. **Pega** el contenido en el SQL Editor de Supabase
4. Haz clic en **"Run"** o presiona `Ctrl+Enter` (Windows/Linux) o `Cmd+Enter` (Mac)
5. Espera a que termine la ejecución (debería tomar 5-10 segundos)
6. Verifica que aparezca el mensaje: **"Migration completed successfully!"**

### Paso 4: Ejecutar Script de Seed

1. Crea una **nueva consulta** en SQL Editor
2. Abre el archivo: [`prisma/manual-seed.sql`](./prisma/manual-seed.sql)
3. **Copia TODO el contenido** del archivo
4. **Pega** el contenido en el SQL Editor de Supabase
5. Haz clic en **"Run"** o presiona `Ctrl+Enter` / `Cmd+Enter`
6. Verifica que aparezca el mensaje: **"Seed completed successfully! Created 20 product types"**

### Paso 5: Verificar las Tablas Creadas

1. En el menú lateral, haz clic en **"Table Editor"**
2. Deberías ver las siguientes tablas:
   - ✅ `users`
   - ✅ `accounts`
   - ✅ `sessions`
   - ✅ `verification_tokens`
   - ✅ `projects`
   - ✅ `products`
   - ✅ `product_types` (con 20 registros)
   - ✅ `attachments`

### Paso 6: Confirmar Completado

Una vez que hayas ejecutado ambos scripts exitosamente, responde en el chat:

**"✅ Scripts ejecutados exitosamente"**

Entonces procederé a:
1. Reiniciar el servidor de desarrollo
2. Validar que la aplicación funciona correctamente
3. Verificar que todos los endpoints responden

---

## 🔧 Cambios Realizados Hasta Ahora

### ✅ Completados:
1. ✅ Corregido `NEXTAUTH_URL` de producción a `http://localhost:3002`
2. ✅ Limpiado build de Next.js (`.next` directory)
3. ✅ Regenerado Prisma Client
4. ✅ Creados scripts SQL manuales para migración y seed

### ⏳ Pendientes (después de ejecutar SQL):
1. ⏳ Reiniciar servidor de desarrollo
2. ⏳ Validar página principal
3. ⏳ Validar autenticación
4. ⏳ Validar endpoints de API

---

## 📊 Resumen de Problemas Encontrados

### Problema #1: NEXTAUTH_URL Incorrecta ✅ RESUELTO
- **Antes:** `https://c-te-i-nexus4.vercel.app`
- **Después:** `http://localhost:3002`
- **Impacto:** Causaba 404 en `/auth/signin`

### Problema #2: Base de Datos Sin Inicializar ⏳ EN PROGRESO
- **Error:** Tablas `product_types` y `projects` no existen
- **Solución:** Ejecutar scripts SQL manualmente
- **Impacto:** Causaba 500 en `/api/product-types` y `/api/public/projects`

### Problema #3: Build Corrupto ✅ RESUELTO
- **Error:** `Cannot read properties of undefined (reading 'clientModules')`
- **Solución:** Limpiado directorio `.next`
- **Impacto:** Causaba 404 en página principal `/`

---

## 🚨 Importante

**NO** intentes ejecutar `prisma db push` o `prisma migrate` desde la terminal. Estos comandos se cuelgan con Supabase. Usa SOLO los scripts SQL manuales proporcionados.
