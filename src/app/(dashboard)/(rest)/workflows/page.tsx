import {WorkflowList  , WorkflowConatiner, WorkflowLoading, WorkflowError}from '@/features/workflows/components/workflows';
import { workflowPAramsLoader } from '@/features/workflows/server/params-loader';
import { prefetchWorkflows } from '@/features/workflows/server/prefetch';
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server';
import type { SearchParams } from 'nuqs';
import { Suspense} from 'react'
import {ErrorBoundary} from "react-error-boundary" ;


type Props = {
searchParams  : Promise<SearchParams>
};
const page = async ({searchParams}:Props) => {
    await requireAuth() ;
    const params = await workflowPAramsLoader(searchParams) ;
    prefetchWorkflows(params) ;

  return (
<WorkflowConatiner>


    <HydrateClient>
        <ErrorBoundary fallback={<WorkflowError/>}>
            <Suspense fallback={<WorkflowLoading/>}>
                <WorkflowList/>
            </Suspense>
        </ErrorBoundary>
    </HydrateClient>
   
</WorkflowConatiner>


  )
}

export default page
