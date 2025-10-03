import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProductSchema = z.object({
  title: z.string().min(1, 'El título es requerido').optional(),
  summary: z.string().min(1, 'El resumen es requerido').optional(),
  description: z.string().optional(),
  productUrl: z.string().url().optional(),
  productTypeId: z.string().min(1, 'El tipo de producto es requerido').optional(),
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

    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        userId: session.user.id, // Solo el propietario puede ver el producto
      },
      include: {
        project: true,
        productType: true,
        attachments: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
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
    const validatedData = updateProductSchema.parse(body)

    // Verificar que el producto existe y pertenece al usuario
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // Si se está cambiando el tipo de producto, verificar que existe
    if (validatedData.productTypeId) {
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
    }

    const product = await prisma.product.update({
      where: {
        id: params.id,
      },
      data: validatedData,
      include: {
        project: true,
        productType: true,
        attachments: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating product:', error)
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

    // Verificar que el producto existe y pertenece al usuario
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    await prisma.product.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Producto eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}