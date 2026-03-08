import React from 'react';
import { ShoppingCart, BookOpen } from 'lucide-react';

interface BookCardProps {
  title: string;
  author: string;
  subtitle?: string;
  description: React.ReactNode;
  specs: string;
  price: string;
  coverUrl: string;
}

export const BookCard: React.FC<BookCardProps> = ({
  title,
  author,
  subtitle,
  description,
  specs,
  price,
  coverUrl,
}) => {
  return (
    // Картинка справа, текст слева (md:flex-row-reverse)
    <div className="flex flex-col md:flex-row-reverse bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,100,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,100,0,0.15)] transition-all duration-300 border border-green-200 group">
      
      {/* Правая часть - Обложка */}
      <div className="w-full md:w-[260px] lg:w-[300px] flex-shrink-0 bg-white p-8 flex flex-col items-center justify-center relative border-l border-green-50">
        <div className="relative w-full aspect-[2/3] max-w-[200px] md:max-w-full group-hover:-translate-y-2 transition-transform duration-500">
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover rounded shadow-[0_12px_24px_rgba(0,0,0,0.15)] ring-1 ring-black/5"
          />
        </div>
      </div>

      {/* Левая часть - Информация */}
      <div className="p-6 md:p-8 lg:p-10 flex flex-col flex-grow justify-between">
        <div>
          {/* Заголовок и Авторы */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl lg:text-[26px] font-bold text-gray-900 leading-tight uppercase tracking-tight font-serif mb-2 group-hover:text-[#008000] transition-colors cursor-pointer">
              {title}
            </h2>
            <p className="text-[16px] text-gray-600 italic font-medium mb-2">
              {author}
            </p>
            {subtitle && (
              <p className="inline-block text-xs font-bold text-green-800 uppercase tracking-wider bg-green-100 px-3 py-1.5 rounded mb-4">
                {subtitle}
              </p>
            )}
          </div>

          {/* Описание книги */}
          <div className="text-gray-800 leading-relaxed text-[15px] mb-6">
            {description}
          </div>

          {/* Характеристики */}
          <div className="flex items-start gap-3 text-sm text-gray-600 mb-8 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
            <BookOpen size={18} className="text-green-700 mt-0.5 shrink-0" />
            <span className="leading-snug">{specs}</span>
          </div>
        </div>

        {/* Подвал карточки - Фраза убрана, кнопки разнесены */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
          <div className="text-3xl font-bold text-green-700 font-serif">
            {price} <span className="text-xl">₽</span>
          </div>
          <button className="bg-[#FFCC00] hover:bg-[#FFD633] text-gray-900 font-bold py-3 px-8 rounded-xl transition-all shadow-sm flex items-center gap-2 active:scale-95 hover:shadow-md">
            <ShoppingCart size={18} />
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
};