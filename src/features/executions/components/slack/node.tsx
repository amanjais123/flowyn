"use client" ;
import { useReactFlow, type Node , type NodeProps } from "@xyflow/react";
import { GlobeIcon, Variable } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { SlackDialog, SlackValues } from "./dialog";
import { methodFilterToJSON } from "@polar-sh/sdk/models/operations/paymentslist.js";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchSlackRealtimeToken } from "./actions";


type SlackNodeData = {
    webhookUrl? : string ;
    content? : string ;
} ;


type SlackNodeType = Node<SlackNodeData> ;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {

    const [dialogOpen , setDialogOpen] = useState(false) ;


        const nodeStatus = useNodeStatus({
            nodeId : props.id ,
            channel: "slack-execution",
            topic : "status" ,
            refreshToken : fetchSlackRealtimeToken ,
        }) ;


    const {setNodes} = useReactFlow() ;

const handleOpenSettings = () => setDialogOpen(true) ;

const handleSubmit = (values : SlackValues) => {
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
        <SlackDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
       defaultValues={nodeData}
       
            />
        <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/slack.svg"
        status={nodeStatus}
        name="Slack"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />

        </>
    )
}) ;

SlackNode.displayName = "SlackNode" ;