'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductImage from '@/components/ProductImage'
import { useCart } from '@/hooks/useCart'

type Product = {
  id: string
  title: string
  author?: string | null
  thumbnailUrl?: string | null
  shortDescription?: string | null
  price?: number | null
  dimensions?: string | null
  pages?: number | null
  publisher?: string | null
  publishYear?: number | null
  isbn?: string | null
}

type BookCardProps = {
  product: Product
}

export default function BookCard({ product }: BookCardProps) {
  const { addToCart, getItemQuantity } = useCart()

  const handleAddToCart = () => {
    if (!product.price) return

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnailUrl: product.thumbnailUrl || undefined,
      author: product.author || undefined,
    })
  }

  const itemQuantity = getItemQuantity(product.id)

  return (
    <Card
      id='commonCard'
      className={`overflow-hidden hover:shadow-lg transition-shadow`}
    >
      <CardHeader className='p-4'>
        {product.thumbnailUrl && (
          <div className='flex justify-center mb-4'>
            <ProductImage
              src={product.thumbnailUrl}
              alt={product.title}
              width={100}
              height={150}
              useNativeSize={true}
              sizes='100px'
            />
          </div>
        )}
        <CardTitle className='text-lg font-semibold line-clamp-2 text-center'>
          {product.title}
        </CardTitle>
        {product.author && (
          <p className='text-sm text-gray-600 italic'>{product.author}</p>
        )}
      </CardHeader>
      <CardContent className='p-4 pt-0'>
        {product.shortDescription && (
          <div className='text-base text-gray-900 line-clamp-3 mb-4'>
            {product.shortDescription}
          </div>
        )}

        <div className='text-base text-gray-500 mb-4 space-y-1'>
          {product.dimensions && <div>Размер: {product.dimensions}</div>}
          {product.pages && <div>Страниц: {product.pages}</div>}
          {product.publisher && <div>Издательство: {product.publisher}</div>}
          {product.publishYear && <div>Год: {product.publishYear}</div>}
          {product.isbn && <div>ISBN: {product.isbn}</div>}
        </div>

        {product.price && (
          <div className='flex justify-between items-center'>
            <span className='text-2xl font-bold text-green-600'>
              {product.price} ₽
            </span>
            <div className='flex items-center gap-2'>
              {itemQuantity > 0 && (
                <span className='text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded'>
                  {itemQuantity} шт.
                </span>
              )}
              <button
                onClick={handleAddToCart}
                className='bg-yellow-400 hover:bg-orange-400 text-black px-4 py-2 rounded-md transition-colors font-medium'
              >
                В корзину
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
