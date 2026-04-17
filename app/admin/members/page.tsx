import MembersData from '@/components/admin/MembersData'
import { Suspense } from 'react'

const MembersPage = async () => {
  return (
    <div className='container mx-auto py-10 mb-10'>
      <Suspense fallback={<div>Loading members...</div>}>
        <MembersData />
      </Suspense>
    </div>
  )
}

export default MembersPage
