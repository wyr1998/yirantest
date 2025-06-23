import React from 'react';
import { Handle, Position } from 'reactflow';
import styled from 'styled-components';
import { Protein } from '../types';

const NodeContainer = styled.div`
  padding: 10px;
  border-radius: 5px;
  background: white;
  border: 2px solid #2196f3;
  min-width: 150px;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
  }
`;

const ProteinName = styled.div`
  font-weight: bold;
  color: #2196f3;
  text-align: center;
  margin-bottom: 5px;
`;

interface ProteinNodeProps {
  data: Protein;
}

const ProteinNode: React.FC<ProteinNodeProps> = ({ data }) => {
  const handleClick = (event: React.MouseEvent) => {
    console.log('ProteinNode clicked:', data.name);
    // Don't prevent default or stop propagation - let ReactFlow handle it
  };

  return (
    <NodeContainer onClick={handleClick}>
      <Handle type="target" position={Position.Top} />
      <ProteinName>{data.name}</ProteinName>
      <Handle type="source" position={Position.Bottom} />
    </NodeContainer>
  );
};

export default ProteinNode; 