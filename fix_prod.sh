set -euo pipefail

# 1) Detecta el alias más reciente de Producción y construye URL
PROD_ALIAS="$(npx -y vercel@latest ls | awk '/Production/ {print $2; exit}')"
if [ -z "${PROD_ALIAS:-}" ]; then
  echo "❌ No se encontró alias de Production en Vercel. Revisa 'vercel ls'."
  exit 1
fi
PROD_URL="https://${PROD_ALIAS}"
echo "🔗 Production alias: $PROD_ALIAS"
echo "🌐 Production URL:  $PROD_URL"

# 2) Función para leer claves desde .env.local de forma segura
get_env () { grep -E "^$1=" .env.local | sed -E "s/^$1=//"; }

# 3) Matriz de variables que deben existir en PRODUCTION
VARS_REQ=(
  "DATABASE_URL"
  "NEXTAUTH_SECRET"
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "GOOGLE_CLIENT_ID"
  "GOOGLE_CLIENT_SECRET"
  "CLOUDINARY_CLOUD_NAME"
  "CLOUDINARY_API_KEY"
  "CLOUDINARY_API_SECRET"
  "DIFY_API_KEY"
  "DIFY_API_URL"
)

# 4) Asegura que .env.local existe
if [ ! -f .env.local ]; then
  echo "❌ No existe .env.local. Ejecuta: 'vercel env pull .env.local' y vuelve a correr."
  exit 1
fi

# 5) Sube/actualiza todas las variables a Production leyendo de .env.local
echo "⬆️  Subiendo variables a Vercel (Production)…"
for KEY in "${VARS_REQ[@]}"; do
  VAL="$(get_env "$KEY" || true)"
  if [ -z "${VAL:-}" ]; then
    echo "⚠️  $KEY no encontrada en .env.local (continúo)."
    continue
  fi
  printf "%s" "$VAL" | npx -y vercel@latest env add "$KEY" production || true
done

# 6) NEXTAUTH_URL SOLO en Production => apunta al dominio productivo
printf "%s" "$PROD_URL" | npx -y vercel@latest env add NEXTAUTH_URL production || true

# 7) Limpieza opcional (no usamos NODE_ENV en Vercel; NEXTAUTH_URL no en Preview/Dev)
npx -y vercel@latest env rm NODE_ENV production --yes 2>/dev/null || true
npx -y vercel@latest env rm NODE_ENV preview --yes 2>/dev/null || true
npx -y vercel@latest env rm NODE_ENV development --yes 2>/dev/null || true
npx -y vercel@latest env rm NEXTAUTH_URL preview --yes 2>/dev/null || true
npx -y vercel@latest env rm NEXTAUTH_URL development --yes 2>/dev/null || true

# 8) Verificación de que quedaron cargadas en Production
echo "🔍 Estado de variables en Vercel:"
npx -y vercel@latest env ls

# 9) Redeploy de Producción (build incluye prisma migrate deploy)
echo "🚀 Redeploy a Producción…"
npx -y vercel@latest redeploy "$PROD_ALIAS" --prod --yes

# 10) Inspección de logs del deploy productivo
echo "📜 Logs de build/arranque (últimas ~30 líneas):"
npx -y vercel@latest inspect "$PROD_ALIAS" --logs | tail -n 30

echo "✅ Listo. Abre: $PROD_URL  y prueba /auth/signin"
