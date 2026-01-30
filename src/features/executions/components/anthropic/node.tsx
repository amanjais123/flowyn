"use client" ;
import { useReactFlow, type Node , type NodeProps } from "@xyflow/react";
import { GlobeIcon, Variable } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import {  AnthropicDialog, AnthropicFormValues } from "./dialog";
import { methodFilterToJSON } from "@polar-sh/sdk/models/operations/paymentslist.js";
import { useNodeStatus } from "../../hooks/use-node-status";
import {  fetchAnthropicRealtimeToken } from "./actions";


type AnthropicNodeData = {
    variableName? : string ;
  model? : string ;
  credentialId? : string ;
  systemPrompt? : string ;
  userPrompt? : string ;
} ;


type AnthropicNodeType = Node<AnthropicNodeData> ;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {

    const [dialogOpen , setDialogOpen] = useState(false) ;


        const nodeStatus = useNodeStatus({
            nodeId : props.id ,
            channel: "anthropic-execution",
            topic : "status" ,
            refreshToken : fetchAnthropicRealtimeToken ,
        }) ;


    const {setNodes} = useReactFlow() ;

const handleOpenSettings = () => setDialogOpen(true) ;

const handleSubmit = (values : AnthropicFormValues) => {
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
        <AnthropicDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
       defaultValues={nodeData}
            />
        <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/anthropic.svg"
        status={nodeStatus}
        name="Anthropic"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />

        </>
    )
}) ;

AnthropicNode.displayName = "AnthropicNode" ;