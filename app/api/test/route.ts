import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL)
  try {
    await prisma.$connect()
    const count = await prisma.project.count()
    return NextResponse.json({ message: 'Connected successfully', projectCount: count })
  } catch (error) {
    console.error('Connection error:', error)
    return NextResponse.json({ error: 'Connection failed', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}