import fs from 'node:fs/promises'
import path from 'node:path'

export const dynamic = 'force-static'

export default async function HelpPage() {
  const helpPath = path.join(process.cwd(), 'ARCHITECTURE', 'help.txt')
  let content = ''
  try {
    content = await fs.readFile(helpPath, 'utf8')
  } catch {
    content = 'Файл помощи не найден.'
  }

  return (
    <main className='mx-auto max-w-3xl p-6 prose prose-zinc'>
      <h1 className='mb-4 text-2xl font-semibold'>Помощь</h1>
      <pre className='whitespace-pre-wrap break-words text-sm leading-6 bg-muted/40 p-4 rounded-md'>
        {content}
      </pre>
    </main>
  )
}
