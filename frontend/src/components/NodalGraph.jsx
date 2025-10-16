import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, { useNodesState, useEdgesState, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

const NodalGraph = ({ companies, currentUserEmail }) => {
    const [selectedNode, setSelectedNode] = useState(null);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Build nodes and edges whenever companies array changes
    useEffect(() => {
        if (!companies || companies.length === 0) return;

        const newNodes = companies.map((c, i) => ({
            id: c.id.toString(),
            position: c.position || { x: i * 200, y: i * 150 },
            data: {
                label: c.name,
                email: c.email,
                produces: Array.isArray(c.produces) ? c.produces : [],
                needs: Array.isArray(c.needs) ? c.needs : [],
            },
            style: {
                background: c.email === currentUserEmail ? "red" : "#fff",
                color: "#000",
                border: "2px solid #222",
                width: 150,
                height: 50,
                borderRadius: 50,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
        }));

        const newEdges = [];
        companies.forEach((c1) => {
            companies.forEach((c2) => {
                if (
                    Array.isArray(c1.needs) &&
                    Array.isArray(c2.produces) &&
                    c1.needs.some((need) => c2.produces.includes(need))
                ) {
                    newEdges.push({
                        id: `e${c2.id}-${c1.id}`,
                        source: c2.id.toString(),
                        target: c1.id.toString(),
                        animated: true,
                        style: { stroke: "#888" },
                    });
                }
            });
        });

        setNodes(newNodes);
        setEdges(newEdges);
    }, [companies, currentUserEmail]);

    const onNodeClick = useCallback((event, node) => {
        setSelectedNode(node);
    }, []);

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                fitView
                nodesDraggable
                nodesConnectable={false}
                zoomOnScroll
                zoomOnPinch
                panOnScroll
            >
                <Background color="#aaa" gap={16} />
                <Controls />
            </ReactFlow>

            {selectedNode && (
                <div
                    style={{
                        position: "absolute",
                        left: selectedNode.position.x + 160,
                        top: selectedNode.position.y,
                        background: "#fff",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #222",
                        boxShadow: "0px 0px 8px rgba(0,0,0,0.2)",
                        zIndex: 10,
                    }}
                >
                    <strong>{selectedNode.data.label}</strong>
                    <div>Email: {selectedNode.data.email || "N/A"}</div>
                    <div>
                        Produces:{" "}
                        {Array.isArray(selectedNode.data.produces)
                            ? selectedNode.data.produces.join(", ")
                            : "N/A"}
                    </div>
                    <div>
                        Needs:{" "}
                        {Array.isArray(selectedNode.data.needs)
                            ? selectedNode.data.needs.join(", ")
                            : "N/A"}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NodalGraph;