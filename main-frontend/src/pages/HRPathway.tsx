import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, { Node, NodeChange, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import styled from 'styled-components';
import { Protein, ProteinPositions } from '../types';
import ProteinNode from '../components/ProteinNode';
import { proteinService } from '../services/proteinService';
import { proteinPositionService } from '../services/proteinPositionService';

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 20px;
  background: #2196f3;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    margin: 0;
  }
`;

const ResetButton = styled.button`
  background: #ff5722;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #d84315;
  }
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

const HRPathway: React.FC = () => {
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
          proteinService.getAllProteins(),
          proteinPositionService.getProteinPositions('HR')
        ]);
        // Filter proteins where pathway is 'HR'
        const proteinData = allProteins.filter(p => p.pathway === 'HR');
        setProteins(proteinData);
        // Create nodes with saved positions or default positions
        const initialNodes: Node[] = proteinData.map((protein, index) => {
          const savedPosition = positionData[protein._id] || positionData[protein.name];
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
  const edges = useMemo(() => 
    proteins.flatMap((protein) =>
      protein.interactions
        .filter(targetName => proteins.some(p => p.name === targetName))
        .map((targetName) => {
          const targetProtein = proteins.find(p => p.name === targetName);
          return {
            id: `${protein._id}-${targetProtein?._id}`,
            source: protein._id,
            target: targetProtein?._id || '',
            animated: true,
          };
        })
    ), [proteins]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      
      // Auto-save positions when nodes are moved
      const positionChanges = changes.filter(change => change.type === 'position');
      if (positionChanges.length > 0) {
        const newPositions: ProteinPositions = {};
        nodes.forEach(node => {
          newPositions[node.id] = node.position;
        });
        
        // Debounce the save operation
        setTimeout(() => {
          proteinPositionService.saveProteinPositions('HR', newPositions)
            .catch(error => console.error('Failed to save positions:', error));
        }, 1000);
      }
    },
    [nodes]
  );

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    console.log('Node data:', node.data);
    setSelectedProtein(node.data as Protein);
  };

  const onNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
    console.log('Node double clicked:', node);
    console.log('Node data:', node.data);
    setSelectedProtein(node.data as Protein);
  };

  const handleResetPositions = async () => {
    try {
      await proteinPositionService.resetPathwayPositions('HR');
      // Reload the page to reset positions
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset positions:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <PageContainer>
      <Header>
        <h1>Homologous Recombination Pathway</h1>
        <ResetButton onClick={handleResetPositions}>
          Reset Positions
        </ResetButton>
      </Header>
      <ContentContainer>
        <FlowContainer>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            fitView
          />
        </FlowContainer>
        <DetailsPanel>
          {selectedProtein ? (
            <ProteinDetails>
              <h2>{selectedProtein.name}</h2>
              <p>{selectedProtein.description}</p>
              <p><strong>Function:</strong> {selectedProtein.function}</p>
              <p><strong>UniProt ID:</strong> {selectedProtein.uniprotId}</p>
              <p><strong>Interactions:</strong> {selectedProtein.interactions.join(', ')}</p>
            </ProteinDetails>
          ) : (
            <p>Click on a protein to see details</p>
          )}
        </DetailsPanel>
      </ContentContainer>
    </PageContainer>
  );
};

export default HRPathway; 