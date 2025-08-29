import Image from 'next/image'

export default function Footer() {
  return (
    <footer className='w-full flex flex-col items-center'>
      {/* Спейсер */}
      <div className='h-[30px]' />

      {/* Основная часть footer с тремя изображениями */}
      <div className='flex items-center justify-center'>
        <Image
          src='/legacy/img2/mp_d_left_us.gif'
          alt=''
          width={258}
          height={107}
          className='block'
        />
        <a href='#top' className='block'>
          <Image
            src='/legacy/img2/mp_d_fleur.gif'
            alt='Наверх'
            width={81}
            height={107}
            className='block hover:opacity-80 transition-opacity'
          />
        </a>
        <Image
          src='/legacy/img2/mp_d_right_us.gif'
          alt=''
          width={258}
          height={107}
          className='block'
        />
      </div>

      {/* Спейсер */}
      <div className='h-[30px]' />

      {/* Нижняя часть с угловым элементом и фоном */}
      <div className='w-full flex'>
        <div className='w-[10px] bg-[#008000]'>
          <Image
            src='/legacy/img2/mp_d_corner.gif'
            alt=''
            width={10}
            height={10}
            className='block'
          />
        </div>
        <div
          className='flex-1 h-[31px] flex items-center justify-center'
          style={{
            backgroundImage: "url('/legacy/img2/mp_h_bg.gif')",
            backgroundRepeat: 'repeat-x',
          }}
        >
          <div className='w-[10px] h-[31px]' />
        </div>
      </div>
    </footer>
  )
}
