"use client" ;
import { useReactFlow, type Node , type NodeProps } from "@xyflow/react";
import { GlobeIcon, Variable } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import {  OpenAiDialog, OpenAiFormValues } from "./dialog";
import { methodFilterToJSON } from "@polar-sh/sdk/models/operations/paymentslist.js";
import { useNodeStatus } from "../../hooks/use-node-status";
import {  fetchOpenAiRealtimeToken } from "./actions";


type OpenAiNodeData = {
    variableName? : string ;
  model? : string ;
  systemPrompt? : string ;
  userPrompt? : string ;
      credentialId? : string ;

} ;


type OpenAiNodeType = Node<OpenAiNodeData> ;

export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {

    const [dialogOpen , setDialogOpen] = useState(false) ;


        const nodeStatus = useNodeStatus({
            nodeId : props.id ,
            channel: "openAi-execution",
            topic : "status" ,
            refreshToken : fetchOpenAiRealtimeToken ,
        }) ;


    const {setNodes} = useReactFlow() ;

const handleOpenSettings = () => setDialogOpen(true) ;

const handleSubmit = (values : OpenAiFormValues) => {
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
    ? `${nodeData.model || ""} : ${nodeData.userPrompt.slice(0,50)}...`
    : "Not configured" ;


    return (
        <>
        <OpenAiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
       defaultValues={nodeData}
            />
        <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/openai.svg"
        status={nodeStatus}
        name="OpenAI"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />

        </>
    )
}) ;

OpenAiNode.displayName = "OpenAiNode" ;