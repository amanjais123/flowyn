import { NodeProps } from "@xyflow/react";
import {memo, useState} from "react"
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";



export const GoogleFormTrigger = memo((props : NodeProps) => {
   const [dialogOpen , setDialogOpen] = useState(false) ;

   

          const nodeStatus = useNodeStatus({
               nodeId : props.id ,
               channel: "google-form-trigger-execution",
               topic : "status" ,
               refreshToken : fetchGoogleFormTriggerRealtimeToken ,
           }) ;

   const handleOpenSettings = () => setDialogOpen(true) ;
    return (
        <>
        <GoogleFormTriggerDialog
        open={dialogOpen} onOpenChange={setDialogOpen}
        />
        <BaseTriggerNode
        {...props}
        icon="/googleform.svg"
        name="Google Form" 
         onDoubleClick={handleOpenSettings}
         onSettings={handleOpenSettings}
         status={nodeStatus}
        description=""

        />

        </>
    )
})