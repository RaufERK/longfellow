import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await req.formData()
    const file = data.get('image') as File
    const type = data.get('type') as string // 'thumbnail' или 'large'

    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 })
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Файл должен быть изображением' },
        { status: 400 }
      )
    }

    // Максимальный размер 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Файл слишком большой (максимум 5MB)' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Генерируем уникальное имя файла
    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `${type}_${timestamp}.${extension}`

    // Определяем папку в зависимости от типа
    const uploadDir = join(
      process.cwd(),
      'public',
      'images',
      'products',
      'uploads'
    )

    // Создаем папку если не существует
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Возвращаем относительный путь для базы данных
    const relativePath = `/images/products/uploads/${filename}`

    return NextResponse.json({
      success: true,
      path: relativePath,
      filename: filename,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки файла' },
      { status: 500 }
    )
  }
}
