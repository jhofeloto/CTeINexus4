import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

interface UseFileUploadOptions {
  entityType: 'project' | 'product'
  entityId: string
  onSuccess?: (attachment: any) => void
  onError?: (error: string) => void
}

export function useFileUpload({
  entityType,
  entityId,
  onSuccess,
  onError,
}: UseFileUploadOptions) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])

  const uploadFile = useCallback(
    async (file: File, fileName?: string) => {
      setIsUploading(true)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('entityType', entityType)
        formData.append('entityId', entityId)
        formData.append('fileName', fileName || file.name)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Error al subir archivo')
        }

        setUploadedFiles(prev => [...prev, result.attachment])
        onSuccess?.(result.attachment)

        if (toast) toast.success('Archivo subido correctamente')
        return result.attachment
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        onError?.(errorMessage)
        if (toast) if (toast) toast.error(errorMessage)
        throw error
      } finally {
        setIsUploading(false)
      }
    },
    [entityType, entityId, onSuccess, onError]
  )

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const uploadPromises = files.map(file => uploadFile(file))
      return Promise.allSettled(uploadPromises)
    },
    [uploadFile]
  )

  const deleteFile = useCallback(
    async (attachmentId: string) => {
      try {
        const response = await fetch(`/api/upload?id=${attachmentId}`, {
          method: 'DELETE',
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Error al eliminar archivo')
        }

        setUploadedFiles(prev => prev.filter(file => file.id !== attachmentId))
        if (toast) toast.success('Archivo eliminado correctamente')
        return true
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        onError?.(errorMessage)
        if (toast) if (toast) toast.error(errorMessage)
        return false
      }
    },
    [onError]
  )

  const loadExistingFiles = useCallback(
    async () => {
      try {
        // This would be implemented to load existing attachments
        // For now, we'll leave it as a placeholder
        return []
      } catch (error) {
        console.error('Error loading existing files:', error)
        return []
      }
    },
    []
  )

  return {
    uploadFile,
    uploadFiles,
    deleteFile,
    loadExistingFiles,
    isUploading,
    uploadedFiles,
    setUploadedFiles,
  }
}