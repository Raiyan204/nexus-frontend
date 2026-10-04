import React, { useEffect, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  Edge,
  Node,
  Connection,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { useStore } from '../store/useStore';
import { API_BASE_URL } from '../constants/config';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 60;

// Types for API payloads
export type PersonDto = {
  id: string;
  name: string;
  email?: string;
  address?: string;
  phoneNumber?: string;
  socialMediaLinks?: string;
  comment?: string;
};

export type RelationshipDto = {
  id: string;
  sourcePerson: { id: string };
  targetPerson: { id: string };
  relationshipType: string;
};

// Helper to apply Dagre layout (top‑to‑bottom)
function applyDagreLayout(nodes: Node[], edges: Edge[]) {
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 100 });
  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
  dagre.layout(dagreGraph);
  return nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x: x - nodeWidth / 2, y: y - nodeHeight / 2 },
    };
  });
}

type Props = {
  /** Called when a node is clicked – receives the node object */
  onNodeClick?: (node: Node) => void;
};

export const NetworkGraph: React.FC<Props> = ({ onNodeClick }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  
  const { contacts, relationships } = useStore();

  const loadData = useCallback(() => {
    const loadedNodes: Node[] = contacts.map((p) => ({
      id: p.id,
      data: { label: `${p.firstName} ${p.lastName}` },
      type: "default",
      position: { x: 0, y: 0 },
    }));

    const loadedEdges: Edge[] = relationships.map((r) => ({
      id: r.id,
      source: r.sourcePerson.id,
      target: r.targetPerson.id,
      label: r.relationshipType,
      animated: false,
    }));

    const arranged = applyDagreLayout(loadedNodes, loadedEdges);
    setNodes(arranged);
    setEdges(loadedEdges);
  }, [contacts, relationships, setNodes, setEdges]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onConnect = async (connection: Connection) => {
    const newEdge: Edge = {
      id: `edge-${Date.now()}`,
      source: connection.source!,
      target: connection.target!,
      label: "relationship",
    };
    setEdges((eds) => addEdge(newEdge, eds));
    try {
      await fetch(`${API_BASE_URL}/api/relationships`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourcePersonId: connection.source,
          targetPersonId: connection.target,
          relationshipType: "Colleague",
        }),
      });
      useStore.getState().fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    if (onNodeClick) onNodeClick(node);
  };

  return (
    <div className="h-screen w-full bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};
