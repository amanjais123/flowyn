import { CredentialForm } from '@/features/credentials/components/credential';
import { requireAuth } from '@/lib/auth-utils'
import React from 'react'

const page = async () => {
    await requireAuth() ;


  return (
    <div className='p-4 md:px-10 md:py-6'>
<div className='mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full'>


</div>
<CredentialForm/>
    </div>
  )
}

export default page
