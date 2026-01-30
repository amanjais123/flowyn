"use client" ;
import {formatDistanceToNow} from "date-fns"
 import React from 'react'
import { useSuspenseExecution, useSuspenseExecutions } from '../hooks/use-executions'
import  {EntityHeader, EntityContainer, EntitySearch, EntityPagination, LoadingView, EmptyView, EntityList, EntityItem  } from '@/components/entity-components';
import { useExecutionsParams } from '../hooks/use-executions-params';
 import { CredentialType } from "@/generated/prisma/enums";
 import {  Execution } from "@/generated/prisma/client";
  import  {ExecutionStatus } from "@/generated/prisma/enums";

import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";


 export const ExecutionsList = () => {
const executions = useSuspenseExecutions() ;

   return (
<EntityList
items={executions.data.items}
getKey={(execution) => execution.id}
renderItems={(execution) => <ExecutionItem data={execution}/>}
emptyView={<ExecutionsEmpty/>}
/>
   )
 }

 export const ExecutionsHeader = () => {


return (

  <EntityHeader
  title='Executions'
  description='View your workflow execution history'
  />

) ;
 }



 export const ExecutionsPagination = () => {
    const executions = useSuspenseExecutions() ;
    const [params , setParams] = useExecutionsParams() ;

    return(
        <EntityPagination
        disabled={executions.isFetching}
        totalpages={executions.data.totalPages}
        page={executions.data.page} 
        onPageChange={(page) => setParams({...params , page})}
        />
    );
 };




export const ExecutionsConatiner = ({
    children 
} : {children : React.ReactNode;}) =>{
    return (
        <EntityContainer
        header={<ExecutionsHeader/>}
        pagination = {<ExecutionsPagination/>}
        >
            {children}
        </EntityContainer>
    )
}


export const ExecutionsLoading = () => {
    return <LoadingView message='Loading Executions...'/>
}

export const ExecutionsError = () => {
    return <LoadingView message='Error loading Executions'/>
}
 

export const ExecutionsEmpty = () => {
    return (
        <EmptyView
        message="No Execution history found . Get started by running a workflow"
        />
    
    )
};

const getStatusIcon = (status : ExecutionStatus) => {
    switch(status){
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className="size-5 text-green-600"/>
        case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-red-600"/>    
         case ExecutionStatus.RUNNING:
            return <Loader2Icon className="size-5 text-blue-600 animate-spin"/>
        default:
            return <ClockIcon className="size-5 text-muted-foreground"/>
    }
}





export const ExecutionItem = ({
    data ,

} : {data : Execution & {
    workflow : {
        id : string ;
        name  : string ;
    }
}}) => {

const duration = data.completedAt
? Math.round(
    (new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime())/1000 ,
 ) : null ;

const subtitle = (
    <>
    {data.workflow.name} &bull; Started{" "}
    {formatDistanceToNow(data.startedAt, {addSuffix:true})}
    {duration !== null && <> &bull; Took {duration}s </>}
    </>
)
    return (
        <EntityItem 
        href={`/executions/${data.id}`}
        title={data.status}
        subtitle={subtitle}
        image={
            <div className='flex items-center justify-center'>
                {getStatusIcon(data.status)}
            </div>
        }

        />
    )
}


 



function useSuspenseCredential() {
    throw new Error("Function not implemented.");
}

