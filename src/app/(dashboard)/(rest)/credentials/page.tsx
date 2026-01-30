import { CredentialsList  ,CredentialsConatiner, CredentialsError, CredentialsLoading} from '@/features/credentials/components/credentials';
import { credentialsParams } from '@/features/credentials/params';
import { credentialsParamsLoader } from '@/features/credentials/server/params-loader';
import { prefetchCredentials } from '@/features/credentials/server/prefetch';
import { requireAuth } from '@/lib/auth-utils';
import { HydrateClient } from '@/trpc/server';
import { SearchParams } from 'nuqs';
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary';


type Props = {
  searchParams : Promise<SearchParams> ;
} ;


const page = async({searchParams} : Props) => {
    await requireAuth() ;

  const params = await credentialsParamsLoader(searchParams) ;
  prefetchCredentials(params) ;



  return (
    <CredentialsConatiner>
  <HydrateClient>
    <ErrorBoundary fallback={<CredentialsError/>}>
      <Suspense fallback={<CredentialsLoading/>}>
      <CredentialsList/>
      </Suspense>
    </ErrorBoundary>
  </HydrateClient>
      </CredentialsConatiner>

  )
}

export default page
