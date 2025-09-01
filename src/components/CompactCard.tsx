import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductImage from '@/components/ProductImage'

type Product = {
  id: number
  title: string
  thumbnailUrl?: string | null
  shortDescription?: string | null
  price?: string | null
  dimensions?: string | null
}

type CompactCardProps = {
  product: Product
  variant: 'cards' | 'calendars'
}

export default function CompactCard({ product, variant }: CompactCardProps) {
  const imageHeight = variant === 'calendars' ? 'h-40' : 'h-48'
  const sizes =
    variant === 'calendars'
      ? '(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw'
      : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'

  return (
    <Card className='overflow-hidden hover:shadow-lg transition-shadow'>
      <CardHeader className='p-4'>
        {product.thumbnailUrl && (
          <div className={`relative ${imageHeight} mb-4`}>
            <ProductImage
              src={product.thumbnailUrl}
              alt={product.title}
              sizes={sizes}
            />
          </div>
        )}
        <CardTitle className='text-sm font-semibold line-clamp-2'>
          {product.title}
        </CardTitle>
      </CardHeader>
      <CardContent className='p-4 pt-0'>
        {product.shortDescription && (
          <div className='text-xs text-gray-600 line-clamp-2 mb-3'>
            {product.shortDescription}
          </div>
        )}

        {variant === 'calendars' && product.dimensions && (
          <div className='text-xs text-gray-500 mb-2'>{product.dimensions}</div>
        )}

        {product.price && (
          <div className='flex justify-between items-center'>
            <span className='text-lg font-bold text-green-600'>
              {product.price} ₽
            </span>
            <button className='bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded text-sm transition-colors font-medium'>
              В корзину
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
