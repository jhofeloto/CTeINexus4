import { testApiHandler } from 'next-test-api-route-handler'
import * as appHandler from '@/app/api/public/projects/route'

// Mock Next.js
jest.mock('next/server', () => ({
  NextRequest: class NextRequest {},
  NextResponse: {
    json: jest.fn((data, options) => ({ data, options, json: true })),
  },
}))

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    project: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    product: {
      count: jest.fn(),
    },
    attachment: {
      count: jest.fn(),
    },
  })),
}))

const mockPrisma = require('@prisma/client')

describe('/api/public/projects', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/public/projects', () => {
    it('should return public projects with limit', async () => {
      const mockProjects = [
        {
          id: '1',
          title: 'Public Project 1',
          summary: 'Public project summary',
          keywords: ['public', 'project'],
          status: 'ACTIVE',
          proponentEntity: 'Public Entity',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          budget: 50000,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'user-1',
          _count: { products: 3, attachments: 2 }
        },
        {
          id: '2',
          title: 'Public Project 2',
          summary: 'Another public project',
          keywords: ['public', 'innovation'],
          status: 'COMPLETED',
          proponentEntity: 'Innovation Corp',
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-12-31'),
          budget: 75000,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'user-2',
          _count: { products: 1, attachments: 0 }
        }
      ]

      mockPrisma.PrismaClient().project.findMany.mockResolvedValue(mockProjects)
      mockPrisma.PrismaClient().project.count.mockResolvedValue(2)

      await testApiHandler({
        appHandler,
        url: '/api/public/projects?limit=6',
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          })

          expect(res.status).toBe(200)
          const data = await res.json()
          expect(data.projects).toHaveLength(2)
          expect(data.projects[0].title).toBe('Public Project 1')
          expect(data.projects[1].title).toBe('Public Project 2')
          expect(data.total).toBe(2)
        }
      })
    })

    it('should filter only public projects', async () => {
      const mockProjects = [
        {
          id: '1',
          title: 'Public Project',
          isPublic: true,
          _count: { products: 1, attachments: 0 }
        }
      ]

      mockPrisma.PrismaClient().project.findMany.mockResolvedValue(mockProjects)
      mockPrisma.PrismaClient().project.count.mockResolvedValue(1)

      await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET'
          })

          expect(res.status).toBe(200)

          // Verify that findMany was called with isPublic: true filter
          expect(mockPrisma.PrismaClient().project.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
              where: { isPublic: true }
            })
          )
        }
      })
    })

    it('should handle database errors gracefully', async () => {
      mockPrisma.PrismaClient().project.findMany.mockRejectedValue(new Error('Database connection failed'))

      await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET'
          })

          expect(res.status).toBe(500)
          const data = await res.json()
          expect(data.error).toBe('Error fetching public projects')
        }
      })
    })

    it('should return empty array when no public projects exist', async () => {
      mockPrisma.PrismaClient().project.findMany.mockResolvedValue([])
      mockPrisma.PrismaClient().project.count.mockResolvedValue(0)

      await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET'
          })

          expect(res.status).toBe(200)
          const data = await res.json()
          expect(data.projects).toEqual([])
          expect(data.total).toBe(0)
        }
      })
    })

    it('should apply default limit when not specified', async () => {
      const mockProjects = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Project ${i + 1}`,
        isPublic: true,
        _count: { products: 0, attachments: 0 }
      }))

      mockPrisma.PrismaClient().project.findMany.mockResolvedValue(mockProjects.slice(0, 6))
      mockPrisma.PrismaClient().project.count.mockResolvedValue(10)

      await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET'
          })

          expect(res.status).toBe(200)

          // Verify default limit of 6 was applied
          expect(mockPrisma.PrismaClient().project.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
              take: 6
            })
          )
        }
      })
    })
  })
})