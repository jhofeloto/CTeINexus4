import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProjectSchema = z.object({
  title: z.string().min(1, 'El título es requerido').optional(),
  summary: z.string().min(1, 'El resumen es requerido').optional(),
  keywords: z.array(z.string()).min(1, 'Al menos una palabra clave es requerida').optional(),
  status: z.enum(['PROPOSED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  proponentEntity: z.string().min(1, 'La entidad proponente es requerida').optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  isPublic: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.id, // Solo el propietario puede ver el proyecto
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

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateProjectSchema.parse(body)

    // Verificar que el proyecto existe y pertenece al usuario
    const existingProject = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    const project = await prisma.project.update({
      where: {
        id: params.id,
      },
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
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

    return NextResponse.json(project)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el proyecto existe y pertenece al usuario
    const existingProject = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    await prisma.project.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Proyecto eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}