import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
const AuthLayout = ({children} : {children : React.ReactNode ;}) => {
  return (
       <div className='bg-muted flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10'>
<div className='flex w-full max-w-sm flex-col'>
    <Link href="/" className='flex items-center  self-center font-medium'>
<Image
  src="/logoo.png"
  alt="Nodebase"
  height={100}
  width={200}
/>

    </Link>
    {children}
    </div>
    </div>
  )
}

export default AuthLayout ; 
