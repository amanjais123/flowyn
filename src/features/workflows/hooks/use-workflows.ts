import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation"
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflow-params";

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC() ;
const [params]= useWorkflowsParams() ;
    return useSuspenseQuery(trpc.workflows.getmany.queryOptions(params)) ;
} ;


export const useCreateWorkflow = () => {

    const queryClient = useQueryClient() ;
const trpc = useTRPC() ;

return useMutation(trpc.workflows.create.mutationOptions({
    onSuccess:(data) => {
        toast.success(`Workflow ${data.name} created`) ;
        queryClient.invalidateQueries(
            trpc.workflows.getmany.queryOptions({}) ,
        );
    },

    onError:(error) => {
        toast.message(`Failed to create workflow : ${error.message}`) ;
    },
})) 

};



export const useRemoveWrokflow = () => {
    const trpc = useTRPC() ;
    const queryClient = useQueryClient() ;

    return useMutation(
        trpc.workflows.remove.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" removed`);
                queryClient.invalidateQueries(trpc.workflows.getmany.queryOptions({}));
                queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryFilter({id:data.id}) ,
                );
            }
        })
    )
}



export const useSuspenseWorkflow = (id: string) => {
    const trpc= useTRPC() ;
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({id})) ;

} ;






export const useUpdateWorkflowName = () => {

    const queryClient = useQueryClient() ;
const trpc = useTRPC() ;

return useMutation(trpc.workflows.updateName.mutationOptions({
    onSuccess:(data) => {
        toast.success(`Workflow ${data.name} updated`) ;
        queryClient.invalidateQueries(
            trpc.workflows.getmany.queryOptions({}) ,
        );
        queryClient.invalidateQueries(
            trpc.workflows.getOne.queryOptions({id : data.id}) ,
        )
    },

    onError:(error) => {
        toast.message(`Failed to Rename workflow : ${error.message}`) ;
    },
})) 

};



export const useUpdateWorkflow = () => {

    const queryClient = useQueryClient() ;
const trpc = useTRPC() ;

return useMutation(trpc.workflows.update.mutationOptions({
    onSuccess:(data) => {
        toast.success(`Workflow ${data.name} saved`) ;
        queryClient.invalidateQueries(
            trpc.workflows.getmany.queryOptions({}) ,
        );
        queryClient.invalidateQueries(
            trpc.workflows.getOne.queryOptions({id : data.id}) ,
        )
    },

    onError:(error) => {
        toast.message(`Failed to save workflow : ${error.message}`) ;
    },
})) 

};





export const useExecuteWorkflow = () => {
const trpc = useTRPC() ;

return useMutation(trpc.workflows.execute.mutationOptions({
  
    onSuccess:(data) => {
        toast.success(`Workflow ${data.name} executed`) ;
    
    },

    onError:(error) => {
        toast.message(`Failed to execute workflow : ${error.message}`) ;
    },
})) 

};