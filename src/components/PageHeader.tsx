interface PageHeaderProps {
  titleImage: string
  titleAlt: string
}

export default function PageHeader({ titleImage, titleAlt }: PageHeaderProps) {
  return (
    <div className='w-full'>
      {/* Основная зелёная секция с заголовком */}
      <div className='bg-green-600 w-full h-[50px] flex items-center justify-center relative'>
        <div className='text-center'>
          {/* Основной логотип "Учения Вознесенных Владык" */}
          <img
            src='/legacy/img2/mp_teaching.gif'
            width={342}
            height={45}
            alt='Учения Вознесенных Владык'
            className='block mb-1'
            style={{ imageRendering: 'pixelated' }}
          />
          {/* Заголовок страницы */}
          <img
            src={`/legacy/img2/${titleImage}`}
            alt={titleAlt}
            className='block'
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>

      {/* Декоративная нижняя секция */}
      <div className='flex w-full h-[10px]'>
        {/* Левый угол */}
        <div className='w-[9px] flex-shrink-0'>
          <img
            src='/legacy/img2/mp_h_corner.gif'
            width={9}
            height={10}
            alt=''
            className='block'
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        {/* Растягивающийся фон */}
        <div
          className='flex-1 h-[10px]'
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
