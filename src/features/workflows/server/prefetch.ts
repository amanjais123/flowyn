import type { inferInput } from "@trpc/tanstack-react-query";
import {prefetch , trpc} from "@/trpc/server" ;

type Input = inferInput<typeof trpc.workflows.getmany> ;

export const prefetchWorkflows = (params : Input) => {
    return prefetch(trpc.workflows.getmany.queryOptions(params)) ;
    
}
