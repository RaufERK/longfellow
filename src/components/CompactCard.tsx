'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductImage from '@/components/ProductImage'
import { useCart } from '@/hooks/useCart'

type Product = {
  id: string
  title: string
  thumbnailUrl?: string | null
  shortDescription?: string | null
  price?: number | null
  dimensions?: string | null
}

type CompactCardProps = {
  product: Product
  variant: 'cards' | 'calendars'
}

export default function CompactCard({ product, variant }: CompactCardProps) {
  const imageWidth = variant === 'calendars' ? 60 : 80
  const imageHeight = variant === 'calendars' ? 90 : 120

  const { addToCart, getItemQuantity } = useCart()

  const handleAddToCart = () => {
    if (!product.price) return

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnailUrl: product.thumbnailUrl || undefined,
    })
  }

  const itemQuantity = getItemQuantity(product.id)

  return (
    <Card className='overflow-hidden hover:shadow-lg transition-shadow'>
      <CardHeader className='p-4'>
        {product.thumbnailUrl && (
          <div className='flex justify-center mb-4'>
            <ProductImage
              src={product.thumbnailUrl}
              alt={product.title}
              width={imageWidth}
              height={imageHeight}
              useNativeSize={true}
              sizes={`${imageWidth}px`}
            />
          </div>
        )}
        <CardTitle className='font-semibold line-clamp-2 text-center'>
          {product.title}
        </CardTitle>
      </CardHeader>
      <CardContent className='p-4 pt-0'>
        {product.shortDescription && (
          <div className='text-base text-gray-600 line-clamp-2 mb-3'>
            {product.shortDescription}
          </div>
        )}

        {variant === 'calendars' && product.dimensions && (
          <div className='text-sm text-gray-500 mb-2'>{product.dimensions}</div>
        )}

        {product.price && (
          <div className='flex justify-between items-center'>
            <span className='text-lg font-bold text-green-600'>
              {product.price} ₽
            </span>
            <div className='flex items-center gap-2'>
              {itemQuantity > 0 && (
                <span className='text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded'>
                  {itemQuantity}
                </span>
              )}
              <button
                onClick={handleAddToCart}
                className='bg-yellow-400 hover:bg-orange-400 text-black px-3 py-1 rounded transition-colors font-medium'
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
