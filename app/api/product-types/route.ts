import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const productTypes = await prisma.productType.findMany({
      orderBy: {
        category: 'asc',
      },
    })

    return NextResponse.json(productTypes)
  } catch (error) {
    console.error('Error fetching product types:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Endpoint para crear tipos de producto (solo para administradores)
export async function POST(request: NextRequest) {
  try {
    // TODO: Implementar verificación de permisos de administrador
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.role?.includes('ADMIN')) {
    //   return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    // }

    const body = await request.json()
    const { code, description, quality, category } = body

    if (!code || !description || !quality || !category) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const productType = await prisma.productType.create({
      data: {
        code,
        description,
        quality,
        category,
      },
    })

    return NextResponse.json(productType, { status: 201 })
  } catch (error) {
    console.error('Error creating product type:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}