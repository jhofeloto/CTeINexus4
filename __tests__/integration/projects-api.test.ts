import { testApiHandler } from 'next-test-api-route-handler'
import * as appHandler from '@/app/api/projects/route'

// Mock Next.js
jest.mock('next/server', () => ({
  NextRequest: class NextRequest {},
  NextResponse: {
    json: jest.fn((data, options) => ({ data, options, json: true })),
  },
}))

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

describe('/api/projects', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/projects', () => {
    it('should return projects with pagination', async () => {
      const mockProjects = [
        {
          id: '1',
          title: 'Test Project',
          summary: 'Test summary',
          status: 'ACTIVE',
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'user-1',
          _count: { products: 2, attachments: 1 }
        }
      ]

      mockPrisma.PrismaClient().project.findMany.mockResolvedValue(mockProjects)
      mockPrisma.PrismaClient().project.count.mockResolvedValue(1)

      await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          })

          expect(res.status).toBe(200)
          const data = await res.json()
          expect(data.projects).toHaveLength(1)
          expect(data.projects[0].title).toBe('Test Project')
          expect(data.total).toBe(1)
        }
      })
    })

    it('should handle database errors', async () => {
      mockPrisma.PrismaClient().project.findMany.mockRejectedValue(new Error('Database error'))

      await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          })

          expect(res.status).toBe(500)
          const data = await res.json()
          expect(data.error).toBe('Error fetching projects')
        }
      })
    })
  })

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const newProject = {
        title: 'New Project',
        summary: 'Project summary',
        proponentEntity: 'Test Entity',
        budget: 100000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        keywords: ['test', 'project'],
        isPublic: true
      }

      const createdProject = {
        id: '1',
        ...newProject,
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user-1'
      }

      mockPrisma.PrismaClient().project.create.mockResolvedValue(createdProject)

      await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProject)
          })

          expect(res.status).toBe(201)
          const data = await res.json()
          expect(data.project.title).toBe('New Project')
          expect(data.project.status).toBe('DRAFT')
        }
      })
    })

    it('should validate required fields', async () => {
      await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Test' }) // Missing required fields
          })

          expect(res.status).toBe(400)
          const data = await res.json()
          expect(data.error).toContain('Validation error')
        }
      })
    })
  })
})