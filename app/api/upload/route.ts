import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const uploadSchema = z.object({
  entityType: z.enum(['project', 'product']),
  entityId: z.string().cuid(),
  fileName: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const entityType = formData.get('entityType') as string
    const entityId = formData.get('entityId') as string
    const fileName = formData.get('fileName') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Archivo requerido' },
        { status: 400 }
      )
    }

    // Validar datos
    const validation = uploadSchema.safeParse({
      entityType,
      entityId,
      fileName,
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.issues },
        { status: 400 }
      )
    }

    // Verificar que el usuario tenga acceso a la entidad
    if (entityType === 'project') {
      const project = await prisma.project.findFirst({
        where: {
          id: entityId,
          userId: session.user.id,
        },
      })

      if (!project) {
        return NextResponse.json(
          { error: 'Proyecto no encontrado o sin permisos' },
          { status: 404 }
        )
      }
    } else if (entityType === 'product') {
      const product = await prisma.product.findFirst({
        where: {
          id: entityId,
          userId: session.user.id,
        },
      })

      if (!product) {
        return NextResponse.json(
          { error: 'Producto no encontrado o sin permisos' },
          { status: 404 }
        )
      }
    }

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Subir a Cloudinary
    const folder = `ctein-nexus4/${entityType}s/${entityId}`
    const uploadResult = await uploadToCloudinary(buffer, folder)

    // Guardar en base de datos
    const attachment = await prisma.attachment.create({
      data: {
        url: uploadResult.url,
        fileName: fileName || file.name,
        fileSize: file.size,
        mimeType: file.type,
        ...(entityType === 'project' && { projectId: entityId }),
        ...(entityType === 'product' && { productId: entityId }),
      },
    })

    return NextResponse.json({
      success: true,
      attachment,
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const attachmentId = searchParams.get('id')

    if (!attachmentId) {
      return NextResponse.json(
        { error: 'ID de archivo requerido' },
        { status: 400 }
      )
    }

    // Buscar el archivo y verificar permisos
    const attachment = await prisma.attachment.findFirst({
      where: {
        id: attachmentId,
        OR: [
          {
            project: {
              userId: session.user.id,
            },
          },
          {
            product: {
              userId: session.user.id,
            },
          },
        ],
      },
    })

    if (!attachment) {
      return NextResponse.json(
        { error: 'Archivo no encontrado o sin permisos' },
        { status: 404 }
      )
    }

    // Eliminar de Cloudinary
    try {
      await deleteFromCloudinary(attachment.url)
    } catch (cloudinaryError) {
      console.warn('Error deleting from Cloudinary:', cloudinaryError)
      // Continuar con la eliminación de la base de datos
    }

    // Eliminar de base de datos
    await prisma.attachment.delete({
      where: { id: attachmentId },
    })

    return NextResponse.json({
      success: true,
      message: 'Archivo eliminado correctamente',
    })

  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}