import { renderHook, act } from '@testing-library/react'
import { useFileUpload } from '@/lib/hooks/use-file-upload'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock react-hot-toast
const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
}

jest.mock('react-hot-toast', () => mockToast)

describe('useFileUpload', () => {
  const defaultOptions = {
    entityType: 'project' as const,
    entityId: 'test-id',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          attachment: { id: 'attachment-id', name: 'test.jpg' }
        })
      }
      mockFetch.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useFileUpload(defaultOptions))

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

      let attachment
      await act(async () => {
        attachment = await result.current.uploadFile(file)
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/upload', {
        method: 'POST',
        body: expect.any(FormData)
      })

      expect(attachment).toEqual({ id: 'attachment-id', name: 'test.jpg' })
      expect(result.current.uploadedFiles).toContain(attachment)
    })

    it('should handle upload error', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: 'Upload failed'
        })
      }
      mockFetch.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useFileUpload(defaultOptions))

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

      await expect(act(async () => {
        await result.current.uploadFile(file)
      })).rejects.toThrow('Upload failed')
    })

    it('should call onSuccess callback', async () => {
      const onSuccess = jest.fn()
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          attachment: { id: 'attachment-id' }
        })
      }
      mockFetch.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useFileUpload({ ...defaultOptions, onSuccess }))

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

      await act(async () => {
        await result.current.uploadFile(file)
      })

      expect(onSuccess).toHaveBeenCalledWith({ id: 'attachment-id' })
    })
  })

  describe('uploadFiles', () => {
    it('should upload multiple files', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          attachment: { id: 'attachment-id' }
        })
      }
      mockFetch.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useFileUpload(defaultOptions))

      const files = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })
      ]

      let results
      await act(async () => {
        results = await result.current.uploadFiles(files)
      })

      expect(results).toHaveLength(2)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({})
      }
      mockFetch.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useFileUpload(defaultOptions))

      // Add a file to uploadedFiles
      act(() => {
        result.current.setUploadedFiles([{ id: 'attachment-id' }])
      })

      let success
      await act(async () => {
        success = await result.current.deleteFile('attachment-id')
      })

      expect(success).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith('/api/upload?id=attachment-id', {
        method: 'DELETE'
      })
      expect(result.current.uploadedFiles).toHaveLength(0)
    })

    it('should handle delete error', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: 'Delete failed'
        })
      }
      mockFetch.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useFileUpload(defaultOptions))

      const success = await act(async () => {
        return await result.current.deleteFile('attachment-id')
      })

      expect(success).toBe(false)
    })
  })

  describe('loadExistingFiles', () => {
    it('should return empty array', async () => {
      const { result } = renderHook(() => useFileUpload(defaultOptions))

      let files
      await act(async () => {
        files = await result.current.loadExistingFiles()
      })

      expect(files).toEqual([])
    })
  })
})