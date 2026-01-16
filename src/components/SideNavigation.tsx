import Link from 'next/link'
import Image from 'next/image'
import menuItems from './menuItems'

export default function SideNavigation() {
  return (
    <div className='hidden lg:block fixed left-0 top-0 h-full w-[125px] z-40'>
      {/* Фоновый узор */}
      <div
        className='absolute inset-0 w-full h-full'
        style={{
          backgroundImage: 'url(/legacy/img2/cp_uzor.gif)',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Меню */}
      <nav className='relative z-10'>
        <table className='border-collapse'>
          <tbody>
            {menuItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <Link href={item.href} className='block'>
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      className='block hover:opacity-90 transition-opacity'
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </Link>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <Link
                  href='/seminar'
                  className='block text-center text-[20px] font-bold text-[#f9e000] px-2 py-3 hover:text-[#ffe666] drop-shadow-[0_0_8px_rgba(0,0,0,0.55)] hover:drop-shadow-[0_0_14px_rgba(0,0,0,0.75)] hover:scale-[1.05] transition-all leading-snug'
                  style={{
                    fontFamily: 'Times, "Times New Roman", serif',
                    backgroundColor: 'transparent',
                  }}
                >
                  Выездной семинар
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </nav>

      {/* Декоративный элемент справа от меню */}
      <div className='absolute top-0 right-[-42px] z-10'>
        <div className='h-[179px] w-[42px] bg-[#ccffcc]' />
        <Image
          src='/legacy/img2/menu_10.gif'
          alt=''
          width={42}
          height={418}
          className='block'
          style={{ imageRendering: 'pixelated' }}
        />
        <div className='h-[800px] bg-[#ccffcc]' />
      </div>
    </div>
  )
}
