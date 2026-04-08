import Link from 'next/link'

const NotFound = () => {
  return (
    <div className='flex flex-col gap-10 justify-center items-center h-screen'>
      <h1>Page Not Found</h1>
      <Link href='/'>Go Back Home</Link>
    </div>
  )
}

export default NotFound
