'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { FileUploadDropzone } from '@/components/ui/file-upload-dropzone'
import { useFileUpload } from '@/lib/hooks/use-file-upload'
import { toast } from 'react-hot-toast'

const projectSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200, 'Máximo 200 caracteres'),
  summary: z.string().min(1, 'El resumen es requerido').max(1000, 'Máximo 1000 caracteres'),
  keywords: z.array(z.string()).min(1, 'Al menos una palabra clave es requerida').max(10, 'Máximo 10 palabras clave'),
  status: z.enum(['PROPOSED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  proponentEntity: z.string().min(1, 'La entidad proponente es requerida').max(200, 'Máximo 200 caracteres'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().min(0, 'El presupuesto debe ser positivo').optional(),
  isPublic: z.boolean().default(false),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface Project {
  id?: string
  title: string
  summary: string
  keywords: string[]
  status: 'PROPOSED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  proponentEntity: string
  startDate?: string | null
  endDate?: string | null
  budget?: number | null
  isPublic: boolean
}

interface ProjectFormProps {
  project?: Project
  onSubmit?: (data: ProjectFormData) => Promise<void>
  isLoading?: boolean
}

const statusOptions = [
  { value: 'PROPOSED', label: 'Propuesto' },
  { value: 'IN_PROGRESS', label: 'En Progreso' },
  { value: 'COMPLETED', label: 'Completado' },
  { value: 'CANCELLED', label: 'Cancelado' },
]

export function ProjectForm({ project, onSubmit, isLoading = false }: ProjectFormProps) {
  const router = useRouter()
  const [keywordInput, setKeywordInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // File upload hook - only initialize if we have a project ID (for editing)
  const fileUpload = useFileUpload({
    entityType: 'project',
    entityId: project?.id || 'temp', // Use temp ID for new projects
    onSuccess: (attachment) => {
      console.log('File uploaded successfully:', attachment)
    },
    onError: (error) => {
      console.error('File upload error:', error)
    },
  })

  // Load existing files when editing a project
  useEffect(() => {
    if (project?.id) {
      fileUpload.loadExistingFiles().then(files => {
        fileUpload.setUploadedFiles(files)
      })
    }
  }, [project?.id])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project ? {
      ...project,
      budget: project.budget || undefined,
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
    } : {
      status: 'PROPOSED',
      isPublic: false,
      keywords: [],
    },
  })

  const keywords = watch('keywords') || []

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim()) && keywords.length < 10) {
      setValue('keywords', [...keywords, keywordInput.trim()])
      setKeywordInput('')
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    setValue('keywords', keywords.filter(k => k !== keywordToRemove))
  }

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      if (onSubmit) {
        await onSubmit(data)
      } else {
        // Default submit logic
        const url = project?.id ? `/api/projects/${project.id}` : '/api/projects'
        const method = project?.id ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Error al guardar el proyecto')
        }

        const savedProject = await response.json()
        toast.success(project?.id ? 'Proyecto actualizado exitosamente' : 'Proyecto creado exitosamente')

        // Redirect to project detail or projects list
        router.push(`/dashboard/projects/${savedProject.id}`)
      }
    } catch (error) {
      console.error('Error submitting project:', error)
      toast.error(error instanceof Error ? error.message : 'Error al guardar el proyecto')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Título */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título del Proyecto *
        </label>
        <input
          type="text"
          id="title"
          {...register('title')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Ingrese el título del proyecto"
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
          rows={4}
          {...register('summary')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Describa brevemente el proyecto, sus objetivos y metodología"
        />
        {errors.summary && (
          <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
        )}
      </div>

      {/* Palabras clave */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Palabras Clave *
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Agregar palabra clave"
          />
          <Button type="button" onClick={addKeyword} disabled={!keywordInput.trim()}>
            Agregar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="ml-1 text-primary-600 hover:text-primary-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {errors.keywords && (
          <p className="mt-1 text-sm text-red-600">{errors.keywords.message}</p>
        )}
      </div>

      {/* Estado y Entidad Proponente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Estado del Proyecto *
          </label>
          <select
            id="status"
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="proponentEntity" className="block text-sm font-medium text-gray-700 mb-2">
            Entidad Proponente *
          </label>
          <input
            type="text"
            id="proponentEntity"
            {...register('proponentEntity')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Universidad, empresa o institución"
          />
          {errors.proponentEntity && (
            <p className="mt-1 text-sm text-red-600">{errors.proponentEntity.message}</p>
          )}
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Inicio
          </label>
          <input
            type="date"
            id="startDate"
            {...register('startDate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Finalización
          </label>
          <input
            type="date"
            id="endDate"
            {...register('endDate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Presupuesto y Público */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            Presupuesto (COP)
          </label>
          <input
            type="number"
            id="budget"
            {...register('budget', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="0"
            min="0"
          />
          {errors.budget && (
            <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            {...register('isPublic')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
            Proyecto Público
          </label>
          <p className="ml-2 text-xs text-gray-500">
            Los proyectos públicos son visibles para todos los visitantes
          </p>
        </div>
      </div>

      {/* Archivos adjuntos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Archivos Adjuntos
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Sube documentos relacionados con tu proyecto (PDF, Word, Excel, imágenes, etc.)
        </p>
        <FileUploadDropzone
          onFileSelect={(files) => {
            // Handle file selection - files will be uploaded when form is submitted
            console.log('Files selected:', files)
          }}
          onFileRemove={(file) => {
            console.log('File removed:', file)
          }}
          selectedFiles={[]} // We'll manage this state separately
          disabled={isSubmitting}
        />
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
          {isSubmitting ? 'Guardando...' : project?.id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        </Button>
      </div>
    </form>
  )
}