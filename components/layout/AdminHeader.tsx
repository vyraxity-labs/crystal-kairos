import AvatarMenu from '../common/AvatarMenu'
import { Bell } from 'lucide-react'
import { Button } from '../ui/button'

const AdminHeader = () => {
  return (
    <div className='border-b border-outline-variant'>
      <div className='w-[90%] mx-auto py-2 flex justify-end'>
        <div className='flex gap-3 items-center'>
          <Button size='icon' variant='outline'>
            <Bell />
          </Button>
          <AvatarMenu />
        </div>
      </div>
    </div>
  )
}

export default AdminHeader
