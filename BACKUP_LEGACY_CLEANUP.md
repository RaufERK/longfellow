# БЭКАП ДЛЯ ОТКАТА LEGACY ОЧИСТКИ

## Дата создания: $(date)

## Ключевые файлы для отката:

### 1. next.config.ts (ТЕКУЩЕЕ СОСТОЯНИЕ)
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      { source: '/', destination: '/legacy/index.html' },
      // detail pages via query strings (place BEFORE generic routes)
      {
        source: '/books',
        has: [{ type: 'query', key: 'item_id', value: '(?<id>.*)' }],
        destination: '/legacy/books/index.html@item_id=:id.html',
      },
      {
        source: '/buklets',
        has: [{ type: 'query', key: 'item_id', value: '(?<id>.*)' }],
        destination: '/legacy/buklets/index.html@item_id=:id.html',
      },
      {
        source: '/shedevry',
        has: [{ type: 'query', key: 'cat_id', value: '(?<id>.*)' }],
        destination: '/legacy/shedevry/index.html@cat_id=:id.html',
      },
      // generic section routes
      { source: '/books', destination: '/legacy/books.html' },
      { source: '/buklets', destination: '/legacy/buklets.html' },
      { source: '/shedevry', destination: '/legacy/shedevry.html' },
      { source: '/films', destination: '/legacy/films.html' },
      { source: '/cards', destination: '/legacy/cards.html' },
      { source: '/calendars', destination: '/legacy/calendars.html' },
      { source: '/authors.html', destination: '/legacy/authors.html' },
      { source: '/contacts.html', destination: '/legacy/contacts.html' },
      { source: '/present.html', destination: '/legacy/present.html' },
      // help should NOT go to legacy
      { source: '/authors', destination: '/legacy/authors.html' },
      { source: '/contacts', destination: '/legacy/contacts.html' },
      { source: '/present', destination: '/legacy/present.html' },
      // legacy internal links without .html
      // legacy internal links without .html
      {
        source: '/legacy/books',
        has: [{ type: 'query', key: 'item_id', value: '(?<id>.*)' }],
        destination: '/legacy/books/index.html@item_id=:id.html',
      },
      {
        source: '/legacy/buklets',
        has: [{ type: 'query', key: 'item_id', value: '(?<id>.*)' }],
        destination: '/legacy/buklets/index.html@item_id=:id.html',
      },
      {
        source: '/legacy/shedevry',
        has: [{ type: 'query', key: 'cat_id', value: '(?<id>.*)' }],
        destination: '/legacy/shedevry/index.html@cat_id=:id.html',
      },
      { source: '/legacy/books', destination: '/legacy/books.html' },
      { source: '/legacy/buklets', destination: '/legacy/buklets.html' },
      { source: '/legacy/shedevry', destination: '/legacy/shedevry.html' },
      { source: '/legacy/films', destination: '/legacy/films.html' },
      { source: '/legacy/cards', destination: '/legacy/cards.html' },
      { source: '/legacy/calendars', destination: '/legacy/calendars.html' },
      { source: '/legacy/authors', destination: '/legacy/authors.html' },
      { source: '/legacy/contacts', destination: '/legacy/contacts.html' },
      { source: '/legacy/present', destination: '/legacy/present.html' },
      // assets referenced from legacy root
      { source: '/img2/:path*', destination: '/legacy/img2/:path*' },
      { source: '/shopimg/:path*', destination: '/legacy/shopimg/:path*' },
      { source: '/Scripts/:path*', destination: '/legacy/Scripts/:path*' },
      { source: '/all.css', destination: '/legacy/all.css' },
      { source: '/all.js', destination: '/legacy/all.js' },
      { source: '/long.ico', destination: '/legacy/long.ico' },
      { source: '/robots.txt', destination: '/legacy/robots.txt' },
      { source: '/index.html', destination: '/legacy/index.html' },
      { source: '/books/index.html', destination: '/legacy/books.html' },
      // detail pages via query strings
      {
        source: '/books',
        has: [{ type: 'query', key: 'item_id', value: '(?<id>.*)' }],
        destination: '/legacy/books/index.html@item_id=:id.html',
      },
      {
        source: '/buklets',
        has: [{ type: 'query', key: 'item_id', value: '(?<id>.*)' }],
        destination: '/legacy/buklets/index.html@item_id=:id.html',
      },
      {
        source: '/legacy/books',
        has: [{ type: 'query', key: 'item_id', value: '(?<id>.*)' }],
        destination: '/legacy/books/index.html@item_id=:id.html',
      },
      {
        source: '/legacy/buklets',
        has: [{ type: 'query', key: 'item_id', value: '(?<id>.*)' }],
        destination: '/legacy/buklets/index.html@item_id=:id.html',
      },
      {
        source: '/shedevry',
        has: [{ type: 'query', key: 'cat_id', value: '(?<id>.*)' }],
        destination: '/legacy/shedevry/index.html@cat_id=:id.html',
      },
      {
        source: '/legacy/shedevry',
        has: [{ type: 'query', key: 'cat_id', value: '(?<id>.*)' }],
        destination: '/legacy/shedevry/index.html@cat_id=:id.html',
      },
      // support legacy query links like /legacy?item_id=123
      {
        source: '/legacy',
        has: [{ type: 'query', key: 'item_id', value: '(?<id>.*)' }],
        destination: '/legacy/index.html@item_id=:id.html',
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'item_id', value: '(?<id>.*)' }],
        destination: '/legacy/index.html@item_id=:id.html',
      },
    ]
  },
}

export default nextConfig
```

### 2. Структура public/legacy/ (ТЕКУЩЕЕ СОСТОЯНИЕ)
```
public/legacy/
├── all.css
├── all.js
├── authors.html
├── books/
│   └── [37 HTML файлов с item_id]
├── books.html
├── buklets/
│   └── [16 HTML файлов с item_id]
├── buklets.html
├── calendars.html
├── cards.html
├── contacts.html
├── films.html
├── help.html
├── img2/
│   └── [48 файлов: 43 .gif, 4 .jpg, 1 .png]
├── index.html
├── [37 HTML файлов с item_id в корне]
├── long.ico
├── present.html
├── robots.txt
├── Scripts/
│   └── AC_RunActiveContent.js
├── shedevry/
│   └── [11 HTML файлов с cat_id]
├── shedevry.html
└── shopimg/
    └── [269 .jpg файлов]
```

### 3. Структура src/app/legacy/ (ТЕКУЩЕЕ СОСТОЯНИЕ)
```
src/app/legacy/
├── books/page.tsx
├── buklets/page.tsx
├── calendars/page.tsx
├── cards/page.tsx
├── films/page.tsx
└── shedevry/page.tsx
```

## КОМАНДЫ ДЛЯ ОТКАТА:

### Если нужно восстановить next.config.ts:
```bash
git checkout HEAD -- next.config.ts
```

### Если нужно восстановить удаленные файлы:
```bash
git checkout HEAD -- public/legacy/
git checkout HEAD -- src/app/legacy/
```

### Если нужно восстановить все изменения:
```bash
git reset --hard HEAD
```

## ПЛАН ОЧИСТКИ ПО ЭТАПАМ:

### ЭТАП 1: Очистка next.config.ts
- Убрать дублирующиеся правила
- Убрать правила для неиспользуемых файлов
- Оставить только необходимые

### ЭТАП 2: Очистка public/legacy/
- Удалить HTML файлы
- Удалить CSS/JS файлы  
- Удалить неиспользуемые изображения
- ОСТАВИТЬ: /legacy/img2/ (используется в компонентах)

### ЭТАП 3: Очистка src/app/legacy/
- Проверить использование
- Удалить если не нужно

### ЭТАП 4: Очистка scripts/
- Удалить устаревшие скрипты

### ЭТАП 5: Очистка ARCHITECTURE/
- Удалить устаревшую документацию

## ПРОВЕРКА ПОСЛЕ КАЖДОГО ЭТАПА:
1. Запустить dev-сервер: `npm run dev`
2. Проверить все основные страницы
3. Проверить что изображения загружаются
4. Проверить что навигация работает
