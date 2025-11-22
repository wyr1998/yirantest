import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, { Node, NodeChange, applyNodeChanges, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import styled from 'styled-components';
import { Protein, ProteinPositions } from '../types';
import ProteinNode from '../components/ProteinNode';
import { proteinApi } from '../services/api';
import { proteinPositionService } from '../services/proteinPositionService';

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
`;

const FlowContainer = styled.div`
  flex: 1;
  height: 100%;
`;

const DetailsPanel = styled.div`
  width: 300px;
  padding: 20px;
  background: #f5f5f5;
  border-left: 1px solid #ddd;
  overflow-y: auto;
`;

const ProteinDetails = styled.div`
  h2 {
    color: #2196f3;
    margin-bottom: 10px;
  }
  p {
    margin-bottom: 15px;
    line-height: 1.5;
  }
`;

// Define nodeTypes outside the component to prevent recreation on every render
const nodeTypes = {
  protein: ProteinNode,
};

const NHEJPathway: React.FC = () => {
  const [selectedProtein, setSelectedProtein] = useState<Protein | null>(null);
  const [proteins, setProteins] = useState<Protein[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all proteins and positions in parallel
        const [allProteins, positionData] = await Promise.all([
          proteinApi.getAll(),
          proteinPositionService.getProteinPositions('NHEJ')
        ]);
        // Filter proteins where pathway is 'NHEJ'
        const proteinData = allProteins.filter(p => p.pathway === 'NHEJ');
        setProteins(proteinData);
        // Create nodes with saved positions or default positions
        const initialNodes: Node[] = proteinData.map((protein, index) => {
          const savedPosition = positionData[protein._id];
          const defaultPosition = { x: 100 + index * 200, y: 100 + index * 100 };
          return {
            id: protein._id,
            type: 'protein',
            data: protein,
            position: savedPosition || defaultPosition,
          };
        });
        setNodes(initialNodes);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Memoize edges to prevent recreation on every render
  const edges = useMemo(() => {
    const allEdges: Edge[] = proteins.flatMap((protein) =>
      protein.interactions
        .filter(interaction => proteins.some(p => p._id === interaction.targetId))
        .map((interaction) => {
          const targetProtein = proteins.find(p => p._id === interaction.targetId);
          return {
            id: `${protein._id}-${targetProtein?._id}`,
            source: protein._id,
            target: targetProtein?._id || '',
            animated: true,
            type: interaction.type,
            data: {
              description: interaction.description,
              targetModification: interaction.targetModification
            }
          };
        })
    );
    // 去重：只保留一条A-B或B-A
    const uniqueEdges: Edge[] = [];
    const seen = new Set();
    for (const edge of allEdges) {
      const key1 = `${edge.source}-${edge.target}`;
      const key2 = `${edge.target}-${edge.source}`;
      if (!seen.has(key1) && !seen.has(key2)) {
        uniqueEdges.push(edge);
        seen.add(key1);
        seen.add(key2);
      }
    }
    return uniqueEdges;
  }, [proteins]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const updatedNodes = applyNodeChanges(changes, nds);
        
        // Auto-save positions when nodes are moved
        const positionChanges = changes.filter(change => change.type === 'position');
        if (positionChanges.length > 0) {
          const newPositions: ProteinPositions = {};
          updatedNodes.forEach(node => {
            newPositions[node.id] = node.position;
          });
          
          // Debounce the save operation
          setTimeout(() => {
            proteinPositionService.saveProteinPositions('NHEJ', newPositions)
              .catch(error => {
                console.error('Failed to save positions:', error);
                if (error.message?.includes('Authentication required')) {
                  console.warn('Please log in as admin to save protein positions');
                }
              });
          }, 1000);
        }
        
        return updatedNodes;
      });
    },
    []
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Set selected protein to show details in the panel
    const clickedProtein = proteins.find(p => p._id === node.id);
    if (clickedProtein) {
      setSelectedProtein(clickedProtein);
    }
  }, [proteins]);

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Handle node double click - could open edit modal
    event.preventDefault();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <PageContainer>
      <ContentContainer>
        <FlowContainer>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            nodeTypes={nodeTypes}
            nodesDraggable={true}
            nodesConnectable={false}
            selectNodesOnDrag={false}
            fitView
            onNodesChange={onNodesChange}
          />
        </FlowContainer>
        <DetailsPanel>
          {selectedProtein ? (
            <ProteinDetails>
              <h2>{selectedProtein.name}</h2>
              <p>{selectedProtein.description}</p>
              <p><strong>Function:</strong> {selectedProtein.function}</p>
              <p><strong>UniProt ID:</strong> {selectedProtein.uniprotId}</p>
              <p><strong>Interactions:</strong> {selectedProtein.interactions.length === 0 ? 'None' : selectedProtein.interactions.map((i, idx) => {
                const target = proteins.find(p => p._id === i.targetId);
                return (
                  <span key={idx}>
                    {i.type}{target ? ` → ${target.name}` : ''}{idx < selectedProtein.interactions.length - 1 ? ', ' : ''}
                  </span>
                );
              })}</p>
            </ProteinDetails>
          ) : (
            <p>Click on a protein to see details</p>
          )}
        </DetailsPanel>
      </ContentContainer>
    </PageContainer>
  );
};

export default NHEJPathway; 