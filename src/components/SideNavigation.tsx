import Link from 'next/link'
import Image from 'next/image'
import menuItems from './navigation'

export default function SideNavigation() {
  return (
    <div className='hidden lg:block fixed left-0 top-0 h-full w-[125px] z-40 bg-red-500'>
      {/* Фоновый узор */}
      <div
        className='absolute inset-0 w-full h-full bg-red-500'
        style={{
          backgroundImage: 'url(/legacy/img2/cp_uzor.gif)',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Меню */}
      <nav className='relative z-10 bg-red-500'>
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
          </tbody>
        </table>
      </nav>

      {/* Декоративный элемент справа от меню */}
      <div className='absolute top-0 right-[-42px] z-10 bg-red-500'>
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
