### LONGFELLOW — Summary & План работ

#### Цель
- **Склонировать и сохранить** текущий сайт как статическое зеркало для непрерывной доступности.
- **Постепенно переписать** на современный стек (Next.js + TS + Tailwind + shadcn/ui + Prisma + SQLite → Postgres при росте).
- **Сохранить SEO/ссылки**, включая старые `?item_id=` и разделы.

Источник: [longfellow.ru](https://longfellow.ru/)

#### Выбранный стек (MVP → масштабирование)
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui
- **Backend (внутри Next)**: API routes
- **DB (старт)**: SQLite через Prisma; файл `prisma/dev.db` не коммитим
- **DB (позже)**: миграция на Postgres без переписывания кода ORM

#### Решения и стандарты
- `prisma/dev.db` добавлен в `.gitignore`. В репозиторий коммитим только `schema.prisma`, `migrations/*`, сиды.
- Продакшен-БД на VPS: `DATABASE_URL="file:/var/longfellow/data/prod.db"` или Postgres; снапшоты/бэкапы обязательны.
- Legacy отдаем из `public/legacy/`. Новые страницы — постепенно в `src/app/*`.
- Фоллбек: пока раздел не переписан — отдаем соответствующий `legacy/*.html` или iframe.

#### Текущее состояние (сделано)
- Создан проект: Next.js + TS + Tailwind + shadcn/ui
- Сайт зеркалирован и размещен в `public/legacy` (html/css/js/изображения)
- Настроены базовые rewrites в `next.config.ts` для основных разделов и ассетов
- Главная страница рендерит `legacy/index.html` через iframe
- Добавлен Prisma, создана схема с моделями `Category` и `Book`, миграции применены, клиент сгенерирован
- Добавлен `src/lib/prisma.ts`, создан `.env` с `DATABASE_URL=file:./prisma/dev.db`
- `prisma/dev.db` добавлен в `.gitignore`
- Поднят dev-сервер, проверена отдача зеркала

#### Наблюдения по зеркалу
- В iframe фиксируются 404 на относительные ссылки вида `/legacy/books`, `/legacy/buklets` и часть ассетов `/legacy/img2/*`.
  - Причина: внутри `legacy/index.html` ссылки без `.html`, а у нас файлы `books.html`, `buklets.html` и т.д.
  - Требуется доп. правило: маппинг `/legacy/:section` → `/legacy/:section.html` для известных разделов.
  - Проверить наличие конкретных файлов из `img2/*` и соответствие регистру/имен.

#### Ближайший бэклог (P0-P1)
- P0: Добавить rewrites для относительных ссылок внутри iframe:
  - `/legacy/books` → `/legacy/books.html`
  - `/legacy/buklets` → `/legacy/buklets.html`
  - `/legacy/shedevry` → `/legacy/shedevry.html`
  - `/legacy/films` → `/legacy/films.html`
  - `/legacy/cards` → `/legacy/cards.html`
  - `/legacy/calendars` → `/legacy/calendars.html`
  - `/legacy/authors` → `/legacy/authors.html`
  - `/legacy/contacts` → `/legacy/contacts.html`
- P0: Проверить пути ассетов `/legacy/img2/:path*`, `/legacy/shopimg/:path*` и добросить правило, если потребуется.
- P1: Роут для старых ссылок `/?item_id=ID` → новая страница `/books/ID` (temp: ведем на соответствующий `legacy/index.html@item_id=ID.html`).
- P1: Страница `/books` (новая) со списком из БД, карточка `/books/[id]` с fallback на legacy-контент, если запись не импортирована.

#### Импорт контента из legacy (скрипт)
- Пройтись по `public/legacy/` и извлечь:
  - `legacyId` из имен вида `index.html@item_id=123.html`
  - `title`, `priceRub`, `coverUrl`, `description` (парсинг HTML)
  - `htmlPath` для fallback
- Записать в `seed.json`, затем — сидинг в Prisma.

#### Навигация и совместимость ссылок
- Сохранить разделы: `/books`, `/buklets`, `/shedevry`, `/films`, `/cards`, `/calendars`, `/authors`, `/contacts`, `/present`
- Старые параметры `?item_id=` поддержать через rewrites/redirects к новым роутам.

#### Деплой на VPS (черновик)
- Node.js LTS, процесс-менеджер (pm2/systemd), обратный прокси (nginx/caddy)
- `.env` с `DATABASE_URL` (SQLite файл или Postgres)
- `npm ci && npx prisma migrate deploy && npm run build && npm run start`
- Бэкап БД и логов

#### Таймлайн (ожидаемо)
- День 1: Зеркало, базовая конфигурация, Prisma, dev
- День 2: rewrites для iframe-ссылок, парсер контента, сидинг
- День 3: `/books` и `/books/[id]` на новом UI, редиректы `?item_id=`
- Далее: разделы по очереди, формы заказов/контактов, SEO, деплой

#### Риски/заметки
- Нестандартные имена файлов и регистр в `img2/*`: проверить соответствие путей
- Смешанные кодировки/старые HTML: парсер должен быть устойчивым
- На росте: перевод на Postgres

#### Следующие действия (исполнить)
- Добавить rewrites для `/legacy/:section` → `/legacy/:section.html`
- Написать парсер, собрать `seed.json`, выполнить сидинг
- Создать новые страницы `/books` и `/books/[id]` с fallback на legacy


