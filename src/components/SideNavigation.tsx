import Link from 'next/link'
import Image from 'next/image'

const menuItems = [
  {
    href: '/',
    image: '/legacy/img2/menu_00.gif',
    alt: 'На главную',
    width: 125,
    height: 169,
  },
  {
    href: '/buklets',
    image: '/legacy/img2/menu_01.gif',
    alt: 'Буклеты',
    width: 125,
    height: 51,
  },
  {
    href: '/',
    image: '/legacy/img2/menu_02.gif',
    alt: 'Книги',
    width: 125,
    height: 45,
  },
  {
    href: '/more',
    image: '/legacy/img2/menu_03.gif',
    alt: 'Ещё книги',
    width: 125,
    height: 50,
  },
  {
    href: '/films',
    image: '/legacy/img2/menu_04.gif',
    alt: 'Фильмы',
    width: 125,
    height: 51,
  },
  {
    href: '/cards',
    image: '/legacy/img2/menu_05.gif',
    alt: 'Открытки',
    width: 125,
    height: 48,
  },
  {
    href: '/calendars',
    image: '/legacy/img2/menu_06.gif',
    alt: 'Календарики',
    width: 125,
    height: 48,
  },
  {
    href: '/presentations',
    image: '/legacy/img2/menu_07.gif',
    alt: 'Презентации',
    width: 125,
    height: 41,
  },
  {
    href: '/authors',
    image: '/legacy/img2/menu_08.gif',
    alt: 'Авторы',
    width: 125,
    height: 46,
  },
  {
    href: '/contacts',
    image: '/legacy/img2/menu_09.gif',
    alt: 'Контакты',
    width: 125,
    height: 62,
  },
]

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
          </tbody>
        </table>
      </nav>

      {/* Декоративный элемент справа от меню */}
      <div className='absolute top-0 right-[-42px] z-10'>
        <div className='h-[179px] w-[34px]'></div>
        <Image
          src='/legacy/img2/menu_10.gif'
          alt=''
          width={42}
          height={418}
          className='block'
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  )
}
