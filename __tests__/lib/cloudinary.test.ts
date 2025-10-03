import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary'

// Mock cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn(),
    },
  },
}))

const mockCloudinary = require('cloudinary')

describe('uploadToCloudinary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should upload file successfully', async () => {
    const mockResult = {
      secure_url: 'https://example.com/image.jpg',
      public_id: 'test-public-id',
    }

    const mockUploadStream = jest.fn().mockImplementation((options, callback) => {
      callback(null, mockResult)
      return { end: jest.fn() }
    })

    mockCloudinary.v2.uploader.upload_stream = mockUploadStream

    const fileBuffer = Buffer.from('test file content')
    const folder = 'test-folder'

    const result = await uploadToCloudinary(fileBuffer, folder)

    expect(result).toEqual({
      url: mockResult.secure_url,
      publicId: mockResult.public_id,
    })

    expect(mockUploadStream).toHaveBeenCalledWith(
      {
        folder,
        resource_type: 'auto',
      },
      expect.any(Function)
    )
  })

  it('should upload file with publicId', async () => {
    const mockResult = {
      secure_url: 'https://example.com/image.jpg',
      public_id: 'custom-public-id',
    }

    const mockUploadStream = jest.fn().mockImplementation((options, callback) => {
      callback(null, mockResult)
      return { end: jest.fn() }
    })

    mockCloudinary.v2.uploader.upload_stream = mockUploadStream

    const fileBuffer = Buffer.from('test file content')
    const folder = 'test-folder'
    const publicId = 'custom-public-id'

    const result = await uploadToCloudinary(fileBuffer, folder, publicId)

    expect(result).toEqual({
      url: mockResult.secure_url,
      publicId: mockResult.public_id,
    })

    expect(mockUploadStream).toHaveBeenCalledWith(
      {
        folder,
        resource_type: 'auto',
        public_id: publicId,
      },
      expect.any(Function)
    )
  })

  it('should throw error on upload failure', async () => {
    const mockError = new Error('Upload failed')

    const mockUploadStream = jest.fn().mockImplementation((options, callback) => {
      callback(mockError, null)
      return { end: jest.fn() }
    })

    mockCloudinary.v2.uploader.upload_stream = mockUploadStream

    const fileBuffer = Buffer.from('test file content')
    const folder = 'test-folder'

    await expect(uploadToCloudinary(fileBuffer, folder)).rejects.toThrow('Upload failed')
  })

  it('should throw error when result is null', async () => {
    const mockUploadStream = jest.fn().mockImplementation((options, callback) => {
      callback(null, null)
      return { end: jest.fn() }
    })

    mockCloudinary.v2.uploader.upload_stream = mockUploadStream

    const fileBuffer = Buffer.from('test file content')
    const folder = 'test-folder'

    await expect(uploadToCloudinary(fileBuffer, folder)).rejects.toThrow('Upload failed')
  })
})

describe('deleteFromCloudinary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should delete file successfully', async () => {
    const mockResult = { result: 'ok' }

    mockCloudinary.v2.uploader.destroy = jest.fn().mockImplementation((publicId, callback) => {
      callback(null, mockResult)
    })

    const publicId = 'test-public-id'

    await expect(deleteFromCloudinary(publicId)).resolves.toBeUndefined()

    expect(mockCloudinary.v2.uploader.destroy).toHaveBeenCalledWith(publicId, expect.any(Function))
  })

  it('should throw error on delete failure', async () => {
    const mockError = new Error('Delete failed')

    mockCloudinary.v2.uploader.destroy = jest.fn().mockImplementation((publicId, callback) => {
      callback(mockError, null)
    })

    const publicId = 'test-public-id'

    await expect(deleteFromCloudinary(publicId)).rejects.toThrow('Delete failed')
  })
})