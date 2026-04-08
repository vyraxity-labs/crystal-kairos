import { navItems } from './data'
import NavButton from './NavButton'

const PublicDesktopNav = () => {
  return (
    <div className='flex gap-1 items-center'>
      {navItems.map((item) => {
        return <NavButton key={item.id} href={item.href} label={item.label} />
      })}
    </div>
  )
}

export default PublicDesktopNav
