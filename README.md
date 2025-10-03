# CTeINexus4 - Plataforma de Gestión de Investigación Científica

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7.1-2D3748)](https://prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39.3-3ECF8E)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000)](https://vercel.com/)

Plataforma integral para la gestión de proyectos de investigación científica y tecnológica (CTeI). Centraliza, colabora y acelera tu investigación con herramientas modernas de IA.

## 🚀 Características Principales

### ✅ MVP Completado (Fase 1)
- **Portal Público**: Landing page con explicación del sistema y buscador público
- **Autenticación**: Login seguro con Google OAuth
- **Dashboard Privado**: Gestión completa de proyectos y productos CTeI
- **Sistema de Archivos**: Subida de documentos con Cloudinary
- **Base de Datos**: Schema completo con 20 tipos de productos CTeI
- **UI/UX Moderna**: Diseño responsivo con Tailwind CSS v4

### 🔮 Próximas Funcionalidades (Fase 2)
- **Análisis con IA**: Evaluación automática de proyectos con Dify.ai
- **Chat Asistente**: Asistente virtual para guiar la redacción de proyectos
- **Reportes Avanzados**: Análisis y métricas detalladas

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: Supabase PostgreSQL
- **Autenticación**: NextAuth.js con Google OAuth
- **Archivos**: Cloudinary para almacenamiento
- **Despliegue**: Vercel
- **IA**: Dify.ai (Fase 2)

## 📋 Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase
- Cuenta de Google Cloud (para OAuth)
- Cuenta de Cloudinary
- Cuenta de Vercel (opcional)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/ctein-nexus4.git
cd ctein-nexus4
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales reales:

```env
# Base de datos
DATABASE_URL="postgresql://postgres.xuuihbuaszqieizyetxh:Neptura2025@@aws-1-us-east-2.pooler.supabase.com:6543/postgres"

# Supabase (cliente)
NEXT_PUBLIC_SUPABASE_URL=https://xuuihbuaszqieizyetxh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-supabase-anon-key

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-nextauth-secret-seguro"

# Google OAuth
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="tu-cloudinary-cloud-name"
CLOUDINARY_API_KEY="tu-cloudinary-api-key"
CLOUDINARY_API_SECRET="tu-cloudinary-api-secret"

# Dify.ai (Fase 2)
DIFY_API_KEY="tu-dify-api-key"
DIFY_API_URL="https://api.dify.ai/v1"
```

### 4. Configurar la base de datos
```bash
# Generar cliente Prisma
npx prisma generate

# Aplicar migraciones
npx prisma db push

# (Opcional) Abrir Prisma Studio para ver la BD
npx prisma studio
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
ctein-nexus4/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # NextAuth.js
│   │   ├── projects/             # CRUD proyectos
│   │   ├── products/             # CRUD productos
│   │   └── upload/               # Subida de archivos
│   ├── dashboard/                # Dashboard privado
│   ├── auth/                     # Páginas de autenticación
│   └── page.tsx                  # Landing page
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base
│   ├── dashboard/                # Componentes del dashboard
│   ├── sections/                 # Secciones de la landing
│   └── auth/                     # Componentes de autenticación
├── lib/                          # Utilidades y configuración
│   ├── auth.ts                   # Configuración NextAuth.js
│   ├── prisma.ts                 # Cliente Prisma
│   ├── cloudinary.ts             # Configuración Cloudinary
│   └── hooks/                    # Custom hooks
├── prisma/                       # Schema de base de datos
│   └── schema.prisma
├── types/                        # Definiciones TypeScript
└── public/                       # Archivos estáticos
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Construir para producción
npm run start            # Iniciar servidor de producción

# Base de datos
npm run db:generate      # Generar cliente Prisma
npm run db:push          # Aplicar cambios al schema
npm run db:studio        # Abrir Prisma Studio
npm run db:migrate       # Crear y aplicar migraciones
npm run db:seed          # Ejecutar seed de datos

# Calidad de código
npm run lint             # Ejecutar ESLint
```

## 🚀 Despliegue en Vercel

### Opción 1: Despliegue Automático (Recomendado)
1. Conecta tu repositorio de GitHub con Vercel
2. Configura las variables de entorno en Vercel Dashboard
3. Vercel detectará automáticamente la configuración de Next.js

### Opción 2: Despliegue Manual
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Desplegar
vercel

# Para producción
vercel --prod
```

### Variables de Entorno en Vercel
Configura estas variables en tu proyecto de Vercel:

- `DATABASE_URL`
- `NEXTAUTH_URL` (URL de tu dominio en Vercel)
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `DIFY_API_KEY` (para Fase 2)
- `DIFY_API_URL` (para Fase 2)

## 📊 Estado del Desarrollo

### ✅ Fase 1: MVP Completado
- [x] Portal público con landing page
- [x] Sistema de autenticación Google OAuth
- [x] Dashboard privado con navegación
- [x] CRUD completo de proyectos
- [x] CRUD completo de productos CTeI
- [x] Sistema de subida de archivos Cloudinary
- [x] Base de datos con 20 tipos de productos
- [x] UI/UX responsiva con Tailwind CSS v4
- [x] Despliegue configurado para Vercel

### 🔄 Fase 2: Capa de Inteligencia (Próximamente)
- [ ] Integración con Dify.ai
- [ ] Asistente CTeI con chat
- [ ] Evaluador automático de proyectos
- [ ] Análisis de calidad con IA
- [ ] Recomendaciones inteligentes

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Proyecto**: CTeINexus4
- **Versión**: 1.0.0 (MVP)
- **Estado**: Producción Lista

---

*Desarrollado con ❤️ para la comunidad científica colombiana*
