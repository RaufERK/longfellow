import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { mkdir, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join, resolve } from 'path'

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

const ALLOWED_KINDS = new Set(['thumbnail', 'large'])
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await req.formData()
    const file = data.get('image')
    const type = data.get('type')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 })
    }

    const kind = typeof type === 'string' ? type : ''
    if (!ALLOWED_KINDS.has(kind)) {
      return NextResponse.json({ error: 'Некорректный тип изображения' }, { status: 400 })
    }

    const extension = ALLOWED_MIME_TYPES[file.type]
    if (!extension) {
      return NextResponse.json(
        { error: 'Допустимы только JPEG, PNG, WebP и GIF' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Файл слишком большой (максимум 5MB)' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${kind}_${Date.now()}_${randomUUID()}.${extension}`
    const uploadDir = resolve(
      process.cwd(),
      'public',
      'images',
      'products',
      'uploads'
    )
    const filepath = resolve(join(uploadDir, filename))

    if (!filepath.startsWith(uploadDir + '/') && filepath !== uploadDir) {
      return NextResponse.json({ error: 'Ошибка загрузки файла' }, { status: 400 })
    }

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    await writeFile(filepath, buffer)

    const relativePath = `/images/products/uploads/${filename}`

    return NextResponse.json({
      success: true,
      path: relativePath,
      filename,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки файла' },
      { status: 500 }
    )
  }
}
