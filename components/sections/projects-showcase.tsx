'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Search, ExternalLink, Package, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Project {
  id: string
  title: string
  summary: string
  proponentEntity: string
  createdAt: string
  user: {
    name: string
  }
  _count: {
    products: number
  }
}

export function ProjectsShowcase() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async (search = '') => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      params.set('limit', '6') // Mostrar máximo 6 proyectos destacados

      const response = await fetch(`/api/public/projects?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Error fetching public projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProjects(searchTerm)
  }

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Proyectos de Investigación Pública
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explora proyectos de ciencia, tecnología e innovación que están contribuyendo
            al desarrollo regional y nacional.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar proyectos..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <Button type="submit" disabled={loading}>
              Buscar
            </Button>
          </form>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-sm p-8 border">
              <p className="text-gray-500">Cargando proyectos públicos...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-sm p-8 border">
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No se encontraron proyectos que coincidan con tu búsqueda.' : 'No hay proyectos públicos disponibles aún.'}
              </p>
              {!searchTerm && (
                <p className="text-sm text-gray-400">
                  Los investigadores pueden marcar sus proyectos como públicos para compartirlos aquí.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {project.title}
                    </h3>
                    <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.summary}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>{project.proponentEntity}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Package className="w-4 h-4 mr-2" />
                      <span>{project._count.products} productos CTeI</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Por: {project.user.name}</span>
                    <span>
                      {format(new Date(project.createdAt), 'dd/MM/yyyy', { locale: es })}
                    </span>
                  </div>

                  <Link href={`/projects/${project.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Proyecto Completo
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            ¿Eres investigador? Únete a la plataforma para gestionar tus proyectos.
          </p>
          <Link href="/auth/signin">
            <Button size="lg">
              Comenzar a Gestionar Proyectos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}