import React from 'react';
import { BookCard } from './components/BookCard';
import { Menu } from 'lucide-react';

const BOOKS = [
  {
    id: 1,
    title: "ВЗОЙДИ НА ВЫСОЧАЙШУЮ ВЕРШИНУ",
    subtitle: "книга первая • Путь Высшего Я",
    author: "Марк Л. Профет и Элизабет Клэр Профет",
    description: (
      <div className="space-y-4">
        <p>
          Эта книга - Вечное Евангелие для эпохи Водолея - краеугольный камень в современной метафизической литературе. Она - о Пути Высшего Я. В ней вновь открыты людям утерянные было человечеством научные законы Идентичности, Природы и самой Жизни. Этот незаменимый путеводитель для покорителей духовных высот поможет им осуществить свою мечту - подняться на высочайшую из вершин, увидеть Свет и встретиться с Господом Богом лицом к лицу.
        </p>
        <p>
          На страницах книги изложена древняя мудрость, которую передают нам сегодня Вознесенные Владыки - те, кто успешно окончил школу Земли и по стопам Христа вознесся в Высшее Сознание. Они - истинные гиды на Стезе, так как сами уже прошли этот Путь и теперь протягивают руку помощи нам.
        </p>
        <p className="font-semibold text-gray-900 italic">
          Дерзайте! Восхождение началось, и нет дороги назад!
        </p>
      </div>
    ),
    specs: "Твердый переплет. 10 цветных иллюстраций. 150/213мм. 624 страницы.",
    price: "715",
    coverUrl: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBzcGlyaXR1YWwlMjBtb3VudGFpbnxlbnwxfHx8fDE3NzI5ODg1MDd8MA&ixlib=rb-4.1.0&q=80&w=800"
  },
  {
    id: 2,
    title: "ВЛАДЫКИ И ИХ ОБИТЕЛИ",
    subtitle: "Энциклопедия",
    author: "Марк Л. Профет и Элизабет Клэр Профет",
    description: (
      <div className="space-y-4">
        <p>
          Эта книга является первой выпущенной в России энциклопедией по Вознесенным Владыкам и их обителям. Здесь представлены те Владыки, которые давали свои учения через Посланников Марка и Элизабет Профет. 
        </p>
        <p>
          Статьи включают краткое описание пути Владык, некоторые данные об их жизни и воплощениях на Земле, информацию об их отличительных качествах и дарах, краткое изложение их ключевых учений. Во второй части книги дано описание священнообителей - домов Владык в небесном мире. 
        </p>
        <p>
          Читая эту книгу, вы можете распознать своего Владыку, покровительствующего вам лично, а также узнать об обителях, которые можете посещать в тонком теле во время ночного сна.
        </p>
      </div>
    ),
    specs: "Твердый переплет с золотым тиснением. 170/242мм. 592 стр.",
    price: "850",
    coverUrl: "https://images.unsplash.com/photo-1542785291-fe3faea39066?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBhdXJhJTIwc3BhY2UlMjBzdGFyc3xlbnwxfHx8fDE3NzI5ODg1MDd8MA&ixlib=rb-4.1.0&q=80&w=800"
  },
  {
    id: 3,
    title: "ВЛАДЫКИ СЕМИ ЛУЧЕЙ",
    subtitle: "Зеркало сознания",
    author: "Марк Л. Профет и Элизабет Клэр Профет",
    description: (
      <div className="space-y-4">
        <p>
          Книга знакомит читателя с Вознесенными Владыками - чоханами семи лучей Святого Духа, которые являются наставниками человечества Земли. В ней две части. 
        </p>
        <p>
          В первой рассказано об их наиболее значительных воплощениях, приведены эпизоды из их прошлых жизней на легендарных континентах в цивилизациях, скрытых песками времен. Вам станет понятен путь становления чоханом и то, как подготовить свою собственную душу к вознесению. 
        </p>
        <p>
          Во второй части книги даны ключевые диктовки этих великих Учителей.
        </p>
      </div>
    ),
    specs: "Твёрдый переплет, 17 цветных иллюстраций, 25 фотографий и рисунков. 145/210мм. 448 страниц.",
    price: "690",
    coverUrl: "https://images.unsplash.com/photo-1667517259024-937d4b2993b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBuYXR1cmUlMjBtZWRpdGF0aW9ufGVufDF8fHx8MTc3Mjk4ODUwN3ww&ixlib=rb-4.1.0&q=80&w=800"
  },
  {
    id: 4,
    title: "ВОСПИТАНИЕ ДУШИ ВАШЕГО РЕБЕНКА",
    subtitle: "",
    author: "Элизабет Клэр Профет; Составители и редакторы Нэнси Херн и Джои Беннетт",
    description: (
      <div className="space-y-4">
        <p>
          Эта книга предназначена для духовной подготовки будущих родителей. Она откроет вам:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-800">
          <li>как общаться с душой ребенка до его появления на свет;</li>
          <li>каким образом духовно подготовить себя к рождению ребенка;</li>
          <li>как помочь своему будущему ребенку достичь максимального потенциала и выполнить миссию жизни;</li>
          <li>какие молитвы и медитации рекомендуются для зачатия и защиты той особой души, которой хотите дать рождение;</li>
          <li>как использовать звук, музыку и искусство для совершенствования тела, ума и души вашего еще не рожденного дитя.</li>
        </ul>
        <p>
          Книга содержит схемы, иллюстрации, список рекомендованных музыкальных произведений, медитации, визуализации и утверждения.
        </p>
      </div>
    ),
    specs: "Мягкий переплет. 132/210 мм. 208 страниц.",
    price: "420",
    coverUrl: "https://images.unsplash.com/photo-1769762831275-006982c097d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBicmlnaHQlMjBhYnN0cmFjdCUyMGVuZXJneXxlbnwxfHx8fDE3NzI5ODg1MDd8MA&ixlib=rb-4.1.0&q=80&w=800"
  }
];

// Пункты меню из вашего скриншота
const MENU_ITEMS = [
  "буклеты",
  "к н и г и",
  "ещё книги",
  "ф и л ь м ы",
  "открытки",
  "календарики",
  "презентации",
  "а в т о р ы",
  "контакты"
];

export default function App() {
  return (
    // Применен ваш фон bg-[#ccffcc]
    <div className="min-h-screen bg-[#ccffcc] font-sans text-gray-900 flex flex-col md:flex-row">
      
      {/* 
        ЛЕВОЕ МЕНЮ (Сайдбар)
        Воссоздано по вашему скриншоту: темно-зеленый фон, листики-кнопки
      */}
      <aside className="w-full md:w-[220px] bg-[#009900] flex-shrink-0 md:min-h-screen md:sticky top-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.1)]">
        {/* Логотип Лонгфелло */}
        <div className="pt-6 pb-8 px-4 flex flex-col items-center">
          <div className="text-[#FFCC00] text-sm font-serif mb-2 font-bold tracking-widest uppercase">Лонгфелло</div>
          <div className="w-16 h-16 rounded-full border border-[#FFCC00] flex items-center justify-center bg-gradient-to-br from-[#008000] to-[#005500] shadow-[0_0_15px_rgba(255,204,0,0.3)]">
            <div className="w-10 h-10 border-2 border-[#FFCC00] rotate-45 flex items-center justify-center">
              <div className="w-full h-0.5 bg-[#FFCC00]"></div>
              <div className="w-0.5 h-full bg-[#FFCC00] absolute"></div>
            </div>
          </div>
        </div>
        
        {/* Меню в виде листиков */}
        <nav className="flex flex-col gap-1 pr-4">
          {MENU_ITEMS.map((item, idx) => (
            <a 
              key={idx} 
              href="#" 
              // Форма "листика" создается за счет скругления правых углов (rounded-r-full)
              className="block bg-gradient-to-r from-[#0a380a] to-[#144d14] text-[#FFCC00] font-bold text-sm py-3 px-6 shadow-[2px_2px_8px_rgba(0,0,0,0.4)] hover:brightness-125 transition-all"
              style={{ borderRadius: '0 30px 30px 0' }}
            >
              {item}
            </a>
          ))}
          
          <div className="mt-8 text-center text-[#FFCC00] font-bold text-sm px-4 leading-relaxed hover:brightness-125 cursor-pointer transition-all">
            Выездной<br/>семинар
          </div>
        </nav>
      </aside>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="flex-1 w-full flex flex-col min-w-0">
        
        {/* Мобильная шапка (показывается только на телефонах) */}
        <div className="md:hidden flex items-center justify-between bg-[#008000] p-4 text-white">
          <div className="font-serif font-bold tracking-wider uppercase">Лонгфелло</div>
          <button className="p-2 text-white">
            <Menu size={24} />
          </button>
        </div>

        {/* Зеленая шапка сайта */}
        <header className="bg-[#009900] text-center py-6 hidden md:block border-b border-[#007700]">
          <div className="text-xs uppercase tracking-[0.3em] text-[#99ff99] mb-2 font-bold">Учения вознесенных владык</div>
          <h1 className="text-4xl font-serif text-[#FFCC00] font-bold italic drop-shadow-md">Книги</h1>
        </header>

        {/* Желтая панель (поиск и корзина) */}
        <div className="bg-[#FFCC00] px-4 py-3 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 shadow-sm sticky top-0 z-10">
          <div className="flex w-full sm:w-auto gap-2 max-w-lg">
            <input 
              type="text" 
              placeholder="Поиск книг..." 
              className="px-4 py-2 rounded bg-white w-full sm:w-[350px] focus:outline-none text-sm text-gray-800 shadow-inner" 
            />
            <button className="bg-[#00A000] hover:bg-[#008000] text-white px-5 py-2 rounded text-sm font-semibold transition-colors shadow-sm">
              Поиск
            </button>
          </div>
          <div className="text-sm font-semibold text-gray-800">
            Товаров: 0, Сумма: 0 ₽
          </div>
        </div>

        {/* Сетка книг */}
        <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
          <div className="flex flex-col gap-10">
            {BOOKS.map((book) => (
              <BookCard
                key={book.id}
                {...book}
              />
            ))}
          </div>
        </div>
        
      </main>
    </div>
  );
}