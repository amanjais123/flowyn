import { NodeProps } from "@xyflow/react";
import {memo, useState} from "react"
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchStripeTriggerRealtimeToken } from "./actions";



export const StripeTriggerNode = memo((props : NodeProps) => {
   const [dialogOpen , setDialogOpen] = useState(false) ;

   

          const nodeStatus = useNodeStatus({
               nodeId : props.id ,
               channel: "stripe-trigger-execution",
               topic : "status" ,
               refreshToken : fetchStripeTriggerRealtimeToken ,
           }) ;

   const handleOpenSettings = () => setDialogOpen(true) ;
    return (
        <>
        <StripeTriggerDialog
        open={dialogOpen} onOpenChange={setDialogOpen}
        />
        <BaseTriggerNode
        {...props}
        icon="/stripe.svg"
        name="Stripe" 
         onDoubleClick={handleOpenSettings}
         onSettings={handleOpenSettings}
         status={nodeStatus}
        description=""

        />

        </>
    )
})