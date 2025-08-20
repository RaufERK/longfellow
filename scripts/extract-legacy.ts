import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'

type BookRecord = {
  legacyId: number | null
  title: string
  priceRub: number | null
  coverUrl: string | null
  description: string | null
  htmlPath: string
}

const legacyRoot = path.join(process.cwd(), 'public', 'legacy')

function listHtmlFiles(dir: string): string[] {
  const out: string[] = []
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    const st = fs.statSync(p)
    if (st.isDirectory()) out.push(...listHtmlFiles(p))
    else if (f.endsWith('.html')) out.push(p)
  }
  return out
}

function extractIdFromFilename(file: string): number | null {
  const m = file.match(/index\.html@item_id=(\d+)\.html$/)
  return m ? Number(m[1]) : null
}

function cleanText(t: string): string {
  return t
    .replace(/\s+/g, ' ')
    .replace(/\u00A0/g, ' ')
    .trim()
}

function parseBook(filePath: string): BookRecord | null {
  const html = fs.readFileSync(filePath, 'utf8')
  const $ = cheerio.load(html)
  const legacyId = extractIdFromFilename(filePath)

  let title = ''
  let priceRub: number | null = null
  let coverUrl: string | null = null
  let description: string | null = null

  // Heuristics based on legacy markup
  // Title from H1-like image alt near header or bold text
  const altTitle = $('img[alt]')
    .map((_, el) => $(el).attr('alt') || '')
    .get()
    .find((a) => /книга|владыки|ребёнка|враг|вознесени/i.test(a))
  if (altTitle) title = cleanText(altTitle)

  // Try main <title>
  if (!title) title = cleanText($('title').first().text())

  // Price
  const priceText = $('body')
    .text()
    .match(/(\d+)\s*руб\./i)
  if (priceText) priceRub = Number(priceText[1])

  // Cover
  const coverFromImg = $('img[src*="shopimg/"]')
    .map((_, el) => $(el).attr('src') || '')
    .get()[0]
  if (coverFromImg)
    coverUrl = coverFromImg.startsWith('/') ? coverFromImg : `/${coverFromImg}`

  // Description: take a large text block around the center content
  const bodyText = cleanText($('body').text())
  description = bodyText.slice(0, 1000)

  if (!legacyId && !/books|item_id/.test(filePath)) return null

  return {
    legacyId: legacyId ?? null,
    title: title || 'Без названия',
    priceRub: priceRub ?? null,
    coverUrl: coverUrl ?? null,
    description: description ?? null,
    htmlPath:
      '/' + path.relative(legacyRoot, filePath).split(path.sep).join('/'),
  }
}

async function main() {
  const files = listHtmlFiles(legacyRoot)
  const items: BookRecord[] = []
  for (const f of files) {
    if (!/index\.html@item_id=\d+\.html$/.test(f)) continue
    const rec = parseBook(f)
    if (rec) items.push(rec)
  }
  items.sort((a, b) => (a.legacyId || 0) - (b.legacyId || 0))
  const outPath = path.join(process.cwd(), 'scripts', 'seed.json')
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2), 'utf8')
  console.log(`Extracted ${items.length} items -> ${outPath}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

