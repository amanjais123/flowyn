"use client" ;
import { useReactFlow, type Node , type NodeProps } from "@xyflow/react";
import { GlobeIcon, Variable } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { TelegramDialog, TelegramValues } from "./dialog";
import { methodFilterToJSON } from "@polar-sh/sdk/models/operations/paymentslist.js";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchTelegramRealtimeToken } from "./actions";


type TelegramNodeData = {
 botToken?: string;
  chatId?: string;
  content?: string;
} ;


type TelegramNodeType = Node<TelegramNodeData> ;

export const TelegramNode = memo((props: NodeProps<TelegramNodeType>) => {

    const [dialogOpen , setDialogOpen] = useState(false) ;


        const nodeStatus = useNodeStatus({
            nodeId : props.id ,
            channel: "telegram-execution",
            topic : "status" ,
            refreshToken : fetchTelegramRealtimeToken ,
        }) ;


    const {setNodes} = useReactFlow() ;

const handleOpenSettings = () => setDialogOpen(true) ;

const handleSubmit = (values : TelegramValues) => {
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
        <TelegramDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
       defaultValues={nodeData}
       
            />
        <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/telegram.png"
        status={nodeStatus}
        name="telegram"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />

        </>
    )
}) ;

TelegramNode.displayName = "TelegramNode" ;