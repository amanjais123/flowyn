import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
const AuthLayout = ({children} : {children : React.ReactNode ;}) => {
  return (
       <div className='bg-muted flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10'>
<div className='flex w-full max-w-sm flex-col gap-4'>
    <Link href="/" className='flex items-center  self-center font-medium'>
<Image
  src="/floww.svg"
  alt="Flowyn Logo"
  width={64}
  height={64}
  className="h-10 w-auto opacity-90"
/>		
 <span className="text-3xl font-semibold tracking-tight leading-none py-1 mx-2">
      Flowyn
    </span>

    </Link>
    {children}
    </div>
    </div>
  )
}

export default AuthLayout ; 
