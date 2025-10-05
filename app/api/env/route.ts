import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || '(unset)',
    HAS_DB: !!process.env.DATABASE_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL
  })
}
