import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductImage from '@/components/ProductImage'

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
            <button className='bg-yellow-400 hover:bg-orange-400 text-black px-3 py-1 rounded text-sm transition-colors font-medium'>
              В корзину
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
