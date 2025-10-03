import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Edit,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  Package,
  Paperclip,
  ExternalLink,
  Plus
} from 'lucide-react'

interface ProjectDetailPageProps {
  params: {
    id: string
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Fetch the project with related data
  const project = await prisma.project.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
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
    redirect('/dashboard')
  }

  const statusConfig = {
    PROPOSED: { label: 'Propuesto', color: 'bg-yellow-100 text-yellow-800' },
    IN_PROGRESS: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
    COMPLETED: { label: 'Completado', color: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[project.status].color}`}>
                {statusConfig[project.status].label}
              </span>
              {project.isPublic && (
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Público
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-4">{project.summary}</p>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>Entidad: {project.proponentEntity}</span>
              </div>

              {project.keywords.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>{project.keywords.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/dashboard/projects/${project.id}/edit`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Project details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dates and budget */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Proyecto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Fecha de Inicio</p>
                    <p className="text-sm text-gray-600">
                      {project.startDate
                        ? format(new Date(project.startDate), 'dd/MM/yyyy', { locale: es })
                        : 'No especificada'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Fecha de Finalización</p>
                    <p className="text-sm text-gray-600">
                      {project.endDate
                        ? format(new Date(project.endDate), 'dd/MM/yyyy', { locale: es })
                        : 'No especificada'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {project.budget && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Presupuesto</p>
                    <p className="text-sm text-gray-600">
                      ${project.budget.toLocaleString()} COP
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Productos CTeI ({project.products.length})
              </h2>
              <Link href={`/dashboard/projects/${project.id}/products/new`}>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Producto
                </Button>
              </Link>
            </div>

            {project.products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  No hay productos registrados para este proyecto.
                </p>
                <Link href={`/dashboard/projects/${project.id}/products/new`}>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primer Producto
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {project.products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900">{product.title}</h3>
                          {product.isPublic && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Público
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{product.summary}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {product.productType.description}
                          </span>
                          {product.productUrl && (
                            <a
                              href={product.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary-600 hover:text-primary-800"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Ver producto
                            </a>
                          )}
                          <span className="flex items-center gap-1">
                            <Paperclip className="w-3 h-3" />
                            {product.attachments.length} archivos
                          </span>
                        </div>
                      </div>
                      <Link href={`/dashboard/products/${product.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Attachments */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Archivos del Proyecto ({project.attachments.length})
            </h3>

            {project.attachments.length === 0 ? (
              <p className="text-sm text-gray-500">No hay archivos adjuntos.</p>
            ) : (
              <div className="space-y-2">
                {project.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-2 p-2 border rounded">
                    <Paperclip className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {attachment.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(attachment.fileSize || 0) / 1024 < 1024
                          ? `${Math.round((attachment.fileSize || 0) / 1024)} KB`
                          : `${Math.round((attachment.fileSize || 0) / 1024 / 1024)} MB`
                        }
                      </p>
                    </div>
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-2">
              <Link href={`/dashboard/projects/${project.id}/products/new`}>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Producto
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <Paperclip className="w-4 h-4 mr-2" />
                Subir Archivo
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Evaluar con IA
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}