'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'

const productSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200, 'Máximo 200 caracteres'),
  summary: z.string().min(1, 'El resumen es requerido').max(500, 'Máximo 500 caracteres'),
  description: z.string().optional(),
  productUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  productTypeId: z.string().min(1, 'El tipo de producto es requerido'),
  projectId: z.string().min(1, 'El proyecto es requerido'),
  isPublic: z.boolean().default(false),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductType {
  id: string
  code: string
  description: string
  quality: string
  category: string
}

interface Project {
  id: string
  title: string
}

interface Product {
  id?: string
  title: string
  summary: string
  description?: string | null
  productUrl?: string | null
  productTypeId: string
  projectId: string
  isPublic: boolean
}

interface ProductFormProps {
  product?: Product
  projectId?: string
  onSubmit?: (data: ProductFormData) => Promise<void>
  isLoading?: boolean
}

export function ProductForm({ product, projectId, onSubmit, isLoading = false }: ProductFormProps) {
  const router = useRouter()
  const [productTypes, setProductTypes] = useState<ProductType[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      ...product,
      description: product.description || undefined,
      productUrl: product.productUrl || '',
    } : {
      projectId: projectId || '',
      isPublic: false,
      productUrl: '',
    },
  })

  // Fetch product types and projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product types
        const typesResponse = await fetch('/api/product-types')
        if (typesResponse.ok) {
          const types = await typesResponse.json()
          setProductTypes(types)
        }

        // Fetch projects if not provided
        if (!projectId) {
          const projectsResponse = await fetch('/api/projects')
          if (projectsResponse.ok) {
            const projectsData = await projectsResponse.json()
            setProjects(projectsData)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Error al cargar los datos')
      }
    }

    fetchData()
  }, [projectId])

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      if (onSubmit) {
        await onSubmit(data)
      } else {
        // Default submit logic
        const url = product?.id ? `/api/products/${product.id}` : '/api/products'
        const method = product?.id ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Error al guardar el producto')
        }

        const savedProduct = await response.json()
        toast.success(product?.id ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente')

        // Redirect to product detail or project detail
        router.push(`/dashboard/projects/${data.projectId}`)
      }
    } catch (error) {
      console.error('Error submitting product:', error)
      toast.error(error instanceof Error ? error.message : 'Error al guardar el producto')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Group product types by category
  const groupedProductTypes = productTypes.reduce((acc, type) => {
    if (!acc[type.category]) {
      acc[type.category] = []
    }
    acc[type.category].push(type)
    return acc
  }, {} as Record<string, ProductType[]>)

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Título */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título del Producto CTeI *
        </label>
        <input
          type="text"
          id="title"
          {...register('title')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Ingrese el título del producto"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Resumen */}
      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
          Resumen Ejecutivo *
        </label>
        <textarea
          id="summary"
          rows={3}
          {...register('summary')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Describa brevemente el producto, sus características y beneficios"
        />
        {errors.summary && (
          <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Descripción Detallada
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Proporcione una descripción más detallada del producto (opcional)"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Proyecto y Tipo de Producto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!projectId && (
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
              Proyecto Asociado *
            </label>
            <select
              id="projectId"
              {...register('projectId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Seleccione un proyecto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="productTypeId" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Producto CTeI *
          </label>
          <select
            id="productTypeId"
            {...register('productTypeId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Seleccione un tipo de producto</option>
            {Object.entries(groupedProductTypes).map(([category, types]) => (
              <optgroup key={category} label={category}>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.description} ({type.quality})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.productTypeId && (
            <p className="mt-1 text-sm text-red-600">{errors.productTypeId.message}</p>
          )}
        </div>
      </div>

      {/* URL del Producto */}
      <div>
        <label htmlFor="productUrl" className="block text-sm font-medium text-gray-700 mb-2">
          URL del Producto
        </label>
        <input
          type="url"
          id="productUrl"
          {...register('productUrl')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="https://ejemplo.com/producto"
        />
        {errors.productUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.productUrl.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Enlace al producto si está disponible en línea (opcional)
        </p>
      </div>

      {/* Público */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublic"
          {...register('isPublic')}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
          Producto Público
        </label>
        <p className="ml-2 text-xs text-gray-500">
          Los productos públicos son visibles para todos los visitantes
        </p>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting ? 'Guardando...' : product?.id ? 'Actualizar Producto' : 'Crear Producto'}
        </Button>
      </div>
    </form>
  )
}