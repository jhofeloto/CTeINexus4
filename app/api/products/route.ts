import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createProductSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  summary: z.string().min(1, 'El resumen es requerido'),
  description: z.string().optional(),
  productUrl: z.string().url().optional(),
  productTypeId: z.string().min(1, 'El tipo de producto es requerido'),
  projectId: z.string().min(1, 'El proyecto es requerido'),
  isPublic: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    const where = projectId
      ? {
          userId: session.user.id,
          projectId: projectId,
        }
      : {
          userId: session.user.id,
        }

    const products = await prisma.product.findMany({
      where,
      include: {
        project: true,
        productType: true,
        attachments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    // Verificar que el proyecto existe y pertenece al usuario
    const project = await prisma.project.findFirst({
      where: {
        id: validatedData.projectId,
        userId: session.user.id,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado o no autorizado' },
        { status: 404 }
      )
    }

    // Verificar que el tipo de producto existe
    const productType = await prisma.productType.findUnique({
      where: {
        id: validatedData.productTypeId,
      },
    })

    if (!productType) {
      return NextResponse.json(
        { error: 'Tipo de producto no encontrado' },
        { status: 404 }
      )
    }

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
      include: {
        project: true,
        productType: true,
        attachments: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}