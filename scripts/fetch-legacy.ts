import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'
import iconv from 'iconv-lite'

const BASE_URL = 'https://longfellow.ru'
const LEGACY_DIR = path.join(process.cwd(), 'public', 'legacy')

type FetchTarget = {
  url: string
  savePath: string
}

function ensureDir(p: string) {
  const dir = path.dirname(p)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

async function fetchBuffer(
  url: string
): Promise<{ buf: Buffer; contentType: string | null }> {
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const contentType = res.headers.get('content-type')
  const ab = await res.arrayBuffer()
  return { buf: Buffer.from(ab), contentType }
}

function decodeHtml(buf: Buffer, contentType: string | null): string {
  const ct = contentType || ''
  const m = ct.match(/charset=([^;]+)/i)
  let charset = (m && m[1].toLowerCase()) || ''
  if (!charset) {
    const sniff = buf.slice(0, 2048).toString('latin1')
    const m2 = sniff.match(/charset=["']?([^"'>\s]+)/i)
    if (m2) charset = m2[1].toLowerCase()
  }
  if (!charset) charset = 'utf-8'
  try {
    return iconv.decode(buf, charset)
  } catch {
    return buf.toString('utf8')
  }
}

function isServer404(html: string): boolean {
  // Локальная 404-заглушка LiteSpeed
  return (
    /<title>\s*404 Not Found/i.test(html) &&
    /Proudly powered by LiteSpeed/i.test(html)
  )
}

function saveFile(p: string, data: Buffer | string) {
  ensureDir(p)
  fs.writeFileSync(p, data)
}

function resolveAssetPath(assetHref: string): string | null {
  if (/^(https?:)?\/\//.test(assetHref)) return null
  const clean = assetHref.replace(/^\/*/, '')
  if (!clean) return null
  // только в пределах legacy
  return path.join(LEGACY_DIR, clean)
}

async function downloadPage(
  urlPath: string,
  saveRelPath: string,
  assets: Set<string>
) {
  const url = new URL(urlPath, BASE_URL).toString()
  const savePath = path.join(LEGACY_DIR, saveRelPath)
  const { buf, contentType } = await fetchBuffer(url)
  const html = decodeHtml(buf, contentType)
  if (isServer404(html)) throw new Error(`Remote 404 content for ${url}`)
  saveFile(savePath, html)
  const $ = cheerio.load(html)
  $('img[src], script[src], link[href]').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('href') || ''
    const p = resolveAssetPath(src)
    if (p) assets.add(src.replace(/^\/*/, ''))
  })
}

async function downloadAsset(relPath: string) {
  const url = new URL(relPath, BASE_URL + '/').toString()
  const savePath = path.join(LEGACY_DIR, relPath)
  const { buf } = await fetchBuffer(url)
  saveFile(savePath, buf)
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

async function crawlLinksFor(
  pattern: RegExp,
  htmlPathRel: string,
  urlPath: string
): Promise<string[]> {
  const filePath = path.join(LEGACY_DIR, htmlPathRel)
  let html = ''
  try {
    html = fs.readFileSync(filePath, 'utf8')
  } catch {
    const { buf, contentType } = await fetchBuffer(
      new URL(urlPath, BASE_URL).toString()
    )
    html = decodeHtml(buf, contentType)
  }
  const $ = cheerio.load(html)
  const out: string[] = []
  $('a[href]').each((_, a) => {
    const href = ($(a).attr('href') || '').trim()
    const m = href.match(pattern)
    if (m) out.push(m[1])
  })
  return uniq(out)
}

async function main() {
  const assets = new Set<string>()
  const pages: FetchTarget[] = [
    { url: '/', savePath: 'index.html' },
    { url: '/books', savePath: 'books.html' },
    { url: '/buklets', savePath: 'buklets.html' },
    { url: '/shedevry', savePath: 'shedevry.html' },
    { url: '/films', savePath: 'films.html' },
    { url: '/cards', savePath: 'cards.html' },
    { url: '/calendars', savePath: 'calendars.html' },
    { url: '/authors.html', savePath: 'authors.html' },
    { url: '/contacts.html', savePath: 'contacts.html' },
    { url: '/present.html', savePath: 'present.html' },
    { url: '/robots.txt', savePath: 'robots.txt' },
  ]

  for (const p of pages) {
    try {
      await downloadPage(p.url, p.savePath, assets)
      console.log('Saved', p.savePath)
    } catch (e) {
      console.error('Failed', p.url, e)
    }
  }

  const itemIdsRoot = await crawlLinksFor(/item_id=(\d+)/i, 'index.html', '/')
  const itemIdsBooks = await crawlLinksFor(
    /item_id=(\d+)/i,
    'books.html',
    '/books'
  )
  const itemIdsBuklets = await crawlLinksFor(
    /item_id=(\d+)/i,
    'buklets.html',
    '/buklets'
  )
  const catIdsShedevry = await crawlLinksFor(
    /cat_id=(\d+)/i,
    'shedevry.html',
    '/shedevry'
  )

  for (const id of itemIdsRoot) {
    const rel = `index.html@item_id=${id}.html`
    try {
      await downloadPage(`/?item_id=${id}`, rel, assets)
      console.log('Saved', rel)
    } catch (e) {
      console.error('Failed item root', id, e)
    }
  }

  for (const id of itemIdsBooks) {
    const rel = `books/index.html@item_id=${id}.html`
    try {
      await downloadPage(`/books?item_id=${id}`, rel, assets)
      console.log('Saved', rel)
    } catch (e) {
      console.error('Failed item books', id, e)
    }
  }

  for (const id of itemIdsBuklets) {
    const rel = `buklets/index.html@item_id=${id}.html`
    try {
      await downloadPage(`/buklets?item_id=${id}`, rel, assets)
      console.log('Saved', rel)
    } catch (e) {
      console.error('Failed item buklets', id, e)
    }
  }

  for (const id of catIdsShedevry) {
    const rel = `shedevry/index.html@cat_id=${id}.html`
    try {
      await downloadPage(`/shedevry?cat_id=${id}`, rel, assets)
      console.log('Saved', rel)
    } catch (e) {
      console.error('Failed cat shedevry', id, e)
    }
  }

  // Скачать ассеты, которых ещё нет
  const assetList = Array.from(assets).filter((a) =>
    /^(img2\/|shopimg\/|Scripts\/|long\.ico$)/i.test(a)
  )
  for (const rel of assetList) {
    const savePath = path.join(LEGACY_DIR, rel)
    if (fs.existsSync(savePath)) continue
    try {
      await downloadAsset(rel)
      console.log('Asset', rel)
    } catch (e) {
      console.error('Asset failed', rel, e)
    }
  }

  // Финальный проход: собрать ассеты из всех локальных HTML и докачать недостающие
  const htmlFiles: string[] = []
  const stack = [LEGACY_DIR]
  while (stack.length) {
    const dir = stack.pop()!
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f)
      const st = fs.statSync(p)
      if (st.isDirectory()) stack.push(p)
      else if (f.endsWith('.html')) htmlFiles.push(p)
    }
  }

  const extraAssets = new Set<string>()
  for (const f of htmlFiles) {
    const html = fs.readFileSync(f, 'utf8')
    const $ = cheerio.load(html)
    $('img[src],link[href],script[src]').each((_, el) => {
      const raw = ($(el).attr('src') || $(el).attr('href') || '').trim()
      if (!raw) return
      // Нормализуем ../shopimg/*, /shopimg/*, shopimg/* → shopimg/* (и аналогично для img2/)
      const norm = raw.replace(/^\/+/, '').replace(/^\.\.\//, '')
      if (/^(shopimg|img2|Scripts)\//i.test(norm) || /long\.ico$/i.test(norm)) {
        extraAssets.add(norm)
      }
    })
  }

  for (const rel of extraAssets) {
    const savePath = path.join(LEGACY_DIR, rel)
    if (fs.existsSync(savePath)) continue
    try {
      await downloadAsset(rel)
      console.log('Extra asset', rel)
    } catch (e) {
      console.error('Extra asset failed', rel, e)
    }
  }

  console.log('Done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
