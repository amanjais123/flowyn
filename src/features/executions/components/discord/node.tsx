"use client" ;
import { useReactFlow, type Node , type NodeProps } from "@xyflow/react";
import { GlobeIcon, Variable } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { DiscordDialog, DiscordValues } from "./dialog";
import { methodFilterToJSON } from "@polar-sh/sdk/models/operations/paymentslist.js";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchDiscordRealtimeToken } from "./actions";


type DiscordNodeData = {
    webhookUrl? : string ;
    content? : string ;
    username? : string ; 
} ;


type DiscordNodeType = Node<DiscordNodeData> ;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {

    const [dialogOpen , setDialogOpen] = useState(false) ;


        const nodeStatus = useNodeStatus({
            nodeId : props.id ,
            channel: "discord-execution",
            topic : "status" ,
            refreshToken : fetchDiscordRealtimeToken ,
        }) ;


    const {setNodes} = useReactFlow() ;

const handleOpenSettings = () => setDialogOpen(true) ;

const handleSubmit = (values : DiscordValues) => {
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
    const description = nodeData?.content
    ? `Send ${nodeData.content.slice(0,50)}...` 
    : "Not configured" ;


    return (
        <>
        <DiscordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
       defaultValues={nodeData}
       
            />
        <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/discord.svg"
        status={nodeStatus}
        name="Discord"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />

        </>
    )
}) ;

DiscordNode.displayName = "DiscordNode" ;