import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createProjectSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  summary: z.string().min(1, 'El resumen es requerido'),
  keywords: z.array(z.string()).min(1, 'Al menos una palabra clave es requerida'),
  proponentEntity: z.string().min(1, 'La entidad proponente es requerida'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  isPublic: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  try {
    let userId = null

    if (process.env.NODE_ENV === 'development') {
      // En desarrollo, usar usuario dummy para pruebas
      userId = 'dev-user-id'
    } else {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }
      userId = session.user.id
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: userId,
      },
      include: {
        products: {
          include: {
            productType: true,
            attachments: true,
          },
        },
        attachments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    let userId = null

    if (process.env.NODE_ENV === 'development') {
      // En desarrollo, usar usuario dummy para pruebas
      userId = 'dev-user-id'
    } else {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }
      userId = session.user.id
    }

    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        userId: userId,
      },
      include: {
        products: {
          include: {
            productType: true,
            attachments: true,
          },
        },
        attachments: true,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}