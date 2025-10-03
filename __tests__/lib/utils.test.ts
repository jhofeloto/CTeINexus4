import { cn } from '@/lib/utils'

describe('cn', () => {
  it('should return a single class name', () => {
    expect(cn('class1')).toBe('class1')
  })

  it('should combine multiple class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('should handle conditional classes', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2')
  })

  it('should merge conflicting Tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('should handle arrays of classes', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2')
  })

  it('should handle objects with conditional classes', () => {
    expect(cn({ 'class1': true, 'class2': false })).toBe('class1')
  })

  it('should handle mixed inputs', () => {
    expect(cn('base', ['conditional'], { 'active': true, 'inactive': false })).toBe('base conditional active')
  })

  it('should return empty string for no inputs', () => {
    expect(cn()).toBe('')
  })

  it('should handle undefined and null values', () => {
    expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2')
  })
})