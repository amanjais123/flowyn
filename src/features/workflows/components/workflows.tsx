 "use client" ;
 import {formatDistanceToNow} from "date-fns"
 import React, { useReducer } from 'react'
import { useCreateWorkflow, useRemoveWrokflow, useSuspenseWorkflows } from '../hooks/use-workflows'
import  {EntityHeader, EntityContainer, EntitySearch, EntityPagination, LoadingView, EmptyView, EntityList, EntityItem  } from '@/components/entity-components';
import { useUpgradeModel } from '@/hooks/use-upgrade-model';
import { useRouter } from 'next/navigation';
import { useWorkflowsParams } from '../hooks/use-workflow-params';
import { useEntitySearch } from '@/hooks/use-entity-search';
 import type { Workflow } from '@/generated/prisma/client';
import { WorkflowIcon } from 'lucide-react';
export const WorkflowsSearch = () => {
    const [params , setParams] = useWorkflowsParams() ;
    const {searchValue , onSearchChange} = useEntitySearch({
        params ,
        setParams ,
    }) ;
    return (
        <EntitySearch
        value={searchValue}
        onChange={onSearchChange}
        placeholder='Search Workflows'
        />
    )
}







 export const WorkflowList = () => {
const workflows = useSuspenseWorkflows() ;

   return (
<EntityList
items={workflows.data.items}
getKey={(workflow) => workflow.id}
renderItems={(workflow) => <WorkflowItem data={workflow}/>}
emptyView={<WorkflowEmpty/>}
/>
   )
 }

 export const WorkflowHeader = ({disabled} : {disabled? : boolean}) => {
const createWorkflow = useCreateWorkflow() ;
const {handleError , model } = useUpgradeModel() ;
const router = useRouter() ;
const handleCreate = () => {
    createWorkflow.mutate(undefined , {

        onSuccess:(data)=>{
            router.push(`/workflows/${data.id}`) ;
        },
        onError: (error) => {
            console.error(error) ;
            handleError(error) ;
        }
    })
}

return (
  <> 
  {model}
  <EntityHeader
  title='workflows'
  description='Create and manage your workflows'
  onNew={handleCreate}
  newButtonLabel='New workflow' 
  disabled={disabled} 
  isCreating={createWorkflow.isPending} 
  />
  </>  
) ;
 }



 export const WorkflowsPagination = () => {
    const workflows = useSuspenseWorkflows() ;
    const [params , setParams] = useWorkflowsParams() ;

    return(
        <EntityPagination
        disabled={workflows.isFetching}
        totalpages={workflows.data.totalPages}
        page={workflows.data.page} 
        onPageChange={(page) => setParams({...params , page})}
        />
    );
 };


export const WorkflowConatiner = ({
    children 
} : {children : React.ReactNode;}) =>{
    return (
        <EntityContainer
        header={<WorkflowHeader/>}
        search  ={<WorkflowsSearch/>}
        pagination = {<WorkflowsPagination/>}
        >
            {children}
        </EntityContainer>
    )
}


export const WorkflowLoading = () => {
    return <LoadingView message='Loading Workflows...'/>
}

export const WorkflowError = () => {
    return <LoadingView message='Error loading Workflows'/>
}
 

export const WorkflowEmpty = () => {
const createWorkflow = useCreateWorkflow() ;
const {handleError , model} = useUpgradeModel() ;
const router = useRouter() ;

const handleCreate = () => {
    createWorkflow.mutate(undefined , {
        onError : (error) => {
            handleError(error) ;
        },
        onSuccess : (data) => {
            router.push(`/workflows/${data.id}`)
        }
    });
};
    return (
        <>
        {model}
        <EmptyView
        onNew={handleCreate}
        message="No workflows found . Get started by creating a workflow"
        />
        </>
    )
};



export const WorkflowItem = ({
    data ,

} : {data : Workflow}) => {
const removeWorkflow = useRemoveWrokflow() ;

const handleRemove = () => {
    removeWorkflow.mutate({id : data.id})
}

    return (
        <EntityItem 
        href={`/workflows/${data.id}`}
        title={data.name}
        subtitle={
            <>
            Updated {formatDistanceToNow(data.updatedAt , {addSuffix:true})}{" "}
            &bull; Created{" "}
            {formatDistanceToNow(data.createdAt, {addSuffix:true})}
            </>
        }
        image={
            <div className='size-8 items-center justify-center'>
                <WorkflowIcon className='size-5 text-muted-foreground'/>
            </div>
        }
        onRemove={handleRemove}
        isRemoving={removeWorkflow.isPending}
        />
    )
}


 



