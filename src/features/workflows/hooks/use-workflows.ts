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