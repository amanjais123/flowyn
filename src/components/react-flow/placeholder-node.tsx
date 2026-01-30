"use client";

import React, { useCallback, type ReactNode } from "react";
import {
  useReactFlow,
  useNodeId,
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import { BaseNode } from "@/components/react-flow/base-node";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
  onClick? : () => void ;
};

export function PlaceholderNode({ children , onClick}: PlaceholderNodeProps) {
  const id = useNodeId();
  const { setNodes, setEdges } = useReactFlow();


  return (
    <BaseNode
      className="bg-card w-auto border-dashed border-gray-400 p-2 text-center text-gray-400 shadow-none cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      {children}
      <Handle
        type="target"
        style={{ visibility: "hidden" }}
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        type="source"
        style={{ visibility: "hidden" }}
        position={Position.Bottom}
        isConnectable={false}
      />
    </BaseNode>
  );
}
