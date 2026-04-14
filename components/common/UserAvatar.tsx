import { User } from 'lucide-react'
import { Avatar, AvatarFallback } from '../ui/avatar'

const UserAvatar = () => {
  return (
    <div className='flex gap-2 items-center'>
      <Avatar>
        <AvatarFallback>
          <User />
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

export default UserAvatar
