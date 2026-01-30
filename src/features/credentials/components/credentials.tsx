"use client" ;
import {formatDistanceToNow} from "date-fns"
 import React from 'react'
import { useCreateCredential, useRemoveCredential, useSuspenseCredentials } from '../hooks/use-credentials'
import  {EntityHeader, EntityContainer, EntitySearch, EntityPagination, LoadingView, EmptyView, EntityList, EntityItem  } from '@/components/entity-components';
import { useUpgradeModel } from '@/hooks/use-upgrade-model';
import { useRouter } from 'next/navigation';
import { useCredentialsParams } from '../hooks/use-credentials-params';
import { useEntitySearch } from '@/hooks/use-entity-search';
 import { CredentialType } from "@/generated/prisma/enums";
 import type { Credential } from "@/generated/prisma/client";
import Image from "next/image";



export const CredentialsSearch = () => {
    const [params , setParams] = useCredentialsParams() ;
    const {searchValue , onSearchChange} = useEntitySearch({
        params ,
        setParams ,
    }) ;
    return (
        <EntitySearch
        value={searchValue}
        onChange={onSearchChange}
        placeholder='Search Credentials'
        />
    )
}







 export const CredentialsList = () => {
const credentials = useSuspenseCredentials() ;

   return (
<EntityList
items={credentials.data.items}
getKey={(credential) => credential.id}
renderItems={(credential) => <CredentialItem data={credential}/>}
emptyView={<CredentialsEmpty/>}
/>
   )
 }

 export const CredentialsHeader = ({disabled} : {disabled? : boolean}) => {


return (

  <EntityHeader
  title='Credentials'
  description='Add and manage your credentials'
  newButtonHref="/credentials/new"
  newButtonLabel='New credentials' 
  disabled={disabled} 
  />

) ;
 }



 export const CredentialsPagination = () => {
    const credentials = useSuspenseCredentials() ;
    const [params , setParams] = useCredentialsParams() ;

    return(
        <EntityPagination
        disabled={credentials.isFetching}
        totalpages={credentials.data.totalPages}
        page={credentials.data.page} 
        onPageChange={(page) => setParams({...params , page})}
        />
    );
 };


export const CredentialsConatiner = ({
    children 
} : {children : React.ReactNode;}) =>{
    return (
        <EntityContainer
        header={<CredentialsHeader/>}
        search  ={<CredentialsSearch/>}
        pagination = {<CredentialsPagination/>}
        >
            {children}
        </EntityContainer>
    )
}


export const CredentialsLoading = () => {
    return <LoadingView message='Loading Credentials...'/>
}

export const CredentialsError = () => {
    return <LoadingView message='Error loading Credentials'/>
}
 

export const CredentialsEmpty = () => {
const router = useRouter() ;

const handleCreate = () => {
 router.push(`/credentials/new`)
};
    return (
        <EmptyView
        onNew={handleCreate}
        message="No Credentials found . Get started by adding a credential"
        />
    
    )
};


const credentialLogos : Record<CredentialType , string> = {
[CredentialType.OPENAI] : "/openai.svg" ,
[CredentialType.ANTHROPIC] : "/anthropic.svg" ,
[CredentialType.GEMINI] : "/gemini.svg" ,

} ;


export const CredentialItem = ({
    data ,

} : {data : Credential}) => {
const RemoveCredential = useRemoveCredential() ;

const handleRemove = () => {
    RemoveCredential.mutate({id : data.id})
}


const logo = credentialLogos[data.type] || "/openai.svg" ;
    return (
        <EntityItem 
        href={`/credentials/${data.id}`}
        title={data.name}
        subtitle={
            <>
            Updated {formatDistanceToNow(data.updatedAt , {addSuffix:true})}{" "}
            &bull; Created{" "}
            {formatDistanceToNow(data.createdAt, {addSuffix:true})}
            </>
        }
        image={
            <div className='flex items-center justify-center'>
                <Image src={logo} alt={data.type} width={25} height={25}/>
            </div>
        }
        onRemove={handleRemove}
        isRemoving={RemoveCredential.isPending}
        />
    )
}


 



function useSuspenseCredential() {
    throw new Error("Function not implemented.");
}

