import type { inferInput } from "@trpc/tanstack-react-query";
import {prefetch , trpc} from "@/trpc/server" ;

type Input = inferInput<typeof trpc.credentials.getmany> ;

export const prefetchCredentials = (params : Input) => {
    return prefetch(trpc.credentials.getmany.queryOptions(params)) ;
    
};

export const prefetchCredential = (id : string) => {
    return prefetch(trpc.credentials.getOne.queryOptions({id})) ;
};

