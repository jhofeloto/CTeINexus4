'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, File, CheckCircle } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface FileUploadDropzoneProps {
  onFileSelect: (files: File[]) => void
  onFileRemove?: (file: File) => void
  maxFiles?: number
  maxSize?: number // in bytes
  accept?: Record<string, string[]>
  disabled?: boolean
  className?: string
  selectedFiles?: File[]
}

export function FileUploadDropzone({
  onFileSelect,
  onFileRemove,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    'text/*': ['.txt', '.csv'],
  },
  disabled = false,
  className,
  selectedFiles = [],
}: FileUploadDropzoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(selectedFiles)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...uploadedFiles, ...acceptedFiles].slice(0, maxFiles)
      setUploadedFiles(newFiles)
      onFileSelect(newFiles)
    },
    [uploadedFiles, maxFiles, onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: maxFiles - uploadedFiles.length,
    disabled,
  })

  const removeFile = (fileToRemove: File) => {
    const newFiles = uploadedFiles.filter(file => file !== fileToRemove)
    setUploadedFiles(newFiles)
    onFileSelect(newFiles)
    onFileRemove?.(fileToRemove)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive && !isDragReject && 'border-primary-500 bg-primary-50',
          isDragReject && 'border-red-500 bg-red-50',
          !isDragActive && !isDragReject && 'border-gray-300 hover:border-primary-400',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">
            {isDragActive
              ? 'Suelta los archivos aquí...'
              : 'Arrastra y suelta archivos aquí, o haz clic para seleccionar'}
          </p>
          <p className="text-xs text-gray-500">
            Máximo {maxFiles} archivos, hasta {formatFileSize(maxSize)} cada uno
          </p>
          <p className="text-xs text-gray-400">
            PDF, Word, Excel, imágenes y archivos de texto
          </p>
        </div>
      </div>

      {/* Selected files list */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">
            Archivos seleccionados ({uploadedFiles.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload status */}
      {uploadedFiles.length === maxFiles && (
        <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
          <CheckCircle className="h-4 w-4" />
          <span>Has alcanzado el límite máximo de archivos</span>
        </div>
      )}
    </div>
  )
}