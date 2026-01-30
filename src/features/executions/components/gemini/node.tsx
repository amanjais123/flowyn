"use client" ;
import { useReactFlow, type Node , type NodeProps } from "@xyflow/react";
import { GlobeIcon, Variable } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GeminiDialog, GeminiFormValues } from "./dialog";
import { methodFilterToJSON } from "@polar-sh/sdk/models/operations/paymentslist.js";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGeminiRealtimeToken } from "./actions";


type GeminiNodeData = {
    variableName? : string ;
    credentialId? : string ;
  model? : string ;
  systemPrompt? : string ;
  userPrompt? : string ;
} ;


type GeminiNodeType = Node<GeminiNodeData> ;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {

    const [dialogOpen , setDialogOpen] = useState(false) ;


        const nodeStatus = useNodeStatus({
            nodeId : props.id ,
            channel: "gemini-execution",
            topic : "status" ,
            refreshToken : fetchGeminiRealtimeToken ,
        }) ;


    const {setNodes} = useReactFlow() ;

const handleOpenSettings = () => setDialogOpen(true) ;

const handleSubmit = (values : GeminiFormValues) => {
    setNodes((nodes) => nodes.map((node) => {
        if(node.id === props.id) {
            return {
                ...node ,
                data : {
                    ...node.data ,
                   ...values,
                }
            }

        }

        return node ;
    }))
};
   const nodeData = props.data  ;
    const description = nodeData?.userPrompt
    ? `${nodeData.model || "gemini-1.5-flash"} : ${nodeData.userPrompt.slice(0,50)}...`
    : "Not configured" ;


    return (
        <>
        <GeminiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
       defaultValues={nodeData}
       
            />
        <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/gemini.svg"
        status={nodeStatus}
        name="Gemini"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />

        </>
    )
}) ;

GeminiNode.displayName = "GeminiNode" ;