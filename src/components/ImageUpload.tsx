'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imagePath: string) => void
  type: 'thumbnail' | 'large'
  label: string
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  type,
  label,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true)

      try {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('type', type)

        const response = await fetch('/api/moderator/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          onImageChange(result.path)
          setPreviewImage(URL.createObjectURL(file))
        } else {
          const error = await response.json()
          alert(`Ошибка загрузки: ${error.error}`)
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert('Ошибка загрузки файла')
      } finally {
        setUploading(false)
      }
    },
    [type, onImageChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const imageFile = files.find((file) => file.type.startsWith('image/'))

      if (imageFile) {
        uploadFile(imageFile)
      } else {
        alert('Пожалуйста, загрузите изображение')
      }
    },
    [uploadFile]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const displayImage = previewImage || currentImage

  return (
    <div>
      <label
        className='block text-lg font-medium mb-2'
        style={{ fontSize: '18px' }}
      >
        {label}
      </label>

      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${
            isDragging
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-green-400'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{ minHeight: '120px' }}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleFileInput}
          className='hidden'
        />

        {uploading ? (
          <div className='flex flex-col items-center justify-center h-full'>
            <div className='text-lg mb-2'>⏳ Загружается...</div>
          </div>
        ) : displayImage ? (
          <div className='flex flex-col items-center'>
            <div className='relative w-32 h-32 mb-2'>
              <Image
                src={displayImage}
                alt='Предпросмотр'
                fill
                className='object-contain rounded'
                sizes='(max-width: 128px) 100vw, 128px'
              />
            </div>
            <div className='text-sm text-gray-600 mb-2'>
              {currentImage ? 'Текущее изображение' : 'Новое изображение'}
            </div>
            <div className='text-sm text-blue-600'>
              Нажмите или перетащите для замены
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-full'>
            <div className='text-4xl mb-2'>📸</div>
            <div className='text-lg mb-2' style={{ fontSize: '18px' }}>
              Перетащите изображение сюда
            </div>
            <div className='text-sm text-gray-500'>
              или нажмите для выбора файла
            </div>
          </div>
        )}
      </div>

      {currentImage && (
        <div className='mt-2 text-sm text-gray-600'>
          Текущий путь:{' '}
          <code className='bg-gray-100 px-2 py-1 rounded'>{currentImage}</code>
        </div>
      )}
    </div>
  )
}
