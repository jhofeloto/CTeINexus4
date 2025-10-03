'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  FileText,
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Project {
  id: string
  title: string
  summary: string
  keywords: string[]
  status: 'PROPOSED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  proponentEntity: string
  startDate?: string | null
  endDate?: string | null
  budget?: number | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    products: number
    attachments: number
  }
}

interface ProjectDataTableProps {
  projects: Project[]
  onDelete?: (projectId: string) => void
}

const statusConfig = {
  PROPOSED: { label: 'Propuesto', color: 'bg-yellow-100 text-yellow-800' },
  IN_PROGRESS: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { label: 'Completado', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
}

export function ProjectDataTable({ projects, onDelete }: ProjectDataTableProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tienes proyectos aún
        </h3>
        <p className="text-gray-500 mb-6">
          Crea tu primer proyecto para comenzar a gestionar tu investigación.
        </p>
        <Link href="/dashboard/projects/new">
          <Button>Crear Primer Proyecto</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Mis Proyectos ({projects.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proyecto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fechas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Productos CTeI
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {project.title}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {project.summary}
                      </div>
                      {project.keywords.length > 0 && (
                        <div className="flex items-center mt-1">
                          <Tag className="w-3 h-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">
                            {project.keywords.slice(0, 2).join(', ')}
                            {project.keywords.length > 2 && '...'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[project.status].color}`}>
                    {statusConfig[project.status].label}
                  </span>
                  {project.isPublic && (
                    <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Público
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.proponentEntity}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <div>
                      {project.startDate && (
                        <div>
                          Inicio: {format(new Date(project.startDate), 'dd/MM/yyyy', { locale: es })}
                        </div>
                      )}
                      {project.endDate && (
                        <div>
                          Fin: {format(new Date(project.endDate), 'dd/MM/yyyy', { locale: es })}
                        </div>
                      )}
                      {project.budget && (
                        <div className="flex items-center mt-1">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${project.budget.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {project._count?.products || 0}
                    </div>
                    <div className="text-xs text-gray-500">
                      productos
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link href={`/dashboard/projects/${project.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/projects/${project.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProject(project.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal would go here */}
      {selectedProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ¿Eliminar proyecto?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Esta acción no se puede deshacer. Se eliminarán también todos los productos y archivos asociados.
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProject(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete?.(selectedProject)
                    setSelectedProject(null)
                  }}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}