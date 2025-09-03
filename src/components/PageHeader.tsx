import Image from 'next/image'

const titleImageSizes: Record<string, { width: number; height: number }> = {
  'h_autors.gif': { width: 155, height: 45 },
  'h_booklets.gif': { width: 168, height: 45 },
  'h_books.gif': { width: 117, height: 45 },
  'h_calendars.gif': { width: 250, height: 50 },
  'h_calendars.png': { width: 225, height: 45 },
  'h_dennion.gif': { width: 504, height: 45 },
  'h_faces.gif': { width: 209, height: 45 },
  'h_kontakts.gif': { width: 206, height: 45 },
  'h_present.gif': { width: 253, height: 45 },
}

interface PageHeaderProps {
  titleImage: string
  titleAlt: string
}

export default function PageHeader({ titleImage, titleAlt }: PageHeaderProps) {
  const imageDimensions = titleImageSizes[titleImage] || {
    width: 200,
    height: 45,
  }
  return (
    <div
      className='w-full relative z-10'
      style={{
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Основная зелёная секция с заголовком */}
      <div className='bg-[#008000] w-full h-[90px] flex items-center justify-center relative'>
        <div className='flex flex-col items-center'>
          {/* Основной логотип "Учения Вознесенных Владык" */}
          <Image
            id='title'
            src='/legacy/img2/mp_teaching.gif'
            width={342}
            height={45}
            alt='Учения Вознесенных Владык'
            style={{ imageRendering: 'pixelated' }}
          />
          {/* Заголовок страницы */}
          <Image
            id='title-image'
            src={`/legacy/img2/${titleImage}`}
            width={imageDimensions.width}
            height={imageDimensions.height}
            alt={titleAlt}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>

      {/* Декоративная нижняя секция */}
      <div className='flex w-full'>
        {/* Левый угол */}
        {/* <div className='w-[9px] h-[50px]'>
        </div> */}
        <div className='bg-[#008000] w-[9px] h-[50px]' />
        {/* Растягивающийся фон */}
        <div
          className='flex-1 h-[50px]'
          style={{
            backgroundImage: 'url(/legacy/img2/mp_h_bg.gif)',
            backgroundRepeat: 'repeat-x',
            imageRendering: 'pixelated',
          }}
        />
      </div>
    </div>
  )
}
