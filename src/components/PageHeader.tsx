import Image from 'next/image'

interface PageHeaderProps {
  titleImage: string
  titleAlt: string
}

export default function PageHeader({ titleImage, titleAlt }: PageHeaderProps) {
  return (
    <div className='w-full'>
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
            width={200}
            height={30}
            alt={titleAlt}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>

      {/* Декоративная нижняя секция */}
      <div className='flex w-full'>
        {/* Левый угол */}
        <div className='w-[9px] h-[50px]'>
          <div className='bg-[#008000] w-[9px] h-[40px]' />
          <Image
            src='/legacy/img2/mp_h_corner.gif'
            width={9}
            height={50}
            alt=''
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
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
