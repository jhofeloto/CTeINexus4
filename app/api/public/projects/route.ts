import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  console.log('GET /api/public/projects called')
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || ''

    const where = {
      isPublic: true,
      OR: search ? [
        {
          title: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
        {
          summary: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
        {
          keywords: {
            hasSome: [search],
          },
        },
      ] : undefined,
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
            },
          },
          products: {
            where: {
              isPublic: true,
            },
            include: {
              productType: true,
            },
          },
          _count: {
            select: {
              products: true,
              attachments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: Math.min(limit, 50), // Máximo 50 por página
        skip: offset,
      }),
      prisma.project.count({
        where,
      }),
    ])

    return NextResponse.json({
      projects,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching public projects:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}